module.exports = [
  327520,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(50944),
      d = a.i(529139),
      e = a.i(681010),
      f = a.i(170106)
    let g = (0, f.default)('log-out', [
      ['path', { d: 'm16 17 5-5-5-5', key: '1bji2h' }],
      ['path', { d: 'M21 12H9', key: 'dn1m92' }],
      ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', key: '1uf3rs' }],
    ])
    var h = a.i(920140),
      i = a.i(451933),
      j = a.i(603314),
      k = a.i(808406),
      l = a.i(572131),
      m = a.i(941675),
      n = a.i(641710),
      o = a.i(911156),
      p = a.i(790166)
    let q = (0, f.default)('settings-2', [
      ['path', { d: 'M14 17H5', key: 'gfn3mx' }],
      ['path', { d: 'M19 7h-9', key: '6i9tg' }],
      ['circle', { cx: '17', cy: '17', r: '3', key: '18b49y' }],
      ['circle', { cx: '7', cy: '7', r: '3', key: 'dfmy0x' }],
    ])
    var r = a.i(821374),
      s = a.i(147271),
      t = a.i(546842),
      u = a.i(28379),
      v = a.i(660246),
      w = a.i(238246),
      x = a.i(50522),
      y = a.i(421234),
      z = a.i(811011),
      A = a.i(400187)
    let B = (0, f.default)('panel-left', [
      ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
      ['path', { d: 'M9 3v18', key: 'fh3hqa' }],
    ])
    var C = a.i(368114),
      D = a.i(699570)
    ;(a.i(866718), a.i(505084))
    var E = a.i(897942),
      F = a.i(422262)
    function G({ ...a }) {
      return (0, b.jsx)(E.Root, { 'data-slot': 'sheet', ...a })
    }
    function H({ ...a }) {
      return (0, b.jsx)(E.Portal, { 'data-slot': 'sheet-portal', ...a })
    }
    function I({ className: a, ...c }) {
      return (0, b.jsx)(E.Overlay, {
        'data-slot': 'sheet-overlay',
        className: (0, C.cn)(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
          a
        ),
        ...c,
      })
    }
    function J({ className: a, children: c, side: d = 'right', ...e }) {
      return (0, b.jsxs)(H, {
        children: [
          (0, b.jsx)(I, {}),
          (0, b.jsxs)(E.Content, {
            'data-slot': 'sheet-content',
            className: (0, C.cn)(
              'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
              'right' === d &&
                'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
              'left' === d &&
                'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
              'top' === d &&
                'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
              'bottom' === d &&
                'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
              a
            ),
            ...e,
            children: [
              c,
              (0, b.jsxs)(E.Close, {
                className:
                  'ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none',
                children: [
                  (0, b.jsx)(F.XIcon, { className: 'size-4' }),
                  (0, b.jsx)('span', { className: 'sr-only', children: 'Close' }),
                ],
              }),
            ],
          }),
        ],
      })
    }
    function K({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'sheet-header',
        className: (0, C.cn)('flex flex-col gap-1.5 p-4', a),
        ...c,
      })
    }
    function L({ className: a, ...c }) {
      return (0, b.jsx)(E.Title, {
        'data-slot': 'sheet-title',
        className: (0, C.cn)('text-foreground font-semibold', a),
        ...c,
      })
    }
    function M({ className: a, ...c }) {
      return (0, b.jsx)(E.Description, {
        'data-slot': 'sheet-description',
        className: (0, C.cn)('text-muted-foreground text-sm', a),
        ...c,
      })
    }
    function N({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'skeleton',
        className: (0, C.cn)('bg-accent animate-pulse rounded-md', a),
        ...c,
      })
    }
    var O = a.i(785259)
    let P = l.createContext(null)
    function Q() {
      let a = l.useContext(P)
      if (!a) throw Error('useSidebar must be used within a SidebarProvider.')
      return a
    }
    function R({
      defaultOpen: a = !0,
      open: c,
      onOpenChange: d,
      className: e,
      style: f,
      children: g,
      ...h
    }) {
      let i = (function () {
          let [a, b] = l.useState(void 0)
          return (
            l.useEffect(() => {
              let a = window.matchMedia('(max-width: 767px)'),
                c = () => {
                  b(window.innerWidth < 768)
                }
              return (
                a.addEventListener('change', c),
                b(window.innerWidth < 768),
                () => a.removeEventListener('change', c)
              )
            }, []),
            !!a
          )
        })(),
        [j, k] = l.useState(!1),
        [m, n] = l.useState(a),
        o = c ?? m,
        p = l.useCallback(
          (a) => {
            let b = 'function' == typeof a ? a(o) : a
            ;(d ? d(b) : n(b), (document.cookie = `sidebar_state=${b}; path=/; max-age=604800`))
          },
          [d, o]
        ),
        q = l.useCallback(() => (i ? k((a) => !a) : p((a) => !a)), [i, p, k])
      l.useEffect(() => {
        let a = (a) => {
          'b' === a.key && (a.metaKey || a.ctrlKey) && (a.preventDefault(), q())
        }
        return (
          window.addEventListener('keydown', a),
          () => window.removeEventListener('keydown', a)
        )
      }, [q])
      let r = o ? 'expanded' : 'collapsed',
        s = l.useMemo(
          () => ({
            state: r,
            open: o,
            setOpen: p,
            isMobile: i,
            openMobile: j,
            setOpenMobile: k,
            toggleSidebar: q,
          }),
          [r, o, p, i, j, k, q]
        )
      return (0, b.jsx)(P.Provider, {
        value: s,
        children: (0, b.jsx)(O.TooltipProvider, {
          delayDuration: 0,
          children: (0, b.jsx)('div', {
            'data-slot': 'sidebar-wrapper',
            style: { '--sidebar-width': '16rem', '--sidebar-width-icon': '3rem', ...f },
            className: (0, C.cn)(
              'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
              e
            ),
            ...h,
            children: g,
          }),
        }),
      })
    }
    function S({
      side: a = 'left',
      variant: c = 'sidebar',
      collapsible: d = 'offcanvas',
      className: e,
      children: f,
      ...g
    }) {
      let { isMobile: h, state: i, openMobile: j, setOpenMobile: k } = Q()
      return 'none' === d
        ? (0, b.jsx)('div', {
            'data-slot': 'sidebar',
            className: (0, C.cn)(
              'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
              e
            ),
            ...g,
            children: f,
          })
        : h
          ? (0, b.jsx)(G, {
              open: j,
              onOpenChange: k,
              ...g,
              children: (0, b.jsxs)(J, {
                'data-sidebar': 'sidebar',
                'data-slot': 'sidebar',
                'data-mobile': 'true',
                className:
                  'bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden',
                style: { '--sidebar-width': '18rem' },
                side: a,
                children: [
                  (0, b.jsxs)(K, {
                    className: 'sr-only',
                    children: [
                      (0, b.jsx)(L, { children: 'Sidebar' }),
                      (0, b.jsx)(M, { children: 'Displays the mobile sidebar.' }),
                    ],
                  }),
                  (0, b.jsx)('div', { className: 'flex h-full w-full flex-col', children: f }),
                ],
              }),
            })
          : (0, b.jsxs)('div', {
              className: 'group peer text-sidebar-foreground hidden md:block',
              'data-state': i,
              'data-collapsible': 'collapsed' === i ? d : '',
              'data-variant': c,
              'data-side': a,
              'data-slot': 'sidebar',
              children: [
                (0, b.jsx)('div', {
                  'data-slot': 'sidebar-gap',
                  className: (0, C.cn)(
                    'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    'group-data-[side=right]:rotate-180',
                    'floating' === c || 'inset' === c
                      ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
                      : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
                  ),
                }),
                (0, b.jsx)('div', {
                  'data-slot': 'sidebar-container',
                  className: (0, C.cn)(
                    'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
                    'left' === a
                      ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
                      : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
                    'floating' === c || 'inset' === c
                      ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                      : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
                    e
                  ),
                  ...g,
                  children: (0, b.jsx)('div', {
                    'data-sidebar': 'sidebar',
                    'data-slot': 'sidebar-inner',
                    className:
                      'bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm',
                    children: f,
                  }),
                }),
              ],
            })
    }
    function T({ className: a, onClick: c, ...d }) {
      let { toggleSidebar: e } = Q()
      return (0, b.jsxs)(D.Button, {
        'data-sidebar': 'trigger',
        'data-slot': 'sidebar-trigger',
        variant: 'ghost',
        size: 'icon',
        className: (0, C.cn)('size-7', a),
        onClick: (a) => {
          ;(c?.(a), e())
        },
        ...d,
        children: [
          (0, b.jsx)(B, {}),
          (0, b.jsx)('span', { className: 'sr-only', children: 'Toggle Sidebar' }),
        ],
      })
    }
    function U({ className: a, ...c }) {
      let { toggleSidebar: d } = Q()
      return (0, b.jsx)('button', {
        'data-sidebar': 'rail',
        'data-slot': 'sidebar-rail',
        'aria-label': 'Toggle Sidebar',
        tabIndex: -1,
        onClick: d,
        title: 'Toggle Sidebar',
        className: (0, C.cn)(
          'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
          'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
          '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
          'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
          '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
          '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
          a
        ),
        ...c,
      })
    }
    function V({ className: a, ...c }) {
      return (0, b.jsx)('main', {
        'data-slot': 'sidebar-inset',
        className: (0, C.cn)(
          'bg-background relative flex w-full flex-1 flex-col',
          'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
          a
        ),
        ...c,
      })
    }
    function W({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'sidebar-header',
        'data-sidebar': 'header',
        className: (0, C.cn)('flex flex-col gap-2 p-2', a),
        ...c,
      })
    }
    function X({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'sidebar-footer',
        'data-sidebar': 'footer',
        className: (0, C.cn)('flex flex-col gap-2 p-2', a),
        ...c,
      })
    }
    function Y({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'sidebar-content',
        'data-sidebar': 'content',
        className: (0, C.cn)(
          'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
          a
        ),
        ...c,
      })
    }
    function Z({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'sidebar-group',
        'data-sidebar': 'group',
        className: (0, C.cn)('relative flex w-full min-w-0 flex-col p-2', a),
        ...c,
      })
    }
    function $({ className: a, ...c }) {
      return (0, b.jsx)('ul', {
        'data-slot': 'sidebar-menu',
        'data-sidebar': 'menu',
        className: (0, C.cn)('flex w-full min-w-0 flex-col gap-1', a),
        ...c,
      })
    }
    function _({ className: a, ...c }) {
      return (0, b.jsx)('li', {
        'data-slot': 'sidebar-menu-item',
        'data-sidebar': 'menu-item',
        className: (0, C.cn)('group/menu-item relative', a),
        ...c,
      })
    }
    let aa = (0, A.cva)(
      'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
      {
        variants: {
          variant: {
            default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            outline:
              'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
          },
          size: {
            default: 'h-8 text-sm',
            sm: 'h-7 text-xs',
            lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
          },
        },
        defaultVariants: { variant: 'default', size: 'default' },
      }
    )
    function ab({
      asChild: a = !1,
      isActive: c = !1,
      variant: d = 'default',
      size: e = 'default',
      tooltip: f,
      className: g,
      ...h
    }) {
      let i = a ? z.Slot : 'button',
        { isMobile: j, state: k } = Q(),
        l = (0, b.jsx)(i, {
          'data-slot': 'sidebar-menu-button',
          'data-sidebar': 'menu-button',
          'data-size': e,
          'data-active': c,
          className: (0, C.cn)(aa({ variant: d, size: e }), g),
          ...h,
        })
      return f
        ? ('string' == typeof f && (f = { children: f }),
          (0, b.jsxs)(O.Tooltip, {
            children: [
              (0, b.jsx)(O.TooltipTrigger, { asChild: !0, children: l }),
              (0, b.jsx)(O.TooltipContent, {
                side: 'right',
                align: 'center',
                hidden: 'collapsed' !== k || j,
                ...f,
              }),
            ],
          }))
        : l
    }
    function ac({ className: a, ...c }) {
      return (0, b.jsx)('ul', {
        'data-slot': 'sidebar-menu-sub',
        'data-sidebar': 'menu-sub',
        className: (0, C.cn)(
          'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
          'group-data-[collapsible=icon]:hidden',
          a
        ),
        ...c,
      })
    }
    function ad({ className: a, ...c }) {
      return (0, b.jsx)('li', {
        'data-slot': 'sidebar-menu-sub-item',
        'data-sidebar': 'menu-sub-item',
        className: (0, C.cn)('group/menu-sub-item relative', a),
        ...c,
      })
    }
    function ae({ asChild: a = !1, size: c = 'md', isActive: d = !1, className: e, ...f }) {
      let g = a ? z.Slot : 'a'
      return (0, b.jsx)(g, {
        'data-slot': 'sidebar-menu-sub-button',
        'data-sidebar': 'menu-sub-button',
        'data-size': c,
        'data-active': d,
        className: (0, C.cn)(
          'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
          'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
          'sm' === c && 'text-xs',
          'md' === c && 'text-sm',
          'group-data-[collapsible=icon]:hidden',
          e
        ),
        ...f,
      })
    }
    function af({ items: a }) {
      let d = (0, c.usePathname)(),
        [e, f] = (0, l.useState)({})
      return (
        (0, l.useEffect)(() => {
          let b = {}
          ;(a.forEach((a) => {
            let c = a.title,
              e = a.isActive || (a.items?.some((a) => d.startsWith(a.url)) ?? !1)
            b[c] = e
          }),
            f((a) => (Object.keys(b).some((c) => a[c] !== b[c]) ? { ...a, ...b } : a)))
        }, [d, a]),
        (0, b.jsx)(Z, {
          children: (0, b.jsx)($, {
            children: a.map((a) =>
              a.items && a.items.length > 0
                ? (0, b.jsx)(
                    y.Collapsible,
                    {
                      asChild: !0,
                      open: e[a.title] ?? !1,
                      onOpenChange: () => {
                        var b
                        return ((b = a.title), void f((a) => ({ ...a, [b]: !a[b] })))
                      },
                      className: 'group/collapsible',
                      children: (0, b.jsxs)(_, {
                        children: [
                          (0, b.jsx)(y.CollapsibleTrigger, {
                            asChild: !0,
                            children: (0, b.jsxs)(ab, {
                              tooltip: a.title,
                              children: [
                                a.icon && (0, b.jsx)(a.icon, {}),
                                (0, b.jsx)('span', { children: a.title }),
                                (0, b.jsx)(x.ChevronRight, {
                                  className:
                                    'ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90',
                                }),
                              ],
                            }),
                          }),
                          (0, b.jsx)(y.CollapsibleContent, {
                            children: (0, b.jsx)(ac, {
                              children: a.items.map((a) =>
                                (0, b.jsx)(
                                  ad,
                                  {
                                    children: (0, b.jsx)(ae, {
                                      asChild: !0,
                                      children: (0, b.jsx)(w.default, {
                                        href: a.url,
                                        children: (0, b.jsx)('span', { children: a.title }),
                                      }),
                                    }),
                                  },
                                  a.title
                                )
                              ),
                            }),
                          }),
                        ],
                      }),
                    },
                    a.title
                  )
                : (0, b.jsx)(
                    _,
                    {
                      children: (0, b.jsx)(ab, {
                        asChild: !0,
                        tooltip: a.title,
                        children: (0, b.jsxs)(w.default, {
                          href: a.url,
                          children: [
                            a.icon && (0, b.jsx)(a.icon, {}),
                            (0, b.jsx)('span', { children: a.title }),
                          ],
                        }),
                      }),
                    },
                    a.title
                  )
            ),
          }),
        })
      )
    }
    var ag = a.i(737539),
      ah = a.i(335732),
      ai = a.i(205138)
    function aj({ user: a }) {
      let { isMobile: c } = Q(),
        [e, f] = (0, l.useState)(!1),
        h = async () => {
          f(!0)
          try {
            ;(await d.authClient.signOut(), (window.location.href = '/auth/signin'))
          } catch (a) {
            ;(console.error('Logout failed:', a), f(!1))
          }
        }
      return (0, b.jsx)($, {
        children: (0, b.jsx)(_, {
          children: (0, b.jsxs)(ah.DropdownMenu, {
            children: [
              (0, b.jsx)(ah.DropdownMenuTrigger, {
                asChild: !0,
                children: (0, b.jsxs)(ab, {
                  size: 'lg',
                  className:
                    'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'grid flex-1 text-left text-sm leading-tight',
                      children: [
                        (0, b.jsx)('span', { className: 'truncate font-medium', children: a.name }),
                        (0, b.jsx)('span', { className: 'truncate text-xs', children: a.email }),
                      ],
                    }),
                    (0, b.jsx)(ag.ChevronsUpDown, { className: 'ml-auto size-4' }),
                  ],
                }),
              }),
              (0, b.jsxs)(ah.DropdownMenuContent, {
                className: 'w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg',
                side: c ? 'bottom' : 'right',
                align: 'end',
                sideOffset: 4,
                children: [
                  (0, b.jsx)(ah.DropdownMenuLabel, {
                    className: 'p-0 font-normal',
                    children: (0, b.jsx)('div', {
                      className: 'flex items-center gap-2 px-1 py-1.5 text-left text-sm',
                      children: (0, b.jsxs)('div', {
                        className: 'grid flex-1 text-left text-sm leading-tight',
                        children: [
                          (0, b.jsx)('span', {
                            className: 'truncate font-medium',
                            children: a.name,
                          }),
                          (0, b.jsx)('span', { className: 'truncate text-xs', children: a.email }),
                        ],
                      }),
                    }),
                  }),
                  (0, b.jsx)(ah.DropdownMenuSeparator, {}),
                  (0, b.jsx)(ah.DropdownMenuItem, {
                    onClick: h,
                    disabled: e,
                    className:
                      'focus:bg-destructive focus:text-destructive-foreground cursor-pointer',
                    children: e
                      ? (0, b.jsxs)(b.Fragment, {
                          children: [
                            (0, b.jsx)(ai.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                            '로그아웃 중...',
                          ],
                        })
                      : (0, b.jsxs)(b.Fragment, {
                          children: [(0, b.jsx)(g, { className: 'mr-2 h-4 w-4' }), '로그아웃'],
                        }),
                  }),
                ],
              }),
            ],
          }),
        }),
      })
    }
    function ak({ ...a }) {
      return (0, b.jsxs)(S, {
        collapsible: 'icon',
        ...a,
        children: [
          (0, b.jsx)(W, {
            children: (0, b.jsxs)('div', {
              className: 'flex items-center gap-2 p-2',
              children: [
                (0, b.jsx)(N, { className: 'h-8 w-8 rounded-full' }),
                (0, b.jsxs)('div', {
                  className: 'flex-1 space-y-1',
                  children: [
                    (0, b.jsx)(N, { className: 'h-4 w-24' }),
                    (0, b.jsx)(N, { className: 'h-3 w-16' }),
                  ],
                }),
              ],
            }),
          }),
          (0, b.jsx)(Y, {
            children: (0, b.jsx)('div', {
              className: 'space-y-2 p-2',
              children: Array.from({ length: 5 }).map((a, c) =>
                (0, b.jsxs)(
                  'div',
                  {
                    className: 'flex items-center gap-2 p-2',
                    children: [
                      (0, b.jsx)(N, { className: 'h-4 w-4' }),
                      (0, b.jsx)(N, { className: 'h-4 w-20' }),
                    ],
                  },
                  c
                )
              ),
            }),
          }),
          (0, b.jsx)(X, {
            children: (0, b.jsxs)('div', {
              className: 'flex items-center gap-2 p-2',
              children: [
                (0, b.jsx)(N, { className: 'h-8 w-8 rounded-full' }),
                (0, b.jsxs)('div', {
                  className: 'flex-1 space-y-1',
                  children: [
                    (0, b.jsx)(N, { className: 'h-4 w-16' }),
                    (0, b.jsx)(N, { className: 'h-3 w-24' }),
                  ],
                }),
              ],
            }),
          }),
          (0, b.jsx)(U, {}),
        ],
      })
    }
    var al = a.i(571987)
    function am({ teams: a }) {
      let [c] = l.useState(a[0])
      return c
        ? (0, b.jsx)($, {
            children: (0, b.jsx)(_, {
              children: (0, b.jsx)(ah.DropdownMenu, {
                children: (0, b.jsx)(ah.DropdownMenuTrigger, {
                  asChild: !0,
                  children: (0, b.jsxs)(ab, {
                    size: 'lg',
                    className:
                      'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                    children: [
                      (0, b.jsx)('div', {
                        className:
                          'flex aspect-square size-8 items-center justify-center rounded-lg',
                        children: (0, b.jsx)(al.default, {
                          src: '/icon.svg',
                          alt: '미미살롱펫 로고',
                          width: 32,
                          height: 32,
                          className:
                            'ring-border size-8 rounded-md bg-white object-contain p-0.5 shadow-sm ring-1 dark:bg-zinc-900',
                        }),
                      }),
                      (0, b.jsxs)('div', {
                        className: 'grid flex-1 text-left text-sm leading-tight',
                        children: [
                          (0, b.jsx)('span', {
                            className: 'truncate font-medium',
                            children: c.name,
                          }),
                          (0, b.jsx)('span', { className: 'truncate text-xs', children: c.plan }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
            }),
          })
        : null
    }
    let an = (a) => {
      let b = {
        user: {
          name: a?.name || '사용자',
          email: a?.email || '',
          avatar: a?.profileImage || '/default-avatar.png',
        },
        teams: [
          {
            name: '미미살롱펫',
            plan: (function (a) {
              switch (a?.toUpperCase()) {
                case 'CUSTOMER':
                  return '고객'
                case 'GROOMER':
                  return '미용사'
                case 'ADMIN':
                  return '관리자'
                default:
                  return '사용자'
              }
            })(a?.role),
          },
        ],
      }
      switch (a?.role?.toUpperCase()) {
        case 'CUSTOMER':
          return {
            ...b,
            navMain: [
              { title: '대시보드', icon: e.Home, url: '/customer/dashboard/overview' },
              {
                title: '예약 관리',
                url: '#',
                icon: m.Calendar,
                items: [
                  { title: '새 예약', url: '/booking/new' },
                  { title: '예약 내역', url: '/customer/bookings' },
                ],
              },
              { title: '내 반려동물', url: '/customer/pets', icon: h.PawPrint },
              { title: '결제 내역', url: '/customer/payments', icon: p.DollarSign },
              { title: '리뷰 관리', url: '/customer/dashboard/reviews', icon: r.Star },
              { title: '내 정보', url: '/customer/profile', icon: v.Users },
            ],
          }
        case 'GROOMER':
          return {
            ...b,
            navMain: [
              { title: '대시보드', url: '/groomer/dashboard/overview', icon: e.Home, isActive: !0 },
              { title: '예약 관리', url: '/groomer/dashboard/bookings', icon: m.Calendar },
              { title: '가능한 날짜', url: '/groomer/dashboard/availability', icon: n.Clock },
              { title: '담당 지역', url: '/groomer/dashboard/locations', icon: i.Scissors },
              { title: '리뷰 관리', url: '/groomer/dashboard/reviews', icon: r.Star },
              { title: '내 정보', url: '/groomer/dashboard/profile', icon: q },
            ],
          }
        case 'ADMIN':
          return {
            ...b,
            navMain: [
              { title: '대시보드', url: '/admin/dashboard/overview', icon: e.Home, isActive: !0 },
              { title: '사용자 관리', url: '/admin/dashboard/users', icon: v.Users },
              { title: '예약 관리', url: '/admin/dashboard/bookings', icon: m.Calendar },
              {
                title: '서비스 관리',
                url: '#',
                icon: i.Scissors,
                items: [
                  { title: '서비스 관리', url: '/admin/dashboard/services' },
                  { title: '옵션 관리', url: '/admin/dashboard/service-options' },
                ],
              },
              { title: '품종 관리', url: '/admin/dashboard/breeds', icon: h.PawPrint },
              { title: '미용사 관리', url: '/admin/dashboard/groomers', icon: u.UserCog },
              { title: '리뷰', url: '/admin/dashboard/reviews', icon: r.Star },
              {
                title: '정산 관리',
                url: '#',
                icon: p.DollarSign,
                items: [
                  { title: '정산 관리', url: '/admin/dashboard/settlement/management' },
                  { title: '정산 등급 설정', url: '/admin/dashboard/settlement/grades' },
                ],
              },
              { title: '결제 이력', url: '/admin/dashboard/payments', icon: o.CreditCard },
              { title: '내 프로필', url: '/admin/dashboard/profile', icon: t.User },
              { title: '시스템 테스트', url: '/admin/dashboard/system-test', icon: s.TestTube },
            ],
          }
        default:
          return {
            ...b,
            navMain: [{ title: '대시보드', url: '/dashboard', icon: e.Home, isActive: !0 }],
            projects: [],
          }
      }
    }
    function ao({ ...a }) {
      let { data: c, isPending: e } = (0, d.useSession)(),
        f = l.useMemo(
          () =>
            c?.user && c.user.role
              ? an({
                  name: c.user.name || '',
                  email: c.user.email || '',
                  profileImage: c.user.image || '',
                  role: c.user.role,
                })
              : an(null),
          [c]
        )
      return e
        ? (0, b.jsx)(ak, { ...a })
        : (0, b.jsxs)(S, {
            collapsible: 'icon',
            ...a,
            children: [
              (0, b.jsx)(W, { children: (0, b.jsx)(am, { teams: f.teams }) }),
              (0, b.jsx)(Y, { children: (0, b.jsx)(af, { items: f.navMain }) }),
              (0, b.jsx)(X, { children: (0, b.jsx)(aj, { user: f.user }) }),
              (0, b.jsx)(U, {}),
            ],
          })
    }
    var ap = a.i(810004)
    function aq({ children: a, onBackToLanding: f }) {
      let l = (0, c.useRouter)(),
        { data: m, isPending: n } = (0, d.useSession)(),
        { isWebView: o, sendUserLogout: p } = (0, ap.useWebViewBridge)(),
        q = async () => {
          try {
            ;(o && p(), await d.authClient.signOut(), l.push('/auth/signin'))
          } catch (a) {
            console.error('Logout failed:', a)
          }
        },
        r = () => {
          if (f) f()
          else if (m?.user?.role)
            switch (m.user.role) {
              case 'CUSTOMER':
                l.push('/customer/dashboard/overview')
                break
              case 'GROOMER':
                l.push('/groomer/dashboard/overview')
                break
              case 'ADMIN':
                l.push('/admin/dashboard/overview')
                break
              default:
                l.push('/')
            }
          else l.push('/')
        }
      if (n)
        return (0, b.jsx)('div', {
          className: 'bg-background flex min-h-screen items-center justify-center',
          children: (0, b.jsxs)('div', {
            className: 'text-center',
            children: [
              (0, b.jsx)(k.Sparkles, {
                className: 'text-primary mx-auto mb-4 h-8 w-8 animate-spin',
              }),
              (0, b.jsx)('p', { className: 'text-muted-foreground', children: '로딩 중...' }),
            ],
          }),
        })
      if (!m || !m?.user)
        return (0, b.jsx)('div', {
          className: 'bg-background flex min-h-screen items-center justify-center',
          children: (0, b.jsxs)('div', {
            className: 'text-center',
            children: [
              (0, b.jsx)(j.Shield, { className: 'text-destructive mx-auto mb-4 h-8 w-8' }),
              (0, b.jsx)('p', {
                className: 'text-muted-foreground',
                children: '인증이 필요합니다',
              }),
              (0, b.jsx)(D.Button, {
                onClick: r,
                className: 'mt-4',
                children: '로그인 페이지로 이동',
              }),
            ],
          }),
        })
      let s = m.user,
        t = () => {
          switch (s.role) {
            case 'CUSTOMER':
              return '고객'
            case 'GROOMER':
              return '미용사'
            case 'ADMIN':
              return '관리자'
            default:
              return '사용자'
          }
        }
      return (0, b.jsxs)(R, {
        children: [
          (0, b.jsx)(ao, {}),
          (0, b.jsx)(V, {
            children: (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              ...(() => {
                switch (s.role) {
                  case 'CUSTOMER':
                    return {
                      'data-testid': 'customer-dashboard',
                      'data-role': 'customer-dashboard',
                    }
                  case 'GROOMER':
                    return { 'data-testid': 'groomer-dashboard', 'data-role': 'groomer-dashboard' }
                  case 'ADMIN':
                    return { 'data-testid': 'admin-dashboard', 'data-role': 'admin-dashboard' }
                  default:
                    return { 'data-testid': 'dashboard', 'data-role': 'dashboard' }
                }
              })(),
              children: [
                (0, b.jsx)('header', {
                  className: 'bg-card border-b',
                  children: (0, b.jsxs)('div', {
                    className: 'flex h-16 shrink-0 items-center gap-2 border-b px-4',
                    children: [
                      (0, b.jsx)(T, { className: '-ml-1' }),
                      (0, b.jsxs)('div', {
                        className: 'flex flex-shrink-0 items-center space-x-1 sm:space-x-2',
                        children: [
                          (0, b.jsx)(k.Sparkles, {
                            className: 'text-primary h-5 w-5 sm:h-6 sm:w-6',
                          }),
                          (() => {
                            switch (s.role) {
                              case 'CUSTOMER':
                                return (0, b.jsx)(h.PawPrint, { className: 'text-primary h-6 w-6' })
                              case 'GROOMER':
                                return (0, b.jsx)(i.Scissors, { className: 'text-primary h-6 w-6' })
                              case 'ADMIN':
                                return (0, b.jsx)(j.Shield, { className: 'text-primary h-6 w-6' })
                              default:
                                return (0, b.jsx)(k.Sparkles, { className: 'text-primary h-6 w-6' })
                            }
                          })(),
                        ],
                      }),
                      (0, b.jsx)('div', {
                        className: 'min-w-0 flex-1',
                        children: (0, b.jsxs)('h1', {
                          className: 'truncate text-base font-bold sm:text-xl',
                          children: [
                            (0, b.jsxs)('span', {
                              className: 'hidden sm:inline',
                              children: [s.name || '사용자', ' 님의 미미살롱펫 ', t(), ' 대시보드'],
                            }),
                            (0, b.jsxs)('span', {
                              className: 'sm:hidden',
                              children: [t(), ' 대시보드'],
                            }),
                          ],
                        }),
                      }),
                      (0, b.jsxs)('div', {
                        className: 'flex flex-shrink-0 items-center space-x-1 sm:space-x-2',
                        children: [
                          (0, b.jsxs)(D.Button, {
                            variant: 'outline',
                            size: 'sm',
                            onClick: r,
                            className: 'p-2 sm:px-3',
                            title: '홈으로',
                            children: [
                              (0, b.jsx)(e.Home, { className: 'h-4 w-4' }),
                              (0, b.jsx)('span', {
                                className: 'ml-2 hidden lg:inline',
                                children: '홈',
                              }),
                            ],
                          }),
                          (0, b.jsx)('div', {
                            'data-testid': 'user-menu',
                            'aria-label': 'User menu',
                            children: (0, b.jsxs)(D.Button, {
                              variant: 'outline',
                              size: 'sm',
                              onClick: q,
                              'data-testid': 'logout-button',
                              className: 'p-2 sm:px-3',
                              title: '로그아웃',
                              children: [
                                (0, b.jsx)(g, { className: 'h-4 w-4' }),
                                (0, b.jsx)('span', {
                                  className: 'ml-2 hidden sm:inline',
                                  children: '로그아웃',
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                (0, b.jsx)('div', { className: 'flex flex-1 flex-col gap-4 p-4', children: a }),
              ],
            }),
          }),
        ],
      })
    }
    a.s(['DashboardLayout', () => aq], 327520)
  },
]

//# sourceMappingURL=src_components_dashboard_DashboardLayout_tsx_b39a3d67._.js.map
