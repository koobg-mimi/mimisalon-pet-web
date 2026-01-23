module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  892969,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      o = e.i(996250),
      a = e.i(759756),
      n = e.i(561916),
      i = e.i(114444),
      s = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      c = e.i(487718),
      u = e.i(995169),
      m = e.i(47587),
      p = e.i(666012),
      h = e.i(570101),
      g = e.i(626937),
      v = e.i(10372),
      f = e.i(193695)
    e.i(52474)
    var R = e.i(600220),
      _ = e.i(89171),
      A = e.i(493458),
      w = e.i(79832),
      E = e.i(657446)
    async function b(e, { params: t }) {
      let { id: r } = await t
      try {
        let e = await w.default.api.getSession({ headers: await (0, A.headers)() })
        if (!e || e.user?.role !== 'ADMIN')
          return _.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let t = await E.prisma.user.findFirst({
          where: { id: r, role: 'GROOMER' },
          include: {
            groomerProfile: { include: { commissionGrade: !0 } },
            workAreas: !0,
            groomerBookings: {
              where: { status: 'SERVICE_COMPLETED' },
              select: { id: !0, totalPrice: !0, createdAt: !0, serviceDate: !0 },
              orderBy: { serviceDate: 'desc' },
            },
            reviews: {
              select: { rating: !0, comment: !0, createdAt: !0 },
              orderBy: { createdAt: 'desc' },
            },
            _count: { select: { groomerBookings: !0 } },
          },
        })
        if (!t) return _.NextResponse.json({ error: 'Groomer not found' }, { status: 404 })
        let o = t.reviews.map((e) => e.rating),
          a = o.length > 0 ? o.reduce((e, t) => e + t, 0) / o.length : 0,
          n = new Date()
        n.setDate(n.getDate() - 30)
        let i = t.groomerBookings
            .filter((e) => new Date(e.createdAt) >= n)
            .reduce((e, t) => e + t.totalPrice, 0),
          s = t.groomerBookings.length > 0 ? t.groomerBookings[0].createdAt : null,
          l = {
            id: t.id,
            userId: t.id,
            user: {
              id: t.id,
              email: t.email,
              name: t.name || '',
              phoneNumber: t.phoneNumber,
              isActive: t.groomerProfile?.isActive ?? !0,
              createdAt: t.createdAt.toISOString(),
              lastLoginAt: null,
            },
            bio: null,
            experience: 0,
            certifications: [],
            isActive: t.groomerProfile?.isActive ?? !0,
            rating: Number(a.toFixed(1)),
            totalReviews: t.reviews.length,
            totalBookings: t._count.groomerBookings,
            monthlyRevenue: i,
            profileImage: t.image,
            portfolio: [],
            availableLocations: t.workAreas.map((e) => ({
              id: e.id,
              name: e.name,
              address: e.address || '',
              description: e.description || '',
              centerLat: e.centerLat,
              centerLng: e.centerLng,
              radiusKm: e.radiusKm,
              isActive: e.isActive,
            })),
            services: [],
            bankAccount: t.groomerProfile
              ? {
                  bankName: t.groomerProfile.bankName || '',
                  accountNumber: t.groomerProfile.bankAccountNumber || '',
                  accountHolder: t.groomerProfile.bankAccountHolderName || '',
                }
              : null,
            commissionGrade: t.groomerProfile?.commissionGrade
              ? {
                  id: t.groomerProfile.commissionGrade.id,
                  name: t.groomerProfile.commissionGrade.name,
                  commissionRate: t.groomerProfile.commissionGrade.commissionRate,
                }
              : null,
            lastActivityAt: s ? new Date(s).toISOString() : null,
            recentBookings: t.groomerBookings
              .slice(0, 10)
              .map((e) => ({
                id: e.id,
                serviceDate: e.serviceDate.toISOString(),
                totalPrice: e.totalPrice,
                createdAt: e.createdAt.toISOString(),
              })),
            recentReviews: t.reviews
              .slice(0, 5)
              .map((e) => ({
                rating: e.rating,
                comment: e.comment,
                createdAt: e.createdAt.toISOString(),
              })),
          }
        return _.NextResponse.json(l)
      } catch (e) {
        return (
          console.error(`Error fetching groomer ${r}:`, e),
          _.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => b], 589819)
    var P = e.i(589819)
    let k = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/groomers/[id]/route',
          pathname: '/api/admin/groomers/[id]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/groomers/[id]/route.ts',
        nextConfigOutput: 'standalone',
        userland: P,
      }),
      { workAsyncStorage: x, workUnitAsyncStorage: C, serverHooks: N } = k
    function y() {
      return (0, o.patchFetch)({ workAsyncStorage: x, workUnitAsyncStorage: C })
    }
    async function S(e, t, o) {
      k.isDev && (0, a.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let _ = '/api/admin/groomers/[id]/route'
      _ = _.replace(/\/index$/, '') || '/'
      let A = await k.prepare(e, t, { srcPage: _, multiZoneDraftMode: !1 })
      if (!A)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == o.waitUntil || o.waitUntil.call(o, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: E,
          nextConfig: b,
          parsedUrl: P,
          isDraftMode: x,
          prerenderManifest: C,
          routerServerContext: N,
          isOnDemandRevalidate: y,
          revalidateOnlyGenerated: S,
          resolvedPathname: O,
          clientReferenceManifest: T,
          serverActionsManifest: I,
        } = A,
        j = (0, l.normalizeAppPath)(_),
        D = !!(C.dynamicRoutes[j] || C.routes[O]),
        H = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, P, !1)
            : t.end('This page could not be found'),
          null
        )
      if (D && !x) {
        let e = !!C.routes[O],
          t = C.dynamicRoutes[j]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await H()
          throw new f.NoFallbackError()
        }
      }
      let M = null
      !D || k.isDev || x || (M = '/index' === (M = O) ? '/' : M)
      let q = !0 === k.isDev || !D,
        U = D && !q
      I &&
        T &&
        (0, i.setReferenceManifestsSingleton)({
          page: _,
          clientReferenceManifest: T,
          serverActionsManifest: I,
          serverModuleMap: (0, s.createServerModuleMap)({ serverActionsManifest: I }),
        })
      let B = e.method || 'GET',
        G = (0, n.getTracer)(),
        L = G.getActiveScopeSpan(),
        F = {
          params: E,
          prerenderManifest: C,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: q,
            incrementalCache: (0, a.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: o.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, o) => k.onRequestError(e, t, o, N),
          },
          sharedContext: { buildId: w },
        },
        K = new d.NodeNextRequest(e),
        $ = new d.NodeNextResponse(t),
        V = c.NextRequestAdapter.fromNodeNextRequest(K, (0, c.signalFromNodeResponse)(t))
      try {
        let i = async (e) =>
            k.handle(V, F).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = G.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== u.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let o = r.get('next.route')
              if (o) {
                let t = `${B} ${o}`
                ;(e.setAttributes({ 'next.route': o, 'http.route': o, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${B} ${_}`)
            }),
          s = !!(0, a.getRequestMeta)(e, 'minimalMode'),
          l = async (a) => {
            var n, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!s && y && S && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let n = await i(a)
                  e.fetchMetrics = F.renderOpts.fetchMetrics
                  let l = F.renderOpts.pendingWaitUntil
                  l && o.waitUntil && (o.waitUntil(l), (l = void 0))
                  let d = F.renderOpts.collectedTags
                  if (!D)
                    return (await (0, p.sendResponse)(K, $, n, F.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await n.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(n.headers)
                    ;(d && (t[v.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== F.renderOpts.collectedRevalidate &&
                        !(F.renderOpts.collectedRevalidate >= v.INFINITE_CACHE) &&
                        F.renderOpts.collectedRevalidate,
                      o =
                        void 0 === F.renderOpts.collectedExpire ||
                        F.renderOpts.collectedExpire >= v.INFINITE_CACHE
                          ? void 0
                          : F.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: R.CachedRouteKind.APP_ROUTE,
                        status: n.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: o },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await k.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: _,
                          routeType: 'route',
                          revalidateReason: (0, m.getRevalidateReason)({
                            isStaticGeneration: U,
                            isOnDemandRevalidate: y,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              c = await k.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: C,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: y,
                revalidateOnlyGenerated: S,
                responseGenerator: d,
                waitUntil: o.waitUntil,
                isMinimalMode: s,
              })
            if (!D) return null
            if (
              (null == c || null == (n = c.value) ? void 0 : n.kind) !== R.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == c || null == (l = c.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(s ||
              t.setHeader(
                'x-nextjs-cache',
                y ? 'REVALIDATED' : c.isMiss ? 'MISS' : c.isStale ? 'STALE' : 'HIT'
              ),
              x &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let u = (0, h.fromNodeOutgoingHttpHeaders)(c.value.headers)
            return (
              (s && D) || u.delete(v.NEXT_CACHE_TAGS_HEADER),
              !c.cacheControl ||
                t.getHeader('Cache-Control') ||
                u.get('Cache-Control') ||
                u.set('Cache-Control', (0, g.getCacheControlHeader)(c.cacheControl)),
              await (0, p.sendResponse)(
                K,
                $,
                new Response(c.value.body, { headers: u, status: c.value.status || 200 })
              ),
              null
            )
          }
        L
          ? await l(L)
          : await G.withPropagatedContext(e.headers, () =>
              G.trace(
                u.BaseServerSpan.handleRequest,
                {
                  spanName: `${B} ${_}`,
                  kind: n.SpanKind.SERVER,
                  attributes: { 'http.method': B, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof f.NoFallbackError ||
            (await k.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: j,
              routeType: 'route',
              revalidateReason: (0, m.getRevalidateReason)({
                isStaticGeneration: U,
                isOnDemandRevalidate: y,
              }),
            })),
          D)
        )
          throw t
        return (await (0, p.sendResponse)(K, $, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => S,
        'patchFetch',
        () => y,
        'routeModule',
        () => k,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => x,
        'workUnitAsyncStorage',
        () => C,
      ],
      892969
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

//# sourceMappingURL=%5Broot-of-the-server%5D__60d88842._.js.map
