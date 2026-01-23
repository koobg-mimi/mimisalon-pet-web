'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useState, useEffect, useRef } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { MessageBubble } from './message-bubble'
import {
  SendIcon,
  PaperclipIcon,
  ImageIcon,
  PhoneIcon,
  VideoIcon,
  MoreVerticalIcon,
  XIcon,
} from 'lucide-react'
import {
  createMessageSchema,
  type CreateMessageInput,
  type MessageType,
} from '@/lib/validations/message'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  type: MessageType
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
  senderId: string
  senderName: string
  senderAvatar?: string
  createdAt: string
  updatedAt?: string
  readAt?: string
  attachments?: Array<{
    fileName: string
    fileUrl: string
    fileSize: number
    mimeType: string
  }>
  replyTo?: {
    id: string
    content: string
    senderName: string
  }
  metadata?: Record<string, string | number | boolean>
}

interface Conversation {
  id: string
  type: 'CUSTOMER_GROOMER' | 'CUSTOMER_ADMIN' | 'GROOMER_ADMIN' | 'GROUP'
  title?: string
  participants: Array<{
    id: string
    name: string
    avatar?: string
    role: string
    isOnline: boolean
    lastSeen?: string
  }>
  bookingId?: string
  lastMessage?: Message
  unreadCount: number
  createdAt: string
}

interface ChatInterfaceProps {
  conversation: Conversation
  currentUserId: string
  onSendMessage: (message: CreateMessageInput) => Promise<void>
  onMarkAsRead: (messageIds: string[]) => Promise<void>
  onDeleteMessage: (messageId: string) => Promise<void>
  className?: string
}

export function ChatInterface({
  conversation,
  currentUserId,
  onSendMessage,
  onMarkAsRead,
  onDeleteMessage,
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null)
  const [typingUsers] = useState<string[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      conversationId: conversation.id,
      type: 'TEXT',
    },
  })

  const messageContent = watch('content')

  // 메시지 목록 로드
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/conversations/${conversation.id}/messages`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages)

          // 읽지 않은 메시지들을 읽음 처리
          const unreadMessages = data.messages
            .filter((msg: Message) => msg.senderId !== currentUserId && msg.status !== 'READ')
            .map((msg: Message) => msg.id)

          if (unreadMessages.length > 0) {
            await onMarkAsRead(unreadMessages)
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [conversation.id, currentUserId, onMarkAsRead])

  // 메시지 리스트 자동 스크롤
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 실시간 메시지 수신 (WebSocket)
  useEffect(() => {
    // 실제로는 WebSocket 연결을 통해 실시간 메시지 수신
    // const ws = new WebSocket(`ws://localhost:3000/conversations/${conversation.id}`)
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data)
    //   if (data.type === 'NEW_MESSAGE') {
    //     setMessages(prev => [...prev, data.message])
    //   } else if (data.type === 'TYPING_START') {
    //     setTypingUsers(prev => [...prev, data.userId])
    //   } else if (data.type === 'TYPING_STOP') {
    //     setTypingUsers(prev => prev.filter(id => id !== data.userId))
    //   }
    // }
    // return () => ws.close()
  }, [conversation.id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const onSubmit: SubmitHandler<CreateMessageInput> = async (data) => {
    if (!data.content.trim()) return

    setIsSending(true)
    try {
      const messageData = {
        ...data,
        replyToId: replyToMessage?.id,
      }

      await onSendMessage(messageData)
      reset()
      setReplyToMessage(null)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('conversationId', conversation.id)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()

        // 파일 첨부된 메시지 전송
        const messageData: CreateMessageInput = {
          conversationId: conversation.id,
          content: `파일을 전송했습니다: ${file.name}`,
          type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
          attachments: [
            {
              fileName: file.name,
              fileUrl: data.fileUrl,
              fileSize: file.size,
              mimeType: file.type,
            },
          ],
        }

        await onSendMessage(messageData)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReply = (message: Message) => {
    setReplyToMessage(message)
    // 입력창에 포커스
    document.querySelector('textarea')?.focus()
  }

  const cancelReply = () => {
    setReplyToMessage(null)
  }

  const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* 채팅 헤더 */}
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center space-x-3">
          {otherParticipant?.avatar ? (
            <Image
              src={otherParticipant.avatar}
              alt={otherParticipant.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
              <span className="text-sm font-medium text-gray-600">
                {otherParticipant?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold">
              {conversation.title || otherParticipant?.name || '채팅'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {otherParticipant?.isOnline ? (
                <span className="text-green-600">온라인</span>
              ) : (
                <span>
                  마지막 접속:{' '}
                  {otherParticipant?.lastSeen
                    ? format(new Date(otherParticipant.lastSeen), 'yyyy-MM-dd HH:mm:ss', {
                        locale: ko,
                      })
                    : '알 수 없음'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <PhoneIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <VideoIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500">
              <p>아직 메시지가 없습니다.</p>
              <p className="text-sm">첫 메시지를 보내보세요!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.senderId === currentUserId
              const showSender =
                !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId)
              const showTimestamp =
                index === messages.length - 1 ||
                new Date(messages[index + 1].createdAt).getTime() -
                  new Date(message.createdAt).getTime() >
                  5 * 60 * 1000

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showSender={showSender}
                  showTimestamp={showTimestamp}
                  onReply={handleReply}
                  onDelete={onDeleteMessage}
                />
              )
            })}

            {/* 타이핑 인디케이터 */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="rounded-full bg-gray-200 px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 답장 표시 */}
      {replyToMessage && (
        <div className="border-t border-blue-200 bg-blue-50 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900">
                {replyToMessage.senderName}에게 답장
              </div>
              <div className="truncate text-sm text-blue-700">{replyToMessage.content}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={cancelReply} className="text-blue-600">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 메시지 입력 */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Textarea
                placeholder="메시지를 입력하세요..."
                {...register('content')}
                rows={1}
                className="max-h-32 min-h-[40px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(onSubmit)()
                  }
                }}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperclipIcon className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>

              <Button
                type="submit"
                disabled={!messageContent?.trim() || isSending}
                className="px-3"
              >
                {isSending ? <LoadingSpinner size="sm" /> : <SendIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
