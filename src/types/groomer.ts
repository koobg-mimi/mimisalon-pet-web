/**
 * Type definitions for groomer dashboard and overview functionality
 */

export interface GroomerBookingItem {
  id: string;
  time: string;
  customer: {
    name: string;
  };
  pet: {
    name: string;
    breed: string | null;
  };
  service: {
    name: string;
    duration: number;
  };
}

export interface GroomerReviewItem {
  id: string;
  rating: number;
  content: string | null;
  customer: {
    name: string;
  };
  createdAt: string;
}

export interface PendingBooking {
  id: string;
  bookingNumber: string;
  serviceDate: string;
  serviceTime: string;
  estimatedDurationMinutes: number;
  customer: {
    name: string;
    phone?: string;
    address?: string;
  };
  pets: Array<{
    name: string;
    breed?: string;
    services: Array<{
      name: string;
      price: number;
    }>;
    options: Array<{
      name: string;
      price: number;
    }>;
  }>;
  totalPrice: number;
  specialRequests?: string;
}

export interface GroomerOverviewStats {
  todayBookings: number;
  weeklyBookings: number;
  monthlyRevenue: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  upcomingBookings: GroomerBookingItem[];
  pendingBookings: PendingBooking[];
  recentReviews: GroomerReviewItem[];
}

export interface GroomerDashboardMetrics {
  totalBookingsCompleted: number;
  totalBookingsThisMonth: number;
  avgRating: number;
  totalReviewCount: number;
  monthlyEarnings: number;
}

export interface GroomerAvailabilitySlot {
  id: string;
  date: Date;
  timeSlot: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface GroomerProfile {
  id: string;
  groomerId: string;
  commissionGrade?: {
    name: string;
    commissionRate: number;
  };
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolderName?: string;
  settlementCycle: string;
  isActive: boolean;
}

export interface GroomerSettlementInfo {
  totalRevenue: number;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  settlementDate: Date;
  status: string;
}
