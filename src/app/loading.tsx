import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}
