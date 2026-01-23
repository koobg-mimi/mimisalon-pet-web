# Booking Feature

**Pet Grooming Booking System - 4-Step Wizard Process**

## 📋 Overview

MimiSalon's booking feature provides a 4-step wizard interface for users to book pet grooming services. It uses Redux
Toolkit for state management and ensures idempotent booking creation for a reliable booking experience.

### Key Features

- **4-Step Wizard Process**: Pet selection → Address selection → Date/Groomer selection → Payment
- **Redux State Management**: Centralized management of complex form state
- **Idempotency Guarantee**: Prevents duplicate bookings and enables safe retries
- **Real-time Availability**: Real-time timeslot checking when selecting date/groomer
- **Integrated Payment**: PortOne payment integration
- **Mobile Optimized**: Responsive UI with step-by-step scroll optimization

## 🏗️ Architecture

### Booking Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      BookingWizard                          │
│  (Main orchestrator - 4-step wizard coordination)           │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─► Step 1: PetSelectionStep
             │   └─► Selectable pet cards with service selection
             │       ├─► ServiceSelector (per pet)
             │       └─► ServiceOptionSelector (additional options)
             │
             ├─► Step 2: AddressSelectionStep
             │   └─► Address cards with default selection
             │
             ├─► Step 3: DateTimeGroomerStep
             │   ├─► DatePicker (calendar selection)
             │   ├─► GroomerCard list (paginated)
             │   ├─► TimeSlotPicker (available slots)
             │   └─► Special requests textarea
             │
             └─► Step 4: PaymentStep
                 └─► PortOne payment integration
                     ├─► Payment initialization
                     └─► Payment confirmation/redirect
```

### State Management Architecture

```
Redux Store (booking slice)
├─── formData: BookingForm
│    ├─── petServices: PetServiceSelection[]
│    ├─── addressId: string
│    ├─── groomerId: string
│    ├─── date: string
│    ├─── timeSlot: string
│    └─── specialRequests: string
│
├─── currentStep: 1 | 2 | 3 | 4
├─── isCreating: boolean
├─── isInitializingPayment: boolean
├─── selectedBookingId: string | null
├─── paymentId: string | null
└─── currentGroomerPage: number

Async Thunks
├─── initializeBooking (POST /api/bookings/initialize)
├─── initializePayment (POST /api/payments/initialize)
└─── cancelBooking (POST /api/bookings/:id/cancel)
```

## 📁 Directory Structure

```
src/features/booking/
├── api/                              # API layer (BFF pattern)
│   ├── booking-api.ts                # Main booking API client
│   ├── booking-query-api.ts          # TanStack Query integration
│   └── __tests__/
│       └── booking-api.test.ts
│
├── components/                       # React components
│   ├── booking-wizard.tsx            # Main wizard orchestrator
│   ├── pet-selection-step.tsx        # Step 1: Pet & service selection
│   ├── address-selection-step.tsx    # Step 2: Address selection
│   ├── datetime-groomer-step.tsx     # Step 3: Date/groomer/time selection
│   ├── payment-step.tsx              # Step 4: Payment processing
│   ├── ui/                           # Reusable UI components
│   │   ├── groomer-card.tsx          # Groomer display card
│   │   ├── selectable-pet-card.tsx   # Pet selection card
│   │   ├── service-selector.tsx      # Service selection UI
│   │   ├── service-option-selector.tsx # Additional options UI
│   │   └── time-slot-picker.tsx      # Time slot selection
│   └── __tests__/
│       ├── pet-selection-step.test.tsx
│       ├── address-selection-step.test.tsx
│       ├── datetime-groomer-step.test.tsx
│       └── payment-step.test.tsx
│
├── hooks/                            # Custom React hooks
│   ├── use-booking-form.ts           # Form state management hook
│   ├── use-booking-steps.ts          # Step navigation hook
│   └── __tests__/
│       ├── use-booking-form.test.tsx
│       └── use-booking-steps.test.tsx
│
├── state/                            # Redux state management
│   ├── booking-slice.ts              # Redux Toolkit slice
│   └── __tests__/
│       └── booking-slice.test.ts
│
├── types/                            # TypeScript type definitions
│   └── booking-form.types.ts         # Form and state types
│
├── utils/                            # Utility functions
│   ├── booking-calculations.ts       # Price/duration calculations
│   ├── booking-validation.ts         # Form validation logic
│   └── __tests__/
│       ├── booking-calculations.test.ts
│       └── booking-validation.test.ts
│
├── stories/                          # Storybook stories
│   └── time-slot-picker.stories.tsx
│
├── __tests__/                        # Shared test utilities
│   └── fixtures.ts                   # Test data fixtures
│
└── README.md                         # This file
```

## 🔑 Key Components

### BookingWizard

Main orchestrator component that manages the 4-step booking process.

**Location**: `components/booking-wizard.tsx`

**Responsibilities**:

- Step navigation and state coordination
- Data fetching and loading states
- Validation and error handling
- Payment initialization and success handling

**Key Props**:

```typescript
interface BookingWizardProps {
  pets: Pet[] // User's pets
  profile: UserResponse // User profile (for phone verification)
}
```

### Step Components

#### PetSelectionStep (Step 1)

- Multi-pet selection with service/option configuration per pet
- Visual feedback for selection state
- Service price and duration display

#### AddressSelectionStep (Step 2)

- Saved address display with default selection
- Add new address flow integration
- Address validation

#### DateTimeGroomerStep (Step 3)

- Calendar-based date selection
- Paginated groomer list with availability
- Real-time timeslot availability checking
- Special requests input

#### PaymentStep (Step 4)

- Order summary display
- PortOne payment widget integration
- Payment status handling and redirection

## 🔧 State Management

### Redux Slice: `booking-slice.ts`

**Actions**:

```typescript
// Pet selection
togglePet(pet) // Select/deselect pet
updateServices(petId, services) // Update pet's services
updateOptions(petId, options) // Update pet's options

