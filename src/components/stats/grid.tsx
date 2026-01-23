interface StatsGridProps {
  children: React.ReactNode;
  compact?: boolean;
}

export function StatsGrid({ children, compact = false }: StatsGridProps) {
  const gridClasses = compact
    ? 'mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'
    : 'mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return <div className={gridClasses}>{children}</div>;
}
