'use client';

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
