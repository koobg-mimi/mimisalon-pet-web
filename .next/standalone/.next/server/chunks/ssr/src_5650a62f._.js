module.exports = [
  738623,
  (a) => {
    a.v({
      actionButtons: 'AdminUserTable-module__yp4PzG__actionButtons',
      cellAvatar: 'AdminUserTable-module__yp4PzG__cellAvatar',
      cellContent: 'AdminUserTable-module__yp4PzG__cellContent',
      cellIcon: 'AdminUserTable-module__yp4PzG__cellIcon',
      cellText: 'AdminUserTable-module__yp4PzG__cellText',
      cellTextLong: 'AdminUserTable-module__yp4PzG__cellTextLong',
      colActions: 'AdminUserTable-module__yp4PzG__colActions',
      colCreated: 'AdminUserTable-module__yp4PzG__colCreated',
      colEmail: 'AdminUserTable-module__yp4PzG__colEmail',
      colLastLogin: 'AdminUserTable-module__yp4PzG__colLastLogin',
      colName: 'AdminUserTable-module__yp4PzG__colName',
      colPhone: 'AdminUserTable-module__yp4PzG__colPhone',
      colRole: 'AdminUserTable-module__yp4PzG__colRole',
      colStatus: 'AdminUserTable-module__yp4PzG__colStatus',
      emptyState: 'AdminUserTable-module__yp4PzG__emptyState',
      excelTable: 'AdminUserTable-module__yp4PzG__excelTable',
      loadingTrigger: 'AdminUserTable-module__yp4PzG__loadingTrigger',
      roleBadge: 'AdminUserTable-module__yp4PzG__roleBadge',
      scrollContainer: 'AdminUserTable-module__yp4PzG__scrollContainer',
      statusBadge: 'AdminUserTable-module__yp4PzG__statusBadge',
    })
  },
  645151,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(529139),
      d = a.i(50944),
      e = a.i(572131),
      f = a.i(660246),
      g = a.i(205138),
      h = a.i(737984),
      i = a.i(468075),
      j = a.i(302491),
      k = a.i(256711),
      l = a.i(546842),
      m = a.i(963519),
      n = a.i(992258),
      o = a.i(369012),
      p = a.i(699570),
      q = a.i(591119),
      r = a.i(866718),
      s = a.i(580701),
      t = a.i(206015),
      u = a.i(118544),
      v = a.i(941579),
      w = a.i(533791),
      x = a.i(442871)
    function y(a, b) {
      let c = new Set(b)
      return a.filter((a) => !c.has(a))
    }
    var z = class extends w.Subscribable {
        #a
        #b
        #c
        #d
        #e
        #f
        #g
        #h
        #i = []
        constructor(a, b, c) {
          ;(super(),
            (this.#a = a),
            (this.#d = c),
            (this.#c = []),
            (this.#e = []),
            (this.#b = []),
            this.setQueries(b))
        }
        onSubscribe() {
          1 === this.listeners.size &&
            this.#e.forEach((a) => {
              a.subscribe((b) => {
                this.#j(a, b)
              })
            })
        }
        onUnsubscribe() {
          this.listeners.size || this.destroy()
        }
        destroy() {
          ;((this.listeners = new Set()),
            this.#e.forEach((a) => {
              a.destroy()
            }))
        }
        setQueries(a, b) {
          ;((this.#c = a),
            (this.#d = b),
            u.notifyManager.batch(() => {
              let a = this.#e,
                b = this.#k(this.#c)
              ;((this.#i = b), b.forEach((a) => a.observer.setOptions(a.defaultedQueryOptions)))
              let c = b.map((a) => a.observer),
                d = c.map((a) => a.getCurrentResult()),
                e = a.length !== c.length,
                f = c.some((b, c) => b !== a[c]),
                g = e || f,
                h =
                  !!g ||
                  d.some((a, b) => {
                    let c = this.#b[b]
                    return !c || !(0, x.shallowEqualObjects)(a, c)
                  })
              ;(g || h) &&
                (g && (this.#e = c),
                (this.#b = d),
                this.hasListeners() &&
                  (g &&
                    (y(a, c).forEach((a) => {
                      a.destroy()
                    }),
                    y(c, a).forEach((a) => {
                      a.subscribe((b) => {
                        this.#j(a, b)
                      })
                    })),
                  this.#l()))
            }))
        }
        getCurrentResult() {
          return this.#b
        }
        getQueries() {
          return this.#e.map((a) => a.getCurrentQuery())
        }
        getObservers() {
          return this.#e
        }
        getOptimisticResult(a, b) {
          let c = this.#k(a),
            d = c.map((a) => a.observer.getOptimisticResult(a.defaultedQueryOptions))
          return [d, (a) => this.#m(a ?? d, b), () => this.#n(d, c)]
        }
        #n(a, b) {
          return b.map((c, d) => {
            let e = a[d]
            return c.defaultedQueryOptions.notifyOnChangeProps
              ? e
              : c.observer.trackResult(e, (a) => {
                  b.forEach((b) => {
                    b.observer.trackProp(a)
                  })
                })
          })
        }
        #m(a, b) {
          return b
            ? ((this.#f && this.#b === this.#h && b === this.#g) ||
                ((this.#g = b),
                (this.#h = this.#b),
                (this.#f = (0, x.replaceEqualDeep)(this.#f, b(a)))),
              this.#f)
            : a
        }
        #k(a) {
          let b = new Map(this.#e.map((a) => [a.options.queryHash, a])),
            c = []
          return (
            a.forEach((a) => {
              let d = this.#a.defaultQueryOptions(a),
                e = b.get(d.queryHash)
              e
                ? c.push({ defaultedQueryOptions: d, observer: e })
                : c.push({ defaultedQueryOptions: d, observer: new v.QueryObserver(this.#a, d) })
            }),
            c
          )
        }
        #j(a, b) {
          let c = this.#e.indexOf(a)
          if (-1 !== c) {
            var d
            let a
            ;((this.#b = ((d = this.#b), ((a = d.slice(0))[c] = b), a)), this.#l())
          }
        }
        #l() {
          if (this.hasListeners()) {
            let a = this.#f,
              b = this.#n(this.#b, this.#i)
            a !== this.#m(b, this.#d?.combine) &&
              u.notifyManager.batch(() => {
                this.listeners.forEach((a) => {
                  a(this.#b)
                })
              })
          }
        }
      },
      A = a.i(937927),
      B = a.i(545232),
      C = a.i(507967),
      D = a.i(484184),
      E = a.i(552170),
      F = a.i(738623)
    function G() {
      let { data: a } = (0, c.useSession)(),
        d = (0, A.useQueryClient)(),
        [f, g] = (0, e.useState)(''),
        [h, i] = (0, e.useState)('ALL'),
        [w, y] = (0, e.useState)('ALL'),
        [G, H] = (0, e.useState)(''),
        [I, J] = (0, e.useState)('ALL'),
        [K, L] = (0, e.useState)('ALL'),
        [M, N] = (0, e.useState)([1]),
        O = (0, e.useRef)(null),
        P = (0, e.useRef)(null),
        Q = (0, e.useRef)(null),
        R = (0, e.useRef)(1),
        S = (0, e.useCallback)(() => {
          ;(H(f), J(h), L(w), N([1]))
        }, [f, h, w]),
        T = (0, e.useCallback)(
          async (a) => {
            let b = new URLSearchParams({
                page: a.toString(),
                limit: '50',
                search: G,
                role: I,
                status: K,
              }),
              c = await fetch(`/api/admin/users?${b}`, {
                headers: { 'Content-Type': 'application/json' },
              })
            if (!c.ok) {
              if (401 === c.status) throw Error('Unauthorized: Admin access required')
              if (403 === c.status) throw Error('Forbidden: Insufficient permissions')
              throw Error(`Failed to fetch users: ${c.statusText}`)
            }
            return c.json()
          },
          [G, I, K, 50]
        ),
        U = (function ({ queries: a, ...b }, c) {
          let d = (0, A.useQueryClient)(void 0),
            f = (0, B.useIsRestoring)(),
            g = (0, C.useQueryErrorResetBoundary)(),
            h = e.useMemo(
              () =>
                a.map((a) => {
                  let b = d.defaultQueryOptions(a)
                  return ((b._optimisticResults = f ? 'isRestoring' : 'optimistic'), b)
                }),
              [a, d, f]
            )
          ;(h.forEach((a) => {
            ;((0, E.ensureSuspenseTimers)(a), (0, D.ensurePreventErrorBoundaryRetry)(a, g))
          }),
            (0, D.useClearResetErrorBoundary)(g))
          let [i] = e.useState(() => new z(d, h, b)),
            [j, k, l] = i.getOptimisticResult(h, b.combine),
            m = !f && !1 !== b.subscribed
          ;(e.useSyncExternalStore(
            e.useCallback((a) => (m ? i.subscribe(u.notifyManager.batchCalls(a)) : x.noop), [i, m]),
            () => i.getCurrentResult(),
            () => i.getCurrentResult()
          ),
            e.useEffect(() => {
              i.setQueries(h, b)
            }, [h, b, i]))
          let n = j.some((a, b) => (0, E.shouldSuspend)(h[b], a))
            ? j.flatMap((a, b) => {
                let c = h[b]
                if (c) {
                  let b = new v.QueryObserver(d, c)
                  if ((0, E.shouldSuspend)(c, a)) return (0, E.fetchOptimistic)(c, b, g)
                  ;(0, E.willFetch)(a, f) && (0, E.fetchOptimistic)(c, b, g)
                }
                return []
              })
            : []
          if (n.length > 0) throw Promise.all(n)
          let o = j.find((a, b) => {
            let c = h[b]
            return (
              c &&
              (0, D.getHasError)({
                result: a,
                errorResetBoundary: g,
                throwOnError: c.throwOnError,
                query: d.getQueryCache().get(c.queryHash),
                suspense: c.suspense,
              })
            )
          })
          if (o?.error) throw o.error
          return k(l())
        })({
          queries: M.map((b) => ({
            queryKey: [
              'admin',
              'users',
              'infinite',
              { page: b, searchQuery: G, roleFilter: I, statusFilter: K, limit: 50 },
            ],
            queryFn: () => T(b),
            enabled: !!a?.user && 'ADMIN' === a.user.role,
            staleTime: 3e5,
            gcTime: 18e5,
            retry: (a, b) =>
              !(b.message.includes('Unauthorized') || b.message.includes('Forbidden')) && a < 2,
            refetchOnWindowFocus: !1,
          })),
        }),
        V = U.map((a) => a.data),
        W = U.map((a) => ({ isLoading: a.isLoading, isError: a.isError, error: a.error })),
        {
          allUsers: X,
          totalCount: Y,
          totalPages: Z,
          isLoading: $,
          isError: _,
          error: aa,
        } = (0, e.useMemo)(() => {
          let a = new Map(),
            b = 0,
            c = 1,
            d = !1,
            e = !1,
            f = null
          return (
            V.forEach((d, e) => {
              d &&
                (d.users.forEach((b) => a.set(b.id, b)),
                e === V.length - 1 && ((b = d.totalCount), (c = d.totalPages)))
            }),
            W.forEach((a) => {
              ;(a.isLoading && (d = !0), a.isError && ((e = !0), (f = a.error)))
            }),
            {
              allUsers: Array.from(a.values()),
              totalCount: b,
              totalPages: c,
              isLoading: d,
              isError: e,
              error: f,
            }
          )
        }, [V, W])
      ;(0, e.useEffect)(() => {
        R.current = Z
      }, [Z])
      let ab = M[M.length - 1] < Z,
        ac = (0, e.useCallback)(() => {
          ab &&
            !$ &&
            N((a) => {
              let b = a[a.length - 1] + 1,
                c = b + 1
              return (
                c <= R.current &&
                  d.prefetchQuery({
                    queryKey: [
                      'admin',
                      'users',
                      'infinite',
                      { page: c, searchQuery: G, roleFilter: I, statusFilter: K, limit: 50 },
                    ],
                    queryFn: () => T(c),
                    staleTime: 3e5,
                  }),
                [...a, b]
              )
            })
        }, [ab, $, d, G, I, K, T, 50])
      return ((0, e.useEffect)(() => {
        N([1])
      }, [G, I, K]),
      (0, e.useEffect)(() => {
        let a = Q.current
        if (a)
          return (
            (P.current = new IntersectionObserver(
              (a) => {
                let [b] = a
                b.isIntersecting && ab && !$ && ac()
              },
              { root: O.current, rootMargin: '100px', threshold: 0.1 }
            )),
            P.current.observe(a),
            () => {
              P.current && P.current.disconnect()
            }
          )
      }, [ab, $, ac]),
      $ && 0 === X.length)
        ? (0, b.jsx)('div', {
            className: 'flex min-h-[400px] items-center justify-center',
            children: (0, b.jsx)('div', {
              className: 'text-muted-foreground',
              children: '로딩 중...',
            }),
          })
        : _ && 0 === X.length
          ? (0, b.jsx)('div', {
              className: 'flex min-h-[400px] items-center justify-center',
              children: (0, b.jsxs)('div', {
                className: 'text-center',
                children: [
                  (0, b.jsx)('p', {
                    className: 'mb-2 text-red-600',
                    children: '데이터를 불러오는데 실패했습니다',
                  }),
                  (0, b.jsx)('p', {
                    className: 'text-muted-foreground text-sm',
                    children: aa instanceof Error ? aa.message : '잠시 후 다시 시도해주세요',
                  }),
                ],
              }),
            })
          : (0, b.jsxs)(b.Fragment, {
              children: [
                (0, b.jsx)(q.Card, {
                  className: 'mb-6',
                  children: (0, b.jsxs)(q.CardContent, {
                    className: 'pt-6',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'flex flex-col gap-4 sm:flex-row sm:items-center',
                        children: [
                          (0, b.jsx)('div', {
                            className: 'relative flex-1',
                            children: (0, b.jsx)(r.Input, {
                              type: 'search',
                              placeholder: '이름, 이메일, 전화번호로 검색...',
                              value: f,
                              onChange: (a) => g(a.target.value),
                              onKeyDown: (a) => 'Enter' === a.key && S(),
                            }),
                          }),
                          (0, b.jsxs)(s.Select, {
                            value: h,
                            onValueChange: (a) => i(a),
                            children: [
                              (0, b.jsx)(s.SelectTrigger, {
                                className: 'h-10 w-full sm:w-[180px]',
                                children: (0, b.jsx)(s.SelectValue, { placeholder: '역할 필터' }),
                              }),
                              (0, b.jsxs)(s.SelectContent, {
                                children: [
                                  (0, b.jsx)(s.SelectItem, { value: 'ALL', children: '모든 역할' }),
                                  (0, b.jsx)(s.SelectItem, { value: 'CUSTOMER', children: '고객' }),
                                  (0, b.jsx)(s.SelectItem, {
                                    value: 'GROOMER',
                                    children: '미용사',
                                  }),
                                  (0, b.jsx)(s.SelectItem, { value: 'ADMIN', children: '관리자' }),
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)(s.Select, {
                            value: w,
                            onValueChange: (a) => y(a),
                            children: [
                              (0, b.jsx)(s.SelectTrigger, {
                                className: 'h-10 w-full sm:w-[180px]',
                                children: (0, b.jsx)(s.SelectValue, { placeholder: '상태 필터' }),
                              }),
                              (0, b.jsxs)(s.SelectContent, {
                                children: [
                                  (0, b.jsx)(s.SelectItem, { value: 'ALL', children: '모든 상태' }),
                                  (0, b.jsx)(s.SelectItem, { value: 'ACTIVE', children: '활성' }),
                                  (0, b.jsx)(s.SelectItem, {
                                    value: 'INACTIVE',
                                    children: '비활성',
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)(p.Button, {
                            onClick: S,
                            variant: 'outline',
                            className: 'h-10 w-full sm:w-auto',
                            children: [
                              (0, b.jsx)(o.Filter, { className: 'mr-2 h-4 w-4' }),
                              '필터 적용',
                            ],
                          }),
                        ],
                      }),
                      Y > 0 &&
                        (0, b.jsxs)('div', {
                          className: 'text-muted-foreground mt-2 text-sm',
                          children: [
                            '총 ',
                            Y.toLocaleString('ko-KR'),
                            '명의 사용자 (페이지 ',
                            M.length,
                            ' /',
                            ' ',
                            Z,
                            ')',
                          ],
                        }),
                    ],
                  }),
                }),
                (0, b.jsx)(q.Card, {
                  children: (0, b.jsx)(q.CardContent, {
                    className: 'p-0',
                    children: (0, b.jsxs)('div', {
                      ref: O,
                      className: F.default.scrollContainer,
                      children: [
                        (0, b.jsxs)(t.Table, {
                          className: F.default.excelTable,
                          role: 'table',
                          'aria-label': '사용자 목록',
                          children: [
                            (0, b.jsx)(t.TableHeader, {
                              role: 'rowgroup',
                              children: (0, b.jsxs)(t.TableRow, {
                                role: 'row',
                                children: [
                                  (0, b.jsx)(t.TableHead, {
                                    className: F.default.colName,
                                    role: 'columnheader',
                                    children: '이름',
                                  }),
                                  (0, b.jsx)(t.TableHead, {
                                    className: F.default.colEmail,
                                    role: 'columnheader',
                                    children: '이메일',
                                  }),
                                  (0, b.jsx)(t.TableHead, {
                                    className: F.default.colPhone,
                                    role: 'columnheader',
                                    children: '전화번호',
                                  }),
                                  (0, b.jsx)(t.TableHead, {
                                    className: F.default.colRole,
                                    role: 'columnheader',
                                    children: '역할',
                                  }),
                                  (0, b.jsx)(t.TableHead, {
                                    className: F.default.colStatus,
                                    role: 'columnheader',
                                    children: '상태',
                                  }),
                                  (0, b.jsx)(t.TableHead, {
                                    className: F.default.colCreated,
                                    role: 'columnheader',
                                    children: '가입일',
                                  }),
                                ],
                              }),
                            }),
                            (0, b.jsxs)(t.TableBody, {
                              children: [
                                0 === X.length &&
                                  !$ &&
                                  (0, b.jsx)(t.TableRow, {
                                    children: (0, b.jsx)(t.TableCell, {
                                      colSpan: 6,
                                      children: (0, b.jsxs)('div', {
                                        className: F.default.emptyState,
                                        children: [
                                          (0, b.jsx)('p', { children: '사용자가 없습니다' }),
                                          (0, b.jsx)('p', { children: '필터 조건을 변경해보세요' }),
                                        ],
                                      }),
                                    }),
                                  }),
                                X.map((a) => {
                                  let c
                                  return (0, b.jsxs)(
                                    t.TableRow,
                                    {
                                      children: [
                                        (0, b.jsx)(t.TableCell, {
                                          children: (0, b.jsxs)('div', {
                                            className: F.default.cellContent,
                                            children: [
                                              (0, b.jsx)('div', {
                                                className: F.default.cellAvatar,
                                                children: (0, b.jsx)(l.User, {}),
                                              }),
                                              (0, b.jsx)('span', {
                                                className: F.default.cellText,
                                                children: a.name || '이름 없음',
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, b.jsx)(t.TableCell, {
                                          children: (0, b.jsxs)('div', {
                                            className: F.default.cellContent,
                                            children: [
                                              (0, b.jsx)(n.Mail, { className: F.default.cellIcon }),
                                              (0, b.jsx)('span', {
                                                className: F.default.cellTextLong,
                                                children: a.email,
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, b.jsx)(t.TableCell, {
                                          children:
                                            a.phone &&
                                            (0, b.jsxs)('div', {
                                              className: F.default.cellContent,
                                              children: [
                                                (0, b.jsx)(m.Phone, {
                                                  className: F.default.cellIcon,
                                                }),
                                                (0, b.jsx)('span', { children: a.phone }),
                                              ],
                                            }),
                                        }),
                                        (0, b.jsx)(t.TableCell, {
                                          children: (0, b.jsx)('div', {
                                            className: F.default.cellContent,
                                            children: (0, b.jsxs)('span', {
                                              className: `${F.default.roleBadge} ${((a) => {
                                                switch (a) {
                                                  case 'ADMIN':
                                                    return 'bg-red-100 text-red-700'
                                                  case 'GROOMER':
                                                    return 'bg-blue-100 text-blue-700'
                                                  case 'CUSTOMER':
                                                    return 'bg-green-100 text-green-700'
                                                }
                                              })(a.role)}`,
                                              children: [
                                                ((a) => {
                                                  switch (a) {
                                                    case 'ADMIN':
                                                      return '관리자'
                                                    case 'GROOMER':
                                                      return '미용사'
                                                    case 'CUSTOMER':
                                                      return '고객'
                                                  }
                                                })(a.role),
                                                'GROOMER' === a.role &&
                                                  a.groomerProfile?.isActive &&
                                                  ' ✓',
                                              ],
                                            }),
                                          }),
                                        }),
                                        (0, b.jsx)(t.TableCell, {
                                          children: (0, b.jsx)('span', {
                                            className: `${F.default.statusBadge} ${!1 !== a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`,
                                            children: !1 !== a.isActive ? '활성' : '비활성',
                                          }),
                                        }),
                                        (0, b.jsx)(t.TableCell, {
                                          children:
                                            ((c = a.createdAt),
                                            (0, k.format)(new Date(c), 'yyyy-MM-dd', {
                                              locale: j.ko,
                                            })),
                                        }),
                                      ],
                                    },
                                    a.id
                                  )
                                }),
                              ],
                            }),
                          ],
                        }),
                        ab &&
                          (0, b.jsx)('div', {
                            ref: Q,
                            className: F.default.loadingTrigger,
                            children: $ ? '로딩 중...' : '스크롤하여 더 보기',
                          }),
                        !ab &&
                          X.length > 0 &&
                          (0, b.jsx)('div', {
                            className: F.default.loadingTrigger,
                            children: '모든 사용자를 불러왔습니다',
                          }),
                      ],
                    }),
                  }),
                }),
              ],
            })
    }
    function H() {
      let { data: a, isPending: j } = (0, c.useSession)(),
        k = (0, d.useRouter)()
      return ((0, e.useEffect)(() => {
        ;(a || k.push('/auth/signin'),
          a?.user?.role && 'ADMIN' !== a.user.role && k.push('/admin/dashboard/overview'))
      }, [a, k]),
      j)
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(g.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'ADMIN'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsx)(h.PageHeader, {
                    title: '사용자 관리',
                    description: '플랫폼 사용자를 관리하고 모니터링하세요',
                    children: (0, b.jsx)('div', {
                      className: 'flex items-center gap-2',
                      children: (0, b.jsx)(f.Users, { className: 'text-primary h-5 w-5' }),
                    }),
                  }),
                }),
                (0, b.jsx)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: (0, b.jsxs)('div', {
                    className: 'space-y-6',
                    children: [
                      (0, b.jsx)(i.AdminStatsCards, { variant: 'users' }),
                      (0, b.jsx)(G, {}),
                    ],
                  }),
                }),
              ],
            })
          : null
    }
    a.s(['default', () => H], 645151)
  },
]

//# sourceMappingURL=src_5650a62f._.js.map
