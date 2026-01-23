module.exports = [
  431946,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(50944),
      e = a.i(433217),
      f = a.i(370025),
      g = a.i(238246),
      h = a.i(591119),
      i = a.i(699570),
      j = a.i(786304),
      k = a.i(505084),
      l = a.i(205138),
      m = a.i(854251),
      n = a.i(730769),
      o = a.i(839982),
      p = a.i(465734),
      q = a.i(994644),
      r = a.i(842391),
      s = a.i(254688),
      t = a.i(485155),
      u = a.i(256711),
      v = a.i(302491),
      w = a.i(416025)
    function x({ params: a }) {
      let x = (0, c.use)(a),
        y = (0, d.useRouter)(),
        z = (0, d.useSearchParams)().get('payment')
      ;(0, c.useEffect)(() => {
        z || y.push(`/customer/booking/${x.id}`)
      }, [z, x.id, y])
      let { data: A, isLoading: B } = (0, e.useQuery)({
          queryKey: ['payment', z],
          queryFn: async () => {
            let a = await fetch(`/api/payments/verify/${z}`)
            if (!a.ok) throw Error('결제 정보를 불러올 수 없습니다')
            let b = await a.json()
            if (b.success && b.payment)
              return {
                id: b.payment.id,
                amount: b.payment.amount,
                method: b.payment.method || '카드',
                paidAt: b.payment.paidAt
                  ? (0, u.format)(new Date(b.payment.paidAt), 'yyyy-MM-dd HH:mm:ss', {
                      locale: v.ko,
                    })
                  : (0, u.format)(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: v.ko }),
                booking: b.payment.booking
                  ? {
                      id: b.payment.booking.id,
                      services:
                        b.payment.booking.pets?.flatMap((a) =>
                          a.services?.map((a) => ({
                            id: a.name,
                            name: a.name,
                            price: a.price,
                            duration: a.duration,
                          }))
                        ) || [],
                      pet: b.payment.booking.pets?.[0]
                        ? {
                            name: b.payment.booking.pets[0].name,
                            species: b.payment.booking.pets[0].breed || '강아지',
                          }
                        : { name: '알 수 없음', species: '알 수 없음' },
                      groomer: b.payment.booking.groomer
                        ? { name: b.payment.booking.groomer.name || '미용사', phone: '' }
                        : { name: '미용사', phone: '' },
                      scheduledDate: b.payment.booking.serviceDate
                        ? (0, u.format)(
                            new Date(b.payment.booking.serviceDate),
                            'yyyy년 MM월 dd일',
                            { locale: v.ko }
                          )
                        : '',
                      scheduledTime: b.payment.booking.serviceTime || '',
                    }
                  : {
                      id: x.id,
                      services: [],
                      pet: { name: '알 수 없음', species: '알 수 없음' },
                      groomer: { name: '미용사', phone: '' },
                      scheduledDate: '',
                      scheduledTime: '',
                    },
                receipt: {
                  receiptNumber: b.payment.paymentId,
                  downloadUrl: b.payment.receiptUrl || '',
                },
              }
            throw Error('결제 정보가 올바르지 않습니다')
          },
          enabled: !!z,
          retry: !1,
        }),
        C = (0, f.useMutation)({
          mutationFn: async () => {
            if (!A?.receipt.downloadUrl) throw Error('Download URL not available')
            let a = await fetch(A.receipt.downloadUrl)
            if (!a.ok) throw Error('Failed to download receipt')
            return { blob: await a.blob(), filename: `receipt_${A.receipt.receiptNumber}.pdf` }
          },
          onSuccess: ({ blob: a, filename: b }) => {
            let c = window.URL.createObjectURL(a),
              d = document.createElement('a')
            ;((d.href = c),
              (d.download = b),
              document.body.appendChild(d),
              d.click(),
              document.body.removeChild(d),
              window.URL.revokeObjectURL(c))
          },
          onError: (a) => {
            console.error('Error downloading receipt:', a)
          },
        })
      return B
        ? (0, b.jsx)('div', {
            className: 'container mx-auto px-4 py-8',
            children: (0, b.jsx)(h.Card, {
              children: (0, b.jsx)(h.CardContent, {
                className: 'pt-6',
                children: (0, b.jsxs)('div', {
                  className: 'space-y-4 text-center',
                  children: [
                    (0, b.jsx)(l.LoadingSpinner, { size: 'lg' }),
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground',
                      children: '결제 정보를 불러오는 중...',
                    }),
                  ],
                }),
              }),
            }),
          })
        : A
          ? (0, b.jsx)('div', {
              className: 'container mx-auto px-4 py-8',
              children: (0, b.jsxs)('div', {
                className: 'mx-auto max-w-4xl',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'mb-8 text-center',
                    children: [
                      (0, b.jsx)('div', {
                        className:
                          'mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100',
                        children: (0, b.jsx)(m.CheckCircleIcon, {
                          className: 'h-8 w-8 text-green-600',
                        }),
                      }),
                      (0, b.jsx)('h1', {
                        className: 'mb-2 text-3xl font-bold text-green-900',
                        children: '결제가 완료되었습니다!',
                      }),
                      (0, b.jsxs)('p', {
                        className: 'text-muted-foreground',
                        children: [A.booking.pet.name, '의 미용 예약이 확정되었습니다.'],
                      }),
                    ],
                  }),
                  (0, b.jsxs)('div', {
                    className: 'grid grid-cols-1 gap-8 lg:grid-cols-3',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'space-y-6 lg:col-span-2',
                        children: [
                          (0, b.jsxs)(h.Card, {
                            children: [
                              (0, b.jsx)(h.CardHeader, {
                                children: (0, b.jsxs)(h.CardTitle, {
                                  className: 'flex items-center space-x-2',
                                  children: [
                                    (0, b.jsx)(n.CalendarIcon, { className: 'h-5 w-5' }),
                                    (0, b.jsx)('span', { children: '예약 정보' }),
                                  ],
                                }),
                              }),
                              (0, b.jsxs)(h.CardContent, {
                                className: 'space-y-4',
                                children: [
                                  (0, b.jsxs)('div', {
                                    className: 'grid grid-cols-1 gap-4 md:grid-cols-2',
                                    children: [
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '반려동물',
                                          }),
                                          (0, b.jsxs)('div', {
                                            className: 'font-medium',
                                            children: [
                                              A.booking.pet.name,
                                              ' (',
                                              A.booking.pet.species,
                                              ')',
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '예약 번호',
                                          }),
                                          (0, b.jsxs)('div', {
                                            className: 'font-mono font-medium',
                                            children: ['#', A.booking.id],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '예약 날짜',
                                          }),
                                          (0, b.jsx)('div', {
                                            className: 'font-medium',
                                            children: A.booking.scheduledDate,
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '예약 시간',
                                          }),
                                          (0, b.jsx)('div', {
                                            className: 'font-medium',
                                            children: A.booking.scheduledTime,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, b.jsx)(k.Separator, {}),
                                  (0, b.jsxs)('div', {
                                    children: [
                                      (0, b.jsx)('div', {
                                        className: 'text-muted-foreground mb-2 text-sm',
                                        children: '미용사 정보',
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-center justify-between',
                                        children: [
                                          (0, b.jsx)('div', {
                                            children: (0, b.jsx)('div', {
                                              className: 'font-medium',
                                              children: A.booking.groomer.name,
                                            }),
                                          }),
                                          (0, b.jsx)(i.Button, {
                                            variant: 'outline',
                                            size: 'sm',
                                            asChild: !0,
                                            children: (0, b.jsxs)('a', {
                                              href: `tel:${A.booking.groomer.phone}`,
                                              children: [
                                                (0, b.jsx)(s.PhoneIcon, {
                                                  className: 'mr-2 h-4 w-4',
                                                }),
                                                '연락하기',
                                              ],
                                            }),
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)(h.Card, {
                            children: [
                              (0, b.jsx)(h.CardHeader, {
                                children: (0, b.jsx)(h.CardTitle, { children: '선택된 서비스' }),
                              }),
                              (0, b.jsx)(h.CardContent, {
                                children: (0, b.jsx)('div', {
                                  className: 'space-y-3',
                                  children: A.booking.services.map((a) =>
                                    (0, b.jsxs)(
                                      'div',
                                      {
                                        className:
                                          'flex items-center justify-between border-b py-3 last:border-b-0',
                                        children: [
                                          (0, b.jsx)('div', {
                                            children: (0, b.jsx)('div', {
                                              className: 'font-medium',
                                              children: a.name,
                                            }),
                                          }),
                                          (0, b.jsx)('div', {
                                            className: 'text-right',
                                            children: (0, b.jsxs)('div', {
                                              className: 'font-medium',
                                              children: [a.price.toLocaleString(), '원'],
                                            }),
                                          }),
                                        ],
                                      },
                                      a.id
                                    )
                                  ),
                                }),
                              }),
                            ],
                          }),
                          (0, b.jsxs)(h.Card, {
                            children: [
                              (0, b.jsx)(h.CardHeader, {
                                children: (0, b.jsxs)(h.CardTitle, {
                                  className: 'flex items-center space-x-2',
                                  children: [
                                    (0, b.jsx)(o.CreditCardIcon, { className: 'h-5 w-5' }),
                                    (0, b.jsx)('span', { children: '결제 정보' }),
                                  ],
                                }),
                              }),
                              (0, b.jsxs)(h.CardContent, {
                                className: 'space-y-4',
                                children: [
                                  (0, b.jsxs)('div', {
                                    className: 'grid grid-cols-1 gap-4 md:grid-cols-2',
                                    children: [
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '결제 금액',
                                          }),
                                          (0, b.jsxs)('div', {
                                            className: 'text-primary text-lg font-bold',
                                            children: [A.amount.toLocaleString('ko-KR'), '원'],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '결제 방법',
                                          }),
                                          (0, b.jsx)('div', {
                                            className: 'font-medium',
                                            children: A.method,
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '결제 시간',
                                          }),
                                          (0, b.jsx)('div', {
                                            className: 'font-medium',
                                            children: A.paidAt,
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'text-muted-foreground text-sm',
                                            children: '영수증 번호',
                                          }),
                                          (0, b.jsx)('div', {
                                            className: 'font-mono font-medium',
                                            children: A.receipt.receiptNumber,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, b.jsx)(k.Separator, {}),
                                  (0, b.jsxs)(i.Button, {
                                    variant: 'outline',
                                    onClick: () => {
                                      C.mutate()
                                    },
                                    className: 'w-full',
                                    children: [
                                      (0, b.jsx)(p.DownloadIcon, { className: 'mr-2 h-4 w-4' }),
                                      '영수증 다운로드',
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, b.jsxs)('div', {
                        className: 'space-y-6',
                        children: [
                          (0, b.jsxs)(h.Card, {
                            children: [
                              (0, b.jsx)(h.CardHeader, {
                                children: (0, b.jsx)(h.CardTitle, { children: '예약 상태' }),
                              }),
                              (0, b.jsxs)(h.CardContent, {
                                className: 'space-y-4',
                                children: [
                                  (0, b.jsxs)('div', {
                                    className: 'text-center',
                                    children: [
                                      (0, b.jsx)(j.Badge, {
                                        variant: 'default',
                                        className: 'bg-green-100 px-3 py-1 text-sm text-green-800',
                                        children: '예약 확정',
                                      }),
                                      (0, b.jsx)('p', {
                                        className: 'text-muted-foreground mt-2 text-sm',
                                        children: '미용사가 예약을 확인했습니다',
                                      }),
                                    ],
                                  }),
                                  (0, b.jsx)(k.Separator, {}),
                                  (0, b.jsxs)('div', {
                                    className: 'space-y-3 text-sm',
                                    children: [
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-start space-x-2',
                                        children: [
                                          (0, b.jsx)('div', {
                                            className:
                                              'mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500',
                                          }),
                                          (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('div', {
                                                className: 'font-medium',
                                                children: '예약 확정',
                                              }),
                                              (0, b.jsx)('div', {
                                                className: 'text-muted-foreground',
                                                children: '결제 완료됨',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-start space-x-2',
                                        children: [
                                          (0, b.jsx)('div', {
                                            className:
                                              'bg-muted mt-2 h-2 w-2 flex-shrink-0 rounded-full',
                                          }),
                                          (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('div', {
                                                className: 'font-medium',
                                                children: '서비스 준비',
                                              }),
                                              (0, b.jsx)('div', {
                                                className: 'text-muted-foreground',
                                                children: '미용 준비 중',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-start space-x-2',
                                        children: [
                                          (0, b.jsx)('div', {
                                            className:
                                              'bg-muted mt-2 h-2 w-2 flex-shrink-0 rounded-full',
                                          }),
                                          (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('div', {
                                                className: 'font-medium',
                                                children: '서비스 진행',
                                              }),
                                              (0, b.jsx)('div', {
                                                className: 'text-muted-foreground',
                                                children: '미용 시작',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-start space-x-2',
                                        children: [
                                          (0, b.jsx)('div', {
                                            className:
                                              'bg-muted mt-2 h-2 w-2 flex-shrink-0 rounded-full',
                                          }),
                                          (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('div', {
                                                className: 'font-medium',
                                                children: '완료',
                                              }),
                                              (0, b.jsx)('div', {
                                                className: 'text-muted-foreground',
                                                children: '서비스 완료',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)(h.Card, {
                            children: [
                              (0, b.jsx)(h.CardHeader, {
                                children: (0, b.jsx)(h.CardTitle, { children: '바로가기' }),
                              }),
                              (0, b.jsxs)(h.CardContent, {
                                className: 'space-y-3',
                                children: [
                                  (0, b.jsx)(i.Button, {
                                    variant: 'outline',
                                    className: 'w-full justify-start',
                                    asChild: !0,
                                    children: (0, b.jsxs)(g.default, {
                                      href: `/customer/booking/${A.booking.id}`,
                                      children: [
                                        (0, b.jsx)(n.CalendarIcon, { className: 'mr-2 h-4 w-4' }),
                                        '예약 상세보기',
                                      ],
                                    }),
                                  }),
                                  (0, b.jsx)(i.Button, {
                                    variant: 'outline',
                                    className: 'w-full justify-start',
                                    asChild: !0,
                                    children: (0, b.jsxs)(g.default, {
                                      href: '/customer/bookings',
                                      children: [
                                        (0, b.jsx)(n.CalendarIcon, { className: 'mr-2 h-4 w-4' }),
                                        '내 예약 목록',
                                      ],
                                    }),
                                  }),
                                  (0, b.jsx)(i.Button, {
                                    variant: 'outline',
                                    className: 'w-full justify-start',
                                    asChild: !0,
                                    children: (0, b.jsxs)(g.default, {
                                      href: '/customer/messages',
                                      children: [
                                        (0, b.jsx)(r.MessageCircleIcon, {
                                          className: 'mr-2 h-4 w-4',
                                        }),
                                        '메시지함',
                                      ],
                                    }),
                                  }),
                                  (0, b.jsx)(i.Button, {
                                    variant: 'outline',
                                    className: 'w-full justify-start',
                                    asChild: !0,
                                    children: (0, b.jsxs)(g.default, {
                                      href: '/customer',
                                      children: [
                                        (0, b.jsx)(q.HomeIcon, { className: 'mr-2 h-4 w-4' }),
                                        '홈으로',
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsxs)(h.Card, {
                            children: [
                              (0, b.jsx)(h.CardHeader, {
                                children: (0, b.jsx)(h.CardTitle, { children: '고객 지원' }),
                              }),
                              (0, b.jsxs)(h.CardContent, {
                                className: 'space-y-3',
                                children: [
                                  (0, b.jsx)('p', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '예약이나 결제에 문제가 있으신가요?',
                                  }),
                                  (0, b.jsx)(i.Button, {
                                    variant: 'outline',
                                    className: 'w-full justify-start',
                                    asChild: !0,
                                    children: (0, b.jsxs)('a', {
                                      href: w.CUSTOMER_SERVICE.PHONE_URL,
                                      children: [
                                        (0, b.jsx)(s.PhoneIcon, { className: 'mr-2 h-4 w-4' }),
                                        '고객센터: ',
                                        w.CUSTOMER_SERVICE.PHONE,
                                      ],
                                    }),
                                  }),
                                  (0, b.jsx)(i.Button, {
                                    variant: 'outline',
                                    className: 'w-full justify-start',
                                    asChild: !0,
                                    children: (0, b.jsxs)(g.default, {
                                      href: '/support',
                                      children: [
                                        (0, b.jsx)(r.MessageCircleIcon, {
                                          className: 'mr-2 h-4 w-4',
                                        }),
                                        '온라인 문의',
                                      ],
                                    }),
                                  }),
                                ],
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
          : (0, b.jsx)('div', {
              className: 'container mx-auto px-4 py-8',
              children: (0, b.jsx)(h.Card, {
                children: (0, b.jsx)(h.CardContent, {
                  className: 'pt-6',
                  children: (0, b.jsxs)('div', {
                    className: 'space-y-4 text-center',
                    children: [
                      (0, b.jsx)(t.AlertCircleIcon, {
                        className: 'text-muted-foreground mx-auto h-12 w-12',
                      }),
                      (0, b.jsx)('h3', {
                        className: 'text-lg font-semibold',
                        children: '결제 정보를 찾을 수 없습니다',
                      }),
                      (0, b.jsx)('p', {
                        className: 'text-muted-foreground',
                        children: '유효하지 않은 결제이거나 이미 처리된 결제입니다.',
                      }),
                      (0, b.jsx)(i.Button, {
                        onClick: () => y.push('/customer/bookings'),
                        children: '예약 목록으로 돌아가기',
                      }),
                    ],
                  }),
                }),
              }),
            })
    }
    a.s(['default', () => x])
  },
]

//# sourceMappingURL=src_app_customer_booking_%5Bid%5D_payment_success_page_tsx_0bfdabbb._.js.map
