import JiraApi from 'jira-client';
import { ErrorReport, JiraIssueResponse } from '@/types/error-report';

// Jira client singleton
let jiraClient: JiraApi | null = null;

function getJiraClient(): JiraApi {
  if (!jiraClient) {
    const requiredEnvs = {
      host: process.env.JIRA_DOMAIN, // Changed from JIRA_HOST
      username: process.env.JIRA_EMAIL, // Changed from JIRA_USERNAME
      password: process.env.JIRA_API_TOKEN,
    };

    // Debug: Log environment variables (without sensitive data)
    console.log('Jira environment check:', {
      host: requiredEnvs.host ? `${requiredEnvs.host.substring(0, 10)}...` : 'missing',
      username: requiredEnvs.username ? `${requiredEnvs.username.substring(0, 5)}...` : 'missing',
      hasToken: !!requiredEnvs.password,
    });

    // Check for required environment variables
    const missingEnvs = Object.entries(requiredEnvs)
      .filter(([, value]) => !value)
      .map(([key]) => {
        if (key === 'host') return 'JIRA_DOMAIN';
        if (key === 'username') return 'JIRA_EMAIL';
        return 'JIRA_API_TOKEN';
      });

    if (missingEnvs.length > 0) {
      console.error('Missing Jira environment variables:', missingEnvs);
      throw new Error(`Missing required Jira environment variables: ${missingEnvs.join(', ')}`);
    }

    jiraClient = new JiraApi({
      protocol: 'https',
      host: requiredEnvs.host!,
      username: requiredEnvs.username!,
      password: requiredEnvs.password!,
      apiVersion: '2',
      strictSSL: true,
    });
  }

  return jiraClient;
}

/**
 * Format error report data for Jira issue description
 */
export function formatIssueDescription(errorReport: ErrorReport): string {
  let description = `h3. 문제 설명\n${errorReport.description}\n\n`;

  // Environment information
  description += `h3. 환경 정보\n`;
  description += `*Browser:* ${errorReport.metadata.browser}\n`;
  description += `*Time:* ${errorReport.metadata.timestamp}\n`;

  if (errorReport.metadata.userId) {
    description += `*User ID:* ${errorReport.metadata.userId}\n`;
  }

  if (errorReport.metadata.userName) {
    description += `*User:* ${errorReport.metadata.userName}\n`;
  }

  return description;
}

/**
 * Create a new Jira issue
 */
export async function createJiraIssue(errorReport: ErrorReport): Promise<JiraIssueResponse> {
  try {
    const client = getJiraClient();
    const projectKey = process.env.JIRA_PROJECT_KEY || 'MIM';

    // Get available issue types first
    const availableIssueTypes = await getProjectIssueTypes(projectKey);

    // Find the best issue type to use
    let issueTypeName = 'Task'; // Default fallback
    const preferredTypes = ['Bug', 'Task', 'Story', '버그', '작업', '이슈'];

    for (const preferred of preferredTypes) {
      const found = availableIssueTypes.find(
        (type: any) => type.name?.toLowerCase() === preferred.toLowerCase()
      );
      if (found) {
        issueTypeName = found.name;
        break;
      }
    }

    // If no preferred type found, use the first available one
    if (
      availableIssueTypes.length > 0 &&
      !availableIssueTypes.some((type: any) => type.name === issueTypeName)
    ) {
      issueTypeName = availableIssueTypes[0].name;
    }

    console.log(`Using issue type: ${issueTypeName} for project ${projectKey}`);

    // Generate title from description (first 50 chars)
    const title =
      errorReport.description.substring(0, 50) + (errorReport.description.length > 50 ? '...' : '');

    const issueData = {
      fields: {
        project: {
          key: projectKey,
        },
        summary: `[고객신고] ${title}`,
        description: formatIssueDescription(errorReport),
        issuetype: {
          name: issueTypeName,
        },
        labels: ['customer-feedback', 'error-report'],
      },
    };

    console.log('Creating Jira issue with data:', JSON.stringify(issueData, null, 2));
    const issue = await client.addNewIssue(issueData);

    return {
      id: issue.id,
      key: issue.key,
      self: issue.self,
      browseUrl: `https://${process.env.JIRA_HOST}/browse/${issue.key}`,
    };
  } catch (error) {
    console.error('Failed to create Jira issue:', error);
    throw new Error('Failed to create Jira issue: ' + (error as Error).message);
  }
}

