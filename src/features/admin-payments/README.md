# Admin Payments Feature

## Overview

Admin payments feature provides comprehensive payment management functionality for administrators. This feature follows the feature-based architecture pattern defined in PROJECT_ARCHITECTURE.md.

## Components

### Payments Components

Located in `components/payments/`:

- **PaymentFilters** - Search and filter UI for payments
  - Search by payment ID, order ID, order name, booking number
  - Status filter dropdown with all payment statuses
  - Displays total count of results
- **PaymentsTable** - Payments list table with pagination
  - Displays payment info, customer, amount, status, dates
  - Receipt link for completed payments
  - Click to view details modal
  - Loading and empty states
- **PaymentDetailModal** - Detailed payment information modal
  - Comprehensive payment details
  - Booking information
  - Customer information
  - Transaction timeline with visual indicators
  - Receipt link

### UI Components

Located in `components/ui/`:

- **PaymentStatusBadge** - Status badge with color coding
  - Uses payment-status-config for consistent styling
  - Tooltip with status description
- **PaymentMethodIcon** - Payment method icon display
  - Icons for all payment methods (card, phone, wallet, etc.)
  - Fallback to credit card icon for unknown methods

## Hooks

### useAdminPayments

RTK Query wrapper for fetching payments with filters and pagination.

```tsx
const { payments, pagination, isLoading, isEmpty } = useAdminPayments({
  filters: { searchQuery: '', statusFilter: 'ALL' },
  page: 1,
  limit: 20,
})
```

**Returns:**

- `payments` - Array of payment records
- `pagination` - Pagination metadata (currentPage, totalPages, totalCount)
- `isLoading` - Initial loading state
- `isFetching` - Any loading state (including refetch)
- `isError` - Error state
- `error` - Error object
- `refetch` - Manual refetch function
- `isEmpty` - True if no results and not loading
- `hasNextPage` - True if more pages available
- `hasPreviousPage` - True if previous pages available

## State

### adminPaymentsApi

RTK Query API slice for payment operations.

```tsx
import { adminPaymentsApi, useGetPaymentsQuery } from '@/features/admin-payments/state'
```

**Endpoints:**

- `getPayments` - Get paginated list of payments with filters

**Cache Tags:**

- `Payments:LIST` - Invalidate to refetch all payment lists
- `Payments:{id}` - Invalidate to refetch specific payment
- `PaymentStats:STATS` - Invalidate to refetch statistics

**Cache Duration:** 10 minutes (600 seconds)

## Types

### AdminPaymentInfo

Client-side payment type with serialized dates (strings, not Date objects).

```tsx
import type { AdminPaymentInfo } from '@/features/admin-payments/types'
```

### PaymentFilters

Filter parameters for payment search.

```tsx
import type { PaymentFilters } from '@/features/admin-payments/types'
```

### PaymentPagination

Pagination metadata.

```tsx
import type { PaymentPagination } from '@/features/admin-payments/types'
```

## Utils

### Formatters

- **formatCurrency(amount, currency)** - Format currency amounts
- **formatDate(dateString)** - Format date strings to Korean locale
- **getPaymentMethodName(method)** - Get localized payment method name

### Configuration

- **getPaymentStatusConfig(status)** - Get status configuration
  - Returns: `{ label, color, bgColor, description }`

## Architecture

This feature follows the feature-based architecture defined in PROJECT_ARCHITECTURE.md:

- **Bottom-up dependency flow:** Database → API → State → Hooks → Components → Page
- **RTK Query for data fetching:** Admin features standard
- **Page is a thin wrapper:** Composes feature components with minimal logic
- **All domain logic contained within feature folder:** No global dependencies

## Usage Example

### In a Page Component

```tsx
'use client'

import { useState } from 'react'
import {
  PaymentFilters,
  PaymentsTable,
  PaymentDetailModal,
  useAdminPayments,
  type PaymentFilters as PaymentFiltersType,
  type AdminPaymentInfo,
} from '@/features/admin-payments'

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFiltersType>({
    searchQuery: '',
    statusFilter: 'ALL',
  })
  const [page, setPage] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentInfo | null>(null)

  const { payments, pagination, isLoading } = useAdminPayments({
    filters,
    page,
    limit: 20,
  })

  return (
    <div>
      <PaymentFilters
        filters={filters}
        onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        totalCount={pagination.totalCount}
      />

      <PaymentsTable
        payments={payments}
        isLoading={isLoading}
        onViewDetails={setSelectedPayment}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />

      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          open={!!selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
        />
      )}
    </div>
  )
}
```

## Testing

### Unit Tests

- **Formatters:** Test currency, date formatting, payment method names
- **Status Config:** Test all payment status configurations

### Integration Tests

- **API Slice:** Test cache invalidation
- **Hook:** Test filter changes, pagination

### Test Data

Mock data and MSW handlers available in `__tests__/mocks/`:

```tsx
import {
  mockPayment,
  mockPayments,
  adminPaymentsHandlers,
} from '@/features/admin-payments/__tests__/mocks'
```

## Migration Notes

This feature was migrated from:

- Global components: `src/components/table/AdminPaymentTable.tsx` (deleted)
- Global hooks: `src/hooks/useAdminPayments.ts` (deleted)
- TanStack Query → RTK Query
- Monolithic component → Feature-based components

## Future Enhancements

- Export functionality (CSV/Excel)
- Real-time payment updates (WebSocket)
- Payment statistics cards
- Refund/cancel mutations
- Advanced filtering (date range, amount range)
- Bulk operations

## References

- **Architecture:** [PROJECT_ARCHITECTURE.md](../../../PROJECT_ARCHITECTURE.md)
- **API Route:** `src/app/api/admin/payments/route.ts`
- **Redux Store:** `src/lib/redux/store.ts`
- **Reference Implementation:** `src/features/admin-reviews/`
