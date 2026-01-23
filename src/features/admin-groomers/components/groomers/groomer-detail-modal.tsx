import { X, UserCheck, UserX, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GroomerStatusBadge } from '../ui/groomer-status-badge'
import {
  formatCurrency,
  formatDate,
  formatAge,
  formatPhoneNumber,
  formatCommissionRate,
  formatCoordinates,
} from '../../utils/groomer-formatters'
import type { AdminGroomerInfo } from '../../types/groomer.types'

export interface GroomerDetailModalProps {
  /**
   * Groomer data to display
   */
  groomer: AdminGroomerInfo | null
  /**
   * Whether the modal is open
   */
  open: boolean
  /**
   * Handler for closing the modal
   */
  onClose: () => void
  /**
   * Handler for activating the groomer
   */
  onActivate?: (groomerId: string) => void
  /**
   * Handler for deactivating the groomer
   */
  onDeactivate?: (groomerId: string) => void
  /**
   * Handler for suspending the groomer
   */
  onSuspend?: (groomerId: string) => void
  /**
   * Handler for updating commission grade
   */
  onUpdateCommission?: (groomerId: string, commissionGradeId: string) => void
  /**
   * Available commission grades
   */
  commissionGrades?: Array<{ id: string; name: string; commissionRate: number }>
}

/**
 * GroomerDetailModal Component
 *
 * Displays comprehensive groomer information in a modal dialog.
 * Shows user info, groomer info, bio, certifications, services, locations,
 * performance metrics, and bank account details.
 * Uses ScrollArea for mobile responsiveness.
 *
 * @example
 * ```tsx
 * import { GroomerDetailModal } from '@/features/admin-groomers/components/groomers/groomer-detail-modal'
 *
 * <GroomerDetailModal
 *   groomer={selectedGroomer}
 *   open={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onActivate={handleActivate}
 *   onDeactivate={handleDeactivate}
 *   onSuspend={handleSuspend}
 *   onUpdateCommission={handleUpdateCommission}
 *   commissionGrades={commissionGrades}
 * />
 * ```
 */
