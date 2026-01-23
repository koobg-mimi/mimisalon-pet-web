module.exports = [
  159045,
  (a) => {
    'use strict'
    let b, c
    var d = a.i(187924),
      e = a.i(529139),
      f = a.i(50944),
      g = a.i(572131),
      h = a.i(238246),
      i = a.i(699570),
      j = a.i(205138),
      k = a.i(637441),
      l = a.i(659136)
    function m({ date: a, addressId: b, currentPage: c = 1, enabled: d = !0 } = {}) {
      let { data: e = [], isLoading: f, error: g } = (0, l.useGetPetsQuery)(void 0, { skip: !d }),
        {
          data: h = [],
          isLoading: i,
          error: j,
        } = (0, l.useGetAddressesQuery)(void 0, { skip: !d }),
        {
          data: k,
          isLoading: n,
          error: o,
          refetch: p,
        } = (0, l.useGetAvailabilityQuery)(
          { date: a, addressId: b, page: c, limit: 6 },
          { skip: !d || !a || !b, pollingInterval: 5e3 }
        ),
        q = k?.timeSlots || [],
        r = k?.groomers || [],
        s = k?.pagination
      return {
        pets: e,
        savedAddresses: h,
        timeSlots: q,
        groomers: r,
        groomerPagination: s,
        filteringInfo: k?.filteringInfo,
        isPetsLoading: f,
        isAddressesLoading: i,
        isLoadingGroomers: n,
        isInitialLoading: f || i,
        petsError: g,
        addressesError: j,
        availabilityError: o,
        hasError: !!g || !!j || !!o,
        refetchAvailability: p,
      }
    }
    var n = a.i(256711),
      o = a.i(302491),
      p = a.i(666680),
      q = a.i(214174)
    let r = q.useDispatch.withTypes(),
      s = q.useSelector.withTypes()
    q.useStore.withTypes()
    var t = a.i(570215)
    function u(a, b) {
      switch (a) {
        case 1:
          return b.petServices.length > 0 && b.petServices.every((a) => a.services.length > 0)
        case 2:
          return !!b.addressId
        case 3:
          return !!b.date && !!b.timeSlot && !!b.groomerId
        default:
          return !0
      }
    }
    function v(a, b, c) {
      switch (a) {
        case 1:
          if (0 === b.petServices.length) return '반려동물을 선택해주세요.'
          let d = b.petServices.filter((a) => 0 === a.services.length)
          if (d.length > 0) {
            let a = d
              .map((a) => {
                let b = c.find((b) => b.id === a.petId)
                return b?.name || '선택된 반려동물'
              })
              .join(', ')
            return `${a}의 서비스를 선택해주세요.`
          }
          return ''
        case 2:
          if (!b.addressId) return '주소를 선택해주세요.'
          return ''
        case 3:
          if (!b.date) return '날짜를 선택해주세요.'
          if (!b.groomerId) return '미용사를 선택해주세요.'
          if (!b.timeSlot) return '시간을 선택해주세요.'
          return ''
        default:
          return ''
      }
    }
    function w(a, b) {
      return a.petServices.reduce((a, c) => {
        let d = b.find((a) => a.id === c.petId)
        return (
          a +
          c.services.reduce((a, b) => a + (d?.type, d?.weight, d?.breedId, b.price), 0) +
          c.options.reduce((a, b) => a + b.price, 0)
        )
      }, 0)
    }
    var x = a.i(591119),
      y = a.i(814574),
      z = a.i(941675),
      A = a.i(713513),
      B = a.i(384273),
      C = a.i(533441),
      D = a.i(559565),
      E = a.i(976472),
      F = a.i(786304),
      G = a.i(571987)
    function H({ pet: a, isSelected: b, hasServices: c, needsService: e = !1, onToggleSelect: f }) {
      let g = ((a, b) => {
          if (a) {
            let c
            if ('string' == typeof a) {
              if (isNaN((c = new Date(a)).getTime())) return b
            } else c = a
            let d = new Date(),
              e = d.getFullYear() - c.getFullYear(),
              f = d.getMonth() - c.getMonth()
            return f < 0 || (0 === f && d.getDate() < c.getDate()) ? e - 1 : e
          }
          return b
        })(a.birthDate, a.age),
        h = a.images?.find((a) => a.isPrimary) || a.images?.[0]
      return (0, d.jsxs)(x.Card, {
        className: `relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg ${e ? 'border-2 border-red-500 bg-red-50/50 shadow-lg' : b ? 'border-2 border-green-500 bg-green-50/50 shadow-lg' : 'border-border hover:border-primary/50'}`,
        onClick: () => f(a),
        children: [
          e
            ? (0, d.jsx)('div', {
                className:
                  'absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500',
                children: (0, d.jsx)('svg', {
                  className: 'h-4 w-4 text-white',
                  fill: 'none',
                  stroke: 'currentColor',
                  viewBox: '0 0 24 24',
                  children: (0, d.jsx)('path', {
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: 2,
                    d: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                  }),
                }),
              })
            : b
              ? (0, d.jsx)('div', {
                  className:
                    'absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-green-500',
                  children: (0, d.jsx)(C.Check, { className: 'h-4 w-4 text-white' }),
                })
              : null,
          (0, d.jsxs)('div', {
            className: 'bg-muted relative h-40',
            children: [
              h
                ? (0, d.jsx)(G.default, {
                    src: h.url,
                    alt: a.name,
                    fill: !0,
                    className: 'object-cover',
                    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
                  })
                : (0, d.jsx)('div', {
                    className: 'flex h-full items-center justify-center',
                    children: (0, d.jsxs)('div', {
                      className: 'text-center',
                      children: [
                        'DOG' === a.type
                          ? (0, d.jsx)(D.Dog, {
                              className: 'text-muted-foreground/50 mx-auto h-12 w-12',
                            })
                          : (0, d.jsx)(B.Cat, {
                              className: 'text-muted-foreground/50 mx-auto h-12 w-12',
                            }),
                        (0, d.jsx)('p', {
                          className: 'text-muted-foreground mt-2 text-xs',
                          children: '사진 없음',
                        }),
                      ],
                    }),
                  }),
              a.images &&
                a.images.length > 0 &&
                (0, d.jsxs)('div', {
                  className:
                    'absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white',
                  children: [(0, d.jsx)(A.Camera, { className: 'h-3 w-3' }), a.images.length],
                }),
              (0, d.jsx)('div', {
                className: 'absolute top-2 right-2',
                children: ((a) => {
                  switch (a) {
                    case 'UP_TO_DATE':
                      return (0, d.jsx)(F.Badge, {
                        className: 'bg-green-500',
                        children: '접종 완료',
                      })
                    case 'OVERDUE':
                      return (0, d.jsx)(F.Badge, { variant: 'destructive', children: '접종 지연' })
                    case 'PARTIAL':
                      return (0, d.jsx)(F.Badge, { variant: 'secondary', children: '부분 접종' })
                    default:
                      return (0, d.jsx)(F.Badge, { variant: 'outline', children: '미확인' })
                  }
                })(a.vaccinationStatus),
              }),
            ],
          }),
          (0, d.jsx)(x.CardHeader, {
            className: 'pb-3',
            children: (0, d.jsxs)('div', {
              className: 'flex items-start justify-between',
              children: [
                (0, d.jsxs)('div', {
                  className: 'flex items-center gap-3',
                  children: [
                    (0, d.jsx)('div', {
                      className: `flex h-10 w-10 items-center justify-center rounded-full ${e ? 'bg-red-100' : b ? 'bg-green-100' : 'bg-primary/10'}`,
                      children:
                        'DOG' === a.type
                          ? (0, d.jsx)(D.Dog, {
                              className: `h-5 w-5 ${e ? 'text-red-600' : b ? 'text-green-600' : 'text-primary'}`,
                            })
                          : (0, d.jsx)(B.Cat, {
                              className: `h-5 w-5 ${e ? 'text-red-600' : b ? 'text-green-600' : 'text-primary'}`,
                            }),
                    }),
                    (0, d.jsxs)('div', {
                      className: 'min-w-0 flex-1',
                      children: [
                        (0, d.jsx)('h3', {
                          className: 'truncate text-lg font-semibold',
                          children: a.name,
                        }),
                        (0, d.jsx)('p', {
                          className: 'text-muted-foreground truncate text-sm',
                          children: a.breed?.name || ('DOG' === a.type ? '믹스견' : '믹스묘'),
                        }),
                      ],
                    }),
                  ],
                }),
                e
                  ? (0, d.jsx)('div', {
                      className: 'rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600',
                      children: '서비스 필요',
                    })
                  : c
                    ? (0, d.jsx)('div', {
                        className:
                          'rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-600',
                        children: '서비스 선택됨',
                      })
                    : null,
              ],
            }),
          }),
          (0, d.jsxs)(x.CardContent, {
            className: 'space-y-3 pt-0',
            children: [
              (0, d.jsxs)('div', {
                className: 'grid grid-cols-2 gap-3 text-sm',
                children: [
                  'DOG' === a.type &&
                    a.breed?.name &&
                    (0, d.jsxs)('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        (0, d.jsx)(E.Heart, { className: 'text-muted-foreground h-4 w-4' }),
                        (0, d.jsx)('span', { children: a.breed.name }),
                      ],
                    }),
                  'CAT' === a.type &&
                    a.hairType &&
                    (0, d.jsxs)('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        (0, d.jsx)(E.Heart, { className: 'text-muted-foreground h-4 w-4' }),
                        (0, d.jsx)('span', {
                          children: ((a) => {
                            switch (a) {
                              case 'SHORT_HAIR':
                                return '단모'
                              case 'LONG_HAIR':
                                return '장모'
                              default:
                                return null
                            }
                          })(a.hairType),
                        }),
                      ],
                    }),
                  a.gender &&
                    'UNKNOWN' !== a.gender &&
                    (0, d.jsxs)('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        (0, d.jsx)('span', {
                          className: 'text-muted-foreground',
                          children: '성별:',
                        }),
                        (0, d.jsx)('span', { children: 'MALE' === a.gender ? '남자' : '여자' }),
                      ],
                    }),
                  null != g &&
                    (0, d.jsxs)('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        (0, d.jsx)(z.Calendar, { className: 'text-muted-foreground h-4 w-4' }),
                        (0, d.jsxs)('span', { children: [g, '살'] }),
                      ],
                    }),
                  a.weight &&
                    (0, d.jsxs)('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        (0, d.jsx)('span', {
                          className: 'text-muted-foreground',
                          children: '체중:',
                        }),
                        (0, d.jsxs)('span', { children: [a.weight, 'kg'] }),
                      ],
                    }),
                ],
              }),
              a.specialNeeds &&
                (0, d.jsxs)('div', {
                  className: 'rounded-lg border border-blue-200 bg-blue-50 p-3',
                  children: [
                    (0, d.jsx)('p', {
                      className: 'mb-1 text-xs font-medium text-blue-800',
                      children: '특이사항',
                    }),
                    (0, d.jsx)('p', {
                      className: 'line-clamp-2 text-xs break-words text-blue-700',
                      children: a.specialNeeds,
                    }),
                  ],
                }),
            ],
          }),
        ],
      })
    }
    var I = a.i(315055),
      J = a.i(505084),
      K = a.i(821374),
      L = a.i(790166),
      M = a.i(797063),
      N = a.i(785259)
    function O({
      pet: a,
      availableServices: b,
      selectedServices: c,
      onServiceChange: e,
      onClose: f,
    }) {
      let [h, j] = (0, g.useState)(c),
        k = [...(a.type, b)].sort((a, b) =>
          a.isRecommended && !b.isRecommended
            ? -1
            : !a.isRecommended && b.isRecommended
              ? 1
              : a.isPopular && !b.isPopular
                ? -1
                : !a.isPopular && b.isPopular
                  ? 1
                  : a.bookingCount !== b.bookingCount
                    ? b.bookingCount - a.bookingCount
                    : a.name.localeCompare(b.name, 'ko')
        ),
        l = (a, b) => {
          b ? j((b) => [...b, a]) : j((b) => b.filter((b) => b.id !== a.id))
        },
        m = ({ service: b }) => {
          let c = h.some((a) => a.id === b.id),
            e = (a.type, a.weight, a.breedId, b.price)
          return (0, d.jsx)(x.Card, {
            className: `cursor-pointer transition-all hover:shadow-md ${c ? 'border-primary bg-primary/5' : 'border-border'}`,
            onClick: () => l(b, !c),
            children: (0, d.jsx)(x.CardContent, {
              children: (0, d.jsxs)('div', {
                className: 'flex items-start gap-3',
                children: [
                  (0, d.jsx)(I.Checkbox, {
                    checked: c,
                    onCheckedChange: (a) => l(b, !!a),
                    className: 'mt-1',
                  }),
                  (0, d.jsxs)('div', {
                    className: 'min-w-0 flex-1',
                    children: [
                      (0, d.jsxs)('div', {
                        className: 'mb-2',
                        children: [
                          (0, d.jsxs)('div', {
                            className: 'mb-1 flex items-center gap-2',
                            children: [
                              (0, d.jsx)('span', { className: 'text-lg', children: b.icon }),
                              (0, d.jsx)('h4', {
                                className: 'min-w-0 flex-1 font-medium',
                                children: b.name,
                              }),
                            ],
                          }),
                          (b.isPopular || b.isRecommended) &&
                            (0, d.jsxs)('div', {
                              className: 'flex flex-wrap items-center gap-1',
                              children: [
                                b.isPopular &&
                                  (0, d.jsxs)(F.Badge, {
                                    variant: 'secondary',
                                    className: 'text-xs',
                                    children: [
                                      (0, d.jsx)(K.Star, { className: 'mr-1 h-3 w-3' }),
                                      '인기',
                                    ],
                                  }),
                                b.isRecommended &&
                                  (0, d.jsx)(F.Badge, { className: 'text-xs', children: '추천' }),
                              ],
                            }),
                        ],
                      }),
                      (0, d.jsx)('p', {
                        className: 'text-muted-foreground mb-3 line-clamp-2 text-sm',
                        children: b.description,
                      }),
                      (0, d.jsxs)('div', {
                        className: 'flex items-center justify-between',
                        children: [
                          (0, d.jsx)('div', {
                            className: 'flex items-center gap-3 text-sm',
                            children: (0, d.jsxs)('div', {
                              className: 'flex items-center gap-1',
                              children: [
                                (0, d.jsx)(L.DollarSign, {
                                  className: 'text-muted-foreground h-4 w-4',
                                }),
                                (0, d.jsxs)('span', {
                                  className: 'font-medium',
                                  children: [e.toLocaleString(), '원'],
                                }),
                              ],
                            }),
                          }),
                          (0, d.jsx)(N.TooltipProvider, {
                            children: (0, d.jsxs)(N.Tooltip, {
                              children: [
                                (0, d.jsx)(N.TooltipTrigger, {
                                  asChild: !0,
                                  children: (0, d.jsx)(i.Button, {
                                    variant: 'ghost',
                                    size: 'sm',
                                    className: 'h-6 w-6 p-0',
                                    children: (0, d.jsx)(M.Info, { className: 'h-3 w-3' }),
                                  }),
                                }),
                                (0, d.jsx)(N.TooltipContent, {
                                  children: (0, d.jsx)('p', {
                                    className: 'max-w-xs',
                                    children: b.description,
                                  }),
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
          })
        }
      return (0, d.jsxs)('div', {
        className: 'space-y-6',
        children: [
          (0, d.jsxs)('div', {
            className: 'flex items-center justify-between',
            children: [
              (0, d.jsxs)('div', {
                children: [
                  (0, d.jsxs)('h2', {
                    className: 'text-xl font-semibold',
                    children: [a.name, '의 서비스 선택'],
                  }),
                  (0, d.jsx)('p', {
                    className: 'text-muted-foreground text-sm',
                    children: '원하는 서비스를 선택해주세요. 여러 개 선택 가능합니다.',
                  }),
                ],
              }),
              (0, d.jsx)(i.Button, { variant: 'outline', onClick: f, children: '취소' }),
            ],
          }),
          (0, d.jsx)('div', {
            className: 'space-y-3',
            children:
              k.length > 0
                ? (0, d.jsx)('div', {
                    className: 'grid grid-cols-1 gap-3',
                    children: k.map((a) => (0, d.jsx)(m, { service: a }, a.id)),
                  })
                : (0, d.jsx)('div', {
                    className: 'py-8 text-center',
                    children: (0, d.jsx)('p', {
                      className: 'text-muted-foreground',
                      children: '선택 가능한 서비스가 없습니다.',
                    }),
                  }),
          }),
          h.length > 0 &&
            (0, d.jsxs)(x.Card, {
              className: 'border-primary bg-primary/5',
              children: [
                (0, d.jsx)(x.CardHeader, {
                  children: (0, d.jsx)(x.CardTitle, { children: '선택된 서비스 요약' }),
                }),
                (0, d.jsx)(x.CardContent, {
                  children: (0, d.jsxs)('div', {
                    className: 'space-y-3',
                    children: [
                      (0, d.jsxs)('div', {
                        className: 'grid grid-cols-2 gap-4 text-center',
                        children: [
                          (0, d.jsxs)('div', {
                            children: [
                              (0, d.jsx)('div', {
                                className: 'text-primary text-lg font-bold',
                                children: h.length,
                              }),
                              (0, d.jsx)('div', {
                                className: 'text-muted-foreground text-sm',
                                children: '서비스',
                              }),
                            ],
                          }),
                          (0, d.jsxs)('div', {
                            children: [
                              (0, d.jsxs)('div', {
                                className: 'text-primary text-lg font-bold',
                                children: [
                                  h
                                    .reduce((b, c) => b + (a.type, a.weight, a.breedId, c.price), 0)
                                    .toLocaleString(),
                                  '원',
                                ],
                              }),
                              (0, d.jsx)('div', {
                                className: 'text-muted-foreground text-sm',
                                children: '예상 금액',
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, d.jsx)(J.Separator, {}),
                      (0, d.jsx)('div', {
                        className: 'space-y-2',
                        children: h.map((b) =>
                          (0, d.jsxs)(
                            'div',
                            {
                              className: 'flex items-center justify-between text-sm',
                              children: [
                                (0, d.jsxs)('span', { children: [b.icon, ' ', b.name] }),
                                (0, d.jsxs)('span', {
                                  className: 'font-medium',
                                  children: [
                                    (a.type, a.weight, a.breedId, b.price).toLocaleString(),
                                    '원',
                                  ],
                                }),
                              ],
                            },
                            b.id
                          )
                        ),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          (0, d.jsxs)('div', {
            className: 'flex gap-3',
            children: [
              (0, d.jsx)(i.Button, {
                onClick: () => {
                  ;(e(h), f())
                },
                className: 'flex-1',
                disabled: 0 === h.length,
                children:
                  h.length > 0
                    ? `${h.length}개 서비스 선택 완료`
                    : '최소 1개 서비스를 선택해주세요',
              }),
              (0, d.jsx)(i.Button, { variant: 'outline', onClick: f, children: '취소' }),
            ],
          }),
        ],
      })
    }
    var P = a.i(870430),
      Q = a.i(292e3),
      R = a.i(433217)
    function S({ petId: a, petName: b, selectedOptions: c, onOptionsChange: e, disabled: f = !1 }) {
      let {
          data: g = [],
          isLoading: h,
          isError: i,
          error: k,
        } = (0, R.useQuery)({
          queryKey: ['customer', 'service-options', a],
          queryFn: async () => {
            let b = await fetch(`/api/customer/service-options?petId=${a}`)
            if (!b.ok) throw Error('옵션을 불러오는데 실패했습니다')
            return b.json()
          },
          enabled: !!a,
        }),
        l = (a, b) => {
          b ? e([...c, a]) : e(c.filter((b) => b.id !== a.id))
        }
      if (h)
        return (0, d.jsxs)(x.Card, {
          children: [
            (0, d.jsxs)(x.CardHeader, {
              children: [
                (0, d.jsxs)(x.CardTitle, { className: 'text-lg', children: [b, ' - 추가 옵션'] }),
                (0, d.jsx)(x.CardDescription, {
                  children: '반려동물 상태에 따른 추가 옵션을 선택해주세요',
                }),
              ],
            }),
            (0, d.jsx)(x.CardContent, {
              className: 'flex justify-center py-8',
              children: (0, d.jsx)(j.LoadingSpinner, {}),
            }),
          ],
        })
      if (i)
        return (0, d.jsxs)(x.Card, {
          children: [
            (0, d.jsx)(x.CardHeader, {
              children: (0, d.jsxs)(x.CardTitle, {
                className: 'text-lg',
                children: [b, ' - 추가 옵션'],
              }),
            }),
            (0, d.jsx)(x.CardContent, {
              children: (0, d.jsxs)('div', {
                className: 'text-destructive flex items-center gap-2',
                children: [
                  (0, d.jsx)(Q.AlertCircle, { className: 'h-5 w-5' }),
                  (0, d.jsx)('p', {
                    className: 'text-sm',
                    children: k instanceof Error ? k.message : '옵션을 불러오는데 실패했습니다',
                  }),
                ],
              }),
            }),
          ],
        })
      if (0 === g.length) return null
      let m = c.reduce((a, b) => a + b.price, 0)
      return (0, d.jsxs)(x.Card, {
        children: [
          (0, d.jsxs)(x.CardHeader, {
            children: [
              (0, d.jsxs)(x.CardTitle, { className: 'text-lg', children: [b, ' - 추가 옵션'] }),
              (0, d.jsx)(x.CardDescription, {
                children: '반려동물 상태에 따른 추가 옵션을 선택해주세요 (선택사항)',
              }),
            ],
          }),
          (0, d.jsxs)(x.CardContent, {
            className: 'space-y-4',
            children: [
              (0, d.jsx)('div', {
                className: 'grid gap-3',
                children: g.map((a) => {
                  let b,
                    e = ((b = a.id), c.some((a) => a.id === b))
                  return (0, d.jsxs)(
                    'div',
                    {
                      className: `flex items-start space-x-3 rounded-lg border p-4 transition-colors ${e ? 'border-primary bg-primary/5' : 'border-gray-200'} ${f ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}`,
                      onClick: () => !f && l(a, !e),
                      children: [
                        (0, d.jsx)(I.Checkbox, {
                          id: `option-${a.id}`,
                          checked: e,
                          onCheckedChange: (b) => l(a, b),
                          disabled: f,
                          className: 'mt-1',
                        }),
                        (0, d.jsxs)('div', {
                          className: 'flex-1 space-y-1',
                          children: [
                            (0, d.jsx)(P.Label, {
                              htmlFor: `option-${a.id}`,
                              className: `font-medium ${f ? 'cursor-not-allowed' : 'cursor-pointer'}`,
                              children: a.name,
                            }),
                            a.description &&
                              (0, d.jsx)('p', {
                                className: 'text-muted-foreground text-sm',
                                children: a.description,
                              }),
                            (0, d.jsxs)('p', {
                              className: 'text-primary text-sm font-semibold',
                              children: ['+', a.price.toLocaleString(), '원'],
                            }),
                          ],
                        }),
                      ],
                    },
                    a.id
                  )
                }),
              }),
              c.length > 0 &&
                (0, d.jsxs)('div', {
                  className: 'mt-4 rounded-lg bg-gray-50 p-4',
                  children: [
                    (0, d.jsxs)('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        (0, d.jsx)('span', {
                          className: 'text-sm font-medium',
                          children: '선택한 옵션 합계',
                        }),
                        (0, d.jsxs)('span', {
                          className: 'text-primary text-lg font-bold',
                          children: ['+', m.toLocaleString(), '원'],
                        }),
                      ],
                    }),
                    (0, d.jsx)('div', {
                      className: 'text-muted-foreground mt-2 text-xs',
                      children: c.map((a) => a.name).join(', '),
                    }),
                  ],
                }),
            ],
          }),
        ],
      })
    }
    function T({ pets: a }) {
      let b = r(),
        c = s((a) => a.booking.formData),
        [e, f] = (0, g.useState)(!1),
        [h, k] = (0, g.useState)(null),
        {
          data: l = [],
          isLoading: m,
          isError: n,
          error: o,
        } = (0, R.useQuery)({
          queryKey: ['customer', 'services', h?.id],
          queryFn: async () => {
            if (!h?.id) throw Error('Pet not selected')
            let a = await fetch(`/api/customer/services?petId=${h.id}`)
            if (!a.ok) throw Error('Failed to fetch services')
            return a.json()
          },
          enabled: !!h,
        }),
        p = (a) => {
          ;(k(a), f(!0))
        }
      return (0, d.jsxs)('div', {
        className: 'space-y-8',
        children: [
          (0, d.jsx)('div', {
            className: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
            children: a.map((a) => {
              let e = c.petServices.find((b) => b.petId === a.id)?.services || [],
                f = c.petServices.some((b) => b.petId === a.id),
                g = e.length > 0,
                h = f && !g
              return (0, d.jsx)(
                H,
                {
                  pet: a,
                  isSelected: f,
                  hasServices: g,
                  needsService: h,
                  onToggleSelect: (a) => b((0, t.togglePet)(a)),
                },
                a.id
              )
            }),
          }),
          c.petServices.length > 0 &&
            (0, d.jsxs)('div', {
              className: 'mt-8 space-y-4',
              children: [
                (0, d.jsx)('h3', {
                  className: 'text-lg font-semibold',
                  children: '선택된 반려동물 서비스',
                }),
                c.petServices.map((c) => {
                  let e = a.find((a) => a.id === c.petId)
                  return e
                    ? (0, d.jsxs)(
                        x.Card,
                        {
                          className: 'p-4',
                          children: [
                            (0, d.jsxs)('div', {
                              className: 'mb-3 flex items-center justify-between',
                              children: [
                                (0, d.jsxs)('h4', {
                                  className: 'font-medium',
                                  children: [e.name, '의 서비스'],
                                }),
                                (0, d.jsxs)('div', {
                                  className: 'flex items-center gap-3',
                                  children: [
                                    (0, d.jsxs)('div', {
                                      className: 'text-muted-foreground text-sm',
                                      children: [c.services.length, '개 서비스 선택됨'],
                                    }),
                                    (0, d.jsx)(i.Button, {
                                      variant: 'outline',
                                      size: 'sm',
                                      onClick: () => p(e),
                                      children: '서비스 편집',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, d.jsxs)('div', {
                              className: 'space-y-4',
                              children: [
                                c.services.length > 0
                                  ? (0, d.jsx)('div', {
                                      className: 'space-y-2',
                                      children: c.services.map((a, b) =>
                                        (0, d.jsxs)(
                                          'div',
                                          {
                                            className:
                                              'bg-muted flex items-center justify-between rounded-lg p-3',
                                            children: [
                                              (0, d.jsxs)('div', {
                                                children: [
                                                  (0, d.jsxs)('div', {
                                                    className: 'flex items-center gap-2',
                                                    children: [
                                                      (0, d.jsx)('span', {
                                                        className: 'text-lg',
                                                        children: a.icon,
                                                      }),
                                                      (0, d.jsx)('span', {
                                                        className: 'font-medium',
                                                        children: a.name,
                                                      }),
                                                    ],
                                                  }),
                                                  (0, d.jsx)('p', {
                                                    className: 'text-muted-foreground text-sm',
                                                    children: a.description,
                                                  }),
                                                ],
                                              }),
                                              (0, d.jsx)('div', {
                                                className: 'text-right',
                                                children: (0, d.jsxs)('div', {
                                                  className: 'font-medium',
                                                  children: [
                                                    (e.type,
                                                    e.weight,
                                                    e.breedId,
                                                    a.price).toLocaleString(),
                                                    '원',
                                                  ],
                                                }),
                                              }),
                                            ],
                                          },
                                          b
                                        )
                                      ),
                                    })
                                  : (0, d.jsxs)('div', {
                                      className:
                                        'rounded-lg border-2 border-dashed border-red-200 bg-red-50 py-6 text-center',
                                      children: [
                                        (0, d.jsxs)('div', {
                                          className: 'mb-3 flex items-center justify-center',
                                          children: [
                                            (0, d.jsx)('svg', {
                                              className: 'mr-2 h-6 w-6 text-red-500',
                                              fill: 'none',
                                              stroke: 'currentColor',
                                              viewBox: '0 0 24 24',
                                              children: (0, d.jsx)('path', {
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                                strokeWidth: 2,
                                                d: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                              }),
                                            }),
                                            (0, d.jsx)('p', {
                                              className: 'font-medium text-red-700',
                                              children: '서비스를 선택해주세요',
                                            }),
                                          ],
                                        }),
                                        (0, d.jsx)('p', {
                                          className: 'mb-4 text-sm text-red-600',
                                          children:
                                            '예약을 계속하려면 최소 1개 이상의 서비스를 선택해야 합니다',
                                        }),
                                        (0, d.jsx)(i.Button, {
                                          variant: 'outline',
                                          className: 'border-red-300 text-red-700 hover:bg-red-100',
                                          onClick: () => p(e),
                                          children: '서비스 선택하기',
                                        }),
                                      ],
                                    }),
                                c.services.length > 0 &&
                                  (0, d.jsx)(S, {
                                    petId: e.id,
                                    petName: e.name,
                                    selectedOptions: c.options,
                                    onOptionsChange: (a) =>
                                      b((0, t.updateOptions)({ petId: e.id, options: a })),
                                  }),
                              ],
                            }),
                          ],
                        },
                        c.petId
                      )
                    : null
                }),
              ],
            }),
          c.petServices.length > 0 &&
            (0, d.jsxs)(x.Card, {
              className: 'border-primary bg-primary/5',
              children: [
                (0, d.jsx)(x.CardHeader, {
                  children: (0, d.jsx)(x.CardTitle, { children: '선택 요약' }),
                }),
                (0, d.jsx)(x.CardContent, {
                  children: (0, d.jsxs)('div', {
                    className: 'grid grid-cols-1 gap-4 text-center md:grid-cols-3',
                    children: [
                      (0, d.jsxs)('div', {
                        children: [
                          (0, d.jsx)('div', {
                            className: 'text-primary text-2xl font-bold',
                            children: c.petServices.length,
                          }),
                          (0, d.jsx)('div', {
                            className: 'text-muted-foreground text-sm',
                            children: '반려동물',
                          }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        children: [
                          (0, d.jsx)('div', {
                            className: 'text-primary text-2xl font-bold',
                            children: c.petServices.reduce((a, b) => a + b.services.length, 0),
                          }),
                          (0, d.jsx)('div', {
                            className: 'text-muted-foreground text-sm',
                            children: '서비스',
                          }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        children: [
                          (0, d.jsxs)('div', {
                            className: 'text-primary text-2xl font-bold',
                            children: [w(c, a).toLocaleString(), '원'],
                          }),
                          (0, d.jsx)('div', {
                            className: 'text-muted-foreground text-sm',
                            children: '총 예상 금액',
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          (0, d.jsx)(y.Dialog, {
            open: e,
            onOpenChange: f,
            children: (0, d.jsxs)(y.DialogContent, {
              className: 'max-h-[90vh] max-w-4xl overflow-y-auto',
              children: [
                (0, d.jsx)(y.DialogHeader, {
                  children: (0, d.jsx)(y.DialogTitle, { children: '서비스 선택' }),
                }),
                h &&
                  (0, d.jsxs)(d.Fragment, {
                    children: [
                      n &&
                        (0, d.jsx)('div', {
                          className: 'rounded-lg border border-red-200 bg-red-50 p-4',
                          children: (0, d.jsxs)('div', {
                            className: 'flex items-center',
                            children: [
                              (0, d.jsx)('svg', {
                                className: 'mr-2 h-5 w-5 flex-shrink-0 text-red-500',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24',
                                children: (0, d.jsx)('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: 2,
                                  d: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                }),
                              }),
                              (0, d.jsxs)('p', {
                                className: 'text-sm font-medium text-red-700',
                                children: [
                                  '서비스 목록을 불러오는데 실패했습니다.',
                                  ' ',
                                  o instanceof Error ? o.message : '',
                                ],
                              }),
                            ],
                          }),
                        }),
                      m
                        ? (0, d.jsxs)('div', {
                            className: 'flex items-center justify-center py-8',
                            children: [
                              (0, d.jsx)(j.LoadingSpinner, { size: 'lg' }),
                              (0, d.jsx)('p', {
                                className: 'text-muted-foreground ml-3',
                                children: '서비스를 불러오는 중...',
                              }),
                            ],
                          })
                        : (0, d.jsx)(O, {
                            pet: h,
                            availableServices: l,
                            selectedServices:
                              c.petServices.find((a) => a.petId === h.id)?.services || [],
                            onServiceChange: (a) => {
                              ;(b((0, t.updateServices)({ petId: h.id, services: a })), f(!1))
                            },
                            onClose: () => f(!1),
                          }),
                    ],
                  }),
              ],
            }),
          }),
        ],
      })
    }
    function U({ savedAddresses: a }) {
      let b = r(),
        c = s((a) => a.booking.formData.addressId),
        e = a.find((a) => a.id === c)
      return (0, d.jsxs)('div', {
        className: 'space-y-8',
        children: [
          (0, d.jsx)(x.Card, {
            className: 'p-6',
            children: (0, d.jsxs)('div', {
              className: 'space-y-4',
              children: [
                (0, d.jsxs)('div', {
                  children: [
                    (0, d.jsx)('h3', { className: 'text-lg font-medium', children: '서비스 주소' }),
                    (0, d.jsx)('p', {
                      className: 'text-muted-foreground mt-1 text-sm',
                      children: '미용 서비스를 받을 주소를 선택해주세요',
                    }),
                  ],
                }),
                a.length > 0
                  ? (0, d.jsxs)(d.Fragment, {
                      children: [
                        (0, d.jsx)('div', {
                          className: 'mt-4 grid grid-cols-1 gap-3',
                          children: a.map((a) =>
                            (0, d.jsx)(
                              'div',
                              {
                                className: `cursor-pointer rounded-lg border p-4 transition-colors ${c === a.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`,
                                onClick: () => b((0, t.updateAddress)(a.id)),
                                children: (0, d.jsxs)('div', {
                                  className: 'flex items-start justify-between gap-2',
                                  children: [
                                    (0, d.jsxs)('div', {
                                      className: 'min-w-0 flex-1',
                                      children: [
                                        (0, d.jsxs)('p', {
                                          className: 'font-medium break-words',
                                          children: [a.city, ' ', a.state, ' ', a.street],
                                        }),
                                        (0, d.jsx)('p', {
                                          className: 'text-muted-foreground mt-1 text-sm',
                                          children: a.zipCode && `(${a.zipCode})`,
                                        }),
                                      ],
                                    }),
                                    a.isDefault &&
                                      (0, d.jsx)('span', {
                                        className:
                                          'bg-primary text-primary-foreground flex-shrink-0 rounded px-2 py-1 text-xs',
                                        children: '기본 주소',
                                      }),
                                  ],
                                }),
                              },
                              a.id
                            )
                          ),
                        }),
                        (0, d.jsx)('div', {
                          className: 'mt-2 flex justify-center',
                          children: (0, d.jsx)(i.Button, {
                            variant: 'outline',
                            asChild: !0,
                            children: (0, d.jsx)(h.default, {
                              href: '/customer/profile',
                              children: '새 주소 추가하기',
                            }),
                          }),
                        }),
                      ],
                    })
                  : (0, d.jsxs)('div', {
                      className: 'py-8 text-center',
                      children: [
                        (0, d.jsx)('div', {
                          className:
                            'bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
                          children: (0, d.jsxs)('svg', {
                            className: 'text-muted-foreground h-8 w-8',
                            fill: 'none',
                            stroke: 'currentColor',
                            viewBox: '0 0 24 24',
                            children: [
                              (0, d.jsx)('path', {
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeWidth: 2,
                                d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                              }),
                              (0, d.jsx)('path', {
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeWidth: 2,
                                d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                              }),
                            ],
                          }),
                        }),
                        (0, d.jsx)('h3', {
                          className: 'text-foreground mb-2 text-lg font-medium',
                          children: '등록된 주소가 없습니다',
                        }),
                        (0, d.jsx)('p', {
                          className: 'text-muted-foreground mb-4',
                          children: '예약을 계속하려면 프로필에서 주소를 먼저 등록해주세요.',
                        }),
                        (0, d.jsx)(i.Button, {
                          asChild: !0,
                          children: (0, d.jsx)(h.default, {
                            href: '/customer/profile',
                            children: '주소 등록하러 가기',
                          }),
                        }),
                      ],
                    }),
              ],
            }),
          }),
          e &&
            (0, d.jsxs)(x.Card, {
              className: 'border-green-200 bg-green-50',
              children: [
                (0, d.jsx)(x.CardHeader, {
                  children: (0, d.jsx)(x.CardTitle, {
                    className: 'text-green-800',
                    children: '선택된 주소',
                  }),
                }),
                (0, d.jsx)(x.CardContent, {
                  children: (0, d.jsxs)('div', {
                    className: 'text-green-700',
                    children: [
                      (0, d.jsxs)('p', {
                        className: 'font-medium break-words',
                        children: [e.city, ' ', e.state, ' ', e.street],
                      }),
                      e.zipCode &&
                        (0, d.jsxs)('p', {
                          className: 'mt-1 text-sm',
                          children: ['(', e.zipCode, ')'],
                        }),
                    ],
                  }),
                }),
              ],
            }),
        ],
      })
    }
    let V = (0, a.i(170106).default)('calendar-days', [
      ['path', { d: 'M8 2v4', key: '1cmpym' }],
      ['path', { d: 'M16 2v4', key: '4m81vk' }],
      ['rect', { width: '18', height: '18', x: '3', y: '4', rx: '2', key: '1hopcy' }],
      ['path', { d: 'M3 10h18', key: '8toen8' }],
      ['path', { d: 'M8 14h.01', key: '6423bh' }],
      ['path', { d: 'M12 14h.01', key: '1etili' }],
      ['path', { d: 'M16 14h.01', key: '1gbofw' }],
      ['path', { d: 'M8 18h.01', key: 'lrp35t' }],
      ['path', { d: 'M12 18h.01', key: 'mhygvu' }],
      ['path', { d: 'M16 18h.01', key: 'kzsmim' }],
    ])
    var W = a.i(320146),
      X = a.i(872233),
      Y = a.i(93518),
      Z = a.i(124987),
      $ = a.i(368114)
    function _({ groomer: a, onSelect: b, isSelected: c = !1, className: e }) {
      let f
      return (0, d.jsx)(x.Card, {
        className: (0, $.cn)(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          c ? 'ring-primary border-primary bg-primary/5 ring-2' : 'hover:border-primary/50',
          e
        ),
        onClick: () => b(a.id),
        children: (0, d.jsx)(x.CardContent, {
          className: 'p-6',
          children: (0, d.jsxs)('div', {
            className: 'flex items-start gap-4',
            children: [
              (0, d.jsxs)(X.Avatar, {
                className: 'border-border h-16 w-16 border-2',
                children: [
                  (0, d.jsx)(X.AvatarImage, { src: a.profileImage, alt: `${a.name} 프로필` }),
                  (0, d.jsx)(X.AvatarFallback, {
                    className: 'bg-primary/10 text-primary text-lg font-semibold',
                    children: a.name
                      .split(' ')
                      .map((a) => a[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2),
                  }),
                ],
              }),
              (0, d.jsxs)('div', {
                className: 'min-w-0 flex-1',
                children: [
                  (0, d.jsxs)('div', {
                    className: 'mb-2 flex items-start justify-between',
                    children: [
                      (0, d.jsxs)('div', {
                        className: 'min-w-0 flex-1',
                        children: [
                          (0, d.jsx)('h3', {
                            className: 'truncate text-lg leading-tight font-semibold',
                            children: a.name,
                          }),
                          void 0 !== a.rating &&
                            (0, d.jsxs)('div', {
                              className: 'mt-1 flex items-center gap-1',
                              children: [
                                ((f = a.rating),
                                Array.from({ length: 5 }, (a, b) =>
                                  (0, d.jsx)(
                                    K.Star,
                                    {
                                      className: (0, $.cn)(
                                        'h-4 w-4',
                                        b < Math.floor(f)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      ),
                                    },
                                    b
                                  )
                                )),
                                (0, d.jsxs)('span', {
                                  className: 'text-muted-foreground ml-1 text-sm',
                                  children: [a.rating, a.reviewCount && ` (${a.reviewCount})`],
                                }),
                              ],
                            }),
                        ],
                      }),
                      c &&
                        (0, d.jsxs)('div', {
                          className: 'text-primary flex items-center gap-1',
                          children: [
                            (0, d.jsx)(Y.Award, { className: 'h-4 w-4' }),
                            (0, d.jsx)('span', {
                              className: 'text-sm font-medium',
                              children: '선택됨',
                            }),
                          ],
                        }),
                    ],
                  }),
                  (0, d.jsxs)('div', {
                    className: 'mb-4 space-y-1',
                    children: [
                      a.workAreas &&
                        a.workAreas.length > 0 &&
                        (0, d.jsxs)('div', {
                          className: 'text-muted-foreground flex items-center gap-1 text-sm',
                          children: [
                            (0, d.jsx)(Z.MapPin, { className: 'h-3 w-3 flex-shrink-0' }),
                            (0, d.jsx)('span', {
                              className: 'truncate',
                              children: a.workAreas.join(', '),
                            }),
                          ],
                        }),
                      void 0 !== a.distance &&
                        (0, d.jsxs)('div', {
                          className: 'flex items-center gap-1 text-sm',
                          children: [
                            (0, d.jsx)('span', {
                              className: 'text-primary font-medium',
                              children:
                                a.distance < 1
                                  ? `${Math.round(1e3 * a.distance)}m`
                                  : `${a.distance}km`,
                            }),
                            (0, d.jsx)('span', {
                              className: 'text-muted-foreground',
                              children: '거리',
                            }),
                            a.serviceArea &&
                              (0, d.jsxs)(d.Fragment, {
                                children: [
                                  (0, d.jsx)('span', {
                                    className: 'text-muted-foreground',
                                    children: '•',
                                  }),
                                  (0, d.jsx)('span', {
                                    className: 'text-muted-foreground truncate',
                                    children: a.serviceArea,
                                  }),
                                ],
                              }),
                          ],
                        }),
                    ],
                  }),
                  (0, d.jsx)(i.Button, {
                    variant: c ? 'default' : 'outline',
                    size: 'sm',
                    className: (0, $.cn)(
                      'w-full transition-colors',
                      c
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-primary hover:text-primary-foreground'
                    ),
                    onClick: (c) => {
                      ;(c.stopPropagation(), b(a.id))
                    },
                    children: c ? '선택됨' : '이 미용사 선택',
                  }),
                ],
              }),
            ],
          }),
        }),
      })
    }
    var aa = a.i(641710)
    function ab({
      groomerName: a,
      timeSlots: b,
      selectedTime: c,
      estimatedDuration: e = 60,
      onTimeSelect: f,
      className: g,
      workingHoursStart: h = '09:00',
      workingHoursEnd: j = '18:00',
    }) {
      let k = ((a = h, b = j) => {
          let c = [],
            [d, e] = a.split(':').map(Number),
            [f, g] = b.split(':').map(Number),
            i = 60 * d + e,
            k = 60 * f + g
          for (let a = i; a < k; a += 30) {
            let b = Math.floor(a / 60),
              d = a % 60,
              e = `${b.toString().padStart(2, '0')}:${d.toString().padStart(2, '0')}`
            c.push(e)
          }
          return c
        })(),
        l = (a) => {
          let c = b.find((b) => b.time === a)
          return {
            available: c?.available ?? !0,
            isBooked: c?.isBooked ?? !1,
            reason: c?.reason || (c?.isBooked ? '이미 예약됨' : void 0),
          }
        },
        m = (a) => {
          let [b, c] = a.split(':').map(Number)
          return 60 * b + c
        },
        n = (a) => {
          let b = Math.floor(a / 60)
          return `${b.toString().padStart(2, '0')}:${(a % 60).toString().padStart(2, '0')}`
        },
        o = (a, b) => {
          if (!a) return []
          let c = m(a),
            d = c + b,
            e = []
          for (let a = c; a < d; a += 30) {
            let b = n(a)
            k.includes(b) && e.push(b)
          }
          return e
        }
      return (
        c && o(c, e),
        (0, d.jsxs)(x.Card, {
          className: g,
          children: [
            (0, d.jsx)(x.CardHeader, {
              children: (0, d.jsxs)(x.CardTitle, {
                className: 'flex items-center gap-2',
                children: [
                  (0, d.jsx)(aa.Clock, { className: 'text-primary h-5 w-5' }),
                  a,
                  ' 미용사 예약 시간 선택',
                ],
              }),
            }),
            (0, d.jsxs)(x.CardContent, {
              children: [
                (0, d.jsx)('div', {
                  className: 'space-y-4',
                  children: (0, d.jsxs)('div', {
                    children: [
                      (0, d.jsxs)('div', {
                        className:
                          'text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium',
                        children: [
                          (0, d.jsx)('span', {
                            className: 'bg-primary/10 text-primary rounded px-2 py-1 text-xs',
                            children: '예약 가능 시간',
                          }),
                          (0, d.jsxs)('span', { className: 'text-xs', children: [h, ' - ', j] }),
                        ],
                      }),
                      (0, d.jsx)('div', {
                        className: 'grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8',
                        children: k.map((a) =>
                          ((a) => {
                            let b = l(a),
                              g = c === a,
                              h = ((a) => {
                                let b = l(a)
                                if (!b.available || b.isBooked) return !1
                                for (let b of o(a, e)) {
                                  let a = l(b)
                                  if (!a.available || a.isBooked) return !1
                                }
                                return !0
                              })(a),
                              k = m(a) + e > m(j),
                              n = !h || b.isBooked
                            return (0, d.jsxs)(
                              i.Button,
                              {
                                variant: g ? 'default' : 'outline',
                                size: 'sm',
                                disabled: n,
                                onClick: () => {
                                  n || f(a)
                                },
                                'aria-disabled': n,
                                className: (0, $.cn)(
                                  'relative h-10 text-xs font-medium transition-all',
                                  g &&
                                    !b.isBooked &&
                                    'bg-primary text-primary-foreground ring-primary font-bold shadow-md ring-2 ring-offset-2',
                                  b.isBooked &&
                                    'border-gray-500 bg-gray-300 text-gray-700 line-through opacity-70',
                                  k &&
                                    !b.isBooked &&
                                    !g &&
                                    'border-orange-300 bg-orange-100 text-orange-700 opacity-60',
                                  !g &&
                                    h &&
                                    !b.isBooked &&
                                    'hover:bg-primary/10 hover:border-primary',
                                  n && 'pointer-events-none cursor-not-allowed opacity-50'
                                ),
                                title: b.isBooked
                                  ? `이미 예약된 시간입니다: ${a}`
                                  : k
                                    ? `서비스가 업무 마감시간(${j})을 초과함`
                                    : b.available
                                      ? g
                                        ? `선택된 시작 시간: ${a}`
                                        : void 0
                                      : b.reason,
                                children: [
                                  a,
                                  b.isBooked &&
                                    (0, d.jsx)('div', {
                                      className:
                                        'absolute inset-0 flex items-center justify-center',
                                      children: (0, d.jsx)('div', {
                                        className: 'absolute h-0.5 w-full bg-gray-600',
                                      }),
                                    }),
                                ],
                              },
                              a
                            )
                          })(a)
                        ),
                      }),
                    ],
                  }),
                }),
                (0, d.jsx)('div', {
                  className: 'border-border mt-6 border-t pt-4',
                  children: (0, d.jsxs)('div', {
                    className: 'grid grid-cols-2 gap-3 text-xs md:grid-cols-3',
                    children: [
                      (0, d.jsxs)('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          (0, d.jsx)('div', {
                            className: 'border-border bg-background h-3 w-3 rounded border',
                          }),
                          (0, d.jsx)('span', {
                            className: 'text-muted-foreground',
                            children: '예약 가능',
                          }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          (0, d.jsx)('div', {
                            className:
                              'border-primary bg-primary ring-primary h-3 w-3 rounded border-2 ring-1',
                          }),
                          (0, d.jsx)('span', {
                            className: 'text-muted-foreground',
                            children: '선택된 시간',
                          }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          (0, d.jsx)('div', {
                            className: 'h-3 w-3 rounded border border-orange-200 bg-orange-50',
                          }),
                          (0, d.jsx)('span', {
                            className: 'text-muted-foreground',
                            children: '마감시간 초과',
                          }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          (0, d.jsx)('div', {
                            className:
                              'relative h-3 w-3 rounded border border-gray-400 bg-gray-200',
                            children: (0, d.jsx)('span', {
                              className:
                                'absolute inset-0 flex items-center justify-center text-xs leading-none text-gray-600',
                              children: 'X',
                            }),
                          }),
                          (0, d.jsx)('span', {
                            className: 'text-muted-foreground',
                            children: '이미 예약됨',
                          }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          (0, d.jsx)('div', {
                            className: 'border-border bg-muted h-3 w-3 rounded border opacity-50',
                          }),
                          (0, d.jsx)('span', {
                            className: 'text-muted-foreground',
                            children: '예약 불가',
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        })
      )
    }
    function ac({
      estimatedDuration: a,
      groomers: b,
      isLoadingGroomers: c,
      availableTimeSlots: e,
      groomerPagination: f,
      onDateChange: g,
      onGroomerSelect: h,
      onTimeSelect: k,
      onGroomerPageChange: l,
      onSpecialRequestsChange: m,
    }) {
      let p,
        q = s((a) => a.booking.formData.date),
        r = s((a) => a.booking.formData.groomerId),
        t = s((a) => a.booking.formData.timeSlot),
        u = s((a) => a.booking.currentGroomerPage),
        v = s((a) => a.booking.formData.specialRequests),
        w = b.find((a) => a.id === r),
        y = (a) => {
          if (!a || '' === a.trim()) return
          let b = new Date(a)
          if (!isNaN(b.getTime())) return b
        }
      return (0, d.jsxs)('div', {
        className: 'space-y-8',
        children: [
          (0, d.jsx)(x.Card, {
            className: 'overflow-hidden p-0 sm:p-6',
            children: (0, d.jsxs)('div', {
              className: 'space-y-6',
              children: [
                (0, d.jsxs)('div', {
                  className: 'px-4 pt-4 sm:px-0 sm:pt-0',
                  children: [
                    (0, d.jsx)(P.Label, {
                      className: 'text-lg font-medium',
                      children: '날짜 선택',
                    }),
                    (0, d.jsx)('p', {
                      className: 'text-muted-foreground mt-1 text-sm',
                      children: '원하는 날짜를 달력에서 직접 선택하세요',
                    }),
                  ],
                }),
                (0, d.jsxs)('div', {
                  className: 'flex flex-col gap-6 lg:flex-row',
                  children: [
                    (0, d.jsx)('div', {
                      className: '-mx-4 flex-shrink-0 px-0 sm:mx-0 sm:px-0',
                      children: (0, d.jsx)(W.Calendar, {
                        mode: 'single',
                        selected: y(q),
                        onSelect: g,
                        disabled: (a) => {
                          let b = new Date(),
                            c = new Date(Date.now() + 7776e6)
                          return a < b || a > c
                        },
                        locale: o.ko,
                        weekStartsOn: 0,
                        showOutsideDays: !1,
                        fixedWeeks: !0,
                        className:
                          'w-full rounded-none border border-x-0 sm:w-auto sm:rounded-md sm:border-x',
                        modifiers: {
                          today: (a) => {
                            let b = new Date()
                            return a.toDateString() === b.toDateString()
                          },
                        },
                        modifiersClassNames: {
                          today: 'bg-accent text-accent-foreground font-semibold',
                        },
                      }),
                    }),
                    (0, d.jsxs)('div', {
                      className: 'flex-1 space-y-4 px-4 sm:px-0',
                      children: [
                        q && y(q)
                          ? (0, d.jsx)(x.Card, {
                              className: 'border-primary bg-primary/5',
                              children: (0, d.jsxs)(x.CardContent, {
                                className: 'p-4',
                                children: [
                                  (0, d.jsxs)('div', {
                                    className: 'mb-3 flex items-center gap-3',
                                    children: [
                                      (0, d.jsx)(V, { className: 'text-primary h-5 w-5' }),
                                      (0, d.jsxs)('div', {
                                        children: [
                                          (0, d.jsx)('h3', {
                                            className: 'text-primary font-semibold',
                                            children: '선택된 날짜',
                                          }),
                                          (0, d.jsxs)('p', {
                                            className: 'text-muted-foreground text-sm',
                                            children: [
                                              (0, n.format)(y(q), 'yyyy년 M월 d일 (EEEE)', {
                                                locale: o.ko,
                                              }),
                                              y(q).toDateString() === new Date().toDateString() &&
                                                ' (오늘)',
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, d.jsx)('div', {
                                    className: 'text-muted-foreground text-sm',
                                    children:
                                      '이 날짜에 서비스 가능한 미용사를 확인하고 시간을 선택하세요.',
                                  }),
                                ],
                              }),
                            })
                          : (0, d.jsx)(x.Card, {
                              className: 'border-dashed',
                              children: (0, d.jsxs)(x.CardContent, {
                                className: 'p-4 text-center sm:p-8',
                                children: [
                                  (0, d.jsx)(V, {
                                    className:
                                      'text-muted-foreground mx-auto mb-3 h-10 w-10 sm:mb-4 sm:h-12 sm:w-12',
                                  }),
                                  (0, d.jsx)('h3', {
                                    className: 'text-muted-foreground mb-2 font-medium',
                                    children: '날짜를 선택해주세요',
                                  }),
                                  (0, d.jsxs)('p', {
                                    className: 'text-muted-foreground text-sm',
                                    children: [
                                      (0, d.jsx)('span', {
                                        className: 'sm:hidden',
                                        children: '위의',
                                      }),
                                      (0, d.jsx)('span', {
                                        className: 'hidden sm:inline',
                                        children: '왼쪽',
                                      }),
                                      ' 달력에서 원하는 날짜를 클릭하세요',
                                    ],
                                  }),
                                ],
                              }),
                            }),
                        (0, d.jsxs)('div', {
                          className: 'text-muted-foreground bg-muted/50 rounded-lg p-3 text-xs',
                          children: [
                            (0, d.jsx)('p', {
                              className: 'mb-1 font-medium',
                              children: '📅 예약 가능 기간',
                            }),
                            (0, d.jsx)('p', {
                              children: '• 오늘부터 최대 1개월 후까지 예약 가능합니다',
                            }),
                            (0, d.jsx)('p', { children: '• 과거 날짜는 선택할 수 없습니다' }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          q &&
            (0, d.jsxs)('div', {
              className: 'space-y-6',
              children: [
                (0, d.jsx)(x.Card, {
                  className: 'p-6',
                  children: (0, d.jsxs)('div', {
                    className: 'space-y-6',
                    children: [
                      (0, d.jsxs)('div', {
                        children: [
                          (0, d.jsx)('h3', {
                            className: 'mb-2 text-lg font-semibold',
                            children: '미용사 선택',
                          }),
                          (0, d.jsxs)('p', {
                            className: 'text-muted-foreground text-sm',
                            children: [
                              q,
                              ' (',
                              y(q) && (0, n.format)(y(q), 'EEEE', { locale: o.ko }),
                              ')에 서비스 가능한 미용사를 선택하세요',
                            ],
                          }),
                        ],
                      }),
                      c
                        ? (0, d.jsxs)('div', {
                            className: 'py-8 text-center',
                            children: [
                              (0, d.jsx)(j.LoadingSpinner, { size: 'lg' }),
                              (0, d.jsx)('p', {
                                className: 'text-muted-foreground mt-4',
                                children: '미용사 정보를 불러오는 중...',
                              }),
                            ],
                          })
                        : b.length > 0
                          ? (0, d.jsxs)('div', {
                              className: 'space-y-6',
                              children: [
                                (0, d.jsx)('div', {
                                  className: 'grid grid-cols-1 gap-4 lg:grid-cols-2',
                                  children: b.map((a) =>
                                    (0, d.jsx)(
                                      _,
                                      { groomer: a, isSelected: r === a.id, onSelect: h },
                                      a.id
                                    )
                                  ),
                                }),
                                f &&
                                  f.totalPages > 1 &&
                                  (0, d.jsxs)('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      (0, d.jsxs)('div', {
                                        className: 'text-muted-foreground text-sm',
                                        children: [
                                          '총 ',
                                          f.totalItems,
                                          '명의 미용사 중',
                                          ' ',
                                          (f.currentPage - 1) * f.itemsPerPage + 1,
                                          '-',
                                          Math.min(f.currentPage * f.itemsPerPage, f.totalItems),
                                          '명 표시',
                                        ],
                                      }),
                                      (0, d.jsxs)('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          (0, d.jsx)(i.Button, {
                                            variant: 'outline',
                                            size: 'sm',
                                            onClick: () => l(u - 1),
                                            disabled: !f.hasPreviousPage || c,
                                            children: '이전',
                                          }),
                                          (0, d.jsx)('div', {
                                            className: 'flex items-center gap-1',
                                            children: Array.from(
                                              { length: f.totalPages },
                                              (a, b) => b + 1
                                            )
                                              .filter(
                                                (a) =>
                                                  2 >= Math.abs(a - f.currentPage) ||
                                                  1 === a ||
                                                  a === f.totalPages
                                              )
                                              .map((a, b, e) =>
                                                (0, d.jsxs)(
                                                  'div',
                                                  {
                                                    className: 'flex items-center',
                                                    children: [
                                                      b > 0 &&
                                                        e[b - 1] !== a - 1 &&
                                                        (0, d.jsx)('span', {
                                                          className: 'text-muted-foreground px-2',
                                                          children: '...',
                                                        }),
                                                      (0, d.jsx)(i.Button, {
                                                        variant:
                                                          a === f.currentPage
                                                            ? 'default'
                                                            : 'outline',
                                                        size: 'sm',
                                                        onClick: () => l(a),
                                                        disabled: c,
                                                        className: 'min-w-[32px]',
                                                        children: a,
                                                      }),
                                                    ],
                                                  },
                                                  a
                                                )
                                              ),
                                          }),
                                          (0, d.jsx)(i.Button, {
                                            variant: 'outline',
                                            size: 'sm',
                                            onClick: () => l(u + 1),
                                            disabled: !f.hasNextPage || c,
                                            children: '다음',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                              ],
                            })
                          : (0, d.jsxs)('div', {
                              className: 'py-8 text-center',
                              children: [
                                (0, d.jsx)('div', {
                                  className:
                                    'bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
                                  children: (0, d.jsx)('svg', {
                                    className: 'text-muted-foreground h-8 w-8',
                                    fill: 'none',
                                    stroke: 'currentColor',
                                    viewBox: '0 0 24 24',
                                    children: (0, d.jsx)('path', {
                                      strokeLinecap: 'round',
                                      strokeLinejoin: 'round',
                                      strokeWidth: 2,
                                      d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                                    }),
                                  }),
                                }),
                                (0, d.jsx)('h3', {
                                  className: 'text-foreground mb-2 text-lg font-medium',
                                  children: '서비스 가능한 미용사가 없습니다',
                                }),
                                (0, d.jsx)('p', {
                                  className: 'text-muted-foreground',
                                  children:
                                    '해당 지역과 날짜에 서비스 가능한 미용사를 찾지 못했습니다. 다른 날짜를 선택해주세요.',
                                }),
                              ],
                            }),
                    ],
                  }),
                }),
                w &&
                  (0, d.jsx)(ab, {
                    groomerName: w.name,
                    timeSlots:
                      ((p = w.id),
                      e
                        .filter((a) => a.groomerId === p)
                        .map((a) => ({
                          time: a.time,
                          available: a.available,
                          isBooked: a.isBooked || !1,
                          reason: a.available ? void 0 : a.isBooked ? '이미 예약됨' : '예약 불가',
                        }))),
                    selectedTime: t,
                    estimatedDuration: a,
                    onTimeSelect: k,
                    workingHoursStart: w.schedule?.workingHoursStart,
                    workingHoursEnd: w.schedule?.workingHoursEnd,
                  }),
              ],
            }),
          q &&
            r &&
            t &&
            (0, d.jsxs)(x.Card, {
              className: 'border-green-200 bg-green-50',
              children: [
                (0, d.jsx)(x.CardHeader, {
                  children: (0, d.jsx)(x.CardTitle, {
                    className: 'text-green-800',
                    children: '선택된 예약 정보',
                  }),
                }),
                (0, d.jsx)(x.CardContent, {
                  children: (0, d.jsxs)('div', {
                    className: 'grid grid-cols-1 gap-4 md:grid-cols-3',
                    children: [
                      (0, d.jsxs)('div', {
                        children: [
                          (0, d.jsx)('p', {
                            className: 'text-sm font-medium text-green-600',
                            children: '미용사',
                          }),
                          (0, d.jsx)('p', { className: 'text-green-800', children: w?.name }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        children: [
                          (0, d.jsx)('p', {
                            className: 'text-sm font-medium text-green-600',
                            children: '날짜',
                          }),
                          (0, d.jsxs)('p', {
                            className: 'text-green-800',
                            children: [
                              q,
                              ' (',
                              y(q) && (0, n.format)(y(q), 'EEE', { locale: o.ko }),
                              ')',
                            ],
                          }),
                        ],
                      }),
                      (0, d.jsxs)('div', {
                        children: [
                          (0, d.jsx)('p', {
                            className: 'text-sm font-medium text-green-600',
                            children: '시간',
                          }),
                          (0, d.jsx)('p', { className: 'text-green-800', children: t }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          (0, d.jsx)(x.Card, {
            className: 'p-6',
            children: (0, d.jsxs)('div', {
              className: 'space-y-4',
              children: [
                (0, d.jsx)(P.Label, {
                  htmlFor: 'specialRequests',
                  className: 'text-lg font-medium',
                  children: '특별 요청사항',
                }),
                (0, d.jsx)('textarea', {
                  id: 'specialRequests',
                  value: v,
                  onChange: (a) => m(a.target.value),
                  rows: 4,
                  placeholder: '미용사에게 전달할 특별한 요청사항이 있으시면 입력해주세요...',
                  className:
                    'border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none',
                }),
                (0, d.jsx)('p', {
                  className: 'text-muted-foreground text-sm',
                  children:
                    '반려동물의 특성, 주의사항, 선호하는 스타일 등을 자유롭게 입력해주세요.',
                }),
              ],
            }),
          }),
        ],
      })
    }
    var ad = a.i(866718),
      ae = a.i(148452)
    function af({
      pets: a,
      profile: b,
      totalAmount: c,
      orderName: e,
      onPaymentSuccess: f,
      onPaymentError: g,
    }) {
      let i = s((a) => a.booking.formData),
        j = s((a) => a.booking.paymentId),
        k = s((a) => a.booking.selectedBookingId)
      return (0, d.jsxs)('div', {
        className: 'space-y-6',
        children: [
          (0, d.jsxs)(x.Card, {
            className: 'border-primary bg-primary/5',
            children: [
              (0, d.jsx)(x.CardHeader, {
                children: (0, d.jsx)(x.CardTitle, { children: '결제 정보' }),
              }),
              (0, d.jsx)(x.CardContent, {
                children: (0, d.jsxs)('div', {
                  className: 'space-y-4',
                  children: [
                    i.petServices.map((b, c) => {
                      let e = a.find((a) => a.id === b.petId),
                        f = b.services.reduce((a, b) => a + b.price, 0),
                        g = b.options.reduce((a, b) => a + b.price, 0)
                      return (0, d.jsxs)(
                        'div',
                        {
                          className: 'rounded-lg border bg-white p-4',
                          children: [
                            (0, d.jsxs)('div', {
                              className: 'mb-2 flex items-start justify-between',
                              children: [
                                (0, d.jsxs)('h4', {
                                  className: 'font-semibold',
                                  children: [e?.name, ' (', e?.breed?.name, ')'],
                                }),
                                (0, d.jsxs)('span', {
                                  className: 'text-primary font-semibold',
                                  children: [(f + g).toLocaleString(), '원'],
                                }),
                              ],
                            }),
                            (0, d.jsxs)('div', {
                              className: 'space-y-1',
                              children: [
                                b.services.map((a, b) =>
                                  (0, d.jsxs)(
                                    'div',
                                    {
                                      className:
                                        'text-muted-foreground flex items-center justify-between text-sm',
                                      children: [
                                        (0, d.jsxs)('span', { children: ['- ', a.name] }),
                                        (0, d.jsxs)('span', {
                                          children: [a.price.toLocaleString(), '원'],
                                        }),
                                      ],
                                    },
                                    b
                                  )
                                ),
                                b.options.length > 0 &&
                                  (0, d.jsxs)(d.Fragment, {
                                    children: [
                                      (0, d.jsx)('div', {
                                        className: 'mt-2 border-t pt-2',
                                        children: (0, d.jsx)('span', {
                                          className: 'text-muted-foreground text-xs font-medium',
                                          children: '추가 옵션',
                                        }),
                                      }),
                                      b.options.map((a, b) =>
                                        (0, d.jsxs)(
                                          'div',
                                          {
                                            className:
                                              'text-muted-foreground flex items-center justify-between text-sm',
                                            children: [
                                              (0, d.jsxs)('span', { children: ['+ ', a.name] }),
                                              (0, d.jsxs)('span', {
                                                children: [a.price.toLocaleString(), '원'],
                                              }),
                                            ],
                                          },
                                          b
                                        )
                                      ),
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        },
                        c
                      )
                    }),
                    (0, d.jsx)('div', {
                      className: 'border-t pt-4',
                      children: (0, d.jsxs)('div', {
                        className: 'flex items-center justify-between text-lg',
                        children: [
                          (0, d.jsx)('span', {
                            className: 'font-semibold',
                            children: '총 결제금액',
                          }),
                          (0, d.jsxs)('span', {
                            className: 'text-primary text-2xl font-bold',
                            children: [c.toLocaleString(), '원'],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
          (0, d.jsx)(x.Card, {
            className: 'p-6',
            children: (0, d.jsxs)('div', {
              className: 'space-y-4',
              children: [
                (0, d.jsx)('h3', { className: 'text-lg font-semibold', children: '예약자 정보' }),
                (0, d.jsx)('p', {
                  className: 'text-muted-foreground text-sm',
                  children: '현재 로그인된 계정의 정보로 자동 입력됩니다.',
                }),
                (0, d.jsxs)('div', {
                  className: 'grid grid-cols-1 gap-4 md:grid-cols-2',
                  children: [
                    (0, d.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, d.jsx)(P.Label, { htmlFor: 'customerName', children: '예약자 이름 *' }),
                        (0, d.jsx)(ad.Input, {
                          id: 'customerName',
                          value: b?.name || '',
                          readOnly: !0,
                          className: 'bg-muted',
                        }),
                      ],
                    }),
                    (0, d.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, d.jsx)(P.Label, { htmlFor: 'customerPhone', children: '연락처 *' }),
                        (0, d.jsx)(ad.Input, {
                          id: 'customerPhone',
                          value: b?.phoneNumber || '',
                          readOnly: !0,
                          className: 'bg-muted',
                          placeholder: b?.phoneNumber ? '' : '연락처가 등록되지 않았습니다',
                        }),
                      ],
                    }),
                  ],
                }),
                !b?.phoneNumber &&
                  (0, d.jsx)('div', {
                    className: 'rounded-lg border border-yellow-200 bg-yellow-50 p-3',
                    children: (0, d.jsxs)('p', {
                      className: 'text-sm text-yellow-700',
                      children: [
                        '연락처가 등록되지 않았습니다. 예약을 위해',
                        ' ',
                        (0, d.jsx)(h.default, {
                          href: '/customer/profile',
                          className: 'font-medium underline',
                          children: '프로필 설정',
                        }),
                        '에서 연락처를 등록해주세요.',
                      ],
                    }),
                  }),
              ],
            }),
          }),
          (0, d.jsx)(x.Card, {
            className: 'border-yellow-200 bg-yellow-50 p-6',
            children: (0, d.jsxs)('div', {
              className: 'space-y-3',
              children: [
                (0, d.jsx)('h3', {
                  className: 'text-lg font-semibold text-yellow-800',
                  children: '결제 전 확인사항',
                }),
                (0, d.jsxs)('ul', {
                  className: 'space-y-1 text-sm text-yellow-700',
                  children: [
                    (0, d.jsx)('li', {
                      children: '• 예약 변경 및 취소는 24시간 전까지 가능합니다.',
                    }),
                    (0, d.jsx)('li', {
                      children: '• 당일 취소 시 50% 환불, 노쇼 시 환불이 불가합니다.',
                    }),
                    (0, d.jsx)('li', {
                      children: '• 반려동물의 건강상태에 따라 서비스가 제한될 수 있습니다.',
                    }),
                    (0, d.jsx)('li', {
                      children: '• 추가 서비스 요청 시 현장에서 별도 결제가 가능합니다.',
                    }),
                  ],
                }),
              ],
            }),
          }),
          j &&
            (0, d.jsx)(ae.PaymentCard, {
              amount: c,
              orderName: e,
              orderId: j,
              customerInfo: {
                name: b?.name || '',
                email: b?.email || '',
                phone: b?.phoneNumber || '',
              },
              onSuccess: f,
              onError: g,
              termsText: '서비스 이용약관 및 결제 약관에 동의합니다',
              customData: {
                bookingId: k,
                bookingType: 'grooming',
                petCount: i.petServices.length,
                groomerId: i.groomerId,
                serviceDate: i.date,
                serviceTime: i.timeSlot,
              },
            }),
        ],
      })
    }
    function ag({ pets: a, profile: e }) {
      let h,
        k,
        l,
        q,
        x,
        y,
        z,
        A,
        B,
        C,
        D,
        E,
        F = (0, f.useRouter)(),
        G = r(),
        H = s((a) => a.booking.isCreating),
        I = s((a) => a.booking.isInitializingPayment),
        J = s((a) => a.booking.selectedBookingId),
        K = s((a) => a.booking.paymentId),
        L = s((a) => a.booking.currentGroomerPage),
        {
          formData: M,
          handleAddressChange: N,
          handleDateChange: O,
          handleGroomerChange: P,
          handleTimeSlotChange: Q,
          handleSpecialRequestsChange: R,
        } = ((h = r()),
        (k = s((a) => a.booking.formData)),
        (l = (0, g.useCallback)(
          (a) => {
            h((0, t.togglePet)(a))
          },
          [h]
        )),
        (q = (0, g.useCallback)(
          (a, b) => {
            h((0, t.updateServices)({ petId: a, services: b }))
          },
          [h]
        )),
        (x = (0, g.useCallback)(
          (a, b) => {
            h((0, t.updateOptions)({ petId: a, options: b }))
          },
          [h]
        )),
        (y = (0, g.useCallback)(
          (a) => {
            h((0, t.updateAddress)(a))
          },
          [h]
        )),
        (z = (0, g.useCallback)(
          (a) => {
            h((0, t.updateDate)(a))
          },
          [h]
        )),
        (A = (0, g.useCallback)(
          (a) => {
            h((0, t.updateGroomer)(a))
          },
          [h]
        )),
        (B = (0, g.useCallback)(
          (a) => {
            h((0, t.updateTimeSlot)(a))
          },
          [h]
        )),
        {
          formData: k,
          handlePetToggle: l,
          handleServiceChange: q,
          handleOptionsChange: x,
          handleAddressChange: y,
          handleDateChange: z,
          handleGroomerChange: A,
          handleTimeSlotChange: B,
          handleSpecialRequestsChange: (0, g.useCallback)(
            (a) => {
              h((0, t.updateSpecialRequests)(a))
            },
            [h]
          ),
          resetForm: (0, g.useCallback)(() => {
            h((0, t.resetForm)())
          }, [h]),
        }),
        {
          currentStep: S,
          handleNextStep: V,
          handlePrevStep: W,
        } = ((C = r()),
        (D = s((a) => a.booking.currentStep)),
        (E = (0, g.useCallback)(() => {
          ;(window.scrollTo({ top: 0, behavior: 'smooth' }), C((0, t.nextStep)()))
        }, [C])),
        {
          currentStep: D,
          handleNextStep: E,
          handlePrevStep: (0, g.useCallback)(() => {
            C((0, t.prevStep)())
          }, [C]),
          goToStep: (0, g.useCallback)(
            (a) => {
              ;(window.scrollTo({ top: 0, behavior: 'smooth' }), C((0, t.goToStep)(a)))
            },
            [C]
          ),
        }),
        {
          savedAddresses: X,
          timeSlots: Y,
          groomers: Z,
          groomerPagination: $,
          isInitialLoading: _,
          isLoadingGroomers: aa,
        } = m({ date: M.date, addressId: M.addressId, currentPage: L, enabled: !!e })
      ;(0, g.useEffect)(() => {
        if (X.length > 0 && !M.addressId) {
          let a = X.find((a) => a.isDefault)
          a && N(a.id)
        }
      }, [X, M.addressId, N])
      let ab = (0, g.useCallback)(
          async (a) => {
            a &&
              (O((0, n.format)(a, 'yyyy-MM-dd', { locale: o.ko })), G((0, t.updateGroomerPage)(1)))
          },
          [O, G]
        ),
        ad = (0, g.useCallback)(
          (a) => {
            P(a)
          },
          [P]
        ),
        ae = (0, g.useCallback)(async () => {
          if (H || I) return null
          if (!e?.phoneNumber?.trim())
            return (
              alert('결제를 진행하려면 프로필에서 전화번호를 등록해주세요.'),
              F.push('/profile'),
              null
            )
          let d = `booking-${(function (a = 21) {
            var d
            ;((d = a |= 0),
              !b || b.length < d
                ? ((b = Buffer.allocUnsafe(128 * d)), p.webcrypto.getRandomValues(b), (c = 0))
                : c + d > b.length && (p.webcrypto.getRandomValues(b), (c = 0)),
              (c += d))
            let e = ''
            for (let d = c - a; d < c; d++)
              e += 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'[63 & b[d]]
            return e
          })()}`
          try {
            let b = w(M, a),
              c =
                1 === M.petServices.length
                  ? `${a.find((a) => a.id === M.petServices[0].petId)?.name} 미용서비스`
                  : `${M.petServices.length}마리 반려동물 미용서비스`,
              e = await G(
                (0, t.initializeBooking)({
                  idempotencyKey: d,
                  petServices: M.petServices.map((a) => ({
                    petId: a.petId,
                    services: a.services.map((a) => ({
                      id: a.id,
                      name: a.name,
                      price: a.price,
                      duration: a.duration,
                    })),
                    options: a.options.map((a) => ({ id: a.id, name: a.name, price: a.price })),
                  })),
                  addressId: M.addressId,
                  groomerId: M.groomerId,
                  date: M.date,
                  timeSlot: M.timeSlot,
                  specialRequests: M.specialRequests,
                })
              ).unwrap(),
              f = e.bookingId
            if (e.isExisting && 'FIRST_PAYMENT_PENDING' !== e.status)
              return (F.push(`/booking/${f}/confirmation`), null)
            return {
              paymentId: (
                await G(
                  (0, t.initializePayment)({ bookingId: f, amount: b, orderName: c })
                ).unwrap()
              ).paymentId,
              bookingId: f,
              amount: b,
              orderName: c,
            }
          } catch (a) {
            return (
              'BOOKING_CONFLICT' === a.code
                ? alert(a.message || '선택한 시간대가 이미 예약되었습니다')
                : alert(a.message || '예약 생성에 실패했습니다'),
              null
            )
          }
        }, [H, I, e, M, a, F, G]),
        ag = (0, g.useCallback)(async () => {
          if (J)
            try {
              await F.push(`/booking/${J}/confirmation`)
            } catch (a) {
              ;(console.error('[Payment] Redirect failed:', a),
                alert(
                  '결제는 완료되었으나 페이지 이동에 실패했습니다. 예약 내역에서 확인해주세요.'
                ))
            }
          else
            (console.error('[Payment] Missing bookingId after success'),
              alert('결제가 완료되었으나 정보를 찾을 수 없습니다. 고객센터로 문의해주세요.'))
        }, [J, F]),
        ah = (0, g.useCallback)((a) => {
          console.error('Payment error:', a)
        }, [])
      if (_)
        return (0, d.jsx)('div', {
          className: 'flex min-h-screen items-center justify-center',
          children: (0, d.jsx)(j.LoadingSpinner, { size: 'lg' }),
        })
      let ai = w(M, a),
        aj =
          1 === M.petServices.length
            ? `${a.find((a) => a.id === M.petServices[0].petId)?.name} 미용서비스`
            : `${M.petServices.length}마리 반려동물 미용서비스`
      return (0, d.jsxs)('div', {
        className: 'mx-auto max-w-4xl',
        children: [
          1 === S && (0, d.jsx)(T, { pets: a }),
          2 === S && (0, d.jsx)(U, { savedAddresses: X }),
          3 === S &&
            (0, d.jsx)(ac, {
              estimatedDuration: M.petServices.reduce(
                (a, b) => a + b.services.reduce((a, b) => a + b.duration, 0),
                0
              ),
              groomers: Z,
              isLoadingGroomers: aa,
              availableTimeSlots: Y,
              groomerPagination: $,
              onDateChange: ab,
              onGroomerSelect: ad,
              onTimeSelect: Q,
              onGroomerPageChange: (a) => G((0, t.updateGroomerPage)(a)),
              onSpecialRequestsChange: R,
            }),
          4 === S &&
            (0, d.jsx)(af, {
              pets: a,
              profile: e,
              totalAmount: ai,
              orderName: aj,
              onPaymentSuccess: ag,
              onPaymentError: ah,
            }),
          !u(S, M) &&
            v(S, M, a) &&
            (0, d.jsx)('div', {
              className: 'mt-6 rounded-lg border border-red-200 bg-red-50 p-4',
              children: (0, d.jsxs)('div', {
                className: 'flex items-center',
                children: [
                  (0, d.jsx)('svg', {
                    className: 'mr-2 h-5 w-5 flex-shrink-0 text-red-500',
                    fill: 'none',
                    stroke: 'currentColor',
                    viewBox: '0 0 24 24',
                    children: (0, d.jsx)('path', {
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: 2,
                      d: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                    }),
                  }),
                  (0, d.jsx)('p', {
                    className: 'text-sm font-medium text-red-700',
                    children: v(S, M, a),
                  }),
                ],
              }),
            }),
          (0, d.jsxs)('div', {
            className: 'mt-8 flex justify-between',
            children: [
              (0, d.jsx)(i.Button, {
                variant: 'outline',
                onClick: W,
                disabled: 1 === S,
                children: '이전',
              }),
              S < 4
                ? (0, d.jsx)(i.Button, { onClick: V, disabled: !u(S, M), children: '다음' })
                : K
                  ? null
                  : (0, d.jsxs)(i.Button, {
                      onClick: ae,
                      disabled: H || I,
                      size: 'lg',
                      className: 'px-8',
                      children: [
                        H || I
                          ? (0, d.jsx)(j.LoadingSpinner, { size: 'sm', className: 'mr-2' })
                          : (0, d.jsx)('svg', {
                              className: 'mr-2 h-5 w-5',
                              fill: 'none',
                              stroke: 'currentColor',
                              viewBox: '0 0 24 24',
                              children: (0, d.jsx)('path', {
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeWidth: 2,
                                d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                              }),
                            }),
                        '결제 진행하기',
                      ],
                    }),
            ],
          }),
        ],
      })
    }
    function ah() {
      let a = (0, e.useSession)(),
        b = (0, f.useRouter)(),
        { profile: c, isLoading: l, isCustomer: n } = (0, k.useProfile)(),
        { pets: o, isInitialLoading: p } = m({ enabled: c && n })
      return ((0, g.useEffect)(() => {
        ;(a.data || b.push('/auth/signin'), c && !n && b.push('/dashboard'))
      }, [a.data, c, n, b]),
      a.isPending || p || l || !c || !o)
        ? (0, d.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, d.jsx)(j.LoadingSpinner, { size: 'lg' }),
          })
        : 0 === o.length
          ? (0, d.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, d.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, d.jsx)('div', {
                    className: 'container mx-auto px-4 py-4',
                    children: (0, d.jsx)('h1', {
                      className: 'text-foreground text-2xl font-bold',
                      children: '새 예약',
                    }),
                  }),
                }),
                (0, d.jsx)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: (0, d.jsxs)('div', {
                    className: 'mx-auto max-w-md text-center',
                    children: [
                      (0, d.jsx)('div', {
                        className:
                          'bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
                        children: (0, d.jsx)('svg', {
                          className: 'text-muted-foreground h-8 w-8',
                          fill: 'none',
                          stroke: 'currentColor',
                          viewBox: '0 0 24 24',
                          children: (0, d.jsx)('path', {
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: 2,
                            d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                          }),
                        }),
                      }),
                      (0, d.jsx)('h3', {
                        className: 'text-foreground mb-2 text-lg font-medium',
                        children: '등록된 반려동물이 없습니다',
                      }),
                      (0, d.jsx)('p', {
                        className: 'text-muted-foreground mb-4',
                        children: '예약을 하기 위해서는 먼저 반려동물을 등록해야 합니다.',
                      }),
                      (0, d.jsx)(i.Button, {
                        asChild: !0,
                        children: (0, d.jsx)(h.default, {
                          href: '/customer/pets',
                          children: '반려동물 등록',
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            })
          : (0, d.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, d.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, d.jsx)('div', {
                    className: 'container mx-auto px-4 py-4',
                    children: (0, d.jsx)('div', {
                      className: 'flex items-center justify-between',
                      children: (0, d.jsx)(i.Button, {
                        variant: 'outline',
                        asChild: !0,
                        children: (0, d.jsx)(h.default, {
                          href: '/customer/bookings',
                          children: '예약 내역',
                        }),
                      }),
                    }),
                  }),
                }),
                (0, d.jsx)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: (0, d.jsx)(ag, { pets: o, profile: c }),
                }),
              ],
            })
    }
    a.s(['default', () => ah], 159045)
  },
]

//# sourceMappingURL=src_app_booking_new_page_tsx_c82b08e6._.js.map
