export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export function base64ToBlob(base64: string, mimeType: string = 'image/jpeg'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export function createFormDataFromBase64(base64: string, fileName: string = 'image.jpg'): FormData {
  const blob = base64ToBlob(base64.replace(/^data:image\/[a-z]+;base64,/, ''));
  const formData = new FormData();
  formData.append('file', blob, fileName);
  return formData;
}

export async function uploadImageToServer(
  base64: string,
  uploadUrl: string
): Promise<ImageUploadResult> {
  try {
    const formData = createFormDataFromBase64(base64);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      url: result.url || result.data?.url,
    };
  } catch (error) {
    console.error('Image upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function isValidBase64Image(base64: string): boolean {
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  return base64Regex.test(base64);
}

export function getUserAgent(): string {
  return typeof window !== 'undefined' ? window.navigator.userAgent : '';
}

export function isMobileDevice(): boolean {
  const userAgent = getUserAgent().toLowerCase();
  return /android|iphone|ipad|ipod|ios/.test(userAgent);
}

export function isAndroid(): boolean {
  return getUserAgent().toLowerCase().includes('android');
}

export function isIOS(): boolean {
  const userAgent = getUserAgent().toLowerCase();
  return /iphone|ipad|ipod|ios/.test(userAgent);
}

export function isWebView(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for React Native WebView
  return !!(window as any).ReactNativeWebView;
}
