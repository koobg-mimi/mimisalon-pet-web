import { type RefObject } from 'react'
import {
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreVertical,
  UserCheck,
  UserX,
  Ban,
} from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GroomerStatusBadge } from '../ui/groomer-status-badge'
import {
  formatCurrency,
  formatDate,
  formatAge,
  formatPhoneNumber,
} from '../../utils/groomer-formatters'
import type { AdminGroomerInfo } from '../../types/groomer.types'
import styles from './groomers-table.module.css'

export interface GroomersTableProps {
  /**
   * Array of groomers to display
   */
  groomers: AdminGroomerInfo[]
  /**
   * Whether the table is loading
   */
  isLoading: boolean
  /**
   * Current sort field
   */
  sortBy: 'name' | 'rating' | 'revenue' | 'bookings' | 'joinDate'
  /**
   * Current sort order
   */
  sortOrder: 'asc' | 'desc'
  /**
   * Handler for sorting
   */
  onSort: (field: 'name' | 'rating' | 'revenue' | 'bookings' | 'joinDate') => void
  /**
   * Handler for viewing groomer details
   */
  onViewDetails: (groomer: AdminGroomerInfo) => void
  /**
   * Handler for activating a groomer
   */
  onActivate: (groomerId: string) => void
  /**
   * Handler for deactivating a groomer
   */
  onDeactivate: (groomerId: string) => void
  /**
   * Handler for suspending a groomer
   */
  onSuspend: (groomerId: string) => void
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
 * GroomersTable Component
 *
 * Displays a table of groomers with infinite scroll, sorting, and actions.
 * Uses Excel-style compact styling for efficient data display.
 * Includes mobile-responsive card layout.
 *
 * @example
 * ```tsx
 * import { GroomersTable } from '@/features/admin-groomers/components/groomers/groomers-table'
 *
 * <GroomersTable
 *   groomers={allGroomers}
 *   isLoading={isLoading}
 *   sortBy={sortBy}
 *   sortOrder={sortOrder}
 *   onSort={handleSort}
 *   onViewDetails={handleViewDetails}
 *   onActivate={handleActivate}
 *   onDeactivate={handleDeactivate}
 *   onSuspend={handleSuspend}
 *   scrollContainerRef={scrollContainerRef}
 *   loadMoreTriggerRef={loadMoreTriggerRef}
 *   hasMore={hasMore}
 * />
 * ```
 */
export function GroomersTable({
  groomers,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onViewDetails,
  onActivate,
  onDeactivate,
  onSuspend,
  scrollContainerRef,
  loadMoreTriggerRef,
  hasMore,
}: GroomersTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Desktop Table */}
        <div ref={scrollContainerRef} className={`${styles.scrollContainer} hidden lg:block`}>
          <Table className={styles.excelTable}>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>경력</TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('rating')}>
                  <div className="flex items-center">
                    평점
                    {sortBy === 'rating' &&
                      (sortOrder === 'desc' ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>리뷰수</TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('bookings')}>
                  <div className="flex items-center">
                    예약건수
                    {sortBy === 'bookings' &&
                      (sortOrder === 'desc' ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('revenue')}>
                  <div className="flex items-center">
                    월매출
                    {sortBy === 'revenue' &&
                      (sortOrder === 'desc' ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>나이</TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('joinDate')}>
                  <div className="flex items-center">
                    가입일
                    {sortBy === 'joinDate' &&
                      (sortOrder === 'desc' ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groomers.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div className={styles.emptyState}>
                      <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                      <p>미용사가 없습니다</p>
                      <p>필터 조건을 변경해보세요</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {groomers.map((groomer) => (
                <TableRow key={groomer.id}>
                  {/* Name */}
                  <TableCell>{groomer.user.name}</TableCell>

                  {/* Email */}
                  <TableCell>{groomer.user.email}</TableCell>

                  {/* Phone Number */}
                  <TableCell>{formatPhoneNumber(groomer.user.phoneNumber)}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <GroomerStatusBadge isActive={groomer.isActive} />
                  </TableCell>

                  {/* Experience */}
                  <TableCell>{groomer.experience}년</TableCell>

                  {/* Rating */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-600">⭐</span>
                      <span>{groomer.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>

                  {/* Total Reviews */}
                  <TableCell>{groomer.totalReviews}</TableCell>

                  {/* Total Bookings */}
                  <TableCell>{groomer.totalBookings}</TableCell>

                  {/* Monthly Revenue */}
                  <TableCell>{formatCurrency(groomer.monthlyRevenue)}</TableCell>

                  {/* Age */}
                  <TableCell>{formatAge(groomer.birthDate)}</TableCell>

                  {/* Join Date */}
                  <TableCell>{formatDate(groomer.user.createdAt)}</TableCell>

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
                        <DropdownMenuLabel>작업</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewDetails(groomer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          상세보기
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {groomer.isActive ? (
                          <DropdownMenuItem
                            onClick={() => onDeactivate(groomer.id)}
                            className="text-orange-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            비활성화
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onActivate(groomer.id)}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            활성화
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onSuspend(groomer.id)}
                          className="text-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          계정 정지
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

          {!hasMore && groomers.length > 0 && (
            <div className={styles.loadingTrigger}>모든 미용사를 불러왔습니다</div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {groomers.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p>미용사가 없습니다</p>
              <p>필터 조건을 변경해보세요</p>
            </div>
          )}
          {groomers.map((groomer) => (
            <div key={groomer.id} className={styles.mobileCard}>
              {/* Header */}
              <div className={styles.mobileCardHeader}>
                <div className="flex flex-1 items-center">
                  <Avatar className={styles.mobileCardAvatar}>
                    <AvatarImage src={groomer.profileImage || undefined} alt={groomer.user.name} />
                    <AvatarFallback>{groomer.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={styles.mobileCardTitle}>
                    <div className={styles.mobileCardName}>{groomer.user.name}</div>
                    <div className={styles.mobileCardEmail}>{groomer.user.email}</div>
                  </div>
                </div>
                <GroomerStatusBadge isActive={groomer.isActive} />
              </div>

              {/* Info Grid */}
              <div className={styles.mobileCardGrid}>
                <div className={styles.mobileCardItem}>
                  <div className={styles.mobileCardLabel}>전화번호</div>
                  <div className={styles.mobileCardValue}>
                    {formatPhoneNumber(groomer.user.phoneNumber)}
                  </div>
                </div>
                <div className={styles.mobileCardItem}>
                  <div className={styles.mobileCardLabel}>경력</div>
                  <div className={styles.mobileCardValue}>{groomer.experience}년</div>
                </div>
                <div className={styles.mobileCardItem}>
                  <div className={styles.mobileCardLabel}>평점</div>
                  <div className={styles.mobileCardValue}>
                    ⭐ {groomer.rating.toFixed(1)} ({groomer.totalReviews})
                  </div>
                </div>
                <div className={styles.mobileCardItem}>
                  <div className={styles.mobileCardLabel}>예약건수</div>
                  <div className={styles.mobileCardValue}>{groomer.totalBookings}</div>
                </div>
                <div className={styles.mobileCardItem}>
                  <div className={styles.mobileCardLabel}>월매출</div>
                  <div className={styles.mobileCardValue}>
                    {formatCurrency(groomer.monthlyRevenue)}
                  </div>
                </div>
                <div className={styles.mobileCardItem}>
                  <div className={styles.mobileCardLabel}>나이</div>
                  <div className={styles.mobileCardValue}>{formatAge(groomer.birthDate)}</div>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.mobileCardActions}>
                <Button size="sm" variant="outline" onClick={() => onViewDetails(groomer)}>
                  <Eye className="mr-1 h-3 w-3" />
                  상세
                </Button>
                {groomer.isActive ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeactivate(groomer.id)}
                    className="text-orange-600"
                  >
                    <UserX className="mr-1 h-3 w-3" />
                    비활성화
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onActivate(groomer.id)}
                    className="text-green-600"
                  >
                    <UserCheck className="mr-1 h-3 w-3" />
                    활성화
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSuspend(groomer.id)}
                  className="text-red-600"
                >
                  <Ban className="mr-1 h-3 w-3" />
                  정지
                </Button>
              </div>
            </div>
          ))}

          {/* Infinite Scroll Trigger - Mobile */}
          {hasMore && (
            <div ref={loadMoreTriggerRef} className={styles.loadingTrigger}>
              {isLoading ? '로딩 중...' : '스크롤하여 더 보기'}
            </div>
          )}

          {!hasMore && groomers.length > 0 && (
            <div className={styles.loadingTrigger}>모든 미용사를 불러왔습니다</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
