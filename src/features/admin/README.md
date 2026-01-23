# Admin Feature Domain

## Overview

The Admin feature domain provides comprehensive administrative capabilities for the MimiSalon platform. This includes dashboard analytics, user management, booking oversight, groomer administration, and system configuration.

## Architecture

This domain follows the **feature-based architecture** pattern as defined in `PROJECT_ARCHITECTURE.md`:

```
features/admin/
├── api/                    # API client functions & helper utilities (BFF pattern)
├── state/                 # Redux slices & RTK Query API definitions
├── components/            # Domain-specific React components
│   ├── ui/               # Reusable UI components (CVA pattern)
│   └── __tests__/        # Component tests
├── hooks/                # Custom React hooks for data fetching
├── types/                # TypeScript type definitions
├── utils/                # Helper functions and formatters
└── __tests__/            # Domain-level integration tests
```

## Key Principles

### 1. **Separation of Concerns**

- **State Layer** (`state/`): RTK Query API slices for data fetching and caching
- **API Layer** (`api/`): Helper functions for data transformation (BFF pattern)
- **Components** (`components/`): Pure presentation logic, receives data via props
- **Hooks** (`hooks/`): Encapsulates RTK Query hooks with compatibility wrappers
- **Utils** (`utils/`): Stateless helper functions for formatting and calculations

### 2. **CVA Pattern for UI Components**

All card and reusable UI components follow the CVA (Class Variance Authority) pattern:

- Define variants using `cva()`
- Minimum variants: `variant` (default, compact, detailed, highlight, minimal) and `size` (sm, default, lg)
- Use `React.forwardRef` for ref forwarding
- Export both component and `componentVariants`
- Extend `HTMLAttributes` + `VariantProps`

### 3. **Type Safety**

- API responses use server-side types (e.g., `DashboardMetrics`)
- Client components use client-optimized types (e.g., `OverviewStats`)
- API adapters transform between these type systems
- Handle `Date` → `string` serialization boundaries

### 4. **Data Flow**

```
API Route (route.ts)
  ↓ Returns DashboardOverviewResponse
RTK Query Slice (state/dashboard-api-slice.ts)
  ↓ Fetches & transforms to OverviewStats using helpers from api/dashboard-api.ts
Custom Hook (hooks/use-dashboard-overview.ts)
  ↓ Wraps RTK Query with compatibility layer
Component (components/dashboard-stats-grid.tsx)
  ↓ Receives data as props
Page (app/admin/dashboard/overview/page.tsx)
  ↓ Thin wrapper orchestrating components
```

## Core Responsibilities

### Dashboard Analytics

- Real-time metrics (revenue, bookings, users, ratings)
- Historical trends (monthly revenue, user growth)
- Activity feed (recent bookings, user registrations, reviews)
- Service performance analysis

### User Management

- User listing and search
- Role-based access control (USER, GROOMER, ADMIN)
- Account verification status
- User activity monitoring

### Booking Oversight

