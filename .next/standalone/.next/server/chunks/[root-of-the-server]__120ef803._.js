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
  389579,
  (e) => {
    'use strict'
    var t = e.i(657446),
      r = e.i(647373)
    let o = new t.PrismaClient()
    class n {
      static isValidExpoPushToken(e) {
        return r.ExpoNotificationService.isValidExpoPushToken(e)
      }
      static async updateUserToken(e, t, n = 'android', s) {
        try {
          if (!r.ExpoNotificationService.isValidExpoPushToken(t))
            return { success: !1, error: 'Invalid ExponentPushToken format' }
          let i = await o.deviceToken.upsert({
            where: { token: t },
            create: {
              userId: e,
              token: t,
              platform: n,
              deviceId: s,
              isActive: !0,
              lastUsed: new Date(),
            },
            update: { isActive: !0, lastUsed: new Date(), platform: n, deviceId: s },
            select: { id: !0, token: !0, platform: !0, lastUsed: !0 },
          })
          return (
            console.log(`✅ ExponentPushToken saved to DeviceToken table:`),
            console.log(`   User ID: ${e}`),
            console.log(`   Token: ${i.token}`),
            console.log(`   Platform: ${i.platform}`),
            console.log(`   Last Used: ${i.lastUsed}`),
            { success: !0 }
          )
        } catch (e) {
          return (
            console.error('Error updating ExponentPushToken:', e),
            { success: !1, error: e instanceof Error ? e.message : 'Unknown error' }
          )
        }
      }
      static async getUserTokens(e) {
        try {
          let t = await o.user.findUnique({
            where: { id: e },
            select: { notificationsEnabled: !0 },
          })
          if (!t || !t.notificationsEnabled) return []
          return (
            await o.deviceToken.findMany({
              where: { userId: e, isActive: !0 },
              select: { token: !0 },
            })
          )
            .filter((e) => r.ExpoNotificationService.isValidExpoPushToken(e.token))
            .map((e) => e.token)
        } catch (e) {
          return (console.error('Error getting user ExponentPushTokens:', e), [])
        }
      }
      static async getUserToken(e) {
        return (await this.getUserTokens(e))[0] || null
      }
      static async getMultipleUserTokens(e) {
        try {
          let t = (
            await o.user.findMany({
              where: { id: { in: e }, notificationsEnabled: !0 },
              select: { id: !0 },
            })
          ).map((e) => e.id)
          return (
            await o.deviceToken.findMany({
              where: { userId: { in: t }, isActive: !0 },
              select: { token: !0 },
            })
          )
            .filter((e) => r.ExpoNotificationService.isValidExpoPushToken(e.token))
            .map((e) => e.token)
        } catch (e) {
          return (console.error('Error getting user ExponentPushTokens:', e), [])
        }
      }
      static async removeDeviceToken(e) {
        try {
          return (
            await o.deviceToken.delete({ where: { token: e } }),
            console.log(`ExponentPushToken removed: ${e}`),
            !0
          )
        } catch (e) {
          return (console.error('Error removing ExponentPushToken:', e), !1)
        }
      }
      static async removeUserToken(e) {
        try {
          return (
            await o.deviceToken.deleteMany({ where: { userId: e } }),
            console.log(`All ExponentPushTokens removed for user: ${e}`),
            !0
          )
        } catch (e) {
          return (console.error('Error removing ExponentPushTokens:', e), !1)
        }
      }
      static async deactivateUserTokens(e) {
        try {
          return (
            await o.deviceToken.updateMany({ where: { userId: e }, data: { isActive: !1 } }),
            console.log(`ExponentPushTokens deactivated for user: ${e}`),
            !0
          )
        } catch (e) {
          return (console.error('Error deactivating ExponentPushTokens:', e), !1)
        }
      }
      static async getTokensByRole(e) {
        try {
          let t = (
            await o.user.findMany({
              where: { role: e, notificationsEnabled: !0 },
              select: { id: !0 },
            })
          ).map((e) => e.id)
          return (
            await o.deviceToken.findMany({
              where: { userId: { in: t }, isActive: !0 },
              select: { token: !0 },
            })
          )
            .filter((e) => r.ExpoNotificationService.isValidExpoPushToken(e.token))
            .map((e) => e.token)
        } catch (e) {
          return (console.error('Error getting ExponentPushTokens by role:', e), [])
        }
      }
      static async updateNotificationPreference(e, t) {
        try {
          return (
            await o.user.update({ where: { id: e }, data: { notificationsEnabled: t } }),
            console.log(`Notification preference updated for user: ${e} to ${t}`),
            !0
          )
        } catch (e) {
          return (console.error('Error updating notification preference:', e), !1)
        }
      }
      static async getAllGroomerTokens() {
        return this.getTokensByRole('GROOMER')
      }
    }
    e.s(['FCMTokenService', () => n])
  },
  102434,
  (e) => {
    'use strict'
    var t = e.i(647373)
    class r {
      static async sendToDevice(e, r) {
        try {
          let o = {
              title: r.title,
              body: r.body,
              data: r.data,
              sound: r.sound,
              badge: r.badge,
              channelId: r.channelId,
            },
            n = await t.ExpoNotificationService.sendToDevice(e, o)
          if (!n.success) return (console.error('Error sending notification:', n.error), !1)
          {
            let e = n.ticket && 'id' in n.ticket ? n.ticket.id : 'unknown'
            return (console.log('Successfully sent notification:', e), !0)
          }
        } catch (e) {
          return (console.error('Error sending notification:', e), !1)
        }
      }
      static async sendToMultipleDevices(e, r) {
        try {
          let o = {
              title: r.title,
              body: r.body,
              data: r.data,
              sound: r.sound,
              badge: r.badge,
              channelId: r.channelId,
            },
            n = await t.ExpoNotificationService.sendToMultipleDevices(e, o)
          return (
            console.log('Successfully sent notifications:', {
              successCount: n.successCount,
              failureCount: n.failureCount,
            }),
            { successCount: n.successCount, failureCount: n.failureCount }
          )
        } catch (t) {
          return (
            console.error('Error sending multicast notification:', t),
            { successCount: 0, failureCount: e.length }
          )
        }
      }
      static async sendToTopic(e, t) {
        return (
          console.warn('Topic notifications are not supported by Expo Push Notifications'),
          !1
        )
      }
      static async subscribeToTopic(e, t) {
        return (
          console.warn('Topic subscriptions are not supported by Expo Push Notifications'),
          !1
        )
      }
      static async unsubscribeFromTopic(e, t) {
        return (
          console.warn('Topic unsubscriptions are not supported by Expo Push Notifications'),
          !1
        )
      }
      static isValidExpoPushToken(e) {
        return t.ExpoNotificationService.isValidExpoPushToken(e)
      }
    }
    e.s(['NotificationService', () => r])
  },
  941896,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      o = e.i(996250),
      n = e.i(759756),
      s = e.i(561916),
      i = e.i(114444),
      a = e.i(837092),
      c = e.i(869741),
      l = e.i(316795),
      u = e.i(487718),
      d = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      f = e.i(570101),
      v = e.i(626937),
      g = e.i(10372),
      k = e.i(193695)
    e.i(52474)
    var E = e.i(600220),
      T = e.i(89171),
      x = e.i(493458),
      y = e.i(102434),
      m = e.i(389579),
      w = e.i(79832),
      R = e.i(469719)
    let b = R.z.object({
      title: R.z.string().min(1),
      message: R.z.string().min(1),
      targetType: R.z.enum(['user', 'role', 'topic']),
      targetIds: R.z.array(R.z.string()).optional(),
      role: R.z.string().optional(),
      topic: R.z.string().optional(),
      data: R.z.record(R.z.string(), R.z.unknown()).optional(),
    })
    async function _(e) {
      try {
        let t,
          r = await w.default.api.getSession({ headers: await (0, x.headers)() })
        if (!r?.user) return T.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if ('ADMIN' !== r.user.role)
          return T.NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        let o = await e.json(),
          {
            title: n,
            message: s,
            targetType: i,
            targetIds: a,
            role: c,
            data: l,
            topic: u,
          } = b.parse(o)
        if (!n || !s)
          return T.NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
        let d = {
            title: n,
            body: s,
            data: l ? Object.fromEntries(Object.entries(l).map(([e, t]) => [e, String(t)])) : {},
          },
          p = 0,
          h = 0
        switch (i) {
          case 'user': {
            if (!a || !Array.isArray(a))
              return T.NextResponse.json(
                { error: 'targetIds array is required for user targeting' },
                { status: 400 }
              )
            let e = []
            for (let t of a) {
              let r = await m.FCMTokenService.getUserTokens(t)
              e.push(...r)
            }
            if (0 === e.length)
              return T.NextResponse.json(
                { error: 'No valid FCM tokens found for target users' },
                { status: 400 }
              )
            ;((p = (t = await y.NotificationService.sendToMultipleDevices(e, d)).successCount),
              (h = t.failureCount))
            break
          }
          case 'role': {
            if (!c)
              return T.NextResponse.json(
                { error: 'Role is required for role-based targeting' },
                { status: 400 }
              )
            let e = await m.FCMTokenService.getTokensByRole(c)
            if (0 === e.length)
              return T.NextResponse.json(
                { error: `No valid FCM tokens found for role: ${c}` },
                { status: 400 }
              )
            ;((p = (t = await y.NotificationService.sendToMultipleDevices(e, d)).successCount),
              (h = t.failureCount))
            break
          }
          case 'topic': {
            if (!u)
              return T.NextResponse.json(
                { error: 'Topic is required for topic-based targeting' },
                { status: 400 }
              )
            let e = await y.NotificationService.sendToTopic(u, d)
            ;((p = +!!e), (h = +!e))
            break
          }
          default:
            return T.NextResponse.json(
              { error: 'Invalid targetType. Use "user", "role", or "topic"' },
              { status: 400 }
            )
        }
        return T.NextResponse.json({
          success: !0,
          successCount: p,
          failureCount: h,
          message: `Notification sent. Success: ${p}, Failed: ${h}`,
        })
      } catch (e) {
        return (
          console.error('Error sending notification:', e),
          T.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['POST', () => _, 'sendNotificationSchema', 0, b], 986670)
    var N = e.i(986670)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/notifications/send/route',
          pathname: '/api/notifications/send',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/notifications/send/route.ts',
        nextConfigOutput: 'standalone',
        userland: N,
      }),
      { workAsyncStorage: P, workUnitAsyncStorage: S, serverHooks: A } = C
    function j() {
      return (0, o.patchFetch)({ workAsyncStorage: P, workUnitAsyncStorage: S })
    }
    async function M(e, t, o) {
      C.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let T = '/api/notifications/send/route'
      T = T.replace(/\/index$/, '') || '/'
      let x = await C.prepare(e, t, { srcPage: T, multiZoneDraftMode: !1 })
      if (!x)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == o.waitUntil || o.waitUntil.call(o, Promise.resolve()),
          null
        )
      let {
          buildId: y,
          params: m,
          nextConfig: w,
          parsedUrl: R,
          isDraftMode: b,
          prerenderManifest: _,
          routerServerContext: N,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: S,
          resolvedPathname: A,
          clientReferenceManifest: j,
          serverActionsManifest: M,
        } = x,
        U = (0, c.normalizeAppPath)(T),
        q = !!(_.dynamicRoutes[U] || _.routes[A]),
        I = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, R, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !b) {
        let e = !!_.routes[A],
          t = _.dynamicRoutes[U]
        if (t && !1 === t.fallback && !e) {
          if (w.experimental.adapterPath) return await I()
          throw new k.NoFallbackError()
        }
      }
      let O = null
      !q || C.isDev || b || (O = '/index' === (O = A) ? '/' : O)
      let D = !0 === C.isDev || !q,
        $ = q && !D
      M &&
        j &&
        (0, i.setReferenceManifestsSingleton)({
          page: T,
          clientReferenceManifest: j,
          serverActionsManifest: M,
          serverModuleMap: (0, a.createServerModuleMap)({ serverActionsManifest: M }),
        })
      let H = e.method || 'GET',
        F = (0, s.getTracer)(),
        z = F.getActiveScopeSpan(),
        V = {
          params: m,
          prerenderManifest: _,
          renderOpts: {
            experimental: { authInterrupts: !!w.experimental.authInterrupts },
            cacheComponents: !!w.cacheComponents,
            supportsDynamicResponse: D,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: w.cacheLife,
            waitUntil: o.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, o) => C.onRequestError(e, t, o, N),
          },
          sharedContext: { buildId: y },
        },
        B = new l.NodeNextRequest(e),
        K = new l.NodeNextResponse(t),
        L = u.NextRequestAdapter.fromNodeNextRequest(B, (0, u.signalFromNodeResponse)(t))
      try {
        let i = async (e) =>
            C.handle(L, V).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = F.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== d.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let o = r.get('next.route')
              if (o) {
                let t = `${H} ${o}`
                ;(e.setAttributes({ 'next.route': o, 'http.route': o, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${H} ${T}`)
            }),
          a = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          c = async (n) => {
            var s, c
            let l = async ({ previousCacheEntry: r }) => {
                try {
                  if (!a && P && S && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await i(n)
                  e.fetchMetrics = V.renderOpts.fetchMetrics
                  let c = V.renderOpts.pendingWaitUntil
                  c && o.waitUntil && (o.waitUntil(c), (c = void 0))
                  let l = V.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(B, K, s, V.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, f.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(l && (t[g.NEXT_CACHE_TAGS_HEADER] = l),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== V.renderOpts.collectedRevalidate &&
                        !(V.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        V.renderOpts.collectedRevalidate,
                      o =
                        void 0 === V.renderOpts.collectedExpire ||
                        V.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : V.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: E.CachedRouteKind.APP_ROUTE,
                        status: s.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: o },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await C.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: T,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: $,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              u = await C.handleResponse({
                req: e,
                nextConfig: w,
                cacheKey: O,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: _,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: S,
                responseGenerator: l,
                waitUntil: o.waitUntil,
                isMinimalMode: a,
              })
            if (!q) return null
            if (
              (null == u || null == (s = u.value) ? void 0 : s.kind) !== E.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == u || null == (c = u.value) ? void 0 : c.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(a ||
              t.setHeader(
                'x-nextjs-cache',
                P ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              b &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, f.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (a && q) || d.delete(g.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, v.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                B,
                K,
                new Response(u.value.body, { headers: d, status: u.value.status || 200 })
              ),
              null
            )
          }
        z
          ? await c(z)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                d.BaseServerSpan.handleRequest,
                {
                  spanName: `${H} ${T}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': H, 'http.target': e.url },
                },
                c
              )
            )
      } catch (t) {
        if (
          (t instanceof k.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: U,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: $,
                isOnDemandRevalidate: P,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(B, K, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => M,
        'patchFetch',
        () => j,
        'routeModule',
        () => C,
        'serverHooks',
        () => A,
        'workAsyncStorage',
        () => P,
        'workUnitAsyncStorage',
        () => S,
      ],
      941896
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

//# sourceMappingURL=%5Broot-of-the-server%5D__120ef803._.js.map
