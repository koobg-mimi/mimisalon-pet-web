module.exports = [
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
  292e3,
  (a) => {
    'use strict'
    var b = a.i(895174)
    a.s(['AlertCircle', () => b.default])
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
  920140,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('paw-print', [
      ['circle', { cx: '11', cy: '4', r: '2', key: 'vol9p0' }],
      ['circle', { cx: '18', cy: '8', r: '2', key: '17gozi' }],
      ['circle', { cx: '20', cy: '16', r: '2', key: '1v9bxh' }],
      [
        'path',
        {
          d: 'M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z',
          key: '1ydw1z',
        },
      ],
    ])
    a.s(['PawPrint', () => b], 920140)
  },
  808406,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('sparkles', [
      [
        'path',
        {
          d: 'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z',
          key: '1s2grr',
        },
      ],
      ['path', { d: 'M20 2v4', key: '1rf3ol' }],
      ['path', { d: 'M22 4h-4', key: 'gwowj6' }],
      ['circle', { cx: '4', cy: '20', r: '2', key: '6kqj1y' }],
    ])
    a.s(['Sparkles', () => b], 808406)
  },
  124348,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(400187),
      d = a.i(368114)
    let e = (0, c.cva)(
      'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
      {
        variants: {
          variant: {
            default: 'bg-card text-card-foreground',
            destructive:
              'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
          },
        },
        defaultVariants: { variant: 'default' },
      }
    )
    function f({ className: a, variant: c, ...f }) {
      return (0, b.jsx)('div', {
        'data-slot': 'alert',
        role: 'alert',
        className: (0, d.cn)(e({ variant: c }), a),
        ...f,
      })
    }
    function g({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'alert-description',
        className: (0, d.cn)(
          'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
          a
        ),
        ...c,
      })
    }
    a.s(['Alert', () => f, 'AlertDescription', () => g])
  },
  943108,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('lock', [
      ['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2', key: '1w4ew1' }],
      ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4', key: 'fwvmzm' }],
    ])
    a.s(['Lock', () => b], 943108)
  },
  879566,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(50944),
      e = a.i(695245),
      f = a.i(159501),
      g = a.i(156757),
      h = a.i(699570),
      i = a.i(866718),
      j = a.i(205138),
      k = a.i(124348),
      l = a.i(591119),
      m = a.i(441921),
      n = a.i(292e3),
      o = a.i(816201),
      p = a.i(943108),
      q = a.i(920140),
      r = a.i(808406),
      s = a.i(823292),
      t = a.i(529139)
    let u = g.z
      .object({
        password: g.z
          .string()
          .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
          .regex(/[a-z]/, '비밀번호는 소문자를 포함해야 합니다')
          .regex(/[A-Z]/, '비밀번호는 대문자를 포함해야 합니다')
          .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다'),
        confirmPassword: g.z.string(),
      })
      .refine((a) => a.password === a.confirmPassword, {
        message: '비밀번호가 일치하지 않습니다',
        path: ['confirmPassword'],
      })
    function v() {
      let a = (0, d.useRouter)(),
        g = (0, d.useSearchParams)(),
        [v, w] = (0, c.useState)(null),
        [x, y] = (0, c.useState)(!1),
        [z, A] = (0, c.useState)(!1),
        [B, C] = (0, c.useState)(null),
        D = (0, e.useForm)({
          resolver: (0, f.zodResolver)(u),
          defaultValues: { password: '', confirmPassword: '' },
        })
      ;(0, c.useEffect)(() => {
        let a = g.get('token')
        'INVALID_TOKEN' === g.get('error')
          ? C('유효하지 않거나 만료된 링크입니다. 비밀번호 재설정을 다시 요청해주세요.')
          : a
            ? w(a)
            : C('유효한 재설정 링크가 아닙니다.')
      }, [g])
      let E = async (b) => {
        if (!v) return void s.toast.error('유효한 토큰이 없습니다')
        y(!0)
        try {
          let { data: c, error: d } = await t.authClient.resetPassword({
            newPassword: b.password,
            token: v,
          })
          if (d) {
            ;(console.error('Password reset error:', d),
              s.toast.error(d.message || '비밀번호 재설정에 실패했습니다'),
              y(!1))
            return
          }
          ;(A(!0),
            s.toast.success('비밀번호가 성공적으로 변경되었습니다'),
            setTimeout(() => {
              a.push('/auth/signin')
            }, 2e3))
        } catch (a) {
          ;(console.error('Password reset error:', a),
            s.toast.error('비밀번호 재설정 중 오류가 발생했습니다'),
            y(!1))
        }
      }
      return (0, b.jsx)('div', {
        className: 'bg-background flex min-h-screen items-center justify-center p-4',
        children: (0, b.jsxs)('div', {
          className: 'w-full max-w-md',
          children: [
            (0, b.jsxs)('div', {
              className: 'mb-8 text-center',
              children: [
                (0, b.jsxs)('div', {
                  className: 'mb-4 flex items-center justify-center space-x-2',
                  children: [
                    (0, b.jsx)(r.Sparkles, { className: 'text-primary h-8 w-8' }),
                    (0, b.jsx)(q.PawPrint, { className: 'text-primary h-8 w-8' }),
                  ],
                }),
                (0, b.jsx)('h1', {
                  className: 'text-primary text-2xl font-bold',
                  children: '미미살롱펫',
                }),
                (0, b.jsx)('p', {
                  className: 'text-muted-foreground',
                  children: '프리미엄 방문 반려동물 미용',
                }),
              ],
            }),
            (0, b.jsxs)(l.Card, {
              children: [
                (0, b.jsxs)(l.CardHeader, {
                  className: 'text-center',
                  children: [
                    (0, b.jsx)(l.CardTitle, { children: '비밀번호 재설정' }),
                    (0, b.jsx)(l.CardDescription, {
                      children: z
                        ? '비밀번호가 변경되었습니다'
                        : B
                          ? '오류가 발생했습니다'
                          : '새로운 비밀번호를 입력하세요',
                    }),
                  ],
                }),
                (0, b.jsxs)(l.CardContent, {
                  children: [
                    B &&
                      (0, b.jsxs)('div', {
                        className: 'space-y-6 text-center',
                        children: [
                          (0, b.jsx)('div', {
                            className:
                              'mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100',
                            children: (0, b.jsx)(n.AlertCircle, {
                              className: 'h-8 w-8 text-red-600',
                            }),
                          }),
                          (0, b.jsx)(k.Alert, {
                            variant: 'destructive',
                            children: (0, b.jsx)(k.AlertDescription, { children: B }),
                          }),
                          (0, b.jsx)(h.Button, {
                            onClick: () => a.push('/auth/forgot-password'),
                            className: 'w-full',
                            children: '비밀번호 재설정 다시 요청하기',
                          }),
                        ],
                      }),
                    z &&
                      (0, b.jsxs)('div', {
                        className: 'space-y-6 text-center',
                        children: [
                          (0, b.jsx)('div', {
                            className:
                              'mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100',
                            children: (0, b.jsx)(o.CheckCircle, {
                              className: 'h-8 w-8 text-green-600',
                            }),
                          }),
                          (0, b.jsxs)('div', {
                            className: 'space-y-2',
                            children: [
                              (0, b.jsx)('h3', {
                                className: 'text-lg font-semibold',
                                children: '비밀번호가 변경되었습니다',
                              }),
                              (0, b.jsx)('p', {
                                className: 'text-muted-foreground text-sm',
                                children: '잠시 후 로그인 페이지로 이동합니다',
                              }),
                            ],
                          }),
                          (0, b.jsx)(h.Button, {
                            onClick: () => a.push('/auth/signin'),
                            className: 'w-full',
                            children: '지금 로그인하기',
                          }),
                        ],
                      }),
                    !B &&
                      !z &&
                      v &&
                      (0, b.jsx)(m.Form, {
                        ...D,
                        children: (0, b.jsxs)('form', {
                          onSubmit: D.handleSubmit(E),
                          className: 'space-y-6',
                          children: [
                            (0, b.jsx)(m.FormField, {
                              control: D.control,
                              name: 'password',
                              render: ({ field: a }) =>
                                (0, b.jsxs)(m.FormItem, {
                                  children: [
                                    (0, b.jsx)(m.FormLabel, { children: '새 비밀번호' }),
                                    (0, b.jsx)(m.FormControl, {
                                      children: (0, b.jsxs)('div', {
                                        className: 'relative',
                                        children: [
                                          (0, b.jsx)(p.Lock, {
                                            className:
                                              'text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2',
                                          }),
                                          (0, b.jsx)(i.Input, {
                                            type: 'password',
                                            placeholder: '최소 8자 이상',
                                            className: 'pl-10',
                                            disabled: x,
                                            ...a,
                                          }),
                                        ],
                                      }),
                                    }),
                                    (0, b.jsx)(m.FormDescription, {
                                      children: '대문자, 소문자, 숫자를 모두 포함해야 합니다',
                                    }),
                                    (0, b.jsx)(m.FormMessage, {}),
                                  ],
                                }),
                            }),
                            (0, b.jsx)(m.FormField, {
                              control: D.control,
                              name: 'confirmPassword',
                              render: ({ field: a }) =>
                                (0, b.jsxs)(m.FormItem, {
                                  children: [
                                    (0, b.jsx)(m.FormLabel, { children: '비밀번호 확인' }),
                                    (0, b.jsx)(m.FormControl, {
                                      children: (0, b.jsxs)('div', {
                                        className: 'relative',
                                        children: [
                                          (0, b.jsx)(p.Lock, {
                                            className:
                                              'text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2',
                                          }),
                                          (0, b.jsx)(i.Input, {
                                            type: 'password',
                                            placeholder: '비밀번호를 다시 입력하세요',
                                            className: 'pl-10',
                                            disabled: x,
                                            ...a,
                                          }),
                                        ],
                                      }),
                                    }),
                                    (0, b.jsx)(m.FormMessage, {}),
                                  ],
                                }),
                            }),
                            (0, b.jsxs)(h.Button, {
                              type: 'submit',
                              className: 'w-full',
                              disabled: x,
                              children: [
                                x &&
                                  (0, b.jsx)(j.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                                '비밀번호 변경',
                              ],
                            }),
                          ],
                        }),
                      }),
                    !z &&
                      (0, b.jsx)('div', {
                        className: 'mt-6 text-center',
                        children: (0, b.jsxs)('p', {
                          className: 'text-muted-foreground text-sm',
                          children: [
                            '비밀번호가 기억나셨나요?',
                            ' ',
                            (0, b.jsx)('a', {
                              href: '/auth/signin',
                              className: 'text-primary hover:underline',
                              children: '로그인',
                            }),
                          ],
                        }),
                      }),
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    }
    a.s(['default', () => v])
  },
]

//# sourceMappingURL=_a96576d7._.js.map
