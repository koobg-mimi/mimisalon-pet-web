module.exports = [
  320862,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(50944),
      e = a.i(400210),
      f = a.i(431067),
      g = a.i(943108),
      h = a.i(920140),
      i = a.i(808406),
      j = a.i(717371),
      k = a.i(699570),
      l = a.i(591119),
      m = a.i(695245),
      n = a.i(159501),
      o = a.i(292e3),
      p = a.i(479676),
      q = a.i(371934),
      r = a.i(992258),
      s = a.i(124348),
      t = a.i(866718),
      u = a.i(315055),
      v = a.i(205138),
      w = a.i(441921),
      x = a.i(809551),
      y = a.i(529139),
      z = a.i(810004),
      A = a.i(29173)
    function B({ callbackUrl: a, onSuccess: e, onForgotPassword: f, showTestAccounts: h = !1 }) {
      let [i, j] = c.useState(!1),
        {
          signIn: l,
          isLoading: B,
          error: C,
          clearError: D,
        } = (function (a = {}) {
          let { callbackUrl: b = '/', onSuccess: e, onError: f } = a,
            [g, h] = (0, c.useState)(!1),
            [i, j] = (0, c.useState)(''),
            k = (0, d.useRouter)(),
            { sendUserLogin: l, isWebView: m } = (0, z.useWebViewBridge)()
          return {
            signIn: async (a) => {
              ;(h(!0), j(''))
              try {
                let { data: c, error: d } = await y.authClient.signIn.email({
                  email: a.email,
                  password: a.password,
                  callbackURL: b || '/dashboard',
                })
                if (d) {
                  let a = '이메일 또는 비밀번호가 잘못되었습니다.'
                  ;(j(a), f?.(a))
                  return
                }
                if (c) {
                  ;(a.rememberMe
                    ? localStorage.setItem('rememberEmail', a.email)
                    : localStorage.removeItem('rememberEmail'),
                    await new Promise((a) => setTimeout(a, 100)))
                  let { data: c } = await y.authClient.getSession()
                  if (c?.user) {
                    if (
                      (console.log('🔄 Login successful, sending user data to React Native'), m)
                    ) {
                      let a = {
                        userId: c.user.id,
                        email: c.user.email || '',
                        name: c.user.name || '',
                        phoneNumber: c.user.phoneNumber || '',
                        role: c.user.role ?? A.UserRole.CUSTOMER,
                      }
                      l(a)
                    }
                    let a = (function (a, b = '/') {
                      if (!a) return b
                      switch (a) {
                        case 'ADMIN':
                          return '/admin/dashboard/overview'
                        case 'GROOMER':
                          return '/groomer/dashboard/overview'
                        case 'CUSTOMER':
                          return '/customer/dashboard/overview'
                        default:
                          return b
                      }
                    })(c.user.role, b)
                    ;(k.push(a), e?.())
                  } else (k.push(b), e?.())
                }
              } catch (b) {
                let a = '로그인 중 오류가 발생했습니다.'
                ;(j(a), f?.(a), console.error('Sign-in error:', b))
              } finally {
                h(!1)
              }
            },
            isLoading: g,
            error: i,
            clearError: () => j(''),
          }
        })({ callbackUrl: a, onSuccess: e }),
        E = (0, m.useForm)({
          resolver: (0, n.zodResolver)(x.signInSchema),
          defaultValues: { email: '', password: '', rememberMe: !1 },
        })
      ;((0, c.useEffect)(() => {
        let a = localStorage.getItem('rememberEmail')
        a && (E.setValue('email', a), E.setValue('rememberMe', !0))
      }, [E]),
        (0, c.useEffect)(() => {
          C && D()
        }, [E.watch('email'), E.watch('password')]))
      let F = async (a) => {
        await l(a)
      }
      return (0, b.jsx)(w.Form, {
        ...E,
        children: (0, b.jsxs)('form', {
          onSubmit: E.handleSubmit(F),
          className: 'space-y-4',
          children: [
            (0, b.jsx)(w.FormField, {
              control: E.control,
              name: 'email',
              render: ({ field: a }) =>
                (0, b.jsxs)(w.FormItem, {
                  children: [
                    (0, b.jsx)(w.FormLabel, { children: '이메일' }),
                    (0, b.jsx)(w.FormControl, {
                      children: (0, b.jsxs)('div', {
                        className: 'relative',
                        children: [
                          (0, b.jsx)(r.Mail, {
                            className:
                              'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                          }),
                          (0, b.jsx)(t.Input, {
                            type: 'email',
                            placeholder: 'example@email.com',
                            className: 'pl-10 sm:pl-9',
                            disabled: B,
                            ...a,
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsx)(w.FormMessage, {}),
                  ],
                }),
            }),
            (0, b.jsx)(w.FormField, {
              control: E.control,
              name: 'password',
              render: ({ field: a }) =>
                (0, b.jsxs)(w.FormItem, {
                  children: [
                    (0, b.jsx)(w.FormLabel, { children: '비밀번호' }),
                    (0, b.jsx)(w.FormControl, {
                      children: (0, b.jsxs)('div', {
                        className: 'relative',
                        children: [
                          (0, b.jsx)(g.Lock, {
                            className:
                              'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                          }),
                          (0, b.jsx)(t.Input, {
                            type: i ? 'text' : 'password',
                            placeholder: '비밀번호를 입력하세요',
                            className: 'pr-10 pl-10 sm:pr-9 sm:pl-9',
                            disabled: B,
                            ...a,
                          }),
                          (0, b.jsx)('button', {
                            type: 'button',
                            className: 'absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5',
                            onClick: () => j(!i),
                            'aria-label': i ? 'Hide password' : 'Show password',
                            children: i
                              ? (0, b.jsx)(q.EyeOffIcon, {
                                  className: 'text-muted-foreground h-4 w-4',
                                })
                              : (0, b.jsx)(p.EyeIcon, {
                                  className: 'text-muted-foreground h-4 w-4',
                                }),
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsx)(w.FormMessage, {}),
                  ],
                }),
            }),
            (0, b.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                (0, b.jsx)(w.FormField, {
                  control: E.control,
                  name: 'rememberMe',
                  render: ({ field: a }) =>
                    (0, b.jsxs)(w.FormItem, {
                      className: 'flex flex-row items-start space-y-0 space-x-3',
                      children: [
                        (0, b.jsx)(w.FormControl, {
                          children: (0, b.jsx)(u.Checkbox, {
                            checked: a.value,
                            onCheckedChange: a.onChange,
                          }),
                        }),
                        (0, b.jsx)('div', {
                          className: 'space-y-1 leading-none',
                          children: (0, b.jsx)(w.FormLabel, {
                            className: 'text-sm font-normal',
                            children: '로그인 상태 유지',
                          }),
                        }),
                      ],
                    }),
                }),
                (0, b.jsx)('button', {
                  type: 'button',
                  onClick: f,
                  className: 'text-primary text-sm hover:underline',
                  children: '비밀번호 찾기',
                }),
              ],
            }),
            C &&
              (0, b.jsxs)(s.Alert, {
                variant: 'destructive',
                children: [
                  (0, b.jsx)(o.AlertCircle, { className: 'h-4 w-4' }),
                  (0, b.jsx)(s.AlertDescription, { children: C }),
                ],
              }),
            (0, b.jsxs)(k.Button, {
              type: 'submit',
              className: 'w-full',
              disabled: B,
              children: [
                B && (0, b.jsx)(v.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                '로그인',
              ],
            }),
            h &&
              (0, b.jsxs)('div', {
                className: 'bg-muted rounded-lg p-3',
                children: [
                  (0, b.jsx)('p', {
                    className: 'mb-3 text-sm font-medium',
                    children: '테스트 계정 로그인:',
                  }),
                  (0, b.jsxs)('div', {
                    className: 'grid grid-cols-3 gap-2',
                    children: [
                      (0, b.jsx)(k.Button, {
                        type: 'button',
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => {
                          ;(E.setValue('email', 'customer@petmanagement.com'),
                            E.setValue('password', 'defaultpass123'))
                        },
                        disabled: B,
                        children: '고객',
                      }),
                      (0, b.jsx)(k.Button, {
                        type: 'button',
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => {
                          ;(E.setValue('email', 'groomer@petmanagement.com'),
                            E.setValue('password', 'defaultpass123'))
                        },
                        disabled: B,
                        children: '미용사',
                      }),
                      (0, b.jsx)(k.Button, {
                        type: 'button',
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => {
                          ;(E.setValue('email', 'admin@petmanagement.com'),
                            E.setValue('password', 'defaultpass123'))
                        },
                        disabled: B,
                        children: '관리자',
                      }),
                    ],
                  }),
                ],
              }),
          ],
        }),
      })
    }
    B.displayName = 'SignInForm'
    var C = a.i(816201),
      D = a.i(797063),
      E = a.i(546842),
      F = a.i(565350),
      G = a.i(572727),
      H = a.i(823292)
    function I({ password: a, strength: c, className: d }) {
      return a
        ? (0, b.jsx)('div', {
            className: d,
            children: (0, b.jsxs)('div', {
              className: 'space-y-2',
              children: [
                (0, b.jsxs)('div', {
                  className: 'flex items-center space-x-2',
                  children: [
                    (0, b.jsx)('div', {
                      className: 'h-2 flex-1 rounded-full bg-gray-200',
                      children: (0, b.jsx)('div', {
                        className: `h-2 rounded-full transition-all ${c <= 1 ? 'bg-red-500' : 2 === c ? 'bg-orange-500' : 3 === c ? 'bg-yellow-500' : c >= 4 ? 'bg-green-500' : 'bg-gray-300'}`,
                        style: { width: `${(c / 5) * 100}%` },
                      }),
                    }),
                    (0, b.jsx)('span', {
                      className: `text-xs ${(function (a) {
                        switch (a) {
                          case 0:
                          case 1:
                            return 'text-red-500'
                          case 2:
                            return 'text-orange-500'
                          case 3:
                            return 'text-yellow-500'
                          case 4:
                            return 'text-green-500'
                          case 5:
                            return 'text-green-600'
                          default:
                            return 'text-muted-foreground'
                        }
                      })(c)}`,
                      children: (function (a) {
                        switch (a) {
                          case 0:
                          case 1:
                            return '매우 약함'
                          case 2:
                            return '약함'
                          case 3:
                            return '보통'
                          case 4:
                            return '강함'
                          case 5:
                            return '매우 강함'
                          default:
                            return ''
                        }
                      })(c),
                    }),
                  ],
                }),
                (0, b.jsx)(w.FormDescription, {
                  children: '대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상',
                }),
              ],
            }),
          })
        : null
    }
    function J({ onSuccess: a, showDebug: d = !1 }) {
      let [e, f] = (0, c.useState)(!1),
        [h, i] = (0, c.useState)(!1),
        [j, l] = (0, c.useState)(''),
        [z, A] = (0, c.useState)(0),
        {
          signUp: B,
          isLoading: J,
          error: K,
          success: L,
        } = (function (a = {}) {
          let { onSuccess: b, onError: d } = a,
            [e, f] = (0, c.useState)(!1),
            [g, h] = (0, c.useState)(''),
            [i, j] = (0, c.useState)('')
          return {
            signUp: async (a, c, e) => {
              if ((f(!0), h(''), j(''), !c)) {
                let a = '휴대폰 인증을 완료해주세요.'
                ;(h(a), d?.(a), f(!1))
                return
              }
              if (!e) {
                let a = '이메일 인증을 완료해주세요.'
                ;(h(a), d?.(a), f(!1))
                return
              }
              try {
                let e = await fetch('/api/auth/signup', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...a, role: 'CUSTOMER', phoneVerified: c }),
                })
                if (e.ok) (j('회원가입이 완료되었습니다!'), b?.(a.email))
                else {
                  let a = await e.json(),
                    b = '회원가입 중 오류가 발생했습니다.'
                  ;('EMAIL_ALREADY_EXISTS' === a.code
                    ? (b = '이미 가입된 이메일입니다.')
                    : a.message && (b = a.message),
                    h(b),
                    d?.(b))
                }
              } catch (b) {
                let a = '회원가입 중 오류가 발생했습니다.'
                ;(h(a), d?.(a), console.error('Sign-up error:', b))
              } finally {
                f(!1)
              }
            },
            isLoading: e,
            error: g,
            success: i,
            clearMessages: () => {
              ;(h(''), j(''))
            },
          }
        })({ onSuccess: a }),
        {
          phoneVerified: M,
          verificationCode: N,
          verificationError: O,
          showVerificationInput: P,
          cooldownTime: Q,
          sendingCode: R,
          verifyingCode: S,
          setVerificationCode: T,
          sendPhoneCode: U,
          verifyPhoneCode: V,
          resetVerification: W,
        } = (function () {
          let [a, b] = (0, c.useState)(!1),
            [d, e] = (0, c.useState)(''),
            [f, g] = (0, c.useState)(''),
            [h, i] = (0, c.useState)(!1),
            [j, k] = (0, c.useState)(0),
            [l, m] = (0, c.useState)(!1),
            [n, o] = (0, c.useState)(!1)
          ;(0, c.useEffect)(() => {
            if (j > 0) {
              let a = setTimeout(() => k((a) => a - 1), 1e3)
              return () => clearTimeout(a)
            }
          }, [j])
          let p = async (a) => {
            if ((g(''), !d || 6 !== d.length))
              return void g('올바른 6자리 인증번호를 입력해주세요.')
            try {
              o(!0)
              let c = await fetch('/api/auth/verify-phone-otp', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ phoneNumber: a, code: d }),
                }),
                e = await c.json()
              c.ok
                ? (b(!0), i(!1), g(''), H.toast.success('휴대폰 인증이 완료되었습니다'))
                : (console.error('Phone OTP verify error:', e),
                  g(e.error || '인증 중 오류가 발생했습니다.'))
            } catch (a) {
              ;(console.error('Unexpected error verifying phone OTP:', a),
                g('인증 중 오류가 발생했습니다.'))
            } finally {
              o(!1)
            }
          }
          return {
            phoneVerified: a,
            verificationCode: d,
            verificationError: f,
            showVerificationInput: h,
            cooldownTime: j,
            sendingCode: l,
            verifyingCode: n,
            setVerificationCode: e,
            sendPhoneCode: async (a) => {
              if ((g(''), !a || !a.startsWith('+82')))
                return void g('올바른 한국 휴대폰 번호를 입력해주세요.')
              try {
                m(!0)
                let { error: b } = await y.authClient.phoneNumber.sendOtp({ phoneNumber: a })
                b
                  ? (console.error('Phone OTP send error:', b),
                    g(b.message || '인증번호 발송 중 오류가 발생했습니다.'))
                  : (i(!0), k(60))
              } catch (a) {
                ;(console.error('Unexpected error sending phone OTP:', a),
                  g('인증번호 발송 중 오류가 발생했습니다.'))
              } finally {
                m(!1)
              }
            },
            verifyPhoneCode: p,
            resetVerification: () => {
              ;(b(!1), e(''), g(''), i(!1), k(0))
            },
          }
        })(),
        {
          emailVerified: X,
          showEmailOTPDialog: Y,
          sendingEmailCode: Z,
          setShowEmailOTPDialog: $,
          sendEmailVerificationCode: _,
          handleEmailVerificationSuccess: aa,
          resetEmailVerification: ab,
        } = (function () {
          let [a, b] = (0, c.useState)(!1),
            [d, e] = (0, c.useState)(!1),
            [f, g] = (0, c.useState)(!1),
            h = async (a) => {
              if (!a) return void H.toast.error('이메일 주소를 입력해주세요')
              g(!0)
              try {
                ;(await y.authClient.emailOtp.sendVerificationOtp({
                  email: a,
                  type: 'email-verification',
                }),
                  H.toast.success('이메일로 인증코드가 전송되었습니다'),
                  e(!0))
              } catch (a) {
                ;(console.error('Email verification error:', a),
                  H.toast.error('인증코드 전송 중 오류가 발생했습니다'))
              } finally {
                g(!1)
              }
            }
          return {
            emailVerified: a,
            showEmailOTPDialog: d,
            sendingEmailCode: f,
            setShowEmailOTPDialog: e,
            sendEmailVerificationCode: h,
            handleEmailVerificationSuccess: () => {
              ;(b(!0), e(!1), H.toast.success('이메일 인증이 완료되었습니다'))
            },
            resetEmailVerification: () => {
              ;(b(!1), e(!1))
            },
          }
        })(),
        ac = (0, m.useForm)({
          resolver: (0, n.zodResolver)(x.signUpSchema),
          defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: !1,
            agreeToPrivacy: !1,
            agreeToMarketing: !1,
          },
          mode: 'onBlur',
        }),
        ad = async (a) => {
          ;(await B(a, M, X), L && (ac.reset(), l(''), A(0), W(), ab()))
        }
      return (0, b.jsx)(w.Form, {
        ...ac,
        children: (0, b.jsxs)('form', {
          onSubmit: ac.handleSubmit(ad),
          className: 'space-y-4',
          children: [
            d &&
              (0, b.jsxs)('div', {
                className: 'rounded border border-yellow-200 bg-yellow-50 p-2 text-xs',
                children: [
                  (0, b.jsx)('p', { children: 'Customer Form State Debug:' }),
                  (0, b.jsxs)('p', {
                    children: ['Name value: ', JSON.stringify(ac.watch('name'))],
                  }),
                  (0, b.jsxs)('p', {
                    children: ['Email value: ', JSON.stringify(ac.watch('email'))],
                  }),
                  (0, b.jsxs)('p', {
                    children: ['Phone value: ', JSON.stringify(ac.watch('phone'))],
                  }),
                  (0, b.jsxs)('p', { children: ['Phone Verified: ', M ? 'Yes' : 'No'] }),
                  (0, b.jsxs)('p', {
                    children: ['Form errors: ', JSON.stringify(ac.formState.errors.name?.message)],
                  }),
                ],
              }),
            (0, b.jsx)(w.FormField, {
              control: ac.control,
              name: 'name',
              render: ({ field: a }) =>
                (0, b.jsxs)(w.FormItem, {
                  children: [
                    (0, b.jsx)(w.FormLabel, { children: '이름' }),
                    (0, b.jsxs)('div', {
                      className: 'relative',
                      children: [
                        (0, b.jsx)(E.User, {
                          className:
                            'text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform',
                        }),
                        (0, b.jsx)(w.FormControl, {
                          children: (0, b.jsx)(t.Input, {
                            type: 'text',
                            placeholder: '이름을 입력하세요',
                            className: 'pl-10 sm:pl-9',
                            disabled: J,
                            autoComplete: 'name',
                            value: j,
                            onChange: (b) => {
                              let c = b.target.value
                              ;(l(c), a.onChange(c), ac.setValue('name', c))
                            },
                            onBlur: a.onBlur,
                            name: a.name,
                            ref: a.ref,
                          }),
                        }),
                      ],
                    }),
                    (0, b.jsx)(w.FormMessage, {}),
                  ],
                }),
            }),
            (0, b.jsx)(w.FormField, {
              control: ac.control,
              name: 'email',
              render: ({ field: a }) =>
                (0, b.jsxs)(w.FormItem, {
                  children: [
                    (0, b.jsx)(w.FormLabel, { children: '이메일' }),
                    (0, b.jsx)(w.FormControl, {
                      children: (0, b.jsxs)('div', {
                        className: 'relative',
                        children: [
                          (0, b.jsx)(r.Mail, {
                            className:
                              'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                          }),
                          (0, b.jsx)(t.Input, {
                            type: 'email',
                            placeholder: 'example@email.com',
                            className: 'pl-10 sm:pl-9',
                            disabled: J,
                            ...a,
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsx)(w.FormMessage, {}),
                  ],
                }),
            }),
            (0, b.jsx)(w.FormField, {
              control: ac.control,
              name: 'phone',
              render: ({ field: a }) =>
                (0, b.jsxs)(w.FormItem, {
                  children: [
                    (0, b.jsx)(w.FormLabel, { children: '전화번호' }),
                    (0, b.jsx)(w.FormControl, {
                      children: (0, b.jsxs)('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          (0, b.jsx)(F.PhoneInput, {
                            placeholder: '010-0000-0000',
                            defaultCountry: 'KR',
                            disabled: J || M,
                            className: 'flex-1',
                            ...a,
                          }),
                          !M &&
                            (0, b.jsx)(k.Button, {
                              type: 'button',
                              variant: Q > 0 ? 'secondary' : 'outline',
                              onClick: () => U(a.value),
                              disabled: R || Q > 0,
                              className: 'whitespace-nowrap',
                              children:
                                Q > 0 ? `재전송 (${Q}s)` : R ? '전송 중...' : '인증번호 발송',
                            }),
                        ],
                      }),
                    }),
                    !M &&
                      P &&
                      (0, b.jsxs)('div', {
                        className: 'mt-2 flex items-center gap-2',
                        children: [
                          (0, b.jsx)(t.Input, {
                            placeholder: '인증번호 6자리',
                            value: N,
                            onChange: (a) => T(a.target.value),
                            className: 'w-32',
                            maxLength: 6,
                          }),
                          (0, b.jsx)(k.Button, {
                            type: 'button',
                            onClick: () => V(a.value),
                            disabled: S,
                            children: S ? '확인 중...' : '확인',
                          }),
                        ],
                      }),
                    O &&
                      (0, b.jsx)('p', { className: 'text-destructive mt-1 text-sm', children: O }),
                    M &&
                      (0, b.jsx)('p', {
                        className: 'mt-1 text-sm text-green-600',
                        children: '휴대폰 인증이 완료되었습니다.',
                      }),
                    (0, b.jsx)(w.FormMessage, {}),
                  ],
                }),
            }),
            M &&
              !X &&
              (0, b.jsxs)('div', {
                className: 'border-border bg-muted/50 space-y-4 rounded-lg border p-4',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      (0, b.jsx)('div', {
                        className:
                          'bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                        children: '2',
                      }),
                      (0, b.jsx)('h4', { className: 'font-semibold', children: '이메일 인증' }),
                    ],
                  }),
                  (0, b.jsxs)('div', {
                    className: 'text-muted-foreground text-sm',
                    children: [
                      (0, b.jsx)(r.Mail, { className: 'mr-2 inline h-4 w-4' }),
                      (0, b.jsx)('strong', { children: ac.watch('email') }),
                      '로 인증코드가 전송됩니다',
                    ],
                  }),
                  (0, b.jsx)(k.Button, {
                    type: 'button',
                    onClick: () => _(ac.watch('email')),
                    disabled: Z,
                    className: 'w-full',
                    children: Z
                      ? (0, b.jsxs)(b.Fragment, {
                          children: [
                            (0, b.jsx)(v.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                            '전송 중...',
                          ],
                        })
                      : '이메일로 인증코드 전송',
                  }),
                ],
              }),
            X &&
              (0, b.jsxs)(s.Alert, {
                className: 'border-green-200 bg-green-50',
                children: [
                  (0, b.jsx)(C.CheckCircle, { className: 'h-4 w-4 text-green-600' }),
                  (0, b.jsx)(s.AlertDescription, {
                    className: 'text-green-700',
                    children: '이메일 인증이 완료되었습니다',
                  }),
                ],
              }),
            (0, b.jsx)(G.OTPInputDialog, {
              open: Y,
              onOpenChange: $,
              identifier: ac.watch('email'),
              method: 'email',
              type: 'email-verification',
              onSuccess: aa,
            }),
            (0, b.jsx)(w.FormField, {
              control: ac.control,
              name: 'password',
              render: ({ field: a }) =>
                (0, b.jsxs)(w.FormItem, {
                  children: [
                    (0, b.jsx)(w.FormLabel, { children: '비밀번호' }),
                    (0, b.jsx)(w.FormControl, {
                      children: (0, b.jsxs)('div', {
                        className: 'relative',
                        children: [
                          (0, b.jsx)(g.Lock, {
                            className:
                              'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                          }),
                          (0, b.jsx)(t.Input, {
                            type: e ? 'text' : 'password',
                            placeholder: '최소 8자 이상',
                            className: 'pr-10 pl-10 sm:pr-9 sm:pl-9',
                            disabled: J,
                            ...a,
                            onChange: (b) => {
                              var c
                              let d
                              ;(a.onChange(b),
                                A(
                                  ((c = b.target.value),
                                  (d = 0),
                                  c.length >= 8 && d++,
                                  /[a-z]/.test(c) && d++,
                                  /[A-Z]/.test(c) && d++,
                                  /\d/.test(c) && d++,
                                  /[^\w\s]/.test(c) && d++,
                                  d)
                                ))
                            },
                          }),
                          (0, b.jsx)('button', {
                            type: 'button',
                            className: 'absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5',
                            onClick: () => f(!e),
                            'aria-label': e ? 'Hide password' : 'Show password',
                            children: e
                              ? (0, b.jsx)(q.EyeOffIcon, {
                                  className: 'text-muted-foreground h-4 w-4',
                                })
                              : (0, b.jsx)(p.EyeIcon, {
                                  className: 'text-muted-foreground h-4 w-4',
                                }),
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsx)(I, { password: a.value, strength: z }),
                    (0, b.jsx)(w.FormMessage, {}),
                  ],
                }),
            }),
            (0, b.jsx)(w.FormField, {
              control: ac.control,
              name: 'confirmPassword',
              render: ({ field: a }) =>
                (0, b.jsxs)(w.FormItem, {
                  children: [
                    (0, b.jsx)(w.FormLabel, { children: '비밀번호 확인' }),
                    (0, b.jsx)(w.FormControl, {
                      children: (0, b.jsxs)('div', {
                        className: 'relative',
                        children: [
                          (0, b.jsx)(g.Lock, {
                            className:
                              'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                          }),
                          (0, b.jsx)(t.Input, {
                            type: h ? 'text' : 'password',
                            placeholder: '비밀번호를 다시 입력하세요',
                            className: 'pr-10 pl-10 sm:pr-9 sm:pl-9',
                            disabled: J,
                            ...a,
                          }),
                          (0, b.jsx)('button', {
                            type: 'button',
                            className: 'absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5',
                            onClick: () => i(!h),
                            'aria-label': h ? 'Hide password' : 'Show password',
                            children: h
                              ? (0, b.jsx)(q.EyeOffIcon, {
                                  className: 'text-muted-foreground h-4 w-4',
                                })
                              : (0, b.jsx)(p.EyeIcon, {
                                  className: 'text-muted-foreground h-4 w-4',
                                }),
                          }),
                        ],
                      }),
                    }),
                    (0, b.jsx)(w.FormMessage, {}),
                  ],
                }),
            }),
            (0, b.jsx)('div', {
              className: 'border-border space-y-4 border-t pt-4',
              children: (0, b.jsxs)('div', {
                className: 'space-y-3',
                children: [
                  (0, b.jsx)(w.FormField, {
                    control: ac.control,
                    name: 'agreeToTerms',
                    render: ({ field: a }) =>
                      (0, b.jsxs)(w.FormItem, {
                        className: 'flex flex-row items-start space-y-0 space-x-3',
                        children: [
                          (0, b.jsx)(w.FormControl, {
                            children: (0, b.jsx)(u.Checkbox, {
                              checked: a.value,
                              onCheckedChange: a.onChange,
                            }),
                          }),
                          (0, b.jsx)('div', {
                            className: 'space-y-1 leading-none',
                            children: (0, b.jsxs)(w.FormLabel, {
                              className: 'text-sm font-normal',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-destructive',
                                  children: '*',
                                }),
                                ' ',
                                (0, b.jsx)('a', {
                                  href: '/terms',
                                  target: '_blank',
                                  className: 'text-primary hover:underline',
                                  children: '서비스 이용약관',
                                }),
                                '에 동의합니다',
                              ],
                            }),
                          }),
                        ],
                      }),
                  }),
                  (0, b.jsx)(w.FormField, {
                    control: ac.control,
                    name: 'agreeToPrivacy',
                    render: ({ field: a }) =>
                      (0, b.jsxs)(w.FormItem, {
                        className: 'flex flex-row items-start space-y-0 space-x-3',
                        children: [
                          (0, b.jsx)(w.FormControl, {
                            children: (0, b.jsx)(u.Checkbox, {
                              checked: a.value,
                              onCheckedChange: a.onChange,
                            }),
                          }),
                          (0, b.jsx)('div', {
                            className: 'space-y-1 leading-none',
                            children: (0, b.jsxs)(w.FormLabel, {
                              className: 'text-sm font-normal',
                              children: [
                                (0, b.jsx)('span', {
                                  className: 'text-destructive',
                                  children: '*',
                                }),
                                ' ',
                                (0, b.jsx)('a', {
                                  href: '/privacy',
                                  target: '_blank',
                                  className: 'text-primary hover:underline',
                                  children: '개인정보 처리방침',
                                }),
                                '에 동의합니다',
                              ],
                            }),
                          }),
                        ],
                      }),
                  }),
                  (0, b.jsx)(w.FormField, {
                    control: ac.control,
                    name: 'agreeToMarketing',
                    render: ({ field: a }) =>
                      (0, b.jsxs)(w.FormItem, {
                        className: 'flex flex-row items-start space-y-0 space-x-3',
                        children: [
                          (0, b.jsx)(w.FormControl, {
                            children: (0, b.jsx)(u.Checkbox, {
                              checked: a.value,
                              onCheckedChange: a.onChange,
                            }),
                          }),
                          (0, b.jsxs)('div', {
                            className: 'space-y-1 leading-none',
                            children: [
                              (0, b.jsx)(w.FormLabel, {
                                className: 'text-sm font-normal',
                                children: '마케팅 정보 수신에 동의합니다 (선택)',
                              }),
                              (0, b.jsx)(w.FormDescription, {
                                children:
                                  '할인 쿠폰, 이벤트 정보 등을 이메일과 SMS로 받을 수 있습니다.',
                              }),
                            ],
                          }),
                        ],
                      }),
                  }),
                ],
              }),
            }),
            K &&
              (0, b.jsxs)(s.Alert, {
                variant: 'destructive',
                children: [
                  (0, b.jsx)(o.AlertCircle, { className: 'h-4 w-4' }),
                  (0, b.jsx)(s.AlertDescription, { children: K }),
                ],
              }),
            L &&
              (0, b.jsxs)(s.Alert, {
                className: 'border-green-200 bg-green-50',
                children: [
                  (0, b.jsx)(D.Info, { className: 'h-4 w-4 text-green-600' }),
                  (0, b.jsx)(s.AlertDescription, { className: 'text-green-700', children: L }),
                ],
              }),
            (0, b.jsxs)(k.Button, {
              type: 'submit',
              className: 'w-full',
              disabled: J || !M || !X,
              children: [
                J && (0, b.jsx)(v.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                '회원가입',
              ],
            }),
          ],
        }),
      })
    }
    function K() {
      let [a, m] = (0, c.useState)(!1),
        [n, o] = (0, c.useState)(!1),
        p = (0, d.useRouter)(),
        q = (0, d.useSearchParams)(),
        r = q.get('message'),
        s = q.get('error'),
        t = q.get('callbackUrl') || '/'
      ;(0, c.useEffect)(() => {
        o(!1)
      }, [])
      let u =
          'INACTIVE_GROOMER' === s
            ? '미용사 계정이 비활성화 상태입니다. 관리자 승인을 기다려주세요.'
            : null,
        v = () => {
          m(!a)
        }
      return (0, b.jsx)('div', {
        className: 'bg-background flex min-h-screen items-center justify-center p-4',
        children: (0, b.jsxs)('div', {
          className: 'w-full max-w-md',
          children: [
            (0, b.jsxs)('div', {
              className: 'mb-8 text-center',
              children: [
                (0, b.jsxs)('div', {
                  className: 'mb-4 flex items-center justify-center space-x-2',
                  children: [
                    (0, b.jsx)(i.Sparkles, { className: 'text-primary h-8 w-8' }),
                    (0, b.jsx)(h.PawPrint, { className: 'text-primary h-8 w-8' }),
                  ],
                }),
                (0, b.jsx)('h1', {
                  className: 'text-primary text-2xl font-bold',
                  children: '미미살롱펫',
                }),
                (0, b.jsx)('p', {
                  className: 'text-muted-foreground',
                  children: '프리미엄 방문 반려동물 미용',
                }),
              ],
            }),
            r &&
              (0, b.jsx)('div', {
                className: 'mb-6 rounded-lg border border-green-200 bg-green-50 p-4',
                children: (0, b.jsx)('p', { className: 'text-sm text-green-800', children: r }),
              }),
            u &&
              (0, b.jsx)('div', {
                className: 'mb-6 rounded-lg border border-red-200 bg-red-50 p-4',
                children: (0, b.jsx)('p', { className: 'text-sm text-red-800', children: u }),
              }),
            (0, b.jsxs)(l.Card, {
              children: [
                (0, b.jsx)(l.CardHeader, {
                  className: 'text-center',
                  children: (0, b.jsx)(l.CardTitle, { children: a ? '회원가입' : '로그인' }),
                }),
                (0, b.jsx)(l.CardContent, {
                  children: (0, b.jsxs)('div', {
                    className: 'space-y-4',
                    children: [
                      a
                        ? (0, b.jsx)(J, { showDebug: n })
                        : (0, b.jsx)(B, {
                            callbackUrl: t,
                            onForgotPassword: () => p.push('/auth/forgot-password'),
                            showTestAccounts: n,
                          }),
                      (0, b.jsx)('div', {
                        className: 'text-center',
                        children: a
                          ? (0, b.jsxs)(k.Button, {
                              variant: 'outline',
                              onClick: v,
                              className: 'w-full',
                              children: [
                                (0, b.jsx)(f.LogIn, { className: 'mr-2 h-4 w-4' }),
                                '이미 계정이 있으신가요? 로그인하기',
                              ],
                            })
                          : (0, b.jsxs)('div', {
                              className: 'flex flex-col space-y-2',
                              children: [
                                (0, b.jsxs)(k.Button, {
                                  variant: 'outline',
                                  onClick: () => p.push('/auth/forgot-password'),
                                  className: 'w-full',
                                  children: [
                                    (0, b.jsx)(g.Lock, { className: 'mr-2 h-4 w-4' }),
                                    '비밀번호를 잊으셨나요?',
                                  ],
                                }),
                                (0, b.jsxs)(k.Button, {
                                  variant: 'outline',
                                  onClick: v,
                                  className: 'w-full',
                                  children: [
                                    (0, b.jsx)(j.UserPlus, { className: 'mr-2 h-4 w-4' }),
                                    '처음이신가요? 회원가입하기',
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
            (0, b.jsx)('div', {
              className: 'mt-6 text-center',
              children: (0, b.jsxs)(k.Button, {
                variant: 'ghost',
                onClick: () => p.push('/'),
                className: 'text-muted-foreground hover:text-foreground',
                children: [
                  (0, b.jsx)(e.ArrowLeft, { className: 'mr-2 h-4 w-4' }),
                  '메인으로 돌아가기',
                ],
              }),
            }),
          ],
        }),
      })
    }
    ;((I.displayName = 'PasswordStrengthIndicator'),
      (J.displayName = 'SignUpForm'),
      a.s(['default', () => K], 320862))
  },
]

//# sourceMappingURL=src_app_auth_signin_page_tsx_a887c4b0._.js.map
