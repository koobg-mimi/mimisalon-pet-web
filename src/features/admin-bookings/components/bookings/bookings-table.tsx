import { type RefObject } from 'react'
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreVertical,
  Trash2,
  XCircle,
} from 'lucide-react'
import { BookingStatus } from '@mimisalon/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BookingStatusBadge } from '../ui/booking-status-badge'
import { formatCurrency, formatDate, formatTime } from '../../utils/booking-formatters'
import { isConfirmable, isCancellable, isCompletable } from '../../utils/booking-status-config'
import type { TransformedBooking } from '../../types/booking.types'
import styles from './bookings-table.module.css'

export interface BookingsTableProps {
  /**
   * Array of bookings to display
   */
  bookings: TransformedBooking[]
  /**
   * Whether the table is loading
   */
  isLoading: boolean
  /**
   * Current sort field
   */
  sortBy: 'date' | 'status' | 'amount'
  /**
   * Current sort order
   */
  sortOrder: 'asc' | 'desc'
  /**
   * Handler for sorting
   */
  onSort: (field: 'date' | 'status' | 'amount') => void
  /**
   * Handler for viewing booking details
   */
  onViewDetails: (booking: TransformedBooking) => void
  /**
   * Handler for confirming a booking
   */
  onConfirm: (bookingId: string) => void
  /**
   * Handler for cancelling a booking
   */
  onCancel: (bookingId: string) => void
  /**
   * Handler for completing a booking
   */
  onComplete: (bookingId: string) => void
  /**
   * Handler for deleting a booking
   */
  onDelete: (booking: TransformedBooking) => void
  /**
   * Ref for the scroll container
   */
  scrollContainerRef: RefObject<HTMLDivElement>
  /**
   * Ref for the load more trigger element
   */
  loadMoreTriggerRef: RefObject<HTMLDivElement>
  /**
   * Whether there are more pages to load
   */
  hasMore: boolean
}

/**
 * BookingsTable Component
 *
 * Displays a table of bookings with infinite scroll, sorting, and actions.
 * Uses Excel-style compact styling for efficient data display.
 *
 * @example
 * ```tsx
 * import { BookingsTable } from '@/features/admin-bookings/components/bookings/bookings-table'
 *
 * <BookingsTable
 *   bookings={allBookings}
 *   isLoading={isLoading}
 *   sortBy={sortBy}
 *   sortOrder={sortOrder}
 *   onSort={handleSort}
 *   onViewDetails={handleViewDetails}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 *   onComplete={handleComplete}
 *   onDelete={handleDelete}
 *   scrollContainerRef={scrollContainerRef}
 *   loadMoreTriggerRef={loadMoreTriggerRef}
 *   hasMore={hasMore}
 * />
 * ```
 */
export function BookingsTable({
  bookings,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onViewDetails,
  onConfirm,
  onCancel,
  onComplete,
  onDelete,
  scrollContainerRef,
  loadMoreTriggerRef,
  hasMore,
}: BookingsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          <Table className={styles.excelTable}>
            <TableHeader>
              <TableRow>
                <TableHead>번호</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>반려동물</TableHead>
                <TableHead>서비스</TableHead>
                <TableHead>미용사</TableHead>
                <TableHead>미용사 전화번호</TableHead>
                <TableHead>예약일</TableHead>
                <TableHead>시작시간</TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('amount')}>
                  <div className="flex items-center">
                    총액
                    {sortBy === 'amount' &&
                      (sortOrder === 'desc' ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>결제액</TableHead>
                <TableHead>추가액</TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => onSort('status')}>
                  <div className="flex items-center justify-end">
                    상태
                    {sortBy === 'status' &&
                      (sortOrder === 'desc' ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={15}>
                    <div className={styles.emptyState}>
                      <Calendar className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                      <p>예약이 없습니다</p>
                      <p>필터 조건을 변경해보세요</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  {/* Booking Number */}
                  <TableCell>#{booking.bookingNumber.slice(-6)}</TableCell>

                  {/* Customer Name */}
                  <TableCell>{booking.customer?.name || '이름 없음'}</TableCell>

                  {/* Phone Number */}
                  <TableCell>{booking.customer?.phoneNumber || '-'}</TableCell>

                  {/* Email */}
                  <TableCell>{booking.customer?.email || '-'}</TableCell>

                  {/* Pets */}
                  <TableCell>{booking.bookingPets.map((bp) => bp.pet.name).join(', ')}</TableCell>

                  {/* Services */}
                  <TableCell>
                    {booking.bookingPets
                      .flatMap((bp) => bp.services.map((s) => s.service?.name || '서비스명 없음'))
                      .join(', ')}
                  </TableCell>

                  {/* Groomer */}
                  <TableCell>{booking.groomer?.name || '미지정'}</TableCell>

                  {/* Groomer Phone */}
                  <TableCell>{booking.groomer?.phoneNumber || '-'}</TableCell>

                  {/* Service Date */}
                  <TableCell>{formatDate(booking.serviceDate)}</TableCell>

                  {/* Start Time */}
                  <TableCell>{formatTime(booking.startTime)}</TableCell>

                  {/* Total Amount */}
                  <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>

                  {/* Paid Amount */}
                  <TableCell>
                    {booking.paidAmount > 0 ? formatCurrency(booking.paidAmount) : '-'}
                  </TableCell>

                  {/* Additional Amount */}
                  <TableCell>
                    {booking.additionalAmount && booking.additionalAmount > 0
                      ? formatCurrency(booking.additionalAmount)
                      : '-'}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-right">
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>액션</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                          <Eye className="mr-2 h-4 w-4" />
                          상세보기
                        </DropdownMenuItem>
                        {isConfirmable(booking.status) && (
                          <DropdownMenuItem onClick={() => onConfirm(booking.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            예약 확정
                          </DropdownMenuItem>
                        )}
                        {isCompletable(booking.status) && (
                          <DropdownMenuItem onClick={() => onComplete(booking.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                            서비스 완료
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {isCancellable(booking.status) && (
                          <DropdownMenuItem
                            onClick={() => onCancel(booking.id)}
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            {booking.status === BookingStatus.SERVICE_COMPLETED
                              ? '환불 처리'
                              : '예약 취소'}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDelete(booking)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={loadMoreTriggerRef} className={styles.loadingTrigger}>
              {isLoading ? '로딩 중...' : '스크롤하여 더 보기'}
            </div>
          )}

          {!hasMore && bookings.length > 0 && (
            <div className={styles.loadingTrigger}>모든 예약을 불러왔습니다</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