export function GroomerDetailModal({
  groomer,
  open,
  onClose,
  onActivate,
  onDeactivate,
  onSuspend,
  onUpdateCommission,
  commissionGrades = [],
}: GroomerDetailModalProps) {
  if (!groomer) return null

  const handleCommissionChange = (value: string) => {
    if (onUpdateCommission) {
      onUpdateCommission(groomer.id, value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={groomer.profileImage || undefined} alt={groomer.user.name} />
                <AvatarFallback className="text-2xl">{groomer.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{groomer.user.name}</DialogTitle>
                <DialogDescription className="mt-1">{groomer.user.email}</DialogDescription>
              </div>
            </div>
            <GroomerStatusBadge isActive={groomer.isActive} variant="detailed" />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="space-y-6 px-6 pb-6">
            {/* Basic Information */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">기본 정보</h3>
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground text-sm">이름</span>
                    <p className="font-medium">{groomer.user.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">전화번호</span>
                    <p className="font-medium">{formatPhoneNumber(groomer.user.phoneNumber)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">이메일</span>
                    <p className="font-medium">{groomer.user.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">나이</span>
                    <p className="font-medium">{formatAge(groomer.birthDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">가입일</span>
                    <p className="font-medium">{formatDate(groomer.user.createdAt)}</p>
                  </div>
                  {groomer.lastActivityAt && (
                    <div>
                      <span className="text-muted-foreground text-sm">마지막 활동</span>
                      <p className="font-medium">{formatDate(groomer.lastActivityAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <Separator />

            {/* Groomer Information */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">미용사 정보</h3>
              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground text-sm">경력</span>
                    <p className="font-medium">{groomer.experience}년</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">활동 상태</span>
                    <p className="font-medium">{groomer.isActive ? '활동중' : '비활성'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">평점</span>
                    <p className="font-medium">
                      ⭐ {groomer.rating.toFixed(1)} ({groomer.totalReviews}개 리뷰)
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">총 예약건수</span>
                    <p className="font-medium">{groomer.totalBookings}건</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">이번 달 매출</span>
                    <p className="font-medium text-green-600">
                      {formatCurrency(groomer.monthlyRevenue)}
                    </p>
                  </div>
                  {groomer.commissionGrade && (
                    <div>
                      <span className="text-muted-foreground text-sm">수수료 등급</span>
                      <div className="mt-1">
                        {commissionGrades.length > 0 ? (
                          <Select
                            value={groomer.commissionGrade.id}
                            onValueChange={handleCommissionChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {groomer.commissionGrade.name} (
                                {formatCommissionRate(groomer.commissionGrade.commissionRate)})
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {commissionGrades.map((grade) => (
                                <SelectItem key={grade.id} value={grade.id}>
                                  {grade.name} ({formatCommissionRate(grade.commissionRate)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="font-medium">
                            {groomer.commissionGrade.name} (
                            {formatCommissionRate(groomer.commissionGrade.commissionRate)})
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Bio */}
            {groomer.bio && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold">소개</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                      {groomer.bio}
                    </p>
                  </div>
                </section>
              </>
            )}

            {/* Certifications */}
            {groomer.certifications && groomer.certifications.length > 0 && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold">자격증</h3>
                  <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                    {groomer.certifications.map((cert, index) => (
                      <div key={index} className="text-sm">
                        • {JSON.stringify(cert)}
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Services and Locations */}
            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-semibold">서비스 및 지점</h3>
              <div className="space-y-3">
                {groomer.availableLocations && groomer.availableLocations.length > 0 ? (
                  groomer.availableLocations.map((location) => (
                    <div key={location.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold">{location.name}</h4>
                        <span
                          className={`text-xs ${location.isActive ? 'text-green-600' : 'text-gray-500'}`}
                        >
                          {location.isActive ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">{location.address}</p>
                        {location.description && (
                          <p className="text-muted-foreground text-xs">{location.description}</p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          {formatCoordinates(location.centerLat, location.centerLng)} (반경:{' '}
                          {location.radiusKm}km)
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-muted/50 text-muted-foreground rounded-lg p-4 text-center text-sm">
                    등록된 서비스 지역이 없습니다
                  </div>
                )}
              </div>
            </section>

            {/* Performance Metrics */}
            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-semibold">실적</h3>
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">총 예약건수</span>
                  <span className="text-lg font-bold">{groomer.totalBookings}건</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">이번 달 매출</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(groomer.monthlyRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">평균 평점</span>
                  <span className="font-medium">
                    ⭐ {groomer.rating.toFixed(1)} ({groomer.totalReviews}개 리뷰)
                  </span>
                </div>
              </div>
            </section>

            {/* Bank Account */}
            {groomer.bankAccount && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold">정산 계좌</h3>
                  <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground text-sm">은행명</span>
                        <p className="font-medium">{groomer.bankAccount.bankName || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">예금주</span>
                        <p className="font-medium">{groomer.bankAccount.accountHolder || '-'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground text-sm">계좌번호</span>
                        <p className="font-mono font-medium">
                          {groomer.bankAccount.accountNumber || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
          {/* Actions Footer */}
          <DialogFooter className="flex flex-row justify-end p-6">
            <div className="flex gap-2">
              {groomer.isActive ? (
                <Button
                  onClick={() => onDeactivate?.(groomer.id)}
                  variant="outline"
                  className="text-orange-600"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  비활성화
                </Button>
              ) : (
                <Button
                  onClick={() => onActivate?.(groomer.id)}
                  variant="outline"
                  className="text-green-600"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  활성화
                </Button>
              )}
              <Button
                onClick={() => onSuspend?.(groomer.id)}
                variant="outline"
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                계정 정지
              </Button>
            </div>
            <Button onClick={onClose} variant="outline">
              <X className="mr-2 h-4 w-4" />
              닫기
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
