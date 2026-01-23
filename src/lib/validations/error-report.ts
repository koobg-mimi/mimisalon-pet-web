import { z } from 'zod'

// Client-side form validation schema - only description required
export const errorReportFormSchema = z.object({
  description: z
    .string()
    .min(10, '문제 설명은 최소 10자 이상이어야 합니다')
    .max(2000, '문제 설명은 2000자를 초과할 수 없습니다')
    .trim(),
})

// Server-side validation schema with metadata
export const errorReportSchema = z.object({
  description: z
    .string()
    .min(10, '문제 설명은 최소 10자 이상이어야 합니다')
    .max(2000, '문제 설명은 2000자를 초과할 수 없습니다')
    .trim(),

  // Metadata fields (auto-filled)
  browserInfo: z.string(),
  timestamp: z.string(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  url: z.string().optional(),
})

// Server-side validation schema with file validation
export const errorReportServerSchema = errorReportSchema.extend({
  // Images will be validated separately as FormData
  hasImages: z.boolean().optional(),
  imageCount: z.number().min(0).max(5, '최대 5개의 이미지까지 업로드할 수 있습니다').optional(),
})

// Image file validation
export const imageFileSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, '이미지 크기는 10MB를 초과할 수 없습니다'), // 10MB limit
  type: z
    .string()
    .refine(
      (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type),
      '지원하지 않는 이미지 형식입니다. JPEG, PNG, GIF, WebP만 업로드 가능합니다'
    ),
})

// API response schemas
export const jiraIssueResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
  self: z.url(),
  browseUrl: z.url(),
})

export const errorReportApiResponseSchema = z.object({
  success: z.boolean(),
  issue: jiraIssueResponseSchema,
  attachmentIds: z.array(z.string()),
  message: z.string(),
})

export const errorReportApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      })
    )
    .optional(),
})

// Type inference helpers
export type ErrorReportFormInput = z.infer<typeof errorReportFormSchema>
export type ErrorReportInput = z.infer<typeof errorReportSchema>
export type ErrorReportServerInput = z.infer<typeof errorReportServerSchema>
export type ImageFile = z.infer<typeof imageFileSchema>
export type JiraIssueResponse = z.infer<typeof jiraIssueResponseSchema>
export type ErrorReportApiResponse = z.infer<typeof errorReportApiResponseSchema>
export type ErrorReportApiError = z.infer<typeof errorReportApiErrorSchema>

// Validation helper functions
export function validateImages(files: File[]): { valid: File[]; errors: string[] } {
  const valid: File[] = []
  const errors: string[] = []

  if (files.length > 5) {
    errors.push('최대 5개의 이미지까지 업로드할 수 있습니다')
    return { valid, errors }
  }

  for (const file of files) {
    try {
      imageFileSchema.parse({
        name: file.name,
        size: file.size,
        type: file.type,
      })
      valid.push(file)
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`${file.name}: ${error?.message}`)
      } else {
        errors.push(`${file.name}: 유효하지 않은 파일입니다`)
      }
    }
  }

  return { valid, errors }
}

// Browser info detection helper
export function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Unknown'

  const { userAgent } = navigator
  const { innerWidth, innerHeight } = window

  let browser = 'Unknown'
  let os = 'Unknown'

  // Browser detection
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome'
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Edg')) browser = 'Edge'

  // OS detection
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS')) os = 'iOS'

  return `${browser} on ${os} (${innerWidth}x${innerHeight})`
}

// Utility function to clean optional fields
export function cleanErrorReportData(data: ErrorReportInput): ErrorReportInput {
  const cleaned = { ...data }

  // Convert empty strings to undefined for optional fields
  if (cleaned.url === '') cleaned.url = undefined

  return cleaned
}
