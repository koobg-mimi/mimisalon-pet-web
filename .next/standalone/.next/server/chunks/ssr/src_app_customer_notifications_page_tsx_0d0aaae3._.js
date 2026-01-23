module.exports = [
  733312,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(50944),
      d = a.i(572131),
      e = a.i(699570),
      f = a.i(866718),
      g = a.i(580701),
      h = a.i(875083),
      i = a.i(786304),
      j = a.i(205138),
      k = a.i(256711),
      l = a.i(302491),
      m = a.i(591119),
      n = a.i(335732),
      o = a.i(730769),
      p = a.i(839982),
      q = a.i(275564),
      r = a.i(858217),
      r = r,
      s = a.i(485155),
      t = a.i(499548),
      t = t,
      u = a.i(592284),
      v = a.i(606406)
    let w = (0, a.i(170106).default)('archive', [
      ['rect', { width: '20', height: '5', x: '2', y: '3', rx: '1', key: '1wp1u1' }],
      ['path', { d: 'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8', key: '1s80jp' }],
      ['path', { d: 'M10 12h4', key: 'a56b0p' }],
    ])
    var x = a.i(983290),
      y = a.i(908843),
      y = y,
      z = a.i(368114)
    let A = {
        BOOKING_CONFIRMED: o.CalendarIcon,
        BOOKING_CANCELLED: o.CalendarIcon,
        BOOKING_REMINDER: o.CalendarIcon,
        GROOMING_STARTED: q.ScissorsIcon,
        GROOMING_COMPLETED: q.ScissorsIcon,
        PAYMENT_RECEIVED: p.CreditCardIcon,
        PAYMENT_FAILED: p.CreditCardIcon,
        REFUND_PROCESSED: p.CreditCardIcon,
        REVIEW_REQUEST: q.ScissorsIcon,
        PROMOTION: r.default,
        SYSTEM_NOTICE: t.default,
      },
      B = {
        BOOKING_CONFIRMED: 'text-green-600 bg-green-100',
        BOOKING_CANCELLED: 'text-red-600 bg-red-100',
        BOOKING_REMINDER: 'text-blue-600 bg-blue-100',
        GROOMING_STARTED: 'text-purple-600 bg-purple-100',
        GROOMING_COMPLETED: 'text-green-600 bg-green-100',
        PAYMENT_RECEIVED: 'text-emerald-600 bg-emerald-100',
        PAYMENT_FAILED: 'text-red-600 bg-red-100',
        REFUND_PROCESSED: 'text-orange-600 bg-orange-100',
        REVIEW_REQUEST: 'text-yellow-600 bg-yellow-100',
        PROMOTION: 'text-pink-600 bg-pink-100',
        SYSTEM_NOTICE: 'text-gray-600 bg-gray-100',
      },
      C = {
        LOW: 'border-l-gray-300',
        NORMAL: 'border-l-blue-400',
        HIGH: 'border-l-orange-400',
        URGENT: 'border-l-red-500',
      }
    function D({
      notification: a,
      onMarkAsRead: c,
      onMarkAsUnread: f,
      onArchive: g,
      onDelete: h,
      onNavigate: j,
      className: o,
    }) {
      var p
      let [q, r] = (0, d.useState)(!1),
        t = A[a.type] || s.AlertCircleIcon,
        D = B[a.type] || 'text-gray-600 bg-gray-100',
        E = C[a.priority],
        F = 'UNREAD' === a.status,
        G = 'ARCHIVED' === a.status
      return (0, b.jsx)(m.Card, {
        className: (0, z.cn)(
          'cursor-pointer border-l-4 transition-all duration-200 hover:shadow-md',
          E,
          { 'border-blue-200 bg-blue-50/50': F, 'opacity-60': G },
          o
        ),
        onClick: () => {
          ;(F && c(a.id), j && j(a))
        },
        children: (0, b.jsx)(m.CardContent, {
          className: 'p-4',
          children: (0, b.jsxs)('div', {
            className: 'flex items-start space-x-3',
            children: [
              (0, b.jsx)('div', {
                className: (0, z.cn)('flex-shrink-0 rounded-lg p-2', D),
                children: (0, b.jsx)(t, { className: 'h-5 w-5' }),
              }),
              (0, b.jsx)('div', {
                className: 'min-w-0 flex-1',
                children: (0, b.jsxs)('div', {
                  className: 'flex items-start justify-between',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'min-w-0 flex-1',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'mb-1 flex items-center space-x-2',
                          children: [
                            (0, b.jsx)('h4', {
                              className: (0, z.cn)(
                                'truncate text-sm font-medium',
                                F ? 'text-gray-900' : 'text-gray-700'
                              ),
                              children: a.title,
                            }),
                            F &&
                              (0, b.jsx)('div', {
                                className: 'h-2 w-2 flex-shrink-0 rounded-full bg-blue-500',
                              }),
                          ],
                        }),
                        (0, b.jsx)('p', {
                          className: 'mb-2 line-clamp-2 text-sm text-gray-600',
                          children: a.content,
                        }),
                        (0, b.jsxs)('div', {
                          className: 'flex items-center space-x-3 text-xs text-gray-500',
                          children: [
                            (0, b.jsx)('span', {
                              children:
                                {
                                  BOOKING_CONFIRMED: '예약 확정',
                                  BOOKING_CANCELLED: '예약 취소',
                                  BOOKING_REMINDER: '예약 알림',
                                  GROOMING_STARTED: '미용 시작',
                                  GROOMING_COMPLETED: '미용 완료',
                                  PAYMENT_RECEIVED: '결제 완료',
                                  PAYMENT_FAILED: '결제 실패',
                                  REFUND_PROCESSED: '환불 완료',
                                  REVIEW_REQUEST: '리뷰 요청',
                                  PROMOTION: '프로모션',
                                  SYSTEM_NOTICE: '시스템 공지',
                                }[(p = a.type)] || p,
                            }),
                            (0, b.jsx)('span', { children: '•' }),
                            (0, b.jsx)('span', {
                              children: ((a) => {
                                let b = new Date(a),
                                  c = Math.floor((new Date().getTime() - b.getTime()) / 6e4)
                                if (c < 1) return '방금 전'
                                if (c < 60) return `${c}분 전`
                                let d = Math.floor(c / 60)
                                if (d < 24) return `${d}시간 전`
                                let e = Math.floor(d / 24)
                                return e < 7
                                  ? `${e}일 전`
                                  : (0, k.format)(b, 'yyyy-MM-dd', { locale: l.ko })
                              })(a.createdAt),
                            }),
                            a.readAt &&
                              (0, b.jsxs)(b.Fragment, {
                                children: [
                                  (0, b.jsx)('span', { children: '•' }),
                                  (0, b.jsx)('span', { children: '읽음' }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'ml-2 flex items-center space-x-2',
                      children: [
                        ((a) => {
                          if ('LOW' === a) return null
                          let c = {
                            NORMAL: { variant: 'secondary', label: '일반' },
                            HIGH: { variant: 'outline', label: '중요' },
                            URGENT: { variant: 'destructive', label: '긴급' },
                          }[a]
                          return c
                            ? (0, b.jsx)(i.Badge, {
                                variant: c.variant,
                                className: 'text-xs',
                                children: c.label,
                              })
                            : null
                        })(a.priority),
                        (0, b.jsxs)(n.DropdownMenu, {
                          open: q,
                          onOpenChange: r,
                          children: [
                            (0, b.jsx)(n.DropdownMenuTrigger, {
                              asChild: !0,
                              children: (0, b.jsx)(e.Button, {
                                variant: 'ghost',
                                size: 'sm',
                                className: 'h-6 w-6 p-0 hover:bg-gray-100',
                                onClick: (a) => {
                                  ;(a.stopPropagation(), r(!q))
                                },
                                children: (0, b.jsx)(u.MoreVerticalIcon, { className: 'h-4 w-4' }),
                              }),
                            }),
                            (0, b.jsxs)(n.DropdownMenuContent, {
                              align: 'end',
                              className: 'w-48',
                              children: [
                                F
                                  ? (0, b.jsxs)(n.DropdownMenuItem, {
                                      onClick: (b) => {
                                        ;(b.stopPropagation(), c(a.id), r(!1))
                                      },
                                      children: [
                                        (0, b.jsx)(v.CheckIcon, { className: 'mr-2 h-4 w-4' }),
                                        '읽음 표시',
                                      ],
                                    })
                                  : (0, b.jsxs)(n.DropdownMenuItem, {
                                      onClick: (b) => {
                                        ;(b.stopPropagation(), f(a.id), r(!1))
                                      },
                                      children: [
                                        (0, b.jsx)(s.AlertCircleIcon, {
                                          className: 'mr-2 h-4 w-4',
                                        }),
                                        '읽지 않음 표시',
                                      ],
                                    }),
                                !G &&
                                  (0, b.jsxs)(n.DropdownMenuItem, {
                                    onClick: (b) => {
                                      ;(b.stopPropagation(), g(a.id), r(!1))
                                    },
                                    children: [
                                      (0, b.jsx)(w, { className: 'mr-2 h-4 w-4' }),
                                      '보관',
                                    ],
                                  }),
                                a.relatedId &&
                                  j &&
                                  (0, b.jsxs)(n.DropdownMenuItem, {
                                    onClick: (b) => {
                                      ;(b.stopPropagation(), j(a), r(!1))
                                    },
                                    children: [
                                      (0, b.jsx)(y.default, { className: 'mr-2 h-4 w-4' }),
                                      '관련 페이지로 이동',
                                    ],
                                  }),
                                (0, b.jsxs)(n.DropdownMenuItem, {
                                  onClick: (b) => {
                                    ;(b.stopPropagation(), h(a.id), r(!1))
                                  },
                                  className: 'text-red-600 focus:text-red-600',
                                  children: [
                                    (0, b.jsx)(x.TrashIcon, { className: 'mr-2 h-4 w-4' }),
                                    '삭제',
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
              }),
            ],
          }),
        }),
      })
    }
    var E = a.i(981954),
      F = a.i(160381),
      F = F,
      G = a.i(312207),
      H = a.i(890561),
      H = H
    function I({ onNavigate: a, className: c }) {
      let [k, l] = (0, d.useState)([]),
        [m, n] = (0, d.useState)(!0),
        [o, p] = (0, d.useState)(!1),
        [q, r] = (0, d.useState)({ page: 1, limit: 20 }),
        [s, t] = (0, d.useState)(''),
        [u, y] = (0, d.useState)('all'),
        [A, B] = (0, d.useState)([]),
        C = (0, d.useCallback)(
          async (a = !1) => {
            a ? p(!0) : n(!0)
            try {
              let a = new URLSearchParams()
              ;(q.status && a.append('status', q.status),
                q.type && a.append('type', q.type),
                q.priority && a.append('priority', q.priority),
                s && a.append('search', s),
                a.append('page', q.page.toString()),
                a.append('limit', q.limit.toString()))
              let b = await fetch(`/api/notifications?${a}`)
              if (!b.ok) throw Error('알림을 불러올 수 없습니다')
              let c = await b.json()
              l(c.notifications)
            } catch (a) {
              console.error('Error fetching notifications:', a)
            } finally {
              ;(n(!1), p(!1))
            }
          },
          [q, s]
        )
      ;(0, d.useEffect)(() => {
        C()
      }, [q, s, C])
      let I = async (a) => {
          try {
            ;(
              await fetch(`/api/notifications/${a}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'READ', readAt: new Date() }),
              })
            ).ok &&
              l((b) =>
                b.map((b) =>
                  b.id === a ? { ...b, status: 'READ', readAt: new Date().toISOString() } : b
                )
              )
          } catch (a) {
            console.error('Error marking notification as read:', a)
          }
        },
        J = async (a) => {
          try {
            ;(
              await fetch(`/api/notifications/${a}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'UNREAD', readAt: null }),
              })
            ).ok &&
              l((b) => b.map((b) => (b.id === a ? { ...b, status: 'UNREAD', readAt: void 0 } : b)))
          } catch (a) {
            console.error('Error marking notification as unread:', a)
          }
        },
        K = async (a) => {
          try {
            ;(
              await fetch(`/api/notifications/${a}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ARCHIVED', archivedAt: new Date() }),
              })
            ).ok && l((b) => b.map((b) => (b.id === a ? { ...b, status: 'ARCHIVED' } : b)))
          } catch (a) {
            console.error('Error archiving notification:', a)
          }
        },
        L = async (a) => {
          try {
            ;(await fetch(`/api/notifications/${a}`, { method: 'DELETE' })).ok &&
              l((b) => b.filter((b) => b.id !== a))
          } catch (a) {
            console.error('Error deleting notification:', a)
          }
        },
        M = async (a) => {
          if (0 !== A.length)
            try {
              if (
                (
                  await fetch('/api/notifications/batch', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notificationIds: A, action: a }),
                  })
                ).ok
              ) {
                switch (a) {
                  case 'read':
                    l((a) =>
                      a.map((a) =>
                        A.includes(a.id)
                          ? { ...a, status: 'READ', readAt: new Date().toISOString() }
                          : a
                      )
                    )
                    break
                  case 'archive':
                    l((a) => a.map((a) => (A.includes(a.id) ? { ...a, status: 'ARCHIVED' } : a)))
                    break
                  case 'delete':
                    l((a) => a.filter((a) => !A.includes(a.id)))
                }
                B([])
              }
            } catch (a) {
              console.error('Error performing batch action:', a)
            }
        },
        N = k.filter(
          (a) =>
            ('unread' !== u || 'UNREAD' === a.status) &&
            ('read' !== u || 'READ' === a.status) &&
            ('archived' !== u || 'ARCHIVED' === a.status)
        ),
        O = k.filter((a) => 'UNREAD' === a.status).length
      return (0, b.jsxs)('div', {
        className: (0, z.cn)('space-y-6', c),
        children: [
          (0, b.jsxs)('div', {
            className: 'flex items-center justify-between',
            children: [
              (0, b.jsx)('div', {
                className: 'flex items-center space-x-3',
                children: (0, b.jsxs)('div', {
                  className: 'flex items-center space-x-2',
                  children: [
                    (0, b.jsx)(E.BellIcon, { className: 'h-6 w-6' }),
                    (0, b.jsx)('h2', { className: 'text-2xl font-bold', children: '알림' }),
                    O > 0 &&
                      (0, b.jsx)(i.Badge, {
                        variant: 'destructive',
                        className: 'rounded-full px-2 py-1 text-xs',
                        children: O,
                      }),
                  ],
                }),
              }),
              (0, b.jsxs)('div', {
                className: 'flex items-center space-x-2',
                children: [
                  (0, b.jsxs)(e.Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: () => C(!0),
                    disabled: o,
                    children: [
                      (0, b.jsx)(H.default, {
                        className: (0, z.cn)('mr-2 h-4 w-4', { 'animate-spin': o }),
                      }),
                      '새로고침',
                    ],
                  }),
                  (0, b.jsxs)(e.Button, {
                    variant: 'outline',
                    size: 'sm',
                    children: [(0, b.jsx)(F.default, { className: 'mr-2 h-4 w-4' }), '설정'],
                  }),
                ],
              }),
            ],
          }),
          (0, b.jsxs)('div', {
            className: 'flex flex-col gap-4 sm:flex-row',
            children: [
              (0, b.jsxs)('div', {
                className: 'relative flex-1',
                children: [
                  (0, b.jsx)(G.SearchIcon, {
                    className:
                      'text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform',
                  }),
                  (0, b.jsx)(f.Input, {
                    placeholder: '알림 검색...',
                    value: s,
                    onChange: (a) => t(a.target.value),
                    className: 'pl-10',
                  }),
                ],
              }),
              (0, b.jsxs)(g.Select, {
                value: q.type || '',
                onValueChange: (a) => r((b) => ({ ...b, type: a || void 0 })),
                children: [
                  (0, b.jsx)(g.SelectTrigger, {
                    className: 'w-48',
                    children: (0, b.jsx)(g.SelectValue, { placeholder: '유형 선택' }),
                  }),
                  (0, b.jsxs)(g.SelectContent, {
                    children: [
                      (0, b.jsx)(g.SelectItem, { value: '', children: '모든 유형' }),
                      (0, b.jsx)(g.SelectItem, {
                        value: 'BOOKING_CONFIRMED',
                        children: '예약 확정',
                      }),
                      (0, b.jsx)(g.SelectItem, {
                        value: 'BOOKING_CANCELLED',
                        children: '예약 취소',
                      }),
                      (0, b.jsx)(g.SelectItem, {
                        value: 'GROOMING_STARTED',
                        children: '미용 시작',
                      }),
                      (0, b.jsx)(g.SelectItem, {
                        value: 'GROOMING_COMPLETED',
                        children: '미용 완료',
                      }),
                      (0, b.jsx)(g.SelectItem, {
                        value: 'PAYMENT_RECEIVED',
                        children: '결제 완료',
                      }),
                      (0, b.jsx)(g.SelectItem, { value: 'PROMOTION', children: '프로모션' }),
                    ],
                  }),
                ],
              }),
              (0, b.jsxs)(g.Select, {
                value: q.priority || '',
                onValueChange: (a) => r((b) => ({ ...b, priority: a || void 0 })),
                children: [
                  (0, b.jsx)(g.SelectTrigger, {
                    className: 'w-32',
                    children: (0, b.jsx)(g.SelectValue, { placeholder: '우선순위' }),
                  }),
                  (0, b.jsxs)(g.SelectContent, {
                    children: [
                      (0, b.jsx)(g.SelectItem, { value: '', children: '모든 우선순위' }),
                      (0, b.jsx)(g.SelectItem, { value: 'LOW', children: '낮음' }),
                      (0, b.jsx)(g.SelectItem, { value: 'NORMAL', children: '보통' }),
                      (0, b.jsx)(g.SelectItem, { value: 'HIGH', children: '높음' }),
                      (0, b.jsx)(g.SelectItem, { value: 'URGENT', children: '긴급' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          A.length > 0 &&
            (0, b.jsxs)('div', {
              className:
                'flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 p-3',
              children: [
                (0, b.jsxs)('span', {
                  className: 'text-sm text-blue-700',
                  children: [A.length, '개 선택됨'],
                }),
                (0, b.jsxs)('div', {
                  className: 'ml-auto flex space-x-2',
                  children: [
                    (0, b.jsxs)(e.Button, {
                      size: 'sm',
                      variant: 'outline',
                      onClick: () => M('read'),
                      children: [
                        (0, b.jsx)(v.CheckIcon, { className: 'mr-1 h-4 w-4' }),
                        '읽음 처리',
                      ],
                    }),
                    (0, b.jsxs)(e.Button, {
                      size: 'sm',
                      variant: 'outline',
                      onClick: () => M('archive'),
                      children: [(0, b.jsx)(w, { className: 'mr-1 h-4 w-4' }), '보관'],
                    }),
                    (0, b.jsxs)(e.Button, {
                      size: 'sm',
                      variant: 'outline',
                      onClick: () => M('delete'),
                      children: [(0, b.jsx)(x.TrashIcon, { className: 'mr-1 h-4 w-4' }), '삭제'],
                    }),
                  ],
                }),
              ],
            }),
          (0, b.jsxs)(h.Tabs, {
            value: u,
            onValueChange: y,
            children: [
              (0, b.jsxs)(h.TabsList, {
                className: 'grid w-full grid-cols-4',
                children: [
                  (0, b.jsxs)(h.TabsTrigger, { value: 'all', children: ['전체 (', k.length, ')'] }),
                  (0, b.jsxs)(h.TabsTrigger, {
                    value: 'unread',
                    children: ['읽지 않음 (', k.filter((a) => 'UNREAD' === a.status).length, ')'],
                  }),
                  (0, b.jsxs)(h.TabsTrigger, {
                    value: 'read',
                    children: ['읽음 (', k.filter((a) => 'READ' === a.status).length, ')'],
                  }),
                  (0, b.jsxs)(h.TabsTrigger, {
                    value: 'archived',
                    children: ['보관함 (', k.filter((a) => 'ARCHIVED' === a.status).length, ')'],
                  }),
                ],
              }),
              (0, b.jsx)(h.TabsContent, {
                value: u,
                className: 'mt-6 space-y-4',
                children: m
                  ? (0, b.jsxs)('div', {
                      className: 'py-12 text-center',
                      children: [
                        (0, b.jsx)(j.LoadingSpinner, { size: 'lg' }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground mt-4',
                          children: '알림을 불러오는 중...',
                        }),
                      ],
                    })
                  : 0 === N.length
                    ? (0, b.jsxs)('div', {
                        className: 'py-12 text-center',
                        children: [
                          (0, b.jsx)(E.BellIcon, {
                            className: 'text-muted-foreground mx-auto mb-4 h-12 w-12',
                          }),
                          (0, b.jsx)('h3', {
                            className: 'mb-2 text-lg font-semibold text-gray-900',
                            children: '알림이 없습니다',
                          }),
                          (0, b.jsxs)('p', {
                            className: 'text-muted-foreground',
                            children: [
                              'all' === u && '새로운 알림이 없습니다.',
                              'unread' === u && '읽지 않은 알림이 없습니다.',
                              'read' === u && '읽은 알림이 없습니다.',
                              'archived' === u && '보관된 알림이 없습니다.',
                            ],
                          }),
                        ],
                      })
                    : (0, b.jsx)('div', {
                        className: 'space-y-3',
                        children: N.map((c) =>
                          (0, b.jsx)(
                            D,
                            {
                              notification: c,
                              onMarkAsRead: I,
                              onMarkAsUnread: J,
                              onArchive: K,
                              onDelete: L,
                              onNavigate: a,
                            },
                            c.id
                          )
                        ),
                      }),
              }),
            ],
          }),
        ],
      })
    }
    function J() {
      let a = (0, c.useRouter)()
      return (0, b.jsx)('div', {
        className: 'container mx-auto px-4 py-8',
        children: (0, b.jsx)('div', {
          className: 'mx-auto max-w-4xl',
          children: (0, b.jsx)(I, {
            onNavigate: (b) => {
              if (b.relatedId)
                switch (b.type) {
                  case 'BOOKING_CONFIRMED':
                  case 'BOOKING_CANCELLED':
                  case 'BOOKING_REMINDER':
                  case 'GROOMING_STARTED':
                  case 'GROOMING_COMPLETED':
                    a.push(`/customer/booking/${b.relatedId}`)
                    break
                  case 'PAYMENT_RECEIVED':
                  case 'PAYMENT_FAILED':
                  case 'REFUND_PROCESSED':
                    b.metadata?.bookingId && a.push(`/customer/booking/${b.metadata.bookingId}`)
                    break
                  case 'REVIEW_REQUEST':
                    a.push(`/customer/booking/${b.relatedId}/review`)
                    break
                  case 'PROMOTION':
                    b.metadata?.promotionUrl
                      ? a.push(String(b.metadata.promotionUrl))
                      : a.push('/customer/services')
                    break
                  case 'SYSTEM_NOTICE':
                    a.push(`/notices/${b.relatedId}`)
                    break
                  default:
                    a.push('/customer')
                }
            },
          }),
        }),
      })
    }
    a.s(['default', () => J], 733312)
  },
]

//# sourceMappingURL=src_app_customer_notifications_page_tsx_0d0aaae3._.js.map
