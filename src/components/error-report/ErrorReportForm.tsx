'use client';

import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploadPreview } from './ImageUploadPreview';
import { errorReportFormSchema, getBrowserInfo } from '@/lib/validations/error-report';
import {
  ErrorReportFormData,
  ErrorReportFormProps,
  ErrorReportResult,
  ImagePreview,
  UploadProgress,
} from '@/types/error-report';
import { cn } from '@/lib/utils';

export function ErrorReportForm({
  onSubmit,
  initialData,
  disabled = false,
  className,
}: ErrorReportFormProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    stage: 'idle',
  });
  const [result, setResult] = useState<ErrorReportResult | null>(null);

  const form = useForm<ErrorReportFormData>({
    resolver: zodResolver(errorReportFormSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      description: initialData?.description || '',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = form;

  const description = watch('description');

  // Debug: Check button state
  const isButtonDisabled =
    !description || description.length < 10 || disabled || uploadProgress.isUploading;

  console.log('Form state:', {
    description: description?.length || 0,
    disabled,
    isUploading: uploadProgress.isUploading,
    isButtonDisabled,
    errors,
  });

  // Handle image changes
  const handleImagesChange = useCallback((newImages: ImagePreview[]) => {
    setImages(newImages);
  }, []);

  const handleRemoveImage = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  // Form submission
  const onFormSubmit = async (data: ErrorReportFormData) => {
    if (uploadProgress.isUploading) return;

    try {
      setUploadProgress({
        isUploading: true,
        progress: 20,
        stage: 'creating-issue',
        message: 'Jira 이슈를 생성하는 중...',
      });

      // Create FormData for submission
      const formData = new FormData();

      // Add description
      formData.append('description', data.description);

      // Add metadata
      formData.append('browserInfo', getBrowserInfo());
      formData.append('timestamp', new Date().toISOString());
      formData.append('url', window.location.href);

      // Add images
      images.forEach((image) => {
        formData.append('images', image.file);
      });

      setUploadProgress({
        isUploading: true,
        progress: images.length > 0 ? 60 : 80,
        stage: images.length > 0 ? 'uploading-images' : 'completed',
        message: images.length > 0 ? '이미지를 업로드하는 중...' : '완료 중...',
      });

      // Submit to API
      const response = await fetch('/api/error-report', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit error report');
      }

      setUploadProgress({
        isUploading: true,
        progress: 90,
        stage: 'completed',
        message: '완료 중...',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploadProgress({
        isUploading: false,
        progress: 100,
        stage: 'completed',
        message: '성공적으로 제출되었습니다!',
      });

      const successResult: ErrorReportResult = {
        success: true,
        issue: responseData.issue,
        attachmentIds: responseData.attachmentIds,
        message: responseData.message,
      };

      setResult(successResult);

      toast.success('에러 신고가 성공적으로 접수되었습니다!', {
        description: `이슈 번호: ${responseData.issue.key}`,
      });

      // Call parent callback
      onSubmit?.(successResult);
    } catch (error) {
      console.error('Error report submission failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      setUploadProgress({
        isUploading: false,
        progress: 0,
        stage: 'error',
        message: errorMessage,
      });

      const errorResult: ErrorReportResult = {
        success: false,
        error: errorMessage,
        message: '에러 신고 제출에 실패했습니다',
      };

      setResult(errorResult);

      toast.error('에러 신고 제출에 실패했습니다', {
        description: errorMessage,
      });

      onSubmit?.(errorResult);
    }
  };

  const handleRetry = useCallback(() => {
    setResult(null);
    setUploadProgress({
      isUploading: false,
      progress: 0,
      stage: 'idle',
    });
  }, []);

  // Show success state
  if (result?.success) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-xl font-semibold text-green-700">에러 신고가 접수되었습니다</h3>
          <p className="mb-4 text-gray-600">
            귀하의 신고가 성공적으로 처리되었습니다. 빠른 시일 내에 검토하겠습니다.
          </p>

          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
              <span className="font-medium">이슈 번호:</span>
              <span className="rounded bg-green-100 px-2 py-1 font-mono">{result.issue?.key}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => window.open(result.issue?.browseUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Jira에서 보기
            </Button>
            <Button onClick={() => window.location.reload()}>새 신고 작성</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>에러 신고</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload Progress */}
          {uploadProgress.isUploading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{uploadProgress.message}</p>
                  <Progress value={uploadProgress.progress} className="w-full" />
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {result?.success === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{result.message}</p>
                  <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
                    다시 시도
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              문제 설명 *
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="발생한 문제를 자세히 설명해주세요. 어떤 상황에서 발생했는지, 어떤 에러 메시지가 나타났는지 등을 포함해주세요."
              rows={6}
              disabled={disabled || uploadProgress.isUploading}
              className={cn(errors.description && 'border-red-500')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                문제를 재현하는 방법이나 예상했던 동작과 실제 동작의 차이를 포함해서 작성해주세요.
              </p>
              <p
                className={`text-xs ${description && description.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}
              >
                {description ? description.length : 0} / 2000자
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">스크린샷 (선택사항)</Label>
            <ImageUploadPreview
              images={images}
              onImagesChange={handleImagesChange}
              onRemoveImage={handleRemoveImage}
              disabled={disabled || uploadProgress.isUploading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setImages([]);
              }}
              disabled={disabled || uploadProgress.isUploading}
            >
              초기화
            </Button>

            <Button type="submit" disabled={isButtonDisabled} className="min-w-[120px]">
              {uploadProgress.isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  제출 중...
                </>
              ) : (
                '에러 신고 제출'
              )}
            </Button>
          </div>

          {/* Form Info */}
          <div className="border-t pt-4 text-xs text-gray-500">
            <p>• 에러 신고는 개발팀에서 검토 후 처리됩니다</p>
            <p>• 개인정보는 포함하지 마시고, 문제 해결에 필요한 정보만 작성해주세요</p>
            <p>• 스크린샷을 첨부하면 문제 파악에 큰 도움이 됩니다</p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
