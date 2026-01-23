'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ImageGallery({
  images,
  className,
  aspectRatio = 'square',
  columns = { mobile: 2, tablet: 3, desktop: 4 },
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex === null) return;
    const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(newIndex);
  };

  const goToNext = () => {
    if (selectedImageIndex === null) return;
    const newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(newIndex);
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  const gridCols = cn(
    'grid gap-2',
    `grid-cols-${columns.mobile || 2}`,
    `sm:grid-cols-${columns.tablet || 3}`,
    `lg:grid-cols-${columns.desktop || 4}`,
    className
  );

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Image Grid */}
      <div className={gridCols}>
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className={cn(
              'bg-muted relative overflow-hidden rounded-lg',
              'transition-all duration-200',
              'hover:scale-105 hover:shadow-lg',
              'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
              'group',
              aspectRatioClass
            )}
            aria-label={`View image ${index + 1} of ${images.length}`}
          >
            <Image
              src={image.url}
              alt={image.alt || `Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10">
              <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-white/90 p-1 backdrop-blur-sm">
                  <Expand className="h-4 w-4 text-gray-700" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="h-[90vh] w-full max-w-screen-lg overflow-hidden bg-black/95 p-0">
          {selectedImageIndex !== null && (
            <>
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 z-50 rounded-full bg-black/50 px-3 py-1 text-white">
                <span className="text-sm font-medium">
                  {selectedImageIndex + 1} / {images.length}
                </span>
              </div>

              {/* Previous Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute top-1/2 left-4 z-50 -translate-y-1/2 text-white hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* Image Container */}
              <div className="relative flex h-full w-full items-center justify-center p-8">
                <Image
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].alt || `Image ${selectedImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-h-full max-w-full object-contain"
                  unoptimized
                  priority
                />
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute top-1/2 right-4 z-50 -translate-y-1/2 text-white hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}

              {/* Thumbnail Strip (Desktop Only) */}
              {images.length > 1 && (
                <div className="absolute right-0 bottom-0 left-0 hidden bg-black/80 p-4 md:block">
                  <div className="flex max-w-full justify-center gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded',
                          'transition-all duration-200',
                          selectedImageIndex === index
                            ? 'scale-110 ring-2 ring-white'
                            : 'opacity-60 hover:opacity-100'
                        )}
                        aria-label={`Go to image ${index + 1}`}
                      >
                        <Image
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
