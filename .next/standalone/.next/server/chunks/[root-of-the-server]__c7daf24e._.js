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
  292339,
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
      w = e.i(89171),
      E = e.i(493458),
      g = e.i(79832),
      x = e.i(398163)
    async function C() {
      try {
        let e = await g.default.api.getSession({ headers: await (0, E.headers)() })
        if (!e?.user || 'ADMIN' !== e.user.role)
          return w.NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
        let t = await x.workerApiClient.getNotificationQueueStatus()
        return w.NextResponse.json({
          success: !0,
          timestamp: new Date().toISOString(),
          queue: { ...t, healthCheck: t.counts.total < 1e4 ? 'healthy' : 'warning' },
        })
      } catch (e) {
        return (
          console.error('Queue status error:', e),
          w.NextResponse.json({ error: '큐 상태 조회 중 오류가 발생했습니다' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => C], 49968)
    var b = e.i(49968)
    let y = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/queue/status/route',
          pathname: '/api/queue/status',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/queue/status/route.ts',
        nextConfigOutput: 'standalone',
        userland: b,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: N, serverHooks: P } = y
    function T() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: N })
    }
    async function k(e, t, a) {
      y.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/queue/status/route'
      w = w.replace(/\/index$/, '') || '/'
      let E = await y.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: g,
          params: x,
          nextConfig: C,
          parsedUrl: b,
          isDraftMode: A,
          prerenderManifest: N,
          routerServerContext: P,
          isOnDemandRevalidate: T,
          revalidateOnlyGenerated: k,
          resolvedPathname: q,
          clientReferenceManifest: S,
          serverActionsManifest: O,
        } = E,
        j = (0, l.normalizeAppPath)(w),
        H = !!(N.dynamicRoutes[j] || N.routes[q]),
        I = async () => (
          (null == P ? void 0 : P.render404)
            ? await P.render404(e, t, b, !1)
            : t.end('This page could not be found'),
          null
        )
      if (H && !A) {
        let e = !!N.routes[q],
          t = N.dynamicRoutes[j]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await I()
          throw new m.NoFallbackError()
        }
      }
      let M = null
      !H || y.isDev || A || (M = '/index' === (M = q) ? '/' : M)
      let U = !0 === y.isDev || !H,
        D = H && !U
      O &&
        S &&
        (0, o.setReferenceManifestsSingleton)({
          page: w,
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
            onInstrumentationRequestError: (t, r, a) => y.onRequestError(e, t, a, P),
          },
          sharedContext: { buildId: g },
        },
        L = new u.NodeNextRequest(e),
        G = new u.NodeNextResponse(t),
        V = d.NextRequestAdapter.fromNodeNextRequest(L, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            y.handle(V, B).finally(() => {
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
              } else e.updateName(`${$} ${w}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && T && k && !r)
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
                  if (!H)
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
                      (await y.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: T,
                          }),
                        },
                        P
                      )),
                    t
                  )
                }
              },
              d = await y.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: N,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: T,
                revalidateOnlyGenerated: k,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!H) return null
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
                T ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && H) || c.delete(f.NEXT_CACHE_TAGS_HEADER),
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
                  spanName: `${$} ${w}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof m.NoFallbackError ||
            (await y.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: j,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: T,
              }),
            })),
          H)
        )
          throw t
        return (await (0, h.sendResponse)(L, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => k,
        'patchFetch',
        () => T,
        'routeModule',
        () => y,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => N,
      ],
      292339
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c7daf24e._.js.map
