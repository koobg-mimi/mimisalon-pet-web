/**
 * Demo file showcasing the CVA UI components for admin reviews
 * This file demonstrates all variants and usage patterns
 * Not used in production - for documentation/testing purposes only
 */

import { ReviewStatusBadge } from './review-status-badge'
import { ReviewRatingStars } from './review-rating-stars'

export function ReviewUIComponentsDemo() {
  return (
    <div className="space-y-8 p-8">
      {/* ReviewStatusBadge Variants */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">ReviewStatusBadge Variants</h2>

        <div className="space-y-6">
          {/* Variant Showcase */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Variants (Public)</h3>
            <div className="flex flex-wrap gap-4">
              <ReviewStatusBadge isPublic={true} isFlagged={false} variant="default" />
              <ReviewStatusBadge isPublic={true} isFlagged={false} variant="compact" />
              <ReviewStatusBadge isPublic={true} isFlagged={false} variant="detailed" />
              <ReviewStatusBadge isPublic={true} isFlagged={false} variant="highlight" />
              <ReviewStatusBadge isPublic={true} isFlagged={false} variant="minimal" />
            </div>
          </div>

          {/* Size Showcase */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Sizes (Public)</h3>
            <div className="flex flex-wrap items-center gap-4">
              <ReviewStatusBadge isPublic={true} isFlagged={false} size="sm" />
              <ReviewStatusBadge isPublic={true} isFlagged={false} size="default" />
              <ReviewStatusBadge isPublic={true} isFlagged={false} size="lg" />
            </div>
          </div>

          {/* Status Showcase */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Statuses (Default Variant)</h3>
            <div className="flex flex-wrap gap-4">
              <ReviewStatusBadge isPublic={true} isFlagged={false} />
              <ReviewStatusBadge isPublic={false} isFlagged={false} />
              <ReviewStatusBadge isPublic={false} isFlagged={true} />
            </div>
          </div>

          {/* Icon Options */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">With/Without Icons</h3>
            <div className="flex flex-wrap gap-4">
              <ReviewStatusBadge isPublic={true} isFlagged={false} showIcon={true} />
              <ReviewStatusBadge isPublic={true} isFlagged={false} showIcon={false} />
            </div>
          </div>

          {/* Combined Showcase */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Combined Examples</h3>
            <div className="flex flex-wrap gap-4">
              <ReviewStatusBadge isPublic={true} isFlagged={false} variant="highlight" size="lg" />
              <ReviewStatusBadge
                isPublic={false}
                isFlagged={true}
                variant="detailed"
                size="default"
              />
              <ReviewStatusBadge isPublic={false} isFlagged={false} variant="compact" size="sm" />
            </div>
          </div>
        </div>
      </section>

      {/* ReviewRatingStars Showcase */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">ReviewRatingStars</h2>

        <div className="space-y-6">
          {/* Rating Values */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Rating Values (Default Size)</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">1 Star:</span>
                <ReviewRatingStars rating={1} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">2 Stars:</span>
                <ReviewRatingStars rating={2} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">3 Stars:</span>
                <ReviewRatingStars rating={3} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">4 Stars:</span>
                <ReviewRatingStars rating={4} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">5 Stars:</span>
                <ReviewRatingStars rating={5} />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Sizes (4 Stars)</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">Small:</span>
                <ReviewRatingStars rating={4} size="sm" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">Default:</span>
                <ReviewRatingStars rating={4} size="default" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">Large:</span>
                <ReviewRatingStars rating={4} size="lg" />
              </div>
            </div>
          </div>

          {/* With Numeric Value */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">With Numeric Value</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">Small:</span>
                <ReviewRatingStars rating={5} size="sm" showNumeric />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">Default:</span>
                <ReviewRatingStars rating={4} size="default" showNumeric />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground w-20 text-sm">Large:</span>
                <ReviewRatingStars rating={3} size="lg" showNumeric />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Usage Example */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Real-World Example</h2>
        <div className="border-border bg-card rounded-lg border p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <ReviewRatingStars rating={5} size="default" showNumeric />
            <ReviewStatusBadge isPublic={true} isFlagged={false} variant="detailed" />
          </div>
          <p className="text-muted-foreground text-sm">
            &quot;Excellent grooming service! My dog looks amazing and the staff was very
            professional.&quot;
          </p>
          <div className="text-muted-foreground mt-3 text-xs">John Doe • 2025-11-03</div>
        </div>

        <div className="border-border bg-card mt-4 rounded-lg border p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <ReviewRatingStars rating={2} size="default" showNumeric />
            <ReviewStatusBadge isPublic={false} isFlagged={true} variant="highlight" />
          </div>
          <p className="text-muted-foreground text-sm">
            &quot;Not satisfied with the service. Contains inappropriate content.&quot;
          </p>
          <div className="text-muted-foreground mt-3 text-xs">Jane Smith • 2025-11-02</div>
        </div>
      </section>
    </div>
  )
}
