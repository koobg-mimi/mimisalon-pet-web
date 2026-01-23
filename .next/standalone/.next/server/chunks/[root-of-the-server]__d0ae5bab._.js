module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  224361,
  (e, t, r) => {
    t.exports = e.x('util', () => require('util'))
  },
  814747,
  (e, t, r) => {
    t.exports = e.x('path', () => require('path'))
  },
  388637,
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
      u = e.i(316795),
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      v = e.i(570101),
      R = e.i(626937),
      f = e.i(10372),
      m = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      E = e.i(89171),
      g = e.i(493458),
      w = e.i(79832),
      x = e.i(398163)
    async function C() {
      try {
        let e = await w.default.api.getSession({ headers: await (0, g.headers)() })
        if (!e?.user || 'ADMIN' !== e.user.role)
          return E.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let t = await x.workerApiClient.getNotificationQueueStatus()
        return E.NextResponse.json({
          status: t,
          queueName: 'notification',
          timestamp: new Date().toISOString(),
          note: 'Recent jobs listing requires Worker API enhancement - add /api/jobs/notification/list endpoint',
        })
      } catch (e) {
        return (
          console.error('Queue status error:', e),
          E.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => C], 155567)
    var b = e.i(155567)
    let A = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/notifications/queue-status/route',
          pathname: '/api/admin/notifications/queue-status',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/notifications/queue-status/route.ts',
        nextConfigOutput: 'standalone',
        userland: b,
      }),
      { workAsyncStorage: y, workUnitAsyncStorage: N, serverHooks: P } = A
    function q() {
      return (0, a.patchFetch)({ workAsyncStorage: y, workUnitAsyncStorage: N })
    }
    async function T(e, t, a) {
      A.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let E = '/api/admin/notifications/queue-status/route'
      E = E.replace(/\/index$/, '') || '/'
      let g = await A.prepare(e, t, { srcPage: E, multiZoneDraftMode: !1 })
      if (!g)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: x,
          nextConfig: C,
          parsedUrl: b,
          isDraftMode: y,
          prerenderManifest: N,
          routerServerContext: P,
          isOnDemandRevalidate: q,
          revalidateOnlyGenerated: T,
          resolvedPathname: k,
          clientReferenceManifest: S,
          serverActionsManifest: O,
        } = g,
        j = (0, l.normalizeAppPath)(E),
        I = !!(N.dynamicRoutes[j] || N.routes[k]),
        H = async () => (
          (null == P ? void 0 : P.render404)
            ? await P.render404(e, t, b, !1)
            : t.end('This page could not be found'),
          null
        )
      if (I && !y) {
        let e = !!N.routes[k],
          t = N.dynamicRoutes[j]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await H()
          throw new m.NoFallbackError()
        }
      }
      let M = null
      !I || A.isDev || y || (M = '/index' === (M = k) ? '/' : M)
      let U = !0 === A.isDev || !I,
        D = I && !U
      O &&
        S &&
        (0, o.setReferenceManifestsSingleton)({
          page: E,
          clientReferenceManifest: S,
          serverActionsManifest: O,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: O }),
        })
      let $ = e.method || 'GET',
        F = (0, s.getTracer)(),
        K = F.getActiveScopeSpan(),
        B = {
          params: x,
          prerenderManifest: N,
          renderOpts: {
            experimental: { authInterrupts: !!C.experimental.authInterrupts },
            cacheComponents: !!C.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: C.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => A.onRequestError(e, t, a, P),
          },
          sharedContext: { buildId: w },
        },
        L = new u.NodeNextRequest(e),
        G = new u.NodeNextResponse(t),
        V = d.NextRequestAdapter.fromNodeNextRequest(L, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            A.handle(V, B).finally(() => {
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
              } else e.updateName(`${$} ${E}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && q && T && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = B.renderOpts.fetchMetrics
                  let l = B.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = B.renderOpts.collectedTags
                  if (!I)
                    return (await (0, h.sendResponse)(L, G, s, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, v.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[f.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== B.renderOpts.collectedRevalidate &&
                        !(B.renderOpts.collectedRevalidate >= f.INFINITE_CACHE) &&
                        B.renderOpts.collectedRevalidate,
                      a =
                        void 0 === B.renderOpts.collectedExpire ||
                        B.renderOpts.collectedExpire >= f.INFINITE_CACHE
                          ? void 0
                          : B.renderOpts.collectedExpire
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
                      (await A.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: E,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: q,
                          }),
                        },
                        P
                      )),
                    t
                  )
                }
              },
              d = await A.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: N,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: q,
                revalidateOnlyGenerated: T,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!I) return null
            if (
              (null == d || null == (s = d.value) ? void 0 : s.kind) !== _.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == d || null == (l = d.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(i ||
              t.setHeader(
                'x-nextjs-cache',
                q ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              y &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && I) || c.delete(f.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, R.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                L,
                G,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
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
                  spanName: `${$} ${E}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof m.NoFallbackError ||
            (await A.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: j,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: q,
              }),
            })),
          I)
        )
          throw t
        return (await (0, h.sendResponse)(L, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => T,
        'patchFetch',
        () => q,
        'routeModule',
        () => A,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => y,
        'workUnitAsyncStorage',
        () => N,
      ],
      388637
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
        ['server/chunks/[root-of-the-server]__77683f7c._.js', 'server/chunks/_46980750._.js'].map(
          (t) => e.l(t)
        )
      ).then(() => t(315159))
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__d0ae5bab._.js.map
