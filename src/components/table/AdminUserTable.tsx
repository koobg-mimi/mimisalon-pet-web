'use client';

import { ko } from 'date-fns/locale';

import { format } from 'date-fns';
import { User as UserIcon, Phone, Mail, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './AdminUserTable.module.css';
import { User } from '@/hooks/useAdminUsers';

interface UsersResponse {
  users: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const getRoleBadgeColor = (role: User['role']) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-700';
    case 'GROOMER':
      return 'bg-blue-100 text-blue-700';
    case 'CUSTOMER':
      return 'bg-green-100 text-green-700';
  }
};

const getRoleDisplayName = (role: User['role']) => {
  switch (role) {
    case 'ADMIN':
      return '관리자';
    case 'GROOMER':
      return '미용사';
    case 'CUSTOMER':
      return '고객';
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko });
};

// Query configuration constants
const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 30 * 60 * 1000, // 30 minutes
  PAGE_SIZE: 50,
  ROOT_MARGIN: '100px',
  THRESHOLD: 0.1,
} as const;

export function AdminUserTable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'GROOMER' | 'ADMIN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Applied filters (triggers API calls)
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedRoleFilter, setAppliedRoleFilter] = useState<
    'ALL' | 'CUSTOMER' | 'GROOMER' | 'ADMIN'
  >('ALL');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>(
    'ALL'
  );

  // Infinite scroll state
  const [loadedPages, setLoadedPages] = useState([1]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const totalPagesRef = useRef(1);

  const limit = QUERY_CONFIG.PAGE_SIZE;

  // Apply filters
  const applyFilters = useCallback(() => {
    setAppliedSearchQuery(searchQuery);
    setAppliedRoleFilter(roleFilter);
    setAppliedStatusFilter(statusFilter);
    setLoadedPages([1]); // Reset to first page
  }, [searchQuery, roleFilter, statusFilter]);

  // Fetch function for a single page
  const fetchPage = useCallback(
    async (page: number): Promise<UsersResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: appliedSearchQuery,
        role: appliedRoleFilter,
        status: appliedStatusFilter,
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required');
        }
        if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions');
        }
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      return response.json();
    },
    [appliedSearchQuery, appliedRoleFilter, appliedStatusFilter, limit]
  );

  // Create queries for all loaded pages using useQueries
  const queries = loadedPages.map((page) => ({
    queryKey: [
      'admin',
      'users',
      'infinite',
      {
        page,
        searchQuery: appliedSearchQuery,
        roleFilter: appliedRoleFilter,
        statusFilter: appliedStatusFilter,
        limit,
      },
    ],
    queryFn: () => fetchPage(page),
    enabled: !!session?.user && session.user.role === 'ADMIN',
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: (failureCount: number, error: Error) => {
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  }));

  const results = useQueries({ queries });

  // Extract stable values from results for useMemo dependency
  const resultData = results.map((r) => r.data);
  const resultStatuses = results.map((r) => ({
    isLoading: r.isLoading,
    isError: r.isError,
    error: r.error,
  }));

  // Aggregate data from all loaded pages with deduplication
  const aggregatedData = useMemo((): {
    allUsers: User[];
    totalCount: number;
    totalPages: number;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  } => {
    const userMap = new Map<string, User>();
    let totalCount = 0;
    let totalPages = 1;
    let isLoading = false;
    let isError = false;
    let error: Error | null = null;

    resultData.forEach((data, index) => {
      if (data) {
        // Deduplicate users by ID
        data.users.forEach((user) => userMap.set(user.id, user));
        // Use the latest metadata from the most recent page
        if (index === resultData.length - 1) {
          totalCount = data.totalCount;
          totalPages = data.totalPages;
        }
      }
    });

    resultStatuses.forEach((status) => {
      if (status.isLoading) isLoading = true;
      if (status.isError) {
        isError = true;
        error = status.error as Error;
      }
    });

    return {
      allUsers: Array.from(userMap.values()),
      totalCount,
      totalPages,
      isLoading,
      isError,
      error,
    };
  }, [resultData, resultStatuses]);

  const { allUsers, totalCount, totalPages, isLoading, isError, error } = aggregatedData;

  // Update totalPagesRef when totalPages changes
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const hasMore = loadedPages[loadedPages.length - 1] < totalPages;

  // Load next page
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setLoadedPages((prev) => {
        const nextPage = prev[prev.length - 1] + 1;

        // Prefetch the next page ahead
        const prefetchPage = nextPage + 1;
        if (prefetchPage <= totalPagesRef.current) {
          queryClient.prefetchQuery({
            queryKey: [
              'admin',
              'users',
              'infinite',
              {
                page: prefetchPage,
                searchQuery: appliedSearchQuery,
                roleFilter: appliedRoleFilter,
                statusFilter: appliedStatusFilter,
                limit,
              },
            ],
            queryFn: () => fetchPage(prefetchPage),
            staleTime: QUERY_CONFIG.STALE_TIME,
          });
        }

        return [...prev, nextPage];
      });
    }
  }, [
    hasMore,
    isLoading,
    queryClient,
    appliedSearchQuery,
    appliedRoleFilter,
    appliedStatusFilter,
    fetchPage,
    limit,
  ]);

  // Reset when filters change
  useEffect(() => {
    setLoadedPages([1]);
  }, [appliedSearchQuery, appliedRoleFilter, appliedStatusFilter]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;

    if (!trigger) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: QUERY_CONFIG.ROOT_MARGIN,
        threshold: QUERY_CONFIG.THRESHOLD,
      }
    );

    observerRef.current.observe(trigger);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);

  // Loading and error states
  if (isLoading && allUsers.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (isError && allUsers.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-red-600">데이터를 불러오는데 실패했습니다</p>
          <p className="text-muted-foreground text-sm">
            {error instanceof Error ? error.message : '잠시 후 다시 시도해주세요'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="이름, 이메일, 전화번호로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) =>
                setRoleFilter(value as 'ALL' | 'CUSTOMER' | 'GROOMER' | 'ADMIN')
              }
            >
              <SelectTrigger className="h-10 w-full sm:w-[180px]">
                <SelectValue placeholder="역할 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 역할</SelectItem>
                <SelectItem value="CUSTOMER">고객</SelectItem>
                <SelectItem value="GROOMER">미용사</SelectItem>
                <SelectItem value="ADMIN">관리자</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
            >
              <SelectTrigger className="h-10 w-full sm:w-[180px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 상태</SelectItem>
                <SelectItem value="ACTIVE">활성</SelectItem>
                <SelectItem value="INACTIVE">비활성</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={applyFilters} variant="outline" className="h-10 w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              필터 적용
            </Button>
          </div>
          {totalCount > 0 && (
            <div className="text-muted-foreground mt-2 text-sm">
              총 {totalCount.toLocaleString('ko-KR')}명의 사용자 (페이지 {loadedPages.length} /{' '}
              {totalPages})
            </div>
          )}
        </CardContent>
      </Card>

      {/* Excel-style Table with Infinite Scroll */}
      <Card>
        <CardContent className="p-0">
          <div ref={scrollContainerRef} className={styles.scrollContainer}>
            <Table className={styles.excelTable} role="table" aria-label="사용자 목록">
              {/* Sticky Header */}
              <TableHeader role="rowgroup">
                <TableRow role="row">
                  <TableHead className={styles.colName} role="columnheader">
                    이름
                  </TableHead>
                  <TableHead className={styles.colEmail} role="columnheader">
                    이메일
                  </TableHead>
                  <TableHead className={styles.colPhone} role="columnheader">
                    전화번호
                  </TableHead>
                  <TableHead className={styles.colRole} role="columnheader">
                    역할
                  </TableHead>
                  <TableHead className={styles.colStatus} role="columnheader">
                    상태
                  </TableHead>
                  <TableHead className={styles.colCreated} role="columnheader">
                    가입일
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className={styles.emptyState}>
                        <p>사용자가 없습니다</p>
                        <p>필터 조건을 변경해보세요</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className={styles.cellContent}>
                        <div className={styles.cellAvatar}>
                          <UserIcon />
                        </div>
                        <span className={styles.cellText}>{user.name || '이름 없음'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.cellContent}>
                        <Mail className={styles.cellIcon} />
                        <span className={styles.cellTextLong}>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.phone && (
                        <div className={styles.cellContent}>
                          <Phone className={styles.cellIcon} />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={styles.cellContent}>
                        <span className={`${styles.roleBadge} ${getRoleBadgeColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                          {user.role === 'GROOMER' && user.groomerProfile?.isActive && ' ✓'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${styles.statusBadge} ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {user.isActive !== false ? '활성' : '비활성'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={loadMoreTriggerRef} className={styles.loadingTrigger}>
                {isLoading ? '로딩 중...' : '스크롤하여 더 보기'}
              </div>
            )}

            {!hasMore && allUsers.length > 0 && (
              <div className={styles.loadingTrigger}>모든 사용자를 불러왔습니다</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