// Form data
updateAddress(addressId) // Select address
updateDate(date) // Select date (resets time/groomer)
updateGroomer(groomerId) // Select groomer (resets time)
updateTimeSlot(timeSlot) // Select time slot
updateSpecialRequests(text) // Update special requests

// Navigation
nextStep() // Move to next step
prevStep() // Move to previous step
goToStep(step) // Jump to specific step

// Misc
updateGroomerPage(page) // Update groomer pagination
setPaymentId(paymentId) // Set payment ID after initialization
resetForm() // Reset entire form state
```

**Async Thunks**:

```typescript
initializeBooking(request) // Create/retrieve booking (idempotent)
initializePayment(request) // Initialize payment for booking
cancelBooking(bookingId, reason) // Cancel existing booking
```

### Custom Hooks

#### `useBookingForm()`

Provides form data and update handlers with Redux integration.

```typescript
const {
  formData, // Current form state
  handleAddressChange, // (addressId: string) => void
  handleDateChange, // (date: string) => void
  handleGroomerChange, // (groomerId: string) => void
  handleTimeSlotChange, // (timeSlot: string) => void
  handleSpecialRequestsChange, // (text: string) => void
} = useBookingForm()
```

#### `useBookingSteps()`

Manages step navigation with Redux integration.

```typescript
const {
  currentStep, // 1 | 2 | 3 | 4
  handleNextStep, // () => void
  handlePrevStep, // () => void
  goToStep, // (step: BookingStep) => void
} = useBookingSteps()
```

## 🌐 API Layer (BFF Pattern)

### Backend-For-Frontend Approach

The `booking-api.ts` module follows the BFF (Backend-For-Frontend) pattern:

- Transforms server responses to frontend-friendly formats
- Pre-formats dates, currencies, and display text
- Merges multiple API calls when beneficial
- Provides type-safe API interfaces

**Key Functions**:

```typescript
// Initialize booking with idempotency key (prevents duplicates)
bookingApi.initializeBooking(request
:
InitializeBookingRequest
)
→ {
  bookingId, isExisting, status
}

// Initialize payment for booking
bookingApi.initializePayment(request
:
InitializePaymentRequest
)
→ {
  paymentId, portonePaymentId
}

// Get booking details (pre-formatted)
bookingApi.getBooking(bookingId
:
string
)
→ BookingDetails(
with formattedDate, formattedPrice, etc.)

// Get booking list (pre-formatted with pagination)
  bookingApi.getBookings(filters ? : BookingListFilters)
  → {
  bookings: BookingDetails[], pagination
}

// Cancel booking
bookingApi.cancelBooking(bookingId
:
string, reason ? : string
)
→ void

// Update booking status
  bookingApi.updateBookingStatus(bookingId
:
string, status
:
string
)
→ void
```

### TanStack Query Integration

`booking-query-api.ts` provides React Query hooks for data fetching:

```typescript
// Auto-refetching, caching, and error handling included
useBookingQuery(bookingId)
useBookingsQuery(filters)
useBookingMutation()
```

## ✅ Validation

### Step Validation: `booking-validation.ts`

```typescript
// Check if can proceed to next step
canProceedToNextStep(step
:
BookingStep, formData
:
BookingForm
)
→ boolean

// Get validation error message for current step
getValidationMessage(step
:
BookingStep, formData
:
BookingForm, pets
:
Pet[]
)
→ string

// Check if pet has services selected
hasPetServices(petId
:
string, formData
:
BookingForm
)
→ boolean

// Check if pet is selected
isPetSelected(petId
:
string, formData
:
BookingForm
)
→ boolean
```

**Validation Rules**:

- **Step 1**: At least one pet selected, all selected pets must have ≥1 service
- **Step 2**: Address must be selected
- **Step 3**: Date, groomer, and time slot must all be selected
- **Step 4**: No validation (payment UI handles validation)

## 💰 Price & Duration Calculations

### Calculation Utils: `booking-calculations.ts`

```typescript
// Calculate total price for all pets and services
calculateTotalPrice(formData
:
BookingForm, pets
:
Pet[]
)
→ number

