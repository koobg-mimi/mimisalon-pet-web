module.exports = [
  370025,
  (a) => {
    'use strict'
    var b = a.i(572131),
      c = a.i(612794),
      d = a.i(118544),
      e = a.i(533791),
      f = a.i(442871),
      g = class extends e.Subscribable {
        #a
        #b = void 0
        #c
        #d
        constructor(a, b) {
          ;(super(), (this.#a = a), this.setOptions(b), this.bindMethods(), this.#e())
        }
        bindMethods() {
          ;((this.mutate = this.mutate.bind(this)), (this.reset = this.reset.bind(this)))
        }
        setOptions(a) {
          let b = this.options
          ;((this.options = this.#a.defaultMutationOptions(a)),
            (0, f.shallowEqualObjects)(this.options, b) ||
              this.#a
                .getMutationCache()
                .notify({ type: 'observerOptionsUpdated', mutation: this.#c, observer: this }),
            b?.mutationKey &&
            this.options.mutationKey &&
            (0, f.hashKey)(b.mutationKey) !== (0, f.hashKey)(this.options.mutationKey)
              ? this.reset()
              : this.#c?.state.status === 'pending' && this.#c.setOptions(this.options))
        }
        onUnsubscribe() {
          this.hasListeners() || this.#c?.removeObserver(this)
        }
        onMutationUpdate(a) {
          ;(this.#e(), this.#f(a))
        }
        getCurrentResult() {
          return this.#b
        }
        reset() {
          ;(this.#c?.removeObserver(this), (this.#c = void 0), this.#e(), this.#f())
        }
        mutate(a, b) {
          return (
            (this.#d = b),
            this.#c?.removeObserver(this),
            (this.#c = this.#a.getMutationCache().build(this.#a, this.options)),
            this.#c.addObserver(this),
            this.#c.execute(a)
          )
        }
        #e() {
          let a = this.#c?.state ?? (0, c.getDefaultState)()
          this.#b = {
            ...a,
            isPending: 'pending' === a.status,
            isSuccess: 'success' === a.status,
            isError: 'error' === a.status,
            isIdle: 'idle' === a.status,
            mutate: this.mutate,
            reset: this.reset,
          }
        }
        #f(a) {
          d.notifyManager.batch(() => {
            if (this.#d && this.hasListeners()) {
              let b = this.#b.variables,
                c = this.#b.context,
                d = {
                  client: this.#a,
                  meta: this.options.meta,
                  mutationKey: this.options.mutationKey,
                }
              a?.type === 'success'
                ? (this.#d.onSuccess?.(a.data, b, c, d), this.#d.onSettled?.(a.data, null, b, c, d))
                : a?.type === 'error' &&
                  (this.#d.onError?.(a.error, b, c, d),
                  this.#d.onSettled?.(void 0, a.error, b, c, d))
            }
            this.listeners.forEach((a) => {
              a(this.#b)
            })
          })
        }
      },
      h = a.i(937927)
    function i(a, c) {
      let e = (0, h.useQueryClient)(c),
        [i] = b.useState(() => new g(e, a))
      b.useEffect(() => {
        i.setOptions(a)
      }, [i, a])
      let j = b.useSyncExternalStore(
          b.useCallback((a) => i.subscribe(d.notifyManager.batchCalls(a)), [i]),
          () => i.getCurrentResult(),
          () => i.getCurrentResult()
        ),
        k = b.useCallback(
          (a, b) => {
            i.mutate(a, b).catch(f.noop)
          },
          [i]
        )
      if (j.error && (0, f.shouldThrowError)(i.options.throwOnError, [j.error])) throw j.error
      return { ...j, mutate: k, mutateAsync: j.mutate }
    }
    a.s(['useMutation', () => i], 370025)
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
  626405,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('circle-check-big', [
      ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335', key: 'yps3ct' }],
      ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
    ])
    a.s(['default', () => b])
  },
  854251,
  (a) => {
    'use strict'
    var b = a.i(626405)
    a.s(['CheckCircleIcon', () => b.default])
  },
  216688,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('phone', [
      [
        'path',
        {
          d: 'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384',
          key: '9njp5v',
        },
      ],
    ])
    a.s(['default', () => b])
  },
  254688,
  (a) => {
    'use strict'
    var b = a.i(216688)
    a.s(['PhoneIcon', () => b.default])
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
  252523,
  (a) => {
    'use strict'
    var b = a.i(156757)
    let c = [
        'password',
        '123456',
        '123456789',
        'qwerty',
        'abc123',
        'password123',
        '12345678',
        '111111',
        '1234567890',
        'welcome',
        'admin',
        'letmein',
        'monkey',
        '1234567',
        'dragon',
        'sunshine',
        'master',
        'football',
        'baseball',
        'superman',
        'trustno1',
        '000000',
        'shadow',
        'michael',
        'jennifer',
        'jordan',
        'passw0rd',
        '123123',
        'princess',
        'solo',
        'password1',
        'starwars',
        'hello',
        'freedom',
        'whatever',
        'qazwsx',
        'mustang',
        'batman',
        'access',
        'master',
        '1q2w3e4r',
        'qwertyuiop',
        '1234qwer',
        'zaq12wsx',
        'iloveyou',
        'password12',
        'welcome123',
      ],
      d = [
        'qwerasdf',
        'asdfqwer',
        '1q2w3e4r',
        'qwer1234',
        'asdf1234',
        '12341234',
        'qwerqwer',
        'asdfasdf',
        '1111',
        '0000',
        '2580',
        'abcd1234',
        '1qaz2wsx',
        'zxcvbnm',
        'qwaszx',
        'zxcvqwer',
      ],
      e = [/(.)\1{2,}/, /123456|654321|abcdef|qwerty|asdfgh|zxcvbn/, /01234|56789|09876|87654/],
      f = b.z
        .string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
        .max(128, '비밀번호는 최대 128자까지 입력 가능합니다')
        .refine((a) => /[a-z]/.test(a), '비밀번호는 소문자를 포함해야 합니다')
        .refine((a) => /[A-Z]/.test(a), '비밀번호는 대문자를 포함해야 합니다')
        .refine((a) => /\d/.test(a), '비밀번호는 숫자를 포함해야 합니다')
        .refine(
          (a) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(a),
          '비밀번호는 특수문자를 포함해야 합니다'
        )
        .refine(
          (a) => !c.includes(a.toLowerCase()),
          '일반적으로 사용되는 비밀번호는 사용할 수 없습니다'
        )
        .refine(
          (a) => !d.includes(a.toLowerCase()),
          '일반적으로 사용되는 비밀번호는 사용할 수 없습니다'
        )
        .refine(
          (a) => !e.some((b) => b.test(a.toLowerCase())),
          '연속된 문자나 숫자는 사용할 수 없습니다'
        )
        .refine((a) => !/(.{2,})\1+/.test(a.toLowerCase()), '반복되는 패턴은 사용할 수 없습니다')
    function g(a) {
      let b = 0,
        f = []
      return (a.length >= 8 && (b += 1),
      a.length >= 12 && (b += 1),
      a.length >= 16 && (b += 1),
      /[a-z]/.test(a) && (b += 1),
      /[A-Z]/.test(a) && (b += 1),
      /\d/.test(a) && (b += 1),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(a) && (b += 1),
      c.includes(a.toLowerCase()) || (b += 1),
      d.includes(a.toLowerCase()) || (b += 1),
      e.some((b) => b.test(a.toLowerCase())) || (b += 1),
      b <= 3)
        ? (f.push('더 강력한 비밀번호를 설정하세요'),
          f.push('최소 8자 이상 사용하세요'),
          f.push('대문자, 소문자, 숫자, 특수문자를 모두 포함하세요'),
          { score: b, level: 'weak', feedback: f })
        : b <= 5
          ? (f.push('비밀번호가 보통 수준입니다'),
            f.push('12자 이상 사용하면 더 안전합니다'),
            { score: b, level: 'medium', feedback: f })
          : b <= 7
            ? (f.push('강력한 비밀번호입니다'), { score: b, level: 'strong', feedback: f })
            : (f.push('매우 강력한 비밀번호입니다'),
              { score: b, level: 'very-strong', feedback: f })
    }
    ;(b.z
      .object({ password: f, confirmPassword: b.z.string().min(1, '비밀번호 확인을 입력해주세요') })
      .refine((a) => a.password === a.confirmPassword, {
        message: '비밀번호가 일치하지 않습니다',
        path: ['confirmPassword'],
      }),
      a.s(['calculatePasswordStrength', () => g, 'enhancedPasswordSchema', 0, f]))
  },
  809551,
  (a) => {
    'use strict'
    var b = a.i(156757),
      c = a.i(252523)
    let d = b.z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식을 입력해주세요'),
      e = b.z
        .string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다'
        ),
      f = c.enhancedPasswordSchema,
      g = b.z
        .string()
        .optional()
        .refine(
          (a) => !a || /^\+821[0-9]{8,9}$/.test(a),
          '올바른 전화번호 형식을 입력해주세요 (예: +821012345678)'
        ),
      h = b.z
        .string()
        .min(1, '전화번호를 입력해주세요')
        .refine(
          (a) => /^\+821[0-9]{8,9}$/.test(a),
          '올바른 전화번호 형식을 입력해주세요 (예: +821012345678)'
        )
    b.z.enum(['CUSTOMER', 'GROOMER', 'ADMIN'], { message: '올바른 사용자 역할을 선택해주세요' })
    let i = b.z
        .string()
        .min(2, '이름은 최소 2자 이상이어야 합니다')
        .max(50, '이름은 최대 50자까지 입력 가능합니다')
        .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다'),
      j = b.z.object({
        email: d,
        password: b.z.string().min(1, '비밀번호를 입력해주세요'),
        rememberMe: b.z.boolean().optional(),
      }),
      k = b.z
        .object({
          name: i,
          email: d,
          phone: h,
          password: e,
          confirmPassword: b.z.string().min(1, '비밀번호 확인을 입력해주세요'),
          agreeToTerms: b.z
            .boolean()
            .refine((a) => !0 === a, { message: '서비스 이용약관에 동의해주세요' }),
          agreeToPrivacy: b.z
            .boolean()
            .refine((a) => !0 === a, { message: '개인정보 처리방침에 동의해주세요' }),
          agreeToMarketing: b.z.boolean().optional(),
        })
        .refine((a) => a.password === a.confirmPassword, {
          message: '비밀번호가 일치하지 않습니다',
          path: ['confirmPassword'],
        })
    ;(b.z
      .object({
        name: i,
        email: d,
        phone: h,
        password: e,
        confirmPassword: b.z.string().min(1, '비밀번호 확인을 입력해주세요'),
        experience: b.z.string().min(1, '경력을 선택해주세요'),
        certifications: b.z.string().optional(),
        agreeToTerms: b.z
          .boolean()
          .refine((a) => !0 === a, { message: '서비스 이용약관에 동의해주세요' }),
        agreeToPrivacy: b.z
          .boolean()
          .refine((a) => !0 === a, { message: '개인정보 처리방침에 동의해주세요' }),
        agreeToMarketing: b.z.boolean().optional(),
      })
      .refine((a) => a.password === a.confirmPassword, {
        message: '비밀번호가 일치하지 않습니다',
        path: ['confirmPassword'],
      }),
      b.z
        .object({
          name: i,
          email: d,
          phone: g,
          password: e,
          confirmPassword: b.z.string().min(1, '비밀번호 확인을 입력해주세요'),
          agreeToTerms: b.z
            .boolean()
            .refine((a) => !0 === a, { message: '서비스 이용약관에 동의해주세요' }),
          agreeToPrivacy: b.z
            .boolean()
            .refine((a) => !0 === a, { message: '개인정보 처리방침에 동의해주세요' }),
          agreeToMarketing: b.z.boolean().optional(),
        })
        .refine((a) => a.password === a.confirmPassword, {
          message: '비밀번호가 일치하지 않습니다',
          path: ['confirmPassword'],
        }),
      b.z
        .object({
          token: b.z.string().min(1, '유효하지 않은 토큰입니다'),
          password: f,
          confirmPassword: b.z.string().min(1, '비밀번호 확인을 입력해주세요'),
        })
        .refine((a) => a.password === a.confirmPassword, {
          message: '비밀번호가 일치하지 않습니다',
          path: ['confirmPassword'],
        }),
      b.z.object({ email: d }),
      b.z.object({ phone: h }))
    let l = b.z.object({
      phone: h,
      code: b.z.string().min(6, '인증번호 6자리를 입력해주세요').max(6, '인증번호는 6자리입니다'),
    })
    ;(b.z.object({ token: b.z.string().min(1, '유효하지 않은 인증 토큰입니다') }),
      a.s(['phoneVerificationConfirmSchema', 0, l, 'signInSchema', 0, j, 'signUpSchema', 0, k]))
  },
  322316,
  (a) => {
    'use strict'
    let b = (0, a.i(170106).default)('minus', [['path', { d: 'M5 12h14', key: '1ays0h' }]])
    a.s(['MinusIcon', () => b], 322316)
  },
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
  569107,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(50944),
      e = a.i(695245),
      f = a.i(529139),
      g = a.i(159501),
      h = a.i(370025),
      i = a.i(699570),
      j = a.i(205138),
      k = a.i(536642),
      l = a.i(441921),
      m = a.i(809551),
      n = a.i(854251),
      o = a.i(485155),
      p = a.i(254688),
      q = a.i(558020)
    function r() {
      let [a, r] = (0, c.useState)(''),
        [s, t] = (0, c.useState)(0),
        u = (0, d.useRouter)(),
        v = (0, d.useSearchParams)(),
        { data: w } = (0, f.useSession)(),
        x = v.get('phone') || '',
        y = v.get('userId') || '',
        z = v.get('returnTo') || '/dashboard',
        A = (0, e.useForm)({
          resolver: (0, g.zodResolver)(m.phoneVerificationConfirmSchema),
          defaultValues: { phone: x, code: '' },
        })
      ;(0, c.useEffect)(() => {
        let a
        return (
          s > 0 &&
            (a = setInterval(() => {
              t((a) => a - 1)
            }, 1e3)),
          () => clearInterval(a)
        )
      }, [s])
      let B = (0, h.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch('/api/auth/phone/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: a.phone, code: a.code, userId: y || void 0 }),
              }),
              c = await b.json()
            if (!b.ok) throw c
            return c
          },
          onSuccess: async () => {
            setTimeout(() => {
              y ? u.push('/settings/profile?verified=true') : u.push(z)
            }, 1500)
          },
          onError: (a) => {
            'INVALID_CODE' === a.code
              ? (r('인증 코드가 올바르지 않습니다. 다시 확인해주세요.'),
                A.setError('code', { type: 'manual', message: '올바르지 않은 인증 코드입니다.' }))
              : 'TOO_MANY_ATTEMPTS' === a.code
                ? r('인증 시도 횟수를 초과했습니다. 새로운 인증 코드를 요청해주세요.')
                : r(a.message || '인증 코드 확인에 실패했습니다.')
          },
        }),
        C = (0, h.useMutation)({
          mutationFn: async () => {
            let a = await fetch('/api/auth/phone/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: x }),
              }),
              b = await a.json()
            if (!a.ok) throw b
            return b
          },
          onSuccess: () => {
            ;(t(60), A.setValue('code', ''), r(''))
          },
          onError: (a) => {
            'TOO_SOON' === a.code
              ? (r(`${a.waitTime}초 후에 다시 요청할 수 있습니다.`), t(a.waitTime))
              : r(a.message || '인증 코드 재전송에 실패했습니다.')
          },
        })
      return B.isSuccess
        ? (0, b.jsx)('div', {
            className: 'bg-muted/50 flex min-h-screen items-center justify-center',
            children: (0, b.jsx)('div', {
              className: 'w-full max-w-md space-y-8 p-8 text-center',
              children: (0, b.jsxs)('div', {
                className: 'space-y-4',
                children: [
                  (0, b.jsx)('div', {
                    className:
                      'mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100',
                    children: (0, b.jsx)(n.CheckCircleIcon, {
                      className: 'h-8 w-8 text-green-600',
                    }),
                  }),
                  (0, b.jsx)('h2', {
                    className: 'text-foreground text-2xl font-bold',
                    children: '인증 완료!',
                  }),
                  (0, b.jsx)('p', {
                    className: 'text-muted-foreground',
                    children: '전화번호가 성공적으로 인증되었습니다.',
                  }),
                ],
              }),
            }),
          })
        : (0, b.jsx)('div', {
            className: 'bg-muted/50 flex min-h-screen items-center justify-center',
            children: (0, b.jsxs)('div', {
              className: 'w-full max-w-md space-y-8 p-8',
              children: [
                (0, b.jsxs)('div', {
                  className: 'space-y-4 text-center',
                  children: [
                    (0, b.jsx)('div', {
                      className:
                        'bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full',
                      children: (0, b.jsx)(p.PhoneIcon, { className: 'text-primary h-8 w-8' }),
                    }),
                    (0, b.jsx)('h2', {
                      className: 'text-foreground text-3xl font-bold',
                      children: '전화번호 인증',
                    }),
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground text-sm',
                          children: '다음 번호로 전송된 6자리 인증 코드를 입력하세요',
                        }),
                        (0, b.jsx)('p', { className: 'text-foreground font-medium', children: x }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsx)(l.Form, {
                  ...A,
                  children: (0, b.jsxs)('form', {
                    className: 'space-y-6',
                    onSubmit: A.handleSubmit((a) => {
                      ;(r(''), B.mutate(a))
                    }),
                    children: [
                      (0, b.jsx)(l.FormField, {
                        control: A.control,
                        name: 'code',
                        render: ({ field: a }) =>
                          (0, b.jsxs)(l.FormItem, {
                            className: 'flex flex-col items-center space-y-4',
                            children: [
                              (0, b.jsx)(l.FormLabel, { children: '인증 코드' }),
                              (0, b.jsx)(l.FormControl, {
                                children: (0, b.jsx)(k.InputOTP, {
                                  maxLength: 6,
                                  value: a.value,
                                  onChange: a.onChange,
                                  disabled: B.isPending,
                                  children: (0, b.jsxs)(k.InputOTPGroup, {
                                    children: [
                                      (0, b.jsx)(k.InputOTPSlot, { index: 0 }),
                                      (0, b.jsx)(k.InputOTPSlot, { index: 1 }),
                                      (0, b.jsx)(k.InputOTPSlot, { index: 2 }),
                                      (0, b.jsx)(k.InputOTPSlot, { index: 3 }),
                                      (0, b.jsx)(k.InputOTPSlot, { index: 4 }),
                                      (0, b.jsx)(k.InputOTPSlot, { index: 5 }),
                                    ],
                                  }),
                                }),
                              }),
                              (0, b.jsx)(l.FormDescription, {
                                children: 'SMS로 전송된 6자리 숫자를 입력하세요',
                              }),
                              (0, b.jsx)(l.FormMessage, {}),
                            ],
                          }),
                      }),
                      a &&
                        (0, b.jsx)('div', {
                          className:
                            'bg-destructive/10 border-destructive/20 rounded-lg border p-3',
                          children: (0, b.jsxs)('div', {
                            className: 'flex items-center space-x-2',
                            children: [
                              (0, b.jsx)(o.AlertCircleIcon, {
                                className: 'text-destructive h-4 w-4',
                              }),
                              (0, b.jsx)('p', {
                                className: 'text-destructive text-sm',
                                children: a,
                              }),
                            ],
                          }),
                        }),
                      (0, b.jsxs)('div', {
                        className: 'space-y-4',
                        children: [
                          (0, b.jsxs)(i.Button, {
                            type: 'submit',
                            className: 'w-full',
                            disabled: B.isPending || 6 !== A.watch('code').length,
                            children: [
                              B.isPending
                                ? (0, b.jsx)(j.LoadingSpinner, { size: 'sm', className: 'mr-2' })
                                : null,
                              '인증 확인',
                            ],
                          }),
                          (0, b.jsxs)('div', {
                            className: 'space-y-2 text-center',
                            children: [
                              (0, b.jsx)('p', {
                                className: 'text-muted-foreground text-sm',
                                children: '인증 코드를 받지 못하셨나요?',
                              }),
                              (0, b.jsxs)(i.Button, {
                                type: 'button',
                                variant: 'outline',
                                onClick: () => {
                                  ;(r(''), C.mutate())
                                },
                                disabled: C.isPending || s > 0,
                                className: 'w-full',
                                children: [
                                  C.isPending
                                    ? (0, b.jsx)(j.LoadingSpinner, {
                                        size: 'sm',
                                        className: 'mr-2',
                                      })
                                    : s > 0
                                      ? (0, b.jsx)(q.ClockIcon, { className: 'mr-2 h-4 w-4' })
                                      : null,
                                  s > 0 ? `다시 전송 (${s}초)` : '인증 코드 다시 전송',
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, b.jsx)('div', {
                        className: 'text-center',
                        children: (0, b.jsxs)('p', {
                          className: 'text-muted-foreground text-sm',
                          children: [
                            '전화번호를 변경하시겠어요?',
                            ' ',
                            (0, b.jsx)('button', {
                              type: 'button',
                              onClick: () => u.back(),
                              className: 'text-primary hover:underline',
                              children: '이전으로',
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          })
    }
    a.s(['default', () => r])
  },
]

//# sourceMappingURL=_01b12ea2._.js.map
