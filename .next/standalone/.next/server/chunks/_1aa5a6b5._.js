module.exports = [
  222260,
  (e, t, i) => {
    'use strict'
    t.exports = e.r(442315).vendored['react-rsc'].ReactJsxRuntime
  },
  36557,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(222260),
          r = e.i(306589),
          n = t([r])
        function l({ children: e, title: t, previewText: i }) {
          return (0, a.jsxs)(r.Html, {
            lang: 'ko',
            children: [
              (0, a.jsxs)(r.Head, {
                children: [
                  (0, a.jsx)('title', { children: t }),
                  (0, a.jsx)(r.Font, {
                    fontFamily: 'system-ui',
                    fallbackFontFamily: 'Arial',
                    webFont: {
                      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
                      format: 'woff2',
                    },
                    fontWeight: 400,
                    fontStyle: 'normal',
                  }),
                ],
              }),
              (0, a.jsxs)(r.Body, {
                style: o,
                children: [
                  i && (0, a.jsx)(r.Text, { style: s, children: i }),
                  (0, a.jsxs)(r.Container, {
                    style: c,
                    children: [
                      e,
                      (0, a.jsx)(r.Hr, { style: x }),
                      (0, a.jsx)(r.Section, {
                        style: d,
                        children: (0, a.jsxs)(r.Text, {
                          style: f,
                          children: [
                            '이 메일은 발신 전용입니다. 문의사항이 있으시면 고객센터로 연락해주세요.',
                            (0, a.jsx)('br', {}),
                            '© 2024 미미살롱펫. All rights reserved.',
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        }
        ;[r] = n.then ? (await n)() : n
        let o = {
            margin: '0',
            padding: '0',
            backgroundColor: '#f8fafc',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          },
          s = {
            display: 'none',
            overflow: 'hidden',
            lineHeight: '1px',
            opacity: 0,
            maxHeight: '0',
            maxWidth: '0',
          },
          c = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
          x = { borderColor: '#e2e8f0', margin: '0' },
          d = {
            backgroundColor: '#f8fafc',
            padding: '24px 20px',
            textAlign: 'center',
            borderTop: '1px solid #e2e8f0',
          },
          f = { color: '#718096', margin: '0', fontSize: '14px', lineHeight: '1.4' }
        ;(e.s(['BaseEmailLayout', () => l]), i())
      } catch (e) {
        i(e)
      }
    }, !1),
  410486,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(222260),
          r = e.i(306589),
          n = e.i(36557),
          l = t([r, n])
        function o({ name: e, verificationUrl: t }) {
          return (0, a.jsxs)(n.BaseEmailLayout, {
            title: '이메일 인증 - 미미살롱펫',
            previewText: `안녕하세요 ${e}님, 미미살롱펫 이메일 인증을 완료해주세요.`,
            children: [
              (0, a.jsxs)(r.Section, {
                style: s,
                children: [
                  (0, a.jsx)(r.Text, { style: c, children: '🐾 미미살롱펫' }),
                  (0, a.jsx)(r.Text, { style: x, children: '프리미엄 방문 반려동물 미용' }),
                ],
              }),
              (0, a.jsxs)(r.Section, {
                style: d,
                children: [
                  (0, a.jsxs)(r.Section, {
                    style: f,
                    children: [
                      (0, a.jsxs)(r.Text, { style: p, children: ['안녕하세요, ', e, '님!'] }),
                      (0, a.jsxs)(r.Text, {
                        style: g,
                        children: [
                          '미미살롱펫에 가입해 주셔서 감사합니다.',
                          (0, a.jsx)('br', {}),
                          '아래 버튼을 클릭하여 이메일 인증을 완료해주세요.',
                        ],
                      }),
                    ],
                  }),
                  (0, a.jsxs)(r.Section, {
                    style: m,
                    children: [
                      (0, a.jsx)(r.Text, { style: h, children: '이메일 인증이 필요합니다' }),
                      (0, a.jsx)(r.Text, {
                        style: y,
                        children: '계정 보안을 위해 이메일 주소를 인증해주세요.',
                      }),
                      (0, a.jsx)(r.Button, { href: t, style: j, children: '✅ 이메일 인증하기' }),
                      (0, a.jsx)(r.Text, {
                        style: u,
                        children:
                          '버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:',
                      }),
                      (0, a.jsx)(r.Text, { style: T, children: t }),
                    ],
                  }),
                  (0, a.jsx)(r.Section, {
                    style: b,
                    children: (0, a.jsxs)(r.Text, {
                      style: S,
                      children: [
                        (0, a.jsx)('strong', { children: '🔒 보안 안내' }),
                        (0, a.jsx)('br', {}),
                        '• 이 링크는 24시간 동안만 유효합니다',
                        (0, a.jsx)('br', {}),
                        '• 링크는 한 번만 사용할 수 있습니다',
                        (0, a.jsx)('br', {}),
                        '• 본인이 요청하지 않은 경우 이 메일을 무시하세요',
                      ],
                    }),
                  }),
                ],
              }),
            ],
          })
        }
        ;[r, n] = l.then ? (await l)() : l
        let s = {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px',
            textAlign: 'center',
          },
          c = { color: '#ffffff', margin: '0', fontSize: '28px', fontWeight: '700' },
          x = { color: '#e2e8f0', margin: '8px 0 0 0', fontSize: '16px' },
          d = { padding: '40px 20px' },
          f = { textAlign: 'center', marginBottom: '32px' },
          p = { color: '#1a202c', margin: '0 0 16px 0', fontSize: '24px', fontWeight: '600' },
          g = { color: '#4a5568', margin: '0', fontSize: '16px', lineHeight: '1.5' },
          m = {
            backgroundColor: '#f7fafc',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            margin: '32px 0',
          },
          h = { color: '#1a202c', marginTop: '0', fontSize: '20px', fontWeight: '600' },
          y = { color: '#4a5568', marginBottom: '24px', fontSize: '16px' },
          j = {
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '16px',
            margin: '16px 0',
          },
          u = { color: '#718096', fontSize: '12px', marginTop: '16px' },
          T = { color: '#667eea', wordBreak: 'break-all', fontSize: '12px' },
          b = {
            backgroundColor: '#e6fffa',
            borderLeft: '4px solid #38b2ac',
            padding: '16px',
            margin: '24px 0',
            borderRadius: '4px',
          },
          S = { margin: '0', color: '#234e52', fontSize: '14px', lineHeight: '1.4' }
        ;(e.s(['EmailVerificationEmail', () => o]), i())
      } catch (e) {
        i(e)
      }
    }, !1),
  625831,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(222260),
          r = e.i(306589),
          n = e.i(36557),
          l = t([r, n])
        function o({ name: e, resetUrl: t }) {
          return (0, a.jsxs)(n.BaseEmailLayout, {
            title: '비밀번호 재설정 - 미미살롱펫',
            previewText: `${e}님의 비밀번호 재설정 요청을 처리해드리겠습니다.`,
            children: [
              (0, a.jsxs)(r.Section, {
                style: s,
                children: [
                  (0, a.jsx)(r.Text, { style: c, children: '🔐 미미살롱펫' }),
                  (0, a.jsx)(r.Text, { style: x, children: '비밀번호 재설정' }),
                ],
              }),
              (0, a.jsxs)(r.Section, {
                style: d,
                children: [
                  (0, a.jsxs)(r.Section, {
                    style: f,
                    children: [
                      (0, a.jsx)(r.Text, { style: p, children: '비밀번호 재설정 요청' }),
                      (0, a.jsxs)(r.Text, {
                        style: g,
                        children: [
                          '안녕하세요, ',
                          e,
                          '님.',
                          (0, a.jsx)('br', {}),
                          '계정의 비밀번호 재설정을 요청하셨습니다.',
                        ],
                      }),
                    ],
                  }),
                  (0, a.jsxs)(r.Section, {
                    style: m,
                    children: [
                      (0, a.jsx)(r.Text, { style: h, children: '새 비밀번호를 설정하세요' }),
                      (0, a.jsx)(r.Text, {
                        style: y,
                        children: '아래 버튼을 클릭하여 안전한 새 비밀번호를 설정하세요.',
                      }),
                      (0, a.jsx)(r.Button, {
                        href: t,
                        style: j,
                        children: '🔑 비밀번호 재설정하기',
                      }),
                      (0, a.jsx)(r.Text, {
                        style: u,
                        children:
                          '버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:',
                      }),
                      (0, a.jsx)(r.Text, { style: T, children: t }),
                    ],
                  }),
                  (0, a.jsx)(r.Section, {
                    style: b,
                    children: (0, a.jsxs)(r.Text, {
                      style: S,
                      children: [
                        (0, a.jsx)('strong', { children: '⚠️ 보안 주의사항' }),
                        (0, a.jsx)('br', {}),
                        '• 이 링크는 30분 동안만 유효합니다',
                        (0, a.jsx)('br', {}),
                        '• 링크는 한 번만 사용할 수 있습니다',
                        (0, a.jsx)('br', {}),
                        '• 본인이 요청하지 않은 경우 즉시 고객센터로 연락하세요',
                        (0, a.jsx)('br', {}),
                        '• 비밀번호 변경 후 모든 기기에서 다시 로그인하세요',
                      ],
                    }),
                  }),
                  (0, a.jsxs)(r.Text, {
                    style: E,
                    children: [
                      '혹시 비밀번호 재설정을 요청하지 않으셨다면, 이 메일을 무시하셔도 됩니다.',
                      (0, a.jsx)('br', {}),
                      '계정은 안전하게 보호되고 있습니다.',
                    ],
                  }),
                ],
              }),
            ],
          })
        }
        ;[r, n] = l.then ? (await l)() : l
        let s = {
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '40px 20px',
            textAlign: 'center',
          },
          c = { color: '#ffffff', margin: '0', fontSize: '28px', fontWeight: '700' },
          x = { color: '#fce4ec', margin: '8px 0 0 0', fontSize: '16px' },
          d = { padding: '40px 20px' },
          f = { textAlign: 'center', marginBottom: '32px' },
          p = { color: '#1a202c', margin: '0 0 16px 0', fontSize: '24px', fontWeight: '600' },
          g = { color: '#4a5568', margin: '0', fontSize: '16px', lineHeight: '1.5' },
          m = {
            backgroundColor: '#fff5f5',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            margin: '32px 0',
          },
          h = { color: '#1a202c', marginTop: '0', fontSize: '20px', fontWeight: '600' },
          y = { color: '#4a5568', marginBottom: '24px', fontSize: '16px' },
          j = {
            display: 'inline-block',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '16px',
            margin: '16px 0',
          },
          u = { color: '#718096', fontSize: '12px', marginTop: '16px' },
          T = { color: '#f5576c', wordBreak: 'break-all', fontSize: '12px' },
          b = {
            backgroundColor: '#fef5e7',
            borderLeft: '4px solid #f6ad55',
            padding: '16px',
            margin: '24px 0',
            borderRadius: '4px',
          },
          S = { margin: '0', color: '#744210', fontSize: '14px', lineHeight: '1.4' },
          E = { color: '#718096', textAlign: 'center', fontSize: '14px', lineHeight: '1.4' }
        ;(e.s(['PasswordResetEmail', () => o]), i())
      } catch (e) {
        i(e)
      }
    }, !1),
  147748,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(222260),
          r = e.i(306589),
          n = e.i(36557),
          l = t([r, n])
        function o({ email: e, otp: t, type: i }) {
          let l = () => {
            switch (i) {
              case 'sign-in':
                return '로그인 인증코드'
              case 'email-verification':
                return '이메일 인증코드'
              case 'forget-password':
                return '비밀번호 재설정 인증코드'
              default:
                return '인증코드'
            }
          }
          return (0, a.jsxs)(n.BaseEmailLayout, {
            title: `${l()} - 미미살롱펫`,
            previewText: `인증코드: ${t}`,
            children: [
              (0, a.jsxs)(r.Section, {
                style: {
                  ...s,
                  background: (() => {
                    switch (i) {
                      case 'sign-in':
                      default:
                        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      case 'email-verification':
                        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                      case 'forget-password':
                        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    }
                  })(),
                },
                children: [
                  (0, a.jsx)(r.Text, { style: c, children: '🔐 미미살롱펫' }),
                  (0, a.jsx)(r.Text, { style: x, children: l() }),
                ],
              }),
              (0, a.jsxs)(r.Section, {
                style: d,
                children: [
                  (0, a.jsxs)(r.Section, {
                    style: f,
                    children: [
                      (0, a.jsx)(r.Text, { style: p, children: '안녕하세요!' }),
                      (0, a.jsx)(r.Text, {
                        style: g,
                        children: (() => {
                          switch (i) {
                            case 'sign-in':
                              return '로그인을 완료하기 위해 아래 인증코드를 입력해주세요.'
                            case 'email-verification':
                              return '이메일 주소를 인증하기 위해 아래 인증코드를 입력해주세요.'
                            case 'forget-password':
                              return '비밀번호를 재설정하기 위해 아래 인증코드를 입력해주세요.'
                            default:
                              return '인증을 완료하기 위해 아래 코드를 입력해주세요.'
                          }
                        })(),
                      }),
                    ],
                  }),
                  (0, a.jsxs)(r.Section, {
                    style: m,
                    children: [
                      (0, a.jsx)(r.Text, { style: h, children: '인증코드' }),
                      (0, a.jsx)(r.Section, {
                        style: y,
                        children: (0, a.jsx)(r.Text, { style: j, children: t }),
                      }),
                      (0, a.jsxs)(r.Text, {
                        style: u,
                        children: [
                          '이 코드를 복사하여 인증 페이지에 입력하세요.',
                          (0, a.jsx)('br', {}),
                          '인증코드는 ',
                          (0, a.jsx)('strong', { children: '10분 동안' }),
                          ' 유효합니다.',
                        ],
                      }),
                    ],
                  }),
                  (0, a.jsx)(r.Section, {
                    style: T,
                    children: (0, a.jsxs)(r.Text, {
                      style: b,
                      children: [
                        (0, a.jsx)('strong', { children: '🔒 보안 안내' }),
                        (0, a.jsx)('br', {}),
                        '• 이 코드는 10분 후 자동으로 만료됩니다',
                        (0, a.jsx)('br', {}),
                        '• 최대 5회까지 입력 시도가 가능합니다',
                        (0, a.jsx)('br', {}),
                        '• 누구와도 이 코드를 공유하지 마세요',
                        (0, a.jsx)('br', {}),
                        '• 본인이 요청하지 않은 경우 이 메일을 무시하세요',
                      ],
                    }),
                  }),
                  (0, a.jsx)(r.Text, {
                    style: S,
                    children:
                      '본인이 요청하지 않은 경우, 계정 보안을 위해 즉시 비밀번호를 변경하시기 바랍니다.',
                  }),
                ],
              }),
            ],
          })
        }
        ;[r, n] = l.then ? (await l)() : l
        let s = { padding: '40px 20px', textAlign: 'center' },
          c = { color: '#ffffff', margin: '0', fontSize: '28px', fontWeight: '700' },
          x = { color: '#ffffff', opacity: '0.9', margin: '8px 0 0 0', fontSize: '16px' },
          d = { padding: '40px 20px' },
          f = { textAlign: 'center', marginBottom: '32px' },
          p = { color: '#1a202c', margin: '0 0 16px 0', fontSize: '24px', fontWeight: '600' },
          g = { color: '#4a5568', margin: '0', fontSize: '16px', lineHeight: '1.5' },
          m = { textAlign: 'center', margin: '32px 0' },
          h = {
            color: '#718096',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          },
          y = {
            backgroundColor: '#f7fafc',
            border: '2px dashed #cbd5e0',
            borderRadius: '12px',
            padding: '24px',
            margin: '16px auto',
            maxWidth: '320px',
          },
          j = {
            color: '#1a202c',
            fontSize: '42px',
            fontWeight: '700',
            letterSpacing: '8px',
            fontFamily: 'monospace',
            margin: '0',
            textAlign: 'center',
          },
          u = { color: '#718096', fontSize: '14px', marginTop: '16px', lineHeight: '1.5' },
          T = {
            backgroundColor: '#e6fffa',
            borderLeft: '4px solid #38b2ac',
            padding: '16px',
            margin: '24px 0',
            borderRadius: '4px',
          },
          b = { margin: '0', color: '#234e52', fontSize: '14px', lineHeight: '1.6' },
          S = {
            color: '#718096',
            textAlign: 'center',
            fontSize: '13px',
            lineHeight: '1.4',
            marginTop: '24px',
          }
        ;(e.s(['OTPVerificationEmail', () => o]), i())
      } catch (e) {
        i(e)
      }
    }, !1),
  554768,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(501102),
          r = e.i(410486),
          n = e.i(625831),
          l = e.i(147748),
          o = t([a, r, n, l])
        async function s(e, t) {
          return await (0, a.render)((0, r.EmailVerificationEmail)({ name: e, verificationUrl: t }))
        }
        async function c(e, t) {
          return await (0, a.render)((0, n.PasswordResetEmail)({ name: e, resetUrl: t }))
        }
        async function x(e, t, i) {
          return await (0, a.render)((0, l.OTPVerificationEmail)({ email: e, otp: t, type: i }))
        }
        async function d(e, t) {
          switch (e) {
            case 'email-verification':
              return await s(t.name, t.url)
            case 'password-reset':
              return await c(t.name, t.url)
            default:
              throw Error(`Unknown email template type: ${e}`)
          }
        }
        ;(([a, r, n, l] = o.then ? (await o)() : o),
          e.s([
            'generateEmailTemplate',
            () => d,
            'generateEmailVerificationTemplate',
            () => s,
            'generateOTPEmailTemplate',
            () => x,
            'generatePasswordResetTemplate',
            () => c,
          ]),
          i())
      } catch (e) {
        i(e)
      }
    }, !1),
  204061,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(554768),
          r = e.i(410486),
          n = e.i(625831),
          l = e.i(147748),
          o = e.i(36557),
          s = t([a, r, n, l, o])
        ;(([a, r, n, l, o] = s.then ? (await s)() : s), e.s([]), i())
      } catch (e) {
        i(e)
      }
    }, !1),
  104922,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(204061),
          r = t([a])
        ;(([a] = r.then ? (await r)() : r), e.s([]), i())
      } catch (e) {
        i(e)
      }
    }, !1),
  149796,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(204061),
          r = e.i(554768),
          n = e.i(410486),
          l = e.i(625831),
          o = e.i(147748),
          s = e.i(36557),
          c = t([a, r, n, l, o, s])
        ;(([a, r, n, l, o, s] = c.then ? (await c)() : c),
          e.s([
            'BaseEmailLayout',
            () => s.BaseEmailLayout,
            'EmailVerificationEmail',
            () => n.EmailVerificationEmail,
            'OTPVerificationEmail',
            () => o.OTPVerificationEmail,
            'PasswordResetEmail',
            () => l.PasswordResetEmail,
            'generateEmailTemplate',
            () => r.generateEmailTemplate,
            'generateEmailVerificationTemplate',
            () => r.generateEmailVerificationTemplate,
            'generateOTPEmailTemplate',
            () => r.generateOTPEmailTemplate,
            'generatePasswordResetTemplate',
            () => r.generatePasswordResetTemplate,
          ]),
          i())
      } catch (e) {
        i(e)
      }
    }, !1),
  309653,
  (e) =>
    e.a(async (t, i) => {
      try {
        var a = e.i(104922),
          r = e.i(149796),
          n = t([a, r])
        ;(([a, r] = n.then ? (await n)() : n),
          e.s([
            'BaseEmailLayout',
            () => r.BaseEmailLayout,
            'EmailVerificationEmail',
            () => r.EmailVerificationEmail,
            'OTPVerificationEmail',
            () => r.OTPVerificationEmail,
            'PasswordResetEmail',
            () => r.PasswordResetEmail,
            'generateEmailTemplate',
            () => r.generateEmailTemplate,
            'generateEmailVerificationTemplate',
            () => r.generateEmailVerificationTemplate,
            'generateOTPEmailTemplate',
            () => r.generateOTPEmailTemplate,
            'generatePasswordResetTemplate',
            () => r.generatePasswordResetTemplate,
          ]),
          i())
      } catch (e) {
        i(e)
      }
    }, !1),
]

//# sourceMappingURL=_1aa5a6b5._.js.map
