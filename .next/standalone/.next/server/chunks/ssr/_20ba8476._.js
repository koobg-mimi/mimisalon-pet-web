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
  510325,
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
        [m, n] = (0, e.useState)({ method: 'CREDIT_CARD' })
      ;(0, e.useEffect)(() => {
        ;(a || k.push('/auth/signin'),
          a?.user?.role && 'CUSTOMER' !== a.user.role && k.push('/dashboard'))
      }, [a, k])
      let { data: o, isLoading: p } = (0, f.useQuery)({
        queryKey: ['booking', l, 'payment-info'],
        queryFn: async () => {
          let a = await fetch(`/api/bookings/${l}/payment-info`)
          if (!a.ok) throw Error('Failed to fetch booking')
          return a.json()
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
          mutationFn: async (a) => {
            let b = await fetch('/api/payments/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId: l, paymentMethod: a.method, paymentData: a }),
            })
            if (!b.ok) throw Error((await b.json()).message || 'Payment processing failed')
            return b.json()
          },
          onSuccess: (a) => {
            k.push(`/payment/success?paymentId=${a.paymentId}`)
          },
          onError: (a) => {
            ;(console.error('Payment processing failed:', a),
              k.push(`/payment/fail?reason=${encodeURIComponent(a.message)}`))
          },
        }),
        s = async (a) => {
          ;(a.preventDefault(), r.mutate(m))
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
                        children: '결제하기',
                      }),
                      (0, b.jsx)('p', {
                        className: 'text-muted-foreground text-sm',
                        children: '예약을 완료하기 위해 결제를 진행해주세요',
                      }),
                    ],
                  }),
                }),
                (0, b.jsx)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: (0, b.jsxs)('div', {
                    className: 'mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-3',
                    children: [
                      (0, b.jsx)('div', {
                        className: 'lg:col-span-2',
                        children: (0, b.jsxs)('div', {
                          className: 'border-border bg-card rounded-lg border p-6',
                          children: [
                            (0, b.jsx)('h2', {
                              className: 'mb-6 text-xl font-semibold',
                              children: '결제 방법 선택',
                            }),
                            (0, b.jsx)('div', {
                              className: 'mb-6 space-y-4',
                              children: (0, b.jsx)('div', {
                                className: 'grid grid-cols-2 gap-4 md:grid-cols-4',
                                children: [
                                  { value: 'CREDIT_CARD', label: '신용카드', icon: '💳' },
                                  { value: 'KAKAO_PAY', label: '카카오페이', icon: '🟡' },
                                  { value: 'TOSS_PAY', label: '토스페이', icon: '🔵' },
                                  { value: 'BANK_TRANSFER', label: '계좌이체', icon: '🏦' },
                                ].map((a) =>
                                  (0, b.jsxs)(
                                    'button',
                                    {
                                      type: 'button',
                                      onClick: () => {
                                        n({
                                          method: a.value,
                                          cardNumber: '',
                                          cardExpiry: '',
                                          cardCvc: '',
                                          cardHolder: '',
                                          bankAccount: '',
                                        })
                                      },
                                      className: `rounded-lg border p-4 text-center transition-colors ${m.method === a.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`,
                                      children: [
                                        (0, b.jsx)('div', {
                                          className: 'mb-1 text-2xl',
                                          children: a.icon,
                                        }),
                                        (0, b.jsx)('div', {
                                          className: 'text-sm font-medium',
                                          children: a.label,
                                        }),
                                      ],
                                    },
                                    a.value
                                  )
                                ),
                              }),
                            }),
                            (0, b.jsxs)('form', {
                              onSubmit: s,
                              className: 'space-y-6',
                              children: [
                                'CREDIT_CARD' === m.method &&
                                  (0, b.jsxs)('div', {
                                    className: 'space-y-4',
                                    children: [
                                      (0, b.jsx)('h3', {
                                        className: 'font-semibold',
                                        children: '카드 정보',
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('label', {
                                            className:
                                              'text-foreground mb-2 block text-sm font-medium',
                                            children: '카드번호',
                                          }),
                                          (0, b.jsx)('input', {
                                            type: 'text',
                                            required: !0,
                                            maxLength: 19,
                                            value: m.cardNumber || '',
                                            onChange: (a) =>
                                              q(
                                                'cardNumber',
                                                a.target.value
                                                  .replace(/\D/g, '')
                                                  .replace(/(\d{4})(?=\d)/g, '$1-')
                                              ),
                                            placeholder: '1234-5678-9012-3456',
                                            className:
                                              'border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'grid grid-cols-2 gap-4',
                                        children: [
                                          (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('label', {
                                                className:
                                                  'text-foreground mb-2 block text-sm font-medium',
                                                children: '유효기간',
                                              }),
                                              (0, b.jsx)('input', {
                                                type: 'text',
                                                required: !0,
                                                maxLength: 5,
                                                value: m.cardExpiry || '',
                                                onChange: (a) => {
                                                  let b
                                                  return q(
                                                    'cardExpiry',
                                                    (b = a.target.value.replace(/\D/g, ''))
                                                      .length >= 2
                                                      ? b.substring(0, 2) + '/' + b.substring(2, 4)
                                                      : b
                                                  )
                                                },
                                                placeholder: 'MM/YY',
                                                className:
                                                  'border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('label', {
                                                className:
                                                  'text-foreground mb-2 block text-sm font-medium',
                                                children: 'CVC',
                                              }),
                                              (0, b.jsx)('input', {
                                                type: 'text',
                                                required: !0,
                                                maxLength: 3,
                                                value: m.cardCvc || '',
                                                onChange: (a) =>
                                                  q('cardCvc', a.target.value.replace(/\D/g, '')),
                                                placeholder: '123',
                                                className:
                                                  'border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('label', {
                                            className:
                                              'text-foreground mb-2 block text-sm font-medium',
                                            children: '카드 소유자명',
                                          }),
                                          (0, b.jsx)('input', {
                                            type: 'text',
                                            required: !0,
                                            value: m.cardHolder || '',
                                            onChange: (a) => q('cardHolder', a.target.value),
                                            placeholder: '홍길동',
                                            className:
                                              'border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                'BANK_TRANSFER' === m.method &&
                                  (0, b.jsxs)('div', {
                                    className: 'space-y-4',
                                    children: [
                                      (0, b.jsx)('h3', {
                                        className: 'font-semibold',
                                        children: '계좌 정보',
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('label', {
                                            className:
                                              'text-foreground mb-2 block text-sm font-medium',
                                            children: '계좌번호',
                                          }),
                                          (0, b.jsx)('input', {
                                            type: 'text',
                                            required: !0,
                                            value: m.bankAccount || '',
                                            onChange: (a) => q('bankAccount', a.target.value),
                                            placeholder: '123-456-789012',
                                            className:
                                              'border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ('KAKAO_PAY' === m.method || 'TOSS_PAY' === m.method) &&
                                  (0, b.jsxs)('div', {
                                    className: 'py-8 text-center',
                                    children: [
                                      (0, b.jsx)('div', {
                                        className: 'mb-4 text-6xl',
                                        children: 'KAKAO_PAY' === m.method ? '🟡' : '🔵',
                                      }),
                                      (0, b.jsxs)('p', {
                                        className: 'text-muted-foreground',
                                        children: [
                                          'KAKAO_PAY' === m.method ? '카카오페이' : '토스페이',
                                          '창이 새로 열려 결제를 진행합니다.',
                                        ],
                                      }),
                                    ],
                                  }),
                                (0, b.jsxs)('div', {
                                  className: 'border-border border-t pt-6',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      className: 'mb-4 flex items-center',
                                      children: [
                                        (0, b.jsx)('input', {
                                          type: 'checkbox',
                                          id: 'agree',
                                          required: !0,
                                          className: 'mr-2',
                                        }),
                                        (0, b.jsx)('label', {
                                          htmlFor: 'agree',
                                          className: 'text-foreground text-sm',
                                          children: '결제 약관에 동의합니다',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)(h.Button, {
                                      type: 'submit',
                                      className: 'w-full',
                                      disabled: r.isPending,
                                      children: [
                                        r.isPending
                                          ? (0, b.jsx)(i.LoadingSpinner, {
                                              size: 'sm',
                                              className: 'mr-2',
                                            })
                                          : null,
                                        o.service.price.toLocaleString(),
                                        '원 결제하기',
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      (0, b.jsx)('div', {
                        className: 'lg:col-span-1',
                        children: (0, b.jsxs)('div', {
                          className: 'border-border bg-card sticky top-8 rounded-lg border p-6',
                          children: [
                            (0, b.jsx)('h2', {
                              className: 'mb-4 text-lg font-semibold',
                              children: '예약 정보',
                            }),
                            (0, b.jsxs)('div', {
                              className: 'space-y-4',
                              children: [
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsx)('h3', {
                                      className: 'text-foreground font-medium',
                                      children: o.service.name,
                                    }),
                                    (0, b.jsxs)('p', {
                                      className: 'text-muted-foreground text-sm',
                                      children: [o.service.duration, '분'],
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsxs)('p', {
                                      className: 'text-sm',
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
                                    (0, b.jsxs)('p', {
                                      className: 'text-sm',
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'font-medium',
                                          children: '미용사:',
                                        }),
                                        ' ',
                                        o.groomer.name,
                                      ],
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsxs)('p', {
                                      className: 'text-sm',
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'font-medium',
                                          children: '지점:',
                                        }),
                                        ' ',
                                        o.location.name,
                                      ],
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'text-muted-foreground text-xs',
                                      children: o.location.address,
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsx)('p', {
                                      className: 'text-sm',
                                      children: (0, b.jsx)('span', {
                                        className: 'font-medium',
                                        children: '예약일시:',
                                      }),
                                    }),
                                    (0, b.jsxs)('p', {
                                      className: 'text-muted-foreground text-sm',
                                      children: [o.date, ' ', o.time],
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'border-border border-t pt-4',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      className: 'flex items-center justify-between',
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'font-medium',
                                          children: '서비스 금액',
                                        }),
                                        (0, b.jsxs)('span', {
                                          children: [o.service.price.toLocaleString(), '원'],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      className:
                                        'text-muted-foreground mt-2 flex items-center justify-between text-sm',
                                      children: [
                                        (0, b.jsx)('span', { children: 'VAT' }),
                                        (0, b.jsx)('span', { children: '포함' }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      className:
                                        'border-border mt-4 flex items-center justify-between border-t pt-4',
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-lg font-semibold',
                                          children: '총 결제금액',
                                        }),
                                        (0, b.jsxs)('span', {
                                          className: 'text-primary text-lg font-bold',
                                          children: [o.service.price.toLocaleString(), '원'],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
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

//# sourceMappingURL=_20ba8476._.js.map
