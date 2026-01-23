module.exports = [
  918622,
  (a, b, c) => {
    b.exports = a.x('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js', () =>
      require('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js')
    )
  },
  342602,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(918622)
  },
  187924,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored['react-ssr'].ReactJsxRuntime
  },
  572131,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored['react-ssr'].React
  },
  612794,
  (a) => {
    'use strict'
    var b = a.i(118544),
      c = a.i(885659),
      d = a.i(321778),
      e = class extends c.Removable {
        #a
        #b
        #c
        #d
        constructor(a) {
          ;(super(),
            (this.#a = a.client),
            (this.mutationId = a.mutationId),
            (this.#c = a.mutationCache),
            (this.#b = []),
            (this.state = a.state || f()),
            this.setOptions(a.options),
            this.scheduleGc())
        }
        setOptions(a) {
          ;((this.options = a), this.updateGcTime(this.options.gcTime))
        }
        get meta() {
          return this.options.meta
        }
        addObserver(a) {
          this.#b.includes(a) ||
            (this.#b.push(a),
            this.clearGcTimeout(),
            this.#c.notify({ type: 'observerAdded', mutation: this, observer: a }))
        }
        removeObserver(a) {
          ;((this.#b = this.#b.filter((b) => b !== a)),
            this.scheduleGc(),
            this.#c.notify({ type: 'observerRemoved', mutation: this, observer: a }))
        }
        optionalRemove() {
          this.#b.length ||
            ('pending' === this.state.status ? this.scheduleGc() : this.#c.remove(this))
        }
        continue() {
          return this.#d?.continue() ?? this.execute(this.state.variables)
        }
        async execute(a) {
          let b = () => {
              this.#e({ type: 'continue' })
            },
            c = { client: this.#a, meta: this.options.meta, mutationKey: this.options.mutationKey }
          this.#d = (0, d.createRetryer)({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(a, c)
                : Promise.reject(Error('No mutationFn found')),
            onFail: (a, b) => {
              this.#e({ type: 'failed', failureCount: a, error: b })
            },
            onPause: () => {
              this.#e({ type: 'pause' })
            },
            onContinue: b,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => this.#c.canRun(this),
          })
          let e = 'pending' === this.state.status,
            f = !this.#d.canStart()
          try {
            if (e) b()
            else {
              ;(this.#e({ type: 'pending', variables: a, isPaused: f }),
                await this.#c.config.onMutate?.(a, this, c))
              let b = await this.options.onMutate?.(a, c)
              b !== this.state.context &&
                this.#e({ type: 'pending', context: b, variables: a, isPaused: f })
            }
            let d = await this.#d.start()
            return (
              await this.#c.config.onSuccess?.(d, a, this.state.context, this, c),
              await this.options.onSuccess?.(d, a, this.state.context, c),
              await this.#c.config.onSettled?.(
                d,
                null,
                this.state.variables,
                this.state.context,
                this,
                c
              ),
              await this.options.onSettled?.(d, null, a, this.state.context, c),
              this.#e({ type: 'success', data: d }),
              d
            )
          } catch (b) {
            try {
              throw (
                await this.#c.config.onError?.(b, a, this.state.context, this, c),
                await this.options.onError?.(b, a, this.state.context, c),
                await this.#c.config.onSettled?.(
                  void 0,
                  b,
                  this.state.variables,
                  this.state.context,
                  this,
                  c
                ),
                await this.options.onSettled?.(void 0, b, a, this.state.context, c),
                b
              )
            } finally {
              this.#e({ type: 'error', error: b })
            }
          } finally {
            this.#c.runNext(this)
          }
        }
        #e(a) {
          ;((this.state = ((b) => {
            switch (a.type) {
              case 'failed':
                return { ...b, failureCount: a.failureCount, failureReason: a.error }
              case 'pause':
                return { ...b, isPaused: !0 }
              case 'continue':
                return { ...b, isPaused: !1 }
              case 'pending':
                return {
                  ...b,
                  context: a.context,
                  data: void 0,
                  failureCount: 0,
                  failureReason: null,
                  error: null,
                  isPaused: a.isPaused,
                  status: 'pending',
                  variables: a.variables,
                  submittedAt: Date.now(),
                }
              case 'success':
                return {
                  ...b,
                  data: a.data,
                  failureCount: 0,
                  failureReason: null,
                  error: null,
                  status: 'success',
                  isPaused: !1,
                }
              case 'error':
                return {
                  ...b,
                  data: void 0,
                  error: a.error,
                  failureCount: b.failureCount + 1,
                  failureReason: a.error,
                  isPaused: !1,
                  status: 'error',
                }
            }
          })(this.state)),
            b.notifyManager.batch(() => {
              ;(this.#b.forEach((b) => {
                b.onMutationUpdate(a)
              }),
                this.#c.notify({ mutation: this, type: 'updated', action: a }))
            }))
        }
      }
    function f() {
      return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: !1,
        status: 'idle',
        variables: void 0,
        submittedAt: 0,
      }
    }
    a.s(['Mutation', () => e, 'getDefaultState', () => f])
  },
  414202,
  (a) => {
    'use strict'
    var b = a.i(203686),
      c = a.i(519732)
    let d = (0, b.createApi)({
        reducerPath: 'adminPaymentsApi',
        baseQuery: (0, c.fetchBaseQuery)({ baseUrl: '/api' }),
        tagTypes: ['Payments', 'PaymentStats'],
        endpoints: (a) => ({
          getPayments: a.query({
            query: (a) => {
              let b = new URLSearchParams({ page: a.page.toString(), limit: a.limit.toString() })
              return (
                a.searchQuery && b.append('search', a.searchQuery),
                a.statusFilter && 'ALL' !== a.statusFilter && b.append('status', a.statusFilter),
                `/admin/payments?${b.toString()}`
              )
            },
            providesTags: (a) =>
              a
                ? [
                    { type: 'Payments', id: 'LIST' },
                    { type: 'PaymentStats', id: 'STATS' },
                    ...a.payments.map(({ id: a }) => ({ type: 'Payments', id: a })),
                  ]
                : [{ type: 'Payments', id: 'LIST' }],
            keepUnusedDataFor: 600,
          }),
        }),
      }),
      { useGetPaymentsQuery: e } = d,
      { getPayments: f } = d.endpoints
    a.s(['adminPaymentsApi', 0, d, 'useGetPaymentsQuery', 0, e])
  },
  545662,
  (a) => {
    'use strict'
    var b = a.i(203686),
      c = a.i(519732)
    let d = (0, b.createApi)({
        reducerPath: 'adminReviewsApi',
        baseQuery: (0, c.fetchBaseQuery)({ baseUrl: '/api' }),
        tagTypes: ['Reviews', 'ReviewStats'],
        endpoints: (a) => ({
          getReviews: a.query({
            query: (a) => {
              let b = new URLSearchParams()
              return (
                a.page && b.append('page', a.page.toString()),
                a.limit && b.append('limit', a.limit.toString()),
                a.search && b.append('search', a.search),
                a.rating && b.append('rating', a.rating.toString()),
                a.status && b.append('status', a.status),
                a.service && b.append('service', a.service),
                a.sortBy && b.append('sortBy', a.sortBy),
                a.sortOrder && b.append('sortOrder', a.sortOrder),
                `/admin/reviews?${b}`
              )
            },
            providesTags: (a) =>
              a
                ? [
                    { type: 'Reviews', id: 'LIST' },
                    { type: 'ReviewStats', id: 'STATS' },
                    ...a.reviews.map(({ id: a }) => ({ type: 'Reviews', id: a })),
                  ]
                : [{ type: 'Reviews', id: 'LIST' }],
            keepUnusedDataFor: 600,
          }),
          approveReview: a.mutation({
            query: (a) => ({ url: `/admin/reviews/${a}/approve`, method: 'POST' }),
            invalidatesTags: (a, b, c) => [
              { type: 'Reviews', id: c },
              { type: 'Reviews', id: 'LIST' },
              { type: 'ReviewStats', id: 'STATS' },
            ],
          }),
          flagReview: a.mutation({
            query: ({ reviewId: a, reason: b }) => ({
              url: `/admin/reviews/${a}/flag`,
              method: 'POST',
              body: { reason: b },
            }),
            invalidatesTags: (a, b, { reviewId: c }) => [
              { type: 'Reviews', id: c },
              { type: 'Reviews', id: 'LIST' },
              { type: 'ReviewStats', id: 'STATS' },
            ],
          }),
          deleteReview: a.mutation({
            query: (a) => ({ url: `/admin/reviews/${a}`, method: 'DELETE' }),
            invalidatesTags: (a, b, c) => [
              { type: 'Reviews', id: c },
              { type: 'Reviews', id: 'LIST' },
              { type: 'ReviewStats', id: 'STATS' },
            ],
          }),
          respondToReview: a.mutation({
            query: ({ reviewId: a, response: b }) => ({
              url: `/admin/reviews/${a}/respond`,
              method: 'POST',
              body: { response: b },
            }),
            invalidatesTags: (a, b, { reviewId: c }) => [
              { type: 'Reviews', id: c },
              { type: 'Reviews', id: 'LIST' },
              { type: 'ReviewStats', id: 'STATS' },
            ],
          }),
          hideReview: a.mutation({
            query: (a) => ({ url: `/admin/reviews/${a}/hide`, method: 'POST' }),
            invalidatesTags: (a, b, c) => [
              { type: 'Reviews', id: c },
              { type: 'Reviews', id: 'LIST' },
              { type: 'ReviewStats', id: 'STATS' },
            ],
          }),
        }),
      }),
      {
        useGetReviewsQuery: e,
        useApproveReviewMutation: f,
        useFlagReviewMutation: g,
        useDeleteReviewMutation: h,
        useRespondToReviewMutation: i,
        useHideReviewMutation: j,
      } = d
    a.s([
      'adminReviewsApi',
      0,
      d,
      'useApproveReviewMutation',
      0,
      f,
      'useDeleteReviewMutation',
      0,
      h,
      'useFlagReviewMutation',
      0,
      g,
      'useGetReviewsQuery',
      0,
      e,
      'useHideReviewMutation',
      0,
      j,
    ])
  },
  934949,
  (a) => {
    'use strict'
    var b = a.i(203686),
      c = a.i(519732)
    let d = (0, b.createApi)({
        reducerPath: 'adminGroomersApi',
        baseQuery: (0, c.fetchBaseQuery)({ baseUrl: '/api' }),
        tagTypes: ['Groomers', 'GroomerStats'],
        endpoints: (a) => ({
          getGroomers: a.query({
            query: (a) => {
              let b = new URLSearchParams({ page: a.page.toString(), limit: a.limit.toString() })
              return (
                a.searchQuery && b.append('search', a.searchQuery),
                a.statusFilter && 'ALL' !== a.statusFilter && b.append('status', a.statusFilter),
                a.locationFilter &&
                  'ALL' !== a.locationFilter &&
                  b.append('location', a.locationFilter),
                a.sortBy && b.append('sortBy', a.sortBy),
                a.sortOrder && b.append('sortOrder', a.sortOrder),
                `/admin/groomers?${b}`
              )
            },
            providesTags: (a) =>
              a
                ? [
                    ...a.groomers.map(({ id: a }) => ({ type: 'Groomers', id: a })),
                    { type: 'Groomers', id: 'LIST' },
                    { type: 'GroomerStats', id: 'STATS' },
                  ]
                : [{ type: 'Groomers', id: 'LIST' }],
            keepUnusedDataFor: 600,
          }),
          activateGroomer: a.mutation({
            query: (a) => ({ url: `/admin/groomers/${a}/activate`, method: 'POST' }),
            invalidatesTags: [
              { type: 'Groomers', id: 'LIST' },
              { type: 'GroomerStats', id: 'STATS' },
            ],
          }),
          deactivateGroomer: a.mutation({
            query: (a) => ({ url: `/admin/groomers/${a}/deactivate`, method: 'POST' }),
            invalidatesTags: [
              { type: 'Groomers', id: 'LIST' },
              { type: 'GroomerStats', id: 'STATS' },
            ],
          }),
          suspendGroomer: a.mutation({
            query: (a) => ({ url: `/admin/groomers/${a}/suspend`, method: 'POST' }),
            invalidatesTags: [
              { type: 'Groomers', id: 'LIST' },
              { type: 'GroomerStats', id: 'STATS' },
            ],
          }),
          updateCommissionGrade: a.mutation({
            query: ({ groomerId: a, commissionGradeId: b }) => ({
              url: `/admin/groomers/${a}/update-commission`,
              method: 'POST',
              body: { commissionGradeId: b },
            }),
            invalidatesTags: [{ type: 'Groomers', id: 'LIST' }],
          }),
          getCommissionGrades: a.query({
            query: ({ status: a = 'ACTIVE' } = {}) => `/admin/commission-grades?status=${a}`,
            keepUnusedDataFor: 600,
          }),
        }),
      }),
      {
        useGetGroomersQuery: e,
        useActivateGroomerMutation: f,
        useDeactivateGroomerMutation: g,
        useSuspendGroomerMutation: h,
        useUpdateCommissionGradeMutation: i,
        useGetCommissionGradesQuery: j,
      } = d
    a.s([
      'adminGroomersApi',
      0,
      d,
      'useActivateGroomerMutation',
      0,
      f,
      'useDeactivateGroomerMutation',
      0,
      g,
      'useGetCommissionGradesQuery',
      0,
      j,
      'useGetGroomersQuery',
      0,
      e,
      'useSuspendGroomerMutation',
      0,
      h,
      'useUpdateCommissionGradeMutation',
      0,
      i,
    ])
  },
  612101,
  (a) => {
    'use strict'
    var b = a.i(203686),
      c = a.i(519732),
      d = a.i(256711),
      e = a.i(302491)
    let f = (0, b.createApi)({
        reducerPath: 'adminBookingsApi',
        baseQuery: (0, c.fetchBaseQuery)({ baseUrl: '/api' }),
        tagTypes: ['Bookings'],
        endpoints: (a) => ({
          getBookings: a.query({
            query: (a) => {
              let b = a.dateFilter
                  ? (0, d.format)(new Date(a.dateFilter + 'T00:00:00'), 'yyyy-MM-dd', {
                      locale: e.ko,
                    })
                  : '',
                c = new URLSearchParams({
                  page: a.page.toString(),
                  limit: a.limit.toString(),
                  search: a.searchQuery,
                  status: a.statusFilter,
                  date: b,
                  sortBy: a.sortBy,
                  sortOrder: a.sortOrder,
                })
              return `/admin/bookings?${c}`
            },
            providesTags: (a) =>
              a
                ? [
                    ...a.bookings.map(({ id: a }) => ({ type: 'Bookings', id: a })),
                    { type: 'Bookings', id: 'LIST' },
                  ]
                : [{ type: 'Bookings', id: 'LIST' }],
            keepUnusedDataFor: 600,
          }),
          confirmBooking: a.mutation({
            query: (a) => ({ url: `/admin/bookings/${a}/confirm`, method: 'PATCH' }),
            invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
          }),
          cancelBooking: a.mutation({
            query: (a) => ({ url: `/admin/bookings/${a}/cancel`, method: 'PATCH' }),
            invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
          }),
          completeBooking: a.mutation({
            query: (a) => ({ url: `/admin/bookings/${a}/complete`, method: 'PATCH' }),
            invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
          }),
          deleteBooking: a.mutation({
            query: (a) => ({ url: `/admin/bookings/${a}`, method: 'DELETE' }),
            invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
          }),
        }),
      }),
      {
        useGetBookingsQuery: g,
        useConfirmBookingMutation: h,
        useCancelBookingMutation: i,
        useCompleteBookingMutation: j,
        useDeleteBookingMutation: k,
      } = f
    a.s([
      'adminBookingsApi',
      0,
      f,
      'useCancelBookingMutation',
      0,
      i,
      'useCompleteBookingMutation',
      0,
      j,
      'useConfirmBookingMutation',
      0,
      h,
      'useDeleteBookingMutation',
      0,
      k,
      'useGetBookingsQuery',
      0,
      g,
    ])
  },
  734305,
  (a) => {
    'use strict'
    var b = a.i(203686),
      c = a.i(519732)
    let d = (0, b.createApi)({
        reducerPath: 'breedsApi',
        baseQuery: (0, c.fetchBaseQuery)({ baseUrl: '/api/admin' }),
        tagTypes: ['Breeds'],
        endpoints: (a) => ({
          getBreeds: a.query({ query: () => '/breeds', providesTags: ['Breeds'] }),
          createBreeds: a.mutation({
            query: (a) => ({ url: '/breeds', method: 'POST', body: a }),
            invalidatesTags: ['Breeds'],
          }),
          deleteBreed: a.mutation({
            query: (a) => ({ url: `/breeds/${a}`, method: 'DELETE' }),
            invalidatesTags: ['Breeds'],
          }),
          updateBreed: a.mutation({
            query: ({ id: a, isActive: b }) => ({
              url: `/breeds/${a}`,
              method: 'PATCH',
              body: { isActive: b },
            }),
            invalidatesTags: ['Breeds'],
          }),
        }),
      }),
      {
        useGetBreedsQuery: e,
        useCreateBreedsMutation: f,
        useDeleteBreedMutation: g,
        useUpdateBreedMutation: h,
      } = d
    a.s([
      'breedsApiSlice',
      0,
      d,
      'useCreateBreedsMutation',
      0,
      f,
      'useDeleteBreedMutation',
      0,
      g,
      'useGetBreedsQuery',
      0,
      e,
      'useUpdateBreedMutation',
      0,
      h,
    ])
  },
  74694,
  (a) => {
    'use strict'
    var b = a.i(203686),
      c = a.i(519732)
    function d(a) {
      switch (a) {
        case 'week':
          return '최근 1주'
        case 'month':
        default:
          return '이번 달'
        case 'year':
          return '올해'
      }
    }
    let e = (0, b.createApi)({
        reducerPath: 'dashboardApi',
        baseQuery: (0, c.fetchBaseQuery)({ baseUrl: '/api' }),
        tagTypes: ['DashboardOverview'],
        endpoints: (a) => ({
          getDashboardOverview: a.query({
            query: (a) => `/admin/dashboard/overview?range=${a}`,
            transformResponse: (a) => {
              var b, c, e, f, g
              let h,
                i,
                {
                  metrics: j,
                  previousMetrics: k,
                  recentBookings: l,
                  topServices: m,
                  userGrowth: n,
                  monthlyRevenue: o,
                  range: p,
                  startDate: q,
                  endDate: r,
                } = a,
                s = {
                  metrics: j,
                  previousMetrics: k,
                  recentBookings: l.map((a) => ({
                    ...a,
                    serviceDate: a.serviceDate,
                    createdAt: a.createdAt,
                  })),
                  topServices: m,
                  userGrowth: n,
                  monthlyRevenue: o,
                  range: p,
                  startDate: q,
                  endDate: r,
                  previousStartDate: a.previousStartDate,
                  previousEndDate: a.previousEndDate,
                },
                t =
                  ((b = s.metrics),
                  0 === (c = s.previousMetrics).totalBookings
                    ? 0
                    : Math.round(
                        10 * (((b.totalBookings - c.totalBookings) / c.totalBookings) * 100)
                      ) / 10),
                u =
                  ((e = s.metrics),
                  0 === (f = s.previousMetrics).totalRevenue
                    ? 0
                    : Math.round(
                        10 * (((e.totalRevenue - f.totalRevenue) / f.totalRevenue) * 100)
                      ) / 10),
                v = new Set(
                  s.recentBookings.map((a) => a.groomerName).filter((a) => '미배정' !== a)
                ).size,
                w =
                  ((h = new Date()).setHours(0, 0, 0, 0),
                  (i = new Date(h)).setDate(i.getDate() + 1),
                  s.recentBookings.filter((a) => {
                    if ('SERVICE_COMPLETED' !== a.status) return !1
                    let b = new Date(a.serviceDate)
                    return b >= h && b < i
                  }).length),
                x = s.recentBookings
                  .map((a) => {
                    var b
                    return (
                      (b = a.status),
                      {
                        type: 'booking',
                        id: a.id,
                        customerName: a.customerName || '알 수 없음',
                        serviceName: `예약 #${a.bookingNumber}`,
                        status: a.status,
                        timestamp: a.createdAt,
                        amount: a.totalPrice,
                      }
                    )
                  })
                  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                  .slice(0, 20),
                y = s.topServices.map((a, b) => ({
                  serviceId: a.serviceId,
                  name: a.name,
                  bookings: a.bookingCount,
                  revenue: a.totalRevenue,
                  rating: 4.5,
                  satisfactionRate: 95,
                  rank: b + 1,
                  growth: 0,
                })),
                z = (g = s.monthlyRevenue).map((a, b) => {
                  let c = b > 0 ? g[b - 1] : { revenue: 0 },
                    d = c.revenue > 0 ? ((a.revenue - c.revenue) / c.revenue) * 100 : 0
                  return {
                    month: a.month,
                    value: a.revenue,
                    previousValue: c.revenue,
                    percentageChange: Math.round(10 * d) / 10,
                  }
                }),
                A = s.userGrowth.map((a) => ({
                  month: a.period,
                  newUsers: a.newUsers,
                  total: a.cumulativeUsers,
                }))
              return {
                totalBookings: j.totalBookings,
                totalRevenue: j.totalRevenue,
                totalCustomers: j.totalCustomers,
                activeServices: y.length,
                totalUsers: j.totalCustomers,
                activeGroomers: v,
                completedBookingsToday: w,
                pendingBookings: j.pendingBookings,
                averageRating: j.averageRating,
                bookingGrowth: t,
                revenueGrowth: u,
                monthlyGrowth: t,
                averageBookingValue: j.avgBookingValue,
                periodLabel: d(p),
                period: { startDate: q, endDate: r, label: d(p) },
                recentActivity: x,
                topServices: y,
                monthlyRevenue: z,
                userGrowth: A,
                isLoading: !1,
                error: null,
              }
            },
            providesTags: ['DashboardOverview'],
            keepUnusedDataFor: 600,
          }),
        }),
      }),
      { useGetDashboardOverviewQuery: f } = e
    a.s(['dashboardApi', 0, e, 'useGetDashboardOverviewQuery', 0, f], 74694)
  },
  570215,
  (a) => {
    'use strict'
    var b = a.i(603888),
      c = a.i(256711),
      d = a.i(302491)
    function e(a) {
      return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(a)
    }
    let f = {
        async initializeBooking(a) {
          let b = await fetch('/api/bookings/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(a),
          })
          if (!b.ok) throw Error((await b.json()).message || '예약 초기화에 실패했습니다')
          return b.json()
        },
        async initializePayment(a) {
          let b = await fetch('/api/payments/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(a),
          })
          if (!b.ok) throw Error((await b.json()).message || '결제 초기화에 실패했습니다')
          return b.json()
        },
        async getBooking(a) {
          let b = await fetch(`/api/bookings/${a}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!b.ok) throw Error((await b.json()).message || '예약 조회에 실패했습니다')
          let f = await b.json()
          return {
            ...f,
            scheduledAt: new Date(f.scheduledAt),
            formattedDate: (0, c.format)(new Date(f.scheduledAt), 'yyyy년 M월 d일 (EEEE)', {
              locale: d.ko,
            }),
            formattedTime: (0, c.format)(new Date(f.scheduledAt), 'HH:mm', { locale: d.ko }),
            formattedTotalAmount: e(f.totalAmount),
            services: f.services.map((a) => ({ ...a, formattedPrice: e(a.price) })),
            createdAt: new Date(f.createdAt),
            updatedAt: new Date(f.updatedAt),
            payment: f.payment
              ? { ...f.payment, paidAt: f.payment.paidAt ? new Date(f.payment.paidAt) : void 0 }
              : void 0,
          }
        },
        async getBookings(a) {
          let b = new URLSearchParams()
          ;(a?.userId && b.append('userId', a.userId),
            a?.status && b.append('status', a.status),
            a?.startDate && b.append('startDate', a.startDate),
            a?.endDate && b.append('endDate', a.endDate),
            a?.page && b.append('page', a.page.toString()),
            a?.pageSize && b.append('pageSize', a.pageSize.toString()))
          let f = await fetch(`/api/bookings?${b.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!f.ok) throw Error((await f.json()).message || '예약 목록 조회에 실패했습니다')
          let g = await f.json()
          return {
            bookings: g.bookings.map((a) => ({
              ...a,
              scheduledAt: new Date(a.scheduledAt),
              formattedDate: (0, c.format)(new Date(a.scheduledAt), 'yyyy년 M월 d일 (EEEE)', {
                locale: d.ko,
              }),
              formattedTime: (0, c.format)(new Date(a.scheduledAt), 'HH:mm', { locale: d.ko }),
              formattedTotalAmount: e(a.totalAmount),
              services: a.services.map((a) => ({ ...a, formattedPrice: e(a.price) })),
              createdAt: new Date(a.createdAt),
              updatedAt: new Date(a.updatedAt),
            })),
            pagination: g.pagination,
          }
        },
        async cancelBooking(a, b) {
          let c = await fetch(`/api/bookings/${a}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: b }),
          })
          if (!c.ok) throw Error((await c.json()).message || '예약 취소에 실패했습니다')
        },
        async updateBookingStatus(a, b) {
          let c = await fetch(`/api/bookings/${a}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: b }),
          })
          if (!c.ok) throw Error((await c.json()).message || '예약 상태 업데이트에 실패했습니다')
        },
      },
      g = {
        petServices: [],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      },
      h = (0, b.createAsyncThunk)('booking/initialize', async (a, { rejectWithValue: b }) => {
        try {
          return await f.initializeBooking(a)
        } catch (a) {
          return b(a.message || '예약 초기화에 실패했습니다')
        }
      }),
      i = (0, b.createAsyncThunk)(
        'booking/initializePayment',
        async ({ bookingId: a, amount: b, orderName: c }, { rejectWithValue: d }) => {
          try {
            return await f.initializePayment({ bookingId: a, amount: b, orderName: c })
          } catch (a) {
            return d(a.message || '결제 초기화에 실패했습니다')
          }
        }
      ),
      j = (0, b.createAsyncThunk)(
        'booking/cancel',
        async ({ bookingId: a, reason: b }, { rejectWithValue: c }) => {
          try {
            return (await f.cancelBooking(a, b), a)
          } catch (a) {
            return c(a.message || '예약 취소에 실패했습니다')
          }
        }
      ),
      k = (0, b.createSlice)({
        name: 'booking',
        initialState: {
          selectedBookingId: null,
          filters: { status: 'all' },
          isLoading: !1,
          error: null,
          isCreating: !1,
          isInitializingPayment: !1,
          formData: g,
          currentStep: 1,
          paymentId: null,
          currentGroomerPage: 1,
        },
        reducers: {
          selectBooking: (a, b) => {
            a.selectedBookingId = b.payload
          },
          clearSelectedBooking: (a) => {
            a.selectedBookingId = null
          },
          updateFilters: (a, b) => {
            a.filters = { ...a.filters, ...b.payload }
          },
          resetFilters: (a) => {
            a.filters = { status: 'all' }
          },
          clearError: (a) => {
            a.error = null
          },
          togglePet: (a, b) => {
            let c = b.payload,
              d = a.formData.petServices.findIndex((a) => a.petId === c.id)
            d >= 0
              ? a.formData.petServices.splice(d, 1)
              : a.formData.petServices.push({ petId: c.id, services: [], options: [] })
          },
          updateServices: (a, b) => {
            let { petId: c, services: d } = b.payload,
              e = a.formData.petServices.find((a) => a.petId === c)
            e && (e.services = d)
          },
          updateOptions: (a, b) => {
            let { petId: c, options: d } = b.payload,
              e = a.formData.petServices.find((a) => a.petId === c)
            e && (e.options = d)
          },
          updateAddress: (a, b) => {
            a.formData.addressId = b.payload
          },
          updateDate: (a, b) => {
            ;((a.formData.date = b.payload),
              (a.formData.timeSlot = ''),
              (a.formData.groomerId = ''))
          },
          updateGroomer: (a, b) => {
            ;((a.formData.groomerId = b.payload), (a.formData.timeSlot = ''))
          },
          updateTimeSlot: (a, b) => {
            a.formData.timeSlot = b.payload
          },
          updateSpecialRequests: (a, b) => {
            a.formData.specialRequests = b.payload
          },
          resetForm: (a) => {
            ;((a.formData = g),
              (a.currentStep = 1),
              (a.paymentId = null),
              (a.currentGroomerPage = 1))
          },
          nextStep: (a) => {
            a.currentStep < 4 && (a.currentStep = a.currentStep + 1)
          },
          prevStep: (a) => {
            a.currentStep > 1 && (a.currentStep = a.currentStep - 1)
          },
          goToStep: (a, b) => {
            a.currentStep = b.payload
          },
          updateGroomerPage: (a, b) => {
            a.currentGroomerPage = b.payload
          },
          setPaymentId: (a, b) => {
            a.paymentId = b.payload
          },
        },
        extraReducers: (a) => {
          ;(a
            .addCase(h.pending, (a) => {
              ;((a.isCreating = !0), (a.error = null))
            })
            .addCase(h.fulfilled, (a, b) => {
              ;((a.isCreating = !1), (a.selectedBookingId = b.payload.bookingId))
            })
            .addCase(h.rejected, (a, b) => {
              ;((a.isCreating = !1), (a.error = b.payload))
            }),
            a
              .addCase(i.pending, (a) => {
                ;((a.isInitializingPayment = !0), (a.error = null))
              })
              .addCase(i.fulfilled, (a, b) => {
                ;((a.isInitializingPayment = !1), (a.paymentId = b.payload.paymentId))
              })
              .addCase(i.rejected, (a, b) => {
                ;((a.isInitializingPayment = !1), (a.error = b.payload))
              }),
            a
              .addCase(j.pending, (a) => {
                ;((a.isLoading = !0), (a.error = null))
              })
              .addCase(j.fulfilled, (a) => {
                ;((a.isLoading = !1), (a.selectedBookingId = null))
              })
              .addCase(j.rejected, (a, b) => {
                ;((a.isLoading = !1), (a.error = b.payload))
              }))
        },
      }),
      {
        selectBooking: l,
        togglePet: m,
        updateServices: n,
        updateOptions: o,
        updateAddress: p,
        updateDate: q,
        updateGroomer: r,
        updateTimeSlot: s,
        updateSpecialRequests: t,
        resetForm: u,
        nextStep: v,
        prevStep: w,
        goToStep: x,
        updateGroomerPage: y,
        setPaymentId: z,
      } = k.actions,
      A = k.reducer
    a.s(
      [
        'default',
        0,
        A,
        'goToStep',
        0,
        x,
        'initializeBooking',
        0,
        h,
        'initializePayment',
        0,
        i,
        'nextStep',
        0,
        v,
        'prevStep',
        0,
        w,
        'resetForm',
        0,
        u,
        'togglePet',
        0,
        m,
        'updateAddress',
        0,
        p,
        'updateDate',
        0,
        q,
        'updateGroomer',
        0,
        r,
        'updateGroomerPage',
        0,
        y,
        'updateOptions',
        0,
        o,
        'updateServices',
        0,
        n,
        'updateSpecialRequests',
        0,
        t,
        'updateTimeSlot',
        0,
        s,
      ],
      570215
    )
  },
  659136,
  (a) => {
    'use strict'
    var b = a.i(203686),
      c = a.i(519732)
    let d = (0, b.createApi)({
        reducerPath: 'bookingQueryApi',
        baseQuery: (0, c.fetchBaseQuery)({ baseUrl: '/api' }),
        tagTypes: ['Pets', 'Addresses', 'Availability'],
        endpoints: (a) => ({
          getPets: a.query({ query: () => '/customer/pets', providesTags: ['Pets'] }),
          getAddresses: a.query({
            query: () => '/customer/addresses',
            providesTags: ['Addresses'],
          }),
          getAvailability: a.query({
            query: ({ date: a, addressId: b, page: c = 1, limit: d = 6 }) => {
              let e = new URLSearchParams()
              return (
                a && e.append('date', a),
                b && e.append('addressId', b),
                e.append('page', c.toString()),
                e.append('limit', d.toString()),
                `/bookings/availability?${e.toString()}`
              )
            },
            providesTags: ['Availability'],
            keepUnusedDataFor: 300,
          }),
        }),
      }),
      { useGetPetsQuery: e, useGetAddressesQuery: f, useGetAvailabilityQuery: g } = d
    a.s([
      'bookingQueryApi',
      0,
      d,
      'useGetAddressesQuery',
      0,
      f,
      'useGetAvailabilityQuery',
      0,
      g,
      'useGetPetsQuery',
      0,
      e,
    ])
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__0b7c33a9._.js.map
