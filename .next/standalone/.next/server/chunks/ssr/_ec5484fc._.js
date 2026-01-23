module.exports = [
  941579,
  (a) => {
    'use strict'
    var b = a.i(999745),
      c = a.i(118544),
      d = a.i(376644),
      e = a.i(533791),
      f = a.i(479715),
      g = a.i(442871),
      h = a.i(508361),
      i = class extends e.Subscribable {
        constructor(a, b) {
          ;(super(),
            (this.options = b),
            (this.#a = a),
            (this.#b = null),
            (this.#c = (0, f.pendingThenable)()),
            this.bindMethods(),
            this.setOptions(b))
        }
        #a
        #d = void 0
        #e = void 0
        #f = void 0
        #g
        #h
        #c
        #b
        #i
        #j
        #k
        #l
        #m
        #n
        #o = new Set()
        bindMethods() {
          this.refetch = this.refetch.bind(this)
        }
        onSubscribe() {
          1 === this.listeners.size &&
            (this.#d.addObserver(this),
            j(this.#d, this.options) ? this.#p() : this.updateResult(),
            this.#q())
        }
        onUnsubscribe() {
          this.hasListeners() || this.destroy()
        }
        shouldFetchOnReconnect() {
          return k(this.#d, this.options, this.options.refetchOnReconnect)
        }
        shouldFetchOnWindowFocus() {
          return k(this.#d, this.options, this.options.refetchOnWindowFocus)
        }
        destroy() {
          ;((this.listeners = new Set()), this.#r(), this.#s(), this.#d.removeObserver(this))
        }
        setOptions(a) {
          let b = this.options,
            c = this.#d
          if (
            ((this.options = this.#a.defaultQueryOptions(a)),
            void 0 !== this.options.enabled &&
              'boolean' != typeof this.options.enabled &&
              'function' != typeof this.options.enabled &&
              'boolean' != typeof (0, g.resolveEnabled)(this.options.enabled, this.#d))
          )
            throw Error('Expected enabled to be a boolean or a callback that returns a boolean')
          ;(this.#t(),
            this.#d.setOptions(this.options),
            b._defaulted &&
              !(0, g.shallowEqualObjects)(this.options, b) &&
              this.#a
                .getQueryCache()
                .notify({ type: 'observerOptionsUpdated', query: this.#d, observer: this }))
          let d = this.hasListeners()
          ;(d && l(this.#d, c, this.options, b) && this.#p(),
            this.updateResult(),
            d &&
              (this.#d !== c ||
                (0, g.resolveEnabled)(this.options.enabled, this.#d) !==
                  (0, g.resolveEnabled)(b.enabled, this.#d) ||
                (0, g.resolveStaleTime)(this.options.staleTime, this.#d) !==
                  (0, g.resolveStaleTime)(b.staleTime, this.#d)) &&
              this.#u())
          let e = this.#v()
          d &&
            (this.#d !== c ||
              (0, g.resolveEnabled)(this.options.enabled, this.#d) !==
                (0, g.resolveEnabled)(b.enabled, this.#d) ||
              e !== this.#n) &&
            this.#w(e)
        }
        getOptimisticResult(a) {
          var b, c
          let d = this.#a.getQueryCache().build(this.#a, a),
            e = this.createResult(d, a)
          return (
            (b = this),
            (c = e),
            (0, g.shallowEqualObjects)(b.getCurrentResult(), c) ||
              ((this.#f = e), (this.#h = this.options), (this.#g = this.#d.state)),
            e
          )
        }
        getCurrentResult() {
          return this.#f
        }
        trackResult(a, b) {
          return new Proxy(a, {
            get: (a, c) => (
              this.trackProp(c),
              b?.(c),
              'promise' === c &&
                (this.trackProp('data'),
                this.options.experimental_prefetchInRender ||
                  'pending' !== this.#c.status ||
                  this.#c.reject(
                    Error('experimental_prefetchInRender feature flag is not enabled')
                  )),
              Reflect.get(a, c)
            ),
          })
        }
        trackProp(a) {
          this.#o.add(a)
        }
        getCurrentQuery() {
          return this.#d
        }
        refetch({ ...a } = {}) {
          return this.fetch({ ...a })
        }
        fetchOptimistic(a) {
          let b = this.#a.defaultQueryOptions(a),
            c = this.#a.getQueryCache().build(this.#a, b)
          return c.fetch().then(() => this.createResult(c, b))
        }
        fetch(a) {
          return this.#p({ ...a, cancelRefetch: a.cancelRefetch ?? !0 }).then(
            () => (this.updateResult(), this.#f)
          )
        }
        #p(a) {
          this.#t()
          let b = this.#d.fetch(this.options, a)
          return (a?.throwOnError || (b = b.catch(g.noop)), b)
        }
        #u() {
          this.#r()
          let a = (0, g.resolveStaleTime)(this.options.staleTime, this.#d)
          if (g.isServer || this.#f.isStale || !(0, g.isValidTimeout)(a)) return
          let b = (0, g.timeUntilStale)(this.#f.dataUpdatedAt, a)
          this.#l = h.timeoutManager.setTimeout(() => {
            this.#f.isStale || this.updateResult()
          }, b + 1)
        }
        #v() {
          return (
            ('function' == typeof this.options.refetchInterval
              ? this.options.refetchInterval(this.#d)
              : this.options.refetchInterval) ?? !1
          )
        }
        #w(a) {
          ;(this.#s(),
            (this.#n = a),
            !g.isServer &&
              !1 !== (0, g.resolveEnabled)(this.options.enabled, this.#d) &&
              (0, g.isValidTimeout)(this.#n) &&
              0 !== this.#n &&
              (this.#m = h.timeoutManager.setInterval(() => {
                ;(this.options.refetchIntervalInBackground || b.focusManager.isFocused()) &&
                  this.#p()
              }, this.#n)))
        }
        #q() {
          ;(this.#u(), this.#w(this.#v()))
        }
        #r() {
          this.#l && (h.timeoutManager.clearTimeout(this.#l), (this.#l = void 0))
        }
        #s() {
          this.#m && (h.timeoutManager.clearInterval(this.#m), (this.#m = void 0))
        }
        createResult(a, b) {
          let c,
            e = this.#d,
            h = this.options,
            i = this.#f,
            k = this.#g,
            n = this.#h,
            o = a !== e ? a.state : this.#e,
            { state: p } = a,
            q = { ...p },
            r = !1
          if (b._optimisticResults) {
            let c = this.hasListeners(),
              f = !c && j(a, b),
              g = c && l(a, e, b, h)
            ;((f || g) && (q = { ...q, ...(0, d.fetchState)(p.data, a.options) }),
              'isRestoring' === b._optimisticResults && (q.fetchStatus = 'idle'))
          }
          let { error: s, errorUpdatedAt: t, status: u } = q
          c = q.data
          let v = !1
          if (void 0 !== b.placeholderData && void 0 === c && 'pending' === u) {
            let a
            ;(i?.isPlaceholderData && b.placeholderData === n?.placeholderData
              ? ((a = i.data), (v = !0))
              : (a =
                  'function' == typeof b.placeholderData
                    ? b.placeholderData(this.#k?.state.data, this.#k)
                    : b.placeholderData),
              void 0 !== a && ((u = 'success'), (c = (0, g.replaceData)(i?.data, a, b)), (r = !0)))
          }
          if (b.select && void 0 !== c && !v)
            if (i && c === k?.data && b.select === this.#i) c = this.#j
            else
              try {
                ;((this.#i = b.select),
                  (c = b.select(c)),
                  (c = (0, g.replaceData)(i?.data, c, b)),
                  (this.#j = c),
                  (this.#b = null))
              } catch (a) {
                this.#b = a
              }
          this.#b && ((s = this.#b), (c = this.#j), (t = Date.now()), (u = 'error'))
          let w = 'fetching' === q.fetchStatus,
            x = 'pending' === u,
            y = 'error' === u,
            z = x && w,
            A = void 0 !== c,
            B = {
              status: u,
              fetchStatus: q.fetchStatus,
              isPending: x,
              isSuccess: 'success' === u,
              isError: y,
              isInitialLoading: z,
              isLoading: z,
              data: c,
              dataUpdatedAt: q.dataUpdatedAt,
              error: s,
              errorUpdatedAt: t,
              failureCount: q.fetchFailureCount,
              failureReason: q.fetchFailureReason,
              errorUpdateCount: q.errorUpdateCount,
              isFetched: q.dataUpdateCount > 0 || q.errorUpdateCount > 0,
              isFetchedAfterMount:
                q.dataUpdateCount > o.dataUpdateCount || q.errorUpdateCount > o.errorUpdateCount,
              isFetching: w,
              isRefetching: w && !x,
              isLoadingError: y && !A,
              isPaused: 'paused' === q.fetchStatus,
              isPlaceholderData: r,
              isRefetchError: y && A,
              isStale: m(a, b),
              refetch: this.refetch,
              promise: this.#c,
              isEnabled: !1 !== (0, g.resolveEnabled)(b.enabled, a),
            }
          if (this.options.experimental_prefetchInRender) {
            let b = (a) => {
                'error' === B.status ? a.reject(B.error) : void 0 !== B.data && a.resolve(B.data)
              },
              c = () => {
                b((this.#c = B.promise = (0, f.pendingThenable)()))
              },
              d = this.#c
            switch (d.status) {
              case 'pending':
                a.queryHash === e.queryHash && b(d)
                break
              case 'fulfilled':
                ;('error' === B.status || B.data !== d.value) && c()
                break
              case 'rejected':
                ;('error' !== B.status || B.error !== d.reason) && c()
            }
          }
          return B
        }
        updateResult() {
          let a = this.#f,
            b = this.createResult(this.#d, this.options)
          if (
            ((this.#g = this.#d.state),
            (this.#h = this.options),
            void 0 !== this.#g.data && (this.#k = this.#d),
            (0, g.shallowEqualObjects)(b, a))
          )
            return
          this.#f = b
          let c = () => {
            if (!a) return !0
            let { notifyOnChangeProps: b } = this.options,
              c = 'function' == typeof b ? b() : b
            if ('all' === c || (!c && !this.#o.size)) return !0
            let d = new Set(c ?? this.#o)
            return (
              this.options.throwOnError && d.add('error'),
              Object.keys(this.#f).some((b) => this.#f[b] !== a[b] && d.has(b))
            )
          }
          this.#x({ listeners: c() })
        }
        #t() {
          let a = this.#a.getQueryCache().build(this.#a, this.options)
          if (a === this.#d) return
          let b = this.#d
          ;((this.#d = a),
            (this.#e = a.state),
            this.hasListeners() && (b?.removeObserver(this), a.addObserver(this)))
        }
        onQueryUpdate() {
          ;(this.updateResult(), this.hasListeners() && this.#q())
        }
        #x(a) {
          c.notifyManager.batch(() => {
            ;(a.listeners &&
              this.listeners.forEach((a) => {
                a(this.#f)
              }),
              this.#a.getQueryCache().notify({ query: this.#d, type: 'observerResultsUpdated' }))
          })
        }
      }
    function j(a, b) {
      return (
        (!1 !== (0, g.resolveEnabled)(b.enabled, a) &&
          void 0 === a.state.data &&
          ('error' !== a.state.status || !1 !== b.retryOnMount)) ||
        (void 0 !== a.state.data && k(a, b, b.refetchOnMount))
      )
    }
    function k(a, b, c) {
      if (
        !1 !== (0, g.resolveEnabled)(b.enabled, a) &&
        'static' !== (0, g.resolveStaleTime)(b.staleTime, a)
      ) {
        let d = 'function' == typeof c ? c(a) : c
        return 'always' === d || (!1 !== d && m(a, b))
      }
      return !1
    }
    function l(a, b, c, d) {
      return (
        (a !== b || !1 === (0, g.resolveEnabled)(d.enabled, a)) &&
        (!c.suspense || 'error' !== a.state.status) &&
        m(a, c)
      )
    }
    function m(a, b) {
      return (
        !1 !== (0, g.resolveEnabled)(b.enabled, a) &&
        a.isStaleByTime((0, g.resolveStaleTime)(b.staleTime, a))
      )
    }
    a.s(['QueryObserver', () => i])
  },
  507967,
  484184,
  (a) => {
    'use strict'
    let b
    var c = a.i(572131)
    a.i(187924)
    var d = c.createContext(
        ((b = !1),
        {
          clearReset: () => {
            b = !1
          },
          reset: () => {
            b = !0
          },
          isReset: () => b,
        })
      ),
      e = () => c.useContext(d)
    a.s(['useQueryErrorResetBoundary', () => e], 507967)
    var f = a.i(442871),
      g = (a, b) => {
        ;(a.suspense || a.throwOnError || a.experimental_prefetchInRender) &&
          !b.isReset() &&
          (a.retryOnMount = !1)
      },
      h = (a) => {
        c.useEffect(() => {
          a.clearReset()
        }, [a])
      },
      i = ({ result: a, errorResetBoundary: b, throwOnError: c, query: d, suspense: e }) =>
        a.isError &&
        !b.isReset() &&
        !a.isFetching &&
        d &&
        ((e && void 0 === a.data) || (0, f.shouldThrowError)(c, [a.error, d]))
    a.s(
      [
        'ensurePreventErrorBoundaryRetry',
        () => g,
        'getHasError',
        () => i,
        'useClearResetErrorBoundary',
        () => h,
      ],
      484184
    )
  },
  545232,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = b.createContext(!1),
      d = () => b.useContext(c)
    ;(c.Provider, a.s(['useIsRestoring', () => d]))
  },
  552170,
  (a) => {
    'use strict'
    var b = (a) => {
        if (a.suspense) {
          let b = (a) => ('static' === a ? a : Math.max(a ?? 1e3, 1e3)),
            c = a.staleTime
          ;((a.staleTime = 'function' == typeof c ? (...a) => b(c(...a)) : b(c)),
            'number' == typeof a.gcTime && (a.gcTime = Math.max(a.gcTime, 1e3)))
        }
      },
      c = (a, b) => a.isLoading && a.isFetching && !b,
      d = (a, b) => a?.suspense && b.isPending,
      e = (a, b, c) =>
        b.fetchOptimistic(a).catch(() => {
          c.clearReset()
        })
    a.s([
      'ensureSuspenseTimers',
      () => b,
      'fetchOptimistic',
      () => e,
      'shouldSuspend',
      () => d,
      'willFetch',
      () => c,
    ])
  },
  433217,
  (a) => {
    'use strict'
    var b = a.i(941579),
      c = a.i(572131),
      d = a.i(442871),
      e = a.i(118544),
      f = a.i(937927),
      g = a.i(507967),
      h = a.i(484184),
      i = a.i(545232),
      j = a.i(552170)
    function k(a, k) {
      return (function (a, b, k) {
        let l = (0, i.useIsRestoring)(),
          m = (0, g.useQueryErrorResetBoundary)(),
          n = (0, f.useQueryClient)(k),
          o = n.defaultQueryOptions(a)
        ;(n.getDefaultOptions().queries?._experimental_beforeQuery?.(o),
          (o._optimisticResults = l ? 'isRestoring' : 'optimistic'),
          (0, j.ensureSuspenseTimers)(o),
          (0, h.ensurePreventErrorBoundaryRetry)(o, m),
          (0, h.useClearResetErrorBoundary)(m))
        let p = !n.getQueryCache().get(o.queryHash),
          [q] = c.useState(() => new b(n, o)),
          r = q.getOptimisticResult(o),
          s = !l && !1 !== a.subscribed
        if (
          (c.useSyncExternalStore(
            c.useCallback(
              (a) => {
                let b = s ? q.subscribe(e.notifyManager.batchCalls(a)) : d.noop
                return (q.updateResult(), b)
              },
              [q, s]
            ),
            () => q.getCurrentResult(),
            () => q.getCurrentResult()
          ),
          c.useEffect(() => {
            q.setOptions(o)
          }, [o, q]),
          (0, j.shouldSuspend)(o, r))
        )
          throw (0, j.fetchOptimistic)(o, q, m)
        if (
          (0, h.getHasError)({
            result: r,
            errorResetBoundary: m,
            throwOnError: o.throwOnError,
            query: n.getQueryCache().get(o.queryHash),
            suspense: o.suspense,
          })
        )
          throw r.error
        if (
          (n.getDefaultOptions().queries?._experimental_afterQuery?.(o, r),
          o.experimental_prefetchInRender && !d.isServer && (0, j.willFetch)(r, l))
        ) {
          let a = p ? (0, j.fetchOptimistic)(o, q, m) : n.getQueryCache().get(o.queryHash)?.promise
          a?.catch(d.noop).finally(() => {
            q.updateResult()
          })
        }
        return o.notifyOnChangeProps ? r : q.trackResult(r)
      })(a, b.QueryObserver, k)
    }
    a.s(['useQuery', () => k], 433217)
  },
  130656,
  (a) => {
    'use strict'
    function b(a, [b, c]) {
      return Math.min(c, Math.max(b, a))
    }
    a.s(['clamp', () => b])
  },
  77994,
  (a) => {
    'use strict'
    var b = a.i(572131)
    function c(a) {
      let c = b.useRef({ value: a, previous: a })
      return b.useMemo(
        () => (
          c.current.value !== a && ((c.current.previous = c.current.value), (c.current.value = a)),
          c.current.previous
        ),
        [a]
      )
    }
    a.s(['usePrevious', () => c])
  },
  504699,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('chevron-down', [
      ['path', { d: 'm6 9 6 6 6-6', key: 'qrunsl' }],
    ])
    a.s(['default', () => b])
  },
  177991,
  (a) => {
    'use strict'
    var b = a.i(504699)
    a.s(['ChevronDownIcon', () => b.default])
  },
  737984,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(368114)
    function d({ title: a, description: d, children: e, className: f }) {
      return (0, b.jsxs)('div', {
        className: (0, c.cn)(
          'container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
          f
        ),
        children: [
          (0, b.jsxs)('div', {
            className: 'min-w-0 flex-1',
            children: [
              (0, b.jsx)('h1', { className: 'text-foreground text-2xl font-bold', children: a }),
              d &&
                (0, b.jsx)('p', { className: 'text-muted-foreground mt-1 text-sm', children: d }),
            ],
          }),
          e &&
            (0, b.jsx)('div', {
              className:
                'flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0 sm:space-x-4',
              children: e,
            }),
        ],
      })
    }
    a.s(['PageHeader', () => d])
  },
  517756,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('chevron-left', [
      ['path', { d: 'm15 18-6-6 6-6', key: '1wnfg3' }],
    ])
    a.s(['default', () => b])
  },
  281643,
  (a) => {
    'use strict'
    var b = a.i(517756)
    a.s(['ChevronLeftIcon', () => b.default])
  },
  463052,
  (a) => {
    'use strict'
    var b = a.i(433217)
    async function c() {
      let a = await fetch('/api/env')
      if (!a.ok) throw Error('Failed to fetch environment configuration')
      return a.json()
    }
    function d() {
      return (0, b.useQuery)({
        queryKey: ['public-env'],
        queryFn: c,
        staleTime: 1 / 0,
        gcTime: 1 / 0,
        retry: 3,
        retryDelay: (a) => Math.min(1e3 * 2 ** a, 3e4),
      })
    }
    a.s(['usePublicEnv', () => d])
  },
  407385,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(281643),
      d = a.i(352254),
      e = a.i(368114),
      f = a.i(699570),
      g = a.i(580701)
    function h({
      currentPage: a,
      totalPages: h,
      pageSize: i,
      onPageChange: j,
      onPageSizeChange: k,
      className: l,
      pageSizeOptions: m = [10, 20, 50],
      showPageSizeSelector: n = !0,
      maxVisiblePages: o = 5,
    }) {
      let p = a > 1,
        q = a < h,
        r = (() => {
          if (h <= o + 2) return Array.from({ length: h }, (a, b) => b + 1)
          let b = [],
            c = Math.floor(o / 2)
          b.push(1)
          let d = Math.max(2, a - c),
            e = Math.min(h - 1, a + c)
          ;(a <= c + 1 ? (e = Math.min(h - 1, o)) : a >= h - c && (d = Math.max(2, h - o)),
            d > 2 && b.push('ellipsis'))
          for (let a = d; a <= e; a++) b.push(a)
          return (e < h - 1 && b.push('ellipsis'), h > 1 && b.push(h), b)
        })()
      return (0, b.jsxs)('div', {
        className: (0, e.cn)('flex flex-col items-center justify-between gap-4', 'sm:flex-row', l),
        children: [
          n &&
            k &&
            (0, b.jsxs)('div', {
              className: 'flex items-center gap-2',
              children: [
                (0, b.jsx)('span', {
                  className: 'text-muted-foreground text-sm whitespace-nowrap',
                  children: '페이지당',
                }),
                (0, b.jsxs)(g.Select, {
                  value: i.toString(),
                  onValueChange: (a) => k(Number(a)),
                  children: [
                    (0, b.jsx)(g.SelectTrigger, {
                      className: 'h-9 w-[70px] sm:w-[80px]',
                      children: (0, b.jsx)(g.SelectValue, {}),
                    }),
                    (0, b.jsx)(g.SelectContent, {
                      children: m.map((a) =>
                        (0, b.jsx)(g.SelectItem, { value: a.toString(), children: a }, a)
                      ),
                    }),
                  ],
                }),
                (0, b.jsx)('span', {
                  className: 'text-muted-foreground text-sm whitespace-nowrap',
                  children: '개씩 보기',
                }),
              ],
            }),
          (0, b.jsxs)('div', {
            className: 'flex items-center gap-1',
            children: [
              (0, b.jsx)(f.Button, {
                variant: 'outline',
                size: 'icon',
                onClick: () => j(a - 1),
                disabled: !p,
                className: 'h-9 w-9',
                'aria-label': '이전 페이지',
                children: (0, b.jsx)(c.ChevronLeftIcon, { className: 'h-4 w-4' }),
              }),
              (0, b.jsx)('div', {
                className: 'flex items-center gap-1',
                children: r.map((c, d) => {
                  if ('ellipsis' === c)
                    return (0, b.jsx)(
                      'div',
                      {
                        className: 'flex h-9 w-9 items-center justify-center',
                        children: (0, b.jsx)('span', {
                          className: 'text-muted-foreground',
                          children: '...',
                        }),
                      },
                      `ellipsis-${d}`
                    )
                  let g = c === a
                  return (0, b.jsx)(
                    f.Button,
                    {
                      variant: g ? 'default' : 'outline',
                      size: 'icon',
                      onClick: () => j(c),
                      className: (0, e.cn)('h-9 w-9', g && 'pointer-events-none'),
                      'aria-label': `페이지 ${c}`,
                      'aria-current': g ? 'page' : void 0,
                      children: c,
                    },
                    c
                  )
                }),
              }),
              (0, b.jsx)(f.Button, {
                variant: 'outline',
                size: 'icon',
                onClick: () => j(a + 1),
                disabled: !q,
                className: 'h-9 w-9',
                'aria-label': '다음 페이지',
                children: (0, b.jsx)(d.ChevronRightIcon, { className: 'h-4 w-4' }),
              }),
            ],
          }),
          (0, b.jsxs)('div', {
            className: 'text-muted-foreground text-sm sm:hidden',
            children: [a, ' / ', h, ' 페이지'],
          }),
        ],
      })
    }
    a.s(['EnhancedPagination', () => h])
  },
  638426,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(529139),
      d = a.i(50944),
      e = a.i(572131),
      f = a.i(433217),
      g = a.i(699570),
      h = a.i(205138),
      i = a.i(737984),
      j = a.i(407385),
      k = a.i(238246),
      l = a.i(256711),
      m = a.i(302491),
      n = a.i(400187),
      o = a.i(368114)
    let p = (a) => {
      switch (a) {
        case 'ALL':
          return '전체'
        case 'PAYMENT_COMPLETE':
          return '결제완료'
        case 'GROOMER_CONFIRM':
          return '확정'
        case 'SERVICE_COMPLETED':
          return '완료'
        case 'SERVICE_CANCELLED':
          return '취소'
        default:
          return a
      }
    }
    function q({ status: a, className: c = '' }) {
      return (0, b.jsx)('span', {
        className: `rounded-full px-2 py-1 text-xs font-medium ${((a) => {
          switch (a) {
            case 'FIRST_PAYMENT_PENDING':
            default:
              return 'text-gray-600 bg-gray-50'
            case 'FIRST_PAYMENT_COMPLETE':
              return 'text-yellow-600 bg-yellow-50'
            case 'FIRST_PAYMENT_VERIFY':
              return 'text-orange-600 bg-orange-50'
            case 'GROOMER_CONFIRM_PENDING':
              return 'text-purple-600 bg-purple-50'
            case 'GROOMER_CONFIRM':
              return 'text-blue-600 bg-blue-50'
            case 'ADDITIONAL_PAYMENT_PENDING':
              return 'text-amber-600 bg-amber-50'
            case 'ADDITIONAL_PAYMENT_COMPLETE':
              return 'text-amber-700 bg-amber-100'
            case 'WORK_IN_PROGRESS':
              return 'text-indigo-600 bg-indigo-50'
            case 'SERVICE_COMPLETED':
              return 'text-green-600 bg-green-50'
            case 'SERVICE_CANCELLED':
              return 'text-red-600 bg-red-50'
            case 'BOOKING_FAILED':
              return 'text-red-700 bg-red-100'
          }
        })(a)} ${c}`,
        children: ((a) => {
          switch (a) {
            case 'FIRST_PAYMENT_PENDING':
              return '결제대기'
            case 'FIRST_PAYMENT_COMPLETE':
              return '결제완료'
            case 'FIRST_PAYMENT_VERIFY':
              return '결제검증중'
            case 'GROOMER_CONFIRM_PENDING':
              return '미용사 확인중'
            case 'GROOMER_CONFIRM':
              return '확정'
            case 'ADDITIONAL_PAYMENT_PENDING':
              return '추가결제 대기'
            case 'ADDITIONAL_PAYMENT_COMPLETE':
              return '추가결제 완료'
            case 'WORK_IN_PROGRESS':
              return '작업중'
            case 'SERVICE_COMPLETED':
              return '완료'
            case 'SERVICE_CANCELLED':
              return '취소'
            case 'BOOKING_FAILED':
              return '예약실패'
            default:
              return a
          }
        })(a),
      })
    }
    let r = (0, n.cva)('rounded-lg border transition-all duration-300 overflow-hidden', {
        variants: {
          variant: {
            default:
              'border-border bg-card shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent before:translate-x-[-200%] before:duration-700',
            compact: 'border-border bg-card shadow-sm',
            detailed: 'border-border bg-card shadow-md',
            highlight:
              'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-md',
            minimal: 'border-border/50 bg-transparent',
          },
          size: { sm: 'p-4', default: 'p-5', lg: 'p-6' },
        },
        defaultVariants: { variant: 'default', size: 'default' },
      }),
      s = (0, n.cva)('flex items-start justify-between', {
        variants: { size: { sm: 'mb-3 gap-3', default: 'mb-4 gap-4', lg: 'mb-6 gap-6' } },
        defaultVariants: { size: 'default' },
      }),
      t = (0, n.cva)('font-semibold', {
        variants: { size: { sm: 'text-sm', default: 'text-base', lg: 'text-lg' } },
        defaultVariants: { size: 'default' },
      }),
      u = e.forwardRef(
        (
          { className: a, variant: c, size: d, booking: e, onContactCustomerService: f, ...h },
          i
        ) => {
          let j = e.pet || e.pets[0],
            n = e.services[0],
            p =
              e.services.length > 1
                ? `${n?.name} 외 ${e.services.length - 1}개`
                : n?.name || e.serviceType
          return (0, b.jsxs)('div', {
            ref: i,
            className: (0, o.cn)(r({ variant: c, size: d, className: a })),
            ...h,
            children: [
              (0, b.jsxs)('div', {
                className: (0, o.cn)(s({ size: d })),
                children: [
                  (0, b.jsxs)('div', {
                    className: 'min-w-0 flex-1',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'mb-1 flex flex-wrap items-center gap-2',
                        children: [
                          (0, b.jsx)('h3', {
                            className: (0, o.cn)(t({ size: d }), 'truncate'),
                            children: p,
                          }),
                          (0, b.jsx)(q, { status: e.status }),
                        ],
                      }),
                      (0, b.jsxs)('p', {
                        className: 'text-muted-foreground truncate text-sm',
                        children: [
                          j?.name,
                          ' (',
                          j?.breed?.name,
                          ') • ',
                          e.groomer.name,
                          ' 미용사',
                        ],
                      }),
                      (0, b.jsxs)('p', {
                        className: 'text-muted-foreground mt-1 text-xs',
                        children: ['예약번호: ', e.bookingNumber],
                      }),
                    ],
                  }),
                  (0, b.jsxs)('div', {
                    className: 'flex-shrink-0 text-right',
                    children: [
                      (0, b.jsxs)('p', {
                        className: (0, o.cn)(t({ size: d })),
                        children: [e.totalPrice.toLocaleString('ko-KR'), '원'],
                      }),
                      (0, b.jsxs)('p', {
                        className: 'text-muted-foreground text-sm whitespace-nowrap',
                        children: [
                          (0, l.format)(new Date(e.serviceDate), 'yyyy년 MM월 dd일', {
                            locale: m.ko,
                          }),
                          ' ',
                          e.serviceTime,
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, b.jsxs)('div', {
                className: 'flex flex-wrap items-center justify-between gap-2',
                children: [
                  (0, b.jsx)(g.Button, {
                    variant: 'outline',
                    size: 'sm',
                    asChild: !0,
                    children: (0, b.jsx)(k.default, {
                      href: `/customer/booking/${e.id}`,
                      children: '상세보기',
                    }),
                  }),
                  (0, b.jsxs)('div', {
                    className: 'flex flex-wrap gap-2',
                    children: [
                      ('FIRST_PAYMENT_COMPLETE' === e.status || 'SERVICE_CONFIRMED' === e.status) &&
                        (0, b.jsx)(g.Button, {
                          variant: 'outline',
                          size: 'sm',
                          onClick: f,
                          children: '취소 문의',
                        }),
                      'SERVICE_COMPLETED' === e.status &&
                        (0, b.jsx)(g.Button, {
                          size: 'sm',
                          asChild: !0,
                          children: (0, b.jsx)(k.default, {
                            href: `/review/create?bookingId=${e.id}`,
                            children: '리뷰 작성',
                          }),
                        }),
                    ],
                  }),
                ],
              }),
            ],
          })
        }
      )
    u.displayName = 'BookingCard'
    let v = {
        ALL: null,
        PAYMENT_COMPLETE: ['FIRST_PAYMENT_COMPLETE', 'GROOMER_CONFIRM_PENDING'],
        GROOMER_CONFIRM: ['GROOMER_CONFIRM'],
        SERVICE_COMPLETED: ['SERVICE_COMPLETED'],
        SERVICE_CANCELLED: ['SERVICE_CANCELLED'],
      },
      w = ['ALL', 'PAYMENT_COMPLETE', 'GROOMER_CONFIRM', 'SERVICE_COMPLETED', 'SERVICE_CANCELLED']
    function x({ activeFilter: a, onFilterChange: c }) {
      return (0, b.jsx)('div', {
        className: 'mb-6',
        children: (0, b.jsx)('div', {
          className: 'flex flex-wrap gap-2',
          children: w.map((d) =>
            (0, b.jsx)(
              g.Button,
              {
                variant: a === d ? 'default' : 'outline',
                size: 'sm',
                onClick: () => c(d),
                children: p(d),
              },
              d
            )
          ),
        }),
      })
    }
    function y({ filter: a }) {
      return (0, b.jsxs)('div', {
        className: 'py-12 text-center',
        children: [
          (0, b.jsx)('div', {
            className:
              'bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
            children: (0, b.jsx)('svg', {
              className: 'text-muted-foreground h-8 w-8',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24',
              children: (0, b.jsx)('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
              }),
            }),
          }),
          (0, b.jsx)('h3', {
            className: 'text-foreground mb-2 text-lg font-medium',
            children: 'ALL' === a ? '예약 내역이 없습니다' : `${p(a)} 예약이 없습니다`,
          }),
          (0, b.jsx)('p', {
            className: 'text-muted-foreground mb-4',
            children: '첫 번째 미용 예약을 만들어보세요.',
          }),
          (0, b.jsx)(g.Button, {
            asChild: !0,
            children: (0, b.jsx)(k.default, { href: '/booking/new', children: '예약하기' }),
          }),
        ],
      })
    }
    var z = a.i(463052)
    function A() {
      let { data: a, isPending: l } = (0, c.useSession)(),
        m = (0, d.useRouter)(),
        n = (0, d.useSearchParams)(),
        [o, p] = (0, e.useState)(n.get('filter') || 'ALL'),
        [q, r] = (0, e.useState)(Number(n.get('page')) || 1),
        [s, t] = (0, e.useState)(Number(n.get('limit')) || 10),
        w = (a, b, c) => {
          let d = new URLSearchParams()
          ;(d.set('page', a.toString()),
            d.set('limit', b.toString()),
            'ALL' !== c && d.set('filter', c),
            m.push(`?${d.toString()}`, { scroll: !1 }))
        },
        { data: A, isLoading: B } = (0, f.useQuery)({
          queryKey: ['customer', 'bookings', q, o, s],
          queryFn: async () => {
            let a = new URLSearchParams({ page: q.toString(), limit: s.toString() })
            if ('ALL' !== o) {
              let b = v[o]
              b && a.append('status', b.join(','))
            }
            let b = await fetch(`/api/customer/bookings?${a.toString()}`)
            if (!b.ok) throw Error('Failed to fetch bookings')
            return b.json()
          },
          enabled: !!a?.user && 'CUSTOMER' === a.user.role,
        }),
        C = A?.bookings || [],
        D = A?.totalPages || 1
      ;(0, e.useEffect)(() => {
        ;(a || m.push('/auth/signin'),
          a?.user?.role && 'CUSTOMER' !== a.user.role && m.push('/dashboard'))
      }, [a, m])
      let { data: E } = (0, z.usePublicEnv)(),
        F = () => {
          let a = E?.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE || '1588-1234'
          confirm(`고객센터로 연결하시겠습니까?
전화번호: ${a}`) && (window.location.href = `tel:${a}`)
        }
      return l || B
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(h.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'CUSTOMER'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsxs)(i.PageHeader, {
                    title: '예약 관리',
                    description: '미용 예약을 확인하고 관리하세요',
                    children: [
                      (0, b.jsx)(g.Button, {
                        asChild: !0,
                        children: (0, b.jsx)(k.default, {
                          href: '/booking/new',
                          children: '새 예약',
                        }),
                      }),
                      (0, b.jsx)(g.Button, {
                        variant: 'outline',
                        asChild: !0,
                        children: (0, b.jsx)(k.default, {
                          href: '/customer/dashboard/overview',
                          children: '대시보드',
                        }),
                      }),
                    ],
                  }),
                }),
                (0, b.jsxs)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: [
                    (0, b.jsx)(x, {
                      activeFilter: o,
                      onFilterChange: (a) => {
                        ;(p(a), r(1), w(1, s, a))
                      },
                    }),
                    0 === C.length
                      ? (0, b.jsx)(y, { filter: o })
                      : (0, b.jsxs)('div', {
                          className: 'space-y-8',
                          children: [
                            (0, b.jsx)('div', {
                              className: 'grid gap-6',
                              children: C.map((a) =>
                                (0, b.jsx)(u, { booking: a, onContactCustomerService: F }, a.id)
                              ),
                            }),
                            D > 0 &&
                              (0, b.jsx)('div', {
                                className: 'mt-8',
                                children: (0, b.jsx)(j.EnhancedPagination, {
                                  currentPage: q,
                                  totalPages: D,
                                  pageSize: s,
                                  onPageChange: (a) => {
                                    ;(r(a),
                                      w(a, s, o),
                                      window.scrollTo({ top: 0, behavior: 'smooth' }))
                                  },
                                  onPageSizeChange: (a) => {
                                    ;(t(a),
                                      r(1),
                                      w(1, a, o),
                                      window.scrollTo({ top: 0, behavior: 'smooth' }))
                                  },
                                  pageSizeOptions: [10, 20, 50],
                                  showPageSizeSelector: !0,
                                }),
                              }),
                          ],
                        }),
                  ],
                }),
              ],
            })
          : null
    }
    a.s(['default', () => A], 638426)
  },
]

//# sourceMappingURL=_ec5484fc._.js.map
