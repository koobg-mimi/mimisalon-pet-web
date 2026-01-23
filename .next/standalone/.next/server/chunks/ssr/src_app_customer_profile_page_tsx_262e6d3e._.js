module.exports = [
  142933,
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
      k = a.i(699570),
      l = a.i(205138),
      m = a.i(737984),
      n = a.i(510448),
      o = a.i(124987),
      p = a.i(915618),
      q = a.i(821374),
      r = a.i(781560),
      s = a.i(786304),
      t = a.i(486192)
    function u({
      addresses: a,
      onAdd: c,
      onEdit: d,
      onDelete: e,
      onSetDefault: f,
      isLoading: h = !1,
    }) {
      let [i, j] = (0, g.useState)(!1),
        [l, m] = (0, g.useState)(null)
      return h
        ? (0, b.jsx)('div', {
            className: 'space-y-4',
            children: [1, 2].map((a) =>
              (0, b.jsxs)(
                'div',
                {
                  className: 'border-border animate-pulse rounded-lg border p-4',
                  children: [
                    (0, b.jsx)('div', { className: 'bg-muted mb-2 h-4 w-3/4 rounded' }),
                    (0, b.jsx)('div', { className: 'bg-muted h-3 w-1/2 rounded' }),
                  ],
                },
                a
              )
            ),
          })
        : 0 === a.length
          ? (0, b.jsxs)('div', {
              className: 'border-border rounded-lg border-2 border-dashed p-8 text-center',
              children: [
                (0, b.jsx)(o.MapPin, { className: 'text-muted-foreground mx-auto mb-4 h-12 w-12' }),
                (0, b.jsx)('h3', {
                  className: 'mb-2 text-lg font-medium',
                  children: '주소가 없습니다',
                }),
                (0, b.jsx)('p', {
                  className: 'text-muted-foreground mb-4 text-sm',
                  children: '배송받을 주소를 등록해주세요',
                }),
                (0, b.jsxs)(k.Button, {
                  onClick: c,
                  children: [(0, b.jsx)(p.Plus, { className: 'mr-2 h-4 w-4' }), '주소 추가'],
                }),
              ],
            })
          : (0, b.jsxs)(b.Fragment, {
              children: [
                (0, b.jsxs)('div', {
                  className: 'space-y-4',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'text-lg font-medium',
                          children: '등록된 주소',
                        }),
                        (0, b.jsxs)(k.Button, {
                          onClick: c,
                          size: 'sm',
                          children: [
                            (0, b.jsx)(p.Plus, { className: 'mr-2 h-4 w-4' }),
                            '주소 추가',
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsx)('div', {
                      className: 'grid gap-4',
                      children: a.map((a) =>
                        (0, b.jsxs)(
                          'div',
                          {
                            className:
                              'border-border relative rounded-lg border p-4 transition-shadow hover:shadow-md',
                            children: [
                              a.isDefault &&
                                (0, b.jsxs)(s.Badge, {
                                  className: 'absolute top-4 right-4',
                                  variant: 'default',
                                  children: [
                                    (0, b.jsx)(q.Star, { className: 'mr-1 h-3 w-3 fill-current' }),
                                    '기본 주소',
                                  ],
                                }),
                              (0, b.jsxs)('div', {
                                className: 'space-y-2 pr-20',
                                children: [
                                  (0, b.jsxs)('div', {
                                    className: 'flex items-start gap-2',
                                    children: [
                                      (0, b.jsx)(o.MapPin, {
                                        className:
                                          'text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0',
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'space-y-1',
                                        children: [
                                          (0, b.jsx)('p', {
                                            className: 'text-sm font-medium',
                                            children: a.street,
                                          }),
                                          (0, b.jsxs)('p', {
                                            className: 'text-muted-foreground text-sm',
                                            children: [a.city, ' ', a.state],
                                          }),
                                          (0, b.jsxs)('p', {
                                            className: 'text-muted-foreground text-sm',
                                            children: ['우편번호: ', a.zipCode],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, b.jsxs)('div', {
                                    className: 'flex gap-2 pt-2',
                                    children: [
                                      !a.isDefault &&
                                        (0, b.jsx)(k.Button, {
                                          variant: 'outline',
                                          size: 'sm',
                                          onClick: () => f(a.id),
                                          children: '기본 주소로 설정',
                                        }),
                                      (0, b.jsxs)(k.Button, {
                                        variant: 'outline',
                                        size: 'sm',
                                        onClick: () => d(a),
                                        children: [
                                          (0, b.jsx)(n.Edit2, { className: 'mr-1 h-3 w-3' }),
                                          '수정',
                                        ],
                                      }),
                                      (0, b.jsxs)(k.Button, {
                                        variant: 'outline',
                                        size: 'sm',
                                        onClick: () => {
                                          ;(m(a.id), j(!0))
                                        },
                                        className: 'text-destructive hover:text-destructive',
                                        children: [
                                          (0, b.jsx)(r.Trash2, { className: 'mr-1 h-3 w-3' }),
                                          '삭제',
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          },
                          a.id
                        )
                      ),
                    }),
                  ],
                }),
                (0, b.jsx)(t.AlertDialog, {
                  open: i,
                  onOpenChange: j,
                  children: (0, b.jsxs)(t.AlertDialogContent, {
                    children: [
                      (0, b.jsxs)(t.AlertDialogHeader, {
                        children: [
                          (0, b.jsx)(t.AlertDialogTitle, { children: '주소 삭제' }),
                          (0, b.jsx)(t.AlertDialogDescription, {
                            children: '이 주소를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
                          }),
                        ],
                      }),
                      (0, b.jsxs)(t.AlertDialogFooter, {
                        children: [
                          (0, b.jsx)(t.AlertDialogCancel, {
                            onClick: () => m(null),
                            children: '취소',
                          }),
                          (0, b.jsx)(t.AlertDialogAction, {
                            onClick: () => {
                              ;(l && (e(l), m(null)), j(!1))
                            },
                            className:
                              'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                            children: '삭제',
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            })
    }
    var v = a.i(550537),
      v = v,
      w = a.i(315055),
      x = a.i(866718),
      y = a.i(870430),
      z = a.i(814574)
    let A = (0, g.lazy)(() => a.A(512553).then((a) => ({ default: a.DaumPostcodeEmbed })))
    function B({ isOpen: a, onClose: c, onSave: d, address: e, mode: f }) {
      let [h, i] = (0, g.useState)(!1),
        [j, m] = (0, g.useState)(!1),
        [n, o] = (0, g.useState)({}),
        [p, q] = (0, g.useState)({
          name: '',
          street: '',
          detailAddress: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: !1,
        })
      ;(0, g.useEffect)(() => {
        if (e && 'edit' === f) {
          let a = e.street.split(' '),
            b = a.slice(0, -1).join(' '),
            c = a[a.length - 1]
          q({
            name: '',
            street: b || e.street,
            detailAddress: c && c !== b ? c : '',
            city: e.city,
            state: e.state,
            zipCode: e.zipCode,
            isDefault: e.isDefault,
          })
        } else
          q({
            name: '',
            street: '',
            detailAddress: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: !1,
          })
        o({})
      }, [e, f, a])
      let r = (a) => {
          let { name: b, value: c } = a.target
          ;(q((a) => ({ ...a, [b]: c })), n[b] && o((a) => ({ ...a, [b]: '' })))
        },
        s = async () => {
          let a
          if (
            ((a = {}),
            p.street || (a.street = '주소는 필수입니다'),
            p.city || (a.city = '시/도는 필수입니다'),
            p.state || (a.state = '구/군은 필수입니다'),
            p.zipCode || (a.zipCode = '우편번호는 필수입니다'),
            o(a),
            0 === Object.keys(a).length)
          ) {
            m(!0)
            try {
              ;(await d(p), c())
            } catch (a) {
              console.error('Failed to save address:', a)
            } finally {
              m(!1)
            }
          }
        }
      return (0, b.jsxs)(b.Fragment, {
        children: [
          (0, b.jsx)(z.Dialog, {
            open: a,
            onOpenChange: c,
            children: (0, b.jsxs)(z.DialogContent, {
              className: 'sm:max-w-[500px]',
              children: [
                (0, b.jsx)(z.DialogHeader, {
                  children: (0, b.jsx)(z.DialogTitle, {
                    children: 'create' === f ? '새 주소 추가' : '주소 수정',
                  }),
                }),
                (0, b.jsxs)('div', {
                  className: 'space-y-4 py-4',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)(y.Label, { htmlFor: 'street', children: '주소' }),
                        (0, b.jsxs)('div', {
                          className: 'flex gap-2',
                          children: [
                            (0, b.jsx)(x.Input, {
                              id: 'street',
                              name: 'street',
                              value: p.street,
                              onChange: r,
                              placeholder: '도로명 주소',
                              className: n.street ? 'border-red-500' : '',
                              readOnly: !0,
                            }),
                            (0, b.jsx)(k.Button, {
                              type: 'button',
                              variant: 'outline',
                              onClick: () => i(!0),
                              children: (0, b.jsx)(v.default, { className: 'h-4 w-4' }),
                            }),
                          ],
                        }),
                        n.street &&
                          (0, b.jsx)('p', {
                            className: 'text-sm text-red-500',
                            children: n.street,
                          }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)(y.Label, { htmlFor: 'detailAddress', children: '상세 주소' }),
                        (0, b.jsx)(x.Input, {
                          id: 'detailAddress',
                          name: 'detailAddress',
                          value: p.detailAddress,
                          onChange: r,
                          placeholder: '동/호수 등 상세 주소 입력',
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'grid grid-cols-2 gap-4',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(y.Label, { htmlFor: 'city', children: '시/도' }),
                            (0, b.jsx)(x.Input, {
                              id: 'city',
                              name: 'city',
                              value: p.city,
                              onChange: r,
                              placeholder: '시/도',
                              className: n.city ? 'border-red-500' : '',
                              readOnly: !0,
                            }),
                            n.city &&
                              (0, b.jsx)('p', {
                                className: 'text-sm text-red-500',
                                children: n.city,
                              }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(y.Label, { htmlFor: 'state', children: '구/군' }),
                            (0, b.jsx)(x.Input, {
                              id: 'state',
                              name: 'state',
                              value: p.state,
                              onChange: r,
                              placeholder: '구/군',
                              className: n.state ? 'border-red-500' : '',
                              readOnly: !0,
                            }),
                            n.state &&
                              (0, b.jsx)('p', {
                                className: 'text-sm text-red-500',
                                children: n.state,
                              }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)(y.Label, { htmlFor: 'zipCode', children: '우편번호' }),
                        (0, b.jsx)(x.Input, {
                          id: 'zipCode',
                          name: 'zipCode',
                          value: p.zipCode,
                          onChange: r,
                          placeholder: '우편번호',
                          className: n.zipCode ? 'border-red-500' : '',
                          readOnly: !0,
                        }),
                        n.zipCode &&
                          (0, b.jsx)('p', {
                            className: 'text-sm text-red-500',
                            children: n.zipCode,
                          }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'flex items-center space-x-2',
                      children: [
                        (0, b.jsx)(w.Checkbox, {
                          id: 'isDefault',
                          checked: p.isDefault,
                          onCheckedChange: (a) => {
                            q((b) => ({ ...b, isDefault: a }))
                          },
                        }),
                        (0, b.jsx)(y.Label, {
                          htmlFor: 'isDefault',
                          className: 'text-sm font-normal',
                          children: '기본 배송지로 설정',
                        }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsxs)(z.DialogFooter, {
                  children: [
                    (0, b.jsx)(k.Button, {
                      variant: 'outline',
                      onClick: c,
                      disabled: j,
                      children: '취소',
                    }),
                    (0, b.jsx)(k.Button, {
                      onClick: s,
                      disabled: j,
                      children: j
                        ? (0, b.jsxs)(b.Fragment, {
                            children: [
                              (0, b.jsx)(l.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                              '저장 중...',
                            ],
                          })
                        : '저장',
                    }),
                  ],
                }),
              ],
            }),
          }),
          (0, b.jsx)(g.Suspense, {
            fallback: (0, b.jsx)(l.LoadingSpinner, {}),
            children:
              h &&
              (0, b.jsx)(A, {
                isOpen: h,
                onClose: () => i(!1),
                onComplete: (a) => {
                  ;(q((b) => ({
                    ...b,
                    city: a.sido,
                    state: a.district,
                    street: a.address,
                    zipCode: a.postalCode,
                  })),
                    i(!1))
                },
              }),
          }),
        ],
      })
    }
    var C = a.i(15594),
      D = a.i(238246),
      E = a.i(932489),
      F = a.i(391748),
      G = a.i(421234),
      H = a.i(405784)
    function I() {
      let { data: a, isPending: n } = (0, e.useSession)(),
        o = (0, f.useRouter)(),
        p = (0, j.useQueryClient)()
      ;(0, f.useSearchParams)()
      let [q, r] = (0, g.useState)(!1),
        [s, t] = (0, g.useState)({ name: '', phone: '' }),
        [v, w] = (0, g.useState)(!1),
        [x, y] = (0, g.useState)(),
        [z, A] = (0, g.useState)('create'),
        [I, J] = (0, g.useState)(!1),
        {
          addresses: K,
          isLoading: L,
          createAddress: M,
          updateAddress: N,
          deleteAddress: O,
          setDefaultAddress: P,
        } = (0, C.useAddresses)()
      ;(0, g.useEffect)(() => {
        ;(a || o.push('/auth/signin'),
          a?.user?.role && 'CUSTOMER' !== a.user.role && o.push('/dashboard'))
      }, [a, o])
      let {
        data: Q,
        isLoading: R,
        refetch: S,
      } = (0, i.useQuery)({
        queryKey: ['customer', 'profile'],
        queryFn: async () => {
          let a = await fetch('/api/customer/profile')
          if (!a.ok) throw Error('Failed to fetch profile')
          return a.json()
        },
        enabled: !!a?.user && 'CUSTOMER' === a.user.role,
      })
      ;(0, g.useEffect)(() => {
        Q && t({ name: Q.name || '', phone: Q.phone || '' })
      }, [Q])
      let T = (0, h.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch('/api/customer/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(a),
            })
            if (!b.ok) throw Error('Failed to update profile')
            return b.json()
          },
          onSuccess: () => {
            ;(p.invalidateQueries({ queryKey: ['customer', 'profile'] }), r(!1))
          },
        }),
        U = async () => {
          await T.mutateAsync(s)
        }
      return n || R
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(l.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'CUSTOMER' && Q
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsx)(m.PageHeader, {
                    title: '프로필 설정',
                    description: '개인정보와 계정 설정을 관리하세요',
                    children: (0, b.jsx)(k.Button, {
                      variant: 'outline',
                      asChild: !0,
                      children: (0, b.jsx)(D.default, {
                        href: '/customer/dashboard/overview',
                        children: '대시보드',
                      }),
                    }),
                  }),
                }),
                (0, b.jsx)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: (0, b.jsxs)('div', {
                    className: 'mx-auto max-w-2xl',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'border-border bg-card rounded-lg border',
                        children: [
                          (0, b.jsx)('div', {
                            className: 'border-border border-b p-6',
                            children: (0, b.jsxs)('div', {
                              className: 'flex items-center justify-between',
                              children: [
                                (0, b.jsx)('h2', {
                                  className: 'text-lg font-semibold',
                                  children: '기본 정보',
                                }),
                                q
                                  ? (0, b.jsxs)('div', {
                                      className: 'space-x-2',
                                      children: [
                                        (0, b.jsx)(k.Button, {
                                          variant: 'outline',
                                          onClick: () => {
                                            ;(Q && t({ name: Q.name || '', phone: Q.phone || '' }),
                                              r(!1))
                                          },
                                          disabled: T.isPending,
                                          children: '취소',
                                        }),
                                        (0, b.jsxs)(k.Button, {
                                          onClick: U,
                                          disabled: T.isPending,
                                          children: [
                                            T.isPending
                                              ? (0, b.jsx)(l.LoadingSpinner, {
                                                  size: 'sm',
                                                  className: 'mr-2',
                                                })
                                              : null,
                                            '저장',
                                          ],
                                        }),
                                      ],
                                    })
                                  : (0, b.jsx)(k.Button, {
                                      onClick: () => r(!0),
                                      children: '편집',
                                    }),
                              ],
                            }),
                          }),
                          (0, b.jsx)('div', {
                            className: 'space-y-6 p-6',
                            children: (0, b.jsxs)('div', {
                              className: 'grid grid-cols-1 gap-6 md:grid-cols-2',
                              children: [
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsx)('label', {
                                      className: 'text-foreground mb-2 block text-sm font-medium',
                                      children: '이름',
                                    }),
                                    q
                                      ? (0, b.jsx)('input', {
                                          type: 'text',
                                          name: 'name',
                                          value: s.name,
                                          onChange: (a) => {
                                            t({ ...s, [a.target.name]: a.target.value })
                                          },
                                          className:
                                            'border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                                          placeholder: '이름을 입력하세요',
                                        })
                                      : (0, b.jsx)('p', {
                                          className: 'text-foreground',
                                          children: Q.name,
                                        }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsx)('label', {
                                      className: 'text-foreground mb-2 block text-sm font-medium',
                                      children: '이메일',
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'text-foreground',
                                      children: Q.email,
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'text-muted-foreground mt-1 text-xs',
                                      children: '이메일은 변경할 수 없습니다',
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'md:col-span-2',
                                  children: [
                                    (0, b.jsx)('label', {
                                      className: 'text-foreground mb-2 block text-sm font-medium',
                                      children: '전화번호',
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'text-foreground mb-3',
                                      children: Q.phone || '등록되지 않음',
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'text-muted-foreground mb-3 text-xs',
                                      children: '전화번호 변경 및 인증은 아래에서 진행하세요',
                                    }),
                                    (0, b.jsx)(E.PhoneUpdateForm, { variant: 'inline' }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  children: [
                                    (0, b.jsx)('label', {
                                      className: 'text-foreground mb-2 block text-sm font-medium',
                                      children: '가입일',
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'text-foreground',
                                      children: (0, c.format)(new Date(Q.createdAt), 'yyyy-MM-dd', {
                                        locale: d.ko,
                                      }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, b.jsxs)('div', {
                        className: 'border-border bg-card mt-8 rounded-lg border',
                        children: [
                          (0, b.jsx)('div', {
                            className: 'border-border border-b p-6',
                            children: (0, b.jsx)('h2', {
                              className: 'text-lg font-semibold',
                              children: '주소 관리',
                            }),
                          }),
                          (0, b.jsx)('div', {
                            className: 'p-6',
                            children: (0, b.jsx)(u, {
                              addresses: K,
                              isLoading: L,
                              onAdd: () => {
                                ;(y(void 0), A('create'), w(!0))
                              },
                              onEdit: (a) => {
                                ;(y(a), A('edit'), w(!0))
                              },
                              onDelete: O,
                              onSetDefault: P,
                            }),
                          }),
                        ],
                      }),
                      (0, b.jsxs)('div', {
                        className: 'border-border bg-card mt-8 rounded-lg border',
                        children: [
                          (0, b.jsx)('div', {
                            className: 'border-border border-b p-6',
                            children: (0, b.jsx)('h2', {
                              className: 'text-lg font-semibold',
                              children: '계정 설정',
                            }),
                          }),
                          (0, b.jsxs)('div', {
                            className: 'space-y-4 p-6',
                            children: [
                              (0, b.jsxs)(G.Collapsible, {
                                open: I,
                                onOpenChange: J,
                                children: [
                                  (0, b.jsx)(G.CollapsibleTrigger, {
                                    className: 'w-full',
                                    children: (0, b.jsxs)('div', {
                                      className:
                                        'hover:bg-accent/50 -m-3 flex items-center justify-between rounded-lg p-3 transition-colors',
                                      children: [
                                        (0, b.jsxs)('div', {
                                          className: 'text-left',
                                          children: [
                                            (0, b.jsx)('h3', {
                                              className: 'font-medium',
                                              children: '비밀번호 변경',
                                            }),
                                            (0, b.jsx)('p', {
                                              className: 'text-muted-foreground text-sm',
                                              children:
                                                '계정 보안을 위해 정기적으로 비밀번호를 변경하세요',
                                            }),
                                          ],
                                        }),
                                        (0, b.jsx)(H.ChevronDown, {
                                          className: `text-muted-foreground h-5 w-5 transition-transform ${I ? 'rotate-180' : ''}`,
                                        }),
                                      ],
                                    }),
                                  }),
                                  (0, b.jsx)(G.CollapsibleContent, {
                                    className: 'pt-4',
                                    children: (0, b.jsx)(F.ChangePasswordForm, {
                                      onSuccess: () => {
                                        J(!1)
                                      },
                                    }),
                                  }),
                                ],
                              }),
                              (0, b.jsx)('div', {
                                className: 'border-border border-t pt-4',
                                children: (0, b.jsxs)('div', {
                                  className: 'flex items-center justify-between',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('h3', {
                                          className: 'font-medium',
                                          children: '알림 설정',
                                        }),
                                        (0, b.jsx)('p', {
                                          className: 'text-muted-foreground text-sm',
                                          children: '예약 알림 및 마케팅 수신 설정을 관리하세요',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsx)(k.Button, { variant: 'outline', children: '설정' }),
                                  ],
                                }),
                              }),
                              (0, b.jsx)('div', {
                                className: 'border-border border-t pt-4',
                                children: (0, b.jsxs)('div', {
                                  className: 'flex items-center justify-between',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('h3', {
                                          className: 'text-destructive font-medium',
                                          children: '계정 삭제',
                                        }),
                                        (0, b.jsx)('p', {
                                          className: 'text-muted-foreground text-sm',
                                          children:
                                            '계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsx)(k.Button, {
                                      variant: 'outline',
                                      className: 'text-destructive border-destructive',
                                      children: '계정 삭제',
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
                }),
                (0, b.jsx)(B, {
                  isOpen: v,
                  onClose: () => {
                    ;(w(!1), y(void 0))
                  },
                  onSave: async (a) => {
                    try {
                      if (!a.street) throw Error('Street address is required')
                      let b = {
                        name: a.name || '',
                        street: a.street,
                        detailAddress: a.detailAddress || '',
                        city: a.city || '',
                        state: a.state || '',
                        zipCode: a.zipCode || '',
                        isDefault: a.isDefault || !1,
                      }
                      ;('edit' === z && x ? await N(x.id, b) : await M(b), w(!1))
                    } catch (a) {
                      console.error('Failed to save address:', a)
                    }
                  },
                  address: x,
                  mode: z,
                }),
              ],
            })
          : null
    }
    a.s(['default', () => I], 142933)
  },
]

//# sourceMappingURL=src_app_customer_profile_page_tsx_262e6d3e._.js.map
