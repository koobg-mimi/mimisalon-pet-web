module.exports = [
  836685,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(256711),
      d = a.i(302491),
      e = a.i(529139),
      f = a.i(50944),
      g = a.i(572131),
      h = a.i(370025),
      i = a.i(433217),
      j = a.i(937927),
      k = a.i(824569),
      l = a.i(915618),
      m = a.i(321161),
      n = a.i(781560),
      o = a.i(699570),
      p = a.i(205138),
      q = a.i(468075),
      r = a.i(238246)
    function s() {
      let { data: a, isPending: s } = (0, e.useSession)(),
        t = (0, f.useRouter)(),
        u = (0, j.useQueryClient)(),
        [v, w] = (0, g.useState)(''),
        [x, y] = (0, g.useState)('ALL'),
        [z, A] = (0, g.useState)(null),
        [B, C] = (0, g.useState)(null),
        [D, E] = (0, g.useState)(!1)
      ;(0, g.useEffect)(() => {
        ;(a || t.push('/auth/signin'),
          a?.user?.role && 'ADMIN' !== a.user.role && t.push('/admin/dashboard/overview'))
      }, [a, t])
      let { data: F, isLoading: G } = (0, i.useQuery)({
          queryKey: ['admin', 'commission-grades', v, x],
          queryFn: async () => {
            let a = new URLSearchParams({ search: v, status: x }),
              b = await fetch(`/api/admin/commission-grades?${a}`)
            if (!b.ok) throw Error('Failed to fetch commission grades')
            return b.json()
          },
          enabled: !!a?.user && 'ADMIN' === a.user.role,
        }),
        H = (0, h.useMutation)({
          mutationFn: async ({ gradeId: a, action: b }) => {
            let c = await fetch(`/api/admin/commission-grades/${a}/${b}`, {
              method: 'delete' === b ? 'DELETE' : 'PATCH',
            })
            if (!c.ok) throw Error(`Failed to ${b} grade`)
            return c.json()
          },
          onSuccess: () => {
            u.invalidateQueries({ queryKey: ['admin', 'commission-grades'] })
          },
          onError: (a, b) => {
            console.error(`Failed to ${b.action} grade:`, a)
          },
        }),
        I = (0, h.useMutation)({
          mutationFn: async ({ gradeData: a, isEdit: b, gradeId: c }) => {
            let d = b ? `/api/admin/commission-grades/${c}` : '/api/admin/commission-grades',
              e = await fetch(d, {
                method: b ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(a),
              })
            if (!e.ok) throw Error('Failed to save grade')
            return e.json()
          },
          onSuccess: () => {
            ;(u.invalidateQueries({ queryKey: ['admin', 'commission-grades'] }), C(null), E(!1))
          },
          onError: (a) => {
            console.error('Failed to save grade:', a)
          },
        }),
        J = (a, b) => {
          H.mutate({ gradeId: a, action: b })
        },
        K = F?.grades || [],
        L = (a) => (0, c.format)(new Date(a), 'yyyy-MM-dd', { locale: d.ko }),
        M = (a) => (a <= 10 ? 'text-green-600' : a <= 15 ? 'text-yellow-600' : 'text-red-600')
      return s || G
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(p.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'ADMIN'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsx)('div', {
                    className: 'container mx-auto px-4 py-6',
                    children: (0, b.jsxs)('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        (0, b.jsxs)('div', {
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'mb-2 flex items-center gap-2',
                              children: [
                                (0, b.jsx)(m.Settings, { className: 'text-primary h-6 w-6' }),
                                (0, b.jsx)('h1', {
                                  className: 'text-foreground text-3xl font-bold',
                                  children: '정산 등급 설정',
                                }),
                              ],
                            }),
                            (0, b.jsx)('p', {
                              className: 'text-muted-foreground',
                              children: '미용사 수수료 등급을 관리하세요',
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'flex gap-2',
                          children: [
                            (0, b.jsxs)(o.Button, {
                              onClick: () => E(!0),
                              children: [
                                (0, b.jsx)(l.Plus, { className: 'mr-2 h-4 w-4' }),
                                '새 등급',
                              ],
                            }),
                            (0, b.jsx)(o.Button, {
                              asChild: !0,
                              children: (0, b.jsx)(r.default, {
                                href: '/admin/dashboard/settlement/management',
                                children: '정산 관리',
                              }),
                            }),
                            (0, b.jsx)(o.Button, {
                              asChild: !0,
                              children: (0, b.jsx)(r.default, {
                                href: '/admin/dashboard/overview',
                                children: '대시보드',
                              }),
                            }),
                            (0, b.jsxs)('span', {
                              className: 'text-muted-foreground text-sm',
                              children: ['총 ', K.length, '개'],
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
                    (0, b.jsx)(q.AdminStatsCards, { variant: 'settlements' }),
                    (0, b.jsxs)('div', {
                      className: 'border-border bg-card rounded-lg border',
                      children: [
                        (0, b.jsx)('div', {
                          className: 'border-border border-b p-6',
                          children: (0, b.jsxs)('div', {
                            className: 'flex flex-col gap-4 lg:flex-row',
                            children: [
                              (0, b.jsx)('div', {
                                className: 'flex-1',
                                children: (0, b.jsx)('input', {
                                  type: 'text',
                                  placeholder: '등급명, 설명으로 검색...',
                                  value: v,
                                  onChange: (a) => w(a.target.value),
                                  className:
                                    'border-input bg-background focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none',
                                }),
                              }),
                              (0, b.jsx)('div', {
                                className: 'flex gap-2',
                                children: (0, b.jsxs)('select', {
                                  value: x,
                                  onChange: (a) => y(a.target.value),
                                  className:
                                    'border-input bg-background rounded-md border px-3 py-2 text-sm',
                                  children: [
                                    (0, b.jsx)('option', { value: 'ALL', children: '모든 상태' }),
                                    (0, b.jsx)('option', { value: 'ACTIVE', children: '활성' }),
                                    (0, b.jsx)('option', { value: 'INACTIVE', children: '비활성' }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                        }),
                        (0, b.jsx)('div', {
                          className: 'overflow-x-auto',
                          children: (0, b.jsxs)('table', {
                            className: 'w-full',
                            children: [
                              (0, b.jsx)('thead', {
                                children: (0, b.jsxs)('tr', {
                                  className: 'border-border bg-muted/50 border-b',
                                  children: [
                                    (0, b.jsx)('th', {
                                      className: 'p-4 text-left font-medium',
                                      children: '등급명',
                                    }),
                                    (0, b.jsx)('th', {
                                      className: 'p-4 text-left font-medium',
                                      children: '수수료율',
                                    }),
                                    (0, b.jsx)('th', {
                                      className: 'p-4 text-left font-medium',
                                      children: '할당 방식',
                                    }),
                                    (0, b.jsx)('th', {
                                      className: 'p-4 text-left font-medium',
                                      children: '적용 미용사',
                                    }),
                                    (0, b.jsx)('th', {
                                      className: 'p-4 text-left font-medium',
                                      children: '상태',
                                    }),
                                    (0, b.jsx)('th', {
                                      className: 'p-4 text-left font-medium',
                                      children: '생성일',
                                    }),
                                    (0, b.jsx)('th', {
                                      className: 'p-4 text-right font-medium',
                                      children: '작업',
                                    }),
                                  ],
                                }),
                              }),
                              (0, b.jsx)('tbody', {
                                children: K.map((a) =>
                                  (0, b.jsxs)(
                                    'tr',
                                    {
                                      className: 'border-border hover:bg-muted/30 border-b',
                                      children: [
                                        (0, b.jsx)('td', {
                                          className: 'p-4',
                                          children: (0, b.jsxs)('div', {
                                            children: [
                                              (0, b.jsx)('p', {
                                                className: 'font-medium',
                                                children: a.name,
                                              }),
                                              (0, b.jsx)('p', {
                                                className:
                                                  'text-muted-foreground line-clamp-2 text-sm',
                                                children: a.description,
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, b.jsx)('td', {
                                          className: 'p-4',
                                          children: (0, b.jsxs)('span', {
                                            className: `text-lg font-bold ${M(a.commissionRate)}`,
                                            children: [a.commissionRate, '%'],
                                          }),
                                        }),
                                        (0, b.jsx)('td', {
                                          className: 'p-4',
                                          children: (0, b.jsx)('div', {
                                            className: 'text-sm',
                                            children: (0, b.jsx)('p', {
                                              className: 'text-muted-foreground',
                                              children: '수동 할당',
                                            }),
                                          }),
                                        }),
                                        (0, b.jsx)('td', {
                                          className: 'p-4',
                                          children: (0, b.jsxs)('span', {
                                            className: 'text-sm font-medium',
                                            children: [a.groomerCount || 0, '명'],
                                          }),
                                        }),
                                        (0, b.jsx)('td', {
                                          className: 'p-4',
                                          children: (0, b.jsx)('span', {
                                            className: `rounded-full px-2 py-1 text-xs ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`,
                                            children: a.isActive ? '활성' : '비활성',
                                          }),
                                        }),
                                        (0, b.jsx)('td', {
                                          className: 'p-4',
                                          children: (0, b.jsx)('span', {
                                            className: 'text-sm',
                                            children: L(a.createdAt),
                                          }),
                                        }),
                                        (0, b.jsx)('td', {
                                          className: 'p-4',
                                          children: (0, b.jsxs)('div', {
                                            className: 'flex justify-end gap-1',
                                            children: [
                                              (0, b.jsx)(o.Button, {
                                                size: 'sm',
                                                variant: 'outline',
                                                onClick: () => A(a),
                                                children: '상세',
                                              }),
                                              (0, b.jsx)(o.Button, {
                                                size: 'sm',
                                                variant: 'outline',
                                                onClick: () => C(a),
                                                children: (0, b.jsx)(k.Edit, {
                                                  className: 'h-3 w-3',
                                                }),
                                              }),
                                              (0, b.jsx)(o.Button, {
                                                size: 'sm',
                                                variant: 'outline',
                                                onClick: () =>
                                                  J(a.id, a.isActive ? 'deactivate' : 'activate'),
                                                disabled: H.isPending,
                                                children: a.isActive ? '비활성' : '활성',
                                              }),
                                              (0, b.jsx)(o.Button, {
                                                size: 'sm',
                                                variant: 'outline',
                                                onClick: () => J(a.id, 'delete'),
                                                disabled: H.isPending,
                                                className: 'text-red-600 hover:text-red-700',
                                                children: (0, b.jsx)(n.Trash2, {
                                                  className: 'h-3 w-3',
                                                }),
                                              }),
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
                        0 === K.length &&
                          (0, b.jsx)('div', {
                            className: 'text-muted-foreground p-8 text-center',
                            children: '등급이 없습니다. 새 등급을 생성해주세요.',
                          }),
                      ],
                    }),
                  ],
                }),
                z &&
                  (0, b.jsx)('div', {
                    className:
                      'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
                    children: (0, b.jsxs)('div', {
                      className:
                        'bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'border-border flex items-center justify-between border-b p-6',
                          children: [
                            (0, b.jsx)('h2', {
                              className: 'text-xl font-semibold',
                              children: '등급 상세 정보',
                            }),
                            (0, b.jsx)(o.Button, {
                              variant: 'outline',
                              size: 'sm',
                              onClick: () => A(null),
                              children: '닫기',
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-6 p-6',
                          children: [
                            (0, b.jsxs)('div', {
                              children: [
                                (0, b.jsx)('h3', {
                                  className: 'mb-3 font-semibold',
                                  children: '기본 정보',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'grid grid-cols-2 gap-4 text-sm',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '등급명:',
                                        }),
                                        (0, b.jsx)('p', { children: z.name }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '수수료율:',
                                        }),
                                        (0, b.jsxs)('p', {
                                          className: `font-bold ${M(z.commissionRate)}`,
                                          children: [z.commissionRate, '%'],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '상태:',
                                        }),
                                        (0, b.jsx)('p', {
                                          children: z.isActive ? '활성' : '비활성',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '적용 미용사:',
                                        }),
                                        (0, b.jsxs)('p', {
                                          className: 'font-medium',
                                          children: [z.groomerCount || 0, '명'],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '생성일:',
                                        }),
                                        (0, b.jsx)('p', { children: L(z.createdAt) }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '수정일:',
                                        }),
                                        (0, b.jsx)('p', { children: L(z.updatedAt) }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              children: [
                                (0, b.jsx)('h3', {
                                  className: 'mb-3 font-semibold',
                                  children: '설명',
                                }),
                                (0, b.jsx)('p', {
                                  className: 'bg-muted rounded p-3 text-sm',
                                  children: z.description,
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              children: [
                                (0, b.jsx)('h3', {
                                  className: 'mb-3 font-semibold',
                                  children: '할당 방식',
                                }),
                                (0, b.jsx)('div', {
                                  className: 'bg-muted/30 rounded border p-3',
                                  children: (0, b.jsx)('p', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '관리자가 미용사별로 수동 할당',
                                  }),
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              className: 'border-border flex gap-2 border-t pt-4',
                              children: [
                                (0, b.jsx)(o.Button, {
                                  onClick: () => C(z),
                                  children: '등급 수정',
                                }),
                                (0, b.jsx)(o.Button, {
                                  variant: 'outline',
                                  onClick: () => J(z.id, z.isActive ? 'deactivate' : 'activate'),
                                  disabled: H.isPending,
                                  children: z.isActive ? '비활성화' : '활성화',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                (D || B) &&
                  (0, b.jsx)('div', {
                    className:
                      'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
                    children: (0, b.jsxs)('div', {
                      className:
                        'bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'border-border flex items-center justify-between border-b p-6',
                          children: [
                            (0, b.jsx)('h2', {
                              className: 'text-xl font-semibold',
                              children: B ? '등급 수정' : '새 등급 생성',
                            }),
                            (0, b.jsx)(o.Button, {
                              variant: 'outline',
                              size: 'sm',
                              onClick: () => {
                                ;(C(null), E(!1))
                              },
                              children: '취소',
                            }),
                          ],
                        }),
                        (0, b.jsxs)('form', {
                          onSubmit: (a) => {
                            var b
                            a.preventDefault()
                            let c = new FormData(a.currentTarget)
                            ;((b = {
                              name: c.get('name'),
                              description: c.get('description'),
                              commissionRate: parseFloat(c.get('commissionRate')),
                              isActive: 'true' === c.get('isActive'),
                            }),
                              I.mutate({ gradeData: b, isEdit: !!B, gradeId: B?.id }))
                          },
                          className: 'space-y-6 p-6',
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'grid grid-cols-2 gap-4',
                              children: [
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsx)('label', {
                                      className: 'mb-2 block text-sm font-medium',
                                      children: '등급명',
                                    }),
                                    (0, b.jsx)('input', {
                                      name: 'name',
                                      type: 'text',
                                      defaultValue: B?.name || '',
                                      className:
                                        'border-input bg-background w-full rounded-md border px-3 py-2',
                                      required: !0,
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsx)('label', {
                                      className: 'mb-2 block text-sm font-medium',
                                      children: '수수료율 (%)',
                                    }),
                                    (0, b.jsx)('input', {
                                      name: 'commissionRate',
                                      type: 'number',
                                      step: '0.1',
                                      min: '0',
                                      max: '100',
                                      defaultValue: B?.commissionRate || '',
                                      className:
                                        'border-input bg-background w-full rounded-md border px-3 py-2',
                                      required: !0,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              children: [
                                (0, b.jsx)('label', {
                                  className: 'mb-2 block text-sm font-medium',
                                  children: '설명',
                                }),
                                (0, b.jsx)('textarea', {
                                  name: 'description',
                                  defaultValue: B?.description || '',
                                  rows: 3,
                                  className:
                                    'border-input bg-background w-full rounded-md border px-3 py-2',
                                  required: !0,
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              children: [
                                (0, b.jsx)('label', {
                                  className: 'mb-2 block text-sm font-medium',
                                  children: '상태',
                                }),
                                (0, b.jsxs)('select', {
                                  name: 'isActive',
                                  defaultValue: B?.isActive?.toString() || 'true',
                                  className:
                                    'border-input bg-background w-full rounded-md border px-3 py-2',
                                  children: [
                                    (0, b.jsx)('option', { value: 'true', children: '활성' }),
                                    (0, b.jsx)('option', { value: 'false', children: '비활성' }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              className: 'border-border flex gap-2 border-t pt-4',
                              children: [
                                (0, b.jsx)(o.Button, {
                                  type: 'submit',
                                  disabled: I.isPending,
                                  children: B ? '수정 완료' : '등급 생성',
                                }),
                                (0, b.jsx)(o.Button, {
                                  type: 'button',
                                  variant: 'outline',
                                  onClick: () => {
                                    ;(C(null), E(!1))
                                  },
                                  children: '취소',
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
    a.s(['default', () => s])
  },
]

//# sourceMappingURL=src_app_admin_dashboard_settlement_grades_page_tsx_dc341ad9._.js.map
