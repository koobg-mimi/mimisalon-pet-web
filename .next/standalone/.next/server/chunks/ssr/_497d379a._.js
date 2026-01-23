module.exports = [
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
  737984,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(368114)
    function d({ title: a, description: d, children: e, className: f }) {
      return (0, b.jsxs)('div', {
        className: (0, c.cn)(
          'container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
          f
        ),
        children: [
          (0, b.jsxs)('div', {
            className: 'min-w-0 flex-1',
            children: [
              (0, b.jsx)('h1', { className: 'text-foreground text-2xl font-bold', children: a }),
              d &&
                (0, b.jsx)('p', { className: 'text-muted-foreground mt-1 text-sm', children: d }),
            ],
          }),
          e &&
            (0, b.jsx)('div', {
              className:
                'flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0 sm:space-x-4',
              children: e,
            }),
        ],
      })
    }
    a.s(['PageHeader', () => d])
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
  983290,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('trash', [
      ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', key: 'miytrc' }],
      ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
      ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', key: 'e791ji' }],
    ])
    a.s(['TrashIcon', () => b], 983290)
  },
  516868,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('plus', [
      ['path', { d: 'M5 12h14', key: '1ays0h' }],
      ['path', { d: 'M12 5v14', key: 's699le' }],
    ])
    a.s(['default', () => b])
  },
  808235,
  (a) => {
    'use strict'
    var b = a.i(516868)
    a.s(['PlusIcon', () => b.default])
  },
  806053,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('square-pen', [
      ['path', { d: 'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', key: '1m0v6g' }],
      [
        'path',
        {
          d: 'M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z',
          key: 'ohrbg2',
        },
      ],
    ])
    a.s(['default', () => b])
  },
  160381,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('settings', [
      [
        'path',
        {
          d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915',
          key: '1i5ecw',
        },
      ],
      ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
    ])
    a.s(['default', () => b])
  },
  321161,
  (a) => {
    'use strict'
    var b = a.i(160381)
    a.s(['Settings', () => b.default])
  },
  524667,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('circle-x', [
      ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
      ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
      ['path', { d: 'm9 9 6 6', key: 'z0biqf' }],
    ])
    a.s(['default', () => b])
  },
  862722,
  (a) => {
    'use strict'
    var b = a.i(524667)
    a.s(['XCircle', () => b.default])
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
  816201,
  (a) => {
    'use strict'
    var b = a.i(626405)
    a.s(['CheckCircle', () => b.default])
  },
  724669,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('trending-up', [
      ['path', { d: 'M16 7h6v6', key: 'box55l' }],
      ['path', { d: 'm22 7-8.5 8.5-5-5L2 17', key: '1t1m79' }],
    ])
    a.s(['TrendingUp', () => b], 724669)
  },
  318826,
  318868,
  (a) => {
    'use strict'
    var b = a.i(187924)
    function c({ title: a, value: c, icon: d, iconBgColor: e, subtitle: f }) {
      return (0, b.jsx)('div', {
        className: 'border-border bg-card rounded-lg border p-6',
        children: (0, b.jsxs)('div', {
          className: 'flex items-center justify-between gap-4',
          children: [
            (0, b.jsxs)('div', {
              className: 'min-w-0 flex-1',
              children: [
                (0, b.jsx)('p', {
                  className: 'text-muted-foreground truncate text-sm',
                  children: a,
                }),
                (0, b.jsx)('p', {
                  className: 'text-foreground text-2xl font-bold whitespace-nowrap',
                  children: 'number' == typeof c ? c.toLocaleString('ko-KR') : c,
                }),
                f &&
                  (0, b.jsx)('p', {
                    className: 'text-muted-foreground mt-1 truncate text-xs',
                    children: f,
                  }),
              ],
            }),
            (0, b.jsx)('div', {
              className: `flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${e}`,
              children: d,
            }),
          ],
        }),
      })
    }
    function d({ children: a, compact: c = !1 }) {
      return (0, b.jsx)('div', {
        className: c
          ? 'mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'
          : 'mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        children: a,
      })
    }
    ;(a.s(['StatsCard', () => c], 318826), a.s(['StatsGrid', () => d], 318868))
  },
  46864,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('user-check', [
      ['path', { d: 'm16 11 2 2 4-4', key: '9rsbq5' }],
      ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
      ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
    ])
    a.s(['UserCheck', () => b], 46864)
  },
  468075,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(660246),
      e = a.i(941675),
      f = a.i(790166),
      g = a.i(821374),
      h = a.i(46864),
      i = a.i(28379),
      j = a.i(641710),
      k = a.i(816201),
      l = a.i(862722),
      m = a.i(724669),
      n = a.i(318826),
      o = a.i(318868)
    function p({ variant: a = 'overview' }) {
      let [p, q] = (0, c.useState)(null),
        [r, s] = (0, c.useState)(!0)
      if (
        ((0, c.useEffect)(() => {
          ;(async () => {
            try {
              let a = await fetch('/api/admin/stats')
              if (a.ok) {
                let b = await a.json()
                q(b)
              }
            } catch (a) {
              console.error('Failed to fetch admin stats:', a)
            } finally {
              s(!1)
            }
          })()
        }, []),
        r)
      )
        return (0, b.jsx)(o.StatsGrid, {
          children: [void 0, void 0, void 0, void 0].map((a, c) =>
            (0, b.jsx)(
              'div',
              {
                className: 'border-border bg-card animate-pulse rounded-lg border p-6',
                children: (0, b.jsxs)('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)('div', { className: 'bg-muted h-4 w-20 rounded' }),
                        (0, b.jsx)('div', { className: 'bg-muted h-8 w-16 rounded' }),
                      ],
                    }),
                    (0, b.jsx)('div', { className: 'bg-muted h-12 w-12 rounded-full' }),
                  ],
                }),
              },
              c
            )
          ),
        })
      if (!p) return null
      let t = (() => {
        switch (a) {
          case 'users':
            return [
              {
                title: '총 사용자',
                value: p.totalUsers,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '고객',
                value: p.totalCustomers,
                icon: (0, b.jsx)(h.UserCheck, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
              {
                title: '관리자',
                value: p.totalAdmins,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-red-600' }),
                color: 'bg-red-100',
              },
            ]
          case 'bookings':
            return [
              {
                title: '총 예약',
                value: p.totalBookings,
                icon: (0, b.jsx)(e.Calendar, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '대기중',
                value: p.pendingBookings,
                icon: (0, b.jsx)(j.Clock, { className: 'h-6 w-6 text-yellow-600' }),
                color: 'bg-yellow-100',
              },
              {
                title: '완료',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '취소',
                value: p.cancelledBookings,
                icon: (0, b.jsx)(l.XCircle, { className: 'h-6 w-6 text-red-600' }),
                color: 'bg-red-100',
              },
            ]
          case 'groomers':
            return [
              {
                title: '등록 미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
              {
                title: '완료 예약',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '평균 별점',
                value: p.averageRating.toFixed(1),
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-yellow-600' }),
                color: 'bg-yellow-100',
              },
              {
                title: '총 리뷰',
                value: p.totalReviews,
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-orange-600' }),
                color: 'bg-orange-100',
              },
            ]
          case 'reviews':
            return [
              {
                title: '총 리뷰',
                value: p.totalReviews,
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-yellow-600' }),
                color: 'bg-yellow-100',
              },
              {
                title: '평균 별점',
                value: p.averageRating.toFixed(1),
                icon: (0, b.jsx)(g.Star, { className: 'h-6 w-6 text-orange-600' }),
                color: 'bg-orange-100',
              },
              {
                title: '완료 예약',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '총 고객',
                value: p.totalCustomers,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
            ]
          case 'settlements':
            return [
              {
                title: '월 매출',
                value: `${p.monthlyRevenue.toLocaleString('ko-KR')}원`,
                icon: (0, b.jsx)(f.DollarSign, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '총 매출',
                value: `${p.totalRevenue.toLocaleString('ko-KR')}원`,
                icon: (0, b.jsx)(m.TrendingUp, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '등록 미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
              {
                title: '완료 예약',
                value: p.completedBookings,
                icon: (0, b.jsx)(k.CheckCircle, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
            ]
          default:
            return [
              {
                title: '총 사용자',
                value: p.totalUsers,
                icon: (0, b.jsx)(d.Users, { className: 'h-6 w-6 text-blue-600' }),
                color: 'bg-blue-100',
              },
              {
                title: '총 예약',
                value: p.totalBookings,
                icon: (0, b.jsx)(e.Calendar, { className: 'h-6 w-6 text-green-600' }),
                color: 'bg-green-100',
              },
              {
                title: '월 매출',
                value: `${p.monthlyRevenue.toLocaleString('ko-KR')}원`,
                icon: (0, b.jsx)(f.DollarSign, { className: 'text-primary h-6 w-6' }),
                color: 'bg-primary/10',
              },
              {
                title: '등록 미용사',
                value: p.totalGroomers,
                icon: (0, b.jsx)(i.UserCog, { className: 'h-6 w-6 text-purple-600' }),
                color: 'bg-purple-100',
              },
            ]
        }
      })()
      return (0, b.jsx)(o.StatsGrid, {
        children: t.map((a, c) =>
          (0, b.jsx)(
            n.StatsCard,
            { title: a.title, value: a.value, icon: a.icon, iconBgColor: a.color },
            c
          )
        ),
      })
    }
    a.s(['AdminStatsCards', () => p])
  },
  296496,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('toggle-left', [
      ['circle', { cx: '9', cy: '12', r: '3', key: 'u3jwor' }],
      ['rect', { width: '20', height: '14', x: '2', y: '5', rx: '7', key: 'g7kal2' }],
    ])
    a.s(['default', () => b])
  },
  348114,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('toggle-right', [
      ['circle', { cx: '15', cy: '12', r: '3', key: '1afu0r' }],
      ['rect', { width: '20', height: '14', x: '2', y: '5', rx: '7', key: 'g7kal2' }],
    ])
    a.s(['default', () => b])
  },
  890091,
  874085,
  374532,
  (a) => {
    'use strict'
    var b = a.i(806053)
    a.s(['EditIcon', () => b.default], 890091)
    var c = a.i(296496)
    a.s(['ToggleLeftIcon', () => c.default], 874085)
    var d = a.i(348114)
    a.s(['ToggleRightIcon', () => d.default], 374532)
  },
  604095,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(529139),
      e = a.i(50944),
      f = a.i(433217),
      g = a.i(370025),
      h = a.i(937927),
      i = a.i(321161),
      j = a.i(737984),
      k = a.i(591119),
      l = a.i(699570),
      m = a.i(205138),
      n = a.i(468075),
      o = a.i(786304),
      p = a.i(505084),
      q = a.i(558020),
      r = a.i(835277),
      r = r,
      s = a.i(890091),
      t = a.i(874085),
      u = a.i(374532),
      v = a.i(983290)
    let w = (0, c.memo)(({ service: a, onEdit: c, onToggleStatus: d, onDelete: e }) => {
      let f = (function (a) {
        if (!a.priceRanges || 0 === a.priceRanges.length)
          return { display: '가격 미설정', hasRange: !1 }
        let b = a.priceRanges.map((a) => a.price),
          c = Math.min(...b),
          d = Math.max(...b)
        return c === d
          ? { display: `${c.toLocaleString('ko-KR')}원`, hasRange: !1 }
          : {
              display: `${c.toLocaleString('ko-KR')}원 ~ ${d.toLocaleString('ko-KR')}원`,
              hasRange: !0,
              count: a.priceRanges.length,
            }
      })(a)
      return (0, b.jsxs)(
        k.Card,
        {
          className: a.isActive ? '' : 'opacity-60',
          children: [
            (0, b.jsx)(k.CardHeader, {
              children: (0, b.jsx)('div', {
                className: 'flex items-start justify-between',
                children: (0, b.jsxs)('div', {
                  className: 'flex-1',
                  children: [
                    !a.isActive &&
                      (0, b.jsx)('div', {
                        className: 'mb-2 flex items-center space-x-2',
                        children: (0, b.jsx)(o.Badge, {
                          variant: 'outline',
                          className: 'text-xs',
                          children: '비활성',
                        }),
                      }),
                    (0, b.jsx)(k.CardTitle, { className: 'text-lg', children: a.name }),
                    (0, b.jsx)(k.CardDescription, {
                      className: 'line-clamp-2',
                      children: a.description,
                    }),
                  ],
                }),
              }),
            }),
            (0, b.jsxs)(k.CardContent, {
              className: 'space-y-4',
              children: [
                (0, b.jsxs)('div', {
                  className: 'grid grid-cols-2 gap-4 text-sm',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'flex items-center space-x-2',
                      children: [
                        (0, b.jsx)(q.ClockIcon, { className: 'text-muted-foreground h-4 w-4' }),
                        (0, b.jsxs)('span', { children: [a.duration, '분'] }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'flex flex-col space-y-1',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'flex items-center space-x-2',
                          children: [
                            (0, b.jsx)(r.default, { className: 'text-muted-foreground h-4 w-4' }),
                            (0, b.jsx)('span', { children: f.display }),
                          ],
                        }),
                        f.hasRange &&
                          f.count &&
                          (0, b.jsxs)(o.Badge, {
                            variant: 'secondary',
                            className: 'w-fit text-xs',
                            children: [f.count, '개 옵션'],
                          }),
                      ],
                    }),
                  ],
                }),
                a.bookingCount > 0 &&
                  (0, b.jsxs)('div', {
                    className: 'text-muted-foreground flex justify-between text-xs',
                    children: [
                      (0, b.jsxs)('span', { children: ['예약 ', a.bookingCount, '회'] }),
                      a.averageRating > 0 &&
                        (0, b.jsxs)('span', { children: ['평점 ', a.averageRating.toFixed(1)] }),
                    ],
                  }),
                (0, b.jsx)(p.Separator, {}),
                (0, b.jsxs)('div', {
                  className: 'flex justify-between',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'flex space-x-2',
                      children: [
                        (0, b.jsx)(l.Button, {
                          variant: 'outline',
                          size: 'sm',
                          onClick: () => c(a),
                          children: (0, b.jsx)(s.EditIcon, { className: 'h-4 w-4' }),
                        }),
                        (0, b.jsx)(l.Button, {
                          variant: 'outline',
                          size: 'sm',
                          onClick: () => d(a.id, a.isActive),
                          children: a.isActive
                            ? (0, b.jsx)(t.ToggleLeftIcon, { className: 'h-4 w-4' })
                            : (0, b.jsx)(u.ToggleRightIcon, { className: 'h-4 w-4' }),
                        }),
                      ],
                    }),
                    (0, b.jsx)(l.Button, {
                      variant: 'outline',
                      size: 'sm',
                      onClick: () => e(a.id),
                      className: 'text-destructive hover:text-destructive',
                      children: (0, b.jsx)(v.TrashIcon, { className: 'h-4 w-4' }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
        a.id
      )
    })
    var x = a.i(580701),
      y = a.i(808235),
      z = a.i(312207),
      A = a.i(485155),
      B = a.i(866718)
    function C() {
      let { data: a, isPending: o } = (0, d.useSession)(),
        p = (0, e.useRouter)(),
        q = (0, h.useQueryClient)(),
        [r, s] = (0, c.useState)(''),
        [t, u] = (0, c.useState)('ALL')
      ;(0, c.useEffect)(() => {
        ;(a || p.push('/auth/signin'),
          a?.user?.role && 'ADMIN' !== a.user.role && p.push('/admin/dashboard/overview'))
      }, [a, p])
      let { data: v = [], isLoading: C } = (0, f.useQuery)({
          queryKey: ['admin', 'services'],
          queryFn: async () => {
            let a = await fetch('/api/admin/services')
            if (!a.ok) throw Error('서비스 목록을 불러올 수 없습니다')
            return a.json()
          },
          enabled: !!a?.user && 'ADMIN' === a.user.role,
          staleTime: 3e5,
        }),
        D = v.filter((a) => {
          let b =
              a.name.toLowerCase().includes(r.toLowerCase()) ||
              a.description.toLowerCase().includes(r.toLowerCase()),
            c = 'ALL' === t || ('ACTIVE' === t && a.isActive) || ('INACTIVE' === t && !a.isActive)
          return b && c
        }),
        E = (0, g.useMutation)({
          mutationFn: async ({ serviceId: a, isActive: b }) => {
            let c = await fetch(`/api/admin/services/${a}/toggle`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isActive: !b }),
            })
            if (!c.ok) throw Error('상태 변경에 실패했습니다')
            return c.json()
          },
          onSuccess: () => {
            q.invalidateQueries({ queryKey: ['admin', 'services'] })
          },
          onError: (a) => {
            alert(a instanceof Error ? a.message : '오류가 발생했습니다')
          },
        }),
        F = (0, g.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch(`/api/admin/services/${a}`, { method: 'DELETE' })
            if (!b.ok) throw Error('서비스 삭제에 실패했습니다')
            return b.json()
          },
          onSuccess: () => {
            q.invalidateQueries({ queryKey: ['admin', 'services'] })
          },
          onError: (a) => {
            alert(a instanceof Error ? a.message : '오류가 발생했습니다')
          },
        }),
        G = (a) => {
          p.push(`/admin/dashboard/services/${a.id}/edit`)
        },
        H = (a, b) => {
          E.mutate({ serviceId: a, isActive: b })
        },
        I = (a) => {
          confirm('정말로 이 서비스를 삭제하시겠습니까?') && F.mutate(a)
        }
      return o || C
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(m.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'ADMIN'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsx)(j.PageHeader, {
                    title: '서비스 관리',
                    description: '미용 서비스를 생성, 수정, 관리할 수 있습니다',
                    children: (0, b.jsx)('div', {
                      className: 'flex items-center gap-2',
                      children: (0, b.jsx)(i.Settings, { className: 'text-primary h-5 w-5' }),
                    }),
                  }),
                }),
                (0, b.jsx)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: (0, b.jsxs)('div', {
                    className: 'space-y-6',
                    children: [
                      (0, b.jsx)(n.AdminStatsCards, { variant: 'services' }),
                      (0, b.jsx)('div', {
                        className: 'flex justify-end',
                        children: (0, b.jsxs)(l.Button, {
                          onClick: () => p.push('/admin/dashboard/services/new'),
                          children: [
                            (0, b.jsx)(y.PlusIcon, { className: 'mr-2 h-4 w-4' }),
                            '서비스 추가',
                          ],
                        }),
                      }),
                      (0, b.jsx)(k.Card, {
                        children: (0, b.jsx)(k.CardContent, {
                          className: 'pt-6',
                          children: (0, b.jsxs)('div', {
                            className: 'flex flex-col gap-4 md:flex-row',
                            children: [
                              (0, b.jsxs)('div', {
                                className: 'relative flex-1',
                                children: [
                                  (0, b.jsx)(z.SearchIcon, {
                                    className:
                                      'text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform',
                                  }),
                                  (0, b.jsx)(B.Input, {
                                    placeholder: '서비스명 또는 설명으로 검색...',
                                    value: r,
                                    onChange: (a) => s(a.target.value),
                                    className: 'pl-10',
                                  }),
                                ],
                              }),
                              (0, b.jsxs)(x.Select, {
                                value: t,
                                onValueChange: u,
                                children: [
                                  (0, b.jsx)(x.SelectTrigger, {
                                    className: 'w-full md:w-32',
                                    children: (0, b.jsx)(x.SelectValue, {}),
                                  }),
                                  (0, b.jsxs)(x.SelectContent, {
                                    children: [
                                      (0, b.jsx)(x.SelectItem, {
                                        value: 'ALL',
                                        children: '모든 상태',
                                      }),
                                      (0, b.jsx)(x.SelectItem, {
                                        value: 'ACTIVE',
                                        children: '활성',
                                      }),
                                      (0, b.jsx)(x.SelectItem, {
                                        value: 'INACTIVE',
                                        children: '비활성',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      }),
                      (0, b.jsx)('div', {
                        className: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
                        children: D.map((a) =>
                          (0, b.jsx)(
                            w,
                            { service: a, onEdit: G, onToggleStatus: H, onDelete: I },
                            a.id
                          )
                        ),
                      }),
                      0 === D.length &&
                        (0, b.jsx)(k.Card, {
                          children: (0, b.jsx)(k.CardContent, {
                            className: 'pt-6',
                            children: (0, b.jsxs)('div', {
                              className: 'space-y-4 text-center',
                              children: [
                                (0, b.jsx)(A.AlertCircleIcon, {
                                  className: 'text-muted-foreground mx-auto h-12 w-12',
                                }),
                                (0, b.jsx)('h3', {
                                  className: 'text-lg font-semibold',
                                  children: '서비스가 없습니다',
                                }),
                                (0, b.jsx)('p', {
                                  className: 'text-muted-foreground',
                                  children:
                                    r || 'ALL' !== t
                                      ? '검색 조건에 맞는 서비스가 없습니다.'
                                      : '첫 번째 서비스를 추가해보세요.',
                                }),
                                !r &&
                                  'ALL' === t &&
                                  (0, b.jsxs)(l.Button, {
                                    onClick: () => p.push('/admin/dashboard/services/new'),
                                    children: [
                                      (0, b.jsx)(y.PlusIcon, { className: 'mr-2 h-4 w-4' }),
                                      '서비스 추가',
                                    ],
                                  }),
                              ],
                            }),
                          }),
                        }),
                    ],
                  }),
                }),
              ],
            })
          : null
    }
    a.s(['default', () => C], 604095)
  },
]

//# sourceMappingURL=_497d379a._.js.map
