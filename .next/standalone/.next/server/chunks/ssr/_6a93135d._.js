module.exports = [
  777192,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = a.i(470121),
      d = a.i(872752),
      e = (a) => {
        var e
        let g,
          h,
          { present: i, children: j } = a,
          k = (function (a) {
            var c, e
            let [g, h] = b.useState(),
              i = b.useRef(null),
              j = b.useRef(a),
              k = b.useRef('none'),
              [l, m] =
                ((c = a ? 'mounted' : 'unmounted'),
                (e = {
                  mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
                  unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
                  unmounted: { MOUNT: 'mounted' },
                }),
                b.useReducer((a, b) => e[a][b] ?? a, c))
            return (
              b.useEffect(() => {
                let a = f(i.current)
                k.current = 'mounted' === l ? a : 'none'
              }, [l]),
              (0, d.useLayoutEffect)(() => {
                let b = i.current,
                  c = j.current
                if (c !== a) {
                  let d = k.current,
                    e = f(b)
                  ;(a
                    ? m('MOUNT')
                    : 'none' === e || b?.display === 'none'
                      ? m('UNMOUNT')
                      : c && d !== e
                        ? m('ANIMATION_OUT')
                        : m('UNMOUNT'),
                    (j.current = a))
                }
              }, [a, m]),
              (0, d.useLayoutEffect)(() => {
                if (g) {
                  let a,
                    b = g.ownerDocument.defaultView ?? window,
                    c = (c) => {
                      let d = f(i.current).includes(CSS.escape(c.animationName))
                      if (c.target === g && d && (m('ANIMATION_END'), !j.current)) {
                        let c = g.style.animationFillMode
                        ;((g.style.animationFillMode = 'forwards'),
                          (a = b.setTimeout(() => {
                            'forwards' === g.style.animationFillMode &&
                              (g.style.animationFillMode = c)
                          })))
                      }
                    },
                    d = (a) => {
                      a.target === g && (k.current = f(i.current))
                    }
                  return (
                    g.addEventListener('animationstart', d),
                    g.addEventListener('animationcancel', c),
                    g.addEventListener('animationend', c),
                    () => {
                      ;(b.clearTimeout(a),
                        g.removeEventListener('animationstart', d),
                        g.removeEventListener('animationcancel', c),
                        g.removeEventListener('animationend', c))
                    }
                  )
                }
                m('ANIMATION_END')
              }, [g, m]),
              {
                isPresent: ['mounted', 'unmountSuspended'].includes(l),
                ref: b.useCallback((a) => {
                  ;((i.current = a ? getComputedStyle(a) : null), h(a))
                }, []),
              }
            )
          })(i),
          l = 'function' == typeof j ? j({ present: k.isPresent }) : b.Children.only(j),
          m = (0, c.useComposedRefs)(
            k.ref,
            ((e = l),
            (h =
              (g = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get) &&
              'isReactWarning' in g &&
              g.isReactWarning)
              ? e.ref
              : (h =
                    (g = Object.getOwnPropertyDescriptor(e, 'ref')?.get) &&
                    'isReactWarning' in g &&
                    g.isReactWarning)
                ? e.props.ref
                : e.props.ref || e.ref)
          )
        return 'function' == typeof j || k.isPresent ? b.cloneElement(l, { ref: m }) : null
      }
    function f(a) {
      return a?.animationName || 'none'
    }
    ;((e.displayName = 'Presence'), a.s(['Presence', () => e]))
  },
  562213,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('x', [
      ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
      ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
    ])
    a.s(['default', () => b])
  },
  422262,
  (a) => {
    'use strict'
    var b = a.i(562213)
    a.s(['XIcon', () => b.default])
  },
  897942,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = a.i(507554),
      d = a.i(470121),
      e = a.i(750104),
      f = a.i(392843),
      g = a.i(225152),
      h = a.i(596743),
      i = a.i(422297),
      j = a.i(692616),
      k = a.i(777192),
      l = a.i(30553),
      m = a.i(486228),
      n = a.i(152081),
      o = a.i(241852),
      p = a.i(811011),
      q = a.i(187924),
      r = 'Dialog',
      [s, t] = (0, e.createContextScope)(r),
      [u, v] = s(r),
      w = (a) => {
        let {
            __scopeDialog: c,
            children: d,
            open: e,
            defaultOpen: h,
            onOpenChange: i,
            modal: j = !0,
          } = a,
          k = b.useRef(null),
          l = b.useRef(null),
          [m, n] = (0, g.useControllableState)({
            prop: e,
            defaultProp: h ?? !1,
            onChange: i,
            caller: r,
          })
        return (0, q.jsx)(u, {
          scope: c,
          triggerRef: k,
          contentRef: l,
          contentId: (0, f.useId)(),
          titleId: (0, f.useId)(),
          descriptionId: (0, f.useId)(),
          open: m,
          onOpenChange: n,
          onOpenToggle: b.useCallback(() => n((a) => !a), [n]),
          modal: j,
          children: d,
        })
      }
    w.displayName = r
    var x = 'DialogTrigger',
      y = b.forwardRef((a, b) => {
        let { __scopeDialog: e, ...f } = a,
          g = v(x, e),
          h = (0, d.useComposedRefs)(b, g.triggerRef)
        return (0, q.jsx)(l.Primitive.button, {
          type: 'button',
          'aria-haspopup': 'dialog',
          'aria-expanded': g.open,
          'aria-controls': g.contentId,
          'data-state': S(g.open),
          ...f,
          ref: h,
          onClick: (0, c.composeEventHandlers)(a.onClick, g.onOpenToggle),
        })
      })
    y.displayName = x
    var z = 'DialogPortal',
      [A, B] = s(z, { forceMount: void 0 }),
      C = (a) => {
        let { __scopeDialog: c, forceMount: d, children: e, container: f } = a,
          g = v(z, c)
        return (0, q.jsx)(A, {
          scope: c,
          forceMount: d,
          children: b.Children.map(e, (a) =>
            (0, q.jsx)(k.Presence, {
              present: d || g.open,
              children: (0, q.jsx)(j.Portal, { asChild: !0, container: f, children: a }),
            })
          ),
        })
      }
    C.displayName = z
    var D = 'DialogOverlay',
      E = b.forwardRef((a, b) => {
        let c = B(D, a.__scopeDialog),
          { forceMount: d = c.forceMount, ...e } = a,
          f = v(D, a.__scopeDialog)
        return f.modal
          ? (0, q.jsx)(k.Presence, {
              present: d || f.open,
              children: (0, q.jsx)(G, { ...e, ref: b }),
            })
          : null
      })
    E.displayName = D
    var F = (0, p.createSlot)('DialogOverlay.RemoveScroll'),
      G = b.forwardRef((a, b) => {
        let { __scopeDialog: c, ...d } = a,
          e = v(D, c)
        return (0, q.jsx)(n.RemoveScroll, {
          as: F,
          allowPinchZoom: !0,
          shards: [e.contentRef],
          children: (0, q.jsx)(l.Primitive.div, {
            'data-state': S(e.open),
            ...d,
            ref: b,
            style: { pointerEvents: 'auto', ...d.style },
          }),
        })
      }),
      H = 'DialogContent',
      I = b.forwardRef((a, b) => {
        let c = B(H, a.__scopeDialog),
          { forceMount: d = c.forceMount, ...e } = a,
          f = v(H, a.__scopeDialog)
        return (0, q.jsx)(k.Presence, {
          present: d || f.open,
          children: f.modal ? (0, q.jsx)(J, { ...e, ref: b }) : (0, q.jsx)(K, { ...e, ref: b }),
        })
      })
    I.displayName = H
    var J = b.forwardRef((a, e) => {
        let f = v(H, a.__scopeDialog),
          g = b.useRef(null),
          h = (0, d.useComposedRefs)(e, f.contentRef, g)
        return (
          b.useEffect(() => {
            let a = g.current
            if (a) return (0, o.hideOthers)(a)
          }, []),
          (0, q.jsx)(L, {
            ...a,
            ref: h,
            trapFocus: f.open,
            disableOutsidePointerEvents: !0,
            onCloseAutoFocus: (0, c.composeEventHandlers)(a.onCloseAutoFocus, (a) => {
              ;(a.preventDefault(), f.triggerRef.current?.focus())
            }),
            onPointerDownOutside: (0, c.composeEventHandlers)(a.onPointerDownOutside, (a) => {
              let b = a.detail.originalEvent,
                c = 0 === b.button && !0 === b.ctrlKey
              ;(2 === b.button || c) && a.preventDefault()
            }),
            onFocusOutside: (0, c.composeEventHandlers)(a.onFocusOutside, (a) =>
              a.preventDefault()
            ),
          })
        )
      }),
      K = b.forwardRef((a, c) => {
        let d = v(H, a.__scopeDialog),
          e = b.useRef(!1),
          f = b.useRef(!1)
        return (0, q.jsx)(L, {
          ...a,
          ref: c,
          trapFocus: !1,
          disableOutsidePointerEvents: !1,
          onCloseAutoFocus: (b) => {
            ;(a.onCloseAutoFocus?.(b),
              b.defaultPrevented ||
                (e.current || d.triggerRef.current?.focus(), b.preventDefault()),
              (e.current = !1),
              (f.current = !1))
          },
          onInteractOutside: (b) => {
            ;(a.onInteractOutside?.(b),
              b.defaultPrevented ||
                ((e.current = !0),
                'pointerdown' === b.detail.originalEvent.type && (f.current = !0)))
            let c = b.target
            ;(d.triggerRef.current?.contains(c) && b.preventDefault(),
              'focusin' === b.detail.originalEvent.type && f.current && b.preventDefault())
          },
        })
      }),
      L = b.forwardRef((a, c) => {
        let { __scopeDialog: e, trapFocus: f, onOpenAutoFocus: g, onCloseAutoFocus: j, ...k } = a,
          l = v(H, e),
          n = b.useRef(null),
          o = (0, d.useComposedRefs)(c, n)
        return (
          (0, m.useFocusGuards)(),
          (0, q.jsxs)(q.Fragment, {
            children: [
              (0, q.jsx)(i.FocusScope, {
                asChild: !0,
                loop: !0,
                trapped: f,
                onMountAutoFocus: g,
                onUnmountAutoFocus: j,
                children: (0, q.jsx)(h.DismissableLayer, {
                  role: 'dialog',
                  id: l.contentId,
                  'aria-describedby': l.descriptionId,
                  'aria-labelledby': l.titleId,
                  'data-state': S(l.open),
                  ...k,
                  ref: o,
                  onDismiss: () => l.onOpenChange(!1),
                }),
              }),
              (0, q.jsxs)(q.Fragment, {
                children: [
                  (0, q.jsx)(W, { titleId: l.titleId }),
                  (0, q.jsx)(X, { contentRef: n, descriptionId: l.descriptionId }),
                ],
              }),
            ],
          })
        )
      }),
      M = 'DialogTitle',
      N = b.forwardRef((a, b) => {
        let { __scopeDialog: c, ...d } = a,
          e = v(M, c)
        return (0, q.jsx)(l.Primitive.h2, { id: e.titleId, ...d, ref: b })
      })
    N.displayName = M
    var O = 'DialogDescription',
      P = b.forwardRef((a, b) => {
        let { __scopeDialog: c, ...d } = a,
          e = v(O, c)
        return (0, q.jsx)(l.Primitive.p, { id: e.descriptionId, ...d, ref: b })
      })
    P.displayName = O
    var Q = 'DialogClose',
      R = b.forwardRef((a, b) => {
        let { __scopeDialog: d, ...e } = a,
          f = v(Q, d)
        return (0, q.jsx)(l.Primitive.button, {
          type: 'button',
          ...e,
          ref: b,
          onClick: (0, c.composeEventHandlers)(a.onClick, () => f.onOpenChange(!1)),
        })
      })
    function S(a) {
      return a ? 'open' : 'closed'
    }
    R.displayName = Q
    var T = 'DialogTitleWarning',
      [U, V] = (0, e.createContext)(T, { contentName: H, titleName: M, docsSlug: 'dialog' }),
      W = ({ titleId: a }) => {
        let c = V(T),
          d = `\`${c.contentName}\` requires a \`${c.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${c.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${c.docsSlug}`
        return (
          b.useEffect(() => {
            a && (document.getElementById(a) || console.error(d))
          }, [d, a]),
          null
        )
      },
      X = ({ contentRef: a, descriptionId: c }) => {
        let d = V('DialogDescriptionWarning'),
          e = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${d.contentName}}.`
        return (
          b.useEffect(() => {
            let b = a.current?.getAttribute('aria-describedby')
            c && b && (document.getElementById(c) || console.warn(e))
          }, [e, a, c]),
          null
        )
      }
    a.s([
      'Close',
      () => R,
      'Content',
      () => I,
      'Description',
      () => P,
      'Overlay',
      () => E,
      'Portal',
      () => C,
      'Root',
      () => w,
      'Title',
      () => N,
      'Trigger',
      () => y,
      'WarningProvider',
      () => U,
      'createDialogScope',
      () => t,
    ])
  },
  814574,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(897942),
      d = a.i(422262),
      e = a.i(368114)
    let f = c.Root,
      g = c.Trigger,
      h = c.Portal
    function i({ className: a, ...f }) {
      return (0, b.jsxs)(c.Close, {
        className: (0, e.cn)(
          'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none',
          'flex min-h-[44px] min-w-[44px] items-center justify-center sm:min-h-0 sm:min-w-0',
          a
        ),
        ...f,
        children: [
          (0, b.jsx)(d.XIcon, { className: 'h-5 w-5 sm:h-4 sm:w-4' }),
          (0, b.jsx)('span', { className: 'sr-only', children: 'Close' }),
        ],
      })
    }
    function j({ className: a, ...d }) {
      return (0, b.jsx)(c.Overlay, {
        className: (0, e.cn)(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
          a
        ),
        ...d,
      })
    }
    function k({ className: a, children: d, ...f }) {
      return (0, b.jsxs)(h, {
        children: [
          (0, b.jsx)(j, {}),
          (0, b.jsxs)(c.Content, {
            className: (0, e.cn)(
              'bg-background fixed z-50 grid gap-4 p-6 shadow-lg duration-300',
              'bottom-0 left-[50%] w-[95vw] max-w-lg translate-x-[-50%]',
              'max-h-[90vh] rounded-t-2xl',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
              'sm:top-[50%] sm:bottom-auto sm:w-full',
              'sm:translate-y-[-50%] sm:rounded-lg sm:border',
              'sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0',
              'sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95',
              'sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%]',
              'sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]',
              a
            ),
            ...f,
            children: [
              (0, b.jsx)('div', {
                className:
                  'absolute top-3 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-gray-300 sm:hidden',
              }),
              (0, b.jsx)('div', {
                className: 'max-h-[calc(90vh-4rem)] overflow-y-auto sm:max-h-none',
                children: d,
              }),
              (0, b.jsx)(i, {}),
            ],
          }),
        ],
      })
    }
    function l({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        className: (0, e.cn)('flex flex-col space-y-1.5 text-center sm:text-left', a),
        ...c,
      })
    }
    function m({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        className: (0, e.cn)(
          'flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2',
          'bg-background sticky bottom-0 pt-4 sm:relative sm:pt-0',
          a
        ),
        ...c,
      })
    }
    function n({ className: a, ...d }) {
      return (0, b.jsx)(c.Title, {
        className: (0, e.cn)('text-lg leading-none font-semibold tracking-tight', a),
        ...d,
      })
    }
    function o({ className: a, ...d }) {
      return (0, b.jsx)(c.Description, {
        className: (0, e.cn)('text-muted-foreground text-sm', a),
        ...d,
      })
    }
    a.s([
      'Dialog',
      () => f,
      'DialogContent',
      () => k,
      'DialogDescription',
      () => o,
      'DialogFooter',
      () => m,
      'DialogHeader',
      () => l,
      'DialogTitle',
      () => n,
      'DialogTrigger',
      () => g,
    ])
  },
]

//# sourceMappingURL=_6a93135d._.js.map
