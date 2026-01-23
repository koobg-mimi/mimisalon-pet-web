module.exports = [
  536642,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = Object.defineProperty,
      e = Object.defineProperties,
      f = Object.getOwnPropertyDescriptors,
      g = Object.getOwnPropertySymbols,
      h = Object.prototype.hasOwnProperty,
      i = Object.prototype.propertyIsEnumerable,
      j = (a, b, c) =>
        b in a ? d(a, b, { enumerable: !0, configurable: !0, writable: !0, value: c }) : (a[b] = c),
      k = c.createContext({}),
      l = c.forwardRef((a, b) => {
        let d
        var l,
          o,
          p,
          {
            value: q,
            onChange: r,
            maxLength: s,
            textAlign: t = 'left',
            pattern: u,
            placeholder: v,
            inputMode: w = 'numeric',
            onComplete: x,
            pushPasswordManagerStrategy: y = 'increase-width',
            pasteTransformer: z,
            containerClassName: A,
            noScriptCSSFallback: B = n,
            render: C,
            children: D,
          } = a,
          E = ((a, b) => {
            var c = {}
            for (var d in a) h.call(a, d) && 0 > b.indexOf(d) && (c[d] = a[d])
            if (null != a && g)
              for (var d of g(a)) 0 > b.indexOf(d) && i.call(a, d) && (c[d] = a[d])
            return c
          })(a, [
            'value',
            'onChange',
            'maxLength',
            'textAlign',
            'pattern',
            'placeholder',
            'inputMode',
            'onComplete',
            'pushPasswordManagerStrategy',
            'pasteTransformer',
            'containerClassName',
            'noScriptCSSFallback',
            'render',
            'children',
          ])
        let [F, G] = c.useState('string' == typeof E.defaultValue ? E.defaultValue : ''),
          H = null != q ? q : F,
          I =
            ((d = c.useRef()),
            c.useEffect(() => {
              d.current = H
            }),
            d.current),
          J = c.useCallback(
            (a) => {
              ;(null == r || r(a), G(a))
            },
            [r]
          ),
          K = c.useMemo(() => (u ? ('string' == typeof u ? new RegExp(u) : u) : null), [u]),
          L = c.useRef(null),
          M = c.useRef(null),
          N = c.useRef({ value: H, onChange: J, isIOS: !1 }),
          O = c.useRef({
            prev: [
              null == (l = L.current) ? void 0 : l.selectionStart,
              null == (o = L.current) ? void 0 : o.selectionEnd,
              null == (p = L.current) ? void 0 : p.selectionDirection,
            ],
          })
        ;(c.useImperativeHandle(b, () => L.current, []),
          c.useEffect(() => {
            let a = L.current,
              b = M.current
            if (!a || !b) return
            function c() {
              if (document.activeElement !== a) {
                ;(U(null), W(null))
                return
              }
              let b = a.selectionStart,
                c = a.selectionEnd,
                d = a.selectionDirection,
                e = a.maxLength,
                f = a.value,
                g = O.current.prev,
                h = -1,
                i = -1,
                j
              if (0 !== f.length && null !== b && null !== c) {
                let a = b === c,
                  d = b === f.length && f.length < e
                if (a && !d) {
                  if (0 === b) ((h = 0), (i = 1), (j = 'forward'))
                  else if (b === e) ((h = b - 1), (i = b), (j = 'backward'))
                  else if (e > 1 && f.length > 1) {
                    let a = 0
                    if (null !== g[0] && null !== g[1]) {
                      j = b < g[1] ? 'backward' : 'forward'
                      let c = g[0] === g[1] && g[0] < e
                      'backward' !== j || c || (a = -1)
                    }
                    ;((h = a + b), (i = a + b + 1))
                  }
                }
                ;-1 !== h && -1 !== i && h !== i && L.current.setSelectionRange(h, i, j)
              }
              let k = -1 !== h ? h : b,
                l = -1 !== i ? i : c,
                m = null != j ? j : d
              ;(U(k), W(l), (O.current.prev = [k, l, m]))
            }
            if (
              (N.current.value !== a.value && N.current.onChange(a.value),
              (O.current.prev = [a.selectionStart, a.selectionEnd, a.selectionDirection]),
              document.addEventListener('selectionchange', c, { capture: !0 }),
              c(),
              document.activeElement === a && S(!0),
              !document.getElementById('input-otp-style'))
            ) {
              let a = document.createElement('style')
              if (((a.id = 'input-otp-style'), document.head.appendChild(a), a.sheet)) {
                let b =
                  'background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;'
                ;(m(
                  a.sheet,
                  '[data-input-otp]::selection { background: transparent !important; color: transparent !important; }'
                ),
                  m(a.sheet, `[data-input-otp]:autofill { ${b} }`),
                  m(a.sheet, `[data-input-otp]:-webkit-autofill { ${b} }`),
                  m(
                    a.sheet,
                    '@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }'
                  ),
                  m(a.sheet, '[data-input-otp] + * { pointer-events: all !important; }'))
              }
            }
            let d = () => {
              b && b.style.setProperty('--root-height', `${a.clientHeight}px`)
            }
            d()
            let e = new ResizeObserver(d)
            return (
              e.observe(a),
              () => {
                ;(document.removeEventListener('selectionchange', c, { capture: !0 }),
                  e.disconnect())
              }
            )
          }, []))
        let [P, Q] = c.useState(!1),
          [R, S] = c.useState(!1),
          [T, U] = c.useState(null),
          [V, W] = c.useState(null)
        ;(c.useEffect(() => {
          var a
          ;(setTimeout(
            (a = () => {
              var a, b, c, d
              null == (a = L.current) || a.dispatchEvent(new Event('input'))
              let e = null == (b = L.current) ? void 0 : b.selectionStart,
                f = null == (c = L.current) ? void 0 : c.selectionEnd,
                g = null == (d = L.current) ? void 0 : d.selectionDirection
              null !== e && null !== f && (U(e), W(f), (O.current.prev = [e, f, g]))
            }),
            0
          ),
            setTimeout(a, 10),
            setTimeout(a, 50))
        }, [H, R]),
          c.useEffect(() => {
            void 0 !== I && H !== I && I.length < s && H.length === s && (null == x || x(H))
          }, [s, x, I, H]))
        let X = (function ({
            containerRef: a,
            inputRef: b,
            pushPasswordManagerStrategy: d,
            isFocused: e,
          }) {
            let [f, g] = c.useState(!1),
              [h, i] = c.useState(!1),
              [j, k] = c.useState(!1),
              l = c.useMemo(
                () =>
                  'none' !== d &&
                  ('increase-width' === d || 'experimental-no-flickering' === d) &&
                  f &&
                  h,
                [f, h, d]
              ),
              m = c.useCallback(() => {
                let c = a.current,
                  e = b.current
                if (!c || !e || j || 'none' === d) return
                let f = c.getBoundingClientRect().left + c.offsetWidth,
                  h = c.getBoundingClientRect().top + c.offsetHeight / 2
                ;(0 ===
                  document.querySelectorAll(
                    '[data-lastpass-icon-root],com-1password-button,[data-dashlanecreated],[style$="2147483647 !important;"]'
                  ).length &&
                  document.elementFromPoint(f - 18, h) === c) ||
                  (g(!0), k(!0))
              }, [a, b, j, d])
            return (
              c.useEffect(() => {
                let b = a.current
                if (!b || 'none' === d) return
                function c() {
                  i(window.innerWidth - b.getBoundingClientRect().right >= 40)
                }
                c()
                let e = setInterval(c, 1e3)
                return () => {
                  clearInterval(e)
                }
              }, [a, d]),
              c.useEffect(() => {
                let a = e || document.activeElement === b.current
                if ('none' === d || !a) return
                let c = setTimeout(m, 0),
                  f = setTimeout(m, 2e3),
                  g = setTimeout(m, 5e3),
                  h = setTimeout(() => {
                    k(!0)
                  }, 6e3)
                return () => {
                  ;(clearTimeout(c), clearTimeout(f), clearTimeout(g), clearTimeout(h))
                }
              }, [b, e, d, m]),
              { hasPWMBadge: f, willPushPWMBadge: l, PWM_BADGE_SPACE_WIDTH: '40px' }
            )
          })({ containerRef: M, inputRef: L, pushPasswordManagerStrategy: y, isFocused: R }),
          Y = c.useCallback(
            (a) => {
              let b = a.currentTarget.value.slice(0, s)
              b.length > 0 && K && !K.test(b)
                ? a.preventDefault()
                : ('string' == typeof I &&
                    b.length < I.length &&
                    document.dispatchEvent(new Event('selectionchange')),
                  J(b))
            },
            [s, J, I, K]
          ),
          Z = c.useCallback(() => {
            var a
            if (L.current) {
              let b = Math.min(L.current.value.length, s - 1),
                c = L.current.value.length
              ;(null == (a = L.current) || a.setSelectionRange(b, c), U(b), W(c))
            }
            S(!0)
          }, [s]),
          $ = c.useCallback(
            (a) => {
              var b, c
              let d = L.current
              if (!z && (!N.current.isIOS || !a.clipboardData || !d)) return
              let e = a.clipboardData.getData('text/plain'),
                f = z ? z(e) : e
              a.preventDefault()
              let g = null == (b = L.current) ? void 0 : b.selectionStart,
                h = null == (c = L.current) ? void 0 : c.selectionEnd,
                i = (
                  g !== h ? H.slice(0, g) + f + H.slice(h) : H.slice(0, g) + f + H.slice(g)
                ).slice(0, s)
              if (i.length > 0 && K && !K.test(i)) return
              ;((d.value = i), J(i))
              let j = Math.min(i.length, s - 1),
                k = i.length
              ;(d.setSelectionRange(j, k), U(j), W(k))
            },
            [s, J, K, H]
          ),
          _ = c.useMemo(
            () => ({
              position: 'relative',
              cursor: E.disabled ? 'default' : 'text',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none',
            }),
            [E.disabled]
          ),
          aa = c.useMemo(
            () => ({
              position: 'absolute',
              inset: 0,
              width: X.willPushPWMBadge ? `calc(100% + ${X.PWM_BADGE_SPACE_WIDTH})` : '100%',
              clipPath: X.willPushPWMBadge ? `inset(0 ${X.PWM_BADGE_SPACE_WIDTH} 0 0)` : void 0,
              height: '100%',
              display: 'flex',
              textAlign: t,
              opacity: '1',
              color: 'transparent',
              pointerEvents: 'all',
              background: 'transparent',
              caretColor: 'transparent',
              border: '0 solid transparent',
              outline: '0 solid transparent',
              boxShadow: 'none',
              lineHeight: '1',
              letterSpacing: '-.5em',
              fontSize: 'var(--root-height)',
              fontFamily: 'monospace',
              fontVariantNumeric: 'tabular-nums',
            }),
            [X.PWM_BADGE_SPACE_WIDTH, X.willPushPWMBadge, t]
          ),
          ab = c.useMemo(
            () =>
              c.createElement(
                'input',
                e(
                  ((a, b) => {
                    for (var c in b || (b = {})) h.call(b, c) && j(a, c, b[c])
                    if (g) for (var c of g(b)) i.call(b, c) && j(a, c, b[c])
                    return a
                  })({ autoComplete: E.autoComplete || 'one-time-code' }, E),
                  f({
                    'data-input-otp': !0,
                    'data-input-otp-placeholder-shown': 0 === H.length || void 0,
                    'data-input-otp-mss': T,
                    'data-input-otp-mse': V,
                    inputMode: w,
                    pattern: null == K ? void 0 : K.source,
                    'aria-placeholder': v,
                    style: aa,
                    maxLength: s,
                    value: H,
                    ref: L,
                    onPaste: (a) => {
                      var b
                      ;($(a), null == (b = E.onPaste) || b.call(E, a))
                    },
                    onChange: Y,
                    onMouseOver: (a) => {
                      var b
                      ;(Q(!0), null == (b = E.onMouseOver) || b.call(E, a))
                    },
                    onMouseLeave: (a) => {
                      var b
                      ;(Q(!1), null == (b = E.onMouseLeave) || b.call(E, a))
                    },
                    onFocus: (a) => {
                      var b
                      ;(Z(), null == (b = E.onFocus) || b.call(E, a))
                    },
                    onBlur: (a) => {
                      var b
                      ;(S(!1), null == (b = E.onBlur) || b.call(E, a))
                    },
                  })
                )
              ),
            [Y, Z, $, w, aa, s, V, T, E, null == K ? void 0 : K.source, H]
          ),
          ac = c.useMemo(
            () => ({
              slots: Array.from({ length: s }).map((a, b) => {
                var c
                let d =
                    R && null !== T && null !== V && ((T === V && b === T) || (b >= T && b < V)),
                  e = void 0 !== H[b] ? H[b] : null
                return {
                  char: e,
                  placeholderChar:
                    void 0 !== H[0] ? null : null != (c = null == v ? void 0 : v[b]) ? c : null,
                  isActive: d,
                  hasFakeCaret: d && null === e,
                }
              }),
              isFocused: R,
              isHovering: !E.disabled && P,
            }),
            [R, P, s, V, T, E.disabled, H]
          ),
          ad = c.useMemo(
            () => (C ? C(ac) : c.createElement(k.Provider, { value: ac }, D)),
            [D, ac, C]
          )
        return c.createElement(
          c.Fragment,
          null,
          null !== B && c.createElement('noscript', null, c.createElement('style', null, B)),
          c.createElement(
            'div',
            { ref: M, 'data-input-otp-container': !0, style: _, className: A },
            ad,
            c.createElement(
              'div',
              { style: { position: 'absolute', inset: 0, pointerEvents: 'none' } },
              ab
            )
          )
        )
      })
    function m(a, b) {
      try {
        a.insertRule(b)
      } catch (a) {
        console.error('input-otp could not insert CSS rule:', b)
      }
    }
    l.displayName = 'Input'
    var n = `
[data-input-otp] {
  --nojs-bg: white !important;
  --nojs-fg: black !important;

  background-color: var(--nojs-bg) !important;
  color: var(--nojs-fg) !important;
  caret-color: var(--nojs-fg) !important;
  letter-spacing: .25em !important;
  text-align: center !important;
  border: 1px solid var(--nojs-fg) !important;
  border-radius: 4px !important;
  width: 100% !important;
}
@media (prefers-color-scheme: dark) {
  [data-input-otp] {
    --nojs-bg: black !important;
    --nojs-fg: white !important;
  }
}`
    a.i(322316)
    var o = a.i(368114)
    function p({ className: a, containerClassName: c, ...d }) {
      return (0, b.jsx)(l, {
        'data-slot': 'input-otp',
        containerClassName: (0, o.cn)('flex items-center gap-2 has-disabled:opacity-50', c),
        className: (0, o.cn)('disabled:cursor-not-allowed', a),
        ...d,
      })
    }
    function q({ className: a, ...c }) {
      return (0, b.jsx)('div', {
        'data-slot': 'input-otp-group',
        className: (0, o.cn)('flex items-center', a),
        ...c,
      })
    }
    function r({ index: a, className: d, ...e }) {
      let f = c.useContext(k),
        { char: g, hasFakeCaret: h, isActive: i } = f?.slots[a] ?? {}
      return (0, b.jsxs)('div', {
        'data-slot': 'input-otp-slot',
        'data-active': i,
        className: (0, o.cn)(
          'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
          d
        ),
        ...e,
        children: [
          g,
          h &&
            (0, b.jsx)('div', {
              className: 'pointer-events-none absolute inset-0 flex items-center justify-center',
              children: (0, b.jsx)('div', {
                className: 'animate-caret-blink bg-foreground h-4 w-px duration-1000',
              }),
            }),
        ],
      })
    }
    a.s(['InputOTP', () => p, 'InputOTPGroup', () => q, 'InputOTPSlot', () => r], 536642)
  },
  572727,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(596221),
      e = a.i(814574),
      f = a.i(699570),
      g = a.i(536642),
      h = a.i(823292),
      i = a.i(529139)
    function j({ open: a, onOpenChange: j, identifier: k, method: l, type: m, onSuccess: n }) {
      let [o, p] = c.useState(''),
        [q, r] = c.useState(!1),
        [s, t] = c.useState(!1),
        [u, v] = c.useState(0)
      ;(c.useEffect(() => {
        if (u > 0) {
          let a = setTimeout(() => v(u - 1), 1e3)
          return () => clearTimeout(a)
        }
      }, [u]),
        c.useEffect(() => {
          6 !== o.length || q || w()
        }, [o]),
        c.useEffect(() => {
          a && (p(''), v(60))
        }, [a]))
      let w = async () => {
          if (6 === o.length) {
            r(!0)
            try {
              if (
                (console.log('🔍 OTP 검증 시작:', { method: l, type: m, identifier: k, otp: o }),
                'forget-password' === m)
              ) {
                ;(console.log('🔑 비밀번호 재설정: OTP를 부모로 전달'),
                  h.toast.success('인증코드를 확인했습니다'),
                  n(o),
                  j(!1))
                return
              }
              if ('email' === l && 'email-verification' === m) {
                console.log('📧 이메일 회원가입 검증 중...')
                let a = await fetch('/api/auth/verify-email-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: k, code: o }),
                  }),
                  b = await a.json()
                if (!a.ok) {
                  ;(console.error('❌ 이메일 OTP 검증 실패:', b),
                    h.toast.error('error' in b ? b.error : '인증에 실패했습니다'),
                    p(''))
                  return
                }
              } else if ('sms' === l) {
                console.log('📱 SMS OTP 검증 중...')
                let a = await fetch('/api/auth/verify-phone-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber: k, code: o }),
                  }),
                  b = await a.json()
                if (!a.ok) {
                  ;(console.error('❌ SMS OTP 검증 실패:', b),
                    h.toast.error('error' in b ? b.error : '인증에 실패했습니다'),
                    p(''))
                  return
                }
              }
              ;(h.toast.success('인증이 완료되었습니다'), n(o), j(!1))
            } catch (a) {
              ;(console.error('Verification error:', a),
                h.toast.error('인증 중 오류가 발생했습니다'),
                p(''))
            } finally {
              r(!1)
            }
          }
        },
        x = async () => {
          t(!0)
          try {
            ;('email' === l
              ? (console.log('📧 이메일 OTP 재전송 중...'),
                await i.authClient.emailOtp.sendVerificationOtp({ email: k, type: m }),
                console.log('✅ 이메일 OTP 재전송 완료'))
              : (console.log('📱 SMS OTP 재전송 중...'),
                await i.authClient.phoneNumber.sendOtp({ phoneNumber: k }),
                console.log('✅ SMS OTP 재전송 완료')),
              h.toast.success('인증코드가 재전송되었습니다'),
              v(60),
              p(''))
          } catch (a) {
            ;(console.error('Resend error:', a), h.toast.error('재전송 중 오류가 발생했습니다'))
          } finally {
            t(!1)
          }
        }
      return (0, b.jsx)(e.Dialog, {
        open: a,
        onOpenChange: j,
        children: (0, b.jsxs)(e.DialogContent, {
          className: 'sm:max-w-md',
          children: [
            (0, b.jsxs)(e.DialogHeader, {
              children: [
                (0, b.jsx)(e.DialogTitle, {
                  children: (() => {
                    switch (m) {
                      case 'sign-in':
                        return '로그인 인증'
                      case 'email-verification':
                        return '이메일 인증'
                      case 'forget-password':
                        return '비밀번호 재설정 인증'
                      default:
                        return '인증'
                    }
                  })(),
                }),
                (0, b.jsx)(e.DialogDescription, {
                  children: `${k}으로 전송된 6자리 인증코드를 입력하세요.`,
                }),
              ],
            }),
            (0, b.jsxs)('div', {
              className: 'space-y-6 py-4',
              children: [
                (0, b.jsx)('div', {
                  className: 'flex justify-center',
                  children: (0, b.jsx)(g.InputOTP, {
                    maxLength: 6,
                    value: o,
                    onChange: p,
                    disabled: q,
                    children: (0, b.jsxs)(g.InputOTPGroup, {
                      children: [
                        (0, b.jsx)(g.InputOTPSlot, { index: 0 }),
                        (0, b.jsx)(g.InputOTPSlot, { index: 1 }),
                        (0, b.jsx)(g.InputOTPSlot, { index: 2 }),
                        (0, b.jsx)(g.InputOTPSlot, { index: 3 }),
                        (0, b.jsx)(g.InputOTPSlot, { index: 4 }),
                        (0, b.jsx)(g.InputOTPSlot, { index: 5 }),
                      ],
                    }),
                  }),
                }),
                (0, b.jsxs)('div', {
                  className: 'space-y-3',
                  children: [
                    (0, b.jsx)('p', {
                      className: 'text-muted-foreground text-center text-sm',
                      children:
                        6 === o.length
                          ? '인증 중입니다...'
                          : `인증코드 ${o.length}/6 입력 (10분간 유효)`,
                    }),
                    (0, b.jsxs)('div', {
                      className: 'flex gap-2',
                      children: [
                        (0, b.jsx)(f.Button, {
                          type: 'button',
                          variant: 'outline',
                          size: 'sm',
                          onClick: x,
                          disabled: u > 0 || s || q,
                          className: 'flex-1',
                          children: s
                            ? (0, b.jsxs)(b.Fragment, {
                                children: [
                                  (0, b.jsx)(d.Loader2, { className: 'mr-2 h-4 w-4 animate-spin' }),
                                  '재전송 중...',
                                ],
                              })
                            : u > 0
                              ? `재전송 (${u}초)`
                              : '재전송',
                        }),
                        (0, b.jsx)(f.Button, {
                          type: 'button',
                          onClick: w,
                          disabled: 6 !== o.length || q,
                          className: 'flex-1',
                          children: q
                            ? (0, b.jsxs)(b.Fragment, {
                                children: [
                                  (0, b.jsx)(d.Loader2, { className: 'mr-2 h-4 w-4 animate-spin' }),
                                  '확인 중...',
                                ],
                              })
                            : '확인',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    }
    a.s(['OTPInputDialog', () => j])
  },
]

//# sourceMappingURL=src_components_a636a887._.js.map
