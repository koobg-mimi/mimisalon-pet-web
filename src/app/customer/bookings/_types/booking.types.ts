export interface Booking {
  id: string
  bookingNumber: string
  serviceDate: string
  serviceTime: string
  status: string
  totalPrice: number
  serviceType: string
  pet?: {
    id: string
    name: string
    type: string
    breed?: {
      id: string
      name: string
    } | null
  }
  pets: Array<{
    id: string
    name: string
    type: string
    breed?: {
      id: string
      name: string
    } | null
  }>
  services: Array<{
    id: string
    name: string
    basePrice: number
  }>
  groomer: {
    id: string
    name: string
    email: string
  }
}

export interface BookingsResponse {
  bookings: Booking[]
  totalBookings: number
  totalPages: number
  page: number
  size: number
  first: boolean
  last: boolean
}
