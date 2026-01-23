module.exports = [
  607291,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(572131),
      d = a.i(50944),
      e = a.i(695245),
      f = a.i(159501),
      g = a.i(292e3),
      h = a.i(400210),
      i = a.i(797063),
      j = a.i(943108),
      k = a.i(992258),
      l = a.i(920140),
      m = a.i(808406),
      n = a.i(546842),
      o = a.i(479676),
      p = a.i(371934),
      q = a.i(124348),
      r = a.i(699570),
      s = a.i(591119),
      t = a.i(866718),
      u = a.i(565350),
      v = a.i(315055),
      w = a.i(205138),
      x = a.i(441921),
      y = a.i(809551)
    function z() {
      let [a, z] = (0, c.useState)(!1),
        [A, B] = (0, c.useState)(!1),
        [C, D] = (0, c.useState)(!1),
        [E, F] = (0, c.useState)(''),
        [G, H] = (0, c.useState)(''),
        [I, J] = (0, c.useState)(!1),
        [K, L] = (0, c.useState)(''),
        [M, N] = (0, c.useState)(!1),
        [O, P] = (0, c.useState)(''),
        [Q, R] = (0, c.useState)(''),
        [S, T] = (0, c.useState)(!1),
        [U, V] = (0, c.useState)(0),
        [W, X] = (0, c.useState)(!1),
        [Y, Z] = (0, c.useState)(!1),
        [$, _] = (0, c.useState)(0),
        aa = (0, d.useRouter)(),
        ab = (0, e.useForm)({
          resolver: (0, f.zodResolver)(y.signUpSchema),
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
          mode: 'onChange',
        })
      ;(0, c.useEffect)(() => {
        if (U > 0) {
          let a = setTimeout(() => V((a) => a - 1), 1e3)
          return () => clearTimeout(a)
        }
      }, [U])
      let ac = async (a) => {
          if ((z(!0), F(''), H(''), !M)) {
            ;(F('휴대폰 인증을 완료해주세요.'), z(!1))
            return
          }
          try {
            let b = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...a, role: 'GROOMER', phoneVerified: M }),
            })
            if (b.ok)
              (await b.json(),
                H('미용사 등록이 완료되었습니다! 이메일 인증을 완료해주세요.'),
                L(a.email),
                J(!0),
                ab.reset(),
                N(!1),
                P(''),
                R(''),
                T(!1),
                V(0))
            else {
              let a = await b.json()
              'EMAIL_ALREADY_EXISTS' === a.code
                ? F('이미 가입된 이메일입니다.')
                : F(a.message || a.error || '미용사 등록 중 오류가 발생했습니다.')
            }
          } catch {
            F('미용사 등록 중 오류가 발생했습니다.')
          } finally {
            z(!1)
          }
        },
        ad = async () => {
          R('')
          let a = ab.getValues('phone')
          if (!a || !a.startsWith('+82')) return void R('올바른 한국 휴대폰 번호를 입력해주세요.')
          try {
            X(!0)
            let b = await fetch('/api/auth/phone/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: a }),
              }),
              c = await b.json()
            b.ok
              ? (T(!0), V(60))
              : 'TOO_MANY_REQUESTS' === c.code
                ? R('너무 자주 요청하고 있습니다. 잠시 후 다시 시도해주세요.')
                : 'DAILY_LIMIT_EXCEEDED' === c.code
                  ? R('일일 인증 시도 횟수를 초과했습니다.')
                  : 'PHONE_ALREADY_VERIFIED' === c.code
                    ? R('이미 다른 계정에서 인증된 전화번호입니다.')
                    : R(c.message || '인증번호 발송 중 오류가 발생했습니다.')
          } catch {
            R('인증번호 발송 중 오류가 발생했습니다.')
          } finally {
            X(!1)
          }
        },
        ae = async () => {
          if ((R(''), !O || 6 !== O.length)) return void R('올바른 6자리 인증번호를 입력해주세요.')
          let a = ab.getValues('phone')
          try {
            Z(!0)
            let b = await fetch('/api/auth/phone/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: a, code: O }),
              }),
              c = await b.json()
            b.ok
              ? (N(!0), T(!1), R(''))
              : 'INVALID_CODE' === c.code
                ? R('인증번호가 올바르지 않습니다. 다시 확인해주세요.')
                : 'TOO_MANY_ATTEMPTS' === c.code
                  ? R('인증 시도 횟수를 초과했습니다. 새로운 인증번호를 요청해주세요.')
                  : R(c.message || '인증 중 오류가 발생했습니다.')
          } catch {
            R('인증 중 오류가 발생했습니다.')
          } finally {
            Z(!1)
          }
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
                    (0, b.jsx)(m.Sparkles, { className: 'text-primary h-8 w-8' }),
                    (0, b.jsx)(l.PawPrint, { className: 'text-primary h-8 w-8' }),
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
            (0, b.jsxs)(s.Card, {
              children: [
                (0, b.jsx)(s.CardHeader, {
                  className: 'text-center',
                  children: (0, b.jsx)(s.CardTitle, { children: '미용사 등록' }),
                }),
                (0, b.jsx)(s.CardContent, {
                  children: (0, b.jsx)(x.Form, {
                    ...ab,
                    children: (0, b.jsxs)('form', {
                      onSubmit: ab.handleSubmit(ac),
                      className: 'space-y-4',
                      children: [
                        (0, b.jsx)(x.FormField, {
                          control: ab.control,
                          name: 'name',
                          render: ({ field: c }) =>
                            (0, b.jsxs)(x.FormItem, {
                              children: [
                                (0, b.jsx)(x.FormLabel, { children: '이름' }),
                                (0, b.jsxs)('div', {
                                  className: 'relative',
                                  children: [
                                    (0, b.jsx)(n.User, {
                                      className:
                                        'text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform',
                                    }),
                                    (0, b.jsx)(x.FormControl, {
                                      children: (0, b.jsx)(t.Input, {
                                        ...c,
                                        type: 'text',
                                        placeholder: '이름을 입력하세요',
                                        className: 'pl-10 sm:pl-9',
                                        disabled: a,
                                        autoComplete: 'name',
                                      }),
                                    }),
                                  ],
                                }),
                                (0, b.jsx)(x.FormMessage, {}),
                              ],
                            }),
                        }),
                        (0, b.jsx)(x.FormField, {
                          control: ab.control,
                          name: 'email',
                          render: ({ field: c }) =>
                            (0, b.jsxs)(x.FormItem, {
                              children: [
                                (0, b.jsx)(x.FormLabel, { children: '이메일' }),
                                (0, b.jsx)(x.FormControl, {
                                  children: (0, b.jsxs)('div', {
                                    className: 'relative',
                                    children: [
                                      (0, b.jsx)(k.Mail, {
                                        className:
                                          'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                                      }),
                                      (0, b.jsx)(t.Input, {
                                        type: 'email',
                                        placeholder: 'example@email.com',
                                        className: 'pl-10 sm:pl-9',
                                        disabled: a,
                                        ...c,
                                      }),
                                    ],
                                  }),
                                }),
                                (0, b.jsx)(x.FormMessage, {}),
                              ],
                            }),
                        }),
                        (0, b.jsx)(x.FormField, {
                          control: ab.control,
                          name: 'phone',
                          render: ({ field: c }) =>
                            (0, b.jsxs)(x.FormItem, {
                              children: [
                                (0, b.jsx)(x.FormLabel, { children: '전화번호' }),
                                (0, b.jsx)(x.FormControl, {
                                  children: (0, b.jsxs)('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      (0, b.jsx)(u.PhoneInput, {
                                        placeholder: '010-0000-0000',
                                        defaultCountry: 'KR',
                                        disabled: a || M,
                                        className: 'flex-1',
                                        ...c,
                                      }),
                                      !M &&
                                        (0, b.jsx)(r.Button, {
                                          type: 'button',
                                          variant: U > 0 ? 'secondary' : 'outline',
                                          onClick: ad,
                                          disabled: W || U > 0,
                                          className: 'whitespace-nowrap',
                                          children:
                                            U > 0
                                              ? `재전송 (${U}s)`
                                              : W
                                                ? '전송 중...'
                                                : '인증번호 발송',
                                        }),
                                    ],
                                  }),
                                }),
                                !M &&
                                  S &&
                                  (0, b.jsxs)('div', {
                                    className: 'mt-2 flex items-center gap-2',
                                    children: [
                                      (0, b.jsx)(t.Input, {
                                        placeholder: '인증번호 6자리',
                                        value: O,
                                        onChange: (a) => P(a.target.value),
                                        className: 'w-32',
                                        maxLength: 6,
                                      }),
                                      (0, b.jsx)(r.Button, {
                                        type: 'button',
                                        onClick: ae,
                                        disabled: Y,
                                        children: Y ? '확인 중...' : '확인',
                                      }),
                                    ],
                                  }),
                                Q &&
                                  (0, b.jsx)('p', {
                                    className: 'text-destructive mt-1 text-sm',
                                    children: Q,
                                  }),
                                M &&
                                  (0, b.jsx)('p', {
                                    className: 'mt-1 text-sm text-green-600',
                                    children: '휴대폰 인증이 완료되었습니다.',
                                  }),
                                (0, b.jsx)(x.FormMessage, {}),
                              ],
                            }),
                        }),
                        (0, b.jsx)(x.FormField, {
                          control: ab.control,
                          name: 'password',
                          render: ({ field: c }) =>
                            (0, b.jsxs)(x.FormItem, {
                              children: [
                                (0, b.jsx)(x.FormLabel, { children: '비밀번호' }),
                                (0, b.jsx)(x.FormControl, {
                                  children: (0, b.jsxs)('div', {
                                    className: 'relative',
                                    children: [
                                      (0, b.jsx)(j.Lock, {
                                        className:
                                          'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                                      }),
                                      (0, b.jsx)(t.Input, {
                                        type: A ? 'text' : 'password',
                                        placeholder: '최소 8자 이상',
                                        className: 'pr-10 pl-10 sm:pr-9 sm:pl-9',
                                        disabled: a,
                                        ...c,
                                        onChange: (a) => {
                                          var b
                                          let d
                                          ;(c.onChange(a),
                                            _(
                                              ((b = a.target.value),
                                              (d = 0),
                                              b.length >= 8 && d++,
                                              /[a-z]/.test(b) && d++,
                                              /[A-Z]/.test(b) && d++,
                                              /\d/.test(b) && d++,
                                              /[^\w\s]/.test(b) && d++,
                                              d)
                                            ))
                                        },
                                      }),
                                      (0, b.jsx)('button', {
                                        type: 'button',
                                        className:
                                          'absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5',
                                        onClick: () => B(!A),
                                        children: A
                                          ? (0, b.jsx)(p.EyeOffIcon, {
                                              className: 'text-muted-foreground h-4 w-4',
                                            })
                                          : (0, b.jsx)(o.EyeIcon, {
                                              className: 'text-muted-foreground h-4 w-4',
                                            }),
                                      }),
                                    ],
                                  }),
                                }),
                                c.value &&
                                  (0, b.jsxs)('div', {
                                    className: 'space-y-2',
                                    children: [
                                      (0, b.jsxs)('div', {
                                        className: 'flex items-center space-x-2',
                                        children: [
                                          (0, b.jsx)('div', {
                                            className: 'h-2 flex-1 rounded-full bg-gray-200',
                                            children: (0, b.jsx)('div', {
                                              className: `h-2 rounded-full transition-all ${$ <= 1 ? 'bg-red-500' : 2 === $ ? 'bg-orange-500' : 3 === $ ? 'bg-yellow-500' : $ >= 4 ? 'bg-green-500' : 'bg-gray-300'}`,
                                              style: { width: `${($ / 5) * 100}%` },
                                            }),
                                          }),
                                          (0, b.jsx)('span', {
                                            className: `text-xs ${((a) => {
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
                                            })($)}`,
                                            children: ((a) => {
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
                                            })($),
                                          }),
                                        ],
                                      }),
                                      (0, b.jsx)(x.FormDescription, {
                                        children:
                                          '대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상',
                                      }),
                                    ],
                                  }),
                                (0, b.jsx)(x.FormMessage, {}),
                              ],
                            }),
                        }),
                        (0, b.jsx)(x.FormField, {
                          control: ab.control,
                          name: 'confirmPassword',
                          render: ({ field: c }) =>
                            (0, b.jsxs)(x.FormItem, {
                              children: [
                                (0, b.jsx)(x.FormLabel, { children: '비밀번호 확인' }),
                                (0, b.jsx)(x.FormControl, {
                                  children: (0, b.jsxs)('div', {
                                    className: 'relative',
                                    children: [
                                      (0, b.jsx)(j.Lock, {
                                        className:
                                          'text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5',
                                      }),
                                      (0, b.jsx)(t.Input, {
                                        type: C ? 'text' : 'password',
                                        placeholder: '비밀번호를 다시 입력하세요',
                                        className: 'pr-10 pl-10 sm:pr-9 sm:pl-9',
                                        disabled: a,
                                        ...c,
                                      }),
                                      (0, b.jsx)('button', {
                                        type: 'button',
                                        className:
                                          'absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5',
                                        onClick: () => D(!C),
                                        children: C
                                          ? (0, b.jsx)(p.EyeOffIcon, {
                                              className: 'text-muted-foreground h-4 w-4',
                                            })
                                          : (0, b.jsx)(o.EyeIcon, {
                                              className: 'text-muted-foreground h-4 w-4',
                                            }),
                                      }),
                                    ],
                                  }),
                                }),
                                (0, b.jsx)(x.FormMessage, {}),
                              ],
                            }),
                        }),
                        (0, b.jsx)('div', {
                          className: 'border-border space-y-4 border-t pt-4',
                          children: (0, b.jsxs)('div', {
                            className: 'space-y-3',
                            children: [
                              (0, b.jsx)(x.FormField, {
                                control: ab.control,
                                name: 'agreeToTerms',
                                render: ({ field: a }) =>
                                  (0, b.jsxs)(x.FormItem, {
                                    className: 'flex flex-row items-start space-y-0 space-x-3',
                                    children: [
                                      (0, b.jsx)(x.FormControl, {
                                        children: (0, b.jsx)(v.Checkbox, {
                                          checked: a.value,
                                          onCheckedChange: a.onChange,
                                        }),
                                      }),
                                      (0, b.jsx)('div', {
                                        className: 'space-y-1 leading-none',
                                        children: (0, b.jsxs)(x.FormLabel, {
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
                              (0, b.jsx)(x.FormField, {
                                control: ab.control,
                                name: 'agreeToPrivacy',
                                render: ({ field: a }) =>
                                  (0, b.jsxs)(x.FormItem, {
                                    className: 'flex flex-row items-start space-y-0 space-x-3',
                                    children: [
                                      (0, b.jsx)(x.FormControl, {
                                        children: (0, b.jsx)(v.Checkbox, {
                                          checked: a.value,
                                          onCheckedChange: a.onChange,
                                        }),
                                      }),
                                      (0, b.jsx)('div', {
                                        className: 'space-y-1 leading-none',
                                        children: (0, b.jsxs)(x.FormLabel, {
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
                              (0, b.jsx)(x.FormField, {
                                control: ab.control,
                                name: 'agreeToMarketing',
                                render: ({ field: a }) =>
                                  (0, b.jsxs)(x.FormItem, {
                                    className: 'flex flex-row items-start space-y-0 space-x-3',
                                    children: [
                                      (0, b.jsx)(x.FormControl, {
                                        children: (0, b.jsx)(v.Checkbox, {
                                          checked: a.value,
                                          onCheckedChange: a.onChange,
                                        }),
                                      }),
                                      (0, b.jsxs)('div', {
                                        className: 'space-y-1 leading-none',
                                        children: [
                                          (0, b.jsx)(x.FormLabel, {
                                            className: 'text-sm font-normal',
                                            children: '마케팅 정보 수신에 동의합니다 (선택)',
                                          }),
                                          (0, b.jsx)(x.FormDescription, {
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
                        E &&
                          (0, b.jsxs)(q.Alert, {
                            variant: 'destructive',
                            children: [
                              (0, b.jsx)(g.AlertCircle, { className: 'h-4 w-4' }),
                              (0, b.jsx)(q.AlertDescription, { children: E }),
                            ],
                          }),
                        G &&
                          (0, b.jsxs)(q.Alert, {
                            className: 'border-green-200 bg-green-50',
                            children: [
                              (0, b.jsx)(i.Info, { className: 'h-4 w-4 text-green-600' }),
                              (0, b.jsx)(q.AlertDescription, {
                                className: 'text-green-700',
                                children: G,
                              }),
                            ],
                          }),
                        (0, b.jsxs)(r.Button, {
                          type: 'submit',
                          className: 'w-full',
                          disabled: a || !M,
                          children: [
                            a && (0, b.jsx)(w.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                            '미용사 등록',
                          ],
                        }),
                      ],
                    }),
                  }),
                }),
              ],
            }),
            (0, b.jsx)('div', {
              className: 'mt-6 text-center',
              children: (0, b.jsxs)(r.Button, {
                variant: 'ghost',
                onClick: () => aa.push('/auth/signin'),
                className: 'text-muted-foreground hover:text-foreground',
                disabled: a,
                children: [
                  (0, b.jsx)(h.ArrowLeft, { className: 'mr-2 h-4 w-4' }),
                  '로그인 페이지로 돌아가기',
                ],
              }),
            }),
          ],
        }),
      })
    }
    a.s(['default', () => z])
  },
]

//# sourceMappingURL=src_app_auth_groomer_signup_page_tsx_b6ac7258._.js.map
