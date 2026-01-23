module.exports = [
  785259,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(507554),
      e = a.i(470121),
      f = a.i(750104),
      g = a.i(596743),
      h = a.i(392843),
      i = a.i(704691),
      j = a.i(692616),
      k = a.i(777192),
      l = a.i(30553),
      m = a.i(811011),
      n = a.i(225152),
      o = a.i(528094),
      [p, q] = (0, f.createContextScope)('Tooltip', [i.createPopperScope]),
      r = (0, i.createPopperScope)(),
      s = 'TooltipProvider',
      t = 'tooltip.open',
      [u, v] = p(s),
      w = (a) => {
        let {
            __scopeTooltip: d,
            delayDuration: e = 700,
            skipDelayDuration: f = 300,
            disableHoverableContent: g = !1,
            children: h,
          } = a,
          i = c.useRef(!0),
          j = c.useRef(!1),
          k = c.useRef(0)
        return (
          c.useEffect(() => {
            let a = k.current
            return () => window.clearTimeout(a)
          }, []),
          (0, b.jsx)(u, {
            scope: d,
            isOpenDelayedRef: i,
            delayDuration: e,
            onOpen: c.useCallback(() => {
              ;(window.clearTimeout(k.current), (i.current = !1))
            }, []),
            onClose: c.useCallback(() => {
              ;(window.clearTimeout(k.current),
                (k.current = window.setTimeout(() => (i.current = !0), f)))
            }, [f]),
            isPointerInTransitRef: j,
            onPointerInTransitChange: c.useCallback((a) => {
              j.current = a
            }, []),
            disableHoverableContent: g,
            children: h,
          })
        )
      }
    w.displayName = s
    var x = 'Tooltip',
      [y, z] = p(x),
      A = (a) => {
        let {
            __scopeTooltip: d,
            children: e,
            open: f,
            defaultOpen: g,
            onOpenChange: j,
            disableHoverableContent: k,
            delayDuration: l,
          } = a,
          m = v(x, a.__scopeTooltip),
          o = r(d),
          [p, q] = c.useState(null),
          s = (0, h.useId)(),
          u = c.useRef(0),
          w = k ?? m.disableHoverableContent,
          z = l ?? m.delayDuration,
          A = c.useRef(!1),
          [B, C] = (0, n.useControllableState)({
            prop: f,
            defaultProp: g ?? !1,
            onChange: (a) => {
              ;(a ? (m.onOpen(), document.dispatchEvent(new CustomEvent(t))) : m.onClose(), j?.(a))
            },
            caller: x,
          }),
          D = c.useMemo(() => (B ? (A.current ? 'delayed-open' : 'instant-open') : 'closed'), [B]),
          E = c.useCallback(() => {
            ;(window.clearTimeout(u.current), (u.current = 0), (A.current = !1), C(!0))
          }, [C]),
          F = c.useCallback(() => {
            ;(window.clearTimeout(u.current), (u.current = 0), C(!1))
          }, [C]),
          G = c.useCallback(() => {
            ;(window.clearTimeout(u.current),
              (u.current = window.setTimeout(() => {
                ;((A.current = !0), C(!0), (u.current = 0))
              }, z)))
          }, [z, C])
        return (
          c.useEffect(
            () => () => {
              u.current && (window.clearTimeout(u.current), (u.current = 0))
            },
            []
          ),
          (0, b.jsx)(i.Root, {
            ...o,
            children: (0, b.jsx)(y, {
              scope: d,
              contentId: s,
              open: B,
              stateAttribute: D,
              trigger: p,
              onTriggerChange: q,
              onTriggerEnter: c.useCallback(() => {
                m.isOpenDelayedRef.current ? G() : E()
              }, [m.isOpenDelayedRef, G, E]),
              onTriggerLeave: c.useCallback(() => {
                w ? F() : (window.clearTimeout(u.current), (u.current = 0))
              }, [F, w]),
              onOpen: E,
              onClose: F,
              disableHoverableContent: w,
              children: e,
            }),
          })
        )
      }
    A.displayName = x
    var B = 'TooltipTrigger',
      C = c.forwardRef((a, f) => {
        let { __scopeTooltip: g, ...h } = a,
          j = z(B, g),
          k = v(B, g),
          m = r(g),
          n = c.useRef(null),
          o = (0, e.useComposedRefs)(f, n, j.onTriggerChange),
          p = c.useRef(!1),
          q = c.useRef(!1),
          s = c.useCallback(() => (p.current = !1), [])
        return (
          c.useEffect(() => () => document.removeEventListener('pointerup', s), [s]),
          (0, b.jsx)(i.Anchor, {
            asChild: !0,
            ...m,
            children: (0, b.jsx)(l.Primitive.button, {
              'aria-describedby': j.open ? j.contentId : void 0,
              'data-state': j.stateAttribute,
              ...h,
              ref: o,
              onPointerMove: (0, d.composeEventHandlers)(a.onPointerMove, (a) => {
                'touch' !== a.pointerType &&
                  (q.current ||
                    k.isPointerInTransitRef.current ||
                    (j.onTriggerEnter(), (q.current = !0)))
              }),
              onPointerLeave: (0, d.composeEventHandlers)(a.onPointerLeave, () => {
                ;(j.onTriggerLeave(), (q.current = !1))
              }),
              onPointerDown: (0, d.composeEventHandlers)(a.onPointerDown, () => {
                ;(j.open && j.onClose(),
                  (p.current = !0),
                  document.addEventListener('pointerup', s, { once: !0 }))
              }),
              onFocus: (0, d.composeEventHandlers)(a.onFocus, () => {
                p.current || j.onOpen()
              }),
              onBlur: (0, d.composeEventHandlers)(a.onBlur, j.onClose),
              onClick: (0, d.composeEventHandlers)(a.onClick, j.onClose),
            }),
          })
        )
      })
    C.displayName = B
    var D = 'TooltipPortal',
      [E, F] = p(D, { forceMount: void 0 }),
      G = (a) => {
        let { __scopeTooltip: c, forceMount: d, children: e, container: f } = a,
          g = z(D, c)
        return (0, b.jsx)(E, {
          scope: c,
          forceMount: d,
          children: (0, b.jsx)(k.Presence, {
            present: d || g.open,
            children: (0, b.jsx)(j.Portal, { asChild: !0, container: f, children: e }),
          }),
        })
      }
    G.displayName = D
    var H = 'TooltipContent',
      I = c.forwardRef((a, c) => {
        let d = F(H, a.__scopeTooltip),
          { forceMount: e = d.forceMount, side: f = 'top', ...g } = a,
          h = z(H, a.__scopeTooltip)
        return (0, b.jsx)(k.Presence, {
          present: e || h.open,
          children: h.disableHoverableContent
            ? (0, b.jsx)(N, { side: f, ...g, ref: c })
            : (0, b.jsx)(J, { side: f, ...g, ref: c }),
        })
      }),
      J = c.forwardRef((a, d) => {
        let f = z(H, a.__scopeTooltip),
          g = v(H, a.__scopeTooltip),
          h = c.useRef(null),
          i = (0, e.useComposedRefs)(d, h),
          [j, k] = c.useState(null),
          { trigger: l, onClose: m } = f,
          n = h.current,
          { onPointerInTransitChange: o } = g,
          p = c.useCallback(() => {
            ;(k(null), o(!1))
          }, [o]),
          q = c.useCallback(
            (a, b) => {
              let c,
                d = a.currentTarget,
                e = { x: a.clientX, y: a.clientY },
                f = (function (a, b) {
                  let c = Math.abs(b.top - a.y),
                    d = Math.abs(b.bottom - a.y),
                    e = Math.abs(b.right - a.x),
                    f = Math.abs(b.left - a.x)
                  switch (Math.min(c, d, e, f)) {
                    case f:
                      return 'left'
                    case e:
                      return 'right'
                    case c:
                      return 'top'
                    case d:
                      return 'bottom'
                    default:
                      throw Error('unreachable')
                  }
                })(e, d.getBoundingClientRect())
              ;(k(
                ((c = [
                  ...(function (a, b, c = 5) {
                    let d = []
                    switch (b) {
                      case 'top':
                        d.push({ x: a.x - c, y: a.y + c }, { x: a.x + c, y: a.y + c })
                        break
                      case 'bottom':
                        d.push({ x: a.x - c, y: a.y - c }, { x: a.x + c, y: a.y - c })
                        break
                      case 'left':
                        d.push({ x: a.x + c, y: a.y - c }, { x: a.x + c, y: a.y + c })
                        break
                      case 'right':
                        d.push({ x: a.x - c, y: a.y - c }, { x: a.x - c, y: a.y + c })
                    }
                    return d
                  })(e, f),
                  ...(function (a) {
                    let { top: b, right: c, bottom: d, left: e } = a
                    return [
                      { x: e, y: b },
                      { x: c, y: b },
                      { x: c, y: d },
                      { x: e, y: d },
                    ]
                  })(b.getBoundingClientRect()),
                ].slice()).sort((a, b) =>
                  a.x < b.x ? -1 : a.x > b.x ? 1 : a.y < b.y ? -1 : 1 * !!(a.y > b.y)
                ),
                (function (a) {
                  if (a.length <= 1) return a.slice()
                  let b = []
                  for (let c = 0; c < a.length; c++) {
                    let d = a[c]
                    for (; b.length >= 2; ) {
                      let a = b[b.length - 1],
                        c = b[b.length - 2]
                      if ((a.x - c.x) * (d.y - c.y) >= (a.y - c.y) * (d.x - c.x)) b.pop()
                      else break
                    }
                    b.push(d)
                  }
                  b.pop()
                  let c = []
                  for (let b = a.length - 1; b >= 0; b--) {
                    let d = a[b]
                    for (; c.length >= 2; ) {
                      let a = c[c.length - 1],
                        b = c[c.length - 2]
                      if ((a.x - b.x) * (d.y - b.y) >= (a.y - b.y) * (d.x - b.x)) c.pop()
                      else break
                    }
                    c.push(d)
                  }
                  return (c.pop(),
                  1 === b.length && 1 === c.length && b[0].x === c[0].x && b[0].y === c[0].y)
                    ? b
                    : b.concat(c)
                })(c))
              ),
                o(!0))
            },
            [o]
          )
        return (
          c.useEffect(() => () => p(), [p]),
          c.useEffect(() => {
            if (l && n) {
              let a = (a) => q(a, n),
                b = (a) => q(a, l)
              return (
                l.addEventListener('pointerleave', a),
                n.addEventListener('pointerleave', b),
                () => {
                  ;(l.removeEventListener('pointerleave', a),
                    n.removeEventListener('pointerleave', b))
                }
              )
            }
          }, [l, n, q, p]),
          c.useEffect(() => {
            if (j) {
              let a = (a) => {
                let b = a.target,
                  c = { x: a.clientX, y: a.clientY },
                  d = l?.contains(b) || n?.contains(b),
                  e = !(function (a, b) {
                    let { x: c, y: d } = a,
                      e = !1
                    for (let a = 0, f = b.length - 1; a < b.length; f = a++) {
                      let g = b[a],
                        h = b[f],
                        i = g.x,
                        j = g.y,
                        k = h.x,
                        l = h.y
                      j > d != l > d && c < ((k - i) * (d - j)) / (l - j) + i && (e = !e)
                    }
                    return e
                  })(c, j)
                d ? p() : e && (p(), m())
              }
              return (
                document.addEventListener('pointermove', a),
                () => document.removeEventListener('pointermove', a)
              )
            }
          }, [l, n, j, m, p]),
          (0, b.jsx)(N, { ...a, ref: i })
        )
      }),
      [K, L] = p(x, { isInside: !1 }),
      M = (0, m.createSlottable)('TooltipContent'),
      N = c.forwardRef((a, d) => {
        let {
            __scopeTooltip: e,
            children: f,
            'aria-label': h,
            onEscapeKeyDown: j,
            onPointerDownOutside: k,
            ...l
          } = a,
          m = z(H, e),
          n = r(e),
          { onClose: p } = m
        return (
          c.useEffect(
            () => (document.addEventListener(t, p), () => document.removeEventListener(t, p)),
            [p]
          ),
          c.useEffect(() => {
            if (m.trigger) {
              let a = (a) => {
                let b = a.target
                b?.contains(m.trigger) && p()
              }
              return (
                window.addEventListener('scroll', a, { capture: !0 }),
                () => window.removeEventListener('scroll', a, { capture: !0 })
              )
            }
          }, [m.trigger, p]),
          (0, b.jsx)(g.DismissableLayer, {
            asChild: !0,
            disableOutsidePointerEvents: !1,
            onEscapeKeyDown: j,
            onPointerDownOutside: k,
            onFocusOutside: (a) => a.preventDefault(),
            onDismiss: p,
            children: (0, b.jsxs)(i.Content, {
              'data-state': m.stateAttribute,
              ...n,
              ...l,
              ref: d,
              style: {
                ...l.style,
                '--radix-tooltip-content-transform-origin': 'var(--radix-popper-transform-origin)',
                '--radix-tooltip-content-available-width': 'var(--radix-popper-available-width)',
                '--radix-tooltip-content-available-height': 'var(--radix-popper-available-height)',
                '--radix-tooltip-trigger-width': 'var(--radix-popper-anchor-width)',
                '--radix-tooltip-trigger-height': 'var(--radix-popper-anchor-height)',
              },
              children: [
                (0, b.jsx)(M, { children: f }),
                (0, b.jsx)(K, {
                  scope: e,
                  isInside: !0,
                  children: (0, b.jsx)(o.Root, {
                    id: m.contentId,
                    role: 'tooltip',
                    children: h || f,
                  }),
                }),
              ],
            }),
          })
        )
      })
    I.displayName = H
    var O = 'TooltipArrow',
      P = c.forwardRef((a, c) => {
        let { __scopeTooltip: d, ...e } = a,
          f = r(d)
        return L(O, d).isInside ? null : (0, b.jsx)(i.Arrow, { ...f, ...e, ref: c })
      })
    P.displayName = O
    var Q = a.i(368114)
    function R({ delayDuration: a = 0, ...c }) {
      return (0, b.jsx)(w, { 'data-slot': 'tooltip-provider', delayDuration: a, ...c })
    }
    function S({ ...a }) {
      return (0, b.jsx)(R, { children: (0, b.jsx)(A, { 'data-slot': 'tooltip', ...a }) })
    }
    function T({ ...a }) {
      return (0, b.jsx)(C, { 'data-slot': 'tooltip-trigger', ...a })
    }
    function U({ className: a, sideOffset: c = 0, children: d, ...e }) {
      return (0, b.jsx)(G, {
        children: (0, b.jsxs)(I, {
          'data-slot': 'tooltip-content',
          sideOffset: c,
          className: (0, Q.cn)(
            'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
            a
          ),
          ...e,
          children: [
            d,
            (0, b.jsx)(P, {
              className:
                'bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',
            }),
          ],
        }),
      })
    }
    a.s(
      [
        'Tooltip',
        () => S,
        'TooltipContent',
        () => U,
        'TooltipProvider',
        () => R,
        'TooltipTrigger',
        () => T,
      ],
      785259
    )
  },
  147271,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('test-tube', [
      ['path', { d: 'M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2', key: '125lnx' }],
      ['path', { d: 'M8.5 2h7', key: 'csnxdl' }],
      ['path', { d: 'M14.5 16h-5', key: '1ox875' }],
    ])
    a.s(['TestTube', () => b], 147271)
  },
  261707,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('house', [
      ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', key: '5wwlr5' }],
      [
        'path',
        {
          d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
          key: 'r6nss1',
        },
      ],
    ])
    a.s(['default', () => b])
  },
  681010,
  (a) => {
    'use strict'
    var b = a.i(261707)
    a.s(['Home', () => b.default])
  },
  603314,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('shield', [
      [
        'path',
        {
          d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
          key: 'oel41y',
        },
      ],
    ])
    a.s(['Shield', () => b], 603314)
  },
  421234,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(507554),
      e = a.i(750104),
      f = a.i(225152),
      g = a.i(872752),
      h = a.i(470121),
      i = a.i(30553),
      j = a.i(777192),
      k = a.i(392843),
      l = 'Collapsible',
      [m, n] = (0, e.createContextScope)(l),
      [o, p] = m(l),
      q = c.forwardRef((a, d) => {
        let {
            __scopeCollapsible: e,
            open: g,
            defaultOpen: h,
            disabled: j,
            onOpenChange: m,
            ...n
          } = a,
          [p, q] = (0, f.useControllableState)({
            prop: g,
            defaultProp: h ?? !1,
            onChange: m,
            caller: l,
          })
        return (0, b.jsx)(o, {
          scope: e,
          disabled: j,
          contentId: (0, k.useId)(),
          open: p,
          onOpenToggle: c.useCallback(() => q((a) => !a), [q]),
          children: (0, b.jsx)(i.Primitive.div, {
            'data-state': w(p),
            'data-disabled': j ? '' : void 0,
            ...n,
            ref: d,
          }),
        })
      })
    q.displayName = l
    var r = 'CollapsibleTrigger',
      s = c.forwardRef((a, c) => {
        let { __scopeCollapsible: e, ...f } = a,
          g = p(r, e)
        return (0, b.jsx)(i.Primitive.button, {
          type: 'button',
          'aria-controls': g.contentId,
          'aria-expanded': g.open || !1,
          'data-state': w(g.open),
          'data-disabled': g.disabled ? '' : void 0,
          disabled: g.disabled,
          ...f,
          ref: c,
          onClick: (0, d.composeEventHandlers)(a.onClick, g.onOpenToggle),
        })
      })
    s.displayName = r
    var t = 'CollapsibleContent',
      u = c.forwardRef((a, c) => {
        let { forceMount: d, ...e } = a,
          f = p(t, a.__scopeCollapsible)
        return (0, b.jsx)(j.Presence, {
          present: d || f.open,
          children: ({ present: a }) => (0, b.jsx)(v, { ...e, ref: c, present: a }),
        })
      })
    u.displayName = t
    var v = c.forwardRef((a, d) => {
      let { __scopeCollapsible: e, present: f, children: j, ...k } = a,
        l = p(t, e),
        [m, n] = c.useState(f),
        o = c.useRef(null),
        q = (0, h.useComposedRefs)(d, o),
        r = c.useRef(0),
        s = r.current,
        u = c.useRef(0),
        v = u.current,
        x = l.open || m,
        y = c.useRef(x),
        z = c.useRef(void 0)
      return (
        c.useEffect(() => {
          let a = requestAnimationFrame(() => (y.current = !1))
          return () => cancelAnimationFrame(a)
        }, []),
        (0, g.useLayoutEffect)(() => {
          let a = o.current
          if (a) {
            ;((z.current = z.current || {
              transitionDuration: a.style.transitionDuration,
              animationName: a.style.animationName,
            }),
              (a.style.transitionDuration = '0s'),
              (a.style.animationName = 'none'))
            let b = a.getBoundingClientRect()
            ;((r.current = b.height),
              (u.current = b.width),
              y.current ||
                ((a.style.transitionDuration = z.current.transitionDuration),
                (a.style.animationName = z.current.animationName)),
              n(f))
          }
        }, [l.open, f]),
        (0, b.jsx)(i.Primitive.div, {
          'data-state': w(l.open),
          'data-disabled': l.disabled ? '' : void 0,
          id: l.contentId,
          hidden: !x,
          ...k,
          ref: q,
          style: {
            '--radix-collapsible-content-height': s ? `${s}px` : void 0,
            '--radix-collapsible-content-width': v ? `${v}px` : void 0,
            ...a.style,
          },
          children: x && j,
        })
      )
    })
    function w(a) {
      return a ? 'open' : 'closed'
    }
    function x({ ...a }) {
      return (0, b.jsx)(q, { 'data-slot': 'collapsible', ...a })
    }
    function y({ ...a }) {
      return (0, b.jsx)(s, { 'data-slot': 'collapsible-trigger', ...a })
    }
    function z({ ...a }) {
      return (0, b.jsx)(u, { 'data-slot': 'collapsible-content', ...a })
    }
    a.s(
      ['Collapsible', () => x, 'CollapsibleContent', () => z, 'CollapsibleTrigger', () => y],
      421234
    )
  },
  810004,
  (a) => {
    'use strict'
    var b,
      c = a.i(572131),
      d = a.i(529139)
    class e {
      static isReactNativeWebView() {
        return !1
      }
      static async registerTokenViaAPI(a) {
        try {
          let b = await fetch('/api/notifications/register-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(a),
          })
          return await b.json()
        } catch (a) {
          return { success: !1, error: a instanceof Error ? a.message : 'Unknown error' }
        }
      }
      static async getTokenStatus() {
        try {
          let a = await fetch('/api/notifications/token/status')
          return await a.json()
        } catch (a) {
          return { success: !1, error: a instanceof Error ? a.message : 'Unknown error' }
        }
      }
    }
    function f() {
      let { data: a, isPending: b } = (0, d.useSession)(),
        f = e.isReactNativeWebView(),
        g = (0, c.useCallback)((a) => {}, [f]),
        h = (0, c.useCallback)(
          (a) => {
            g({ type: 'USER_LOGGED_IN', data: a })
          },
          [g]
        ),
        i = (0, c.useCallback)(() => {
          g({ type: 'USER_LOGGED_OUT' })
        }, [g]),
        j = (0, c.useCallback)(() => {
          g({ type: 'IMAGE_UPLOAD_REQUEST' })
        }, [g]),
        k = (0, c.useCallback)(() => {
          g({ type: 'CAMERA_REQUEST' })
        }, [g])
      return (
        (0, c.useEffect)(() => {
          try {
            !b &&
              a?.user &&
              f &&
              (console.log('🔄 Sending user data to React Native from bridge hook'),
              h({
                userId: a.user.id,
                email: a.user.email || '',
                name: a.user.name || '',
                phoneNumber: a.user.phoneNumber || '',
                role: a.user.role,
              }))
          } catch {
            return
          }
        }, [a, b, f, h]),
        {
          isWebView: f,
          sendMessage: g,
          sendUserLogin: h,
          sendUserLogout: i,
          requestImageUpload: j,
          requestCamera: k,
        }
      )
    }
    ;(((b = {}).USER_LOGGED_IN = 'USER_LOGGED_IN'),
      (b.USER_LOGGED_OUT = 'USER_LOGGED_OUT'),
      (b.EXPO_TOKEN_REGISTERED = 'EXPO_TOKEN_REGISTERED'),
      (b.IMAGE_UPLOAD_REQUEST = 'IMAGE_UPLOAD_REQUEST'),
      (b.CAMERA_REQUEST = 'CAMERA_REQUEST'),
      (b.IMAGE_UPLOAD_RESPONSE = 'IMAGE_UPLOAD_RESPONSE'),
      a.s(['useWebViewBridge', () => f], 810004))
  },
  39355,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('user', [
      ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', key: '975kel' }],
      ['circle', { cx: '12', cy: '7', r: '4', key: '17ys0d' }],
    ])
    a.s(['default', () => b])
  },
  546842,
  (a) => {
    'use strict'
    var b = a.i(39355)
    a.s(['User', () => b.default])
  },
  737539,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('chevrons-up-down', [
      ['path', { d: 'm7 15 5 5 5-5', key: '1hf1tw' }],
      ['path', { d: 'm7 9 5-5 5 5', key: 'sgt6xg' }],
    ])
    a.s(['ChevronsUpDown', () => b], 737539)
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
  171150,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('circle', [
      ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ])
    a.s(['CircleIcon', () => b], 171150)
  },
  352254,
  111989,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('chevron-right', [
      ['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }],
    ])
    ;(a.s(['default', () => b], 111989), a.s(['ChevronRightIcon', () => b], 352254))
  },
  224050,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = a.i(507554),
      d = a.i(37738),
      e = a.i(470121),
      f = a.i(750104),
      g = a.i(392843),
      h = a.i(30553),
      i = a.i(746872),
      j = a.i(225152),
      k = a.i(507827),
      l = a.i(187924),
      m = 'rovingFocusGroup.onEntryFocus',
      n = { bubbles: !1, cancelable: !0 },
      o = 'RovingFocusGroup',
      [p, q, r] = (0, d.createCollection)(o),
      [s, t] = (0, f.createContextScope)(o, [r]),
      [u, v] = s(o),
      w = b.forwardRef((a, b) =>
        (0, l.jsx)(p.Provider, {
          scope: a.__scopeRovingFocusGroup,
          children: (0, l.jsx)(p.Slot, {
            scope: a.__scopeRovingFocusGroup,
            children: (0, l.jsx)(x, { ...a, ref: b }),
          }),
        })
      )
    w.displayName = o
    var x = b.forwardRef((a, d) => {
        let {
            __scopeRovingFocusGroup: f,
            orientation: g,
            loop: p = !1,
            dir: r,
            currentTabStopId: s,
            defaultCurrentTabStopId: t,
            onCurrentTabStopIdChange: v,
            onEntryFocus: w,
            preventScrollOnEntryFocus: x = !1,
            ...y
          } = a,
          z = b.useRef(null),
          A = (0, e.useComposedRefs)(d, z),
          C = (0, k.useDirection)(r),
          [D, E] = (0, j.useControllableState)({
            prop: s,
            defaultProp: t ?? null,
            onChange: v,
            caller: o,
          }),
          [F, G] = b.useState(!1),
          H = (0, i.useCallbackRef)(w),
          I = q(f),
          J = b.useRef(!1),
          [K, L] = b.useState(0)
        return (
          b.useEffect(() => {
            let a = z.current
            if (a) return (a.addEventListener(m, H), () => a.removeEventListener(m, H))
          }, [H]),
          (0, l.jsx)(u, {
            scope: f,
            orientation: g,
            dir: C,
            loop: p,
            currentTabStopId: D,
            onItemFocus: b.useCallback((a) => E(a), [E]),
            onItemShiftTab: b.useCallback(() => G(!0), []),
            onFocusableItemAdd: b.useCallback(() => L((a) => a + 1), []),
            onFocusableItemRemove: b.useCallback(() => L((a) => a - 1), []),
            children: (0, l.jsx)(h.Primitive.div, {
              tabIndex: F || 0 === K ? -1 : 0,
              'data-orientation': g,
              ...y,
              ref: A,
              style: { outline: 'none', ...a.style },
              onMouseDown: (0, c.composeEventHandlers)(a.onMouseDown, () => {
                J.current = !0
              }),
              onFocus: (0, c.composeEventHandlers)(a.onFocus, (a) => {
                let b = !J.current
                if (a.target === a.currentTarget && b && !F) {
                  let b = new CustomEvent(m, n)
                  if ((a.currentTarget.dispatchEvent(b), !b.defaultPrevented)) {
                    let a = I().filter((a) => a.focusable)
                    B(
                      [a.find((a) => a.active), a.find((a) => a.id === D), ...a]
                        .filter(Boolean)
                        .map((a) => a.ref.current),
                      x
                    )
                  }
                }
                J.current = !1
              }),
              onBlur: (0, c.composeEventHandlers)(a.onBlur, () => G(!1)),
            }),
          })
        )
      }),
      y = 'RovingFocusGroupItem',
      z = b.forwardRef((a, d) => {
        let {
            __scopeRovingFocusGroup: e,
            focusable: f = !0,
            active: i = !1,
            tabStopId: j,
            children: k,
            ...m
          } = a,
          n = (0, g.useId)(),
          o = j || n,
          r = v(y, e),
          s = r.currentTabStopId === o,
          t = q(e),
          { onFocusableItemAdd: u, onFocusableItemRemove: w, currentTabStopId: x } = r
        return (
          b.useEffect(() => {
            if (f) return (u(), () => w())
          }, [f, u, w]),
          (0, l.jsx)(p.ItemSlot, {
            scope: e,
            id: o,
            focusable: f,
            active: i,
            children: (0, l.jsx)(h.Primitive.span, {
              tabIndex: s ? 0 : -1,
              'data-orientation': r.orientation,
              ...m,
              ref: d,
              onMouseDown: (0, c.composeEventHandlers)(a.onMouseDown, (a) => {
                f ? r.onItemFocus(o) : a.preventDefault()
              }),
              onFocus: (0, c.composeEventHandlers)(a.onFocus, () => r.onItemFocus(o)),
              onKeyDown: (0, c.composeEventHandlers)(a.onKeyDown, (a) => {
                if ('Tab' === a.key && a.shiftKey) return void r.onItemShiftTab()
                if (a.target !== a.currentTarget) return
                let b = (function (a, b, c) {
                  var d
                  let e =
                    ((d = a.key),
                    'rtl' !== c
                      ? d
                      : 'ArrowLeft' === d
                        ? 'ArrowRight'
                        : 'ArrowRight' === d
                          ? 'ArrowLeft'
                          : d)
                  if (
                    !('vertical' === b && ['ArrowLeft', 'ArrowRight'].includes(e)) &&
                    !('horizontal' === b && ['ArrowUp', 'ArrowDown'].includes(e))
                  )
                    return A[e]
                })(a, r.orientation, r.dir)
                if (void 0 !== b) {
                  if (a.metaKey || a.ctrlKey || a.altKey || a.shiftKey) return
                  a.preventDefault()
                  let e = t()
                    .filter((a) => a.focusable)
                    .map((a) => a.ref.current)
                  if ('last' === b) e.reverse()
                  else if ('prev' === b || 'next' === b) {
                    var c, d
                    'prev' === b && e.reverse()
                    let f = e.indexOf(a.currentTarget)
                    e = r.loop
                      ? ((c = e), (d = f + 1), c.map((a, b) => c[(d + b) % c.length]))
                      : e.slice(f + 1)
                  }
                  setTimeout(() => B(e))
                }
              }),
              children:
                'function' == typeof k ? k({ isCurrentTabStop: s, hasTabStop: null != x }) : k,
            }),
          })
        )
      })
    z.displayName = y
    var A = {
      ArrowLeft: 'prev',
      ArrowUp: 'prev',
      ArrowRight: 'next',
      ArrowDown: 'next',
      PageUp: 'first',
      Home: 'first',
      PageDown: 'last',
      End: 'last',
    }
    function B(a, b = !1) {
      let c = document.activeElement
      for (let d of a)
        if (d === c || (d.focus({ preventScroll: b }), document.activeElement !== c)) return
    }
    a.s(['Item', () => z, 'Root', () => w, 'createRovingFocusGroupScope', () => t])
  },
  50522,
  (a) => {
    'use strict'
    var b = a.i(111989)
    a.s(['ChevronRight', () => b.default])
  },
]

//# sourceMappingURL=_09dd7546._.js.map
