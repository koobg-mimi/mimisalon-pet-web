module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  853453,
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
      g = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      f = e.i(89171),
      w = e.i(493458),
      b = e.i(79832),
      E = e.i(657446)
    async function x(e) {
      try {
        let t = await b.default.api.getSession({ headers: await (0, w.headers)() })
        if (!t || t.user?.role !== 'GROOMER')
          return f.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let r = t.user.id,
          { searchParams: a } = new URL(e.url),
          n = parseInt(a.get('page') ?? '1'),
          s = parseInt(a.get('limit') ?? '10'),
          o = a.get('rating'),
          i = a.get('hasResponse'),
          l = a.get('sortBy') ?? 'createdAt',
          d = a.get('sortOrder') ?? 'desc',
          u = a.get('search'),
          c = (n - 1) * s,
          p = { booking: { groomerId: r } }
        ;(o && 'all' !== o && (p.rating = parseInt(o)),
          'true' === i ? (p.response = { isNot: null }) : 'false' === i && (p.response = null),
          u &&
            (p.OR = [
              { customer: { name: { contains: u, mode: 'insensitive' } } },
              { comment: { contains: u, mode: 'insensitive' } },
            ]))
        let h = {}
        'rating' === l
          ? (h.rating = d)
          : 'customerName' === l
            ? (h.customer = { name: d })
            : (h.createdAt = d)
        let [m, v] = await Promise.all([
            E.prisma.review.findMany({
              where: p,
              include: {
                customer: { select: { id: !0, name: !0, image: !0 } },
                booking: {
                  select: {
                    id: !0,
                    serviceDate: !0,
                    serviceType: !0,
                    bookingPets: {
                      include: {
                        pet: { select: { name: !0, breed: !0 } },
                        services: { include: { service: { select: { name: !0 } } } },
                      },
                    },
                  },
                },
                images: { select: { id: !0, url: !0, order: !0 }, orderBy: { order: 'asc' } },
                response: { select: { id: !0, content: !0, createdAt: !0 } },
              },
              orderBy: h,
              skip: c,
              take: s,
            }),
            E.prisma.review.count({ where: p }),
          ]),
          g = m.map((e) => ({
            id: e.id,
            rating: e.rating,
            comment: e.comment,
            createdAt: e.createdAt.toISOString(),
            images: e.images,
            response: e.response
              ? {
                  id: e.response.id,
                  content: e.response.content,
                  createdAt: e.response.createdAt.toISOString(),
                }
              : null,
            customer: { id: e.customer.id, name: e.customer.name, image: e.customer.image },
            booking: {
              id: e.booking.id,
              serviceDate: e.booking.serviceDate.toISOString(),
              serviceType: e.booking.serviceType || 'Service',
              bookingPets: e.booking.bookingPets.map((e) => ({
                pet: { name: e.pet.name, breed: e.pet.breed },
              })),
            },
          }))
        return f.NextResponse.json({
          reviews: g,
          pagination: {
            page: n,
            limit: s,
            totalCount: v,
            totalPages: Math.ceil(v / s),
            hasNextPage: n < Math.ceil(v / s),
            hasPreviousPage: n > 1,
          },
        })
      } catch (e) {
        return (
          console.error('Failed to fetch groomer reviews:', e),
          f.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => x], 543712)
    var k = e.i(543712)
    let y = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/groomer/reviews/route',
          pathname: '/api/groomer/reviews',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/groomer/reviews/route.ts',
        nextConfigOutput: 'standalone',
        userland: k,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: P, serverHooks: C } = y
    function N() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: P })
    }
    async function O(e, t, a) {
      y.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let f = '/api/groomer/reviews/route'
      f = f.replace(/\/index$/, '') || '/'
      let w = await y.prepare(e, t, { srcPage: f, multiZoneDraftMode: !1 })
      if (!w)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: b,
          params: E,
          nextConfig: x,
          parsedUrl: k,
          isDraftMode: A,
          prerenderManifest: P,
          routerServerContext: C,
          isOnDemandRevalidate: N,
          revalidateOnlyGenerated: O,
          resolvedPathname: S,
          clientReferenceManifest: T,
          serverActionsManifest: j,
        } = w,
        I = (0, l.normalizeAppPath)(f),
        M = !!(P.dynamicRoutes[I] || P.routes[S]),
        U = async () => (
          (null == C ? void 0 : C.render404)
            ? await C.render404(e, t, k, !1)
            : t.end('This page could not be found'),
          null
        )
      if (M && !A) {
        let e = !!P.routes[S],
          t = P.dynamicRoutes[I]
        if (t && !1 === t.fallback && !e) {
          if (x.experimental.adapterPath) return await U()
          throw new R.NoFallbackError()
        }
      }
      let q = null
      !M || y.isDev || A || (q = '/index' === (q = S) ? '/' : q)
      let H = !0 === y.isDev || !M,
        D = M && !H
      j &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: f,
          clientReferenceManifest: T,
          serverActionsManifest: j,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: j }),
        })
      let F = e.method || 'GET',
        $ = (0, s.getTracer)(),
        K = $.getActiveScopeSpan(),
        B = {
          params: E,
          prerenderManifest: P,
          renderOpts: {
            experimental: { authInterrupts: !!x.experimental.authInterrupts },
            cacheComponents: !!x.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: x.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => y.onRequestError(e, t, a, C),
          },
          sharedContext: { buildId: b },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            y.handle(V, B).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = $.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = r.get('next.route')
              if (a) {
                let t = `${F} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${F} ${f}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && N && O && !r)
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
                  if (!M)
                    return (await (0, h.sendResponse)(L, G, s, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[g.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== B.renderOpts.collectedRevalidate &&
                        !(B.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        B.renderOpts.collectedRevalidate,
                      a =
                        void 0 === B.renderOpts.collectedExpire ||
                        B.renderOpts.collectedExpire >= g.INFINITE_CACHE
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
                          routePath: f,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: N,
                          }),
                        },
                        C
                      )),
                    t
                  )
                }
              },
              u = await y.handleResponse({
                req: e,
                nextConfig: x,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: N,
                revalidateOnlyGenerated: O,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!M) return null
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
                N ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && M) || c.delete(g.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(u.cacheControl)),
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
          : await $.withPropagatedContext(e.headers, () =>
              $.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${f}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await y.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: I,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: N,
              }),
            })),
          M)
        )
          throw t
        return (await (0, h.sendResponse)(L, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => O,
        'patchFetch',
        () => N,
        'routeModule',
        () => y,
        'serverHooks',
        () => C,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => P,
      ],
      853453
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

//# sourceMappingURL=%5Broot-of-the-server%5D__84cd0a5a._.js.map
