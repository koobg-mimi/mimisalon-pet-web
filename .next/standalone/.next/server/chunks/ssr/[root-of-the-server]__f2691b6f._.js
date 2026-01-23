module.exports = [
  736313,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored.contexts.HooksClientContext
  },
  818341,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored.contexts.ServerInsertedHtml
  },
  556704,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/work-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-async-storage.external.js')
    )
  },
  832319,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/work-unit-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-unit-async-storage.external.js')
    )
  },
  120635,
  (a, b, c) => {
    b.exports = a.x('next/dist/server/app-render/action-async-storage.external.js', () =>
      require('next/dist/server/app-render/action-async-storage.external.js')
    )
  },
  909270,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored.contexts.AppRouterContext
  },
  935112,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored['react-ssr'].ReactDOM
  },
  738783,
  (a, b, c) => {
    'use strict'
    b.exports = a.r(342602).vendored['react-ssr'].ReactServerDOMTurbopackClient
  },
  205138,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(596221),
      d = a.i(368114)
    function e({ size: a = 'md', className: e }) {
      return (0, b.jsx)(c.Loader2, {
        'data-slot': 'loading-spinner',
        className: (0, d.cn)('animate-spin', { sm: 'size-4', md: 'size-6', lg: 'size-8' }[a], e),
      })
    }
    a.s(['LoadingSpinner', () => e])
  },
  739118,
  (a, b, c) => {
    'use strict'
    Object.defineProperty(c, '__esModule', { value: !0 })
    var d = {
      DEFAULT_SEGMENT_KEY: function () {
        return l
      },
      PAGE_SEGMENT_KEY: function () {
        return k
      },
      addSearchParamsIfPageSegment: function () {
        return i
      },
      computeSelectedLayoutSegment: function () {
        return j
      },
      getSegmentValue: function () {
        return f
      },
      getSelectedLayoutSegmentPath: function () {
        return function a(b, c, d = !0, e = []) {
          let g
          if (d) g = b[1][c]
          else {
            let a = b[1]
            g = a.children ?? Object.values(a)[0]
          }
          if (!g) return e
          let h = f(g[0])
          return !h || h.startsWith(k) ? e : (e.push(h), a(g, c, !1, e))
        }
      },
      isGroupSegment: function () {
        return g
      },
      isParallelRouteSegment: function () {
        return h
      },
    }
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] })
    function f(a) {
      return Array.isArray(a) ? a[1] : a
    }
    function g(a) {
      return '(' === a[0] && a.endsWith(')')
    }
    function h(a) {
      return a.startsWith('@') && '@children' !== a
    }
    function i(a, b) {
      if (a.includes(k)) {
        let a = JSON.stringify(b)
        return '{}' !== a ? k + '?' + a : k
      }
      return a
    }
    function j(a, b) {
      if (!a || 0 === a.length) return null
      let c = 'children' === b ? a[0] : a[a.length - 1]
      return c === l ? null : c
    }
    let k = '__PAGE__',
      l = '__DEFAULT__'
  },
  588644,
  (a, b, c) => {
    'use strict'
    ;(Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'InvariantError', {
        enumerable: !0,
        get: function () {
          return d
        },
      }))
    class d extends Error {
      constructor(a, b) {
        ;(super(`Invariant: ${a.endsWith('.') ? a : a + '.'} This is a bug in Next.js.`, b),
          (this.name = 'InvariantError'))
      }
    }
  },
  554427,
  (a, b, c) => {
    'use strict'
    function d() {
      let a,
        b,
        c = new Promise((c, d) => {
          ;((a = c), (b = d))
        })
      return { resolve: a, reject: b, promise: c }
    }
    ;(Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'createPromiseWithResolvers', {
        enumerable: !0,
        get: function () {
          return d
        },
      }))
  },
  699570,
  400187,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(811011),
      e = a.i(298621)
    let f = (a) => ('boolean' == typeof a ? `${a}` : 0 === a ? '0' : a),
      g = e.clsx,
      h = (a, b) => (c) => {
        var d
        if ((null == b ? void 0 : b.variants) == null)
          return g(a, null == c ? void 0 : c.class, null == c ? void 0 : c.className)
        let { variants: e, defaultVariants: h } = b,
          i = Object.keys(e).map((a) => {
            let b = null == c ? void 0 : c[a],
              d = null == h ? void 0 : h[a]
            if (null === b) return null
            let g = f(b) || f(d)
            return e[a][g]
          }),
          j =
            c &&
            Object.entries(c).reduce((a, b) => {
              let [c, d] = b
              return (void 0 === d || (a[c] = d), a)
            }, {})
        return g(
          a,
          i,
          null == b || null == (d = b.compoundVariants)
            ? void 0
            : d.reduce((a, b) => {
                let { class: c, className: d, ...e } = b
                return Object.entries(e).every((a) => {
                  let [b, c] = a
                  return Array.isArray(c) ? c.includes({ ...h, ...j }[b]) : { ...h, ...j }[b] === c
                })
                  ? [...a, c, d]
                  : a
              }, []),
          null == c ? void 0 : c.class,
          null == c ? void 0 : c.className
        )
      }
    a.s(['cva', 0, h], 400187)
    var i = a.i(368114)
    let j = h(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-[0.98] active:opacity-90 relative overflow-hidden',
        {
          variants: {
            variant: {
              default:
                'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md active:shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
              destructive:
                'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm hover:shadow-md',
              outline:
                'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90 shadow-sm hover:shadow-md hover:border-primary/30',
              secondary:
                'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm hover:shadow-md',
              ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
              link: 'text-primary underline-offset-4 hover:underline active:text-primary/80',
              cta: 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl active:shadow-md transform hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
              'cta-outline':
                'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
              'mobile-primary':
                'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl active:shadow-md min-h-[48px] sm:min-h-[44px] rounded-lg font-semibold',
            },
            size: {
              default: 'min-h-[44px] px-4 py-3 sm:min-h-[40px] sm:py-2',
              sm: 'min-h-[40px] rounded-md px-3 py-2 sm:min-h-[36px] text-sm',
              lg: 'min-h-[48px] rounded-md px-6 py-3 sm:min-h-[44px] sm:px-8 text-base',
              xl: 'min-h-[52px] rounded-lg px-8 py-4 sm:min-h-[48px] sm:px-10 text-lg font-semibold',
              icon: 'min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]',
              'icon-sm': 'min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px]',
              'icon-lg': 'min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px]',
            },
          },
          defaultVariants: { variant: 'default', size: 'default' },
        }
      ),
      k = c.forwardRef(({ className: a, variant: c, size: e, asChild: f = !1, ...g }, h) => {
        let k = f ? d.Slot : 'button'
        return (0, b.jsx)(k, {
          className: (0, i.cn)(j({ variant: c, size: e, className: a })),
          ref: h,
          ...g,
        })
      })
    ;((k.displayName = 'Button'), a.s(['Button', () => k, 'buttonVariants', () => j], 699570))
  },
  170106,
  (a) => {
    'use strict'
    var b = a.i(572131)
    let c = (a) => {
        let b = a.replace(/^([A-Z])|[\s-_]+(\w)/g, (a, b, c) =>
          c ? c.toUpperCase() : b.toLowerCase()
        )
        return b.charAt(0).toUpperCase() + b.slice(1)
      },
      d = (...a) =>
        a
          .filter((a, b, c) => !!a && '' !== a.trim() && c.indexOf(a) === b)
          .join(' ')
          .trim()
    var e = {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }
    let f = (0, b.forwardRef)(
        (
          {
            color: a = 'currentColor',
            size: c = 24,
            strokeWidth: f = 2,
            absoluteStrokeWidth: g,
            className: h = '',
            children: i,
            iconNode: j,
            ...k
          },
          l
        ) =>
          (0, b.createElement)(
            'svg',
            {
              ref: l,
              ...e,
              width: c,
              height: c,
              stroke: a,
              strokeWidth: g ? (24 * Number(f)) / Number(c) : f,
              className: d('lucide', h),
              ...(!i &&
                !((a) => {
                  for (let b in a)
                    if (b.startsWith('aria-') || 'role' === b || 'title' === b) return !0
                })(k) && { 'aria-hidden': 'true' }),
              ...k,
            },
            [...j.map(([a, c]) => (0, b.createElement)(a, c)), ...(Array.isArray(i) ? i : [i])]
          )
      ),
      g = (a, e) => {
        let g = (0, b.forwardRef)(({ className: g, ...h }, i) =>
          (0, b.createElement)(f, {
            ref: i,
            iconNode: e,
            className: d(
              `lucide-${c(a)
                .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                .toLowerCase()}`,
              `lucide-${a}`,
              g
            ),
            ...h,
          })
        )
        return ((g.displayName = c(a)), g)
      }
    a.s(['default', () => g], 170106)
  },
  346058,
  (a, b, c) => {
    'use strict'
    function d(a) {
      if ('function' != typeof WeakMap) return null
      var b = new WeakMap(),
        c = new WeakMap()
      return (d = function (a) {
        return a ? c : b
      })(a)
    }
    c._ = function (a, b) {
      if (!b && a && a.__esModule) return a
      if (null === a || ('object' != typeof a && 'function' != typeof a)) return { default: a }
      var c = d(b)
      if (c && c.has(a)) return c.get(a)
      var e = { __proto__: null },
        f = Object.defineProperty && Object.getOwnPropertyDescriptor
      for (var g in a)
        if ('default' !== g && Object.prototype.hasOwnProperty.call(a, g)) {
          var h = f ? Object.getOwnPropertyDescriptor(a, g) : null
          h && (h.get || h.set) ? Object.defineProperty(e, g, h) : (e[g] = a[g])
        }
      return ((e.default = a), c && c.set(a, e), e)
    }
  },
  596221,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('loader-circle', [
      ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }],
    ])
    a.s(['Loader2', () => b], 596221)
  },
  30553,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = a.i(935112),
      d = a.i(811011),
      e = a.i(187924),
      f = [
        'a',
        'button',
        'div',
        'form',
        'h2',
        'h3',
        'img',
        'input',
        'label',
        'li',
        'nav',
        'ol',
        'p',
        'select',
        'span',
        'svg',
        'ul',
      ].reduce((a, c) => {
        let f = (0, d.createSlot)(`Primitive.${c}`),
          g = b.forwardRef((a, b) => {
            let { asChild: d, ...g } = a
            return (0, e.jsx)(d ? f : c, { ...g, ref: b })
          })
        return ((g.displayName = `Primitive.${c}`), { ...a, [c]: g })
      }, {})
    function g(a, b) {
      a && c.flushSync(() => a.dispatchEvent(b))
    }
    a.s(['Primitive', () => f, 'dispatchDiscreteCustomEvent', () => g])
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
  667937,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('calendar', [
      ['path', { d: 'M8 2v4', key: '1cmpym' }],
      ['path', { d: 'M16 2v4', key: '4m81vk' }],
      ['rect', { width: '18', height: '18', x: '3', y: '4', rx: '2', key: '1hopcy' }],
      ['path', { d: 'M3 10h18', key: '8toen8' }],
    ])
    a.s(['default', () => b])
  },
  152839,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('clock', [
      ['path', { d: 'M12 6v6l4 2', key: 'mmk7yg' }],
      ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ])
    a.s(['default', () => b])
  },
  505084,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(30553),
      e = 'horizontal',
      f = ['horizontal', 'vertical'],
      g = c.forwardRef((a, c) => {
        var g
        let { decorative: h, orientation: i = e, ...j } = a,
          k = ((g = i), f.includes(g)) ? i : e
        return (0, b.jsx)(d.Primitive.div, {
          'data-orientation': k,
          ...(h
            ? { role: 'none' }
            : { 'aria-orientation': 'vertical' === k ? k : void 0, role: 'separator' }),
          ...j,
          ref: c,
        })
      })
    g.displayName = 'Separator'
    var h = a.i(368114)
    function i({ className: a, orientation: c = 'horizontal', decorative: d = !0, ...e }) {
      return (0, b.jsx)(g, {
        'data-slot': 'separator',
        decorative: d,
        orientation: c,
        className: (0, h.cn)(
          'bg-border shrink-0',
          'horizontal' === c ? 'h-[1px] w-full' : 'h-full w-[1px]',
          a
        ),
        ...e,
      })
    }
    a.s(['Separator', () => i], 505084)
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
  786304,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(400187),
      e = a.i(368114)
    let f = (0, d.cva)(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap shrink-0',
        {
          variants: {
            variant: {
              default:
                'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
              secondary:
                'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
              destructive:
                'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
              outline: 'text-foreground',
              success: 'border-transparent bg-green-500 text-white shadow hover:bg-green-500/80',
              warning: 'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80',
              info: 'border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80',
            },
          },
          defaultVariants: { variant: 'default' },
        }
      ),
      g = c.forwardRef(({ className: a, variant: c, ...d }, g) =>
        (0, b.jsx)('div', { ref: g, className: (0, e.cn)(f({ variant: c }), a), ...d })
      )
    ;((g.displayName = 'Badge'), a.s(['Badge', () => g]))
  },
  854251,
  (a) => {
    'use strict'
    var b = a.i(626405)
    a.s(['CheckCircleIcon', () => b.default])
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
  39355,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('user', [
      ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', key: '975kel' }],
      ['circle', { cx: '12', cy: '7', r: '4', key: '17ys0d' }],
    ])
    a.s(['default', () => b])
  },
  730769,
  (a) => {
    'use strict'
    var b = a.i(667937)
    a.s(['CalendarIcon', () => b.default])
  },
  130748,
  (a) => {
    'use strict'
    var b = a.i(39355)
    a.s(['UserIcon', () => b.default])
  },
  447824,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('scissors', [
      ['circle', { cx: '6', cy: '6', r: '3', key: '1lh9wr' }],
      ['path', { d: 'M8.12 8.12 12 12', key: '1alkpv' }],
      ['path', { d: 'M20 4 8.12 15.88', key: 'xgtan2' }],
      ['circle', { cx: '6', cy: '18', r: '3', key: 'fqmcym' }],
      ['path', { d: 'M14.8 14.8 20 20', key: 'ptml3r' }],
    ])
    a.s(['default', () => b])
  },
  275564,
  (a) => {
    'use strict'
    var b = a.i(447824)
    a.s(['ScissorsIcon', () => b.default])
  },
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
  485155,
  (a) => {
    'use strict'
    var b = a.i(895174)
    a.s(['AlertCircleIcon', () => b.default])
  },
  558020,
  (a) => {
    'use strict'
    var b = a.i(152839)
    a.s(['ClockIcon', () => b.default])
  },
  994644,
  (a) => {
    'use strict'
    var b = a.i(261707)
    a.s(['HomeIcon', () => b.default])
  },
  900858,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(50944),
      e = a.i(433217),
      f = a.i(238246),
      g = a.i(591119),
      h = a.i(699570),
      i = a.i(786304),
      j = a.i(505084),
      k = a.i(205138),
      l = a.i(854251),
      m = a.i(730769),
      n = a.i(558020),
      o = a.i(130748),
      p = a.i(275564),
      q = a.i(994644)
    let r = (0, a.i(170106).default)('list', [
      ['path', { d: 'M3 5h.01', key: '18ugdj' }],
      ['path', { d: 'M3 12h.01', key: 'nlz23k' }],
      ['path', { d: 'M3 19h.01', key: 'noohij' }],
      ['path', { d: 'M8 5h13', key: '1pao27' }],
      ['path', { d: 'M8 12h13', key: '1za7za' }],
      ['path', { d: 'M8 19h13', key: 'm83p4d' }],
    ])
    var s = a.i(485155),
      t = a.i(256711),
      u = a.i(302491)
    function v({ params: a }) {
      let v,
        w = (0, c.use)(a),
        x = (0, d.useRouter)(),
        {
          data: y,
          isLoading: z,
          isError: A,
        } = (0, e.useQuery)({
          queryKey: ['booking', w.id],
          queryFn: async () => {
            let a = await fetch(`/api/customer/booking/${w.id}`)
            if (!a.ok) throw Error('예약 정보를 불러올 수 없습니다')
            return a.json()
          },
          retry: !1,
        })
      return ((0, c.useEffect)(() => {
        A && x.push('/customer/bookings')
      }, [A, x]),
      z || A)
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(k.LoadingSpinner, {}),
          })
        : y
          ? (0, b.jsx)('div', {
              className: 'from-primary/5 to-background min-h-screen bg-gradient-to-b',
              children: (0, b.jsx)('div', {
                className: 'container mx-auto px-4 py-8',
                children: (0, b.jsxs)('div', {
                  className: 'mx-auto max-w-2xl',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'mb-8 text-center',
                      children: [
                        (0, b.jsx)(l.CheckCircleIcon, {
                          className: 'mx-auto mb-4 h-16 w-16 text-green-600',
                        }),
                        (0, b.jsx)('h1', {
                          className: 'mb-2 text-3xl font-bold',
                          children: '예약이 완료되었습니다!',
                        }),
                        (0, b.jsxs)('p', {
                          className: 'text-muted-foreground',
                          children: [
                            '예약번호:',
                            ' ',
                            (0, b.jsx)('span', {
                              className: 'font-mono font-semibold',
                              children: y.id.slice(-8).toUpperCase(),
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)(g.Card, {
                      className: 'mb-6',
                      children: [
                        (0, b.jsx)(g.CardHeader, {
                          children: (0, b.jsxs)(g.CardTitle, {
                            className: 'flex items-center gap-2',
                            children: [
                              (0, b.jsx)(m.CalendarIcon, { className: 'h-5 w-5' }),
                              '예약 정보',
                            ],
                          }),
                        }),
                        (0, b.jsxs)(g.CardContent, {
                          className: 'space-y-4',
                          children: [
                            (0, b.jsxs)('div', {
                              className: 'flex items-start gap-4',
                              children: [
                                (0, b.jsx)(m.CalendarIcon, {
                                  className: 'text-muted-foreground mt-0.5 h-5 w-5',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'flex-1',
                                  children: [
                                    (0, b.jsx)('p', {
                                      className: 'font-medium',
                                      children:
                                        ((v = y.appointmentDate),
                                        (0, t.format)(new Date(v), 'yyyy년 MM월 dd일 (EEEE)', {
                                          locale: u.ko,
                                        })),
                                    }),
                                    (0, b.jsxs)('p', {
                                      className:
                                        'text-muted-foreground mt-1 flex items-center gap-1 text-sm',
                                      children: [
                                        (0, b.jsx)(n.ClockIcon, { className: 'h-4 w-4' }),
                                        y.startTime,
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsx)(j.Separator, {}),
                            (0, b.jsxs)('div', {
                              className: 'flex items-start gap-4',
                              children: [
                                (0, b.jsx)(o.UserIcon, {
                                  className: 'text-muted-foreground mt-0.5 h-5 w-5',
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'flex-1',
                                  children: [
                                    (0, b.jsx)('p', {
                                      className: 'text-muted-foreground text-sm',
                                      children: '담당 미용사',
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'font-medium',
                                      children: y.groomer.name,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsx)(j.Separator, {}),
                            (0, b.jsxs)('div', {
                              className: 'space-y-4',
                              children: [
                                (0, b.jsxs)('div', {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    (0, b.jsx)(p.ScissorsIcon, {
                                      className: 'text-muted-foreground h-5 w-5',
                                    }),
                                    (0, b.jsx)('p', {
                                      className: 'font-medium',
                                      children: '서비스 내역',
                                    }),
                                  ],
                                }),
                                (0, b.jsxs)('div', {
                                  className: 'bg-muted/50 ml-7 rounded-lg p-3',
                                  children: [
                                    (0, b.jsxs)('p', {
                                      className: 'mb-2 font-medium',
                                      children: [y.pet.name, ' (', y.pet.breed, ')'],
                                    }),
                                    (0, b.jsxs)('div', {
                                      className: 'space-y-1',
                                      children: [
                                        y.services.map((a, c) =>
                                          (0, b.jsxs)(
                                            'div',
                                            {
                                              className: 'flex justify-between text-sm',
                                              children: [
                                                (0, b.jsxs)('span', {
                                                  className: 'text-muted-foreground',
                                                  children: ['• ', a.name],
                                                }),
                                                (0, b.jsxs)('span', {
                                                  className: 'font-medium',
                                                  children: [a.price.toLocaleString(), '원'],
                                                }),
                                              ],
                                            },
                                            c
                                          )
                                        ),
                                        y.options &&
                                          y.options.length > 0 &&
                                          (0, b.jsxs)(b.Fragment, {
                                            children: [
                                              (0, b.jsx)('div', {
                                                className: 'mt-2 border-t pt-2',
                                                children: (0, b.jsx)('span', {
                                                  className:
                                                    'text-muted-foreground text-xs font-medium',
                                                  children: '추가 옵션',
                                                }),
                                              }),
                                              y.options.map((a, c) =>
                                                (0, b.jsxs)(
                                                  'div',
                                                  {
                                                    className: 'flex justify-between text-sm',
                                                    children: [
                                                      (0, b.jsxs)('span', {
                                                        className: 'text-muted-foreground',
                                                        children: ['+ ', a.name],
                                                      }),
                                                      (0, b.jsxs)('span', {
                                                        className: 'font-medium',
                                                        children: [a.price.toLocaleString(), '원'],
                                                      }),
                                                    ],
                                                  },
                                                  c
                                                )
                                              ),
                                            ],
                                          }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsx)(j.Separator, {}),
                            (0, b.jsxs)('div', {
                              className: 'flex items-center justify-between pt-2',
                              children: [
                                (0, b.jsx)('p', {
                                  className: 'text-lg font-semibold',
                                  children: '총 결제금액',
                                }),
                                (0, b.jsxs)('p', {
                                  className: 'text-primary text-2xl font-bold',
                                  children: [y.totalAmount.toLocaleString('ko-KR'), '원'],
                                }),
                              ],
                            }),
                            (0, b.jsxs)('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                (0, b.jsx)(i.Badge, {
                                  variant: 'PAID' === y.paymentStatus ? 'success' : 'secondary',
                                  children: 'PAID' === y.paymentStatus ? '결제완료' : '결제대기',
                                }),
                                (0, b.jsxs)('span', {
                                  className: 'text-muted-foreground text-sm',
                                  children: [
                                    '1차 결제: ',
                                    y.paidAmount.toLocaleString('ko-KR'),
                                    '원',
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsx)(g.Card, {
                      className: 'mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10',
                      children: (0, b.jsxs)(g.CardContent, {
                        className: 'pt-6',
                        children: [
                          (0, b.jsxs)('h3', {
                            className: 'mb-2 flex items-center gap-2 font-semibold',
                            children: [
                              (0, b.jsx)(s.AlertCircleIcon, {
                                className: 'h-5 w-5 text-yellow-600',
                              }),
                              '예약 안내사항',
                            ],
                          }),
                          (0, b.jsxs)('ul', {
                            className: 'text-muted-foreground ml-7 space-y-1 text-sm',
                            children: [
                              (0, b.jsx)('li', {
                                children: '• 예약 2시간 전에 알림을 보내드립니다',
                              }),
                              (0, b.jsx)('li', {
                                children: '• 예약 시간 10분 전까지 도착해 주세요',
                              }),
                              (0, b.jsx)('li', {
                                children: '• 예약 변경이 필요한 경우 미리 연락 부탁드립니다',
                              }),
                              (0, b.jsx)('li', {
                                children: '• 반려동물의 건강 상태를 미리 알려주세요',
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsxs)('div', {
                      className: 'flex flex-col gap-4 sm:flex-row',
                      children: [
                        (0, b.jsx)(h.Button, {
                          asChild: !0,
                          className: 'flex-1',
                          children: (0, b.jsxs)(f.default, {
                            href: '/customer/bookings',
                            children: [
                              (0, b.jsx)(r, { className: 'mr-2 h-4 w-4' }),
                              '예약 목록 보기',
                            ],
                          }),
                        }),
                        (0, b.jsx)(h.Button, {
                          asChild: !0,
                          variant: 'outline',
                          className: 'flex-1',
                          children: (0, b.jsxs)(f.default, {
                            href: '/',
                            children: [
                              (0, b.jsx)(q.HomeIcon, { className: 'mr-2 h-4 w-4' }),
                              '홈으로 돌아가기',
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            })
          : (0, b.jsx)('div', {
              className: 'flex min-h-screen items-center justify-center',
              children: (0, b.jsx)(g.Card, {
                className: 'w-full max-w-md',
                children: (0, b.jsx)(g.CardContent, {
                  className: 'pt-6',
                  children: (0, b.jsxs)('div', {
                    className: 'text-center',
                    children: [
                      (0, b.jsx)(s.AlertCircleIcon, {
                        className: 'text-destructive mx-auto mb-4 h-12 w-12',
                      }),
                      (0, b.jsx)('h3', {
                        className: 'mb-2 text-lg font-medium',
                        children: '예약 정보를 찾을 수 없습니다',
                      }),
                      (0, b.jsx)(h.Button, {
                        asChild: !0,
                        className: 'mt-4',
                        children: (0, b.jsx)(f.default, {
                          href: '/customer/bookings',
                          children: '예약 목록으로 돌아가기',
                        }),
                      }),
                    ],
                  }),
                }),
              }),
            })
    }
    a.s(['default', () => v], 900858)
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__f2691b6f._.js.map
