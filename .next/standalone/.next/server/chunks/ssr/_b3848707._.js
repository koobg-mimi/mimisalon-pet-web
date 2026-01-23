module.exports = [
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
  781560,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('trash-2', [
      ['path', { d: 'M10 11v6', key: 'nco0om' }],
      ['path', { d: 'M14 11v6', key: 'outv1u' }],
      ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', key: 'miytrc' }],
      ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
      ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', key: 'e791ji' }],
    ])
    a.s(['Trash2', () => b], 781560)
  },
  517756,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('chevron-left', [
      ['path', { d: 'm15 18-6-6 6-6', key: '1wnfg3' }],
    ])
    a.s(['default', () => b])
  },
  281643,
  (a) => {
    'use strict'
    var b = a.i(517756)
    a.s(['ChevronLeftIcon', () => b.default])
  },
  114548,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('save', [
      [
        'path',
        {
          d: 'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
          key: '1c8476',
        },
      ],
      ['path', { d: 'M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7', key: '1ydtos' }],
      ['path', { d: 'M7 3v4a1 1 0 0 0 1 1h7', key: 't51u73' }],
    ])
    a.s(['Save', () => b], 114548)
  },
  158109,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(302491),
      d = a.i(529139),
      e = a.i(50944),
      f = a.i(572131),
      g = a.i(433217),
      h = a.i(370025),
      i = a.i(937927),
      j = a.i(699570),
      k = a.i(205138),
      l = a.i(941675),
      m = a.i(641710),
      n = a.i(781560),
      o = a.i(256711),
      p = a.i(277421),
      q = a.i(35596),
      r = a.i(367638),
      s = a.i(320146),
      t = a.i(591119),
      u = a.i(866718),
      v = a.i(870430)
    function w({
      workingDates: a,
      onChange: d,
      maxDaysInAdvance: e = 90,
      defaultStartTime: g = '09:00',
      defaultEndTime: h = '18:00',
    }) {
      let [i, k] = f.useState(null),
        w = (0, r.startOfDay)(new Date()),
        x = (0, p.addDays)(w, e),
        y = (() => {
          if (!i) return { startTime: g, endTime: h }
          let b = (0, o.format)(i, 'yyyy-MM-dd', { locale: c.ko }),
            d = a.find((a) => (0, o.format)(a.date, 'yyyy-MM-dd', { locale: c.ko }) === b)
          return { startTime: d?.startTime || g, endTime: d?.endTime || h }
        })(),
        z = (b, e) => {
          if (!i) return
          let f = (0, o.format)(i, 'yyyy-MM-dd', { locale: c.ko })
          d(
            a.map((a) =>
              (0, o.format)(a.date, 'yyyy-MM-dd', { locale: c.ko }) === f ? { ...a, [b]: e } : a
            )
          )
        },
        A = (b) => {
          let e = (0, o.format)(b, 'yyyy-MM-dd', { locale: c.ko }),
            f = a.filter((a) => (0, o.format)(a.date, 'yyyy-MM-dd', { locale: c.ko }) !== e)
          if ((d(f), i && (0, o.format)(i, 'yyyy-MM-dd', { locale: c.ko }) === e))
            if (f.length > 0) {
              let b = a.findIndex(
                (a) => (0, o.format)(a.date, 'yyyy-MM-dd', { locale: c.ko }) === e
              )
              b < f.length ? k(f[b].date) : k(f[f.length - 1].date)
            } else k(null)
        }
      return (0, b.jsxs)('div', {
        className: 'space-y-6',
        children: [
          (0, b.jsxs)(t.Card, {
            children: [
              (0, b.jsx)(t.CardHeader, {
                children: (0, b.jsxs)(t.CardTitle, {
                  className: 'flex items-center gap-2',
                  children: [(0, b.jsx)(l.Calendar, { className: 'h-5 w-5' }), '근무 날짜 선택'],
                }),
              }),
              (0, b.jsxs)(t.CardContent, {
                children: [
                  (0, b.jsx)('div', {
                    className: 'rounded-md border',
                    children: (0, b.jsx)(s.Calendar, {
                      mode: 'single',
                      selected: void 0,
                      onSelect: (b) => {
                        if (!b) return
                        let e = (0, o.format)(b, 'yyyy-MM-dd', { locale: c.ko })
                        a.find((a) => (0, o.format)(a.date, 'yyyy-MM-dd', { locale: c.ko }) === e)
                          ? A(b)
                          : (d(
                              [...a, { date: b, startTime: g, endTime: h }].sort(
                                (a, b) => a.date.getTime() - b.date.getTime()
                              )
                            ),
                            k(b))
                      },
                      disabled: (a) => {
                        let b = (0, r.startOfDay)(new Date())
                        return (0, q.isBefore)(a, b) || a > x
                      },
                      locale: c.ko,
                      weekStartsOn: 0,
                      showOutsideDays: !1,
                      className: 'rounded-md',
                      modifiers: {
                        selected: (b) => {
                          let d = (0, o.format)(b, 'yyyy-MM-dd', { locale: c.ko })
                          return a.some(
                            (a) => (0, o.format)(a.date, 'yyyy-MM-dd', { locale: c.ko }) === d
                          )
                        },
                      },
                      modifiersClassNames: {
                        selected: 'bg-primary text-primary-foreground font-semibold',
                      },
                    }),
                  }),
                  (0, b.jsx)('div', {
                    className: 'mt-4 rounded-lg bg-blue-50 p-3',
                    children: (0, b.jsxs)('p', {
                      className: 'text-sm text-blue-900',
                      children: [
                        '• 캘린더에서 날짜를 클릭하여 추가/제거하세요',
                        (0, b.jsx)('br', {}),
                        '• 선택된 날짜를 클릭하면 하단에 시간 설정이 표시됩니다',
                        (0, b.jsx)('br', {}),
                        '• 최대 ',
                        e,
                        '일 후까지 설정 가능합니다',
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
          i &&
            (0, b.jsxs)(t.Card, {
              children: [
                (0, b.jsx)(t.CardHeader, {
                  children: (0, b.jsxs)('div', {
                    className: 'flex items-center justify-between',
                    children: [
                      (0, b.jsxs)(t.CardTitle, {
                        className: 'flex items-center gap-2',
                        children: [
                          (0, b.jsx)(m.Clock, { className: 'h-5 w-5' }),
                          (0, o.format)(i, 'M월 d일 (EEEE)', { locale: c.ko }),
                          ' 근무 시간',
                        ],
                      }),
                      (0, b.jsx)(j.Button, {
                        variant: 'ghost',
                        size: 'sm',
                        onClick: () => A(i),
                        className:
                          'text-destructive hover:bg-destructive/10 hover:text-destructive',
                        children: (0, b.jsx)(n.Trash2, { className: 'h-4 w-4' }),
                      }),
                    ],
                  }),
                }),
                (0, b.jsx)(t.CardContent, {
                  children: (0, b.jsxs)('div', {
                    className: 'grid grid-cols-2 gap-4',
                    children: [
                      (0, b.jsxs)('div', {
                        children: [
                          (0, b.jsx)(v.Label, {
                            htmlFor: 'start-time',
                            className: 'text-sm font-medium',
                            children: '시작 시간',
                          }),
                          (0, b.jsx)(u.Input, {
                            id: 'start-time',
                            type: 'time',
                            value: y.startTime,
                            onChange: (a) => z('startTime', a.target.value),
                            className: 'mt-1',
                          }),
                        ],
                      }),
                      (0, b.jsxs)('div', {
                        children: [
                          (0, b.jsx)(v.Label, {
                            htmlFor: 'end-time',
                            className: 'text-sm font-medium',
                            children: '종료 시간',
                          }),
                          (0, b.jsx)(u.Input, {
                            id: 'end-time',
                            type: 'time',
                            value: y.endTime,
                            onChange: (a) => z('endTime', a.target.value),
                            className: 'mt-1',
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          0 === a.length &&
            (0, b.jsx)(t.Card, {
              children: (0, b.jsxs)(t.CardContent, {
                className: 'flex flex-col items-center justify-center py-12',
                children: [
                  (0, b.jsx)(l.Calendar, { className: 'text-muted-foreground/50 mb-4 h-12 w-12' }),
                  (0, b.jsxs)('p', {
                    className: 'text-muted-foreground text-center',
                    children: [
                      '근무할 날짜를 선택하세요',
                      (0, b.jsx)('br', {}),
                      (0, b.jsx)('span', {
                        className: 'text-sm',
                        children: '캘린더에서 날짜를 클릭하면 추가됩니다',
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      })
    }
    var x = a.i(114548),
      y = a.i(238246)
    function z() {
      let { data: a, isPending: l } = (0, d.useSession)(),
        m = (0, e.useRouter)(),
        n = (0, i.useQueryClient)(),
        [q, r] = (0, f.useState)([])
      ;(0, f.useEffect)(() => {
        ;(a || m.push('/auth/signin'),
          a?.user?.role && 'GROOMER' !== a.user.role && m.push('/dashboard'))
      }, [a, m])
      let { data: s, isLoading: t } = (0, g.useQuery)({
        queryKey: ['groomer', 'working-dates'],
        queryFn: async () => {
          let a = new Date(),
            b = (0, p.addDays)(a, 30),
            d = await fetch(
              `/api/groomer/working-dates?startDate=${(0, o.format)(a, 'yyyy-MM-dd', { locale: c.ko })}&endDate=${(0, o.format)(b, 'yyyy-MM-dd', { locale: c.ko })}`
            )
          if (!d.ok) throw Error('Failed to fetch working dates')
          return d.json()
        },
        enabled: !!a?.user && 'GROOMER' === a.user.role,
      })
      ;(0, f.useEffect)(() => {
        s &&
          r(s.map((a) => ({ date: new Date(a.date), startTime: a.startTime, endTime: a.endTime })))
      }, [s])
      let u = (0, h.useMutation)({
        mutationFn: async (a) => {
          let b = {
              workingDates: a.map((a) => ({
                date: (0, o.format)(a.date, 'yyyy-MM-dd', { locale: c.ko }),
                startTime: a.startTime,
                endTime: a.endTime,
                slotDuration: 30,
              })),
            },
            d = await fetch('/api/groomer/working-dates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(b),
            })
          if (!d.ok) throw Error((await d.json()).error || 'Failed to save working dates')
          return d.json()
        },
        onSuccess: (a) => {
          ;(n.invalidateQueries({ queryKey: ['groomer', 'working-dates'] }),
            alert(a.message || '근무 날짜가 저장되었습니다.'))
        },
        onError: (a) => {
          alert(a.message || '저장 중 오류가 발생했습니다.')
        },
      })
      return l || t
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(k.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'GROOMER'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsx)('div', {
                    className: 'container mx-auto px-4 py-4',
                    children: (0, b.jsxs)('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsx)('h1', {
                              className: 'text-foreground text-2xl font-bold',
                              children: '근무 일정 설정',
                            }),
                            (0, b.jsx)('p', {
                              className: 'text-muted-foreground text-sm',
                              children: '특정 날짜를 선택하여 근무 시간을 설정하세요',
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'flex items-center space-x-4',
                          children: [
                            (0, b.jsx)(j.Button, {
                              variant: 'outline',
                              asChild: !0,
                              children: (0, b.jsx)(y.default, {
                                href: '/groomer/dashboard/bookings',
                                children: '예약 관리',
                              }),
                            }),
                            (0, b.jsx)(j.Button, {
                              variant: 'outline',
                              asChild: !0,
                              children: (0, b.jsx)(y.default, {
                                href: '/groomer/dashboard/overview',
                                children: '대시보드',
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                }),
                (0, b.jsxs)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: [
                    (0, b.jsx)(w, {
                      workingDates: q,
                      onChange: r,
                      maxDaysInAdvance: 90,
                      defaultStartTime: '09:00',
                      defaultEndTime: '18:00',
                    }),
                    (0, b.jsx)('div', {
                      className: 'mt-8 flex justify-end',
                      children: (0, b.jsxs)(j.Button, {
                        onClick: () => {
                          u.mutate(q)
                        },
                        disabled: u.isPending,
                        className: 'flex items-center gap-2',
                        size: 'lg',
                        children: [
                          u.isPending
                            ? (0, b.jsx)(k.LoadingSpinner, { size: 'sm' })
                            : (0, b.jsx)(x.Save, { className: 'h-4 w-4' }),
                          u.isPending ? '저장 중...' : '변경사항 저장',
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            })
          : null
    }
    a.s(['default', () => z], 158109)
  },
]

//# sourceMappingURL=_b3848707._.js.map
