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
    let n = new t.PrismaClient()
    class o {
      static isValidExpoPushToken(e) {
        return r.ExpoNotificationService.isValidExpoPushToken(e)
      }
      static async updateUserToken(e, t, o = 'android', s) {
        try {
          if (!r.ExpoNotificationService.isValidExpoPushToken(t))
            return { success: !1, error: 'Invalid ExponentPushToken format' }
          let a = await n.deviceToken.upsert({
            where: { token: t },
            create: {
              userId: e,
              token: t,
              platform: o,
              deviceId: s,
              isActive: !0,
              lastUsed: new Date(),
            },
            update: { isActive: !0, lastUsed: new Date(), platform: o, deviceId: s },
            select: { id: !0, token: !0, platform: !0, lastUsed: !0 },
          })
          return (
            console.log(`✅ ExponentPushToken saved to DeviceToken table:`),
            console.log(`   User ID: ${e}`),
            console.log(`   Token: ${a.token}`),
            console.log(`   Platform: ${a.platform}`),
            console.log(`   Last Used: ${a.lastUsed}`),
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
          let t = await n.user.findUnique({
            where: { id: e },
            select: { notificationsEnabled: !0 },
          })
          if (!t || !t.notificationsEnabled) return []
          return (
            await n.deviceToken.findMany({
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
            await n.user.findMany({
              where: { id: { in: e }, notificationsEnabled: !0 },
              select: { id: !0 },
            })
          ).map((e) => e.id)
          return (
            await n.deviceToken.findMany({
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
            await n.deviceToken.delete({ where: { token: e } }),
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
            await n.deviceToken.deleteMany({ where: { userId: e } }),
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
            await n.deviceToken.updateMany({ where: { userId: e }, data: { isActive: !1 } }),
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
            await n.user.findMany({
              where: { role: e, notificationsEnabled: !0 },
              select: { id: !0 },
            })
          ).map((e) => e.id)
          return (
            await n.deviceToken.findMany({
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
            await n.user.update({ where: { id: e }, data: { notificationsEnabled: t } }),
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
    e.s(['FCMTokenService', () => o])
  },
  885888,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      o = e.i(759756),
      s = e.i(561916),
      a = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      u = e.i(316795),
      c = e.i(487718),
      d = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      v = e.i(570101),
      f = e.i(626937),
      k = e.i(10372),
      E = e.i(193695)
    e.i(52474)
    var x = e.i(600220),
      m = e.i(89171),
      T = e.i(389579),
      g = e.i(79832),
      w = e.i(493458),
      R = e.i(469719)
    let y = R.z.object({
      token: R.z.string().min(1, 'ExponentPushToken is required'),
      platform: R.z.enum(['ios', 'android', 'web']).optional(),
      deviceId: R.z.string().optional(),
    })
    async function _(e) {
      try {
        let t = await g.default.api.getSession({ headers: await (0, w.headers)() })
        if (!t?.user?.id) return m.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let r = await e.json(),
          { token: n, platform: o, deviceId: s } = y.parse(r)
        console.log(`💾 Saving ExponentPushToken for user ${t.user.id} to DeviceToken table:`, {
          token: n,
          platform: o,
          deviceId: s,
        })
        let a = await T.FCMTokenService.updateUserToken(t.user.id, n, o || 'android', s)
        if (a.success)
          return (
            console.log(
              `✅ ExponentPushToken successfully saved to database for user ${t.user.id}`
            ),
            m.NextResponse.json({ success: !0, message: 'ExponentPushToken updated successfully' })
          )
        return (
          console.error(`❌ Failed to save ExponentPushToken for user ${t.user.id}:`, a.error),
          m.NextResponse.json(
            { error: a.error || 'Failed to update ExponentPushToken' },
            { status: a.error?.includes('Invalid') ? 400 : 500 }
          )
        )
      } catch (e) {
        return (
          console.error('Error updating ExponentPushToken:', e),
          m.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    async function P() {
      try {
        let e = await g.default.api.getSession({ headers: await (0, w.headers)() })
        if (!e?.user?.id) return m.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (await T.FCMTokenService.removeUserToken(e.user.id))
          return m.NextResponse.json({
            success: !0,
            message: 'ExponentPushToken removed successfully',
          })
        return m.NextResponse.json({ error: 'Failed to remove ExponentPushToken' }, { status: 500 })
      } catch (e) {
        return (
          console.error('Error removing ExponentPushToken:', e),
          m.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['DELETE', () => P, 'POST', () => _, 'updateTokenSchema', 0, y], 33054)
    var b = e.i(33054)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/notifications/token/route',
          pathname: '/api/notifications/token',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/notifications/token/route.ts',
        nextConfigOutput: 'standalone',
        userland: b,
      }),
      { workAsyncStorage: N, workUnitAsyncStorage: A, serverHooks: U } = C
    function S() {
      return (0, n.patchFetch)({ workAsyncStorage: N, workUnitAsyncStorage: A })
    }
    async function j(e, t, n) {
      C.isDev && (0, o.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let m = '/api/notifications/token/route'
      m = m.replace(/\/index$/, '') || '/'
      let T = await C.prepare(e, t, { srcPage: m, multiZoneDraftMode: !1 })
      if (!T)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: g,
          params: w,
          nextConfig: R,
          parsedUrl: y,
          isDraftMode: _,
          prerenderManifest: P,
          routerServerContext: b,
          isOnDemandRevalidate: N,
          revalidateOnlyGenerated: A,
          resolvedPathname: U,
          clientReferenceManifest: S,
          serverActionsManifest: j,
        } = T,
        M = (0, l.normalizeAppPath)(m),
        q = !!(P.dynamicRoutes[M] || P.routes[U]),
        O = async () => (
          (null == b ? void 0 : b.render404)
            ? await b.render404(e, t, y, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !_) {
        let e = !!P.routes[U],
          t = P.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (R.experimental.adapterPath) return await O()
          throw new E.NoFallbackError()
        }
      }
      let I = null
      !q || C.isDev || _ || (I = '/index' === (I = U) ? '/' : I)
      let $ = !0 === C.isDev || !q,
        D = q && !$
      j &&
        S &&
        (0, a.setReferenceManifestsSingleton)({
          page: m,
          clientReferenceManifest: S,
          serverActionsManifest: j,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: j }),
        })
      let H = e.method || 'GET',
        F = (0, s.getTracer)(),
        z = F.getActiveScopeSpan(),
        V = {
          params: w,
          prerenderManifest: P,
          renderOpts: {
            experimental: { authInterrupts: !!R.experimental.authInterrupts },
            cacheComponents: !!R.cacheComponents,
            supportsDynamicResponse: $,
            incrementalCache: (0, o.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: R.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => C.onRequestError(e, t, n, b),
          },
          sharedContext: { buildId: g },
        },
        K = new u.NodeNextRequest(e),
        B = new u.NodeNextResponse(t),
        L = c.NextRequestAdapter.fromNodeNextRequest(K, (0, c.signalFromNodeResponse)(t))
      try {
        let a = async (e) =>
            C.handle(L, V).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = F.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== d.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = r.get('next.route')
              if (n) {
                let t = `${H} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${H} ${m}`)
            }),
          i = !!(0, o.getRequestMeta)(e, 'minimalMode'),
          l = async (o) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && N && A && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await a(o)
                  e.fetchMetrics = V.renderOpts.fetchMetrics
                  let l = V.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let u = V.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(K, B, s, V.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, v.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[k.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== V.renderOpts.collectedRevalidate &&
                        !(V.renderOpts.collectedRevalidate >= k.INFINITE_CACHE) &&
                        V.renderOpts.collectedRevalidate,
                      n =
                        void 0 === V.renderOpts.collectedExpire ||
                        V.renderOpts.collectedExpire >= k.INFINITE_CACHE
                          ? void 0
                          : V.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: x.CachedRouteKind.APP_ROUTE,
                        status: s.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: n },
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
                          routePath: m,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: N,
                          }),
                        },
                        b
                      )),
                    t
                  )
                }
              },
              c = await C.handleResponse({
                req: e,
                nextConfig: R,
                cacheKey: I,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: N,
                revalidateOnlyGenerated: A,
                responseGenerator: u,
                waitUntil: n.waitUntil,
                isMinimalMode: i,
              })
            if (!q) return null
            if (
              (null == c || null == (s = c.value) ? void 0 : s.kind) !== x.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == c || null == (l = c.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(i ||
              t.setHeader(
                'x-nextjs-cache',
                N ? 'REVALIDATED' : c.isMiss ? 'MISS' : c.isStale ? 'STALE' : 'HIT'
              ),
              _ &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, v.fromNodeOutgoingHttpHeaders)(c.value.headers)
            return (
              (i && q) || d.delete(k.NEXT_CACHE_TAGS_HEADER),
              !c.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, f.getCacheControlHeader)(c.cacheControl)),
              await (0, h.sendResponse)(
                K,
                B,
                new Response(c.value.body, { headers: d, status: c.value.status || 200 })
              ),
              null
            )
          }
        z
          ? await l(z)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                d.BaseServerSpan.handleRequest,
                {
                  spanName: `${H} ${m}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': H, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof E.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: N,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(K, B, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => j,
        'patchFetch',
        () => S,
        'routeModule',
        () => C,
        'serverHooks',
        () => U,
        'workAsyncStorage',
        () => N,
        'workUnitAsyncStorage',
        () => A,
      ],
      885888
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

//# sourceMappingURL=%5Broot-of-the-server%5D__548a1ea7._.js.map
