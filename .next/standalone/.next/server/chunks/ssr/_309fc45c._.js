module.exports = [
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
  381634,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(529139),
      d = a.i(50944),
      e = a.i(572131),
      f = a.i(433217),
      g = a.i(370025),
      h = a.i(699570),
      i = a.i(205138)
    function j() {
      let { data: a, isPending: j } = (0, c.useSession)(),
        k = (0, d.useRouter)(),
        l = (0, d.useSearchParams)().get('bookingId'),
        [m, n] = (0, e.useState)({
          rating: 0,
          content: '',
          serviceQuality: 0,
          communication: 0,
          timeliness: 0,
          cleanliness: 0,
        })
      ;(0, e.useEffect)(() => {
        ;(a || k.push('/auth/signin'),
          a?.user?.role && 'CUSTOMER' !== a.user.role && k.push('/dashboard'))
      }, [a, k])
      let { data: o, isLoading: p } = (0, f.useQuery)({
        queryKey: ['booking', l],
        queryFn: async () => {
          let a = await fetch(`/api/bookings/${l}`)
          if (!a.ok) throw Error('Failed to fetch booking')
          let b = await a.json()
          if ('COMPLETED' !== b.status)
            throw (k.push('/customer/bookings'), Error('Booking not completed'))
          return b
        },
        enabled: !!l && !!a?.user && 'CUSTOMER' === a.user.role,
        retry: !1,
      })
      ;(0, e.useEffect)(() => {
        l || k.push('/customer/bookings')
      }, [l, k])
      let q = (a, b) => {
          n((c) => ({ ...c, [a]: b }))
        },
        r = (0, g.useMutation)({
          mutationFn: async () => {
            let a = await fetch('/api/reviews', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId: l,
                groomerId: o?.groomer.id,
                rating: m.rating,
                content: m.content,
                serviceQuality: m.serviceQuality,
                communication: m.communication,
                timeliness: m.timeliness,
                cleanliness: m.cleanliness,
              }),
            })
            if (!a.ok) throw Error((await a.json()).message || '리뷰 작성 중 오류가 발생했습니다.')
            return a.json()
          },
          onSuccess: () => {
            k.push('/customer/dashboard/reviews?success=true')
          },
          onError: (a) => {
            ;(console.error('Failed to create review:', a), alert(a.message))
          },
        }),
        s = (a, c, d = 'sm') => {
          let e = 'lg' === d ? 'w-8 h-8' : 'w-5 h-5'
          return (0, b.jsx)('div', {
            className: 'flex items-center gap-1',
            children: [1, 2, 3, 4, 5].map((d) =>
              (0, b.jsx)(
                'button',
                {
                  type: 'button',
                  onClick: () => c?.(d),
                  disabled: !c,
                  className: `${e} ${d <= a ? 'text-yellow-400' : 'text-gray-300'} ${c ? 'cursor-pointer hover:text-yellow-300' : ''} transition-colors`,
                  children: (0, b.jsx)('svg', {
                    fill: 'currentColor',
                    viewBox: '0 0 20 20',
                    children: (0, b.jsx)('path', {
                      d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
                    }),
                  }),
                },
                d
              )
            ),
          })
        }
      return j || p
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(i.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'CUSTOMER' && o
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsxs)('div', {
                    className: 'container mx-auto px-4 py-4',
                    children: [
                      (0, b.jsx)('h1', {
                        className: 'text-foreground text-2xl font-bold',
                        children: '리뷰 작성',
                      }),
                      (0, b.jsx)('p', {
                        className: 'text-muted-foreground text-sm',
                        children: '서비스에 대한 솔직한 후기를 남겨주세요',
                      }),
                    ],
                  }),
                }),
                (0, b.jsx)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: (0, b.jsxs)('div', {
                    className: 'mx-auto max-w-2xl',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'border-border bg-card mb-6 rounded-lg border p-6',
                        children: [
                          (0, b.jsx)('h2', {
                            className: 'mb-4 text-lg font-semibold',
                            children: '서비스 정보',
                          }),
                          (0, b.jsxs)('div', {
                            className: 'grid grid-cols-1 gap-4 text-sm md:grid-cols-2',
                            children: [
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '서비스:',
                                      }),
                                      ' ',
                                      o.service.name,
                                    ],
                                  }),
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '반려동물:',
                                      }),
                                      ' ',
                                      o.pet.name,
                                      ' (',
                                      o.pet.breed,
                                      ')',
                                    ],
                                  }),
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '미용사:',
                                      }),
                                      ' ',
                                      o.groomer.name,
                                    ],
                                  }),
                                  (0, b.jsxs)('p', {
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '지점:',
                                      }),
                                      ' ',
                                      o.location.name,
                                    ],
                                  }),
                                ],
                              }),
                              (0, b.jsx)('div', {
                                className: 'md:col-span-2',
                                children: (0, b.jsxs)('p', {
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: '이용일:',
                                    }),
                                    ' ',
                                    o.date,
                                    ' ',
                                    o.time,
                                  ],
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, b.jsxs)('form', {
                        onSubmit: (a) => {
                          ;(a.preventDefault(), 0 === m.rating)
                            ? alert('별점을 선택해주세요.')
                            : m.content.trim().length < 10
                              ? alert('리뷰 내용을 10자 이상 입력해주세요.')
                              : r.mutate()
                        },
                        className: 'space-y-6',
                        children: [
                          (0, b.jsxs)('div', {
                            className: 'border-border bg-card rounded-lg border p-6',
                            children: [
                              (0, b.jsx)('h2', {
                                className: 'mb-6 text-lg font-semibold',
                                children: '전체 평가',
                              }),
                              (0, b.jsxs)('div', {
                                className: 'mb-6 text-center',
                                children: [
                                  (0, b.jsx)('div', {
                                    className: 'mb-4',
                                    children: s(m.rating, (a) => q('rating', a), 'lg'),
                                  }),
                                  (0, b.jsx)('p', {
                                    className: 'text-foreground text-lg font-medium',
                                    children: ((a) => {
                                      switch (a) {
                                        case 1:
                                          return '매우 불만족'
                                        case 2:
                                          return '불만족'
                                        case 3:
                                          return '보통'
                                        case 4:
                                          return '만족'
                                        case 5:
                                          return '매우 만족'
                                        default:
                                          return '평가해주세요'
                                      }
                                    })(m.rating),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)('div', {
                            className: 'border-border bg-card rounded-lg border p-6',
                            children: [
                              (0, b.jsx)('h2', {
                                className: 'mb-6 text-lg font-semibold',
                                children: '세부 평가',
                              }),
                              (0, b.jsxs)('div', {
                                className: 'space-y-4',
                                children: [
                                  (0, b.jsxs)('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '서비스 품질',
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          s(m.serviceQuality, (a) => q('serviceQuality', a)),
                                          (0, b.jsx)('span', {
                                            className: 'text-muted-foreground w-16 text-sm',
                                            children:
                                              m.serviceQuality > 0 ? `${m.serviceQuality}점` : '',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '소통',
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          s(m.communication, (a) => q('communication', a)),
                                          (0, b.jsx)('span', {
                                            className: 'text-muted-foreground w-16 text-sm',
                                            children:
                                              m.communication > 0 ? `${m.communication}점` : '',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '시간 준수',
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          s(m.timeliness, (a) => q('timeliness', a)),
                                          (0, b.jsx)('span', {
                                            className: 'text-muted-foreground w-16 text-sm',
                                            children: m.timeliness > 0 ? `${m.timeliness}점` : '',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '청결도',
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          s(m.cleanliness, (a) => q('cleanliness', a)),
                                          (0, b.jsx)('span', {
                                            className: 'text-muted-foreground w-16 text-sm',
                                            children: m.cleanliness > 0 ? `${m.cleanliness}점` : '',
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
                            className: 'border-border bg-card rounded-lg border p-6',
                            children: [
                              (0, b.jsx)('h2', {
                                className: 'mb-4 text-lg font-semibold',
                                children: '리뷰 작성',
                              }),
                              (0, b.jsx)('textarea', {
                                value: m.content,
                                onChange: (a) => {
                                  var b
                                  return (
                                    (b = a.target.value),
                                    void n((a) => ({ ...a, content: b }))
                                  )
                                },
                                rows: 6,
                                placeholder:
                                  '서비스에 대한 솔직한 후기를 작성해주세요. (최소 10자 이상)',
                                className:
                                  'border-input bg-background focus:ring-ring w-full resize-none rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                                required: !0,
                              }),
                              (0, b.jsxs)('div', {
                                className: 'mt-2 flex items-center justify-between',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-xs',
                                    children: '최소 10자 이상 작성해주세요',
                                  }),
                                  (0, b.jsxs)('span', {
                                    className: 'text-muted-foreground text-xs',
                                    children: [m.content.length, '/500'],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)('div', {
                            className: 'flex justify-between',
                            children: [
                              (0, b.jsx)(h.Button, {
                                type: 'button',
                                variant: 'outline',
                                onClick: () => k.push('/customer/bookings'),
                                children: '취소',
                              }),
                              (0, b.jsxs)(h.Button, {
                                type: 'submit',
                                disabled:
                                  r.isPending || 0 === m.rating || m.content.trim().length < 10,
                                children: [
                                  r.isPending
                                    ? (0, b.jsx)(i.LoadingSpinner, {
                                        size: 'sm',
                                        className: 'mr-2',
                                      })
                                    : null,
                                  '리뷰 등록',
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, b.jsxs)('div', {
                        className: 'mt-8 rounded-lg bg-blue-50 p-4',
                        children: [
                          (0, b.jsx)('h3', {
                            className: 'mb-2 font-semibold text-blue-900',
                            children: '리뷰 작성 안내',
                          }),
                          (0, b.jsxs)('ul', {
                            className: 'space-y-1 text-sm text-blue-800',
                            children: [
                              (0, b.jsx)('li', {
                                children: '• 솔직하고 구체적인 후기를 작성해주세요',
                              }),
                              (0, b.jsx)('li', {
                                children: '• 다른 고객들에게 도움이 되는 정보를 포함해주세요',
                              }),
                              (0, b.jsx)('li', {
                                children: '• 욕설이나 비방은 삭제될 수 있습니다',
                              }),
                              (0, b.jsx)('li', {
                                children: '• 리뷰 작성 시 포인트를 적립해드립니다',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            })
          : null
    }
    a.s(['default', () => j])
  },
]

//# sourceMappingURL=_309fc45c._.js.map
