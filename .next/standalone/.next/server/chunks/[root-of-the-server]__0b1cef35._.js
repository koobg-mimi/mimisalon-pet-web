module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  688947,
  (e, t, r) => {
    t.exports = e.x('stream', () => require('stream'))
  },
  921517,
  (e, t, r) => {
    t.exports = e.x('http', () => require('http'))
  },
  524836,
  (e, t, r) => {
    t.exports = e.x('https', () => require('https'))
  },
  406461,
  (e, t, r) => {
    t.exports = e.x('zlib', () => require('zlib'))
  },
  792509,
  (e, t, r) => {
    t.exports = e.x('url', () => require('url'))
  },
  992097,
  (e, t, r) => {
    t.exports = e.x('punycode', () => require('punycode'))
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
    let s = t.z.object({
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
      o = t.z.object({
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
      s,
      'adminScheduleNotificationSchema',
      0,
      o,
      'createNotificationSchema',
      0,
      a,
    ])
  },
  849783,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      i = e.i(759756),
      a = e.i(561916),
      s = e.i(114444),
      o = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      f = e.i(626937),
      R = e.i(10372),
      E = e.i(193695)
    e.i(52474)
    var v = e.i(600220),
      x = e.i(89171),
      g = e.i(493458),
      _ = e.i(79832),
      N = e.i(657446),
      b = e.i(278164),
      y = e.i(963585),
      A = e.i(647373)
    async function I(e) {
      try {
        let t,
          r = await _.default.api.getSession({ headers: await (0, g.headers)() })
        if (!r?.user || 'ADMIN' !== r.user.role)
          return x.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let n = await e.json(),
          { userId: i, title: a, body: s } = b.adminFcmNotificationSchema.parse(n),
          o = await N.prisma.user.findUnique({
            where: { id: i },
            select: {
              id: !0,
              name: !0,
              email: !0,
              notificationsEnabled: !0,
              deviceTokens: { where: { isActive: !0 }, select: { token: !0 } },
            },
          })
        if (!o) return x.NextResponse.json({ error: 'User not found' }, { status: 404 })
        if (!o.notificationsEnabled)
          return x.NextResponse.json({ error: 'User has disabled notifications' }, { status: 400 })
        if (0 === o.deviceTokens.length)
          return x.NextResponse.json(
            { error: 'User does not have any device tokens registered' },
            { status: 400 }
          )
        let l = o.deviceTokens
          .map((e) => e.token)
          .filter((e) => A.ExpoNotificationService.isValidExpoPushToken(e))
        if (0 === l.length)
          return x.NextResponse.json(
            { error: '유효한 ExponentPushToken이 없습니다' },
            { status: 400 }
          )
        let d = {
            title: a,
            body: s,
            data: { type: 'ADMIN_MESSAGE', userId: o.id, timestamp: new Date().toISOString() },
            sound: 'default',
            badge: 1,
            channelId: 'mimisalon_notifications',
          },
          u = (
            await Promise.all(l.map((e) => A.ExpoNotificationService.sendToDevice(e, d)))
          ).filter((e) => !e.success),
          c = {
            success: 0 === u.length,
            error: u.length > 0 ? `Failed on ${u.length} device(s)` : void 0,
          }
        if (!c.success) {
          if (
            (console.error('❌ Expo notification send failed:', { userId: o.id, error: c.error }),
            c.error?.includes('DeviceNotRegistered') ||
              c.error?.includes('InvalidCredentials') ||
              c.error?.includes('Invalid ExponentPushToken'))
          ) {
            try {
              ;(await N.prisma.deviceToken.updateMany({
                where: { userId: o.id, token: { in: l } },
                data: { isActive: !1 },
              }),
                console.log('🧹 Marked invalid ExponentPushTokens as inactive for user:', o.id))
            } catch (e) {
              console.error('Failed to mark invalid ExponentPushTokens as inactive:', e)
            }
            return x.NextResponse.json(
              { error: 'ExponentPushToken이 유효하지 않아 비활성화되었습니다' },
              { status: 400 }
            )
          }
          if (c.error?.includes('RateLimitExceeded'))
            return x.NextResponse.json(
              { error: '메시지 전송 속도 제한을 초과했습니다' },
              { status: 429 }
            )
          return x.NextResponse.json(
            { error: `알림 전송에 실패했습니다: ${c.error}` },
            { status: 500 }
          )
        }
        return (
          console.log('✅ Expo notification sent successfully:', {
            ticketId: t,
            userId: o.id,
            title: a.substring(0, 50) + (a.length > 50 ? '...' : ''),
          }),
          await N.prisma.notification.create({
            data: {
              userId: o.id,
              title: a,
              body: s,
              type: 'ADMIN_MESSAGE',
              isRead: !1,
              metadata: {
                sentBy: r.user.id,
                sentAt: new Date().toISOString(),
                method: 'EXPO',
                expoPushTicketId: t,
                expoStatus: 'sent',
              },
            },
          }),
          x.NextResponse.json({
            success: !0,
            message: 'Expo notification sent successfully',
            expoPushTicketId: t,
            user: { id: o.id, name: o.name, email: o.email },
          })
        )
      } catch (e) {
        if (e instanceof y.ZodError)
          return x.NextResponse.json(
            {
              error: '유효하지 않은 입력 데이터입니다',
              details: e.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
            },
            { status: 400 }
          )
        if (
          (console.error('FCM send error:', e),
          e instanceof Error && 'PrismaClientKnownRequestError' === e.name)
        )
          return x.NextResponse.json({ error: '데이터베이스 오류가 발생했습니다' }, { status: 500 })
        return x.NextResponse.json({ error: '서버 내부 오류가 발생했습니다' }, { status: 500 })
      }
    }
    e.s(['POST', () => I], 385081)
    var w = e.i(385081)
    let z = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/notifications/send-fcm/route',
          pathname: '/api/admin/notifications/send-fcm',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/notifications/send-fcm/route.ts',
        nextConfigOutput: 'standalone',
        userland: w,
      }),
      { workAsyncStorage: C, workUnitAsyncStorage: O, serverHooks: T } = z
    function S() {
      return (0, n.patchFetch)({ workAsyncStorage: C, workUnitAsyncStorage: O })
    }
    async function k(e, t, n) {
      z.isDev && (0, i.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let x = '/api/admin/notifications/send-fcm/route'
      x = x.replace(/\/index$/, '') || '/'
      let g = await z.prepare(e, t, { srcPage: x, multiZoneDraftMode: !1 })
      if (!g)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: _,
          params: N,
          nextConfig: b,
          parsedUrl: y,
          isDraftMode: A,
          prerenderManifest: I,
          routerServerContext: w,
          isOnDemandRevalidate: C,
          revalidateOnlyGenerated: O,
          resolvedPathname: T,
          clientReferenceManifest: S,
          serverActionsManifest: k,
        } = g,
        P = (0, l.normalizeAppPath)(x),
        j = !!(I.dynamicRoutes[P] || I.routes[T]),
        D = async () => (
          (null == w ? void 0 : w.render404)
            ? await w.render404(e, t, y, !1)
            : t.end('This page could not be found'),
          null
        )
      if (j && !A) {
        let e = !!I.routes[T],
          t = I.dynamicRoutes[P]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await D()
          throw new E.NoFallbackError()
        }
      }
      let M = null
      !j || z.isDev || A || (M = '/index' === (M = T) ? '/' : M)
      let U = !0 === z.isDev || !j,
        q = j && !U
      k &&
        S &&
        (0, s.setReferenceManifestsSingleton)({
          page: x,
          clientReferenceManifest: S,
          serverActionsManifest: k,
          serverModuleMap: (0, o.createServerModuleMap)({ serverActionsManifest: k }),
        })
      let H = e.method || 'GET',
        F = (0, a.getTracer)(),
        G = F.getActiveScopeSpan(),
        L = {
          params: N,
          prerenderManifest: I,
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
            onInstrumentationRequestError: (t, r, n) => z.onRequestError(e, t, n, w),
          },
          sharedContext: { buildId: _ },
        },
        K = new d.NodeNextRequest(e),
        $ = new d.NodeNextResponse(t),
        B = u.NextRequestAdapter.fromNodeNextRequest(K, (0, u.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            z.handle(B, L).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = F.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = r.get('next.route')
              if (n) {
                let t = `${H} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${H} ${x}`)
            }),
          o = !!(0, i.getRequestMeta)(e, 'minimalMode'),
          l = async (i) => {
            var a, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!o && C && O && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let a = await s(i)
                  e.fetchMetrics = L.renderOpts.fetchMetrics
                  let l = L.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let d = L.renderOpts.collectedTags
                  if (!j)
                    return (await (0, m.sendResponse)(K, $, a, L.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await a.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(a.headers)
                    ;(d && (t[R.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== L.renderOpts.collectedRevalidate &&
                        !(L.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        L.renderOpts.collectedRevalidate,
                      n =
                        void 0 === L.renderOpts.collectedExpire ||
                        L.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : L.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: v.CachedRouteKind.APP_ROUTE,
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
                      (await z.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: x,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: q,
                            isOnDemandRevalidate: C,
                          }),
                        },
                        w
                      )),
                    t
                  )
                }
              },
              u = await z.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: I,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: C,
                revalidateOnlyGenerated: O,
                responseGenerator: d,
                waitUntil: n.waitUntil,
                isMinimalMode: o,
              })
            if (!j) return null
            if (
              (null == u || null == (a = u.value) ? void 0 : a.kind) !== v.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == u || null == (l = u.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(o ||
              t.setHeader(
                'x-nextjs-cache',
                C ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (o && j) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(u.cacheControl)),
              await (0, m.sendResponse)(
                K,
                $,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        G
          ? await l(G)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${H} ${x}`,
                  kind: a.SpanKind.SERVER,
                  attributes: { 'http.method': H, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof E.NoFallbackError ||
            (await z.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: P,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: q,
                isOnDemandRevalidate: C,
              }),
            })),
          j)
        )
          throw t
        return (await (0, m.sendResponse)(K, $, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => k,
        'patchFetch',
        () => S,
        'routeModule',
        () => z,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => C,
        'workUnitAsyncStorage',
        () => O,
      ],
      849783
    )
  },
  308812,
  (e) => {
    e.v((t) =>
      Promise.all(
        [
          'server/chunks/node_modules_better-auth_dist_chunks_bun-sqlite-dialect_mjs_ac94bb8b._.js',
        ].map((t) => e.l(t))
      ).then(() => t(463259))
    )
  },
  922180,
  (e) => {
    e.v((t) =>
      Promise.all(
        [
          'server/chunks/node_modules_better-auth_dist_chunks_node-sqlite-dialect_mjs_29019df6._.js',
        ].map((t) => e.l(t))
      ).then(() => t(8202))
    )
  },
  501603,
  (e) => {
    e.v((t) =>
      Promise.all(['server/chunks/[root-of-the-server]__fd3a5b9b._.js'].map((t) => e.l(t))).then(
        () => t(492749)
      )
    )
  },
  715957,
  (e) => {
    e.v((t) =>
      Promise.all(
        ['server/chunks/[root-of-the-server]__05e349db._.js', 'server/chunks/_1aa5a6b5._.js'].map(
          (t) => e.l(t)
        )
      ).then(() => t(309653))
    )
  },
  578406,
  (e) => {
    e.v((t) =>
      Promise.all(
        [
          'server/chunks/[root-of-the-server]__aa8ebafd._.js',
          'server/chunks/[root-of-the-server]__635f9513._.js',
          'server/chunks/node_modules_mime-db_db_json_a85ad9f0._.js',
          'server/chunks/_46980750._.js',
          'server/chunks/node_modules_0f478c9c._.js',
        ].map((t) => e.l(t))
      ).then(() => t(315159))
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__0b1cef35._.js.map
