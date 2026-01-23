import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface UploadProgress {
  [filename: string]: number
}

interface UploadResult {
  url: string
  filename: string
  size: number
  mimeType: string
}

interface UseGcsUploadOptions {
  maxFileSize?: number
  allowedTypes?: string[]
  onProgress?: (filename: string, progress: number) => void
  onComplete?: (results: UploadResult[]) => void
  onError?: (error: Error) => void
}

export function useGcsUpload(options: UseGcsUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress>({})
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([])

  const uploadToGcs = useCallback(
    async (uploadUrl: string, fields: Record<string, string>, file: File): Promise<void> => {
      const formData = new FormData()

      // Add all fields from signed URL
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Add the file last (important for GCS)
      formData.append('file', file)

      // Use XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            setProgress((prev) => ({
              ...prev,
              [file.name]: percentComplete,
            }))
            options.onProgress?.(file.name, percentComplete)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress((prev) => ({
              ...prev,
              [file.name]: 100,
            }))
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'))
        })

        xhr.open('POST', uploadUrl)
        xhr.send(formData)
      })
    },
    [options]
  )

  const uploadFiles = useCallback(
    async (
      files: File[],
      getUploadUrls: (files: { filename: string; contentType: string }[]) => Promise<{
        uploadUrls?: Array<{
          originalFilename: string
          gcsFilename: string
          uploadUrl: string
          fields: Record<string, string>
          publicUrl: string
        }>
        fallbackToBase64?: boolean
      }>,
      confirmUploads: (data: {
        uploadedFiles?: Array<{
          gcsFilename: string
          originalFilename: string
          mimeType: string
          size: number
        }>
        base64Images?: Array<{
          base64Data: string
          filename: string
          mimeType: string
          size: number
        }>
      }) => Promise<{ images: UploadResult[] }>
    ): Promise<UploadResult[]> => {
      setIsUploading(true)
      setProgress({})
      setUploadedFiles([])

      try {
        // Validate files
        const validFiles = files.filter((file) => {
          if (options.maxFileSize && file.size > options.maxFileSize) {
            toast.error(`${file.name} is too large`)
            return false
          }
          if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
            toast.error(`${file.name} has invalid type`)
            return false
          }
          return true
        })

        if (validFiles.length === 0) {
          throw new Error('No valid files to upload')
        }

        // Get signed URLs
        const fileData = validFiles.map((file) => ({
          filename: file.name,
          contentType: file.type,
        }))

        const { uploadUrls, fallbackToBase64 } = await getUploadUrls(fileData)

        let results: UploadResult[] = []

        // Use GCS if available
        if (uploadUrls && uploadUrls.length > 0) {
          // Upload files to GCS
          const uploadPromises = uploadUrls.map(async (urlData, index) => {
            const file = validFiles[index]
            await uploadToGcs(urlData.uploadUrl, urlData.fields, file)
            return {
              gcsFilename: urlData.gcsFilename,
              originalFilename: urlData.originalFilename,
              mimeType: file.type,
              size: file.size,
            }
          })

          const uploadedFileData = await Promise.all(uploadPromises)

          // Confirm uploads
          const response = await confirmUploads({
            uploadedFiles: uploadedFileData,
          })
          results = response.images
        }
        // Fallback to base64
        else if (fallbackToBase64) {
          const base64Images = await Promise.all(
            validFiles.map(async (file) => {
              const bytes = await file.arrayBuffer()
              const base64Data = Buffer.from(bytes).toString('base64')
              return {
                base64Data,
                filename: file.name,
                mimeType: file.type,
                size: file.size,
              }
            })
          )

          const response = await confirmUploads({ base64Images })
          results = response.images
        } else {
          throw new Error('Upload service not available')
        }

        setUploadedFiles(results)
        options.onComplete?.(results)
        return results
      } catch (error) {
        console.error('Upload error:', error)
        const err = error instanceof Error ? error : new Error('Upload failed')
        options.onError?.(err)
        toast.error(err.message)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [uploadToGcs, options]
  )

  // Upload files via server using FormData (preferred method)
  const uploadViaServer = useCallback(
    async (files: File[], serverEndpoint: string): Promise<UploadResult[]> => {
      setIsUploading(true)
      setProgress({})
      setUploadedFiles([])

      try {
        // Validate files
        const validFiles = files.filter((file) => {
          if (options.maxFileSize && file.size > options.maxFileSize) {
            toast.error(`${file.name} is too large`)
            return false
          }
          if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
            toast.error(`${file.name} has invalid type`)
            return false
          }
          return true
        })

        if (validFiles.length === 0) {
          throw new Error('No valid files to upload')
        }

        const formData = new FormData()

        // Add all files to FormData
        validFiles.forEach((file) => {
          formData.append('files', file)
        })

        // Use XMLHttpRequest for progress tracking
        const results = await new Promise<UploadResult[]>((resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100
              // Update progress for all files
              validFiles.forEach((file) => {
                setProgress((prev) => ({
                  ...prev,
                  [file.name]: percentComplete,
                }))
                options.onProgress?.(file.name, percentComplete)
              })
            }
          })

          xhr.addEventListener('load', async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText)

                // Complete progress for all files
                validFiles.forEach((file) => {
                  setProgress((prev) => ({
                    ...prev,
                    [file.name]: 100,
                  }))
                  options.onProgress?.(file.name, 100)
                })

                resolve(response.images || [])
              } catch {
                reject(new Error('Invalid server response'))
              }
            } else {
              try {
                const error = JSON.parse(xhr.responseText)
                reject(new Error(error.error || `Upload failed with status ${xhr.status}`))
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`))
              }
            }
          })

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'))
          })

          xhr.open('POST', serverEndpoint)
          xhr.send(formData)
        })

        setUploadedFiles(results)
        options.onComplete?.(results)
        return results
      } catch (error) {
        console.error('Server upload error:', error)
        const err = error instanceof Error ? error : new Error('Upload failed')
        options.onError?.(err)
        toast.error(err.message)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [options]
  )

  // Upload files via server proxy using Base64 (WebView fallback)
  const uploadViaServerProxy = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      setIsUploading(true)
      setProgress({})
      setUploadedFiles([])

      try {
        // Validate files
        const validFiles = files.filter((file) => {
          if (options.maxFileSize && file.size > options.maxFileSize) {
            toast.error(`${file.name} is too large`)
            return false
          }
          if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
            toast.error(`${file.name} has invalid type`)
            return false
          }
          return true
        })

        if (validFiles.length === 0) {
          throw new Error('No valid files to upload')
        }

        const uploadPromises = validFiles.map(async (file) => {
          // Convert file to Base64
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })

          // Update progress
          setProgress((prev) => ({
            ...prev,
            [file.name]: 50, // Start at 50% for Base64 conversion
          }))

          // Upload via server proxy
          const response = await fetch('/api/groomer/profile/image/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageData: base64Data,
              filename: file.name,
              mimeType: file.type,
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Upload failed')
          }

          const result = await response.json()

          // Complete progress
          setProgress((prev) => ({
            ...prev,
            [file.name]: 100,
          }))
          options.onProgress?.(file.name, 100)

          return {
            url: result.imageUrl,
            filename: file.name,
            size: file.size,
            mimeType: file.type,
          }
        })

        const results = await Promise.all(uploadPromises)
        setUploadedFiles(results)
        options.onComplete?.(results)
        return results
      } catch (error) {
        console.error('Server proxy upload error:', error)
        const err = error instanceof Error ? error : new Error('Upload failed')
        options.onError?.(err)
        toast.error(err.message)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [options]
  )

  // Smart upload function that prioritizes server uploads
  const smartUpload = useCallback(
    async (
      files: File[],
      serverEndpoint?: string,
      getUploadUrls?: (files: { filename: string; contentType: string }[]) => Promise<{
        uploadUrls?: Array<{
          originalFilename: string
          gcsFilename: string
          uploadUrl: string
          fields: Record<string, string>
          publicUrl: string
        }>
        fallbackToBase64?: boolean
      }>,
      confirmUploads?: (data: {
        uploadedFiles?: Array<{
          gcsFilename: string
          originalFilename: string
          mimeType: string
          size: number
        }>
        base64Images?: Array<{
          base64Data: string
          filename: string
          mimeType: string
          size: number
        }>
      }) => Promise<{ images: UploadResult[] }>
    ): Promise<UploadResult[]> => {
      // Prioritize server upload if endpoint is provided
      if (serverEndpoint) {
        console.log('🚀 Using server upload (preferred method)')
        return uploadViaServer(files, serverEndpoint)
      }

      // Fallback to direct GCS upload for backward compatibility
      if (getUploadUrls && confirmUploads) {
        console.log('🌐 Using direct GCS upload for browser environment')
        return uploadFiles(files, getUploadUrls, confirmUploads)
      }

      throw new Error('No upload configuration provided')
    },
    [uploadFiles, uploadViaServer]
  )

  const reset = useCallback(() => {
    setProgress({})
    setUploadedFiles([])
  }, [])

  return {
    uploadFiles,
    uploadViaServer,
    uploadViaServerProxy,
    smartUpload,
    isUploading,
    progress,
    uploadedFiles,
    reset,
  }
}
