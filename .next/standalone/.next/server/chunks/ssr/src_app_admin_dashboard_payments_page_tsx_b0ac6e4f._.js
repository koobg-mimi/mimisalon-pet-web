module.exports = [
  564069,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(529139),
      d = a.i(50944),
      e = a.i(572131),
      f = a.i(911156),
      g = a.i(205138),
      h = a.i(737984),
      i = a.i(369012),
      j = a.i(699570),
      k = a.i(591119),
      l = a.i(866718),
      m = a.i(580701)
    function n({ filters: a, onFiltersChange: c, totalCount: d }) {
      let e = () => {}
      return (0, b.jsx)(k.Card, {
        className: 'mb-6',
        children: (0, b.jsxs)(k.CardContent, {
          className: 'pt-6',
          children: [
            (0, b.jsxs)('div', {
              className: 'flex flex-col gap-4 sm:flex-row sm:items-center',
              children: [
                (0, b.jsx)('div', {
                  className: 'relative flex-1',
                  children: (0, b.jsx)(l.Input, {
                    type: 'search',
                    placeholder: '결제 ID, 주문 ID, 주문명, 예약번호로 검색...',
                    value: a.searchQuery,
                    onChange: (a) => {
                      c({ searchQuery: a.target.value })
                    },
                    onKeyDown: (a) => 'Enter' === a.key && e(),
                  }),
                }),
                (0, b.jsxs)(m.Select, {
                  value: a.statusFilter,
                  onValueChange: (a) => {
                    c({ statusFilter: a })
                  },
                  children: [
                    (0, b.jsx)(m.SelectTrigger, {
                      className: 'h-10 w-full sm:w-[180px]',
                      children: (0, b.jsx)(m.SelectValue, { placeholder: '상태 필터' }),
                    }),
                    (0, b.jsxs)(m.SelectContent, {
                      children: [
                        (0, b.jsx)(m.SelectItem, { value: 'ALL', children: '모든 상태' }),
                        (0, b.jsx)(m.SelectItem, { value: 'PENDING', children: '대기중' }),
                        (0, b.jsx)(m.SelectItem, { value: 'PAID', children: '결제완료' }),
                        (0, b.jsx)(m.SelectItem, { value: 'AUTHORIZED', children: '승인됨' }),
                        (0, b.jsx)(m.SelectItem, { value: 'CAPTURED', children: '확정됨' }),
                        (0, b.jsx)(m.SelectItem, { value: 'COMPLETED', children: '완료' }),
                        (0, b.jsx)(m.SelectItem, { value: 'FAILED', children: '실패' }),
                        (0, b.jsx)(m.SelectItem, { value: 'CANCELLED', children: '취소됨' }),
                        (0, b.jsx)(m.SelectItem, {
                          value: 'PARTIAL_CANCELLED',
                          children: '부분취소',
                        }),
                        (0, b.jsx)(m.SelectItem, { value: 'REFUNDED', children: '환불완료' }),
                        (0, b.jsx)(m.SelectItem, {
                          value: 'PARTIALLY_REFUNDED',
                          children: '부분환불',
                        }),
                        (0, b.jsx)(m.SelectItem, { value: 'EXPIRED', children: '만료' }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsxs)(j.Button, {
                  onClick: e,
                  variant: 'outline',
                  className: 'h-10 w-full sm:w-auto',
                  children: [(0, b.jsx)(i.Filter, { className: 'mr-2 h-4 w-4' }), '필터 적용'],
                }),
              ],
            }),
            d > 0 &&
              (0, b.jsxs)('div', {
                className: 'text-muted-foreground mt-4 text-sm',
                children: ['총 ', d.toLocaleString(), '건의 결제 내역'],
              }),
          ],
        }),
      })
    }
    var o = a.i(452495),
      p = a.i(206015)
    let q = {
      PAID: {
        label: '결제완료',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        description: '결제가 정상적으로 완료되었습니다',
      },
      PENDING: {
        label: '대기중',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        description: '결제 처리 대기 중입니다',
      },
      FAILED: {
        label: '실패',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        description: '결제가 실패했습니다',
      },
      CANCELLED: {
        label: '취소됨',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        description: '결제가 취소되었습니다',
      },
      REFUNDED: {
        label: '환불완료',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        description: '전액 환불 처리되었습니다',
      },
      PARTIALLY_REFUNDED: {
        label: '부분환불',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        description: '부분 환불 처리되었습니다',
      },
      AUTHORIZED: {
        label: '승인됨',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        description: '결제 승인되었습니다',
      },
      CAPTURED: {
        label: '확정됨',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100',
        description: '결제 확정되었습니다',
      },
      COMPLETED: {
        label: '완료',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        description: '결제가 완료되었습니다',
      },
      PARTIAL_CANCELLED: {
        label: '부분취소',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        description: '부분 취소되었습니다',
      },
      EXPIRED: {
        label: '만료',
        color: 'text-slate-700',
        bgColor: 'bg-slate-100',
        description: '결제 유효기간이 만료되었습니다',
      },
    }
    var r = a.i(368114)
    function s({ status: a, className: c }) {
      let d = q[a]
      return (0, b.jsx)('span', {
        className: (0, r.cn)(
          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
          d.bgColor,
          d.color,
          c
        ),
        title: d.description,
        children: d.label,
      })
    }
    var t = a.i(1631),
      u = a.i(170106)
    let v = (0, u.default)('building-2', [
      ['path', { d: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z', key: '1b4qmf' }],
      ['path', { d: 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2', key: 'i71pzd' }],
      ['path', { d: 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2', key: '10jefs' }],
      ['path', { d: 'M10 6h4', key: '1itunk' }],
      ['path', { d: 'M10 10h4', key: 'tcdvrf' }],
      ['path', { d: 'M10 14h4', key: 'kelpxr' }],
      ['path', { d: 'M10 18h4', key: '1ulq68' }],
    ])
    var w = a.i(858217),
      w = w
    let x = (0, u.default)('wallet', [
      [
        'path',
        {
          d: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1',
          key: '18etb6',
        },
      ],
      ['path', { d: 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4', key: 'xoc0q4' }],
    ])
    function y({ method: a, className: c = 'h-5 w-5' }) {
      let d = {
        CARD: (0, b.jsx)(f.CreditCard, { className: c }),
        PHONE: (0, b.jsx)(t.Smartphone, { className: c }),
        VIRTUAL_ACCOUNT: (0, b.jsx)(v, { className: c }),
        GIFT_CERTIFICATE: (0, b.jsx)(w.default, { className: c }),
        EASY_PAY: (0, b.jsx)(x, { className: c }),
        TRANSFER: (0, b.jsx)(v, { className: c }),
      }
      return (0, b.jsx)(b.Fragment, {
        children: d[a] || (0, b.jsx)(f.CreditCard, { className: c }),
      })
    }
    var z = a.i(256711),
      A = a.i(302491)
    function B(a, b = 'KRW') {
      return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: b }).format(a)
    }
    function C(a) {
      return a ? (0, z.format)(new Date(a), 'yyyy-MM-dd HH:mm', { locale: A.ko }) : '-'
    }
    function D({
      payments: a,
      isLoading: c,
      onViewDetails: d,
      currentPage: e,
      totalPages: f,
      onPageChange: g,
    }) {
      return c
        ? (0, b.jsx)(k.Card, {
            children: (0, b.jsx)(k.CardContent, {
              className: 'py-12',
              children: (0, b.jsx)('div', {
                className: 'text-muted-foreground flex items-center justify-center text-sm',
                children: '결제 내역을 불러오는 중...',
              }),
            }),
          })
        : (0, b.jsx)(k.Card, {
            children: (0, b.jsxs)(k.CardContent, {
              className: 'p-0',
              children: [
                (0, b.jsx)('div', {
                  className: 'overflow-x-auto',
                  children: (0, b.jsxs)(p.Table, {
                    children: [
                      (0, b.jsx)(p.TableHeader, {
                        children: (0, b.jsxs)(p.TableRow, {
                          children: [
                            (0, b.jsx)(p.TableHead, { children: '결제 정보' }),
                            (0, b.jsx)(p.TableHead, { children: '고객' }),
                            (0, b.jsx)(p.TableHead, { children: '금액' }),
                            (0, b.jsx)(p.TableHead, { children: '상태' }),
                            (0, b.jsx)(p.TableHead, { children: '결제일시' }),
                            (0, b.jsx)(p.TableHead, { className: 'text-right', children: '작업' }),
                          ],
                        }),
                      }),
                      (0, b.jsx)(p.TableBody, {
                        children:
                          0 === a.length
                            ? (0, b.jsx)(p.TableRow, {
                                children: (0, b.jsx)(p.TableCell, {
                                  colSpan: 6,
                                  className: 'text-muted-foreground py-8 text-center',
                                  children: '결제 내역이 없습니다',
                                }),
                              })
                            : a.map((a) =>
                                (0, b.jsxs)(
                                  p.TableRow,
                                  {
                                    className: 'hover:bg-muted/50 cursor-pointer',
                                    onClick: () => d?.(a),
                                    children: [
                                      (0, b.jsx)(p.TableCell, {
                                        children: (0, b.jsxs)('div', {
                                          className: 'flex items-center space-x-3',
                                          children: [
                                            (0, b.jsx)('div', {
                                              className:
                                                'bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full',
                                              children: (0, b.jsx)(y, { method: a.method }),
                                            }),
                                            (0, b.jsxs)('div', {
                                              children: [
                                                (0, b.jsx)('p', {
                                                  className: 'font-medium',
                                                  children: a.orderName || '주문명 없음',
                                                }),
                                                (0, b.jsxs)('div', {
                                                  className:
                                                    'text-muted-foreground space-y-0.5 text-xs',
                                                  children: [
                                                    a.booking?.bookingNumber &&
                                                      (0, b.jsxs)('div', {
                                                        children: [
                                                          '예약번호: ',
                                                          a.booking.bookingNumber,
                                                        ],
                                                      }),
                                                    (0, b.jsxs)('div', {
                                                      children: ['결제 ID: ', a.paymentId],
                                                    }),
                                                    a.orderId &&
                                                      (0, b.jsxs)('div', {
                                                        children: ['주문 ID: ', a.orderId],
                                                      }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                      (0, b.jsx)(p.TableCell, {
                                        children: a.customer
                                          ? (0, b.jsxs)('div', {
                                              children: [
                                                (0, b.jsx)('p', {
                                                  className: 'text-sm font-medium',
                                                  children: a.customer.name || '이름 없음',
                                                }),
                                                (0, b.jsx)('p', {
                                                  className: 'text-muted-foreground text-xs',
                                                  children: a.customer.email,
                                                }),
                                              ],
                                            })
                                          : a.booking?.customer
                                            ? (0, b.jsxs)('div', {
                                                children: [
                                                  (0, b.jsx)('p', {
                                                    className: 'text-sm font-medium',
                                                    children:
                                                      a.booking.customer.name || '이름 없음',
                                                  }),
                                                  (0, b.jsx)('p', {
                                                    className: 'text-muted-foreground text-xs',
                                                    children: a.booking.customer.email,
                                                  }),
                                                ],
                                              })
                                            : (0, b.jsx)('span', {
                                                className: 'text-muted-foreground text-sm',
                                                children: '-',
                                              }),
                                      }),
                                      (0, b.jsx)(p.TableCell, {
                                        children: (0, b.jsxs)('div', {
                                          children: [
                                            (0, b.jsx)('p', {
                                              className: 'font-semibold',
                                              children: B(a.amount, a.currency),
                                            }),
                                            a.cancelledAmount &&
                                              a.cancelledAmount > 0 &&
                                              (0, b.jsxs)('p', {
                                                className: 'text-xs text-orange-600',
                                                children: [
                                                  '환불: ',
                                                  B(a.cancelledAmount, a.currency),
                                                ],
                                              }),
                                          ],
                                        }),
                                      }),
                                      (0, b.jsx)(p.TableCell, {
                                        children: (0, b.jsxs)('div', {
                                          className: 'space-y-1',
                                          children: [
                                            (0, b.jsx)(s, { status: a.status }),
                                            'FAILED' === a.status &&
                                              a.failReason &&
                                              (0, b.jsx)('p', {
                                                className: 'mt-1 text-xs text-red-600',
                                                children: a.failReason,
                                              }),
                                            ('CANCELLED' === a.status ||
                                              'PARTIAL_CANCELLED' === a.status) &&
                                              a.cancelReason &&
                                              (0, b.jsx)('p', {
                                                className: 'mt-1 text-xs text-gray-600',
                                                children: a.cancelReason,
                                              }),
                                          ],
                                        }),
                                      }),
                                      (0, b.jsx)(p.TableCell, {
                                        children: (0, b.jsxs)('div', {
                                          className: 'space-y-0.5 text-sm',
                                          children: [
                                            (0, b.jsx)('div', {
                                              children: a.paidAt
                                                ? C(a.paidAt)
                                                : a.failedAt
                                                  ? C(a.failedAt)
                                                  : C(a.createdAt),
                                            }),
                                            a.cancelledAt &&
                                              (0, b.jsxs)('div', {
                                                className: 'text-xs text-gray-500',
                                                children: ['취소: ', C(a.cancelledAt)],
                                              }),
                                            a.refundedAt &&
                                              (0, b.jsxs)('div', {
                                                className: 'text-xs text-purple-600',
                                                children: ['환불: ', C(a.refundedAt)],
                                              }),
                                          ],
                                        }),
                                      }),
                                      (0, b.jsx)(p.TableCell, {
                                        className: 'text-right',
                                        children:
                                          a.receiptUrl &&
                                          (0, b.jsxs)(j.Button, {
                                            size: 'sm',
                                            variant: 'outline',
                                            onClick: (b) => {
                                              ;(b.stopPropagation(),
                                                window.open(a.receiptUrl, '_blank'))
                                            },
                                            children: [
                                              (0, b.jsx)(o.ExternalLink, {
                                                className: 'mr-1 h-3 w-3',
                                              }),
                                              '영수증',
                                            ],
                                          }),
                                      }),
                                    ],
                                  },
                                  a.id
                                )
                              ),
                      }),
                    ],
                  }),
                }),
                f > 1 &&
                  (0, b.jsxs)('div', {
                    className: 'flex items-center justify-between border-t px-6 py-4',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'text-muted-foreground text-sm',
                        children: ['페이지 ', e, ' / ', f],
                      }),
                      (0, b.jsxs)('div', {
                        className: 'flex items-center space-x-2',
                        children: [
                          (0, b.jsx)(j.Button, {
                            variant: 'outline',
                            size: 'sm',
                            onClick: () => g(Math.max(1, e - 1)),
                            disabled: 1 === e,
                            children: '이전',
                          }),
                          (0, b.jsx)(j.Button, {
                            variant: 'outline',
                            size: 'sm',
                            onClick: () => g(Math.min(f, e + 1)),
                            disabled: e === f,
                            children: '다음',
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
          })
    }
    var E = a.i(814574)
    function F({ payment: a, open: c, onOpenChange: d }) {
      var e
      return a
        ? (0, b.jsx)(E.Dialog, {
            open: c,
            onOpenChange: d,
            children: (0, b.jsxs)(E.DialogContent, {
              className: 'max-h-[80vh] max-w-2xl overflow-y-auto',
              children: [
                (0, b.jsx)(E.DialogHeader, {
                  children: (0, b.jsxs)(E.DialogTitle, {
                    className: 'flex items-center gap-2',
                    children: ['결제 상세 정보', (0, b.jsx)(s, { status: a.status })],
                  }),
                }),
                (0, b.jsxs)('div', {
                  className: 'space-y-6',
                  children: [
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 text-sm font-semibold',
                          children: '결제 정보',
                        }),
                        (0, b.jsxs)('div', {
                          className: 'bg-muted/50 space-y-2 rounded-lg p-4',
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'flex items-center justify-between',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-muted-foreground text-sm',
                                  children: '결제 수단',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    (0, b.jsx)(y, { method: a.method, className: 'h-4 w-4' }),
                                    (0, b.jsx)('span', {
                                      className: 'text-sm font-medium',
                                      children:
                                        {
                                          CARD: '신용/체크카드',
                                          VIRTUAL_ACCOUNT: '가상계좌',
                                          TRANSFER: '계좌이체',
                                          PHONE: '휴대폰',
                                          GIFT_CERTIFICATE: '상품권',
                                          EASY_PAY: '간편결제',
                                        }[(e = a.method)] || e,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              className: 'flex items-center justify-between',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-muted-foreground text-sm',
                                  children: '결제 금액',
                                }),
                                (0, b.jsx)('span', {
                                  className: 'text-base font-semibold',
                                  children: B(a.amount, a.currency),
                                }),
                              ],
                            }),
                            a.cancelledAmount &&
                              a.cancelledAmount > 0 &&
                              (0, b.jsxs)('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '환불 금액',
                                  }),
                                  (0, b.jsx)('span', {
                                    className: 'text-sm font-medium text-orange-600',
                                    children: B(a.cancelledAmount, a.currency),
                                  }),
                                ],
                              }),
                            (0, b.jsxs)('div', {
                              className: 'flex items-center justify-between',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-muted-foreground text-sm',
                                  children: '주문명',
                                }),
                                (0, b.jsx)('span', {
                                  className: 'text-sm',
                                  children: a.orderName || '-',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 text-sm font-semibold',
                          children: '거래 식별자',
                        }),
                        (0, b.jsxs)('div', {
                          className: 'bg-muted/50 space-y-2 rounded-lg p-4 text-sm',
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'flex flex-col gap-1',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-muted-foreground text-xs',
                                  children: '결제 ID',
                                }),
                                (0, b.jsx)('code', { className: 'text-xs', children: a.paymentId }),
                              ],
                            }),
                            a.orderId &&
                              (0, b.jsxs)('div', {
                                className: 'flex flex-col gap-1',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-xs',
                                    children: '주문 ID',
                                  }),
                                  (0, b.jsx)('code', { className: 'text-xs', children: a.orderId }),
                                ],
                              }),
                            a.pgTxId &&
                              (0, b.jsxs)('div', {
                                className: 'flex flex-col gap-1',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-xs',
                                    children: 'PG 거래 ID',
                                  }),
                                  (0, b.jsx)('code', { className: 'text-xs', children: a.pgTxId }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    }),
                    a.customer &&
                      (0, b.jsxs)('div', {
                        children: [
                          (0, b.jsx)('h3', {
                            className: 'mb-3 text-sm font-semibold',
                            children: '고객 정보',
                          }),
                          (0, b.jsxs)('div', {
                            className: 'bg-muted/50 space-y-2 rounded-lg p-4',
                            children: [
                              (0, b.jsxs)('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '이름',
                                  }),
                                  (0, b.jsx)('span', {
                                    className: 'text-sm',
                                    children: a.customer.name || '-',
                                  }),
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '이메일',
                                  }),
                                  (0, b.jsx)('span', {
                                    className: 'text-sm',
                                    children: a.customer.email,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    a.booking &&
                      (0, b.jsxs)('div', {
                        children: [
                          (0, b.jsx)('h3', {
                            className: 'mb-3 text-sm font-semibold',
                            children: '예약 정보',
                          }),
                          (0, b.jsxs)('div', {
                            className: 'bg-muted/50 space-y-2 rounded-lg p-4',
                            children: [
                              (0, b.jsxs)('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '예약 번호',
                                  }),
                                  (0, b.jsx)('span', {
                                    className: 'font-mono text-sm',
                                    children: a.booking.bookingNumber,
                                  }),
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '서비스 일시',
                                  }),
                                  (0, b.jsxs)('span', {
                                    className: 'text-sm',
                                    children: [
                                      C(a.booking.serviceDate),
                                      ' ',
                                      a.booking.serviceTime,
                                    ],
                                  }),
                                ],
                              }),
                              a.booking.groomer &&
                                (0, b.jsxs)('div', {
                                  className: 'flex items-center justify-between',
                                  children: [
                                    (0, b.jsx)('span', {
                                      className: 'text-muted-foreground text-sm',
                                      children: '담당 미용사',
                                    }),
                                    (0, b.jsx)('span', {
                                      className: 'text-sm',
                                      children: a.booking.groomer.name || '-',
                                    }),
                                  ],
                                }),
                            ],
                          }),
                        ],
                      }),
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 text-sm font-semibold',
                          children: '거래 내역',
                        }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'flex items-start gap-3',
                              children: [
                                (0, b.jsx)('div', {
                                  className:
                                    'bg-primary/10 text-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-1 text-xs font-medium',
                                  children: '1',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'flex-1',
                                  children: [
                                    (0, b.jsx)('div', {
                                      className: 'text-sm font-medium',
                                      children: '결제 생성',
                                    }),
                                    (0, b.jsx)('div', {
                                      className: 'text-muted-foreground text-xs',
                                      children: C(a.createdAt),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            a.paidAt &&
                              (0, b.jsxs)('div', {
                                className: 'flex items-start gap-3',
                                children: [
                                  (0, b.jsx)('div', {
                                    className:
                                      'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 p-1 text-xs font-medium text-green-700',
                                    children: '✓',
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex-1',
                                    children: [
                                      (0, b.jsx)('div', {
                                        className: 'text-sm font-medium',
                                        children: '결제 완료',
                                      }),
                                      (0, b.jsx)('div', {
                                        className: 'text-muted-foreground text-xs',
                                        children: C(a.paidAt),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            a.failedAt &&
                              (0, b.jsxs)('div', {
                                className: 'flex items-start gap-3',
                                children: [
                                  (0, b.jsx)('div', {
                                    className:
                                      'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 p-1 text-xs font-medium text-red-700',
                                    children: '✕',
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex-1',
                                    children: [
                                      (0, b.jsx)('div', {
                                        className: 'text-sm font-medium',
                                        children: '결제 실패',
                                      }),
                                      (0, b.jsx)('div', {
                                        className: 'text-muted-foreground text-xs',
                                        children: C(a.failedAt),
                                      }),
                                      a.failReason &&
                                        (0, b.jsx)('div', {
                                          className: 'mt-1 text-xs text-red-600',
                                          children: a.failReason,
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                            a.cancelledAt &&
                              (0, b.jsxs)('div', {
                                className: 'flex items-start gap-3',
                                children: [
                                  (0, b.jsx)('div', {
                                    className:
                                      'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 p-1 text-xs font-medium text-gray-700',
                                    children: '−',
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex-1',
                                    children: [
                                      (0, b.jsx)('div', {
                                        className: 'text-sm font-medium',
                                        children: '결제 취소',
                                      }),
                                      (0, b.jsx)('div', {
                                        className: 'text-muted-foreground text-xs',
                                        children: C(a.cancelledAt),
                                      }),
                                      a.cancelReason &&
                                        (0, b.jsx)('div', {
                                          className: 'mt-1 text-xs text-gray-600',
                                          children: a.cancelReason,
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                            a.refundedAt &&
                              (0, b.jsxs)('div', {
                                className: 'flex items-start gap-3',
                                children: [
                                  (0, b.jsx)('div', {
                                    className:
                                      'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 p-1 text-xs font-medium text-purple-700',
                                    children: '↺',
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex-1',
                                    children: [
                                      (0, b.jsx)('div', {
                                        className: 'text-sm font-medium',
                                        children: '환불 처리',
                                      }),
                                      (0, b.jsx)('div', {
                                        className: 'text-muted-foreground text-xs',
                                        children: C(a.refundedAt),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    }),
                    a.receiptUrl &&
                      (0, b.jsx)('div', {
                        children: (0, b.jsx)('a', {
                          href: a.receiptUrl,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className: 'text-primary text-sm hover:underline',
                          children: '영수증 보기 →',
                        }),
                      }),
                  ],
                }),
              ],
            }),
          })
        : null
    }
    var G = a.i(414202)
    function H() {
      let { data: a, isPending: i } = (0, c.useSession)(),
        j = (0, d.useRouter)(),
        [k, l] = (0, e.useState)({ searchQuery: '', statusFilter: 'ALL' }),
        [m, o] = (0, e.useState)(1),
        [p, q] = (0, e.useState)(null),
        [r, s] = (0, e.useState)(!1),
        {
          payments: t,
          pagination: u,
          isLoading: v,
          isFetching: w,
          isError: x,
          error: y,
        } = (function ({ filters: a, page: b, limit: c = 20, enabled: d = !0 }) {
          let {
            data: e,
            isLoading: f,
            isFetching: g,
            isError: h,
            error: i,
            refetch: j,
          } = (0, G.useGetPaymentsQuery)(
            { page: b, limit: c, searchQuery: a.searchQuery, statusFilter: a.statusFilter },
            { skip: !d }
          )
          return {
            payments: e?.payments ?? [],
            pagination: {
              currentPage: e?.currentPage ?? b,
              totalPages: e?.totalPages ?? 1,
              totalCount: e?.totalCount ?? 0,
            },
            isLoading: f,
            isFetching: g,
            isError: h,
            error: i,
            refetch: j,
            isEmpty: !f && (e?.payments?.length ?? 0) === 0,
            hasNextPage: (e?.currentPage ?? 1) < (e?.totalPages ?? 1),
            hasPreviousPage: (e?.currentPage ?? 1) > 1,
          }
        })({ filters: k, page: m, limit: 20, enabled: !!a?.user && 'ADMIN' === a.user.role })
      ;(0, e.useEffect)(() => {
        ;(i || a || j.push('/auth/signin'),
          !i && a?.user?.role && 'ADMIN' !== a.user.role && j.push('/admin/dashboard/overview'))
      }, [a, i, j])
      let z = (0, e.useCallback)((a) => {
          ;(q(a), s(!0))
        }, []),
        A = (0, e.useCallback)((a) => {
          ;(l((b) => ({ ...b, ...a })), o(1))
        }, []),
        B = (0, e.useCallback)((a) => {
          o(a)
        }, [])
      return i
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(g.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'ADMIN'
          ? x
            ? (0, b.jsx)('div', {
                className: 'flex min-h-screen items-center justify-center',
                children: (0, b.jsxs)('div', {
                  className: 'text-center',
                  children: [
                    (0, b.jsx)('p', {
                      className: 'mb-4 text-red-600',
                      children: '데이터를 불러오는데 실패했습니다',
                    }),
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground text-sm',
                      children: y?.message || '잠시 후 다시 시도해주세요',
                    }),
                  ],
                }),
              })
            : (0, b.jsxs)('div', {
                className: 'bg-background min-h-screen',
                children: [
                  (0, b.jsx)('header', {
                    className: 'border-border border-b',
                    children: (0, b.jsx)(h.PageHeader, {
                      title: '결제 이력',
                      description: '플랫폼의 모든 결제 내역을 조회하고 관리하세요',
                      children: (0, b.jsx)('div', {
                        className: 'flex items-center gap-2',
                        children: (0, b.jsx)(f.CreditCard, { className: 'text-primary h-5 w-5' }),
                      }),
                    }),
                  }),
                  (0, b.jsx)('main', {
                    className: 'container mx-auto px-4 py-8',
                    children: (0, b.jsxs)('div', {
                      className: 'space-y-6',
                      children: [
                        (0, b.jsx)(n, { filters: k, onFiltersChange: A, totalCount: u.totalCount }),
                        (0, b.jsx)(D, {
                          payments: t,
                          isLoading: v || w,
                          onViewDetails: z,
                          currentPage: u.currentPage,
                          totalPages: u.totalPages,
                          onPageChange: B,
                        }),
                        p && (0, b.jsx)(F, { payment: p, open: r, onOpenChange: s }),
                      ],
                    }),
                  }),
                ],
              })
          : null
    }
    a.s(['default', () => H], 564069)
  },
]

//# sourceMappingURL=src_app_admin_dashboard_payments_page_tsx_b0ac6e4f._.js.map
