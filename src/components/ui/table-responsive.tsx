'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ResponsiveTableProps<T extends Record<string, any>> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    className?: string;
    render?: (value: any, item: T) => React.ReactNode;
    priority?: 'high' | 'medium' | 'low'; // For mobile display priority
  }[];
  className?: string;
  mobileCardClassName?: string;
  onRowClick?: (item: T) => void;
}

/**
 * ResponsiveTable component that displays as a table on desktop and cards on mobile
 * High priority columns are shown prominently in mobile view
 */
export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  mobileCardClassName,
  onRowClick,
}: ResponsiveTableProps<T>) {
  const highPriorityColumns = columns.filter((col) => col.priority === 'high');
  const mediumPriorityColumns = columns.filter((col) => col.priority === 'medium' || !col.priority);
  const lowPriorityColumns = columns.filter((col) => col.priority === 'low');

  return (
    <>
      {/* Desktop Table View */}
      <div className={cn('hidden sm:block', className)}>
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
                      column.className
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
                        column.className
                      )}
                    >
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className={cn('space-y-4 sm:hidden', mobileCardClassName)}>
        {data.map((item, index) => (
          <Card
            key={index}
            className={cn(
              'transition-all active:scale-[0.99]',
              onRowClick && 'active:bg-accent/50 cursor-pointer'
            )}
            onClick={() => onRowClick?.(item)}
          >
            <CardContent className="p-4">
              {/* High Priority Items - Displayed prominently */}
              {highPriorityColumns.length > 0 && (
                <div className="mb-3">
                  {highPriorityColumns.map((column) => (
                    <div key={String(column.key)} className="text-base font-semibold">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </div>
                  ))}
                </div>
              )}

              {/* Medium Priority Items */}
              {mediumPriorityColumns.length > 0 && (
                <div className="space-y-2">
                  {mediumPriorityColumns.map((column) => (
                    <div key={String(column.key)} className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">{column.label}:</span>
                      <span className="text-sm font-medium">
                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Low Priority Items - Shown smaller or collapsed */}
              {lowPriorityColumns.length > 0 && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <div className="flex flex-wrap gap-3">
                    {lowPriorityColumns.map((column) => (
                      <div key={String(column.key)} className="text-xs">
                        <span className="text-muted-foreground">{column.label}: </span>
                        <span className="font-medium">
                          {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/**
 * Simple responsive wrapper for existing tables
 * Adds horizontal scroll on mobile with better UX
 */
export function ResponsiveTableWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative w-full',
        '-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0', // Full width scroll on mobile
        'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100', // Custom scrollbar
        className
      )}
    >
      <div className="inline-block min-w-full align-middle">{children}</div>
      {/* Scroll indicator for mobile */}
      <div className="from-background pointer-events-none absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l sm:hidden" />
    </div>
  );
}
