module.exports = [
  502535,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(529139),
      d = a.i(50944),
      e = a.i(572131),
      f = a.i(699570),
      g = a.i(205138),
      h = a.i(238246),
      i = a.i(433217),
      j = a.i(619447),
      k = a.i(124348),
      l = a.i(301378),
      m = a.i(422262),
      n = a.i(808235)
    function o({ hasAddresses: a, className: c = '' }) {
      let [g, h] = (0, e.useState)(
          () => 'true' === sessionStorage.getItem('address-verification-banner-dismissed')
        ),
        i = (0, d.useRouter)()
      return a || g
        ? null
        : (0, b.jsx)('div', {
            className: `relative ${c}`,
            children: (0, b.jsxs)(k.Alert, {
              className: 'border-blue-200 bg-blue-50 text-blue-800',
              children: [
                (0, b.jsx)(l.MapPinIcon, { className: 'h-4 w-4 text-blue-600' }),
                (0, b.jsxs)('div', {
                  className:
                    'flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                  children: [
                    (0, b.jsx)(k.AlertDescription, {
                      className: 'flex-1',
                      children: (0, b.jsxs)('div', {
                        className: 'space-y-1',
                        children: [
                          (0, b.jsx)('p', {
                            className: 'font-medium text-blue-800',
                            children: '주소를 등록해주세요',
                          }),
                          (0, b.jsx)('p', {
                            className: 'text-sm text-blue-700',
                            children:
                              '예약 시 방문 주소를 선택하려면 주소 등록이 필요합니다. 정확한 위치 정보는 미용사의 빠른 방문을 도와줍니다.',
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsxs)('div', {
                      className: 'flex flex-shrink-0 items-center gap-2',
                      children: [
                        (0, b.jsxs)(f.Button, {
                          onClick: () => {
                            i.push('/customer/profile')
                          },
                          size: 'sm',
                          className: 'bg-blue-600 text-white hover:bg-blue-700',
                          children: [
                            (0, b.jsx)(n.PlusIcon, { className: 'mr-1 h-4 w-4' }),
                            '주소 추가하기',
                          ],
                        }),
                        (0, b.jsx)(f.Button, {
                          onClick: () => {
                            h(!0)
                          },
                          variant: 'ghost',
                          size: 'sm',
                          className: 'text-blue-700 hover:bg-blue-100 hover:text-blue-800',
                          children: '나중에',
                        }),
                        (0, b.jsxs)(f.Button, {
                          onClick: () => {
                            ;(h(!0),
                              sessionStorage.setItem(
                                'address-verification-banner-dismissed',
                                'true'
                              ))
                          },
                          variant: 'ghost',
                          size: 'icon',
                          className: 'h-8 w-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700',
                          children: [
                            (0, b.jsx)(m.XIcon, { className: 'h-4 w-4' }),
                            (0, b.jsx)('span', { className: 'sr-only', children: '닫기' }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          })
    }
    var p = a.i(165358),
      p = p
    function q({ hasPets: a, className: c = '' }) {
      let [g, h] = (0, e.useState)(
          () => 'true' === sessionStorage.getItem('pet-verification-banner-dismissed')
        ),
        i = (0, d.useRouter)()
      return a || g
        ? null
        : (0, b.jsx)('div', {
            className: `relative ${c}`,
            children: (0, b.jsxs)(k.Alert, {
              className: 'border-purple-200 bg-purple-50 text-purple-800',
              children: [
                (0, b.jsx)(p.default, { className: 'h-4 w-4 text-purple-600' }),
                (0, b.jsxs)('div', {
                  className:
                    'flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                  children: [
                    (0, b.jsx)(k.AlertDescription, {
                      className: 'flex-1',
                      children: (0, b.jsxs)('div', {
                        className: 'space-y-1',
                        children: [
                          (0, b.jsx)('p', {
                            className: 'font-medium text-purple-800',
                            children: '반려동물을 등록해주세요',
                          }),
                          (0, b.jsx)('p', {
                            className: 'text-sm text-purple-700',
                            children:
                              '미용 서비스 예약을 위해 반려동물 정보가 필요합니다. 반려동물의 특성과 건강 상태를 미리 알려주시면 더 나은 서비스를 제공할 수 있습니다.',
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsxs)('div', {
                      className: 'flex flex-shrink-0 items-center gap-2',
                      children: [
                        (0, b.jsxs)(f.Button, {
                          onClick: () => {
                            i.push('/customer/pets')
                          },
                          size: 'sm',
                          className: 'bg-purple-600 text-white hover:bg-purple-700',
                          children: [
                            (0, b.jsx)(n.PlusIcon, { className: 'mr-1 h-4 w-4' }),
                            '반려동물 추가하기',
                          ],
                        }),
                        (0, b.jsx)(f.Button, {
                          onClick: () => {
                            h(!0)
                          },
                          variant: 'ghost',
                          size: 'sm',
                          className: 'text-purple-700 hover:bg-purple-100 hover:text-purple-800',
                          children: '나중에',
                        }),
                        (0, b.jsxs)(f.Button, {
                          onClick: () => {
                            ;(h(!0),
                              sessionStorage.setItem('pet-verification-banner-dismissed', 'true'))
                          },
                          variant: 'ghost',
                          size: 'icon',
                          className:
                            'h-8 w-8 text-purple-600 hover:bg-purple-100 hover:text-purple-700',
                          children: [
                            (0, b.jsx)(m.XIcon, { className: 'h-4 w-4' }),
                            (0, b.jsx)('span', { className: 'sr-only', children: '닫기' }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          })
    }
    var r = a.i(546842)
    function s({ groomer: a }) {
      return (0, b.jsx)('div', {
        className: 'mb-8',
        children: (0, b.jsxs)('div', {
          className: 'border-border bg-card rounded-lg border p-6',
          children: [
            (0, b.jsx)('h2', { className: 'mb-4 text-lg font-semibold', children: '선호 미용사' }),
            (0, b.jsxs)('div', {
              className: 'flex items-center gap-4',
              children: [
                (0, b.jsx)('div', {
                  className:
                    'bg-primary/10 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full',
                  children: a.image
                    ? (0, b.jsx)('img', {
                        src: a.image,
                        alt: a.name,
                        className: 'h-full w-full object-cover',
                      })
                    : (0, b.jsx)(r.User, { className: 'text-primary h-8 w-8' }),
                }),
                (0, b.jsxs)('div', {
                  children: [
                    (0, b.jsx)('h3', { className: 'font-semibold', children: a.name }),
                    (0, b.jsxs)('div', {
                      className: 'flex items-center gap-1',
                      children: [
                        [1, 2, 3, 4, 5].map((c) =>
                          (0, b.jsx)(
                            'svg',
                            {
                              className: `h-4 w-4 ${c <= a.rating ? 'text-yellow-400' : 'text-gray-300'}`,
                              fill: 'currentColor',
                              viewBox: '0 0 20 20',
                              children: (0, b.jsx)('path', {
                                d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
                              }),
                            },
                            c
                          )
                        ),
                        (0, b.jsxs)('span', {
                          className: 'text-muted-foreground ml-1 text-sm',
                          children: ['(', a.rating, ')'],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    }
    var t = a.i(15594),
      u = a.i(251653),
      v = a.i(578767)
    function w() {
      let { data: a, isPending: k } = (0, c.useSession)(),
        l = (0, d.useRouter)(),
        { data: m, isLoading: n } = (function () {
          let { data: a } = (0, c.useSession)()
          return (0, i.useQuery)({
            queryKey: ['customer', 'dashboard', 'stats'],
            queryFn: async () => {
              let a = await fetch('/api/customer/dashboard/stats')
              if (!a.ok) throw Error('Failed to fetch dashboard stats')
              return a.json()
            },
            enabled: !!a?.user && 'CUSTOMER' === a.user.role,
            staleTime: 3e5,
            gcTime: 6e5,
            refetchInterval: 6e4,
          })
        })(),
        { addresses: p, isLoading: r } = (0, t.useAddresses)(),
        { pets: w, isLoading: x } = (0, u.usePets)()
      return ((0, e.useEffect)(() => {
        ;(a || l.push('/auth/signin'),
          a?.user?.role && 'CUSTOMER' !== a.user.role && l.push('/dashboard'))
      }, [a, l]),
      k || n || r || x)
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(g.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'CUSTOMER'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsxs)('div', {
                  className: 'space-y-3',
                  children: [
                    !a?.user?.phoneNumberVerified &&
                      (0, b.jsx)(j.PhoneVerificationStatusBanner, {
                        userRole: 'CUSTOMER',
                        className: 'container mx-auto px-4',
                      }),
                    (0, b.jsx)(o, {
                      hasAddresses: p.length > 0,
                      className: 'container mx-auto px-4',
                    }),
                    (0, b.jsx)(q, { hasPets: w.length > 0, className: 'container mx-auto px-4' }),
                  ],
                }),
                (0, b.jsxs)('main', {
                  className: 'container mx-auto px-4 py-4',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'mb-8 grid grid-cols-1 gap-6 md:grid-cols-2',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'border-border bg-card rounded-lg border p-6',
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'mb-2 text-lg font-semibold',
                              children: '빠른 예약',
                            }),
                            (0, b.jsx)('p', {
                              className: 'text-muted-foreground mb-4',
                              children: '간편하게 새로운 미용 예약을 만들어보세요.',
                            }),
                            (0, b.jsx)(f.Button, {
                              asChild: !0,
                              className: 'w-full',
                              children: (0, b.jsx)(h.default, {
                                href: '/booking/new',
                                children: '예약하기',
                              }),
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'border-border bg-card rounded-lg border p-6',
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'mb-2 text-lg font-semibold',
                              children: '반려동물 추가',
                            }),
                            (0, b.jsx)('p', {
                              className: 'text-muted-foreground mb-4',
                              children: '새로운 반려동물을 등록하고 관리하세요.',
                            }),
                            (0, b.jsx)(f.Button, {
                              asChild: !0,
                              className: 'w-full',
                              variant: 'outline',
                              children: (0, b.jsx)(h.default, {
                                href: '/customer/pets',
                                children: '반려동물 관리',
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    m &&
                      (0, b.jsxs)(b.Fragment, {
                        children: [
                          m.favoriteGroomer && (0, b.jsx)(s, { groomer: m.favoriteGroomer }),
                          (0, b.jsxs)('div', {
                            className: 'mb-8',
                            children: [
                              (0, b.jsxs)('div', {
                                className: 'mb-4 flex items-center justify-between',
                                children: [
                                  (0, b.jsx)('h2', {
                                    className: 'text-xl font-semibold',
                                    children: '최근 예약',
                                  }),
                                  (0, b.jsx)(f.Button, {
                                    variant: 'outline',
                                    asChild: !0,
                                    children: (0, b.jsx)(h.default, {
                                      href: '/customer/bookings',
                                      children: '전체 보기',
                                    }),
                                  }),
                                ],
                              }),
                              0 === m.recentBookings.length
                                ? (0, b.jsxs)('div', {
                                    className: 'border-border rounded-lg border p-8 text-center',
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
                                        children: '예약 내역이 없습니다',
                                      }),
                                      (0, b.jsx)('p', {
                                        className: 'text-muted-foreground mb-4',
                                        children: '첫 번째 미용 예약을 만들어보세요.',
                                      }),
                                      (0, b.jsx)(f.Button, {
                                        asChild: !0,
                                        children: (0, b.jsx)(h.default, {
                                          href: '/booking/new',
                                          children: '예약하기',
                                        }),
                                      }),
                                    ],
                                  })
                                : (0, b.jsx)('div', {
                                    className: 'grid gap-4',
                                    children: m.recentBookings.map((a) =>
                                      (0, b.jsx)(
                                        'div',
                                        {
                                          className: 'border-border bg-card rounded-lg border p-4',
                                          children: (0, b.jsxs)('div', {
                                            className: 'flex items-start justify-between',
                                            children: [
                                              (0, b.jsxs)('div', {
                                                children: [
                                                  (0, b.jsxs)('div', {
                                                    className: 'mb-1 flex items-center gap-2',
                                                    children: [
                                                      (0, b.jsx)('h3', {
                                                        className: 'font-semibold',
                                                        children: a.service.name,
                                                      }),
                                                      (0, b.jsx)('span', {
                                                        className: `rounded-full px-2 py-1 text-xs font-medium ${(function (
                                                          a
                                                        ) {
                                                          switch (a) {
                                                            case v.BookingStatus
                                                              .FIRST_PAYMENT_PENDING:
                                                            case v.BookingStatus
                                                              .GROOMER_CONFIRM_PENDING:
                                                            case v.BookingStatus
                                                              .FIRST_PAYMENT_COMPLETE:
                                                              return 'text-yellow-600 bg-yellow-50'
                                                            case v.BookingStatus.GROOMER_CONFIRM:
                                                            case v.BookingStatus
                                                              .ADDITIONAL_PAYMENT_PENDING:
                                                            case v.BookingStatus
                                                              .ADDITIONAL_PAYMENT_COMPLETE:
                                                              return 'text-blue-600 bg-blue-50'
                                                            case v.BookingStatus.WORK_IN_PROGRESS:
                                                              return 'text-purple-600 bg-purple-50'
                                                            case v.BookingStatus.SERVICE_COMPLETED:
                                                              return 'text-green-600 bg-green-50'
                                                            case v.BookingStatus.SERVICE_CANCELLED:
                                                            case v.BookingStatus.BOOKING_FAILED:
                                                              return 'text-red-600 bg-red-50'
                                                            default:
                                                              throw Error('Error on Types')
                                                          }
                                                        })(a.status)}`,
                                                        children: (function (a) {
                                                          switch (a) {
                                                            case v.BookingStatus
                                                              .FIRST_PAYMENT_PENDING:
                                                              return '1차 결제 대기'
                                                            case v.BookingStatus
                                                              .FIRST_PAYMENT_COMPLETE:
                                                              return '1차 결제 완료'
                                                            case v.BookingStatus
                                                              .GROOMER_CONFIRM_PENDING:
                                                              return '미용사 확인 대기'
                                                            case v.BookingStatus.GROOMER_CONFIRM:
                                                              return '미용사 확정'
                                                            case v.BookingStatus
                                                              .ADDITIONAL_PAYMENT_PENDING:
                                                              return '추가 결제 대기'
                                                            case v.BookingStatus
                                                              .ADDITIONAL_PAYMENT_COMPLETE:
                                                              return '추가 결제 완료'
                                                            case v.BookingStatus.WORK_IN_PROGRESS:
                                                              return '진행중'
                                                            case v.BookingStatus.SERVICE_COMPLETED:
                                                              return '완료'
                                                            case v.BookingStatus.SERVICE_CANCELLED:
                                                              return '취소됨'
                                                            case v.BookingStatus.BOOKING_FAILED:
                                                              return '예약 실패'
                                                            default:
                                                              throw Error('Error on Types')
                                                          }
                                                        })(a.status),
                                                      }),
                                                    ],
                                                  }),
                                                  (0, b.jsxs)('p', {
                                                    className: 'text-muted-foreground text-sm',
                                                    children: [a.groomer.name, ' • ', a.date],
                                                  }),
                                                ],
                                              }),
                                              (0, b.jsxs)('div', {
                                                className: 'flex gap-2',
                                                children: [
                                                  'ADDITIONAL_PAYMENT_PENDING' === a.status &&
                                                    (0, b.jsx)(f.Button, {
                                                      size: 'sm',
                                                      asChild: !0,
                                                      className:
                                                        'bg-orange-600 hover:bg-orange-700',
                                                      children: (0, b.jsx)(h.default, {
                                                        href: `/payment/additional/${a.id}`,
                                                        children: '추가 결제',
                                                      }),
                                                    }),
                                                  (0, b.jsx)(f.Button, {
                                                    variant: 'outline',
                                                    size: 'sm',
                                                    asChild: !0,
                                                    children: (0, b.jsx)(h.default, {
                                                      href: `/customer/booking/${a.id}`,
                                                      children: '상세보기',
                                                    }),
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        },
                                        a.id
                                      )
                                    ),
                                  }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
              ],
            })
          : null
    }
    a.s(['default', () => w], 502535)
  },
]

//# sourceMappingURL=src_app_customer_dashboard_overview_page_tsx_39890d53._.js.map
