module.exports = [
  87896,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(529139),
      e = a.i(50944),
      f = a.i(920140),
      g = a.i(737984),
      h = a.i(205138),
      i = a.i(734305),
      j = a.i(114548),
      k = a.i(823292),
      l = a.i(591119),
      m = a.i(699570),
      n = a.i(429246),
      o = a.i(580701),
      p = a.i(858544)
    function q({
      selectedPetType: a,
      selectedCategory: d,
      onPetTypeChange: e,
      onCategoryChange: f,
    }) {
      let [g, h] = (0, c.useState)(''),
        { data: q = [] } = (0, i.useGetBreedsQuery)(),
        [r, { isLoading: s }] = (0, i.useCreateBreedsMutation)()
      ;(0, c.useEffect)(() => {
        h(
          q
            .filter((b) => b.petType === a && b.category === d)
            .map((a) => a.name)
            .join(', ')
        )
      }, [a, d, q])
      let t = 'DOG' === a ? Object.entries(p.DOG_CATEGORIES) : Object.entries(p.CAT_CATEGORIES)
      return (0, b.jsxs)(l.Card, {
        children: [
          (0, b.jsxs)(l.CardHeader, {
            children: [
              (0, b.jsx)(l.CardTitle, { children: '품종 일괄 입력' }),
              (0, b.jsx)(l.CardDescription, {
                children: '콤마(,)로 구분하여 여러 품종을 한 번에 입력할 수 있습니다',
              }),
            ],
          }),
          (0, b.jsxs)(l.CardContent, {
            className: 'space-y-4',
            children: [
              (0, b.jsxs)('div', {
                className: 'space-y-2',
                children: [
                  (0, b.jsx)('label', { className: 'text-sm font-medium', children: '동물 타입' }),
                  (0, b.jsxs)(o.Select, {
                    value: a,
                    onValueChange: (a) => {
                      ;(e(a), f('DOG' === a ? 'SMALL' : 'SHORT_HAIR'))
                    },
                    children: [
                      (0, b.jsx)(o.SelectTrigger, { children: (0, b.jsx)(o.SelectValue, {}) }),
                      (0, b.jsxs)(o.SelectContent, {
                        children: [
                          (0, b.jsx)(o.SelectItem, { value: 'DOG', children: '강아지' }),
                          (0, b.jsx)(o.SelectItem, { value: 'CAT', children: '고양이' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, b.jsxs)('div', {
                className: 'space-y-2',
                children: [
                  (0, b.jsx)('label', { className: 'text-sm font-medium', children: '카테고리' }),
                  (0, b.jsxs)(o.Select, {
                    value: d,
                    onValueChange: f,
                    children: [
                      (0, b.jsx)(o.SelectTrigger, { children: (0, b.jsx)(o.SelectValue, {}) }),
                      (0, b.jsx)(o.SelectContent, {
                        children: t.map(([a, c]) =>
                          (0, b.jsx)(o.SelectItem, { value: a, children: c }, a)
                        ),
                      }),
                    ],
                  }),
                ],
              }),
              (0, b.jsxs)('div', {
                className: 'space-y-2',
                children: [
                  (0, b.jsxs)('label', {
                    className: 'text-sm font-medium',
                    children: [
                      '품종명 (콤마로 구분)',
                      (0, b.jsx)('span', {
                        className: 'text-muted-foreground ml-2 text-xs',
                        children: '예: 토이푸들, 포메라니안, 말티즈',
                      }),
                    ],
                  }),
                  (0, b.jsx)(n.Textarea, {
                    value: g,
                    onChange: (a) => h(a.target.value),
                    placeholder: '토이푸들, 포메라니안, 말티즈, 시츄',
                    rows: 6,
                    className: 'font-mono text-sm',
                  }),
                  (0, b.jsx)('p', {
                    className: 'text-muted-foreground text-xs',
                    children: '입력 순서대로 표시 순서가 결정됩니다',
                  }),
                ],
              }),
              (0, b.jsxs)(m.Button, {
                onClick: () => {
                  g.trim()
                    ? r({ petType: a, category: d, breedNames: g })
                        .unwrap()
                        .then((a) => {
                          k.toast.success('저장 완료', {
                            description: `${a.created}개 생성, ${a.updated}개 수정되었습니다.`,
                          })
                        })
                        .catch((a) => {
                          k.toast.error('저장 실패', {
                            description: a.message || '품종 저장에 실패했습니다.',
                          })
                        })
                    : k.toast.error('입력 오류', { description: '품종명을 입력해주세요.' })
                },
                disabled: s,
                className: 'w-full',
                size: 'lg',
                children: [
                  (0, b.jsx)(j.Save, { className: 'mr-2 h-4 w-4' }),
                  s ? '저장 중...' : '저장',
                ],
              }),
            ],
          }),
        ],
      })
    }
    var r = a.i(786304),
      s = a.i(400187),
      t = a.i(368114),
      u = a.i(348114),
      u = u,
      v = a.i(296496),
      v = v,
      w = a.i(781560)
    let x = (0, s.cva)('flex items-center justify-between transition-colors', {
        variants: {
          variant: {
            default: 'bg-muted/50 rounded-lg',
            compact: 'bg-muted/30 rounded',
            detailed: 'bg-card border border-border rounded-lg shadow-sm',
            highlight:
              'border border-primary/50 bg-gradient-to-br from-primary/5 to-transparent rounded-lg shadow-md',
            minimal: 'border border-border/50 bg-transparent rounded-lg',
          },
          size: { sm: 'p-2', default: 'p-3', lg: 'p-4' },
        },
        defaultVariants: { variant: 'default', size: 'default' },
      }),
      y = c.forwardRef(
        (
          {
            className: a,
            variant: c,
            size: d,
            breed: e,
            onToggleActive: f,
            onDeleteBreed: g,
            ...h
          },
          i
        ) =>
          (0, b.jsxs)('div', {
            ref: i,
            className: (0, t.cn)(x({ variant: c, size: d, className: a })),
            ...h,
            children: [
              (0, b.jsxs)('div', {
                className: 'flex items-center gap-3',
                children: [
                  (0, b.jsxs)('span', {
                    className: 'text-muted-foreground w-6 font-mono text-xs',
                    children: ['#', e.displayOrder],
                  }),
                  (0, b.jsx)('span', { className: 'font-medium', children: e.name }),
                  !e.isActive &&
                    (0, b.jsx)(r.Badge, {
                      variant: 'outline',
                      className: 'text-xs',
                      children: '비활성',
                    }),
                  e._count.pets > 0 &&
                    (0, b.jsxs)(r.Badge, {
                      variant: 'secondary',
                      className: 'text-xs',
                      children: [e._count.pets, '마리 사용 중'],
                    }),
                ],
              }),
              (0, b.jsxs)('div', {
                className: 'flex gap-1',
                children: [
                  (0, b.jsx)(m.Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => f(e.id, e.isActive),
                    title: e.isActive ? '비활성화' : '활성화',
                    children: e.isActive
                      ? (0, b.jsx)(u.default, { className: 'h-4 w-4' })
                      : (0, b.jsx)(v.default, { className: 'h-4 w-4' }),
                  }),
                  (0, b.jsx)(m.Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => g(e.id, e.name),
                    disabled: e._count.pets > 0,
                    title: e._count.pets > 0 ? '사용 중인 품종은 삭제할 수 없습니다' : '삭제',
                    children: (0, b.jsx)(w.Trash2, { className: 'h-4 w-4' }),
                  }),
                ],
              }),
            ],
          })
      )
    function z({ breeds: a, selectedPetType: c, selectedCategory: d }) {
      let [e] = (0, i.useDeleteBreedMutation)(),
        [f] = (0, i.useUpdateBreedMutation)(),
        g = a.filter((a) => a.petType === c && a.category === d),
        h = (a, b) => {
          confirm(`"${b}" 품종을 삭제하시겠습니까?`) &&
            e(a)
              .unwrap()
              .then(() => {
                k.toast.success('삭제 완료', { description: '품종이 삭제되었습니다.' })
              })
              .catch((a) => {
                k.toast.error('삭제 실패', {
                  description: a.message || '품종 삭제에 실패했습니다.',
                })
              })
        },
        j = (a, b) => {
          f({ id: a, isActive: b })
            .unwrap()
            .catch((a) => {
              k.toast.error('상태 변경 실패', {
                description: a.message || '품종 상태 변경에 실패했습니다.',
              })
            })
        }
      return (0, b.jsxs)(l.Card, {
        children: [
          (0, b.jsxs)(l.CardHeader, {
            children: [
              (0, b.jsxs)(l.CardTitle, {
                children: [
                  '현재 품종 목록',
                  (0, b.jsxs)(r.Badge, {
                    variant: 'secondary',
                    className: 'ml-2',
                    children: [g.length, '개'],
                  }),
                ],
              }),
              (0, b.jsxs)(l.CardDescription, {
                children: ['DOG' === c ? '강아지' : '고양이', ' ·', ' ', (0, p.getCategoryName)(d)],
              }),
            ],
          }),
          (0, b.jsx)(l.CardContent, {
            children: (0, b.jsx)('div', {
              className: 'space-y-2',
              children:
                0 === g.length
                  ? (0, b.jsx)('p', {
                      className: 'text-muted-foreground py-8 text-center text-sm',
                      children: '등록된 품종이 없습니다',
                    })
                  : g.map((a) =>
                      (0, b.jsx)(y, { breed: a, onToggleActive: j, onDeleteBreed: h }, a.id)
                    ),
            }),
          }),
        ],
      })
    }
    function A({ breeds: a }) {
      let c = a.filter((a) => 'DOG' === a.petType).length,
        d = a.filter((a) => 'CAT' === a.petType).length,
        e = a.filter((a) => a.isActive).length,
        f = a.filter((a) => !a.isActive).length
      return (0, b.jsxs)(l.Card, {
        className: 'mt-6',
        children: [
          (0, b.jsx)(l.CardHeader, {
            children: (0, b.jsx)(l.CardTitle, { children: '전체 품종 통계' }),
          }),
          (0, b.jsx)(l.CardContent, {
            children: (0, b.jsxs)('div', {
              className: 'grid gap-4 md:grid-cols-4',
              children: [
                (0, b.jsxs)('div', {
                  className: 'space-y-1',
                  children: [
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground text-sm',
                      children: '강아지 품종',
                    }),
                    (0, b.jsxs)('p', { className: 'text-2xl font-bold', children: [c, '개'] }),
                  ],
                }),
                (0, b.jsxs)('div', {
                  className: 'space-y-1',
                  children: [
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground text-sm',
                      children: '고양이 품종',
                    }),
                    (0, b.jsxs)('p', { className: 'text-2xl font-bold', children: [d, '개'] }),
                  ],
                }),
                (0, b.jsxs)('div', {
                  className: 'space-y-1',
                  children: [
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground text-sm',
                      children: '활성 품종',
                    }),
                    (0, b.jsxs)('p', { className: 'text-2xl font-bold', children: [e, '개'] }),
                  ],
                }),
                (0, b.jsxs)('div', {
                  className: 'space-y-1',
                  children: [
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground text-sm',
                      children: '비활성 품종',
                    }),
                    (0, b.jsxs)('p', { className: 'text-2xl font-bold', children: [f, '개'] }),
                  ],
                }),
              ],
            }),
          }),
        ],
      })
    }
    function B() {
      let { data: a, isPending: j } = (0, d.useSession)(),
        k = (0, e.useRouter)(),
        [l, m] = (0, c.useState)('DOG'),
        [n, o] = (0, c.useState)('SMALL'),
        { data: p = [], isLoading: r } = (0, i.useGetBreedsQuery)()
      return ((0, c.useEffect)(() => {
        ;(a || k.push('/auth/signin'),
          a?.user?.role && 'ADMIN' !== a.user.role && k.push('/admin/dashboard/overview'))
      }, [a, k]),
      j || r)
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(h.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'ADMIN'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsx)(g.PageHeader, {
                    title: '품종 관리',
                    description: '반려동물 품종을 일괄 등록 및 수정할 수 있습니다',
                    children: (0, b.jsx)('div', {
                      className: 'flex items-center gap-2',
                      children: (0, b.jsx)(f.PawPrint, { className: 'text-primary h-5 w-5' }),
                    }),
                  }),
                }),
                (0, b.jsxs)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'grid gap-6 md:grid-cols-2',
                      children: [
                        (0, b.jsx)(q, {
                          selectedPetType: l,
                          selectedCategory: n,
                          onPetTypeChange: m,
                          onCategoryChange: o,
                        }),
                        (0, b.jsx)(z, { breeds: p, selectedPetType: l, selectedCategory: n }),
                      ],
                    }),
                    (0, b.jsx)(A, { breeds: p }),
                  ],
                }),
              ],
            })
          : null
    }
    ;((y.displayName = 'BreedItem'), a.s(['default', () => B], 87896))
  },
]

//# sourceMappingURL=src_app_admin_dashboard_breeds_page_tsx_d881106d._.js.map
