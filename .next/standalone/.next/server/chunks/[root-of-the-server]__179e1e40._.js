module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  609730,
  438220,
  874321,
  (e) => {
    'use strict'
    let t = Symbol.for('constructDateFrom')
    function r(e, r) {
      return 'function' == typeof e
        ? e(r)
        : e && 'object' == typeof e && t in e
          ? e[t](r)
          : e instanceof Date
            ? new e.constructor(r)
            : new Date(r)
    }
    function n(e, t) {
      return r(t || e, e)
    }
    ;(e.s(
      [
        'constructFromSymbol',
        0,
        t,
        'millisecondsInDay',
        0,
        864e5,
        'millisecondsInHour',
        0,
        36e5,
        'millisecondsInMinute',
        0,
        6e4,
        'millisecondsInWeek',
        0,
        6048e5,
      ],
      438220
    ),
      e.s(['constructFrom', () => r], 874321),
      e.s(['toDate', () => n], 609730))
  },
  250354,
  662001,
  (e) => {
    'use strict'
    let t = {}
    function r() {
      return t
    }
    e.s(['getDefaultOptions', () => r], 662001)
    var n = e.i(609730)
    function a(e, r) {
      let a =
          r?.weekStartsOn ??
          r?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        o = (0, n.toDate)(e, r?.in),
        s = o.getDay()
      return (o.setDate(o.getDate() - (7 * (s < a) + s - a)), o.setHours(0, 0, 0, 0), o)
    }
    e.s(['startOfWeek', () => a], 250354)
  },
  121741,
  278052,
  (e) => {
    'use strict'
    var t = e.i(609730)
    function r(e, r) {
      let n = (0, t.toDate)(e, r?.in)
      return (n.setDate(1), n.setHours(0, 0, 0, 0), n)
    }
    function n(e, r) {
      let n = (0, t.toDate)(e, r?.in),
        a = n.getMonth()
      return (n.setFullYear(n.getFullYear(), a + 1, 0), n.setHours(23, 59, 59, 999), n)
    }
    ;(e.s(['startOfMonth', () => r], 121741), e.s(['endOfMonth', () => n], 278052))
  },
  694625,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      a = e.i(759756),
      o = e.i(561916),
      s = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      u = e.i(316795),
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      v = e.i(626937),
      g = e.i(10372),
      f = e.i(193695)
    e.i(52474)
    var R = e.i(600220),
      w = e.i(686880),
      _ = e.i(89171),
      E = e.i(493458),
      b = e.i(79832),
      y = e.i(657446),
      N = e.i(121741),
      O = e.i(278052),
      k = e.i(874321),
      C = e.i(609730)
    function A(e, t, r) {
      return (function (e, t, r) {
        let n = (0, C.toDate)(e, r?.in)
        if (isNaN(t)) return (0, k.constructFrom)(r?.in || e, NaN)
        if (!t) return n
        let a = n.getDate(),
          o = (0, k.constructFrom)(r?.in || e, n.getTime())
        return (o.setMonth(n.getMonth() + t + 1, 0), a >= o.getDate())
          ? o
          : (n.setFullYear(o.getFullYear(), o.getMonth(), a), n)
      })(e, -t, r)
    }
    var M = e.i(343747)
    async function x() {
      try {
        let e = await b.default.api.getSession({ headers: await (0, E.headers)() })
        if (!e || e.user?.role !== 'ADMIN')
          return _.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let t = new Date(),
          r = (0, N.startOfMonth)(t),
          n = (0, O.endOfMonth)(t),
          a = (0, N.startOfMonth)(A(t, 1)),
          o = (0, O.endOfMonth)(A(t, 1)),
          [s, i, l, u, d, c, p] = await Promise.all([
            y.prisma.review.count(),
            y.prisma.review.count({ where: { response: { isNot: null } } }),
            y.prisma.review.count({ where: { createdAt: { gte: r, lte: n } } }),
            y.prisma.review.count({ where: { createdAt: { gte: a, lte: o } } }),
            y.prisma.review.findMany({ select: { rating: !0 } }),
            y.prisma.$queryRaw`
        SELECT
          g.id as "groomerId",
          g.name as "groomerName",
          AVG(r.rating) as "averageRating",
          COUNT(r.id) as "totalReviews"
        FROM "Groomer" g
        JOIN "Booking" b ON b."groomerId" = g.id
        JOIN "Review" r ON r."bookingId" = b.id
        GROUP BY g.id, g.name
        HAVING COUNT(r.id) >= 5
        ORDER BY AVG(r.rating) DESC
        LIMIT 5
      `,
            y.prisma.review.findMany({
              where: { rating: { lte: 3 } },
              include: {
                customer: { select: { id: !0, name: !0, email: !0 } },
                booking: { include: { groomer: { select: { id: !0, name: !0 } } } },
              },
              orderBy: { createdAt: 'desc' },
              take: 5,
            }),
          ]),
          h = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          m = 0
        d.forEach((e) => {
          ;(h[e.rating]++, (m += e.rating))
        })
        let v = d.length > 0 ? m / d.length : 0,
          g = s > 0 ? (i / s) * 100 : 0,
          f = u > 0 ? ((l - u) / u) * 100 : 0
        return _.NextResponse.json({
          overview: {
            totalReviews: s,
            publicReviews: s,
            flaggedReviews: 0,
            averageRating: Math.round(10 * v) / 10,
            responseRate: Math.round(10 * g) / 10,
          },
          trends: {
            thisMonthReviews: l,
            lastMonthReviews: u,
            monthGrowth: Math.round(10 * f) / 10,
          },
          ratingDistribution: h,
          topGroomers: c.map((e) => ({
            groomerId: e.groomerId,
            groomerName: e.groomerName,
            averageRating: Math.round(10 * Number(e.averageRating)) / 10,
            totalReviews: Number(e.totalReviews),
          })),
          recentLowRating: p.map((e) => ({
            id: e.id,
            rating: e.rating,
            comment: e.comment,
            customer: e.customer.name || 'Unknown',
            groomer: e.booking.groomer?.name || 'Unknown',
            createdAt: (0, M.format)(e.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { locale: w.ko }),
          })),
        })
      } catch (e) {
        return (
          console.error('Failed to fetch admin review stats:', e),
          _.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => x], 89196)
    var D = e.i(89196)
    let S = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/reviews/stats/route',
          pathname: '/api/admin/reviews/stats',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/reviews/stats/route.ts',
        nextConfigOutput: 'standalone',
        userland: D,
      }),
      { workAsyncStorage: I, workUnitAsyncStorage: T, serverHooks: P } = S
    function j() {
      return (0, n.patchFetch)({ workAsyncStorage: I, workUnitAsyncStorage: T })
    }
    async function H(e, t, n) {
      S.isDev && (0, a.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/admin/reviews/stats/route'
      w = w.replace(/\/index$/, '') || '/'
      let _ = await S.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!_)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: E,
          params: b,
          nextConfig: y,
          parsedUrl: N,
          isDraftMode: O,
          prerenderManifest: k,
          routerServerContext: C,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: M,
          resolvedPathname: x,
          clientReferenceManifest: D,
          serverActionsManifest: I,
        } = _,
        T = (0, l.normalizeAppPath)(w),
        P = !!(k.dynamicRoutes[T] || k.routes[x]),
        j = async () => (
          (null == C ? void 0 : C.render404)
            ? await C.render404(e, t, N, !1)
            : t.end('This page could not be found'),
          null
        )
      if (P && !O) {
        let e = !!k.routes[x],
          t = k.dynamicRoutes[T]
        if (t && !1 === t.fallback && !e) {
          if (y.experimental.adapterPath) return await j()
          throw new f.NoFallbackError()
        }
      }
      let H = null
      !P || S.isDev || O || (H = '/index' === (H = x) ? '/' : H)
      let U = !0 === S.isDev || !P,
        F = P && !U
      I &&
        D &&
        (0, s.setReferenceManifestsSingleton)({
          page: w,
          clientReferenceManifest: D,
          serverActionsManifest: I,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: I }),
        })
      let q = e.method || 'GET',
        G = (0, o.getTracer)(),
        $ = G.getActiveScopeSpan(),
        B = {
          params: b,
          prerenderManifest: k,
          renderOpts: {
            experimental: { authInterrupts: !!y.experimental.authInterrupts },
            cacheComponents: !!y.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, a.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: y.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => S.onRequestError(e, t, n, C),
          },
          sharedContext: { buildId: E },
        },
        K = new u.NodeNextRequest(e),
        L = new u.NodeNextResponse(t),
        V = d.NextRequestAdapter.fromNodeNextRequest(K, (0, d.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            S.handle(V, B).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = G.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = r.get('next.route')
              if (n) {
                let t = `${q} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${q} ${w}`)
            }),
          i = !!(0, a.getRequestMeta)(e, 'minimalMode'),
          l = async (a) => {
            var o, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && A && M && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await s(a)
                  e.fetchMetrics = B.renderOpts.fetchMetrics
                  let l = B.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let u = B.renderOpts.collectedTags
                  if (!P)
                    return (await (0, h.sendResponse)(K, L, o, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(u && (t[g.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== B.renderOpts.collectedRevalidate &&
                        !(B.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        B.renderOpts.collectedRevalidate,
                      n =
                        void 0 === B.renderOpts.collectedExpire ||
                        B.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : B.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: R.CachedRouteKind.APP_ROUTE,
                        status: o.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: n },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await S.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: F,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        C
                      )),
                    t
                  )
                }
              },
              d = await S.handleResponse({
                req: e,
                nextConfig: y,
                cacheKey: H,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: k,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: M,
                responseGenerator: u,
                waitUntil: n.waitUntil,
                isMinimalMode: i,
              })
            if (!P) return null
            if (
              (null == d || null == (o = d.value) ? void 0 : o.kind) !== R.CachedRouteKind.APP_ROUTE
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
                A ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              O &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && P) || c.delete(g.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                K,
                L,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
              ),
              null
            )
          }
        $
          ? await l($)
          : await G.withPropagatedContext(e.headers, () =>
              G.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${q} ${w}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': q, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof f.NoFallbackError ||
            (await S.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: T,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: F,
                isOnDemandRevalidate: A,
              }),
            })),
          P)
        )
          throw t
        return (await (0, h.sendResponse)(K, L, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => H,
        'patchFetch',
        () => j,
        'routeModule',
        () => S,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => I,
        'workUnitAsyncStorage',
        () => T,
      ],
      694625
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

//# sourceMappingURL=%5Broot-of-the-server%5D__179e1e40._.js.map
