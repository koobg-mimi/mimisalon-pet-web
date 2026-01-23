module.exports = [
  240777,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(529139),
      d = a.i(205138),
      e = a.i(50944),
      f = a.i(170106)
    let g = (0, f.default)('arrow-right', [
      ['path', { d: 'M5 12h14', key: '1ays0h' }],
      ['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }],
    ])
    var h = a.i(941675),
      i = a.i(431067),
      j = a.i(699570),
      k = a.i(591119)
    function l() {
      let { data: a } = (0, c.useSession)(),
        d = (0, e.useRouter)(),
        f = () => {
          a?.user ? d.push('/booking/new') : d.push('/auth/signin?callbackUrl=/booking/new')
        },
        l = !!a?.user,
        m = a?.user
      return (0, b.jsx)('section', {
        'data-cy': 'cta',
        className: 'container mx-auto px-4 py-16',
        children: (0, b.jsx)('div', {
          className: 'mx-auto max-w-5xl',
          children: (0, b.jsxs)(k.Card, {
            className:
              'from-primary via-primary to-primary/90 relative overflow-hidden bg-gradient-to-br text-white',
            children: [
              (0, b.jsx)('div', {
                className:
                  'absolute inset-0 -skew-y-1 transform bg-gradient-to-r from-transparent via-white/5 to-transparent',
              }),
              (0, b.jsx)('div', {
                className:
                  'absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 transform rounded-full bg-white/10 blur-3xl',
              }),
              (0, b.jsx)('div', {
                className:
                  'absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24 transform rounded-full bg-white/10 blur-3xl',
              }),
              (0, b.jsx)(k.CardContent, {
                className: 'relative p-8 text-center sm:p-12',
                children: (0, b.jsxs)('div', {
                  className: 'space-y-8',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'space-y-4',
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'text-3xl leading-tight font-bold text-white sm:text-4xl',
                          children: '우리 아이를 위한 특별한 케어',
                        }),
                        (0, b.jsxs)('p', {
                          className:
                            'mx-auto max-w-2xl text-lg leading-relaxed text-white/95 sm:text-xl',
                          children: [
                            '우리 아이에게 최고의 미용 서비스를 제공합니다.',
                            (0, b.jsx)('br', { className: 'hidden sm:block' }),
                            '지금 예약하고 특별한 경험을 선사해보세요.',
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsx)('div', {
                      className:
                        'mx-auto flex max-w-lg flex-col items-center justify-center gap-4 sm:flex-row',
                      children:
                        l && m
                          ? (0, b.jsxs)(j.Button, {
                              size: 'xl',
                              variant: 'outline',
                              onClick: f,
                              className:
                                'text-primary hover:shadow-3xl group h-auto w-full transform border-2 border-white bg-white px-8 py-4 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 sm:w-auto',
                              'aria-label': '지금 바로 펫 미용 예약하기',
                              children: [
                                (0, b.jsx)(h.Calendar, { className: 'mr-3 h-6 w-6' }),
                                '지금 바로 예약하기',
                                (0, b.jsx)(g, {
                                  className:
                                    'ml-3 h-6 w-6 transition-transform group-hover:translate-x-1',
                                }),
                              ],
                            })
                          : (0, b.jsxs)('div', {
                              className: 'flex w-full flex-col gap-3 sm:w-auto sm:flex-row',
                              children: [
                                (0, b.jsxs)(j.Button, {
                                  size: 'xl',
                                  variant: 'outline',
                                  onClick: f,
                                  className:
                                    'text-primary hover:shadow-3xl group h-auto w-full transform border-2 border-white bg-white px-8 py-4 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 sm:w-auto',
                                  'aria-label': '펫 미용 예약하기',
                                  children: [
                                    (0, b.jsx)(h.Calendar, { className: 'mr-3 h-6 w-6' }),
                                    '예약하기',
                                    (0, b.jsx)(g, {
                                      className:
                                        'ml-3 h-6 w-6 transition-transform group-hover:translate-x-1',
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)(j.Button, {
                                  size: 'xl',
                                  variant: 'ghost',
                                  onClick: () => {
                                    if (a?.user) {
                                      let b = a.user.role
                                      'ADMIN' === b
                                        ? d.push('/admin/dashboard/overview')
                                        : 'GROOMER' === b
                                          ? d.push('/groomer/dashboard/overview')
                                          : 'CUSTOMER' === b &&
                                            d.push('/customer/dashboard/overview')
                                    } else d.push('/auth/signin')
                                  },
                                  className:
                                    'h-auto w-full border-2 border-white/80 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20 sm:w-auto',
                                  'aria-label': '로그인하기',
                                  children: [
                                    (0, b.jsx)(i.LogIn, { className: 'mr-3 h-5 w-5' }),
                                    '로그인하기',
                                  ],
                                }),
                              ],
                            }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      })
    }
    let m = (0, f.default)('building', [
      ['path', { d: 'M12 10h.01', key: '1nrarc' }],
      ['path', { d: 'M12 14h.01', key: '1etili' }],
      ['path', { d: 'M12 6h.01', key: '1vi96p' }],
      ['path', { d: 'M16 10h.01', key: '1m94wz' }],
      ['path', { d: 'M16 14h.01', key: '1gbofw' }],
      ['path', { d: 'M16 6h.01', key: '1x0f13' }],
      ['path', { d: 'M8 10h.01', key: '19clt8' }],
      ['path', { d: 'M8 14h.01', key: '6423bh' }],
      ['path', { d: 'M8 6h.01', key: '1dz90k' }],
      ['path', { d: 'M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3', key: 'cabbwy' }],
      ['rect', { x: '4', y: '2', width: '16', height: '20', rx: '2', key: '1uxh74' }],
    ])
    var n = a.i(992258),
      o = a.i(963519),
      p = a.i(73570),
      q = a.i(571987),
      r = a.i(238246),
      s = a.i(416025)
    function t() {
      return (
        s.CUSTOMER_SERVICE.PHONE,
        (0, b.jsx)('footer', {
          'data-cy': 'footer',
          className: 'bg-card border-t',
          children: (0, b.jsxs)('div', {
            className: 'container mx-auto px-4 py-12',
            children: [
              (0, b.jsxs)('div', {
                className: 'mb-8 grid grid-cols-1 gap-8 lg:grid-cols-4',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'space-y-4',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'flex items-center space-x-3',
                        children: [
                          (0, b.jsx)('div', {
                            className:
                              'border-primary/20 flex h-8 w-8 items-center justify-center rounded-md border bg-white p-1',
                            children: (0, b.jsx)(q.default, {
                              src: '/icon.svg',
                              alt: '미미살롱펫 로고',
                              width: 24,
                              height: 24,
                              className: 'h-full w-full object-contain',
                              priority: !0,
                            }),
                          }),
                          (0, b.jsx)('span', {
                            className: 'text-primary text-lg font-bold',
                            children: '미미살롱펫',
                          }),
                        ],
                      }),
                      (0, b.jsx)('p', {
                        className: 'text-muted-foreground text-sm',
                        children: '프리미엄 방문 반려동물 미용 서비스',
                      }),
                      (0, b.jsx)('p', {
                        className: 'text-muted-foreground text-sm',
                        children: '우리 아이를 위한 최고의 케어를 집에서 편안하게 받으세요.',
                      }),
                    ],
                  }),
                  (0, b.jsx)('div', { className: 'hidden lg:block' }),
                  (0, b.jsxs)('div', {
                    className: 'space-y-4',
                    children: [
                      (0, b.jsx)('h4', { className: 'font-medium', children: '고객센터' }),
                      (0, b.jsxs)('div', {
                        className: 'text-muted-foreground space-y-2 text-sm',
                        children: [
                          (0, b.jsxs)('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              (0, b.jsx)(o.Phone, { className: 'h-4 w-4' }),
                              (0, b.jsx)('span', { children: '+82-10-4043-9775' }),
                            ],
                          }),
                          (0, b.jsxs)('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              (0, b.jsx)(n.Mail, { className: 'h-4 w-4' }),
                              (0, b.jsx)('span', { children: 'koobg@mimisalon.pet' }),
                            ],
                          }),
                          (0, b.jsx)('div', { children: '운영시간: 평일 09:00 - 18:00' }),
                          (0, b.jsx)('div', { children: '주말 및 공휴일 휴무' }),
                        ],
                      }),
                    ],
                  }),
                  (0, b.jsxs)('div', {
                    className: 'space-y-4',
                    children: [
                      (0, b.jsx)('h4', { className: 'font-medium', children: '정책 및 약관' }),
                      (0, b.jsxs)('div', {
                        className: 'space-y-2 text-sm',
                        children: [
                          (0, b.jsx)(r.default, {
                            href: '/terms?tab=service',
                            className:
                              'text-muted-foreground hover:text-primary block transition-colors',
                            children: '이용약관',
                          }),
                          (0, b.jsx)(r.default, {
                            href: '/terms?tab=privacy',
                            className:
                              'text-muted-foreground hover:text-primary block transition-colors',
                            children: '개인정보처리방침',
                          }),
                          (0, b.jsx)(r.default, {
                            href: '/terms?tab=partner',
                            className:
                              'text-muted-foreground hover:text-primary block transition-colors',
                            children: '파트너 약관',
                          }),
                          (0, b.jsx)(r.default, {
                            href: '/terms?tab=payment',
                            className:
                              'text-muted-foreground hover:text-primary block transition-colors',
                            children: '취소/환불 정책',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, b.jsxs)('div', {
                className: 'border-t pt-8',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'grid grid-cols-1 gap-6 lg:grid-cols-2',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'space-y-2',
                        children: [
                          (0, b.jsxs)('div', {
                            className: 'mb-3 flex items-center gap-2',
                            children: [
                              (0, b.jsx)(m, { className: 'text-muted-foreground h-4 w-4' }),
                              (0, b.jsx)('span', {
                                className: 'text-sm font-medium',
                                children: '기업정보',
                              }),
                            ],
                          }),
                          (0, b.jsxs)('div', {
                            className:
                              'text-muted-foreground grid grid-cols-1 gap-2 text-xs sm:grid-cols-2',
                            children: [
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '회사명:',
                                  }),
                                  ' 주식회사 미미펫',
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '대표자:',
                                  }),
                                  ' 구본기',
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '사업자등록번호:',
                                  }),
                                  ' 828-87-00919',
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '통신판매업신고:',
                                  }),
                                  ' 제2017-서울동작-0000호',
                                ],
                              }),
                            ],
                          }),
                          (0, b.jsx)('div', {
                            className: 'text-muted-foreground mt-2 text-xs',
                            children: (0, b.jsxs)('div', {
                              className: 'flex items-start gap-1',
                              children: [
                                (0, b.jsx)('span', { className: 'font-medium', children: '주소:' }),
                                (0, b.jsx)('span', {
                                  children: '서울특별시 동작구 사당로 65-1 (상도동)',
                                }),
                              ],
                            }),
                          }),
                          (0, b.jsxs)('div', {
                            className: 'text-muted-foreground text-xs',
                            children: [
                              (0, b.jsx)('span', {
                                className: 'font-medium',
                                children: '개인정보보호책임자:',
                              }),
                              ' 구본기 (koobg@mimisalon.pet)',
                            ],
                          }),
                        ],
                      }),
                      (0, b.jsxs)('div', {
                        className: 'space-y-2',
                        children: [
                          (0, b.jsxs)('div', {
                            className: 'text-muted-foreground text-xs',
                            children: [
                              (0, b.jsxs)('div', {
                                className: 'mb-2',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '호스팅 서비스:',
                                  }),
                                  ' Google Cloud Platform (GCP)',
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                className: 'mb-2',
                                children: [
                                  (0, b.jsx)('span', {
                                    className: 'font-medium',
                                    children: '결제대행사:',
                                  }),
                                  ' 토스페이먼츠',
                                ],
                              }),
                              (0, b.jsx)('div', {
                                className: 'mb-3',
                                children:
                                  '미미살롱펫은 통신판매중개자로서 통신판매의 당사자가 아니며, 미용사가 등록한 상품정보 및 거래에 대해 미미살롱펫은 책임을 지지 않습니다.',
                              }),
                            ],
                          }),
                          (0, b.jsx)('div', {
                            className: 'text-muted-foreground text-xs',
                            children: '© 2025 mimipet Co., Ltd. All rights reserved.',
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, b.jsx)('div', {
                    className: 'mt-4 border-t pt-4',
                    children: (0, b.jsxs)(r.default, {
                      href: '/error-report',
                      className:
                        'text-muted-foreground hover:text-primary flex items-center gap-2 text-xs transition-colors',
                      children: [
                        (0, b.jsx)(p.AlertTriangle, { className: 'h-3 w-3' }),
                        (0, b.jsx)('span', { children: '문제 신고하기' }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        })
      )
    }
    var u = a.i(572131),
      v = a.i(681010)
    let w = (0, f.default)('menu', [
      ['path', { d: 'M4 5h16', key: '1tepv9' }],
      ['path', { d: 'M4 12h16', key: '1lakjw' }],
      ['path', { d: 'M4 19h16', key: '1djgab' }],
    ])
    var x = a.i(633508)
    function y() {
      let { data: a } = (0, c.useSession)(),
        d = (0, e.useRouter)(),
        [f, g] = (0, u.useState)(!1),
        k = () => {
          if (a?.user) {
            let b = a.user.role
            'ADMIN' === b
              ? d.push('/admin/dashboard/overview')
              : 'GROOMER' === b
                ? d.push('/groomer/dashboard/overview')
                : 'CUSTOMER' === b && d.push('/customer/dashboard/overview')
          } else d.push('/auth/signin')
        },
        l = () => {
          a?.user ? d.push('/booking/new') : d.push('/auth/signin?callbackUrl=/booking/new')
        },
        m = !!a?.user,
        n = a?.user
      return (0, b.jsx)('header', {
        className: 'bg-card sticky top-0 z-50 border-b',
        'data-cy': 'header',
        children: (0, b.jsxs)('div', {
          className: 'container mx-auto px-4 py-3 sm:py-4',
          children: [
            (0, b.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                (0, b.jsxs)('div', {
                  className: 'flex items-center space-x-3 sm:space-x-4',
                  children: [
                    (0, b.jsx)('div', {
                      className:
                        'ring-border flex h-11 w-11 items-center justify-center rounded-md bg-white p-1 shadow-sm ring-1 sm:h-12 sm:w-12',
                      children: (0, b.jsx)(q.default, {
                        src: '/icon.svg',
                        alt: '미미살롱펫 로고',
                        width: 40,
                        height: 40,
                        className: 'h-full w-full object-contain',
                        priority: !0,
                      }),
                    }),
                    (0, b.jsxs)('div', {
                      children: [
                        (0, b.jsx)('h1', {
                          className: 'text-primary text-lg font-bold sm:text-2xl',
                          children: '미미살롱펫',
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground hidden text-xs sm:block sm:text-sm',
                          children: '프리미엄 방문 반려동물 미용',
                        }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsx)('div', {
                  className: 'hidden items-center space-x-3 md:flex',
                  children:
                    m && n
                      ? (0, b.jsxs)('div', {
                          className: 'flex items-center space-x-4',
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'bg-secondary/50 rounded-lg border px-3 py-2 text-sm',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-muted-foreground',
                                  children: '안녕하세요, ',
                                }),
                                (0, b.jsxs)('span', {
                                  className: 'text-primary font-semibold',
                                  children: [n.name, '님'],
                                }),
                              ],
                            }),
                            (0, b.jsxs)(j.Button, {
                              variant: 'outline',
                              size: 'default',
                              onClick: k,
                              className: 'font-medium',
                              'aria-label':
                                'CUSTOMER' === n.role ? '예약현황으로 이동' : '대시보드로 이동',
                              children: [
                                (0, b.jsx)(v.Home, { className: 'mr-2 h-4 w-4' }),
                                'CUSTOMER' === n.role ? '예약현황' : '대시보드',
                              ],
                            }),
                            (0, b.jsxs)(j.Button, {
                              variant: 'cta',
                              size: 'default',
                              onClick: l,
                              className: 'font-semibold shadow-lg',
                              'aria-label': '펫 미용 예약하기',
                              children: [
                                (0, b.jsx)(h.Calendar, { className: 'mr-2 h-4 w-4' }),
                                '예약하기',
                              ],
                            }),
                          ],
                        })
                      : (0, b.jsxs)('div', {
                          className: 'flex items-center space-x-3',
                          children: [
                            (0, b.jsxs)(j.Button, {
                              variant: 'outline',
                              size: 'default',
                              onClick: k,
                              className: 'font-medium',
                              'aria-label': '로그인 페이지로 이동',
                              children: [
                                (0, b.jsx)(i.LogIn, { className: 'mr-2 h-4 w-4' }),
                                '로그인',
                              ],
                            }),
                            (0, b.jsxs)(j.Button, {
                              variant: 'cta',
                              size: 'default',
                              onClick: l,
                              className: 'font-semibold shadow-lg',
                              'aria-label': '펫 미용 예약하기',
                              children: [
                                (0, b.jsx)(h.Calendar, { className: 'mr-2 h-4 w-4' }),
                                '예약하기',
                              ],
                            }),
                          ],
                        }),
                }),
                (0, b.jsx)('div', {
                  className: 'flex items-center space-x-2 md:hidden',
                  children: (0, b.jsx)(j.Button, {
                    variant: 'ghost',
                    size: 'icon-sm',
                    onClick: () => g(!f),
                    'aria-label': f ? '메뉴 닫기' : '메뉴 열기',
                    'aria-expanded': f,
                    className: 'hover:bg-accent/80 focus:bg-accent/80 relative rounded-lg',
                    children: (0, b.jsxs)('div', {
                      className: 'relative h-5 w-5',
                      children: [
                        (0, b.jsx)(w, {
                          className: `absolute h-5 w-5 transition-all duration-300 ${f ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`,
                        }),
                        (0, b.jsx)(x.X, {
                          className: `absolute h-5 w-5 transition-all duration-300 ${f ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'}`,
                        }),
                      ],
                    }),
                  }),
                }),
              ],
            }),
            (0, b.jsx)('div', {
              className: `overflow-hidden transition-all duration-300 ease-in-out md:hidden ${f ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`,
              children: (0, b.jsx)('div', {
                className: 'border-border mt-4 border-t pb-4',
                children: (0, b.jsx)('div', {
                  className: 'flex flex-col space-y-3 pt-4',
                  children:
                    m && n
                      ? (0, b.jsxs)(b.Fragment, {
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'bg-secondary/30 mx-2 rounded-lg border px-4 py-3 text-sm',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-muted-foreground',
                                  children: '안녕하세요, ',
                                }),
                                (0, b.jsxs)('span', {
                                  className: 'text-primary font-semibold',
                                  children: [n.name, '님'],
                                }),
                              ],
                            }),
                            (0, b.jsxs)(j.Button, {
                              variant: 'outline',
                              size: 'lg',
                              onClick: () => {
                                ;(k(), g(!1))
                              },
                              className: 'mx-2 justify-start font-medium',
                              'aria-label':
                                'CUSTOMER' === n.role ? '예약현황으로 이동' : '대시보드로 이동',
                              children: [
                                (0, b.jsx)(v.Home, { className: 'mr-3 h-5 w-5' }),
                                'CUSTOMER' === n.role ? '예약현황' : '대시보드',
                              ],
                            }),
                            (0, b.jsxs)(j.Button, {
                              variant: 'mobile-primary',
                              size: 'lg',
                              onClick: () => {
                                ;(l(), g(!1))
                              },
                              className: 'mx-2 justify-start shadow-lg',
                              'aria-label': '펫 미용 예약하기',
                              children: [
                                (0, b.jsx)(h.Calendar, { className: 'mr-3 h-5 w-5' }),
                                '예약하기',
                              ],
                            }),
                          ],
                        })
                      : (0, b.jsxs)(b.Fragment, {
                          children: [
                            (0, b.jsxs)(j.Button, {
                              variant: 'outline',
                              size: 'lg',
                              onClick: () => {
                                ;(k(), g(!1))
                              },
                              className: 'mx-2 justify-start font-medium',
                              'aria-label': '로그인 페이지로 이동',
                              children: [
                                (0, b.jsx)(i.LogIn, { className: 'mr-3 h-5 w-5' }),
                                '로그인',
                              ],
                            }),
                            (0, b.jsxs)(j.Button, {
                              variant: 'mobile-primary',
                              size: 'lg',
                              onClick: () => {
                                ;(l(), g(!1))
                              },
                              className: 'mx-2 justify-start shadow-lg',
                              'aria-label': '펫 미용 예약하기',
                              children: [
                                (0, b.jsx)(h.Calendar, { className: 'mr-3 h-5 w-5' }),
                                '예약하기',
                              ],
                            }),
                          ],
                        }),
                }),
              }),
            }),
          ],
        }),
      })
    }
    function z() {
      return (0, b.jsxs)('div', {
        className: 'bg-background min-h-screen',
        'data-cy': 'landing-page',
        children: [
          (0, b.jsx)(y, {}),
          (0, b.jsx)('section', {
            className: 'container mx-auto px-4 py-16 sm:py-20',
            children: (0, b.jsxs)('div', {
              className: 'mx-auto max-w-5xl',
              children: [
                (0, b.jsxs)('div', {
                  className: 'mb-12 text-center',
                  children: [
                    (0, b.jsx)('h2', {
                      className: 'mb-4 text-4xl font-bold text-gray-900 sm:text-5xl',
                      children: '미용 스트레스는 가라!!',
                    }),
                    (0, b.jsx)('div', {
                      className:
                        'from-primary/50 via-primary to-primary/50 mx-auto h-1 w-24 bg-linear-to-r',
                    }),
                  ],
                }),
                (0, b.jsxs)(k.Card, {
                  className:
                    'relative overflow-hidden border-none bg-linear-to-br from-purple-50/50 via-white to-pink-50/30 shadow-xl',
                  children: [
                    (0, b.jsx)('div', {
                      className:
                        'from-primary/10 absolute top-0 right-0 h-40 w-40 translate-x-20 -translate-y-20 transform rounded-full bg-linear-to-br to-purple-200/20 blur-3xl',
                    }),
                    (0, b.jsx)('div', {
                      className:
                        'to-primary/10 absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 transform rounded-full bg-linear-to-br from-pink-200/20 blur-3xl',
                    }),
                    (0, b.jsx)(k.CardContent, {
                      className: 'relative space-y-6 p-8 sm:p-12',
                      children: (0, b.jsxs)('div', {
                        className: 'text-lg leading-relaxed text-gray-700',
                        children: [
                          (0, b.jsxs)('p', {
                            className: 'mb-6',
                            children: [
                              '안심 방문 미용 서비스',
                              ' ',
                              (0, b.jsx)('span', {
                                className: 'text-primary font-semibold',
                                children: "'미미살롱펫'",
                              }),
                              '은',
                              ' ',
                              (0, b.jsx)('span', {
                                className: 'font-semibold',
                                children: '2017년 11월 서비스 개시 후',
                              }),
                            ],
                          }),
                          (0, b.jsxs)('p', {
                            className: 'mb-6',
                            children: [
                              '강아지, 고양이들의 미용 스트레스 해소의 가장 좋은 방법은',
                              ' ',
                              (0, b.jsx)('span', {
                                className: 'text-primary font-semibold',
                                children:
                                  '가장 익숙한 공간(집)에서 미용을 하고 보호자가 근처에 있거나 함께 미용을 하는 것',
                              }),
                              '입니다.',
                            ],
                          }),
                          (0, b.jsxs)('p', {
                            children: [
                              '미미살롱펫은 강아지, 고양이가',
                              ' ',
                              (0, b.jsx)('span', {
                                className: 'font-semibold text-purple-600',
                                children: '멋진 미용보다는 편안한 미용',
                              }),
                              '을 추구합니다.',
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
          }),
          (0, b.jsx)(l, {}),
          (0, b.jsx)(t, {}),
        ],
      })
    }
    function A() {
      return (0, c.useSession)().isPending
        ? (0, b.jsx)('div', {
            className: 'bg-background flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(d.LoadingSpinner, { size: 'lg' }),
          })
        : (0, b.jsx)(z, {})
    }
    a.s(['default', () => A], 240777)
  },
]

//# sourceMappingURL=src_app_page_tsx_a7111f3e._.js.map
