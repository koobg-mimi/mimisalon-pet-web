module.exports = [
  653717,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(256711),
      d = a.i(302491),
      e = a.i(529139),
      f = a.i(50944),
      g = a.i(572131),
      h = a.i(433217),
      i = a.i(370025),
      j = a.i(937927),
      k = a.i(790166)
    let l = (0, a.i(170106).default)('calculator', [
      ['rect', { width: '16', height: '20', x: '4', y: '2', rx: '2', key: '1nb95v' }],
      ['line', { x1: '8', x2: '16', y1: '6', y2: '6', key: 'x4nwl0' }],
      ['line', { x1: '16', x2: '16', y1: '14', y2: '18', key: 'wjye3r' }],
      ['path', { d: 'M16 10h.01', key: '1m94wz' }],
      ['path', { d: 'M12 10h.01', key: '1nrarc' }],
      ['path', { d: 'M8 10h.01', key: '19clt8' }],
      ['path', { d: 'M12 14h.01', key: '1etili' }],
      ['path', { d: 'M8 14h.01', key: '6423bh' }],
      ['path', { d: 'M12 18h.01', key: 'mhygvu' }],
      ['path', { d: 'M8 18h.01', key: 'lrp35t' }],
    ])
    var m = a.i(699570),
      n = a.i(205138),
      o = a.i(206015),
      p = a.i(281643),
      q = a.i(352254),
      r = a.i(382122),
      s = a.i(368114)
    function t({ className: a, ...c }) {
      return (0, b.jsx)('nav', {
        role: 'navigation',
        'aria-label': 'pagination',
        'data-slot': 'pagination',
        className: (0, s.cn)('mx-auto flex w-full justify-center', a),
        ...c,
      })
    }
    function u({ className: a, ...c }) {
      return (0, b.jsx)('ul', {
        'data-slot': 'pagination-content',
        className: (0, s.cn)('flex flex-row items-center gap-1', a),
        ...c,
      })
    }
    function v({ ...a }) {
      return (0, b.jsx)('li', { 'data-slot': 'pagination-item', ...a })
    }
    function w({ className: a, isActive: c, size: d = 'icon', ...e }) {
      return (0, b.jsx)('a', {
        'aria-current': c ? 'page' : void 0,
        'data-slot': 'pagination-link',
        'data-active': c,
        className: (0, s.cn)(
          (0, m.buttonVariants)({ variant: c ? 'outline' : 'ghost', size: d }),
          'min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]',
          c && 'border-2 font-bold',
          a
        ),
        ...e,
      })
    }
    function x({ className: a, ...c }) {
      return (0, b.jsxs)(w, {
        'aria-label': 'Go to previous page',
        size: 'default',
        className: (0, s.cn)('gap-1 px-3 py-2 font-medium', 'min-h-[44px] sm:min-h-[40px]', a),
        ...c,
        children: [
          (0, b.jsx)(p.ChevronLeftIcon, { className: 'h-5 w-5 sm:h-4 sm:w-4' }),
          (0, b.jsx)('span', { className: 'hidden sm:block', children: 'Previous' }),
        ],
      })
    }
    function y({ className: a, ...c }) {
      return (0, b.jsxs)(w, {
        'aria-label': 'Go to next page',
        size: 'default',
        className: (0, s.cn)('gap-1 px-3 py-2 font-medium', 'min-h-[44px] sm:min-h-[40px]', a),
        ...c,
        children: [
          (0, b.jsx)('span', { className: 'hidden sm:block', children: 'Next' }),
          (0, b.jsx)(q.ChevronRightIcon, { className: 'h-5 w-5 sm:h-4 sm:w-4' }),
        ],
      })
    }
    function z({ className: a, ...c }) {
      return (0, b.jsxs)('span', {
        'aria-hidden': !0,
        'data-slot': 'pagination-ellipsis',
        className: (0, s.cn)(
          'flex items-center justify-center',
          'h-[44px] w-[44px] sm:h-9 sm:w-9',
          a
        ),
        ...c,
        children: [
          (0, b.jsx)(r.MoreHorizontalIcon, { className: 'h-5 w-5 sm:h-4 sm:w-4' }),
          (0, b.jsx)('span', { className: 'sr-only', children: 'More pages' }),
        ],
      })
    }
    var A = a.i(238246)
    function B() {
      let { data: a, isPending: p } = (0, e.useSession)(),
        q = (0, f.useRouter)(),
        r = (0, j.useQueryClient)(),
        [s, B] = (0, g.useState)(1),
        [C, D] = (0, g.useState)(''),
        [E, F] = (0, g.useState)('ALL'),
        [G, H] = (0, g.useState)(''),
        [I, J] = (0, g.useState)(null),
        [K, L] = (0, g.useState)(new Set())
      ;(0, g.useEffect)(() => {
        ;(a || q.push('/auth/signin'),
          a?.user?.role && 'ADMIN' !== a.user.role && q.push('/admin/dashboard/overview'))
      }, [a, q])
      let {
          data: M,
          isLoading: N,
          error: O,
        } = (0, h.useQuery)({
          queryKey: ['settlements', s, C, E, G],
          queryFn: async () => {
            let a = new URLSearchParams({
                page: s.toString(),
                limit: '20',
                search: C,
                status: E,
                period: G,
              }),
              b = await fetch(`/api/admin/settlements?${a}`)
            if (!b.ok) throw Error('Failed to fetch settlements')
            return b.json()
          },
          enabled: a?.user?.role === 'ADMIN',
        }),
        P = M?.settlements ?? [],
        Q = M?.totalPages ?? 1,
        R = M?.totalCount ?? 0
      M?.summary
      let S = (0, i.useMutation)({
          mutationFn: async (a) => {
            let b = a.map((a) => fetch(`/api/admin/settlements/${a}/pay`, { method: 'PATCH' }))
            return (await Promise.all(b)).filter((a) => a.ok).length
          },
          onSuccess: (a, b) => {
            ;(alert(`✅ ${a}건의 정산이 지급 처리되었습니다.`),
              r.invalidateQueries({ queryKey: ['settlements'] }),
              L(new Set()))
          },
          onError: (a) => {
            ;(console.error('Failed to process bulk payment:', a),
              alert('❌ 지급 처리 중 오류가 발생했습니다.'))
          },
        }),
        T = (0, i.useMutation)({
          mutationFn: async ({ settlementId: a, action: b }) => {
            let c = await fetch(`/api/admin/settlements/${a}/${b}`, { method: 'PATCH' })
            if (!c.ok) throw Error(`Failed to ${b} settlement`)
            return c.json()
          },
          onSuccess: () => {
            ;(r.invalidateQueries({ queryKey: ['settlements'] }), J(null))
          },
          onError: (a) => {
            ;(console.error('Settlement action failed:', a), alert(`❌ ${a.message}`))
          },
        }),
        U = (0, i.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch('/api/admin/settlements/create-weekly', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weekOffset: a }),
              }),
              c = await b.json()
            if (!b.ok) throw Error(c.error || '정산 생성 중 오류가 발생했습니다.')
            return c
          },
          onSuccess: (a) => {
            ;(alert(`✅ ${a.message}

📊 정산 요약:
- 총 미용사: ${a.summary.totalGroomers}명
- 생성된 정산: ${a.summary.totalCreated}건
- 총 정산액: ${a.summary.totalAmount.toLocaleString('ko-KR')}원
${a.summary.failed > 0 ? `- 실패: ${a.summary.failed}건` : ''}`),
              r.invalidateQueries({ queryKey: ['settlements'] }))
          },
          onError: (a, b, c) => {
            alert(`❌ ${a.message}`)
          },
        }),
        V = (a) => (0, c.format)(new Date(a), 'yyyy-MM-dd', { locale: d.ko }),
        W = (a) => {
          if (a.includes('W')) {
            let [b, c] = a.split('-W')
            return `${b}년 ${c}주차`
          }
          let [b, c] = a.split('-')
          return `${b}년 ${c}월`
        }
      return p || N
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(n.LoadingSpinner, { size: 'lg' }),
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
                                (0, b.jsx)(l, { className: 'text-primary h-6 w-6' }),
                                (0, b.jsx)('h1', {
                                  className: 'text-foreground text-3xl font-bold',
                                  children: '정산 관리',
                                }),
                              ],
                            }),
                            (0, b.jsx)('p', {
                              className: 'text-muted-foreground',
                              children: '수익과 미용사 정산을 관리하세요',
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            (0, b.jsxs)(m.Button, {
                              onClick: () => {
                                confirm(
                                  '지난주 정산을 생성하시겠습니까?\n완료된 예약을 기준으로 미용사 수수료가 계산됩니다.'
                                ) && U.mutate(1)
                              },
                              disabled: U.isPending,
                              children: [
                                (0, b.jsx)(l, { className: 'mr-2 h-4 w-4' }),
                                '주간 정산 생성',
                              ],
                            }),
                            (0, b.jsx)(m.Button, {
                              asChild: !0,
                              variant: 'outline',
                              children: (0, b.jsx)(A.default, {
                                href: '/admin/dashboard/settlement/grades',
                                children: '등급 설정',
                              }),
                            }),
                            (0, b.jsxs)('span', {
                              className: 'text-muted-foreground text-sm',
                              children: ['총 ', R.toLocaleString('ko-KR'), '건'],
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
                    K.size > 0 &&
                      (0, b.jsxs)('div', {
                        className:
                          'border-border bg-primary/5 mb-4 flex items-center justify-between rounded-lg border p-4',
                        children: [
                          (0, b.jsx)('div', {
                            className: 'flex items-center gap-4',
                            children: (0, b.jsxs)('span', {
                              className: 'text-sm font-medium',
                              children: [K.size, '건 선택됨'],
                            }),
                          }),
                          (0, b.jsxs)(m.Button, {
                            onClick: () => {
                              0 === K.size
                                ? alert('지급할 정산을 선택해주세요.')
                                : confirm(`선택된 ${K.size}건의 정산을 지급 처리하시겠습니까?`) &&
                                  S.mutate(Array.from(K))
                            },
                            disabled: S.isPending,
                            children: [
                              (0, b.jsx)(k.DollarSign, { className: 'mr-2 h-4 w-4' }),
                              '지급처리완료',
                            ],
                          }),
                        ],
                      }),
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
                                  placeholder: '미용사명, 이메일로 검색...',
                                  value: C,
                                  onChange: (a) => D(a.target.value),
                                  className:
                                    'border-input bg-background focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none',
                                }),
                              }),
                              (0, b.jsxs)('div', {
                                className: 'flex gap-2',
                                children: [
                                  (0, b.jsxs)('select', {
                                    value: E,
                                    onChange: (a) => F(a.target.value),
                                    className:
                                      'border-input bg-background rounded-md border px-3 py-2 text-sm',
                                    children: [
                                      (0, b.jsx)('option', { value: 'ALL', children: '모든 상태' }),
                                      (0, b.jsx)('option', {
                                        value: 'PENDING',
                                        children: '대기중',
                                      }),
                                      (0, b.jsx)('option', {
                                        value: 'CALCULATED',
                                        children: '계산됨',
                                      }),
                                      (0, b.jsx)('option', { value: 'PAID', children: '지급완료' }),
                                      (0, b.jsx)('option', { value: 'FAILED', children: '실패' }),
                                      (0, b.jsx)('option', {
                                        value: 'CANCELLED',
                                        children: '취소',
                                      }),
                                    ],
                                  }),
                                  (0, b.jsx)('input', {
                                    type: 'month',
                                    value: G,
                                    onChange: (a) => H(a.target.value),
                                    className:
                                      'border-input bg-background rounded-md border px-3 py-2 text-sm',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                        (0, b.jsxs)(o.Table, {
                          children: [
                            (0, b.jsx)(o.TableHeader, {
                              children: (0, b.jsxs)(o.TableRow, {
                                children: [
                                  (0, b.jsx)(o.TableHead, {
                                    className: 'w-12',
                                    children: (0, b.jsx)('input', {
                                      type: 'checkbox',
                                      checked: P.length > 0 && K.size === P.length,
                                      onChange: () => {
                                        K.size === P.length
                                          ? L(new Set())
                                          : L(new Set(P.map((a) => a.id)))
                                      },
                                      className: 'h-4 w-4 rounded border-gray-300',
                                    }),
                                  }),
                                  (0, b.jsx)(o.TableHead, { children: '정산 기간' }),
                                  (0, b.jsx)(o.TableHead, { children: '미용사' }),
                                  (0, b.jsx)(o.TableHead, { children: '계좌정보' }),
                                  (0, b.jsx)(o.TableHead, {
                                    className: 'text-right',
                                    children: '수수료',
                                  }),
                                  (0, b.jsx)(o.TableHead, {
                                    className: 'text-right',
                                    children: '정산금액',
                                  }),
                                  (0, b.jsx)(o.TableHead, {
                                    className: 'text-center',
                                    children: '서비스 건수',
                                  }),
                                ],
                              }),
                            }),
                            (0, b.jsx)(o.TableBody, {
                              children: P.map((a) =>
                                (0, b.jsxs)(
                                  o.TableRow,
                                  {
                                    children: [
                                      (0, b.jsx)(o.TableCell, {
                                        children: (0, b.jsx)('input', {
                                          type: 'checkbox',
                                          checked: K.has(a.id),
                                          onChange: () => {
                                            var b
                                            let c
                                            return (
                                              (b = a.id),
                                              void ((c = new Set(K)).has(b)
                                                ? c.delete(b)
                                                : c.add(b),
                                              L(c))
                                            )
                                          },
                                          className: 'h-4 w-4 rounded border-gray-300',
                                        }),
                                      }),
                                      (0, b.jsx)(o.TableCell, {
                                        children: (0, b.jsx)('span', {
                                          className: 'text-sm font-medium',
                                          children: W(a.period),
                                        }),
                                      }),
                                      (0, b.jsx)(o.TableCell, {
                                        children: (0, b.jsx)('p', {
                                          className: 'font-medium',
                                          children: a.groomer?.name || '알 수 없음',
                                        }),
                                      }),
                                      (0, b.jsx)(o.TableCell, {
                                        children: (0, b.jsx)('div', {
                                          className: 'text-sm',
                                          children:
                                            a.groomer?.bankName && a.groomer?.bankAccountNumber
                                              ? (0, b.jsxs)(b.Fragment, {
                                                  children: [
                                                    (0, b.jsx)('p', {
                                                      className: 'font-medium',
                                                      children: a.groomer.bankName,
                                                    }),
                                                    (0, b.jsx)('p', {
                                                      className: 'text-muted-foreground',
                                                      children: a.groomer.bankAccountNumber,
                                                    }),
                                                  ],
                                                })
                                              : (0, b.jsx)('p', {
                                                  className: 'text-muted-foreground',
                                                  children: '계좌 미등록',
                                                }),
                                        }),
                                      }),
                                      (0, b.jsx)(o.TableCell, {
                                        className: 'text-right',
                                        children: (0, b.jsxs)('div', {
                                          className: 'text-sm',
                                          children: [
                                            (0, b.jsxs)('p', {
                                              className: 'text-muted-foreground',
                                              children: [a.groomer?.commissionRate || 0, '%'],
                                            }),
                                            (0, b.jsxs)('p', {
                                              className: 'font-medium text-red-600',
                                              children: [
                                                a.commission.toLocaleString('ko-KR'),
                                                '원',
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                      (0, b.jsx)(o.TableCell, {
                                        className: 'text-right',
                                        children: (0, b.jsxs)('p', {
                                          className: 'text-primary font-bold',
                                          children: [a.netAmount.toLocaleString('ko-KR'), '원'],
                                        }),
                                      }),
                                      (0, b.jsx)(o.TableCell, {
                                        className: 'text-center',
                                        children: (0, b.jsxs)('span', {
                                          className: 'text-sm font-medium',
                                          children: [a.totalBookings, '건'],
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
                        Q > 1 &&
                          (0, b.jsx)('div', {
                            className: 'border-border border-t p-6',
                            children: (0, b.jsx)(t, {
                              children: (0, b.jsxs)(u, {
                                children: [
                                  (0, b.jsx)(v, {
                                    children: (0, b.jsx)(x, {
                                      href: '#',
                                      onClick: (a) => {
                                        ;(a.preventDefault(), B(Math.max(1, s - 1)))
                                      },
                                      className: 1 === s ? 'pointer-events-none opacity-50' : '',
                                    }),
                                  }),
                                  Array.from({ length: Q }, (a, b) => b + 1).map((a) =>
                                    1 === a || a === Q || (a >= s - 1 && a <= s + 1)
                                      ? (0, b.jsx)(
                                          v,
                                          {
                                            children: (0, b.jsx)(w, {
                                              href: '#',
                                              isActive: a === s,
                                              onClick: (b) => {
                                                ;(b.preventDefault(), B(a))
                                              },
                                              children: a,
                                            }),
                                          },
                                          a
                                        )
                                      : a === s - 2 || a === s + 2
                                        ? (0, b.jsx)(v, { children: (0, b.jsx)(z, {}) }, a)
                                        : null
                                  ),
                                  (0, b.jsx)(v, {
                                    children: (0, b.jsx)(y, {
                                      href: '#',
                                      onClick: (a) => {
                                        ;(a.preventDefault(), B(Math.min(Q, s + 1)))
                                      },
                                      className: s === Q ? 'pointer-events-none opacity-50' : '',
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                      ],
                    }),
                  ],
                }),
                I &&
                  (0, b.jsx)('div', {
                    className:
                      'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
                    children: (0, b.jsxs)('div', {
                      className:
                        'bg-card border-border max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'border-border flex items-center justify-between border-b p-6',
                          children: [
                            (0, b.jsx)('h2', {
                              className: 'text-xl font-semibold',
                              children: '정산 상세 정보',
                            }),
                            (0, b.jsx)(m.Button, {
                              variant: 'outline',
                              size: 'sm',
                              onClick: () => J(null),
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
                                          children: '미용사:',
                                        }),
                                        (0, b.jsx)('p', {
                                          children: I.groomer?.name || '알 수 없음',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '이메일:',
                                        }),
                                        (0, b.jsx)('p', {
                                          children: I.groomer?.email || '알 수 없음',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '정산 기간:',
                                        }),
                                        (0, b.jsx)('p', { children: W(I.period) }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '상태:',
                                        }),
                                        (0, b.jsx)('p', {
                                          children: (0, b.jsx)('span', {
                                            className: `rounded-full px-2 py-1 text-xs ${((a) => {
                                              switch (a) {
                                                case 'PENDING':
                                                  return 'bg-yellow-100 text-yellow-700'
                                                case 'CALCULATED':
                                                  return 'bg-blue-100 text-blue-700'
                                                case 'PAID':
                                                  return 'bg-green-100 text-green-700'
                                                case 'FAILED':
                                                  return 'bg-red-100 text-red-700'
                                                case 'CANCELLED':
                                                  return 'bg-gray-100 text-gray-700'
                                              }
                                            })(I.status)}`,
                                            children: ((a) => {
                                              switch (a) {
                                                case 'PENDING':
                                                  return '대기중'
                                                case 'CALCULATED':
                                                  return '계산됨'
                                                case 'PAID':
                                                  return '지급완료'
                                                case 'FAILED':
                                                  return '실패'
                                                case 'CANCELLED':
                                                  return '취소'
                                              }
                                            })(I.status),
                                          }),
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
                                  className: 'mb-3 font-semibold',
                                  children: '계좌 정보',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'grid grid-cols-2 gap-4 text-sm',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '은행:',
                                        }),
                                        (0, b.jsx)('p', {
                                          children: I.groomer?.bankName || '미등록',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '계좌번호:',
                                        }),
                                        (0, b.jsx)('p', {
                                          children: I.groomer?.bankAccountNumber || '미등록',
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '예금주:',
                                        }),
                                        (0, b.jsx)('p', {
                                          children: I.groomer?.bankAccountHolderName || '미등록',
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
                                  className: 'mb-3 font-semibold',
                                  children: '정산 내역',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'grid grid-cols-2 gap-4 text-sm',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '총 예약:',
                                        }),
                                        (0, b.jsxs)('p', {
                                          className: 'font-medium',
                                          children: [I.totalBookings, '건'],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '총 매출:',
                                        }),
                                        (0, b.jsxs)('p', {
                                          className: 'font-medium',
                                          children: [I.totalRevenue.toLocaleString('ko-KR'), '원'],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '수수료율:',
                                        }),
                                        (0, b.jsxs)('p', {
                                          className: 'font-medium',
                                          children: [I.groomer?.commissionRate || 0, '%'],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '수수료:',
                                        }),
                                        (0, b.jsxs)('p', {
                                          className: 'font-medium text-red-600',
                                          children: [I.commission.toLocaleString('ko-KR'), '원'],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      children: [
                                        (0, b.jsx)('span', {
                                          className: 'text-muted-foreground',
                                          children: '최종 정산액:',
                                        }),
                                        (0, b.jsxs)('p', {
                                          className: 'text-primary text-lg font-bold',
                                          children: [I.netAmount.toLocaleString('ko-KR'), '원'],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            I.bookings &&
                              I.bookings.length > 0 &&
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('h3', {
                                    className: 'mb-3 font-semibold',
                                    children: '포함된 예약',
                                  }),
                                  (0, b.jsx)('div', {
                                    className: 'max-h-60 overflow-y-auto',
                                    children: (0, b.jsxs)('table', {
                                      className: 'w-full text-sm',
                                      children: [
                                        (0, b.jsx)('thead', {
                                          children: (0, b.jsxs)('tr', {
                                            className: 'border-border border-b',
                                            children: [
                                              (0, b.jsx)('th', {
                                                className: 'p-2 text-left',
                                                children: '예약코드',
                                              }),
                                              (0, b.jsx)('th', {
                                                className: 'p-2 text-left',
                                                children: '서비스',
                                              }),
                                              (0, b.jsx)('th', {
                                                className: 'p-2 text-left',
                                                children: '완료일',
                                              }),
                                              (0, b.jsx)('th', {
                                                className: 'p-2 text-right',
                                                children: '금액',
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, b.jsx)('tbody', {
                                          children: I.bookings.map((a) =>
                                            (0, b.jsxs)(
                                              'tr',
                                              {
                                                className: 'border-border border-b',
                                                children: [
                                                  (0, b.jsxs)('td', {
                                                    className: 'p-2',
                                                    children: ['#', a.bookingCode],
                                                  }),
                                                  (0, b.jsx)('td', {
                                                    className: 'p-2',
                                                    children: a.service?.name || '알 수 없음',
                                                  }),
                                                  (0, b.jsx)('td', {
                                                    className: 'p-2',
                                                    children: V(a.completedAt),
                                                  }),
                                                  (0, b.jsxs)('td', {
                                                    className: 'p-2 text-right font-medium',
                                                    children: [
                                                      a.totalAmount.toLocaleString('ko-KR'),
                                                      '원',
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
                                  }),
                                ],
                              }),
                            (0, b.jsxs)('div', {
                              children: [
                                (0, b.jsx)('h3', {
                                  className: 'mb-3 font-semibold',
                                  children: '처리 이력',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'space-y-2 text-sm',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      className: 'flex justify-between',
                                      children: [
                                        (0, b.jsx)('span', { children: '생성일:' }),
                                        (0, b.jsx)('span', { children: V(I.createdAt) }),
                                      ],
                                    }),
                                    I.calculatedAt &&
                                      (0, b.jsxs)('div', {
                                        className: 'flex justify-between',
                                        children: [
                                          (0, b.jsx)('span', { children: '계산일:' }),
                                          (0, b.jsx)('span', { children: V(I.calculatedAt) }),
                                        ],
                                      }),
                                    I.paidAt &&
                                      (0, b.jsxs)('div', {
                                        className: 'flex justify-between',
                                        children: [
                                          (0, b.jsx)('span', { children: '지급일:' }),
                                          (0, b.jsx)('span', { children: V(I.paidAt) }),
                                        ],
                                      }),
                                    (0, b.jsxs)('div', {
                                      className: 'flex justify-between',
                                      children: [
                                        (0, b.jsx)('span', { children: '최종 수정:' }),
                                        (0, b.jsx)('span', { children: V(I.updatedAt) }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              className: 'border-border flex gap-2 border-t pt-4',
                              children: [
                                'PENDING' === I.status &&
                                  (0, b.jsx)(m.Button, {
                                    onClick: () =>
                                      T.mutate({ settlementId: I.id, action: 'calculate' }),
                                    disabled: T.isPending,
                                    children: '정산 계산',
                                  }),
                                'CALCULATED' === I.status &&
                                  (0, b.jsx)(m.Button, {
                                    onClick: () => T.mutate({ settlementId: I.id, action: 'pay' }),
                                    disabled: T.isPending,
                                    children: '정산 지급',
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
    a.s(['default', () => B], 653717)
  },
]

//# sourceMappingURL=src_app_admin_dashboard_settlement_management_page_tsx_723a8765._.js.map
