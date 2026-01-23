'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BellIcon,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TermsNavigationProps {
  serviceTerms: React.ReactNode
  privacyPolicy: React.ReactNode
  paymentTerms: React.ReactNode
  marketingTerms: React.ReactNode
}

type TabType = 'service' | 'privacy' | 'payment' | 'marketing'

const sections = [
  {
    id: 'service' as TabType,
    title: '서비스 이용약관',
    icon: FileTextIcon,
  },
  {
    id: 'privacy' as TabType,
    title: '개인정보처리방침',
    icon: ShieldCheckIcon,
  },
  {
    id: 'payment' as TabType,
    title: '결제 및 환불 정책',
    icon: CreditCardIcon,
  },
  {
    id: 'marketing' as TabType,
    title: '마케팅 정보 수신',
    icon: BellIcon,
  },
]

export default function TermsNavigation({
  serviceTerms,
  privacyPolicy,
  paymentTerms,
  marketingTerms,
}: TermsNavigationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState<TabType>(() => {
    const tab = searchParams.get('tab')
    if (tab && ['service', 'privacy', 'payment', 'marketing'].includes(tab)) {
      return tab as TabType
    }
    return 'service'
  })

  const contentMap = {
    service: serviceTerms,
    privacy: privacyPolicy,
    payment: paymentTerms,
    marketing: marketingTerms,
  }

  // Update section when URL query parameter changes
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['service', 'privacy', 'payment', 'marketing'].includes(tab)) {
      setActiveSection(tab as TabType)
    }
  }, [searchParams])

  return (
    <>
      {/* Back Button - All screen sizes */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 hidden sm:inline-flex">
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        뒤로가기
      </Button>

      {/* Mobile: Simple List Navigation */}
      <div className="sm:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg p-4 transition-colors',
                  isActive ? 'bg-primary text-white' : 'border bg-white hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-gray-600')} />
                  <span className="text-left font-medium">{section.title}</span>
                </div>
                <ChevronRightIcon
                  className={cn('h-5 w-5', isActive ? 'text-white' : 'text-gray-400')}
                />
              </button>
            )
          })}
        </div>
        {activeSection && (
          <div className="mt-4">
            <div className="rounded-lg border bg-white p-4">
              <div className="mb-4 flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-semibold">
                  {sections.find((s) => s.id === activeSection)?.title}
                </h3>
                <Button size="sm" variant="ghost" onClick={() => setActiveSection('service')}>
                  닫기
                </Button>
              </div>
              <ScrollArea className="h-[50vh]">
                <div className="pr-4">{contentMap[activeSection]}</div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Sidebar Layout */}
      <div className="hidden gap-6 lg:flex">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors',
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <ScrollArea className="h-[75vh] rounded-lg border bg-white p-6">
            <div className="max-w-4xl">{contentMap[activeSection]}</div>
          </ScrollArea>
        </div>
      </div>

      {/* Tablet: Vertical Button List */}
      <div className="hidden sm:block lg:hidden">
        <div className="mb-4 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors',
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border bg-gray-50 text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{section.title}</span>
              </button>
            )
          })}
        </div>
        <ScrollArea className="h-[65vh] rounded-lg border bg-white p-5">
          {contentMap[activeSection]}
        </ScrollArea>
      </div>
    </>
  )
}
