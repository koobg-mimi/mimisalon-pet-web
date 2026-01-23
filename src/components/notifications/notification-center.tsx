'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { NotificationCard } from './notification-card';
import {
  BellIcon,
  SettingsIcon,
  CheckIcon,
  ArchiveIcon,
  TrashIcon,
  SearchIcon,
  RefreshCwIcon,
} from 'lucide-react';
import {
  type NotificationType,
  type NotificationPriority,
  type NotificationFilter,
} from '@/lib/validations/notification';
import { cn } from '@/lib/utils';
import type {
  GetNotificationsResponse,
  NotificationItem,
} from '@/app/api/notifications/route';

// Use the API response type
type Notification = NotificationItem;

interface NotificationCenterProps {
  onNavigate?: (notification: Notification) => void;
  className?: string;
}

export function NotificationCenter({ onNavigate, className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // 알림 목록 로드
  const fetchNotifications = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const params = new URLSearchParams();
        if (filter.status) params.append('status', filter.status);
        if (filter.type) params.append('type', filter.type);
        if (filter.priority) params.append('priority', filter.priority);
        if (searchTerm) params.append('search', searchTerm);
        params.append('page', filter.page.toString());
        params.append('limit', filter.limit.toString());

        const response = await fetch(`/api/notifications?${params}`);
        if (!response.ok) {
          throw new Error('알림을 불러올 수 없습니다');
        }

        const data: GetNotificationsResponse = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    void fetchNotifications();
  }, [filter, searchTerm, fetchNotifications]);

  // 알림 읽음 처리
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'READ',
          readAt: new Date(),
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  status: 'READ' as const,
                  readAt: new Date().toISOString(),
                }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // 알림 읽지 않음 처리
  const handleMarkAsUnread = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'UNREAD',
          readAt: null,
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  status: 'UNREAD' as const,
                  readAt: undefined,
                }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  };

  // 알림 보관
  const handleArchive = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ARCHIVED',
          archivedAt: new Date(),
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: 'ARCHIVED' as const }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  };

  // 알림 삭제
  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // 선택된 알림 일괄 처리
  const handleBatchAction = async (action: 'read' | 'archive' | 'delete') => {
    if (selectedNotifications.length === 0) return;

    try {
      const response = await fetch('/api/notifications/batch', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: selectedNotifications,
          action,
        }),
      });

      if (response.ok) {
        switch (action) {
          case 'read':
            setNotifications((prev) =>
              prev.map((notification) =>
                selectedNotifications.includes(notification.id)
                  ? {
                      ...notification,
                      status: 'READ' as const,
                      readAt: new Date().toISOString(),
                    }
                  : notification
              )
            );
            break;
          case 'archive':
            setNotifications((prev) =>
              prev.map((notification) =>
                selectedNotifications.includes(notification.id)
                  ? { ...notification, status: 'ARCHIVED' as const }
                  : notification
              )
            );
            break;
          case 'delete':
            setNotifications((prev) =>
              prev.filter((notification) => !selectedNotifications.includes(notification.id))
            );
            break;
        }
        setSelectedNotifications([]);
      }
    } catch (error) {
      console.error('Error performing batch action:', error);
    }
  };

  // 필터링된 알림
  const filteredNotifications = notifications.filter((notification) => {
    if (selectedTab === 'unread' && notification.status !== 'UNREAD') return false;
    if (selectedTab === 'read' && notification.status !== 'READ') return false;
    if (selectedTab === 'archived' && notification.status !== 'ARCHIVED') return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-6 w-6" />
            <h2 className="text-2xl font-bold">알림</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full px-2 py-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotifications(true)}
            disabled={isRefreshing}
          >
            <RefreshCwIcon className={cn('mr-2 h-4 w-4', { 'animate-spin': isRefreshing })} />
            새로고침
          </Button>

          <Button variant="outline" size="sm">
            <SettingsIcon className="mr-2 h-4 w-4" />
            설정
          </Button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="알림 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filter.type || ''}
          onValueChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              type: (value as NotificationType) || undefined,
            }))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">모든 유형</SelectItem>
            <SelectItem value="BOOKING_CONFIRMED">예약 확정</SelectItem>
            <SelectItem value="BOOKING_CANCELLED">예약 취소</SelectItem>
            <SelectItem value="GROOMING_STARTED">미용 시작</SelectItem>
            <SelectItem value="GROOMING_COMPLETED">미용 완료</SelectItem>
            <SelectItem value="PAYMENT_RECEIVED">결제 완료</SelectItem>
            <SelectItem value="PROMOTION">프로모션</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.priority || ''}
          onValueChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              priority: (value as NotificationPriority) || undefined,
            }))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">모든 우선순위</SelectItem>
            <SelectItem value="LOW">낮음</SelectItem>
            <SelectItem value="NORMAL">보통</SelectItem>
            <SelectItem value="HIGH">높음</SelectItem>
            <SelectItem value="URGENT">긴급</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 일괄 작업 버튼 */}
      {selectedNotifications.length > 0 && (
        <div className="flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <span className="text-sm text-blue-700">{selectedNotifications.length}개 선택됨</span>
          <div className="ml-auto flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => handleBatchAction('read')}>
              <CheckIcon className="mr-1 h-4 w-4" />
              읽음 처리
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBatchAction('archive')}>
              <ArchiveIcon className="mr-1 h-4 w-4" />
              보관
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBatchAction('delete')}>
              <TrashIcon className="mr-1 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>
      )}

      {/* 탭 */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">전체 ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            읽지 않음 ({notifications.filter((n) => n.status === 'UNREAD').length})
          </TabsTrigger>
          <TabsTrigger value="read">
            읽음 ({notifications.filter((n) => n.status === 'READ').length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            보관함 ({notifications.filter((n) => n.status === 'ARCHIVED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6 space-y-4">
          {isLoading ? (
            <div className="py-12 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground mt-4">알림을 불러오는 중...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <BellIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">알림이 없습니다</h3>
              <p className="text-muted-foreground">
                {selectedTab === 'all' && '새로운 알림이 없습니다.'}
                {selectedTab === 'unread' && '읽지 않은 알림이 없습니다.'}
                {selectedTab === 'read' && '읽은 알림이 없습니다.'}
                {selectedTab === 'archived' && '보관된 알림이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAsUnread={handleMarkAsUnread}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
