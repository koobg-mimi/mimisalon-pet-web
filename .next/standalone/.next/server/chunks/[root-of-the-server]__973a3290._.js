module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  763040,
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
      m = e.i(626937),
      R = e.i(10372),
      _ = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      E = e.i(89171),
      g = e.i(493458),
      w = e.i(79832),
      x = e.i(657446)
    async function C() {
      try {
        let e = await w.default.api.getSession({ headers: await (0, g.headers)() })
        if (!e || e.user?.role !== 'ADMIN')
          return E.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let t = (
          await x.prisma.groomerWorkArea.findMany({
            select: { id: !0, name: !0, address: !0, description: !0 },
            where: { isActive: !0 },
            orderBy: { name: 'asc' },
          })
        ).reduce(
          (e, t) => (
            e.find((e) => e.name === t.name) ||
              e.push({ id: t.id, name: t.name, address: t.description || t.address || '' }),
            e
          ),
          []
        )
        return E.NextResponse.json(t)
      } catch (e) {
        return (
          console.error('Error fetching locations:', e),
          E.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => C], 522304)
    var b = e.i(522304)
    let y = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/locations/route',
          pathname: '/api/admin/locations',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/locations/route.ts',
        nextConfigOutput: 'standalone',
        userland: b,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: P, serverHooks: N } = y
    function k() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: P })
    }
    async function T(e, t, a) {
      y.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let E = '/api/admin/locations/route'
      E = E.replace(/\/index$/, '') || '/'
      let g = await y.prepare(e, t, { srcPage: E, multiZoneDraftMode: !1 })
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
          isDraftMode: A,
          prerenderManifest: P,
          routerServerContext: N,
          isOnDemandRevalidate: k,
          revalidateOnlyGenerated: T,
          resolvedPathname: j,
          clientReferenceManifest: O,
          serverActionsManifest: S,
        } = g,
        M = (0, l.normalizeAppPath)(E),
        q = !!(P.dynamicRoutes[M] || P.routes[j]),
        H = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, b, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !A) {
        let e = !!P.routes[j],
          t = P.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await H()
          throw new _.NoFallbackError()
        }
      }
      let I = null
      !q || y.isDev || A || (I = '/index' === (I = j) ? '/' : I)
      let U = !0 === y.isDev || !q,
        D = q && !U
      S &&
        O &&
        (0, o.setReferenceManifestsSingleton)({
          page: E,
          clientReferenceManifest: O,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let $ = e.method || 'GET',
        F = (0, s.getTracer)(),
        K = F.getActiveScopeSpan(),
        B = {
          params: x,
          prerenderManifest: P,
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
            onInstrumentationRequestError: (t, r, a) => y.onRequestError(e, t, a, N),
          },
          sharedContext: { buildId: w },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
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
              } else e.updateName(`${$} ${E}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && k && T && !r)
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
                  let d = B.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(L, G, s, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, v.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[R.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== B.renderOpts.collectedRevalidate &&
                        !(B.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        B.renderOpts.collectedRevalidate,
                      a =
                        void 0 === B.renderOpts.collectedExpire ||
                        B.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : B.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: f.CachedRouteKind.APP_ROUTE,
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
                          routePath: E,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: k,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              u = await y.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: I,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: k,
                revalidateOnlyGenerated: T,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!q) return null
            if (
              (null == u || null == (s = u.value) ? void 0 : s.kind) !== f.CachedRouteKind.APP_ROUTE
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
                k ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && q) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, m.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                L,
                G,
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
                  spanName: `${$} ${E}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof _.NoFallbackError ||
            (await y.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: k,
              }),
            })),
          q)
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
        () => k,
        'routeModule',
        () => y,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => P,
      ],
      763040
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
          'server/chunks/[root-of-the-server]__aea4da49._.js',
          'server/chunks/_46980750._.js',
          'server/chunks/node_modules_mime-db_db_json_a85ad9f0._.js',
          'server/chunks/node_modules_0f478c9c._.js',
        ].map((t) => e.l(t))
      ).then(() => t(315159))
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__973a3290._.js.map
