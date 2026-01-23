// Simplified error report data structure - only description and images
export interface ErrorReport {
  description: string;
  images?: File[];
  metadata: ErrorReportMetadata;
}

// Metadata attached to error reports
export interface ErrorReportMetadata {
  browser: string;
  timestamp: string;
  url?: string;
  userId?: string;
  userName?: string;
}

// Jira issue response from API
export interface JiraIssueResponse {
  id: string;
  key: string;
  self: string;
  browseUrl: string;
}

// Simplified form state for error report
export interface ErrorReportFormData {
  description: string;
}

// Image upload preview
export interface ImagePreview {
  file: File;
  url: string;
  id: string;
}

// Error report submission result
export interface ErrorReportResult {
  success: boolean;
  issue?: JiraIssueResponse;
  attachmentIds?: string[];
  message: string;
  error?: string;
}

// Simplified error report API request
export interface ErrorReportRequest {
  description: string;
  browserInfo: string;
  timestamp: string;
  url?: string;
  userId?: string;
  userName?: string;
  images?: File[];
}

// Error report API response (success)
export interface ErrorReportApiResponse {
  success: true;
  issue: JiraIssueResponse;
  attachmentIds: string[];
  message: string;
}

// Error report API response (error)
export interface ErrorReportApiError {
  success: false;
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// Form validation error
export interface FormValidationError {
  field: string;
  message: string;
}

// Upload progress state
export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  stage: 'idle' | 'creating-issue' | 'uploading-images' | 'completed' | 'error';
  message?: string;
}

// Error report form props
export interface ErrorReportFormProps {
  onSubmit?: (result: ErrorReportResult) => void;
  initialData?: Partial<ErrorReportFormData>;
  disabled?: boolean;
  className?: string;
}

// Image upload preview props
export interface ImageUploadPreviewProps {
  images: ImagePreview[];
  onImagesChange: (images: ImagePreview[]) => void;
  onRemoveImage: (imageId: string) => void;
  disabled?: boolean;
  maxImages?: number;
  maxFileSize?: number;
  className?: string;
}

// Auto-save data structure
export interface AutoSaveData {
  formData: Partial<ErrorReportFormData>;
  timestamp: number;
  version: string;
}

// Rate limiting info
export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  limit: number;
}

// Browser environment info
export interface BrowserEnvironment {
  userAgent: string;
  language: string;
  platform: string;
  viewport: {
    width: number;
    height: number;
  };
  screen: {
    width: number;
    height: number;
  };
  timezone: string;
  cookiesEnabled: boolean;
  javaEnabled: boolean;
}

// Component state interfaces
export interface ErrorReportPageState {
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
  issueUrl?: string;
  rateLimitInfo?: RateLimitInfo;
}

// Action types for error report reducer
export type ErrorReportAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_SUCCESS'; payload: { issueUrl: string } }
  | { type: 'RESET' }
  | { type: 'SET_RATE_LIMIT'; payload: RateLimitInfo };

// Constants
export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
export const AUTO_SAVE_DELAY = 2000; // 2 seconds
export const RATE_LIMIT_PER_HOUR = 5;

// Type guards
export function isErrorReportApiResponse(
  response: ErrorReportApiResponse | ErrorReportApiError
): response is ErrorReportApiResponse {
  return response.success === true;
}

export function isErrorReportApiError(
  response: ErrorReportApiResponse | ErrorReportApiError
): response is ErrorReportApiError {
  return response.success === false;
}

export function isValidImageType(type: string): type is (typeof ALLOWED_IMAGE_TYPES)[number] {
  return ALLOWED_IMAGE_TYPES.includes(type as any);
}
