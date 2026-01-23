module.exports = [
  736313,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored.contexts.HooksClientContext
  },
  818341,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored.contexts.ServerInsertedHtml
  },
  556704,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/work-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-async-storage.external.js')
    )
  },
  832319,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/work-unit-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-unit-async-storage.external.js')
    )
  },
  120635,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/action-async-storage.external.js', () =>
      require('next/dist/server/app-render/action-async-storage.external.js')
    )
  },
  909270,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored.contexts.AppRouterContext
  },
  738783,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored['react-ssr'].ReactServerDOMTurbopackClient
  },
  808591,
  (a, b, c) => {
    'use strict'
    ;(Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'useMergedRef', {
        enumerable: !0,
        get: function () {
          return e
        },
      }))
    let d = a.r(572131)
    function e(a, b) {
      let c = (0, d.useRef)(null),
        e = (0, d.useRef)(null)
      return (0, d.useCallback)(
        (d) => {
          if (null === d) {
            let a = c.current
            a && ((c.current = null), a())
            let b = e.current
            b && ((e.current = null), b())
          } else (a && (c.current = f(a, d)), b && (e.current = f(b, d)))
        },
        [a, b]
      )
    }
    function f(a, b) {
      if ('function' != typeof a)
        return (
          (a.current = b),
          () => {
            a.current = null
          }
        )
      {
        let c = a(b)
        return 'function' == typeof c ? c : () => a(null)
      }
    }
    ;('function' == typeof c.default || ('object' == typeof c.default && null !== c.default)) &&
      void 0 === c.default.__esModule &&
      (Object.defineProperty(c.default, '__esModule', { value: !0 }),
      Object.assign(c.default, c),
      (b.exports = c.default))
  },
  192434,
  (a, b, c) => {
    'use strict'
    ;(Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'warnOnce', {
        enumerable: !0,
        get: function () {
          return d
        },
      }))
    let d = (a) => {}
  },
  370025,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = a.i(612794),
      d = a.i(118544),
      e = a.i(533791),
      f = a.i(442871),
      g = class extends e.Subscribable {
        #a
        #b = void 0
        #c
        #d
        constructor(a, b) {
          ;(super(), (this.#a = a), this.setOptions(b), this.bindMethods(), this.#e())
        }
        bindMethods() {
          ;((this.mutate = this.mutate.bind(this)), (this.reset = this.reset.bind(this)))
        }
        setOptions(a) {
          let b = this.options
          ;((this.options = this.#a.defaultMutationOptions(a)),
            (0, f.shallowEqualObjects)(this.options, b) ||
              this.#a
                .getMutationCache()
                .notify({ type: 'observerOptionsUpdated', mutation: this.#c, observer: this }),
            b?.mutationKey &&
            this.options.mutationKey &&
            (0, f.hashKey)(b.mutationKey) !== (0, f.hashKey)(this.options.mutationKey)
              ? this.reset()
              : this.#c?.state.status === 'pending' && this.#c.setOptions(this.options))
        }
        onUnsubscribe() {
          this.hasListeners() || this.#c?.removeObserver(this)
        }
        onMutationUpdate(a) {
          ;(this.#e(), this.#f(a))
        }
        getCurrentResult() {
          return this.#b
        }
        reset() {
          ;(this.#c?.removeObserver(this), (this.#c = void 0), this.#e(), this.#f())
        }
        mutate(a, b) {
          return (
            (this.#d = b),
            this.#c?.removeObserver(this),
            (this.#c = this.#a.getMutationCache().build(this.#a, this.options)),
            this.#c.addObserver(this),
            this.#c.execute(a)
          )
        }
        #e() {
          let a = this.#c?.state ?? (0, c.getDefaultState)()
          this.#b = {
            ...a,
            isPending: 'pending' === a.status,
            isSuccess: 'success' === a.status,
            isError: 'error' === a.status,
            isIdle: 'idle' === a.status,
            mutate: this.mutate,
            reset: this.reset,
          }
        }
        #f(a) {
          d.notifyManager.batch(() => {
            if (this.#d && this.hasListeners()) {
              let b = this.#b.variables,
                c = this.#b.context,
                d = {
                  client: this.#a,
                  meta: this.options.meta,
                  mutationKey: this.options.mutationKey,
                }
              a?.type === 'success'
                ? (this.#d.onSuccess?.(a.data, b, c, d), this.#d.onSettled?.(a.data, null, b, c, d))
                : a?.type === 'error' &&
                  (this.#d.onError?.(a.error, b, c, d),
                  this.#d.onSettled?.(void 0, a.error, b, c, d))
            }
            this.listeners.forEach((a) => {
              a(this.#b)
            })
          })
        }
      },
      h = a.i(937927)
    function i(a, c) {
      let e = (0, h.useQueryClient)(c),
        [i] = b.useState(() => new g(e, a))
      b.useEffect(() => {
        i.setOptions(a)
      }, [i, a])
      let j = b.useSyncExternalStore(
          b.useCallback((a) => i.subscribe(d.notifyManager.batchCalls(a)), [i]),
          () => i.getCurrentResult(),
          () => i.getCurrentResult()
        ),
        k = b.useCallback(
          (a, b) => {
            i.mutate(a, b).catch(f.noop)
          },
          [i]
        )
      if (j.error && (0, f.shouldThrowError)(i.options.throwOnError, [j.error])) throw j.error
      return { ...j, mutate: k, mutateAsync: j.mutate }
    }
    a.s(['useMutation', () => i], 370025)
  },
  42382,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(256711),
      d = a.i(302491),
      e = a.i(529139),
      f = a.i(50944),
      g = a.i(572131),
      h = a.i(370025),
      i = a.i(433217),
      j = a.i(937927),
      k = a.i(699570),
      l = a.i(205138),
      m = a.i(238246)
    function n({ params: a }) {
      var n
      let { data: o, isPending: p } = (0, e.useSession)(),
        q = (0, f.useRouter)(),
        r = (0, g.use)(a).id,
        s = (0, j.useQueryClient)()
      ;(0, g.useEffect)(() => {
        o || q.push('/auth/signin')
      }, [q, o])
      let { data: t, isLoading: u } = (0, i.useQuery)({
          queryKey: ['booking', r],
          queryFn: async () => {
            let a = await fetch(`/api/bookings/${r}`)
            if (!a.ok) throw (404 === a.status && q.push('/404'), Error('Failed to fetch booking'))
            return a.json()
          },
          enabled: !!o && !!r,
          retry: !1,
        }),
        v = (0, h.useMutation)({
          mutationFn: async () => {
            let a = await fetch(`/api/bookings/${r}/cancel`, { method: 'POST' })
            if (!a.ok) throw Error('Failed to cancel booking')
            return a.json()
          },
          onSuccess: () => {
            s.invalidateQueries({ queryKey: ['booking', r] })
          },
          onError: (a) => {
            console.error('Failed to cancel booking:', a)
          },
        }),
        w = (0, h.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch(`/api/bookings/${r}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: a }),
            })
            if (!b.ok) throw Error('Failed to update booking status')
            return b.json()
          },
          onSuccess: () => {
            s.invalidateQueries({ queryKey: ['booking', r] }).then()
          },
          onError: (a) => {
            console.error('Failed to update booking status:', a)
          },
        }),
        x = async () => {
          confirm('정말 예약을 취소하시겠습니까?') && v.mutate()
        },
        y = async (a) => {
          w.mutate(a)
        }
      if (p || u)
        return (0, b.jsx)('div', {
          className: 'flex min-h-screen items-center justify-center',
          children: (0, b.jsx)(l.LoadingSpinner, { size: 'lg' }),
        })
      if (!o || !t) return null
      let z = o.user?.role === 'CUSTOMER',
        A = o.user?.role === 'GROOMER',
        B = o.user?.role === 'ADMIN'
      return (0, b.jsxs)('div', {
        className: 'bg-background min-h-screen',
        children: [
          (0, b.jsx)('header', {
            className: 'border-border border-b',
            children: (0, b.jsxs)('div', {
              className: 'container mx-auto flex items-center justify-between px-4 py-4',
              children: [
                (0, b.jsxs)('div', {
                  children: [
                    (0, b.jsx)('h1', {
                      className: 'text-foreground text-2xl font-bold',
                      children: '예약 상세',
                    }),
                    (0, b.jsxs)('p', {
                      className: 'text-muted-foreground text-sm',
                      children: ['예약 번호: ', t.id],
                    }),
                  ],
                }),
                (0, b.jsx)('div', {
                  className: 'flex items-center space-x-4',
                  children: (0, b.jsx)(k.Button, {
                    variant: 'outline',
                    asChild: !0,
                    children: (0, b.jsx)(m.default, {
                      href: z ? '/customer/bookings' : A ? '/groomer/bookings' : '/admin/bookings',
                      children: '예약 목록',
                    }),
                  }),
                }),
              ],
            }),
          }),
          (0, b.jsx)('main', {
            className: 'container mx-auto px-4 py-8',
            children: (0, b.jsxs)('div', {
              className: 'mx-auto max-w-4xl space-y-6',
              children: [
                (0, b.jsxs)('div', {
                  className: 'border-border bg-card rounded-lg border p-6',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'mb-6 flex items-start justify-between',
                      children: [
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsx)('h2', {
                              className: 'mb-2 text-2xl font-semibold',
                              children: t.service.name,
                            }),
                            (0, b.jsxs)('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                (0, b.jsx)('span', {
                                  className: `rounded-full px-3 py-1 text-sm font-medium ${(function (
                                    a
                                  ) {
                                    switch (a) {
                                      case 'PENDING':
                                        return 'text-yellow-600 bg-yellow-50'
                                      case 'CONFIRMED':
                                        return 'text-blue-600 bg-blue-50'
                                      case 'IN_PROGRESS':
                                        return 'text-purple-600 bg-purple-50'
                                      case 'COMPLETED':
                                        return 'text-green-600 bg-green-50'
                                      case 'CANCELLED':
                                        return 'text-red-600 bg-red-50'
                                      default:
                                        return 'text-gray-600 bg-gray-50'
                                    }
                                  })(t.status)}`,
                                  children: (function (a) {
                                    switch (a) {
                                      case 'PENDING':
                                        return '대기중'
                                      case 'CONFIRMED':
                                        return '확정'
                                      case 'IN_PROGRESS':
                                        return '진행중'
                                      case 'COMPLETED':
                                        return '완료'
                                      case 'CANCELLED':
                                        return '취소'
                                      default:
                                        return a
                                    }
                                  })(t.status),
                                }),
                                (0, b.jsxs)('span', {
                                  className: 'text-muted-foreground text-sm',
                                  children: [
                                    '예약일: ',
                                    (0, c.format)(new Date(t.createdAt), 'yyyy-MM-dd', {
                                      locale: d.ko,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'text-right',
                          children: [
                            (0, b.jsxs)('p', {
                              className: 'text-primary text-2xl font-bold',
                              children: [t.service.price.toLocaleString(), '원'],
                            }),
                            (0, b.jsxs)('p', {
                              className: 'text-muted-foreground text-sm',
                              children: [t.service.duration, '분'],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'grid grid-cols-1 gap-6 md:grid-cols-2',
                      children: [
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'text-foreground mb-3 font-semibold',
                              children: '예약 일시',
                            }),
                            (0, b.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, b.jsxs)('p', {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    (0, b.jsx)('svg', {
                                      className: 'text-muted-foreground h-4 w-4',
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
                                    t.date,
                                  ],
                                }),
                                (0, b.jsxs)('p', {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    (0, b.jsx)('svg', {
                                      className: 'text-muted-foreground h-4 w-4',
                                      fill: 'none',
                                      stroke: 'currentColor',
                                      viewBox: '0 0 24 24',
                                      children: (0, b.jsx)('path', {
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round',
                                        strokeWidth: 2,
                                        d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                                      }),
                                    }),
                                    t.time,
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'text-foreground mb-3 font-semibold',
                              children: '반려동물 정보',
                            }),
                            (0, b.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '이름:',
                                    }),
                                    ' ',
                                    t.pet.name,
                                  ],
                                }),
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '품종:',
                                    }),
                                    ' ',
                                    t.pet.breed,
                                  ],
                                }),
                                t.pet.weight &&
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '몸무게:',
                                      }),
                                      ' ',
                                      t.pet.weight,
                                      'kg',
                                    ],
                                  }),
                                t.pet.specialNotes &&
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '특이사항:',
                                      }),
                                      ' ',
                                      t.pet.specialNotes,
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'text-foreground mb-3 font-semibold',
                              children: '미용사 정보',
                            }),
                            (0, b.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '이름:',
                                    }),
                                    ' ',
                                    t.groomer.name,
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '평점:',
                                    }),
                                    ((n = t.groomer.rating),
                                    (0, b.jsxs)('div', {
                                      className: 'flex items-center gap-1',
                                      children: [
                                        [1, 2, 3, 4, 5].map((a) =>
                                          (0, b.jsx)(
                                            'svg',
                                            {
                                              className: `h-4 w-4 ${a <= n ? 'text-yellow-400' : 'text-gray-300'}`,
                                              fill: 'currentColor',
                                              viewBox: '0 0 20 20',
                                              children: (0, b.jsx)('path', {
                                                d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
                                              }),
                                            },
                                            a
                                          )
                                        ),
                                        (0, b.jsxs)('span', {
                                          className: 'text-muted-foreground ml-1 text-sm',
                                          children: ['(', n, ')'],
                                        }),
                                      ],
                                    })),
                                  ],
                                }),
                                t.groomer.phone &&
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '연락처:',
                                      }),
                                      ' ',
                                      t.groomer.phone,
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'text-foreground mb-3 font-semibold',
                              children: '지점 정보',
                            }),
                            (0, b.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '지점명:',
                                    }),
                                    ' ',
                                    t.location.name,
                                  ],
                                }),
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '주소:',
                                    }),
                                    ' ',
                                    t.location.address,
                                  ],
                                }),
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '연락처:',
                                    }),
                                    ' ',
                                    t.location.phone,
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        !A &&
                          (0, b.jsxs)('div', {
                            children: [
                              (0, b.jsx)('h3', {
                                className: 'text-foreground mb-3 font-semibold',
                                children: '고객 정보',
                              }),
                              (0, b.jsxs)('div', {
                                className: 'space-y-2',
                                children: [
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '이름:',
                                      }),
                                      ' ',
                                      t.customer.name,
                                    ],
                                  }),
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '이메일:',
                                      }),
                                      ' ',
                                      t.customer.email,
                                    ],
                                  }),
                                  t.customer.phone &&
                                    (0, b.jsxs)('p', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'font-medium',
                                          children: '연락처:',
                                        }),
                                        ' ',
                                        t.customer.phone,
                                      ],
                                    }),
                                ],
                              }),
                            ],
                          }),
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'text-foreground mb-3 font-semibold',
                              children: '서비스 정보',
                            }),
                            (0, b.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '서비스:',
                                    }),
                                    ' ',
                                    t.service.name,
                                  ],
                                }),
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '설명:',
                                    }),
                                    ' ',
                                    t.service.description,
                                  ],
                                }),
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '소요시간:',
                                    }),
                                    ' ',
                                    t.service.duration,
                                    '분',
                                  ],
                                }),
                                (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '가격:',
                                    }),
                                    ' ',
                                    t.service.price.toLocaleString(),
                                    '원',
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    t.specialRequests &&
                      (0, b.jsxs)('div', {
                        className: 'bg-muted/50 mt-6 rounded-md p-4',
                        children: [
                          (0, b.jsx)('h3', {
                            className: 'text-foreground mb-2 font-semibold',
                            children: '특별 요청사항',
                          }),
                          (0, b.jsx)('p', {
                            className: 'text-foreground',
                            children: t.specialRequests,
                          }),
                        ],
                      }),
                  ],
                }),
                t.payment &&
                  (0, b.jsxs)('div', {
                    className: 'border-border bg-card rounded-lg border p-6',
                    children: [
                      (0, b.jsx)('h2', {
                        className: 'mb-4 text-xl font-semibold',
                        children: '결제 정보',
                      }),
                      (0, b.jsxs)('div', {
                        className: 'grid grid-cols-1 gap-4 md:grid-cols-2',
                        children: [
                          (0, b.jsxs)('div', {
                            children: [
                              (0, b.jsxs)('p', {
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '결제 금액:',
                                  }),
                                  ' ',
                                  t.payment.amount.toLocaleString('ko-KR'),
                                  '원',
                                ],
                              }),
                              (0, b.jsxs)('p', {
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '결제 방법:',
                                  }),
                                  ' ',
                                  t.payment.method,
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)('div', {
                            children: [
                              (0, b.jsxs)('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '결제 상태:',
                                  }),
                                  (0, b.jsx)('span', {
                                    className: `rounded-full px-2 py-1 text-xs font-medium ${(function (
                                      a
                                    ) {
                                      switch (a) {
                                        case 'COMPLETED':
                                          return 'text-green-600 bg-green-50'
                                        case 'PENDING':
                                          return 'text-yellow-600 bg-yellow-50'
                                        case 'FAILED':
                                          return 'text-red-600 bg-red-50'
                                        default:
                                          return 'text-gray-600 bg-gray-50'
                                      }
                                    })(t.payment.status)}`,
                                    children: (function (a) {
                                      switch (a) {
                                        case 'COMPLETED':
                                          return '완료'
                                        case 'PENDING':
                                          return '처리중'
                                        case 'FAILED':
                                          return '실패'
                                        default:
                                          return a
                                      }
                                    })(t.payment.status),
                                  }),
                                ],
                              }),
                              (0, b.jsxs)('p', {
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '결제일:',
                                  }),
                                  ' ',
                                  (0, c.format)(new Date(t.payment.createdAt), 'yyyy-MM-dd', {
                                    locale: d.ko,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                (0, b.jsxs)('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'space-x-2',
                      children: [
                        'COMPLETED' === t.status &&
                          z &&
                          (0, b.jsx)(k.Button, {
                            asChild: !0,
                            children: (0, b.jsx)(m.default, {
                              href: `/review/create?bookingId=${t.id}`,
                              children: '리뷰 작성',
                            }),
                          }),
                        t.payment?.status === 'COMPLETED' &&
                          (0, b.jsx)(k.Button, { variant: 'outline', children: '영수증 다운로드' }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'space-x-2',
                      children: [
                        z &&
                          'PENDING' === t.status &&
                          (0, b.jsxs)(k.Button, {
                            variant: 'outline',
                            onClick: x,
                            disabled: v.isPending,
                            children: [
                              v.isPending
                                ? (0, b.jsx)(l.LoadingSpinner, { size: 'sm', className: 'mr-2' })
                                : null,
                              '예약 취소',
                            ],
                          }),
                        A &&
                          (0, b.jsxs)(b.Fragment, {
                            children: [
                              'PENDING' === t.status &&
                                (0, b.jsxs)(b.Fragment, {
                                  children: [
                                    (0, b.jsxs)(k.Button, {
                                      onClick: () => y('CONFIRMED'),
                                      disabled: w.isPending,
                                      children: [
                                        w.isPending
                                          ? (0, b.jsx)(l.LoadingSpinner, {
                                              size: 'sm',
                                              className: 'mr-2',
                                            })
                                          : null,
                                        '확정',
                                      ],
                                    }),
                                    (0, b.jsx)(k.Button, {
                                      variant: 'outline',
                                      onClick: () => y('CANCELLED'),
                                      disabled: w.isPending,
                                      children: '취소',
                                    }),
                                  ],
                                }),
                              'CONFIRMED' === t.status &&
                                (0, b.jsxs)(k.Button, {
                                  onClick: () => y('IN_PROGRESS'),
                                  disabled: w.isPending,
                                  children: [
                                    w.isPending
                                      ? (0, b.jsx)(l.LoadingSpinner, {
                                          size: 'sm',
                                          className: 'mr-2',
                                        })
                                      : null,
                                    '시작',
                                  ],
                                }),
                              'IN_PROGRESS' === t.status &&
                                (0, b.jsxs)(k.Button, {
                                  onClick: () => y('COMPLETED'),
                                  disabled: w.isPending,
                                  children: [
                                    w.isPending
                                      ? (0, b.jsx)(l.LoadingSpinner, {
                                          size: 'sm',
                                          className: 'mr-2',
                                        })
                                      : null,
                                    '완료',
                                  ],
                                }),
                            ],
                          }),
                        B && (0, b.jsx)(k.Button, { variant: 'outline', children: '관리자 액션' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      })
    }
    a.s(['default', () => n])
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__4f400921._.js.map
