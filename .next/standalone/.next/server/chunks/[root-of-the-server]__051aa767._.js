module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  866129,
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
      m = e.i(570101),
      v = e.i(626937),
      R = e.i(10372),
      _ = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      g = e.i(89171),
      E = e.i(493458),
      A = e.i(79832),
      w = e.i(657446)
    async function b(e) {
      try {
        let t = await A.default.api.getSession({ headers: await (0, E.headers)() })
        if (!t || t.user?.role !== 'ADMIN')
          return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { searchParams: r } = new URL(e.url),
          a = parseInt(r.get('page') || '1', 10),
          n = parseInt(r.get('limit') || '20', 10),
          s = r.get('search') || '',
          o = r.get('role') || 'ALL',
          i = r.get('status') || 'ALL',
          l = {}
        ;(s &&
          (l.OR = [
            { name: { contains: s, mode: 'insensitive' } },
            { email: { contains: s, mode: 'insensitive' } },
            { phoneNumber: { contains: s, mode: 'insensitive' } },
          ]),
          o && 'ALL' !== o && (l.role = o),
          i && 'ALL' !== i && 'GROOMER' === o && (l.groomerProfile = { isActive: 'ACTIVE' === i }))
        let [d, u] = await Promise.all([
            w.prisma.user.findMany({
              where: l,
              skip: (a - 1) * n,
              take: n,
              orderBy: { createdAt: 'desc' },
              select: {
                id: !0,
                name: !0,
                email: !0,
                phoneNumber: !0,
                role: !0,
                createdAt: !0,
                updatedAt: !0,
                groomerProfile: { select: { isActive: !0 } },
                workAreas: {
                  select: {
                    id: !0,
                    name: !0,
                    address: !0,
                    centerLat: !0,
                    centerLng: !0,
                    radiusKm: !0,
                    isActive: !0,
                  },
                },
                _count: { select: { bookings: !0, groomerBookings: !0 } },
              },
            }),
            w.prisma.user.count({ where: l }),
          ]),
          c = Math.ceil(u / n)
        return g.NextResponse.json({ users: d, totalCount: u, totalPages: c, currentPage: a })
      } catch (e) {
        return (
          console.error('Error fetching users:', e),
          g.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => b], 709814)
    var x = e.i(709814)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/users/route',
          pathname: '/api/admin/users',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/users/route.ts',
        nextConfigOutput: 'standalone',
        userland: x,
      }),
      { workAsyncStorage: y, workUnitAsyncStorage: P, serverHooks: k } = C
    function N() {
      return (0, a.patchFetch)({ workAsyncStorage: y, workUnitAsyncStorage: P })
    }
    async function T(e, t, a) {
      C.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let g = '/api/admin/users/route'
      g = g.replace(/\/index$/, '') || '/'
      let E = await C.prepare(e, t, { srcPage: g, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: A,
          params: w,
          nextConfig: b,
          parsedUrl: x,
          isDraftMode: y,
          prerenderManifest: P,
          routerServerContext: k,
          isOnDemandRevalidate: N,
          revalidateOnlyGenerated: T,
          resolvedPathname: O,
          clientReferenceManifest: j,
          serverActionsManifest: S,
        } = E,
        I = (0, l.normalizeAppPath)(g),
        M = !!(P.dynamicRoutes[I] || P.routes[O]),
        U = async () => (
          (null == k ? void 0 : k.render404)
            ? await k.render404(e, t, x, !1)
            : t.end('This page could not be found'),
          null
        )
      if (M && !y) {
        let e = !!P.routes[O],
          t = P.dynamicRoutes[I]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await U()
          throw new _.NoFallbackError()
        }
      }
      let q = null
      !M || C.isDev || y || (q = '/index' === (q = O) ? '/' : q)
      let H = !0 === C.isDev || !M,
        L = M && !H
      S &&
        j &&
        (0, o.setReferenceManifestsSingleton)({
          page: g,
          clientReferenceManifest: j,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let D = e.method || 'GET',
        K = (0, s.getTracer)(),
        $ = K.getActiveScopeSpan(),
        F = {
          params: w,
          prerenderManifest: P,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => C.onRequestError(e, t, a, k),
          },
          sharedContext: { buildId: A },
        },
        B = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(B, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            C.handle(V, F).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = K.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = r.get('next.route')
              if (a) {
                let t = `${D} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${D} ${g}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && N && T && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = F.renderOpts.fetchMetrics
                  let l = F.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = F.renderOpts.collectedTags
                  if (!M)
                    return (await (0, h.sendResponse)(B, G, s, F.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[R.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== F.renderOpts.collectedRevalidate &&
                        !(F.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        F.renderOpts.collectedRevalidate,
                      a =
                        void 0 === F.renderOpts.collectedExpire ||
                        F.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : F.renderOpts.collectedExpire
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
                      (await C.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: g,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: L,
                            isOnDemandRevalidate: N,
                          }),
                        },
                        k
                      )),
                    t
                  )
                }
              },
              u = await C.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: N,
                revalidateOnlyGenerated: T,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!M) return null
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
                N ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              y &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && M) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                B,
                G,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        $
          ? await l($)
          : await K.withPropagatedContext(e.headers, () =>
              K.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${D} ${g}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': D, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof _.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: I,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: L,
                isOnDemandRevalidate: N,
              }),
            })),
          M)
        )
          throw t
        return (await (0, h.sendResponse)(B, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => T,
        'patchFetch',
        () => N,
        'routeModule',
        () => C,
        'serverHooks',
        () => k,
        'workAsyncStorage',
        () => y,
        'workUnitAsyncStorage',
        () => P,
      ],
      866129
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

//# sourceMappingURL=%5Broot-of-the-server%5D__051aa767._.js.map