- Booking status tracking (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- Scheduling conflicts resolution
- Payment status monitoring
- Review and rating management

### Groomer Administration

- Groomer profile management
- License verification
- Service assignment
- Performance analytics

### System Configuration

- Platform settings
- Email and SMS notification templates
- Payment gateway configuration
- Access control policies

## Testing Strategy

### Unit Tests

- **Utils tests** (`utils/__tests__/`): Test formatting, calculations, and pure functions
- **Hook tests** (`hooks/__tests__/`): Test data fetching logic with mocked API responses
- **Component tests** (`components/__tests__/`): Test rendering, user interactions, and prop handling

### Integration Tests

- **Domain tests** (`__tests__/`): Test complete user flows across components
- **API tests** (`api/__tests__/`): Test API adapters with various response scenarios

### Test Coverage Goals

- Utilities: 100% (pure functions are easily testable)
- Hooks: 90%+ (cover loading, error, success states)
- Components: 80%+ (cover key user interactions)
- API Adapters: 95%+ (critical data transformation layer)

See `TEST_SUMMARY.md` for current test coverage status.

## Component Guidelines

### Naming Conventions

- **UI Components**: PascalCase, descriptive (e.g., `StatCard`, `MetricCard`)
- **Domain Components**: Feature-specific (e.g., `DashboardStatsGrid`, `ActivityFeed`)
- **Files**: kebab-case (e.g., `stat-card.tsx`, `dashboard-stats-grid.tsx`)

### Component Structure

```tsx
// 1. Imports
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// 2. CVA Definition (for UI components)
const componentVariants = cva('base-classes', {
  variants: {
    variant: { default: '', compact: '', detailed: '', highlight: '', minimal: '' },
    size: { sm: '', default: '', lg: '' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

// 3. Props Interface
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Add custom props here
}

// 4. Component Implementation
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(componentVariants({ variant, size, className }))} {...props} />
  )
)

Component.displayName = 'Component'

// 5. Exports
export { Component, componentVariants }
```

### Icons

- Use **Lucide React** exclusively: `import { DollarSign, Users, Calendar } from 'lucide-react'`
- Avoid inline SVGs for consistency

## API Patterns

### RTK Query API Slice

```typescript
// In state/dashboard-api-slice.ts
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<OverviewStats, TimeRange>({
      query: (timeRange) => `/admin/dashboard/overview?range=${timeRange}`,
      transformResponse: (response: DashboardOverviewResponse): OverviewStats => {
        // Transform using helpers from api/dashboard-api.ts
        return transformToOverviewStats(response)
      },
      keepUnusedDataFor: 600, // 10 minutes cache
    }),
  }),
})
```

### Using Hooks

```typescript
// In hooks/use-dashboard-overview.ts (Compatibility wrapper)
export function useDashboardOverview(timeRange: TimeRange = 'month') {
  const { data: session, isPending: isSessionPending } = useSession()
  const { data, isLoading, isError, error, refetch } = useGetDashboardOverviewQuery(timeRange, {
    skip: isSessionPending || !session?.user,
  })

  // Returns TanStack Query-compatible interface
  return { data, isLoading, isError, error, refetch }
}
```

### In Components

```typescript
// In page.tsx
const { data: stats, isLoading } = useDashboardOverview(timeRange)

if (isLoading) return <LoadingSpinner />
if (!stats) return null

return <DashboardStatsGrid stats={stats} />
```

## Migration Notes

### Phase 1: Feature-based Architecture (Task #1.1-1.11)

This domain was created as part of the Admin Dashboard refactoring:

- **Before**: Single 510-line `app/admin/dashboard/overview/page.tsx` file
- **After**: Modular feature-based architecture with clear separation of concerns
- **Benefits**: Better maintainability, testability, and reusability

### Phase 2: RTK Query Migration (Task #1.9-1.15)

Migrated from TanStack Query to RTK Query for state management:

- **Before**: TanStack Query with `useQuery` hooks
- **After**: RTK Query API slices with centralized cache management
- **Benefits**:
  - Redux DevTools integration for debugging
  - Normalized cache for related data
  - Automatic request deduplication
  - Better cache invalidation control
  - Seamless integration with existing Redux store
- **Compatibility**: Maintained backward-compatible hook interface

## Sub-Features

### Breeds Management

Comprehensive breed management system for pet categories (DOG/CAT). Supports bulk breed operations, active/inactive status toggling, and real-time statistics.

#### Architecture

Follows feature-slice architecture with complete vertical slice organization:

```
features/admin/
├── api/
│   └── breeds-api.ts             # API transformation layer
├── hooks/
│   ├── use-breeds.ts             # Query hook
│   └── use-breed-mutations.ts    # Mutation hooks
├── components/
│   └── breeds/
│       ├── breed-input-form.tsx  # Left panel: bulk input form
│       ├── breed-list.tsx        # Right panel: breed list display
│       ├── breed-stats.tsx       # Bottom panel: statistics
│       └── ui/
│           └── breed-item.tsx    # Single breed item (CVA pattern)
└── types/
    └── breeds.types.ts           # Type definitions
```

#### Components

##### `BreedInputForm`

Left panel form component for bulk breed creation/update.

**Props:**

- `selectedPetType: 'DOG' | 'CAT'` - Current pet type selection
- `selectedCategory: string` - Current category selection
- `onPetTypeChange: (value: 'DOG' | 'CAT') => void` - Pet type change handler
- `onCategoryChange: (value: string) => void` - Category change handler

**Features:**

- Bulk breed input (comma-separated names)
- Auto-fill based on category/pet type selection
- Real-time validation
- Toast notifications on save

##### `BreedList`

Right panel component displaying current breeds with filtering.

**Props:**

- `breeds: Breed[]` - Full list of breeds
- `selectedPetType: 'DOG' | 'CAT'` - Current pet type filter
- `selectedCategory: string` - Current category filter

**Features:**

- Filtered breed display
- Toggle active/inactive status (silent operation)
- Delete with confirmation dialog
- Prevents deletion if pets exist
- Uses `BreedItem` component with CVA pattern

##### `BreedStats`

Bottom panel component showing breed statistics.

**Props:**

- `breeds: Breed[]` - Full list of breeds for calculations

**Features:**

- Total dog breeds count
- Total cat breeds count
- Active breeds count
- Inactive breeds count

##### `BreedItem` (ui/)

Domain-specific UI component for single breed item display.

**Pattern:** CVA (Class Variance Authority)

**Variants:**

- `variant`: default, compact, detailed, highlight, minimal
- `size`: sm, default, lg

**Props:**

- `breed: Breed` - Breed data
- `onToggle: (id: string, isActive: boolean) => void` - Toggle handler
- `onDelete: (id: string, name: string) => void` - Delete handler
- `variant?: BreedItemVariant` - Display variant
- `size?: BreedItemSize` - Size variant
- Extends `HTMLAttributes<HTMLDivElement>`

**Features:**

- Toggle button (no confirmation)
- Delete button (with confirmation)
- Pet count display
- Category badge
- Status indicator

#### RTK Query Slice

Breeds feature uses RTK Query for state management and API calls.

**Slice:** `src/features/admin/state/breeds-api-slice.ts`

**Endpoints:**

- `getBreeds` - Fetch all breeds with pet counts
- `createBreeds` - Bulk create/update breeds
- `deleteBreed` - Delete single breed
- `updateBreed` - Toggle breed active status

**Hooks:**

- `useGetBreedsQuery()` - Fetch breeds (provides 'Breeds' cache tag)
- `useCreateBreedsMutation()` - Create/update breeds (invalidates 'Breeds' tag)
- `useDeleteBreedMutation()` - Delete breed (invalidates 'Breeds' tag)
- `useUpdateBreedMutation()` - Toggle status (invalidates 'Breeds' tag)

**Cache Management:**
All mutations automatically invalidate the 'Breeds' cache tag, triggering refetch of breed data.

**Usage Example:**

```typescript
import { useGetBreedsQuery, useCreateBreedsMutation } from '@/features/admin/state/breeds-api-slice'

const { data: breeds = [], isLoading } = useGetBreedsQuery()
const [createBreeds, { isLoading: isSaving }] = useCreateBreedsMutation()
```

#### API Layer

**Note:** The separate `breeds-api.ts` file has been removed. RTK Query slice now handles API calls directly in `state/breeds-api-slice.ts`.

#### Types

##### `Breed`

Client-side breed type with string dates (post-serialization).

```typescript
interface Breed {
  id: string
  name: string
  petType: 'DOG' | 'CAT'
  category: string
  isActive: boolean
  createdAt: string // ISO string
  updatedAt: string // ISO string
  _count?: {
    pets: number
  }
}
```

##### `BreedWithCount`

Breed with guaranteed pet count.

```typescript
interface BreedWithCount extends Breed {
  _count: {
    pets: number
  }
}
```

##### `CreateBreedsInput`

Input for bulk breed creation/update.

```typescript
interface CreateBreedsInput {
  names: string[]
  petType: 'DOG' | 'CAT'
  category: string
}
```

##### `BreedsResponse`

API response from bulk creation.

```typescript
interface BreedsResponse {
  message: string
  created: number
  updated: number
  breeds: Breed[]
}
```

#### Data Flow

```
User Input (BreedInputForm)
  ↓
useSaveBreeds() hook
  ↓
breedsApi.createBreeds() - POST /api/admin/dashboard/breeds
  ↓
Database Update (Prisma)
  ↓
Query Invalidation
  ↓
useBreeds() refetch
  ↓
BreedList + BreedStats update
```

#### State Management

State is lifted to the page component for coordination between form and list:

- `selectedPetType` - Current pet type filter (DOG/CAT)
- `selectedCategory` - Current category filter
- Passed down to both `BreedInputForm` and `BreedList`

#### Testing Status

See [TEST_SUMMARY.md](./TEST_SUMMARY.md) for complete testing documentation.

**Manual Testing:** ✅ Complete (2025-11-06)

- All 18 test scenarios passed
- CRUD operations verified
- RTK Query cache invalidation working correctly
- Loading states and error handling tested
- No console errors or warnings
- Reference: MANUAL_TEST_GUIDE.md

**Automated Tests:**

- Unit Tests: ⏳ Pending (Phase 37-38)
- Integration Tests: ⏳ Pending (Phase 39)
- Target Coverage: 80%+

#### Refactoring Metrics

- **Original page:** 385 lines
- **Refactored page:** 81 lines
- **Reduction:** 79%
- **Feature components:** 4 (BreedInputForm, BreedList, BreedStats, BreedItem)
- **Hooks created:** 2 files (4 hooks total)
- **API functions:** 4 (getBreeds, createBreeds, deleteBreed, toggleBreedStatus)
- **Types defined:** 5 (Breed, BreedWithCount, CreateBreedsInput, BreedsResponse, variants)

---

## Related Documentation

- [PROJECT_ARCHITECTURE.md](../../../PROJECT_ARCHITECTURE.md) - Overall architecture principles
- [CLAUDE.md](../../../CLAUDE.md) - Development guidelines and CVA patterns
- [TEST_SUMMARY.md](./TEST_SUMMARY.md) - Current test coverage status

## Contributing

When adding new functionality to the admin domain:

1. Define types in `types/`
2. Create API adapters in `api/`
3. Build reusable UI components in `components/ui/` (with CVA)
4. Compose domain components in `components/`
5. Create data-fetching hooks in `hooks/`
6. Write comprehensive tests
7. Update this README if adding new responsibilities
