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
    function a(e, t) {
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
      e.s(['toDate', () => a], 609730))
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
    var a = e.i(609730)
    function n(e, r) {
      let n =
          r?.weekStartsOn ??
          r?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        s = (0, a.toDate)(e, r?.in),
        o = s.getDay()
      return (s.setDate(s.getDate() - (7 * (o < n) + o - n)), s.setHours(0, 0, 0, 0), s)
    }
    e.s(['startOfWeek', () => n], 250354)
  },
  951066,
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
      m = e.i(570101),
      v = e.i(626937),
      f = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var g = e.i(600220),
      _ = e.i(686880),
      E = e.i(89171),
      w = e.i(493458),
      b = e.i(343747),
      C = e.i(79832),
      y = e.i(657446)
    async function x() {
      try {
        let e,
          t = await C.default.api.getSession({ headers: await (0, w.headers)() })
        if (!t?.user?.email) return E.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if ('CUSTOMER' !== t.user.role)
          return E.NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        let r = await y.prisma.user.findUnique({
          where: { email: t.user.email },
          include: {
            bookings: {
              include: {
                groomer: { select: { id: !0, name: !0, image: !0 } },
                bookingPets: { include: { pet: !0, services: { include: { service: !0 } } } },
              },
              orderBy: { createdAt: 'desc' },
            },
            pets: { where: { isActive: !0 } },
          },
        })
        if (!r) return E.NextResponse.json({ error: 'User not found' }, { status: 404 })
        let a = new Date(),
          n = r.bookings || [],
          s = n.length,
          o = n.filter((e) => 'SERVICE_COMPLETED' === e.status).length,
          i = n.filter((e) => 'GROOMER_CONFIRM' === e.status && new Date(e.serviceDate) > a).length,
          l = n
            .filter((e) => 'SERVICE_COMPLETED' === e.status)
            .reduce((e, t) => e + (t.totalPrice || 0), 0),
          u = new Map()
        n.forEach((e) => {
          if (e.groomer) {
            let t = u.get(e.groomer.id) || {
              name: e.groomer.name || 'Unknown',
              image: e.groomer.image || null,
              count: 0,
              totalRating: 0,
              completedCount: 0,
            }
            ;(t.count++,
              'SERVICE_COMPLETED' === e.status &&
                e.customerRating &&
                ((t.totalRating += e.customerRating), t.completedCount++),
              u.set(e.groomer.id, t))
          }
        })
        let d = 0
        u.forEach((t) => {
          t.count > d &&
            ((d = t.count),
            (e = {
              name: t.name,
              image: t.image,
              rating:
                t.completedCount > 0 ? Math.round((t.totalRating / t.completedCount) * 10) / 10 : 0,
            }))
        })
        let c = n
          .slice(0, 5)
          .map((e) => ({
            id: e.id,
            date: (0, b.format)(e.serviceDate, 'yyyy-MM-dd', { locale: _.ko }),
            service: {
              name: e.bookingPets?.[0]?.services?.[0]?.service?.name || e.serviceType || 'Service',
            },
            groomer: { name: e.groomer?.name || 'Unassigned' },
            status: e.status,
          }))
        return E.NextResponse.json({
          totalBookings: s,
          completedBookings: o,
          upcomingBookings: i,
          totalSpent: l,
          favoriteGroomer: e,
          recentBookings: c,
          totalPets: r.pets.length,
        })
      } catch (e) {
        return (
          console.error('Dashboard stats error:', e),
          E.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => x], 133390)
    var k = e.i(133390)
    let P = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/dashboard/stats/route',
          pathname: '/api/customer/dashboard/stats',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/dashboard/stats/route.ts',
        nextConfigOutput: 'standalone',
        userland: k,
      }),
      { workAsyncStorage: O, workUnitAsyncStorage: S, serverHooks: A } = P
    function D() {
      return (0, a.patchFetch)({ workAsyncStorage: O, workUnitAsyncStorage: S })
    }
    async function T(e, t, a) {
      P.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let _ = '/api/customer/dashboard/stats/route'
      _ = _.replace(/\/index$/, '') || '/'
      let E = await P.prepare(e, t, { srcPage: _, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: b,
          nextConfig: C,
          parsedUrl: y,
          isDraftMode: x,
          prerenderManifest: k,
          routerServerContext: O,
          isOnDemandRevalidate: S,
          revalidateOnlyGenerated: A,
          resolvedPathname: D,
          clientReferenceManifest: T,
          serverActionsManifest: N,
        } = E,
        M = (0, l.normalizeAppPath)(_),
        j = !!(k.dynamicRoutes[M] || k.routes[D]),
        I = async () => (
          (null == O ? void 0 : O.render404)
            ? await O.render404(e, t, y, !1)
            : t.end('This page could not be found'),
          null
        )
      if (j && !x) {
        let e = !!k.routes[D],
          t = k.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await I()
          throw new R.NoFallbackError()
        }
      }
      let U = null
      !j || P.isDev || x || (U = '/index' === (U = D) ? '/' : U)
      let H = !0 === P.isDev || !j,
        q = j && !H
      N &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: _,
          clientReferenceManifest: T,
          serverActionsManifest: N,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: N }),
        })
      let F = e.method || 'GET',
        $ = (0, s.getTracer)(),
        K = $.getActiveScopeSpan(),
        L = {
          params: b,
          prerenderManifest: k,
          renderOpts: {
            experimental: { authInterrupts: !!C.experimental.authInterrupts },
            cacheComponents: !!C.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: C.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => P.onRequestError(e, t, a, O),
          },
          sharedContext: { buildId: w },
        },
        B = new u.NodeNextRequest(e),
        V = new u.NodeNextResponse(t),
        G = d.NextRequestAdapter.fromNodeNextRequest(B, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            P.handle(G, L).finally(() => {
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
              } else e.updateName(`${F} ${_}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && S && A && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = L.renderOpts.fetchMetrics
                  let l = L.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = L.renderOpts.collectedTags
                  if (!j)
                    return (await (0, h.sendResponse)(B, V, s, L.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[f.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== L.renderOpts.collectedRevalidate &&
                        !(L.renderOpts.collectedRevalidate >= f.INFINITE_CACHE) &&
                        L.renderOpts.collectedRevalidate,
                      a =
                        void 0 === L.renderOpts.collectedExpire ||
                        L.renderOpts.collectedExpire >= f.INFINITE_CACHE
                          ? void 0
                          : L.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: g.CachedRouteKind.APP_ROUTE,
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
                      (await P.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: _,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: q,
                            isOnDemandRevalidate: S,
                          }),
                        },
                        O
                      )),
                    t
                  )
                }
              },
              d = await P.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: U,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: k,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: S,
                revalidateOnlyGenerated: A,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!j) return null
            if (
              (null == d || null == (s = d.value) ? void 0 : s.kind) !== g.CachedRouteKind.APP_ROUTE
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
                S ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              x &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && j) || c.delete(f.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                B,
                V,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
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
                  spanName: `${F} ${_}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await P.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: q,
                isOnDemandRevalidate: S,
              }),
            })),
          j)
        )
          throw t
        return (await (0, h.sendResponse)(B, V, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => T,
        'patchFetch',
        () => D,
        'routeModule',
        () => P,
        'serverHooks',
        () => A,
        'workAsyncStorage',
        () => O,
        'workUnitAsyncStorage',
        () => S,
      ],
      951066
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

//# sourceMappingURL=%5Broot-of-the-server%5D__335003fb._.js.map
