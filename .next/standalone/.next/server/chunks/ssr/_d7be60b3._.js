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
  786304,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(400187),
      e = a.i(368114)
    let f = (0, d.cva)(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap shrink-0',
        {
          variants: {
            variant: {
              default:
                'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
              secondary:
                'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
              destructive:
                'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
              outline: 'text-foreground',
              success: 'border-transparent bg-green-500 text-white shadow hover:bg-green-500/80',
              warning: 'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80',
              info: 'border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80',
            },
          },
          defaultVariants: { variant: 'default' },
        }
      ),
      g = c.forwardRef(({ className: a, variant: c, ...d }, g) =>
        (0, b.jsx)('div', { ref: g, className: (0, e.cn)(f({ variant: c }), a), ...d })
      )
    ;((g.displayName = 'Badge'), a.s(['Badge', () => g]))
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
  550537,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('search', [
      ['path', { d: 'm21 21-4.34-4.34', key: '14j7rj' }],
      ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
    ])
    a.s(['default', () => b])
  },
  312207,
  (a) => {
    'use strict'
    var b = a.i(550537)
    a.s(['SearchIcon', () => b.default])
  },
  870430,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(30553),
      e = c.forwardRef((a, c) =>
        (0, b.jsx)(d.Primitive.label, {
          ...a,
          ref: c,
          onMouseDown: (b) => {
            b.target.closest('button, input, select, textarea') ||
              (a.onMouseDown?.(b), !b.defaultPrevented && b.detail > 1 && b.preventDefault())
          },
        })
      )
    e.displayName = 'Label'
    var f = a.i(368114)
    function g({ className: a, ...c }) {
      return (0, b.jsx)(e, {
        'data-slot': 'label',
        className: (0, f.cn)(
          'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          a
        ),
        ...c,
      })
    }
    a.s(['Label', () => g], 870430)
  },
  315055,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(470121),
      e = a.i(750104),
      f = a.i(507554),
      g = a.i(225152),
      h = a.i(77994),
      i = a.i(3688),
      j = a.i(777192),
      k = a.i(30553),
      l = 'Checkbox',
      [m, n] = (0, e.createContextScope)(l),
      [o, p] = m(l)
    function q(a) {
      let {
          __scopeCheckbox: d,
          checked: e,
          children: f,
          defaultChecked: h,
          disabled: i,
          form: j,
          name: k,
          onCheckedChange: m,
          required: n,
          value: p = 'on',
          internal_do_not_use_render: q,
        } = a,
        [r, s] = (0, g.useControllableState)({
          prop: e,
          defaultProp: h ?? !1,
          onChange: m,
          caller: l,
        }),
        [t, u] = c.useState(null),
        [v, w] = c.useState(null),
        x = c.useRef(!1),
        z = !t || !!j || !!t.closest('form'),
        A = {
          checked: r,
          disabled: i,
          setChecked: s,
          control: t,
          setControl: u,
          name: k,
          form: j,
          value: p,
          hasConsumerStoppedPropagationRef: x,
          required: n,
          defaultChecked: !y(h) && h,
          isFormControl: z,
          bubbleInput: v,
          setBubbleInput: w,
        }
      return (0, b.jsx)(o, { scope: d, ...A, children: 'function' == typeof q ? q(A) : f })
    }
    var r = 'CheckboxTrigger',
      s = c.forwardRef(({ __scopeCheckbox: a, onKeyDown: e, onClick: g, ...h }, i) => {
        let {
            control: j,
            value: l,
            disabled: m,
            checked: n,
            required: o,
            setControl: q,
            setChecked: s,
            hasConsumerStoppedPropagationRef: t,
            isFormControl: u,
            bubbleInput: v,
          } = p(r, a),
          w = (0, d.useComposedRefs)(i, q),
          x = c.useRef(n)
        return (
          c.useEffect(() => {
            let a = j?.form
            if (a) {
              let b = () => s(x.current)
              return (a.addEventListener('reset', b), () => a.removeEventListener('reset', b))
            }
          }, [j, s]),
          (0, b.jsx)(k.Primitive.button, {
            type: 'button',
            role: 'checkbox',
            'aria-checked': y(n) ? 'mixed' : n,
            'aria-required': o,
            'data-state': z(n),
            'data-disabled': m ? '' : void 0,
            disabled: m,
            value: l,
            ...h,
            ref: w,
            onKeyDown: (0, f.composeEventHandlers)(e, (a) => {
              'Enter' === a.key && a.preventDefault()
            }),
            onClick: (0, f.composeEventHandlers)(g, (a) => {
              ;(s((a) => !!y(a) || !a),
                v &&
                  u &&
                  ((t.current = a.isPropagationStopped()), t.current || a.stopPropagation()))
            }),
          })
        )
      })
    s.displayName = r
    var t = c.forwardRef((a, c) => {
      let {
        __scopeCheckbox: d,
        name: e,
        checked: f,
        defaultChecked: g,
        required: h,
        disabled: i,
        value: j,
        onCheckedChange: k,
        form: l,
        ...m
      } = a
      return (0, b.jsx)(q, {
        __scopeCheckbox: d,
        checked: f,
        defaultChecked: g,
        disabled: i,
        required: h,
        onCheckedChange: k,
        name: e,
        form: l,
        value: j,
        internal_do_not_use_render: ({ isFormControl: a }) =>
          (0, b.jsxs)(b.Fragment, {
            children: [
              (0, b.jsx)(s, { ...m, ref: c, __scopeCheckbox: d }),
              a && (0, b.jsx)(x, { __scopeCheckbox: d }),
            ],
          }),
      })
    })
    t.displayName = l
    var u = 'CheckboxIndicator',
      v = c.forwardRef((a, c) => {
        let { __scopeCheckbox: d, forceMount: e, ...f } = a,
          g = p(u, d)
        return (0, b.jsx)(j.Presence, {
          present: e || y(g.checked) || !0 === g.checked,
          children: (0, b.jsx)(k.Primitive.span, {
            'data-state': z(g.checked),
            'data-disabled': g.disabled ? '' : void 0,
            ...f,
            ref: c,
            style: { pointerEvents: 'none', ...a.style },
          }),
        })
      })
    v.displayName = u
    var w = 'CheckboxBubbleInput',
      x = c.forwardRef(({ __scopeCheckbox: a, ...e }, f) => {
        let {
            control: g,
            hasConsumerStoppedPropagationRef: j,
            checked: l,
            defaultChecked: m,
            required: n,
            disabled: o,
            name: q,
            value: r,
            form: s,
            bubbleInput: t,
            setBubbleInput: u,
          } = p(w, a),
          v = (0, d.useComposedRefs)(f, u),
          x = (0, h.usePrevious)(l),
          z = (0, i.useSize)(g)
        c.useEffect(() => {
          if (!t) return
          let a = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked').set,
            b = !j.current
          if (x !== l && a) {
            let c = new Event('click', { bubbles: b })
            ;((t.indeterminate = y(l)), a.call(t, !y(l) && l), t.dispatchEvent(c))
          }
        }, [t, x, l, j])
        let A = c.useRef(!y(l) && l)
        return (0, b.jsx)(k.Primitive.input, {
          type: 'checkbox',
          'aria-hidden': !0,
          defaultChecked: m ?? A.current,
          required: n,
          disabled: o,
          name: q,
          value: r,
          form: s,
          ...e,
          tabIndex: -1,
          ref: v,
          style: {
            ...e.style,
            ...z,
            position: 'absolute',
            pointerEvents: 'none',
            opacity: 0,
            margin: 0,
            transform: 'translateX(-100%)',
          },
        })
      })
    function y(a) {
      return 'indeterminate' === a
    }
    function z(a) {
      return y(a) ? 'indeterminate' : a ? 'checked' : 'unchecked'
    }
    x.displayName = w
    var A = a.i(606406),
      B = a.i(368114)
    function C({ className: a, ...c }) {
      return (0, b.jsx)(t, {
        'data-slot': 'checkbox',
        className: (0, B.cn)(
          'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          a
        ),
        ...c,
        children: (0, b.jsx)(v, {
          'data-slot': 'checkbox-indicator',
          className: 'flex items-center justify-center text-current transition-none',
          children: (0, b.jsx)(A.CheckIcon, { className: 'size-3.5' }),
        }),
      })
    }
    a.s(['Checkbox', () => C], 315055)
  },
  839982,
  (a) => {
    'use strict'
    var b = a.i(622282)
    a.s(['CreditCardIcon', () => b.default])
  },
  895174,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('circle-alert', [
      ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
      ['line', { x1: '12', x2: '12', y1: '8', y2: '12', key: '1pkeuh' }],
      ['line', { x1: '12', x2: '12.01', y1: '16', y2: '16', key: '4dfq90' }],
    ])
    a.s(['default', () => b])
  },
  485155,
  (a) => {
    'use strict'
    var b = a.i(895174)
    a.s(['AlertCircleIcon', () => b.default])
  },
  558020,
  (a) => {
    'use strict'
    var b = a.i(152839)
    a.s(['ClockIcon', () => b.default])
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
  854251,
  (a) => {
    'use strict'
    var b = a.i(626405)
    a.s(['CheckCircleIcon', () => b.default])
  },
  783604,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('triangle-alert', [
      [
        'path',
        {
          d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
          key: 'wmoenq',
        },
      ],
      ['path', { d: 'M12 9v4', key: 'juzpu7' }],
      ['path', { d: 'M12 17h.01', key: 'p32p05' }],
    ])
    a.s(['default', () => b])
  },
  524660,
  (a) => {
    'use strict'
    var b = a.i(783604)
    a.s(['AlertTriangleIcon', () => b.default])
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
  511081,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('smartphone', [
      ['rect', { width: '14', height: '20', x: '5', y: '2', rx: '2', ry: '2', key: '1yt0o3' }],
      ['path', { d: 'M12 18h.01', key: 'mhygvu' }],
    ])
    a.s(['default', () => b])
  },
  524989,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('map-pin', [
      [
        'path',
        {
          d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
          key: '1r0f0z',
        },
      ],
      ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
    ])
    a.s(['default', () => b])
  },
  301378,
  (a) => {
    'use strict'
    var b = a.i(524989)
    a.s(['MapPinIcon', () => b.default])
  },
  275564,
  (a) => {
    'use strict'
    var b = a.i(447824)
    a.s(['ScissorsIcon', () => b.default])
  },
  973365,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('arrow-left', [
      ['path', { d: 'm12 19-7-7 7-7', key: '1l729n' }],
      ['path', { d: 'M19 12H5', key: 'x3x0zl' }],
    ])
    a.s(['default', () => b])
  },
  988552,
  (a) => {
    'use strict'
    var b = a.i(973365)
    a.s(['ArrowLeftIcon', () => b.default])
  },
  438500,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('shield-check', [
      [
        'path',
        {
          d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
          key: 'oel41y',
        },
      ],
      ['path', { d: 'm9 12 2 2 4-4', key: 'dzmm74' }],
    ])
    a.s(['ShieldCheckIcon', () => b], 438500)
  },
]

//# sourceMappingURL=_d7be60b3._.js.map
