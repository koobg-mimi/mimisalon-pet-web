'use client';

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface GroomerDashboardLayoutProps {
  children: ReactNode;
}

export default function GroomerDashboardLayout({ children }: GroomerDashboardLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
