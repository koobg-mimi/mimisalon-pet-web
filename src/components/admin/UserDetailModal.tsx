'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAdminUserDetails } from '@/hooks/useAdminUsers';

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUserAction: (
    userId: string,
    action: 'activate' | 'deactivate' | 'delete' | 'promote' | 'demote'
  ) => void;
  isUpdating?: boolean;
  formatDate?: (date: string) => string;
}

export function UserDetailModal({
  userId,
  isOpen,
  onClose,
  onUserAction,
  isUpdating = false,
  formatDate = (date) => format(new Date(date), 'yyyy-MM-dd', { locale: ko }),
}: UserDetailModalProps) {
  const { user, isLoading, isError, error } = useAdminUserDetails(userId);

  if (!isOpen || !userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="bg-card border-border relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border">
        <div className="border-border flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">사용자 상세 정보</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {isError && (
          <div className="p-6 text-center">
            <p className="mb-2 text-red-600">사용자 정보를 불러올 수 없습니다</p>
            <p className="text-muted-foreground text-sm">
              {error?.message || '잠시 후 다시 시도해주세요'}
            </p>
          </div>
        )}

        {user && !isLoading && !isError && (
          <div className="space-y-6 p-6">
            {/* Basic Information */}
            <div>
              <h3 className="mb-3 font-semibold">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">이름:</span>
                  <p>{user.name || '없음'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">이메일:</span>
                  <p>{user.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">전화번호:</span>
                  <p>{user.phone || '없음'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">생년월일:</span>
                  <p>{user.dateOfBirth ? formatDate(user.dateOfBirth) : '없음'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">주소:</span>
                  <p>{user.address || '없음'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">가입일:</span>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Groomer Information */}
            {user.role === 'GROOMER' && (
              <div>
                <h3 className="mb-3 font-semibold">미용사 정보</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">활성 상태:</span>
                    <p>{user.groomerProfile?.isActive ? '활성' : '비활성'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">서비스 지역:</span>
                    {user.workAreas && user.workAreas.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {user.workAreas.map((area) => (
                          <div key={area.id} className="border-primary/20 border-l-2 pl-3">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{area.name}</p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  area.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {area.isActive ? '활성' : '비활성'}
                              </span>
                            </div>
                            {area.address && (
                              <p className="text-muted-foreground text-xs">{area.address}</p>
                            )}
                            <p className="text-muted-foreground text-xs">반경 {area.radiusKm}km</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">설정된 서비스 지역이 없습니다</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-border flex gap-2 border-t pt-4">
              <Button
                onClick={() => onUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                disabled={isUpdating}
              >
                {user.isActive ? '계정 비활성화' : '계정 활성화'}
              </Button>

              {user.role === 'GROOMER' && !user.groomerProfile?.isActive && (
                <Button
                  variant="outline"
                  onClick={() => onUserAction(user.id, 'promote')}
                  disabled={isUpdating}
                >
                  미용사 활성화
                </Button>
              )}

              {user.role !== 'ADMIN' && (
                <Button
                  variant="destructive"
                  onClick={() => onUserAction(user.id, 'delete')}
                  disabled={isUpdating}
                >
                  계정 삭제
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
