module.exports = [
  429246,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(368114)
    function d({ className: a, ...d }) {
      return (0, b.jsx)('textarea', {
        'data-slot': 'textarea',
        className: (0, c.cn)(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-[100px] w-full min-w-0 rounded-md border bg-transparent px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[96px] sm:px-3 sm:py-2',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'resize-y',
          'touch-manipulation',
          a
        ),
        ...d,
      })
    }
    a.s(['Textarea', () => d])
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
  854251,
  (a) => {
    'use strict'
    var b = a.i(626405)
    a.s(['CheckCircleIcon', () => b.default])
  },
  841603,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(699570),
      e = a.i(866718),
      f = a.i(429246),
      g = a.i(580701),
      h = a.i(368114),
      i = a.i(591119)
    function j({ data: a, columns: c, className: d, mobileCardClassName: e, onRowClick: f }) {
      let g = c.filter((a) => 'high' === a.priority),
        j = c.filter((a) => 'medium' === a.priority || !a.priority),
        k = c.filter((a) => 'low' === a.priority)
      return (0, b.jsxs)(b.Fragment, {
        children: [
          (0, b.jsx)('div', {
            className: (0, h.cn)('hidden sm:block', d),
            children: (0, b.jsx)('div', {
              className: 'relative w-full overflow-x-auto',
              children: (0, b.jsxs)('table', {
                className: 'w-full caption-bottom text-sm',
                children: [
                  (0, b.jsx)('thead', {
                    className: '[&_tr]:border-b',
                    children: (0, b.jsx)('tr', {
                      className:
                        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
                      children: c.map((a) =>
                        (0, b.jsx)(
                          'th',
                          {
                            className: (0, h.cn)(
                              'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
                              a.className
                            ),
                            children: a.label,
                          },
                          String(a.key)
                        )
                      ),
                    }),
                  }),
                  (0, b.jsx)('tbody', {
                    className: '[&_tr:last-child]:border-0',
                    children: a.map((a, d) =>
                      (0, b.jsx)(
                        'tr',
                        {
                          className: (0, h.cn)(
                            'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
                            f && 'cursor-pointer'
                          ),
                          onClick: () => f?.(a),
                          children: c.map((c) =>
                            (0, b.jsx)(
                              'td',
                              {
                                className: (0, h.cn)(
                                  'p-4 align-middle [&:has([role=checkbox])]:pr-0',
                                  c.className
                                ),
                                children: c.render ? c.render(a[c.key], a) : a[c.key],
                              },
                              String(c.key)
                            )
                          ),
                        },
                        d
                      )
                    ),
                  }),
                ],
              }),
            }),
          }),
          (0, b.jsx)('div', {
            className: (0, h.cn)('space-y-4 sm:hidden', e),
            children: a.map((a, c) =>
              (0, b.jsx)(
                i.Card,
                {
                  className: (0, h.cn)(
                    'transition-all active:scale-[0.99]',
                    f && 'active:bg-accent/50 cursor-pointer'
                  ),
                  onClick: () => f?.(a),
                  children: (0, b.jsxs)(i.CardContent, {
                    className: 'p-4',
                    children: [
                      g.length > 0 &&
                        (0, b.jsx)('div', {
                          className: 'mb-3',
                          children: g.map((c) =>
                            (0, b.jsx)(
                              'div',
                              {
                                className: 'text-base font-semibold',
                                children: c.render ? c.render(a[c.key], a) : a[c.key],
                              },
                              String(c.key)
                            )
                          ),
                        }),
                      j.length > 0 &&
                        (0, b.jsx)('div', {
                          className: 'space-y-2',
                          children: j.map((c) =>
                            (0, b.jsxs)(
                              'div',
                              {
                                className: 'flex items-center justify-between',
                                children: [
                                  (0, b.jsxs)('span', {
                                    className: 'text-muted-foreground text-sm',
                                    children: [c.label, ':'],
                                  }),
                                  (0, b.jsx)('span', {
                                    className: 'text-sm font-medium',
                                    children: c.render ? c.render(a[c.key], a) : a[c.key],
                                  }),
                                ],
                              },
                              String(c.key)
                            )
                          ),
                        }),
                      k.length > 0 &&
                        (0, b.jsx)('div', {
                          className: 'mt-3 border-t border-gray-100 pt-3',
                          children: (0, b.jsx)('div', {
                            className: 'flex flex-wrap gap-3',
                            children: k.map((c) =>
                              (0, b.jsxs)(
                                'div',
                                {
                                  className: 'text-xs',
                                  children: [
                                    (0, b.jsxs)('span', {
                                      className: 'text-muted-foreground',
                                      children: [c.label, ': '],
                                    }),
                                    (0, b.jsx)('span', {
                                      className: 'font-medium',
                                      children: c.render ? c.render(a[c.key], a) : a[c.key],
                                    }),
                                  ],
                                },
                                String(c.key)
                              )
                            ),
                          }),
                        }),
                    ],
                  }),
                },
                c
              )
            ),
          }),
        ],
      })
    }
    var k = a.i(786304),
      l = a.i(854251)
    let m = [
      {
        id: 1,
        name: '김미미',
        service: '전체 미용',
        date: '2024-03-15',
        time: '14:00',
        price: 6e4,
        status: 'confirmed',
      },
      {
        id: 2,
        name: '이포메',
        service: '목욕 + 부분 미용',
        date: '2024-03-16',
        time: '10:00',
        price: 45e3,
        status: 'pending',
      },
      {
        id: 3,
        name: '박몽이',
        service: '스파 + 전체 미용',
        date: '2024-03-17',
        time: '15:30',
        price: 8e4,
        status: 'completed',
      },
    ]
    function n() {
      let [a, h] = (0, c.useState)(''),
        [n, o] = (0, c.useState)(''),
        [p, q] = (0, c.useState)('')
      return (0, b.jsx)('div', {
        className: 'min-h-screen bg-gray-50 p-4 pb-20',
        children: (0, b.jsxs)('div', {
          className: 'mx-auto max-w-4xl space-y-6',
          children: [
            (0, b.jsxs)(i.Card, {
              children: [
                (0, b.jsx)(i.CardHeader, {
                  children: (0, b.jsxs)(i.CardTitle, {
                    className: 'flex items-center gap-2',
                    children: [
                      (0, b.jsx)(l.CheckCircleIcon, { className: 'h-5 w-5 text-green-500' }),
                      '모바일 UI 개선 테스트',
                    ],
                  }),
                }),
                (0, b.jsxs)(i.CardContent, {
                  className: 'space-y-6',
                  children: [
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 text-lg font-semibold',
                          children: '1. 버튼 (최소 44px 터치 영역)',
                        }),
                        (0, b.jsxs)('div', {
                          className: 'flex flex-wrap gap-3',
                          children: [
                            (0, b.jsx)(d.Button, { children: '기본 버튼' }),
                            (0, b.jsx)(d.Button, { variant: 'outline', children: '아웃라인' }),
                            (0, b.jsx)(d.Button, { variant: 'secondary', children: '보조 버튼' }),
                            (0, b.jsx)(d.Button, { size: 'sm', children: '작은 버튼' }),
                            (0, b.jsx)(d.Button, { size: 'lg', children: '큰 버튼' }),
                            (0, b.jsx)(d.Button, { size: 'icon', children: '🔔' }),
                          ],
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground mt-2 text-sm',
                          children: '✅ 모바일: 최소 44px 높이 | 데스크톱: 40px',
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 text-lg font-semibold',
                          children: '2. 입력 필드 (16px 폰트로 줌 방지)',
                        }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-3',
                          children: [
                            (0, b.jsx)(e.Input, {
                              placeholder: '이름을 입력하세요',
                              value: a,
                              onChange: (a) => h(a.target.value),
                            }),
                            (0, b.jsx)(e.Input, {
                              type: 'email',
                              placeholder: '이메일을 입력하세요',
                            }),
                            (0, b.jsx)(e.Input, {
                              type: 'tel',
                              placeholder: '전화번호를 입력하세요',
                            }),
                          ],
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground mt-2 text-sm',
                          children: '✅ 16px 폰트 크기로 모바일 줌 방지',
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 text-lg font-semibold',
                          children: '3. 텍스트 영역',
                        }),
                        (0, b.jsx)(f.Textarea, {
                          placeholder: '메시지를 입력하세요...',
                          value: n,
                          onChange: (a) => o(a.target.value),
                          rows: 4,
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground mt-2 text-sm',
                          children: '✅ 세로 크기 조절 가능 (resize-y)',
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 text-lg font-semibold',
                          children: '4. 선택 드롭다운 (터치 영역 확대)',
                        }),
                        (0, b.jsxs)(g.Select, {
                          value: p,
                          onValueChange: q,
                          children: [
                            (0, b.jsx)(g.SelectTrigger, {
                              children: (0, b.jsx)(g.SelectValue, {
                                placeholder: '서비스를 선택하세요',
                              }),
                            }),
                            (0, b.jsxs)(g.SelectContent, {
                              children: [
                                (0, b.jsx)(g.SelectItem, { value: 'full', children: '전체 미용' }),
                                (0, b.jsx)(g.SelectItem, {
                                  value: 'partial',
                                  children: '부분 미용',
                                }),
                                (0, b.jsx)(g.SelectItem, { value: 'bath', children: '목욕만' }),
                                (0, b.jsx)(g.SelectItem, { value: 'spa', children: '스파 + 미용' }),
                                (0, b.jsx)(g.SelectItem, { value: 'nail', children: '발톱 관리' }),
                              ],
                            }),
                          ],
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground mt-2 text-sm',
                          children: '✅ 드롭다운 항목 44px 높이',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsxs)(i.Card, {
              children: [
                (0, b.jsx)(i.CardHeader, {
                  children: (0, b.jsx)(i.CardTitle, {
                    children: '5. 반응형 테이블 (모바일 카드 뷰)',
                  }),
                }),
                (0, b.jsxs)(i.CardContent, {
                  children: [
                    (0, b.jsx)(j, {
                      data: m,
                      columns: [
                        { key: 'name', label: '고객명', priority: 'high' },
                        { key: 'service', label: '서비스', priority: 'high' },
                        { key: 'date', label: '날짜', priority: 'medium' },
                        { key: 'time', label: '시간', priority: 'medium' },
                        {
                          key: 'price',
                          label: '금액',
                          priority: 'medium',
                          render: (a) => `${a.toLocaleString('ko-KR')}원`,
                        },
                        {
                          key: 'status',
                          label: '상태',
                          priority: 'low',
                          render: (a) =>
                            (0, b.jsx)(k.Badge, {
                              variant:
                                'completed' === a
                                  ? 'default'
                                  : 'confirmed' === a
                                    ? 'secondary'
                                    : 'outline',
                              children:
                                'completed' === a ? '완료' : 'confirmed' === a ? '확정' : '대기',
                            }),
                        },
                      ],
                      onRowClick: (a) => console.log('Clicked:', a),
                    }),
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground mt-4 text-sm',
                      children: '✅ 모바일: 카드 뷰 | 데스크톱: 테이블 뷰',
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsxs)(i.Card, {
              children: [
                (0, b.jsx)(i.CardHeader, {
                  children: (0, b.jsx)(i.CardTitle, { children: '6. 터치 피드백 테스트' }),
                }),
                (0, b.jsxs)(i.CardContent, {
                  className: 'space-y-3',
                  children: [
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground mb-3 text-sm',
                      children: '버튼을 터치/클릭하여 피드백을 확인하세요',
                    }),
                    (0, b.jsxs)('div', {
                      className: 'grid grid-cols-2 gap-3',
                      children: [
                        (0, b.jsx)(d.Button, {
                          className: 'active:scale-[0.98]',
                          children: '스케일 피드백',
                        }),
                        (0, b.jsx)(d.Button, {
                          variant: 'outline',
                          className: 'active:bg-accent',
                          children: '배경색 피드백',
                        }),
                        (0, b.jsx)(d.Button, {
                          variant: 'secondary',
                          className: 'active:opacity-80',
                          children: '투명도 피드백',
                        }),
                        (0, b.jsx)(d.Button, {
                          variant: 'ghost',
                          className: 'active:bg-accent/90',
                          children: '고스트 피드백',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsxs)(i.Card, {
              className: 'border-green-200 bg-green-50',
              children: [
                (0, b.jsx)(i.CardHeader, {
                  children: (0, b.jsx)(i.CardTitle, {
                    className: 'text-green-800',
                    children: '✅ 모바일 최적화 완료 항목',
                  }),
                }),
                (0, b.jsx)(i.CardContent, {
                  children: (0, b.jsxs)('ul', {
                    className: 'space-y-2 text-green-700',
                    children: [
                      (0, b.jsxs)('li', {
                        className: 'flex items-start gap-2',
                        children: [
                          (0, b.jsx)(l.CheckCircleIcon, {
                            className: 'mt-0.5 h-5 w-5 flex-shrink-0',
                          }),
                          (0, b.jsx)('span', { children: '버튼: 최소 44px 터치 타겟' }),
                        ],
                      }),
                      (0, b.jsxs)('li', {
                        className: 'flex items-start gap-2',
                        children: [
                          (0, b.jsx)(l.CheckCircleIcon, {
                            className: 'mt-0.5 h-5 w-5 flex-shrink-0',
                          }),
                          (0, b.jsx)('span', { children: '입력 필드: 16px 폰트로 줌 방지' }),
                        ],
                      }),
                      (0, b.jsxs)('li', {
                        className: 'flex items-start gap-2',
                        children: [
                          (0, b.jsx)(l.CheckCircleIcon, {
                            className: 'mt-0.5 h-5 w-5 flex-shrink-0',
                          }),
                          (0, b.jsx)('span', { children: '선택 드롭다운: 터치 영역 확대' }),
                        ],
                      }),
                      (0, b.jsxs)('li', {
                        className: 'flex items-start gap-2',
                        children: [
                          (0, b.jsx)(l.CheckCircleIcon, {
                            className: 'mt-0.5 h-5 w-5 flex-shrink-0',
                          }),
                          (0, b.jsx)('span', { children: '테이블: 모바일 카드 뷰 지원' }),
                        ],
                      }),
                      (0, b.jsxs)('li', {
                        className: 'flex items-start gap-2',
                        children: [
                          (0, b.jsx)(l.CheckCircleIcon, {
                            className: 'mt-0.5 h-5 w-5 flex-shrink-0',
                          }),
                          (0, b.jsx)('span', { children: '네비게이션: 터치 피드백 강화' }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      })
    }
    a.s(['default', () => n], 841603)
  },
]

//# sourceMappingURL=_4b8acf1e._.js.map
