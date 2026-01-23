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
  545232,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = b.createContext(!1),
      d = () => b.useContext(c)
    ;(c.Provider, a.s(['useIsRestoring', () => d]))
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
  216688,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('phone', [
      [
        'path',
        {
          d: 'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384',
          key: '9njp5v',
        },
      ],
    ])
    a.s(['default', () => b])
  },
  591119,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(368114)
    function d({ className: a, ...d }) {
      return (0, b.jsx)('div', {
        'data-slot': 'card',
        className: (0, c.cn)(
          'bg-card text-card-foreground rounded-lg border shadow-sm',
          'transition-all hover:shadow-md',
          'p-2 sm:p-3',
          'sm:rounded-xl sm:shadow',
          a
        ),
        ...d,
      })
    }
    function e({ className: a, ...d }) {
      return (0, b.jsx)('div', {
        'data-slot': 'card-header',
        className: (0, c.cn)('flex flex-col space-y-2 p-2 sm:p-2', a),
        ...d,
      })
    }
    function f({ className: a, ...d }) {
      return (0, b.jsx)('div', {
        'data-slot': 'card-title',
        className: (0, c.cn)('text-lg leading-none font-semibold tracking-tight', a),
        ...d,
      })
    }
    function g({ className: a, ...d }) {
      return (0, b.jsx)('div', {
        'data-slot': 'card-description',
        className: (0, c.cn)('text-muted-foreground text-sm', a),
        ...d,
      })
    }
    function h({ className: a, ...d }) {
      return (0, b.jsx)('div', {
        'data-slot': 'card-content',
        className: (0, c.cn)('p-2 sm:p-2', a),
        ...d,
      })
    }
    function i({ className: a, ...d }) {
      return (0, b.jsx)('div', {
        'data-slot': 'card-footer',
        className: (0, c.cn)(
          'flex items-center p-4 pt-0 sm:p-6 sm:pt-0',
          'flex-col gap-2 sm:flex-row sm:gap-0',
          a
        ),
        ...d,
      })
    }
    a.s([
      'Card',
      () => d,
      'CardContent',
      () => h,
      'CardDescription',
      () => g,
      'CardFooter',
      () => i,
      'CardHeader',
      () => e,
      'CardTitle',
      () => f,
    ])
  },
  626405,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('circle-check-big', [
      ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335', key: 'yps3ct' }],
      ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
    ])
    a.s(['default', () => b])
  },
  816201,
  (a) => {
    'use strict'
    var b = a.i(626405)
    a.s(['CheckCircle', () => b.default])
  },
  992258,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('mail', [
      ['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7', key: '132q7q' }],
      ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2', key: 'izxlao' }],
    ])
    a.s(['Mail', () => b], 992258)
  },
  963519,
  (a) => {
    'use strict'
    var b = a.i(216688)
    a.s(['Phone', () => b.default])
  },
  206015,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(368114)
    function d({ className: a, ...d }) {
      return (0, b.jsx)('div', {
        'data-slot': 'table-container',
        className: 'relative -mx-4 w-full overflow-x-auto px-4 sm:mx-0 sm:px-0',
        children: (0, b.jsx)('table', {
          'data-slot': 'table',
          className: (0, c.cn)('w-full caption-bottom text-sm', a),
          ...d,
        }),
      })
    }
    function e({ className: a, ...d }) {
      return (0, b.jsx)('thead', {
        'data-slot': 'table-header',
        className: (0, c.cn)('[&_tr]:border-b', a),
        ...d,
      })
    }
    function f({ className: a, ...d }) {
      return (0, b.jsx)('tbody', {
        'data-slot': 'table-body',
        className: (0, c.cn)('[&_tr:last-child]:border-0', a),
        ...d,
      })
    }
    function g({ className: a, ...d }) {
      return (0, b.jsx)('tr', {
        'data-slot': 'table-row',
        className: (0, c.cn)(
          'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
          a
        ),
        ...d,
      })
    }
    function h({ className: a, ...d }) {
      return (0, b.jsx)('th', {
        'data-slot': 'table-head',
        className: (0, c.cn)(
          'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
          a
        ),
        ...d,
      })
    }
    function i({ className: a, ...d }) {
      return (0, b.jsx)('td', {
        'data-slot': 'table-cell',
        className: (0, c.cn)(
          'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
          a
        ),
        ...d,
      })
    }
    a.s([
      'Table',
      () => d,
      'TableBody',
      () => f,
      'TableCell',
      () => i,
      'TableHead',
      () => h,
      'TableHeader',
      () => e,
      'TableRow',
      () => g,
    ])
  },
  369012,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('funnel', [
      [
        'path',
        {
          d: 'M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z',
          key: 'sc7q7i',
        },
      ],
    ])
    a.s(['Filter', () => b], 369012)
  },
  318826,
  318868,
  (a) => {
    'use strict'
    var b = a.i(187924)
    function c({ title: a, value: c, icon: d, iconBgColor: e, subtitle: f }) {
      return (0, b.jsx)('div', {
        className: 'border-border bg-card rounded-lg border p-6',
        children: (0, b.jsxs)('div', {
          className: 'flex items-center justify-between gap-4',
          children: [
            (0, b.jsxs)('div', {
              className: 'min-w-0 flex-1',
              children: [
                (0, b.jsx)('p', {
                  className: 'text-muted-foreground truncate text-sm',
                  children: a,
                }),
                (0, b.jsx)('p', {
                  className: 'text-foreground text-2xl font-bold whitespace-nowrap',
                  children: 'number' == typeof c ? c.toLocaleString('ko-KR') : c,
                }),
                f &&
                  (0, b.jsx)('p', {
                    className: 'text-muted-foreground mt-1 truncate text-xs',
                    children: f,
                  }),
              ],
            }),
            (0, b.jsx)('div', {
              className: `flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${e}`,
              children: d,
            }),
          ],
        }),
      })
    }
    function d({ children: a, compact: c = !1 }) {
      return (0, b.jsx)('div', {
        className: c
          ? 'mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'
          : 'mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        children: a,
      })
    }
    ;(a.s(['StatsCard', () => c], 318826), a.s(['StatsGrid', () => d], 318868))
  },
  724669,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('trending-up', [
      ['path', { d: 'M16 7h6v6', key: 'box55l' }],
      ['path', { d: 'm22 7-8.5 8.5-5-5L2 17', key: '1t1m79' }],
    ])
    a.s(['TrendingUp', () => b], 724669)
  },
  524667,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('circle-x', [
      ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
      ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
      ['path', { d: 'm9 9 6 6', key: 'z0biqf' }],
    ])
    a.s(['default', () => b])
  },
  862722,
  (a) => {
    'use strict'
    var b = a.i(524667)
    a.s(['XCircle', () => b.default])
  },
  46864,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('user-check', [
      ['path', { d: 'm16 11 2 2 4-4', key: '9rsbq5' }],
      ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
      ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
    ])
    a.s(['UserCheck', () => b], 46864)
  },
  468075,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(660246),
      e = a.i(941675),
      f = a.i(790166),
      g = a.i(821374),
      h = a.i(46864),
      i = a.i(28379),
      j = a.i(641710),
      k = a.i(816201),
      l = a.i(862722),
      m = a.i(724669),
      n = a.i(318826),
      o = a.i(318868)
    function p({ variant: a = 'overview' }) {
      let [p, q] = (0, c.useState)(null),
        [r, s] = (0, c.useState)(!0)
      if (
        ((0, c.useEffect)(() => {
          ;(async () => {
            try {
              let a = await fetch('/api/admin/stats')
              if (a.ok) {
                let b = await a.json()
                q(b)
              }
            } catch (a) {
              console.error('Failed to fetch admin stats:', a)
            } finally {
              s(!1)
            }
          })()
        }, []),
        r)
      )
        return (0, b.jsx)(o.StatsGrid, {
          children: [void 0, void 0, void 0, void 0].map((a, c) =>
            (0, b.jsx)(
              'div',
              {
                className: 'border-border bg-card animate-pulse rounded-lg border p-6',
                children: (0, b.jsxs)('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)('div', { className: 'bg-muted h-4 w-20 rounded' }),
                        (0, b.jsx)('div', { className: 'bg-muted h-8 w-16 rounded' }),
                      ],
                    }),
                    (0, b.jsx)('div', { className: 'bg-muted h-12 w-12 rounded-full' }),
                  ],
                }),
              },
              c
            )
          ),
        })
      if (!p) return null
      let t = (() => {
        switch (a) {
          case 'users':
            return [
              {
                title: '총 사용자',
                value: p.totalUsers,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '고객',
                value: p.totalCustomers,
                icon: (0, b.jsx)(h.UserCheck, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
              {
                title: '관리자',
                value: p.totalAdmins,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-red-600' }),
                color: 'bg-red-100',
              },
            ]
          case 'bookings':
            return [
              {
                title: '총 예약',
                value: p.totalBookings,
                icon: (0, b.jsx)(e.Calendar, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '대기중',
                value: p.pendingBookings,
                icon: (0, b.jsx)(j.Clock, { className: 'h-6 w-6 text-yellow-600' }),
                color: 'bg-yellow-100',
              },
              {
                title: '완료',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '취소',
                value: p.cancelledBookings,
                icon: (0, b.jsx)(l.XCircle, { className: 'h-6 w-6 text-red-600' }),
                color: 'bg-red-100',
              },
            ]
          case 'groomers':
            return [
              {
                title: '등록 미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
              {
                title: '완료 예약',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '평균 별점',
                value: p.averageRating.toFixed(1),
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-yellow-600' }),
                color: 'bg-yellow-100',
              },
              {
                title: '총 리뷰',
                value: p.totalReviews,
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-orange-600' }),
                color: 'bg-orange-100',
              },
            ]
          case 'reviews':
            return [
              {
                title: '총 리뷰',
                value: p.totalReviews,
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-yellow-600' }),
                color: 'bg-yellow-100',
              },
              {
                title: '평균 별점',
                value: p.averageRating.toFixed(1),
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-orange-600' }),
                color: 'bg-orange-100',
              },
              {
                title: '완료 예약',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '총 고객',
                value: p.totalCustomers,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
            ]
          case 'settlements':
            return [
              {
                title: '월 매출',
                value: `${p.monthlyRevenue.toLocaleString('ko-KR')}원`,
                icon: (0, b.jsx)(f.DollarSign, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '총 매출',
                value: `${p.totalRevenue.toLocaleString('ko-KR')}원`,
                icon: (0, b.jsx)(m.TrendingUp, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '등록 미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
              {
                title: '완료 예약',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
            ]
          default:
            return [
              {
                title: '총 사용자',
                value: p.totalUsers,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '총 예약',
                value: p.totalBookings,
                icon: (0, b.jsx)(e.Calendar, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '월 매출',
                value: `${p.monthlyRevenue.toLocaleString('ko-KR')}원`,
                icon: (0, b.jsx)(f.DollarSign, { className: 'text-primary h-6 w-6' }),
                color: 'bg-primary/10',
              },
              {
                title: '등록 미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
            ]
        }
      })()
      return (0, b.jsx)(o.StatsGrid, {
        children: t.map((a, c) =>
          (0, b.jsx)(
            n.StatsCard,
            { title: a.title, value: a.value, icon: a.icon, iconBgColor: a.color },
            c
          )
        ),
      })
    }
    a.s(['AdminStatsCards', () => p])
  },
]

//# sourceMappingURL=_6dac47a1._.js.map
