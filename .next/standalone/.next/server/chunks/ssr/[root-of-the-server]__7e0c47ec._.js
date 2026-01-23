module.exports = [
  864433,
  (a) => {
    a.v({ className: 'inter_5972bc34-module__OU16Qa__className' })
  },
  617133,
  (a) => {
    'use strict'
    let b = (0, a.i(211857).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      '[project]/src/components/providers.tsx <module evaluation>',
      'Providers'
    )
    a.s(['Providers', 0, b])
  },
  207698,
  (a) => {
    'use strict'
    let b = (0, a.i(211857).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      '[project]/src/components/providers.tsx',
      'Providers'
    )
    a.s(['Providers', 0, b])
  },
  547189,
  (a) => {
    'use strict'
    a.i(617133)
    var b = a.i(207698)
    a.n(b)
  },
  827572,
  (a) => {
    'use strict'
    var b = a.i(907997),
      c = a.i(864433)
    let d = {
      className: c.default.className,
      style: { fontFamily: "'Inter', 'Inter Fallback'", fontStyle: 'normal' },
    }
    null != c.default.variable && (d.variable = c.default.variable)
    var e = a.i(547189)
    let f = {
      title: '미미살롱펫 - 프리미엄 방문 반려동물 미용',
      description: '미미살롱펫 - 프리미엄 방문 반려동물 미용 서비스',
      metadataBase: new URL('https://mimisalon.pet'),
      icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/logo192.png' },
      manifest: '/manifest.json',
      appleWebApp: { capable: !0, statusBarStyle: 'default', title: '미미살롱펫' },
      formatDetection: { telephone: !1 },
    }
    function g({ children: a }) {
      return (0, b.jsx)('html', {
        lang: 'ko',
        children: (0, b.jsx)('body', {
          className: d.className,
          children: (0, b.jsx)(e.Providers, { children: a }),
        }),
      })
    }
    a.s(
      [
        'default',
        () => g,
        'metadata',
        0,
        f,
        'viewport',
        0,
        'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5.0, user-scalable=yes',
      ],
      827572
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__7e0c47ec._.js.map