/**
 * Upload images as attachments to a Jira issue using direct REST API
 */
export async function uploadAttachmentsToJira(issueKey: string, images: File[]): Promise<string[]> {
  if (!images.length) {
    console.log('No images to upload');
    return [];
  }

  console.log(`Starting upload of ${images.length} images to issue ${issueKey}`);

  const attachmentIds: string[] = [];
  const jiraDomain = process.env.JIRA_DOMAIN;
  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraToken = process.env.JIRA_API_TOKEN;

  if (!jiraDomain || !jiraEmail || !jiraToken) {
    throw new Error('Missing Jira credentials for attachment upload');
  }

  // Create basic auth header
  const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      console.log(
        `Uploading image ${i + 1}/${images.length}: ${image.name} (${image.size} bytes, ${image.type})`
      );

      // Create FormData for the attachment
      const formData = new FormData();
      formData.append('file', image, image.name);

      // Make direct REST API call to Jira
      const response = await fetch(
        `https://${jiraDomain}/rest/api/2/issue/${issueKey}/attachments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'X-Atlassian-Token': 'no-check', // Required for Jira Cloud
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status} error for ${image.name}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`Upload result for ${image.name}:`, result);

      if (Array.isArray(result) && result.length > 0) {
        attachmentIds.push(result[0].id);
        console.log(`Successfully uploaded ${image.name} with ID: ${result[0].id}`);
      } else if (result.id) {
        attachmentIds.push(result.id);
        console.log(`Successfully uploaded ${image.name} with ID: ${result.id}`);
      } else {
        console.warn(`Unexpected result format for ${image.name}:`, result);
      }
    } catch (imageError) {
      console.error(`Failed to upload image ${image.name}:`, {
        error: imageError,
        message: imageError instanceof Error ? imageError.message : 'Unknown error',
        stack: imageError instanceof Error ? imageError.stack : undefined,
      });
      // Continue with other images even if one fails
    }
  }

  console.log(`Successfully uploaded ${attachmentIds.length}/${images.length} images`);
  return attachmentIds;
}

/**
 * Create Jira issue with attachments (complete flow)
 */
export async function createIssueWithAttachments(errorReport: ErrorReport): Promise<{
  issue: JiraIssueResponse;
  attachmentIds: string[];
}> {
  // First create the issue
  const issue = await createJiraIssue(errorReport);

  // Then upload attachments if any
  let attachmentIds: string[] = [];
  if (errorReport.images && errorReport.images.length > 0) {
    attachmentIds = await uploadAttachmentsToJira(issue.key, errorReport.images);
  }

  return {
    issue,
    attachmentIds,
  };
}

/**
 * Get available issue types for a project
 */
export async function getProjectIssueTypes(projectKey: string): Promise<any[]> {
  try {
    const client = getJiraClient();
    const project = await client.getProject(projectKey);
    console.log(
      'Available issue types for project',
      projectKey + ':',
      project.issueTypes?.map((t: any) => t.name)
    );
    return project.issueTypes || [];
  } catch (error) {
    console.error('Failed to get project issue types:', error);
    return [];
  }
}

/**
 * Test Jira connection
 */
export async function testJiraConnection(): Promise<boolean> {
  try {
    console.log('Testing Jira connection...');
    const client = getJiraClient();

    // Test with a simple API call
    const user = await client.getCurrentUser();
    console.log('Jira connection successful, user:', user?.displayName || user?.name);

    // Also test project access and available issue types
    const projectKey = process.env.JIRA_PROJECT_KEY || 'MIM';
    try {
      await getProjectIssueTypes(projectKey);
    } catch (projectError) {
      console.warn('Could not access project info:', projectError);
    }

    return true;
  } catch (error) {
    console.error('Jira connection test failed with detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    return false;
  }
}
