import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
