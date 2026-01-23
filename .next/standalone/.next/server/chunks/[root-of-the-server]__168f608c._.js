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
      static async updateUserToken(e, t, o = 'android', a) {
        try {
          if (!r.ExpoNotificationService.isValidExpoPushToken(t))
            return { success: !1, error: 'Invalid ExponentPushToken format' }
          let s = await n.deviceToken.upsert({
            where: { token: t },
            create: {
              userId: e,
              token: t,
              platform: o,
              deviceId: a,
              isActive: !0,
              lastUsed: new Date(),
            },
            update: { isActive: !0, lastUsed: new Date(), platform: o, deviceId: a },
            select: { id: !0, token: !0, platform: !0, lastUsed: !0 },
          })
          return (
            console.log(`✅ ExponentPushToken saved to DeviceToken table:`),
            console.log(`   User ID: ${e}`),
            console.log(`   Token: ${s.token}`),
            console.log(`   Platform: ${s.platform}`),
            console.log(`   Last Used: ${s.lastUsed}`),
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
  388658,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      o = e.i(759756),
      a = e.i(561916),
      s = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      c = e.i(316795),
      u = e.i(487718),
      d = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      f = e.i(570101),
      v = e.i(626937),
      E = e.i(10372),
      k = e.i(193695)
    e.i(52474)
    var m = e.i(600220),
      x = e.i(89171),
      g = e.i(493458),
      w = e.i(389579),
      R = e.i(79832),
      T = e.i(469719)
    let y = T.z.object({ enabled: T.z.boolean() })
    async function _(e) {
      try {
        let t = await R.default.api.getSession({ headers: await (0, g.headers)() })
        if (!t?.user?.id) return x.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let r = await e.json(),
          { enabled: n } = y.parse(r)
        if (await w.FCMTokenService.updateNotificationPreference(t.user.id, n))
          return x.NextResponse.json({
            success: !0,
            message: `Notifications ${n ? 'enabled' : 'disabled'} successfully`,
          })
        return x.NextResponse.json(
          { error: 'Failed to update notification preferences' },
          { status: 500 }
        )
      } catch (e) {
        return (
          console.error('Error updating notification preferences:', e),
          x.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['PUT', () => _, 'updatePreferencesSchema', 0, y], 650256)
    var P = e.i(650256)
    let b = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/notifications/preferences/route',
          pathname: '/api/notifications/preferences',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/notifications/preferences/route.ts',
        nextConfigOutput: 'standalone',
        userland: P,
      }),
      { workAsyncStorage: C, workUnitAsyncStorage: A, serverHooks: N } = b
    function U() {
      return (0, n.patchFetch)({ workAsyncStorage: C, workUnitAsyncStorage: A })
    }
    async function S(e, t, n) {
      b.isDev && (0, o.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let x = '/api/notifications/preferences/route'
      x = x.replace(/\/index$/, '') || '/'
      let g = await b.prepare(e, t, { srcPage: x, multiZoneDraftMode: !1 })
      if (!g)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: R,
          nextConfig: T,
          parsedUrl: y,
          isDraftMode: _,
          prerenderManifest: P,
          routerServerContext: C,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: N,
          resolvedPathname: U,
          clientReferenceManifest: S,
          serverActionsManifest: M,
        } = g,
        j = (0, l.normalizeAppPath)(x),
        q = !!(P.dynamicRoutes[j] || P.routes[U]),
        O = async () => (
          (null == C ? void 0 : C.render404)
            ? await C.render404(e, t, y, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !_) {
        let e = !!P.routes[U],
          t = P.dynamicRoutes[j]
        if (t && !1 === t.fallback && !e) {
          if (T.experimental.adapterPath) return await O()
          throw new k.NoFallbackError()
        }
      }
      let I = null
      !q || b.isDev || _ || (I = '/index' === (I = U) ? '/' : I)
      let $ = !0 === b.isDev || !q,
        D = q && !$
      M &&
        S &&
        (0, s.setReferenceManifestsSingleton)({
          page: x,
          clientReferenceManifest: S,
          serverActionsManifest: M,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: M }),
        })
      let H = e.method || 'GET',
        F = (0, a.getTracer)(),
        V = F.getActiveScopeSpan(),
        K = {
          params: R,
          prerenderManifest: P,
          renderOpts: {
            experimental: { authInterrupts: !!T.experimental.authInterrupts },
            cacheComponents: !!T.cacheComponents,
            supportsDynamicResponse: $,
            incrementalCache: (0, o.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: T.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => b.onRequestError(e, t, n, C),
          },
          sharedContext: { buildId: w },
        },
        B = new c.NodeNextRequest(e),
        z = new c.NodeNextResponse(t),
        L = u.NextRequestAdapter.fromNodeNextRequest(B, (0, u.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            b.handle(L, K).finally(() => {
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
              } else e.updateName(`${H} ${x}`)
            }),
          i = !!(0, o.getRequestMeta)(e, 'minimalMode'),
          l = async (o) => {
            var a, l
            let c = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && A && N && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let a = await s(o)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let c = K.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(B, z, a, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await a.blob(),
                      t = (0, f.toNodeOutgoingHttpHeaders)(a.headers)
                    ;(c && (t[E.NEXT_CACHE_TAGS_HEADER] = c),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= E.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      n =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= E.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: m.CachedRouteKind.APP_ROUTE,
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
                      (await b.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: x,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        C
                      )),
                    t
                  )
                }
              },
              u = await b.handleResponse({
                req: e,
                nextConfig: T,
                cacheKey: I,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: N,
                responseGenerator: c,
                waitUntil: n.waitUntil,
                isMinimalMode: i,
              })
            if (!q) return null
            if (
              (null == u || null == (a = u.value) ? void 0 : a.kind) !== m.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == u || null == (l = u.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(i ||
              t.setHeader(
                'x-nextjs-cache',
                A ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              _ &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, f.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && q) || d.delete(E.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, v.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                B,
                z,
                new Response(u.value.body, { headers: d, status: u.value.status || 200 })
              ),
              null
            )
          }
        V
          ? await l(V)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                d.BaseServerSpan.handleRequest,
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
          (t instanceof k.NoFallbackError ||
            (await b.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: j,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: A,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(B, z, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => S,
        'patchFetch',
        () => U,
        'routeModule',
        () => b,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => C,
        'workUnitAsyncStorage',
        () => A,
      ],
      388658
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

//# sourceMappingURL=%5Broot-of-the-server%5D__168f608c._.js.map
