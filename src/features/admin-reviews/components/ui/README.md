# Admin Reviews - UI Components

CVA-compliant UI primitives for the admin reviews feature.

## Components

### ReviewStatusBadge

Display component for review visibility and moderation status.

**Import:**

```tsx
import { ReviewStatusBadge } from '@/features/admin-reviews/components/ui/review-status-badge'
```

**Props:**

- `isPublic: boolean` - Whether review is visible to customers
- `isFlagged: boolean` - Whether review is flagged for moderation
- `showIcon?: boolean` - Show/hide status icon (default: true)
- `variant?: "default" | "compact" | "detailed" | "highlight" | "minimal"`
- `size?: "sm" | "default" | "lg"`

**Status Logic:**

- Flagged takes precedence: `isFlagged=true` → Red "Flagged" badge with Flag icon
- Public: `isPublic=true, isFlagged=false` → Green "Public" badge with Eye icon
- Private: `isPublic=false, isFlagged=false` → Gray "Private" badge with EyeOff icon

**Examples:**

```tsx
// Public review badge
<ReviewStatusBadge isPublic={true} isFlagged={false} />

// Flagged review (takes precedence)
<ReviewStatusBadge isPublic={true} isFlagged={true} />

// Private review without icon
<ReviewStatusBadge isPublic={false} isFlagged={false} showIcon={false} />

// Large highlighted public badge
<ReviewStatusBadge
  isPublic={true}
  isFlagged={false}
  variant="highlight"
  size="lg"
/>
```

---

### ReviewRatingStars

Display component for 1-5 star ratings (read-only).

**Import:**

```tsx
import { ReviewRatingStars } from '@/features/admin-reviews/components/ui/review-rating-stars'
```

**Props:**

- `rating: number` - Rating value (1-5, automatically clamped and rounded)
- `showNumeric?: boolean` - Show numeric rating value (default: false)
- `size?: "sm" | "default" | "lg"`

**Features:**

- Displays 5 stars with filled/empty states
- Filled stars: Yellow (yellow-400)
- Empty stars: Gray outline (gray-300)
- Automatic rating clamping to 1-5 range
- Responsive sizing

**Examples:**

```tsx
// Default 4-star rating
<ReviewRatingStars rating={4} />

// Small 5-star rating with number
<ReviewRatingStars rating={5} size="sm" showNumeric />

// Large 3-star rating
<ReviewRatingStars rating={3} size="lg" />

// Handles edge cases
<ReviewRatingStars rating={4.7} /> // Rounds to 5
<ReviewRatingStars rating={0} />   // Clamps to 1
<ReviewRatingStars rating={10} />  // Clamps to 5
```

---

## Variant Reference

### ReviewStatusBadge Variants

| Variant     | Description                 | Use Case                         |
| ----------- | --------------------------- | -------------------------------- |
| `default`   | Standard badge with padding | General use in cards and lists   |
| `compact`   | Smaller text and padding    | Dense layouts, mobile views      |
| `detailed`  | Enhanced with shadow        | Detail modals, emphasis contexts |
| `highlight` | Border ring with offset     | High-priority items, alerts      |
| `minimal`   | No background or padding    | Inline text, tight layouts       |

### Size Variants (Both Components)

| Size      | Description | Icon Size | Use Case              |
| --------- | ----------- | --------- | --------------------- |
| `sm`      | Small       | 12-16px   | Compact views, mobile |
| `default` | Standard    | 16-20px   | Default usage         |
| `lg`      | Large       | 20-24px   | Headers, emphasis     |

---

## Accessibility

Both components include proper ARIA attributes:

**ReviewStatusBadge:**

- `role="status"` - Identifies as status indicator
- `aria-label="Review status: [Public|Private|Flagged]"` - Screen reader description

**ReviewRatingStars:**

- `role="img"` - Identifies as graphic
- `aria-label="Rating: X out of 5 stars"` - Descriptive text

---

## Dark Mode

Both components automatically support dark mode using Tailwind's `dark:` variants.

---

## CVA Compliance

✅ Both components follow the project's CVA pattern requirements:

- Standard variant system (variant, size)
- forwardRef implementation
- cn() utility for className merging
- displayName set
- Variants and component exported
- Comprehensive JSDoc documentation

---

## Demo

See `__demo__.tsx` for a comprehensive showcase of all variants and combinations.

To view the demo:

1. Import the demo component in a dev page
2. Run the dev server: `bun run dev`
3. Navigate to the page with the demo

---

## Integration Examples

### In ReviewCard Component:

```tsx
import { ReviewStatusBadge } from '@/features/admin-reviews/components/ui/review-status-badge'
import { ReviewRatingStars } from '@/features/admin-reviews/components/ui/review-rating-stars'
import type { AdminReviewInfo } from '@/features/admin-reviews/types/review.types'

export function ReviewCard({ review }: { review: AdminReviewInfo }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <ReviewRatingStars rating={review.rating} />
          <ReviewStatusBadge isPublic={review.isPublic} isFlagged={review.isFlagged} />
        </div>
      </CardHeader>
      <CardContent>
        <p>{review.comment}</p>
      </CardContent>
    </Card>
  )
}
```

### In ReviewDetailModal:

```tsx
<div className="mb-6 flex items-center justify-between">
  <ReviewRatingStars rating={review.rating} size="lg" showNumeric />
  <ReviewStatusBadge
    isPublic={review.isPublic}
    isFlagged={review.isFlagged}
    variant="detailed"
    size="lg"
  />
</div>
```

---

## Files

- `review-status-badge.tsx` - Status badge component (114 lines)
- `review-rating-stars.tsx` - Rating stars component (109 lines)
- `__demo__.tsx` - Demo/documentation (185 lines)
- `README.md` - This file

---

**Created:** November 3, 2025
**Phase:** 3 (CVA UI Components)
**Status:** ✅ Production Ready
