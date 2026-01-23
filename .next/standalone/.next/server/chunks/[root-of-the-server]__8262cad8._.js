module.exports = [
  270406,
  (e, t, r) => {
    t.exports = e.x('next/dist/compiled/@opentelemetry/api', () =>
      require('next/dist/compiled/@opentelemetry/api')
    )
  },
  918622,
  (e, t, r) => {
    t.exports = e.x('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js', () =>
      require('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js')
    )
  },
  556704,
  (e, t, r) => {
    t.exports = e.x('next/dist/server/app-render/work-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-async-storage.external.js')
    )
  },
  832319,
  (e, t, r) => {
    t.exports = e.x('next/dist/server/app-render/work-unit-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-unit-async-storage.external.js')
    )
  },
  324725,
  (e, t, r) => {
    t.exports = e.x('next/dist/server/app-render/after-task-async-storage.external.js', () =>
      require('next/dist/server/app-render/after-task-async-storage.external.js')
    )
  },
  193695,
  (e, t, r) => {
    t.exports = e.x('next/dist/shared/lib/no-fallback-error.external.js', () =>
      require('next/dist/shared/lib/no-fallback-error.external.js')
    )
  },
  442315,
  (e, t, r) => {
    'use strict'
    t.exports = e.r(918622)
  },
  347540,
  (e, t, r) => {
    'use strict'
    t.exports = e.r(442315).vendored['react-rsc'].React
  },
  819481,
  (e, t, r) => {
    'use strict'
    var n = Object.defineProperty,
      i = Object.getOwnPropertyDescriptor,
      a = Object.getOwnPropertyNames,
      o = Object.prototype.hasOwnProperty,
      s = {},
      l = {
        RequestCookies: () => f,
        ResponseCookies: () => g,
        parseCookie: () => u,
        parseSetCookie: () => c,
        stringifyCookie: () => d,
      }
    for (var p in l) n(s, p, { get: l[p], enumerable: !0 })
    function d(e) {
      var t
      let r = [
          'path' in e && e.path && `Path=${e.path}`,
          'expires' in e &&
            (e.expires || 0 === e.expires) &&
            `Expires=${('number' == typeof e.expires ? new Date(e.expires) : e.expires).toUTCString()}`,
          'maxAge' in e && 'number' == typeof e.maxAge && `Max-Age=${e.maxAge}`,
          'domain' in e && e.domain && `Domain=${e.domain}`,
          'secure' in e && e.secure && 'Secure',
          'httpOnly' in e && e.httpOnly && 'HttpOnly',
          'sameSite' in e && e.sameSite && `SameSite=${e.sameSite}`,
          'partitioned' in e && e.partitioned && 'Partitioned',
          'priority' in e && e.priority && `Priority=${e.priority}`,
        ].filter(Boolean),
        n = `${e.name}=${encodeURIComponent(null != (t = e.value) ? t : '')}`
      return 0 === r.length ? n : `${n}; ${r.join('; ')}`
    }
    function u(e) {
      let t = new Map()
      for (let r of e.split(/; */)) {
        if (!r) continue
        let e = r.indexOf('=')
        if (-1 === e) {
          t.set(r, 'true')
          continue
        }
        let [n, i] = [r.slice(0, e), r.slice(e + 1)]
        try {
          t.set(n, decodeURIComponent(null != i ? i : 'true'))
        } catch {}
      }
      return t
    }
    function c(e) {
      if (!e) return
      let [[t, r], ...n] = u(e),
        {
          domain: i,
          expires: a,
          httponly: o,
          maxage: s,
          path: l,
          samesite: p,
          secure: d,
          partitioned: c,
          priority: f,
        } = Object.fromEntries(n.map(([e, t]) => [e.toLowerCase().replace(/-/g, ''), t]))
      {
        var g,
          y,
          R = {
            name: t,
            value: decodeURIComponent(r),
            domain: i,
            ...(a && { expires: new Date(a) }),
            ...(o && { httpOnly: !0 }),
            ...('string' == typeof s && { maxAge: Number(s) }),
            path: l,
            ...(p && { sameSite: m.includes((g = (g = p).toLowerCase())) ? g : void 0 }),
            ...(d && { secure: !0 }),
            ...(f && { priority: h.includes((y = (y = f).toLowerCase())) ? y : void 0 }),
            ...(c && { partitioned: !0 }),
          }
        let e = {}
        for (let t in R) R[t] && (e[t] = R[t])
        return e
      }
    }
    t.exports = ((e, t, r, s) => {
      if ((t && 'object' == typeof t) || 'function' == typeof t)
        for (let r of a(t))
          o.call(e, r) ||
            void 0 === r ||
            n(e, r, { get: () => t[r], enumerable: !(s = i(t, r)) || s.enumerable })
      return e
    })(n({}, '__esModule', { value: !0 }), s)
    var m = ['strict', 'lax', 'none'],
      h = ['low', 'medium', 'high'],
      f = class {
        constructor(e) {
          ;((this._parsed = new Map()), (this._headers = e))
          const t = e.get('cookie')
          if (t) for (const [e, r] of u(t)) this._parsed.set(e, { name: e, value: r })
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]()
        }
        get size() {
          return this._parsed.size
        }
        get(...e) {
          let t = 'string' == typeof e[0] ? e[0] : e[0].name
          return this._parsed.get(t)
        }
        getAll(...e) {
          var t
          let r = Array.from(this._parsed)
          if (!e.length) return r.map(([e, t]) => t)
          let n = 'string' == typeof e[0] ? e[0] : null == (t = e[0]) ? void 0 : t.name
          return r.filter(([e]) => e === n).map(([e, t]) => t)
        }
        has(e) {
          return this._parsed.has(e)
        }
        set(...e) {
          let [t, r] = 1 === e.length ? [e[0].name, e[0].value] : e,
            n = this._parsed
          return (
            n.set(t, { name: t, value: r }),
            this._headers.set(
              'cookie',
              Array.from(n)
                .map(([e, t]) => d(t))
                .join('; ')
            ),
            this
          )
        }
        delete(e) {
          let t = this._parsed,
            r = Array.isArray(e) ? e.map((e) => t.delete(e)) : t.delete(e)
          return (
            this._headers.set(
              'cookie',
              Array.from(t)
                .map(([e, t]) => d(t))
                .join('; ')
            ),
            r
          )
        }
        clear() {
          return (this.delete(Array.from(this._parsed.keys())), this)
        }
        [Symbol.for('edge-runtime.inspect.custom')]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`
        }
        toString() {
          return [...this._parsed.values()]
            .map((e) => `${e.name}=${encodeURIComponent(e.value)}`)
            .join('; ')
        }
      },
      g = class {
        constructor(e) {
          var t, r, n
          ;((this._parsed = new Map()), (this._headers = e))
          const i =
            null !=
            (n =
              null != (r = null == (t = e.getSetCookie) ? void 0 : t.call(e))
                ? r
                : e.get('set-cookie'))
              ? n
              : []
          for (const e of Array.isArray(i)
            ? i
            : (function (e) {
                if (!e) return []
                var t,
                  r,
                  n,
                  i,
                  a,
                  o = [],
                  s = 0
                function l() {
                  for (; s < e.length && /\s/.test(e.charAt(s)); ) s += 1
                  return s < e.length
                }
                for (; s < e.length; ) {
                  for (t = s, a = !1; l(); )
                    if (',' === (r = e.charAt(s))) {
                      for (
                        n = s, s += 1, l(), i = s;
                        s < e.length && '=' !== (r = e.charAt(s)) && ';' !== r && ',' !== r;

                      )
                        s += 1
                      s < e.length && '=' === e.charAt(s)
                        ? ((a = !0), (s = i), o.push(e.substring(t, n)), (t = s))
                        : (s = n + 1)
                    } else s += 1
                  ;(!a || s >= e.length) && o.push(e.substring(t, e.length))
                }
                return o
              })(i)) {
            const t = c(e)
            t && this._parsed.set(t.name, t)
          }
        }
        get(...e) {
          let t = 'string' == typeof e[0] ? e[0] : e[0].name
          return this._parsed.get(t)
        }
        getAll(...e) {
          var t
          let r = Array.from(this._parsed.values())
          if (!e.length) return r
          let n = 'string' == typeof e[0] ? e[0] : null == (t = e[0]) ? void 0 : t.name
          return r.filter((e) => e.name === n)
        }
        has(e) {
          return this._parsed.has(e)
        }
        set(...e) {
          let [t, r, n] = 1 === e.length ? [e[0].name, e[0].value, e[0]] : e,
            i = this._parsed
          return (
            i.set(
              t,
              (function (e = { name: '', value: '' }) {
                return (
                  'number' == typeof e.expires && (e.expires = new Date(e.expires)),
                  e.maxAge && (e.expires = new Date(Date.now() + 1e3 * e.maxAge)),
                  (null === e.path || void 0 === e.path) && (e.path = '/'),
                  e
                )
              })({ name: t, value: r, ...n })
            ),
            (function (e, t) {
              for (let [, r] of (t.delete('set-cookie'), e)) {
                let e = d(r)
                t.append('set-cookie', e)
              }
            })(i, this._headers),
            this
          )
        }
        delete(...e) {
          let [t, r] = 'string' == typeof e[0] ? [e[0]] : [e[0].name, e[0]]
          return this.set({ ...r, name: t, value: '', expires: new Date(0) })
        }
        [Symbol.for('edge-runtime.inspect.custom')]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`
        }
        toString() {
          return [...this._parsed.values()].map(d).join('; ')
        }
      }
  },
  278164,
  (e) => {
    'use strict'
    var t = e.i(469719)
    let r = t.z.enum([
        'BOOKING_CONFIRMED',
        'BOOKING_CANCELLED',
        'BOOKING_REMINDER',
        'GROOMING_STARTED',
        'GROOMING_COMPLETED',
        'PAYMENT_RECEIVED',
        'PAYMENT_FAILED',
        'REFUND_PROCESSED',
        'REVIEW_REQUEST',
        'PROMOTION',
        'SYSTEM_NOTICE',
      ]),
      n = t.z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
      i = t.z.enum(['UNREAD', 'READ', 'ARCHIVED']),
      a = t.z.object({
        type: r,
        title: t.z
          .string()
          .min(1, '제목을 입력해주세요')
          .max(100, '제목은 100자 이하로 입력해주세요'),
        content: t.z
          .string()
          .min(1, '내용을 입력해주세요')
          .max(500, '내용은 500자 이하로 입력해주세요'),
        priority: n.default('NORMAL'),
        recipientId: t.z.string().min(1, '수신자 ID가 필요합니다'),
        relatedId: t.z.string().optional(),
        metadata: t.z.record(t.z.string(), t.z.any()).optional(),
        scheduledAt: t.z.date().optional(),
      })
    ;(t.z.object({
      status: i.optional(),
      readAt: t.z.date().optional(),
      archivedAt: t.z.date().optional(),
    }),
      t.z.object({
        status: i.optional(),
        type: r.optional(),
        priority: n.optional(),
        fromDate: t.z.string().optional(),
        toDate: t.z.string().optional(),
        page: t.z.number().min(1).default(1),
        limit: t.z.number().min(1).max(100).default(20),
      }),
      t.z.object({
        bookingUpdates: t.z.boolean().default(!0),
        paymentNotifications: t.z.boolean().default(!0),
        promotions: t.z.boolean().default(!1),
        systemNotices: t.z.boolean().default(!0),
        emailNotifications: t.z.boolean().default(!0),
        smsNotifications: t.z.boolean().default(!1),
      }),
      t.z.object({
        type: r,
        title: t.z.string().min(1).max(100),
        content: t.z.string().min(1).max(500),
        priority: n.default('NORMAL'),
        recipientIds: t.z.array(t.z.string()).min(1, '수신자를 선택해주세요'),
        metadata: t.z.record(t.z.string(), t.z.any()).optional(),
        scheduledAt: t.z.date().optional(),
      }))
    let o = t.z.object({
        userId: t.z.string().cuid('유효하지 않은 사용자 ID입니다'),
        title: t.z
          .string()
          .min(1, '제목을 입력해주세요')
          .max(100, '제목은 100자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '제목에 공백만 포함될 수 없습니다'),
        body: t.z
          .string()
          .min(1, '내용을 입력해주세요')
          .max(500, '내용은 500자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '내용에 공백만 포함될 수 없습니다'),
      }),
      s = t.z.object({
        userId: t.z.string().cuid('유효하지 않은 사용자 ID입니다'),
        title: t.z
          .string()
          .min(1, '제목을 입력해주세요')
          .max(100, '제목은 100자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '제목에 공백만 포함될 수 없습니다'),
        body: t.z
          .string()
          .min(1, '내용을 입력해주세요')
          .max(500, '내용은 500자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '내용에 공백만 포함될 수 없습니다'),
        delayMinutes: t.z
          .number()
          .int('정수만 입력 가능합니다')
          .min(1, '최소 1분 이상이어야 합니다')
          .max(60, '최대 60분까지 설정 가능합니다'),
      })
    e.s([
      'adminFcmNotificationSchema',
      0,
      o,
      'adminScheduleNotificationSchema',
      0,
      s,
      'createNotificationSchema',
      0,
      a,
    ])
  },
  494483,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      i = e.i(759756),
      a = e.i(561916),
      o = e.i(114444),
      s = e.i(837092),
      l = e.i(869741),
      p = e.i(316795),
      d = e.i(487718),
      u = e.i(995169),
      c = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      f = e.i(626937),
      g = e.i(10372),
      y = e.i(193695)
    e.i(52474)
    var R = e.i(600220),
      x = e.i(89171),
      E = e.i(469719),
      v = e.i(278164)
    let A = E.z.object({
        status: E.z.string().optional(),
        type: E.z.string().optional(),
        priority: E.z.string().optional(),
        page: E.z.coerce.number().int().min(1).default(1),
        limit: E.z.coerce.number().int().min(1).max(100).default(20),
        search: E.z.string().optional(),
      }),
      b = [
        {
          id: 'notif_001',
          type: 'BOOKING_CONFIRMED',
          title: '예약이 확정되었습니다',
          content:
            '뽀삐의 프리미엄 전체 미용 예약이 확정되었습니다. 1월 20일 오전 10시에 미미살롱 강남점에서 뵙겠습니다.',
          priority: 'HIGH',
          status: 'UNREAD',
          createdAt: '2024-01-15T14:30:00Z',
          relatedId: 'booking_001',
          recipientId: 'user_001',
          metadata: { bookingId: 'booking_001', groomerName: '김미용사' },
        },
        {
          id: 'notif_002',
          type: 'PAYMENT_RECEIVED',
          title: '결제가 완료되었습니다',
          content: '85,000원 결제가 성공적으로 완료되었습니다. 영수증을 확인해주세요.',
          priority: 'NORMAL',
          status: 'READ',
          createdAt: '2024-01-15T14:25:00Z',
          readAt: '2024-01-15T14:35:00Z',
          relatedId: 'payment_001',
          recipientId: 'user_001',
          metadata: { paymentId: 'payment_001', amount: 85e3 },
        },
        {
          id: 'notif_003',
          type: 'GROOMING_STARTED',
          title: '미용이 시작되었습니다',
          content: '뽀삐의 미용이 시작되었습니다. 실시간으로 진행 상황을 확인할 수 있습니다.',
          priority: 'NORMAL',
          status: 'UNREAD',
          createdAt: '2024-01-20T10:05:00Z',
          relatedId: 'booking_001',
          recipientId: 'user_001',
          metadata: { bookingId: 'booking_001', stage: 'STARTED' },
        },
        {
          id: 'notif_004',
          type: 'PROMOTION',
          title: '신규 고객 할인 이벤트',
          content: '첫 방문 고객을 위한 20% 할인 이벤트가 진행 중입니다. 지금 예약하세요!',
          priority: 'LOW',
          status: 'UNREAD',
          createdAt: '2024-01-14T09:00:00Z',
          relatedId: 'promo_001',
          recipientId: 'user_001',
          metadata: { promoCode: 'FIRST20', discount: 20 },
        },
      ]
    async function _(e) {
      try {
        let { searchParams: t } = new URL(e.url),
          r = {
            status: t.get('status') || void 0,
            type: t.get('type') || void 0,
            priority: t.get('priority') || void 0,
            page: parseInt(t.get('page') || '1'),
            limit: parseInt(t.get('limit') || '20'),
            search: t.get('search') || void 0,
          },
          n = [...b]
        if (
          (r.status && (n = n.filter((e) => e.status === r.status)),
          r.type && (n = n.filter((e) => e.type === r.type)),
          r.priority && (n = n.filter((e) => e.priority === r.priority)),
          r.search)
        ) {
          let e = r.search.toLowerCase()
          n = n.filter(
            (t) => t.title.toLowerCase().includes(e) || t.content.toLowerCase().includes(e)
          )
        }
        n.sort((e, t) => new Date(t.createdAt).getTime() - new Date(e.createdAt).getTime())
        let i = (r.page - 1) * r.limit,
          a = i + r.limit,
          o = n.slice(i, a)
        return x.NextResponse.json({
          notifications: o,
          pagination: {
            page: r.page,
            limit: r.limit,
            total: n.length,
            totalPages: Math.ceil(n.length / r.limit),
          },
          summary: {
            unreadCount: b.filter((e) => 'UNREAD' === e.status).length,
            totalCount: b.length,
          },
        })
      } catch (e) {
        return (
          console.error('Error fetching notifications:', e),
          x.NextResponse.json({ error: '알림을 불러올 수 없습니다' }, { status: 500 })
        )
      }
    }
    async function N(e) {
      try {
        let t = await e.json(),
          r = v.createNotificationSchema.parse(t),
          n = {
            id: `notif_${Date.now()}`,
            ...r,
            status: 'UNREAD',
            createdAt: new Date().toISOString(),
          }
        return (
          await O(n),
          x.NextResponse.json({
            success: !0,
            notification: n,
            message: '알림이 성공적으로 생성되었습니다',
          })
        )
      } catch (e) {
        if ((console.error('Error creating notification:', e), e instanceof E.z.ZodError))
          return x.NextResponse.json(
            { error: '잘못된 알림 데이터입니다', details: e.issues },
            { status: 400 }
          )
        return x.NextResponse.json({ error: '알림 생성 중 오류가 발생했습니다' }, { status: 500 })
      }
    }
    async function O(e) {
      try {
        ;(console.log('Sending push notification:', e),
          ('HIGH' === e.priority || 'URGENT' === e.priority) && (await w(e)),
          'URGENT' === e.priority && (await C(e)))
      } catch (e) {
        console.error('Error sending push notification:', e)
      }
    }
    async function w(e) {
      console.log('Sending email notification:', e)
    }
    async function C(e) {
      console.log('Sending SMS notification:', e)
    }
    e.s(['GET', () => _, 'POST', () => N, 'getNotificationsQuerySchema', 0, A], 262944)
    var I = e.i(262944)
    let S = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/notifications/route',
          pathname: '/api/notifications',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/notifications/route.ts',
        nextConfigOutput: 'standalone',
        userland: I,
      }),
      { workAsyncStorage: z, workUnitAsyncStorage: T, serverHooks: D } = S
    function j() {
      return (0, n.patchFetch)({ workAsyncStorage: z, workUnitAsyncStorage: T })
    }
    async function k(e, t, n) {
      S.isDev && (0, i.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let x = '/api/notifications/route'
      x = x.replace(/\/index$/, '') || '/'
      let E = await S.prepare(e, t, { srcPage: x, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: v,
          params: A,
          nextConfig: b,
          parsedUrl: _,
          isDraftMode: N,
          prerenderManifest: O,
          routerServerContext: w,
          isOnDemandRevalidate: C,
          revalidateOnlyGenerated: I,
          resolvedPathname: z,
          clientReferenceManifest: T,
          serverActionsManifest: D,
        } = E,
        j = (0, l.normalizeAppPath)(x),
        k = !!(O.dynamicRoutes[j] || O.routes[z]),
        M = async () => (
          (null == w ? void 0 : w.render404)
            ? await w.render404(e, t, _, !1)
            : t.end('This page could not be found'),
          null
        )
      if (k && !N) {
        let e = !!O.routes[z],
          t = O.dynamicRoutes[j]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await M()
          throw new y.NoFallbackError()
        }
      }
      let P = null
      !k || S.isDev || N || (P = '/index' === (P = z) ? '/' : P)
      let U = !0 === S.isDev || !k,
        H = k && !U
      D &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: x,
          clientReferenceManifest: T,
          serverActionsManifest: D,
          serverModuleMap: (0, s.createServerModuleMap)({ serverActionsManifest: D }),
        })
      let $ = e.method || 'GET',
        L = (0, a.getTracer)(),
        q = L.getActiveScopeSpan(),
        G = {
          params: A,
          prerenderManifest: O,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, i.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => S.onRequestError(e, t, n, w),
          },
          sharedContext: { buildId: v },
        },
        F = new p.NodeNextRequest(e),
        K = new p.NodeNextResponse(t),
        B = d.NextRequestAdapter.fromNodeNextRequest(F, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            S.handle(B, G).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = L.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== u.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = r.get('next.route')
              if (n) {
                let t = `${$} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${$} ${x}`)
            }),
          s = !!(0, i.getRequestMeta)(e, 'minimalMode'),
          l = async (i) => {
            var a, l
            let p = async ({ previousCacheEntry: r }) => {
                try {
                  if (!s && C && I && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let a = await o(i)
                  e.fetchMetrics = G.renderOpts.fetchMetrics
                  let l = G.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let p = G.renderOpts.collectedTags
                  if (!k)
                    return (await (0, m.sendResponse)(F, K, a, G.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await a.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(a.headers)
                    ;(p && (t[g.NEXT_CACHE_TAGS_HEADER] = p),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== G.renderOpts.collectedRevalidate &&
                        !(G.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        G.renderOpts.collectedRevalidate,
                      n =
                        void 0 === G.renderOpts.collectedExpire ||
                        G.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : G.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: R.CachedRouteKind.APP_ROUTE,
                        status: a.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: n },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await S.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: x,
                          routeType: 'route',
                          revalidateReason: (0, c.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: C,
                          }),
                        },
                        w
                      )),
                    t
                  )
                }
              },
              d = await S.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: P,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: O,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: C,
                revalidateOnlyGenerated: I,
                responseGenerator: p,
                waitUntil: n.waitUntil,
                isMinimalMode: s,
              })
            if (!k) return null
            if (
              (null == d || null == (a = d.value) ? void 0 : a.kind) !== R.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == d || null == (l = d.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(s ||
              t.setHeader(
                'x-nextjs-cache',
                C ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              N &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let u = (0, h.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (s && k) || u.delete(g.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                u.get('Cache-Control') ||
                u.set('Cache-Control', (0, f.getCacheControlHeader)(d.cacheControl)),
              await (0, m.sendResponse)(
                F,
                K,
                new Response(d.value.body, { headers: u, status: d.value.status || 200 })
              ),
              null
            )
          }
        q
          ? await l(q)
          : await L.withPropagatedContext(e.headers, () =>
              L.trace(
                u.BaseServerSpan.handleRequest,
                {
                  spanName: `${$} ${x}`,
                  kind: a.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof y.NoFallbackError ||
            (await S.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: j,
              routeType: 'route',
              revalidateReason: (0, c.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: C,
              }),
            })),
          k)
        )
          throw t
        return (await (0, m.sendResponse)(F, K, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => k,
        'patchFetch',
        () => j,
        'routeModule',
        () => S,
        'serverHooks',
        () => D,
        'workAsyncStorage',
        () => z,
        'workUnitAsyncStorage',
        () => T,
      ],
      494483
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__8262cad8._.js.map
