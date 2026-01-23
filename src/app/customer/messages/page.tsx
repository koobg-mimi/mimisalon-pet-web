'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ChatInterface } from '@/components/messaging/chat-interface';
import {
  MessageCircleIcon,
  SearchIcon,
  PlusIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { type CreateMessageInput } from '@/lib/validations/message';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  type: 'CUSTOMER_GROOMER' | 'CUSTOMER_ADMIN' | 'GROOMER_ADMIN' | 'GROUP';
  title?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  bookingId?: string;
  lastMessage?: {
    id: string;
    content: string;
    type: 'TEXT' | 'IMAGE' | 'FILE' | 'BOOKING_INFO' | 'SYSTEM';
    status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
    senderId: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);

  const currentUserId = session?.user?.id || 'current-user-id';

  // Fetch conversations using React Query
  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['customer', 'conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      return data.conversations as Conversation[];
    },
    enabled: !!session?.user && session.user.role === 'CUSTOMER',
  });

  const conversations = conversationsData || [];

  // 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: CreateMessageInput) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate conversations to refresh unread counts
      queryClient.invalidateQueries({ queryKey: ['customer', 'conversations'] });
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds: string[]) => {
      const response = await fetch('/api/messages/mark-read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark messages as read');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'conversations'] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'conversations'] });
    },
  });

  // Handler functions
  const handleSendMessage = async (message: CreateMessageInput) => {
    await sendMessageMutation.mutateAsync(message);
  };

  const handleMarkAsRead = async (messageIds: string[]) => {
    await markAsReadMutation.mutateAsync(messageIds);
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessageMutation.mutateAsync(messageId);
  };

  // 새 대화 시작
  const handleNewConversation = () => {
    // 새 대화 생성 모달 또는 페이지로 이동
    router.push('/customer/messages/new');
  };

  // 필터링된 대화 목록
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId);
    const title = conversation.title || otherParticipant?.name || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatLastMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return format(date, 'yyyy-MM-dd', { locale: ko });
  };

  const ConversationList = (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="border-b bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">메시지</h1>
          <Button size="sm" onClick={handleNewConversation}>
            <PlusIcon className="mr-1 h-4 w-4" />새 대화
          </Button>
        </div>

        {/* 검색 */}
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="대화 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 대화 목록 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <MessageCircleIcon className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {searchTerm ? '검색 결과가 없습니다' : '대화가 없습니다'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? '다른 검색어로 시도해보세요' : '새로운 대화를 시작해보세요'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewConversation}>
                <PlusIcon className="mr-2 h-4 w-4" />새 대화 시작
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (p) => p.id !== currentUserId
              );
              const isSelected = selectedConversation?.id === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    'cursor-pointer p-4 transition-colors hover:bg-gray-50',
                    isSelected && 'border-r-2 border-blue-500 bg-blue-50'
                  )}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    {/* 아바타 */}
                    {otherParticipant?.avatar ? (
                      <Image
                        src={otherParticipant.avatar}
                        alt={otherParticipant.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                      </div>
                    )}

                    {/* 대화 정보 */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="truncate font-medium">
                          {conversation.title || otherParticipant?.name || 'Unknown'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatLastMessageTime(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="rounded-full px-2 py-1 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm text-gray-600">
                          {conversation.lastMessage?.content || '아직 메시지가 없습니다'}
                        </p>

                        {conversation.bookingId && (
                          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        )}
                      </div>

                      {/* 참가자 역할 표시 */}
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {otherParticipant?.role === 'GROOMER' && '미용사'}
                          {otherParticipant?.role === 'ADMIN' && '관리자'}
                          {otherParticipant?.role === 'CUSTOMER' && '고객'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (isMobileView && selectedConversation) {
    // 모바일에서 대화 선택 시 전체 화면으로 표시
    return (
      <div className="flex h-screen flex-col">
        <div className="flex items-center border-b bg-white p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedConversation(null)}
            className="mr-3"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold">
            {selectedConversation.title ||
              selectedConversation.participants.find((p) => p.id !== currentUserId)?.name ||
              '대화'}
          </h1>
        </div>
        <div className="flex-1">
          <ChatInterface
            conversation={selectedConversation}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onMarkAsRead={handleMarkAsRead}
            onDeleteMessage={handleDeleteMessage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid h-[800px] grid-cols-1 gap-0 overflow-hidden rounded-lg border bg-white md:grid-cols-3">
          {/* 대화 목록 */}
          <div className="md:border-r">{ConversationList}</div>

          {/* 채팅 인터페이스 */}
          <div className="md:col-span-2">
            {selectedConversation ? (
              <ChatInterface
                conversation={selectedConversation}
                currentUserId={currentUserId}
                onSendMessage={handleSendMessage}
                onMarkAsRead={handleMarkAsRead}
                onDeleteMessage={handleDeleteMessage}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircleIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">대화를 선택해주세요</h3>
                  <p className="text-gray-500">
                    왼쪽에서 대화를 선택하거나 새로운 대화를 시작하세요
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
