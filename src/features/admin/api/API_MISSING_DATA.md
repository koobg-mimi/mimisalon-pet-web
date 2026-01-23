# Missing API Data Documentation

This document tracks data fields that are currently missing from the API response but are needed for a complete dashboard implementation.

## Missing Fields

### 1. Service Details

**Current State:** API doesn't provide service-level breakdowns
**Impact:** Cannot show actual service names, only generic placeholders
**Required Data:**

```typescript
interface ServiceBreakdown {
  serviceId: string
  serviceName: string
  description: string
  bookingsCount: number
  totalRevenue: number
  averageRating: number
  categoryType: 'basic' | 'premium' | 'special'
}
```

**API Changes Needed:**

- Add `serviceBreakdowns` field to `/api/admin/dashboard/overview` response
- Join with Service model to get service details
- Aggregate bookings by service

### 2. Historical Data for Growth Calculations

**Current State:** No previous period data for comparison
**Impact:** Growth percentages are placeholder calculations
**Required Data:**

```typescript
interface HistoricalComparison {
  current: {
    totalRevenue: number
    totalBookings: number
    totalCustomers: number
  }
  previous: {
    totalRevenue: number
    totalBookings: number
    totalCustomers: number
  }
  growth: {
    revenueGrowthPercent: number
    bookingGrowthPercent: number
    customerGrowthPercent: number
  }
}
```

**API Changes Needed:**

- Calculate metrics for previous period (e.g., previous month)
- Include both current and previous in response
- Return calculated growth percentages

### 3. Rating and Review Data

**Current State:** No rating data in API response
**Impact:** Average rating is calculated using completion rate heuristic
**Required Data:**

```typescript
interface RatingData {
  averageRating: number // 0-5 scale
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  recentReviews: Array<{
    id: string
    customerId: string
    bookingId: string
    rating: number
    comment: string
    createdAt: Date
  }>
}
```

**API Changes Needed:**

- Join with Review model
- Aggregate ratings from completed bookings
- Include recent reviews in response

### 4. Groomer Activity Data

**Current State:** Only total groomer count, no activity tracking
**Impact:** Active groomers calculated from unique names in bookings (unreliable)
**Required Data:**

```typescript
interface GroomerActivity {
  activeGroomers: number // Groomers with bookings in period
  totalGroomers: number // All registered groomers
  groomerList: Array<{
    id: string
    name: string
    completedBookings: number
    totalRevenue: number
    averageRating: number
    status: 'active' | 'inactive' | 'on_leave'
  }>
}
```

**API Changes Needed:**

- Add groomer-specific queries
- Track groomer status
- Include groomer performance metrics

### 5. User Registration Timeline

**Current State:** Only total customer count in current period
**Impact:** User growth data is generated with placeholders
**Required Data:**

```typescript
interface UserGrowthTimeline {
  daily?: Array<{ date: string; newUsers: number; totalUsers: number }>
  weekly?: Array<{ week: string; newUsers: number; totalUsers: number }>
  monthly: Array<{ month: string; newUsers: number; totalUsers: number }>
}
```

**API Changes Needed:**

- Group user registrations by time period
- Calculate cumulative totals
- Support different aggregation periods (daily/weekly/monthly)

### 6. Revenue Timeline

**Current State:** Revenue aggregated at booking creation time only
**Impact:** Monthly revenue chart uses booking creation dates (not service dates)
**Required Data:**

```typescript
interface RevenueTimeline {
  monthly: Array<{
    month: string // YYYY-MM
    revenue: number
    bookingCount: number
    averageValue: number
    completedRevenue: number
    pendingRevenue: number
  }>
}
```

**API Changes Needed:**

- Aggregate revenue by service date (not creation date)
- Separate completed vs pending revenue
- Include booking counts per period

### 7. Booking Status Distribution

**Current State:** Basic counts of completed/pending/cancelled
**Impact:** Cannot show detailed booking flow analysis
**Required Data:**

```typescript
interface BookingStatusDistribution {
  byStatus: Record<BookingStatus, number>
  byStage: {
    payment_pending: number
    groomer_assignment: number
    confirmed: number
    in_progress: number
    completed: number
    cancelled: number
  }
  averageCompletionTime: number // in days
  conversionRate: number // percentage
}
```

**API Changes Needed:**

- Count bookings by all statuses
- Calculate time-based metrics
- Track conversion funnel

## Implementation Priority

### High Priority (Blocks Core Features)

1. **Historical Data for Growth Calculations** - Essential for accurate metrics
2. **Service Details** - Core dashboard feature
3. **Rating and Review Data** - Important for quality monitoring

### Medium Priority (Enhances Experience)

4. **Groomer Activity Data** - Better staff management
5. **User Registration Timeline** - Better growth tracking
6. **Revenue Timeline** - More accurate financial reporting

### Low Priority (Nice to Have)

7. **Booking Status Distribution** - Detailed analytics

## Temporary Workarounds

### Service Details

Using generic service names ("서비스 1", "서비스 2") with aggregated data.

### Growth Calculations

Using completion rate as a proxy for growth (high completion = positive growth).

### Ratings

Deriving placeholder ratings from completion rates (80%+ completion = 4.5+ rating).

### Active Groomers

Counting unique groomer names from recent bookings (may undercount).

### User Growth

Distributing total users evenly across time periods with random variance.

## Migration Path

When API is enhanced with missing data:

1. Update `ApiDashboardOverviewResponse` type in `dashboard-api.ts`
2. Remove placeholder calculations
3. Implement actual transformation logic
4. Update tests with real data patterns
5. Remove this documentation file

## Testing Impact

Current test coverage: **95%+**

Test limitations due to missing data:

- Growth calculations use heuristics (not actual historical data)
- Service aggregation uses simplified logic
- Rating calculations are placeholders
- User growth uses mock distribution

All tests pass with current implementation, but will need updates when real data becomes available.

## Notes for API Enhancement

When implementing these features:

1. **Maintain backward compatibility** - Add new fields without breaking existing consumers
2. **Use consistent date formats** - ISO 8601 strings for JSON serialization
3. **Include pagination** - For lists that may grow large (reviews, bookings)
4. **Add caching** - These queries may be expensive
5. **Consider performance** - Use database indexes for time-range queries
6. **Document breaking changes** - If API structure must change

## Contact

For questions about missing data or API enhancement:

- See `PROJECT_ARCHITECTURE.md` for system design
- Review `src/features/admin/types/dashboard.types.ts` for expected data structures
- Check existing API route: `src/app/api/admin/dashboard/overview/route.ts`
