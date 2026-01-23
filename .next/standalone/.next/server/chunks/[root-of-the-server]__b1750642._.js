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
  216789,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      n = e.i(759756),
      s = e.i(561916),
      o = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      v = e.i(570101),
      f = e.i(626937),
      m = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      x = e.i(89171),
      E = e.i(493458),
      k = e.i(79832),
      g = e.i(657446),
      w = e.i(647373)
    async function b() {
      try {
        let e = await k.default.api.getSession({ headers: await (0, E.headers)() })
        if (!e?.user?.id) return x.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let t = await g.prisma.user.findUnique({
          where: { id: e.user.id },
          select: {
            id: !0,
            email: !0,
            notificationsEnabled: !0,
            deviceTokens: {
              where: { isActive: !0 },
              select: {
                id: !0,
                token: !0,
                platform: !0,
                deviceId: !0,
                lastUsed: !0,
                createdAt: !0,
              },
            },
          },
        })
        if (!t) return x.NextResponse.json({ error: 'User not found' }, { status: 404 })
        let r = t.deviceTokens.filter((e) =>
            w.ExpoNotificationService.isValidExpoPushToken(e.token)
          ),
          a = {
            userId: t.id,
            userEmail: t.email,
            hasToken: t.deviceTokens.length > 0,
            deviceCount: t.deviceTokens.length,
            validTokenCount: r.length,
            devices: t.deviceTokens.map((e) => ({
              id: e.id,
              token: e.token,
              platform: e.platform,
              deviceId: e.deviceId,
              lastUsed: e.lastUsed,
              createdAt: e.createdAt,
              isValid: w.ExpoNotificationService.isValidExpoPushToken(e.token),
            })),
            notificationsEnabled: t.notificationsEnabled,
          }
        return (
          console.log('📊 User token status:', a),
          x.NextResponse.json({ success: !0, data: a })
        )
      } catch (e) {
        return (
          console.error('Error getting token status:', e),
          x.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => b], 917167)
    var C = e.i(917167)
    let T = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/notifications/token/status/route',
          pathname: '/api/notifications/token/status',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/notifications/token/status/route.ts',
        nextConfigOutput: 'standalone',
        userland: C,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: y, serverHooks: P } = T
    function N() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: y })
    }
    async function j(e, t, a) {
      T.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let x = '/api/notifications/token/status/route'
      x = x.replace(/\/index$/, '') || '/'
      let E = await T.prepare(e, t, { srcPage: x, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: k,
          params: g,
          nextConfig: w,
          parsedUrl: b,
          isDraftMode: C,
          prerenderManifest: A,
          routerServerContext: y,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: N,
          resolvedPathname: j,
          clientReferenceManifest: q,
          serverActionsManifest: S,
        } = E,
        U = (0, l.normalizeAppPath)(x),
        O = !!(A.dynamicRoutes[U] || A.routes[j]),
        I = async () => (
          (null == y ? void 0 : y.render404)
            ? await y.render404(e, t, b, !1)
            : t.end('This page could not be found'),
          null
        )
      if (O && !C) {
        let e = !!A.routes[j],
          t = A.dynamicRoutes[U]
        if (t && !1 === t.fallback && !e) {
          if (w.experimental.adapterPath) return await I()
          throw new R.NoFallbackError()
        }
      }
      let H = null
      !O || T.isDev || C || (H = '/index' === (H = j) ? '/' : H)
      let M = !0 === T.isDev || !O,
        D = O && !M
      S &&
        q &&
        (0, o.setReferenceManifestsSingleton)({
          page: x,
          clientReferenceManifest: q,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let $ = e.method || 'GET',
        F = (0, s.getTracer)(),
        K = F.getActiveScopeSpan(),
        V = {
          params: g,
          prerenderManifest: A,
          renderOpts: {
            experimental: { authInterrupts: !!w.experimental.authInterrupts },
            cacheComponents: !!w.cacheComponents,
            supportsDynamicResponse: M,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: w.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => T.onRequestError(e, t, a, y),
          },
          sharedContext: { buildId: k },
        },
        B = new d.NodeNextRequest(e),
        L = new d.NodeNextResponse(t),
        z = u.NextRequestAdapter.fromNodeNextRequest(B, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            T.handle(z, V).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = F.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = r.get('next.route')
              if (a) {
                let t = `${$} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${$} ${x}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && N && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = V.renderOpts.fetchMetrics
                  let l = V.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = V.renderOpts.collectedTags
                  if (!O)
                    return (await (0, h.sendResponse)(B, L, s, V.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, v.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[m.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== V.renderOpts.collectedRevalidate &&
                        !(V.renderOpts.collectedRevalidate >= m.INFINITE_CACHE) &&
                        V.renderOpts.collectedRevalidate,
                      a =
                        void 0 === V.renderOpts.collectedExpire ||
                        V.renderOpts.collectedExpire >= m.INFINITE_CACHE
                          ? void 0
                          : V.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: _.CachedRouteKind.APP_ROUTE,
                        status: s.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: a },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await T.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: x,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        y
                      )),
                    t
                  )
                }
              },
              u = await T.handleResponse({
                req: e,
                nextConfig: w,
                cacheKey: H,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: A,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: N,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!O) return null
            if (
              (null == u || null == (s = u.value) ? void 0 : s.kind) !== _.CachedRouteKind.APP_ROUTE
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
                P ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              C &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && O) || c.delete(m.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                B,
                L,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        K
          ? await l(K)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${$} ${x}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await T.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: U,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: P,
              }),
            })),
          O)
        )
          throw t
        return (await (0, h.sendResponse)(B, L, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => j,
        'patchFetch',
        () => N,
        'routeModule',
        () => T,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => y,
      ],
      216789
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b1750642._.js.map