// Calculate total duration for all services
calculateTotalDuration(formData
:
BookingForm
)
→ number(minutes)

// Calculate price for specific pet
calculatePetPrice(petService
:
PetServiceSelection
)
→ number
```

**Calculation Logic**:

- **Services**: Sum of all selected services per pet
- **Options**: Sum of all selected additional options per pet
- **Total**: Sum across all pets

## 🧪 Testing Strategy

### Test Coverage

- ✅ **Components**: All step components tested with user interactions
- ✅ **Hooks**: Form and navigation hooks tested with Redux mock
- ✅ **Redux**: Actions, reducers, and async thunks fully tested
- ✅ **Utils**: Validation and calculation logic tested exhaustively
- ✅ **API**: API client tested with mock fetch responses

### Test Files

```
__tests__/
├── fixtures.ts                    # Shared test data
components/__tests__/
├── pet-selection-step.test.tsx
├── address-selection-step.test.tsx
├── datetime-groomer-step.test.tsx
└── payment-step.test.tsx
hooks/__tests__/
├── use-booking-form.test.tsx
└── use-booking-steps.test.tsx
state/__tests__/
└── booking-slice.test.ts
utils/__tests__/
├── booking-calculations.test.ts
└── booking-validation.test.ts
api/__tests__/
└── booking-api.test.ts
```

### Running Tests

```bash
# Run all booking tests
bun test booking

# Run specific test file
bun test booking-wizard

# Run with coverage
bun test --coverage booking
```

## 🔐 Security & Best Practices

### Idempotency

Booking creation uses **idempotency key** to prevent duplicate requests:

```typescript
const idempotencyKey = `booking-${nanoid()}`
await bookingApi.initializeBooking({ idempotencyKey, ...data })
```

The server detects identical idempotency keys and returns existing bookings.

### Phone Number Validation

Phone number verification is mandatory before payment:

```typescript
const customerPhone = profile?.phoneNumber?.trim()
if (!customerPhone) {
  alert('Please register your phone number in profile to proceed with payment.')
  router.push('/profile')
  return
}
```

### Mobile UX Optimization

Scroll to top on step transitions for improved mobile experience:

```typescript
window.scrollTo({ top: 0, behavior: 'smooth' })
```

## 📱 Responsive Design

- **Mobile-first**: All components designed from mobile up
- **Touch optimized**: Adequate touch areas and spacing
- **Step-by-step display**: One step at a time to reduce cognitive load
- **Progress indicator**: Visual indication of current progress (to be added)

## 🚀 Performance Optimization

### Data Fetching Strategy

```typescript
// Parallel data fetching with React Query
const {
  savedAddresses, // Fetched immediately
  timeSlots, // Fetched when date + address selected
  groomers, // Fetched when date selected
  groomerPagination, // Pagination metadata
} = useBookingData({
  date: formData.date,
  addressId: formData.addressId,
  currentPage: currentGroomerPage,
  enabled: !!profile,
})
```

### Pagination

Groomer list uses pagination to prevent loading large datasets:

- Default page size: 10 groomers
- Client-side page state management via Redux
- Optimistic UI updates

## 🐛 Error Handling

### Booking Conflicts

```typescript
try {
  await bookingApi.initializeBooking(request)
} catch (error: any) {
  if (error.code === 'BOOKING_CONFLICT') {
    alert(error.message || 'Selected timeslot is already booked')
  } else {
    alert(error.message || 'Failed to create booking')
  }
}
```

### Payment Errors

```typescript
const handlePaymentError = useCallback((error: string) => {
  console.error('Payment error:', error)
  // Error is displayed by PortOne payment widget
}, [])
```

### Existing Booking Handling

When idempotency key returns existing booking:

```typescript
if (bookingResult.isExisting && bookingResult.status !== 'FIRST_PAYMENT_PENDING') {
  // Already processed, redirect to confirmation
  router.push(`/booking/${newBookingId}/confirmation`)
  return null
}
```

## 🔄 State Persistence

Redux state is automatically persisted to **session storage** (Redux Persist configuration):

- Form data maintained on page refresh
- State restored when returning from interrupted payment
- State cleared on tab close (session storage characteristic)

## 🔮 Future Enhancements

- [ ] **Progress Indicator**: Visual step progress bar
- [ ] **Draft Saving**: Save incomplete bookings as drafts
- [ ] **Booking Modification**: Edit existing pending bookings
- [ ] **Multi-Date Booking**: Book multiple dates at once
- [ ] **Groomer Favorites**: Save preferred groomers
- [ ] **Service Packages**: Pre-configured service bundles
- [ ] **Recurring Bookings**: Schedule regular appointments
- [ ] **Waitlist**: Join waitlist for fully booked time slots

---

**Last Updated**: 2025-10-29
**Maintainer**: MimiSalon Development Team
