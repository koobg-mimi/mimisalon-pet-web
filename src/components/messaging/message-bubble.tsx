'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckIcon,
  CheckCheckIcon,
  MoreVerticalIcon,
  ReplyIcon,
  CopyIcon,
  TrashIcon,
  DownloadIcon,
  CalendarIcon,
  FileIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { type MessageType, type MessageStatus } from '@/lib/validations/message';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  readAt?: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  metadata?: Record<string, string | number | boolean>;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSender?: boolean;
  showTimestamp?: boolean;
  onReply?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  className?: string;
}

export function MessageBubble({
  message,
  isOwn,
  showSender = false,
  showTimestamp = true,
  onReply,
  onDelete,
  className,
}: MessageBubbleProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      // 오늘: 시간만 표시
      return format(date, 'HH:mm:ss', { locale: ko });
    } else if (messageDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      // 어제
      return `어제 ${format(date, 'HH:mm:ss', { locale: ko })}`;
    } else {
      // 그 외: 날짜와 시간
      return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: ko });
    }
  };

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'SENT':
        return <CheckIcon className="h-3 w-3" />;
      case 'DELIVERED':
        return <CheckCheckIcon className="h-3 w-3" />;
      case 'READ':
        return <CheckCheckIcon className="h-3 w-3 text-blue-500" />;
      case 'FAILED':
        return <AlertCircleIcon className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setIsMenuOpen(false);
  };

  const handleDownloadFile = (attachment: NonNullable<Message['attachments']>[0]) => {
    const link = document.createElement('a');
    link.href = attachment.fileUrl;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'TEXT':
        return <div className="break-words whitespace-pre-wrap">{message.content}</div>;

      case 'IMAGE':
        return (
          <div className="space-y-2">
            {message.attachments?.map((attachment, index) => (
              <div key={index} className="relative max-w-sm overflow-hidden rounded-lg">
                <Image
                  src={attachment.fileUrl}
                  alt={attachment.fileName}
                  width={300}
                  height={200}
                  className="cursor-pointer object-cover transition-opacity hover:opacity-90"
                  onClick={() => window.open(attachment.fileUrl, '_blank')}
                />
              </div>
            ))}
            {message.content && <div className="text-sm">{message.content}</div>}
          </div>
        );

      case 'FILE':
        return (
          <div className="space-y-2">
            {message.attachments?.map((attachment, index) => (
              <div
                key={index}
                className="flex max-w-sm items-center space-x-3 rounded-lg bg-gray-100 p-3"
              >
                <FileIcon className="h-8 w-8 text-gray-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{attachment.fileName}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDownloadFile(attachment)}>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {message.content && <div className="text-sm">{message.content}</div>}
          </div>
        );

      case 'BOOKING_INFO':
        return (
          <div className="max-w-sm rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="mb-2 flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">예약 정보</span>
            </div>
            <div className="text-sm text-blue-800">{message.content}</div>
            {message.metadata?.bookingId && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-blue-300 text-blue-600"
                onClick={() =>
                  window.open(`/customer/booking/${message.metadata?.bookingId}`, '_blank')
                }
              >
                예약 상세보기
              </Button>
            )}
          </div>
        );

      case 'SYSTEM':
        return (
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              {message.content}
            </Badge>
          </div>
        );

      default:
        return <div>{message.content}</div>;
    }
  };

  if (message.type === 'SYSTEM') {
    return (
      <div className={cn('my-4 flex justify-center', className)}>{renderMessageContent()}</div>
    );
  }

  return (
    <div className={cn('mb-4 flex gap-3', isOwn ? 'justify-end' : 'justify-start', className)}>
      {/* 아바타 (상대방 메시지만) */}
      {!isOwn && (
        <div className="flex-shrink-0">
          {message.senderAvatar ? (
            <Image
              src={message.senderAvatar}
              alt={message.senderName}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
              <span className="text-xs font-medium text-gray-600">
                {message.senderName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className={cn('flex max-w-xs flex-col sm:max-w-md', isOwn ? 'items-end' : 'items-start')}
      >
        {/* 발신자 이름 */}
        {showSender && !isOwn && (
          <span className="mb-1 px-1 text-xs text-gray-500">{message.senderName}</span>
        )}

        {/* 답장 대상 메시지 */}
        {message.replyTo && (
          <div className="mb-2 max-w-full rounded border-l-2 border-gray-400 bg-gray-100 p-2 text-xs">
            <div className="font-medium text-gray-600">{message.replyTo.senderName}</div>
            <div className="truncate text-gray-500">{message.replyTo.content}</div>
          </div>
        )}

        {/* 메시지 버블 */}
        <div className="group relative">
          <div
            className={cn(
              'rounded-lg px-4 py-2 break-words',
              isOwn
                ? 'rounded-br-sm bg-blue-600 text-white'
                : 'rounded-bl-sm bg-gray-100 text-gray-900'
            )}
          >
            {renderMessageContent()}
          </div>

          {/* 메시지 메뉴 */}
          <div
            className={cn(
              'absolute top-0 opacity-0 transition-opacity group-hover:opacity-100',
              isOwn ? '-left-8' : '-right-8'
            )}
          >
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 border bg-white p-0 shadow-sm">
                  <MoreVerticalIcon className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? 'end' : 'start'}>
                {onReply && (
                  <DropdownMenuItem onClick={() => onReply(message)}>
                    <ReplyIcon className="mr-2 h-4 w-4" />
                    답장
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleCopyMessage}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  복사
                </DropdownMenuItem>
                {isOwn && onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(message.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 시간 및 상태 */}
        {showTimestamp && (
          <div
            className={cn(
              'mt-1 flex items-center space-x-1 px-1',
              isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            )}
          >
            <span className="text-xs text-gray-500">{formatTimestamp(message.createdAt)}</span>
            {isOwn && <div className="text-gray-500">{getStatusIcon(message.status)}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
