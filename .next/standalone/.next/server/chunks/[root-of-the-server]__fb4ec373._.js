module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  796759,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      a = e.i(759756),
      i = e.i(561916),
      s = e.i(114444),
      o = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      g = e.i(626937),
      v = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      _ = e.i(89171),
      b = e.i(493458),
      w = e.i(79832),
      y = e.i(657446)
    async function x(e) {
      try {
        let t = await w.default.api.getSession({ headers: await (0, b.headers)() })
        if (!t || 'CUSTOMER' !== t.user.role)
          return _.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let r = e.nextUrl.searchParams.get('petId'),
          n = null
        if (r && !(n = await y.prisma.pet.findUnique({ where: { id: r }, include: { breed: !0 } })))
          return _.NextResponse.json({ error: 'Pet not found' }, { status: 404 })
        let a = (
          await y.prisma.service.findMany({
            where: { isActive: !0 },
            include: {
              servicePetTypes: !0,
              priceRanges: {
                include: { applicableBreeds: { include: { breed: !0 } } },
                orderBy: [{ petType: 'asc' }, { minWeight: 'asc' }],
              },
              _count: { select: { bookingServices: !0 } },
            },
            orderBy: [{ name: 'asc' }],
          })
        )
          .map((e) => {
            let t = e.priceRanges.length > 0 ? Math.min(...e.priceRanges.map((e) => e.price)) : 0,
              r = !0
            if (n && e.priceRanges.length > 0)
              if (e.priceRanges.some((e) => e.petType === n.type)) {
                let a = null
                ;(n.breedId &&
                  (a = e.priceRanges.find((e) => {
                    if (e.petType !== n.type) return !1
                    let t = e.applicableBreeds?.map((e) => e.breedId) || []
                    if (t.length > 0 && n.breedId && t.includes(n.breedId)) {
                      if (n.weight) {
                        let t = e.minWeight ?? 0,
                          r = n.weight >= t,
                          a = null == e.maxWeight || n.weight <= e.maxWeight
                        return r && a
                      }
                      return (0 === e.minWeight || null == e.minWeight) && null == e.maxWeight
                    }
                    return !1
                  })),
                  a ||
                    (a = e.priceRanges.find((e) => {
                      if (
                        e.petType !== n.type ||
                        (e.applicableBreeds?.map((e) => e.breedId) || []).length > 0
                      )
                        return !1
                      if (n.weight) {
                        let t = e.minWeight ?? 0,
                          r = n.weight >= t,
                          a = null == e.maxWeight || n.weight <= e.maxWeight
                        return r && a
                      }
                      return (0 === e.minWeight || null == e.minWeight) && null == e.maxWeight
                    })),
                  a
                    ? (t = a.price)
                    : (console.warn(
                        `[Service Filter] ✗ No price range match for service ${e.id} (${e.name}), pet ${n.id} (type: ${n.type}, weight: ${n.weight}kg, breedId: ${n.breedId}). Service will be hidden.`
                      ),
                      (r = !1)))
              } else r = !1
            return {
              id: e.id,
              name: e.name,
              description: e.description || '',
              price: t,
              duration: e.durationMinutes,
              petTypes: e.servicePetTypes.map((e) => e.petType),
              priceRanges: e.priceRanges.map((e) => ({
                petType: e.petType,
                minWeight: e.minWeight,
                maxWeight: e.maxWeight,
                price: e.price,
                selectedBreedIds: e.applicableBreeds?.map((e) => e.breedId) || [],
              })),
              requiresVaccination: e.requiresVaccination,
              bookingCount: e._count.bookingServices,
              isPopular: e._count.bookingServices > 10,
              isRecommended: !1,
              icon: '✂️',
              createdAt: e.createdAt.toISOString(),
              updatedAt: e.updatedAt.toISOString(),
              isAvailableForPet: r,
            }
          })
          .filter((e) => e.isAvailableForPet)
        return _.NextResponse.json(a)
      } catch (e) {
        return (
          console.error('Error fetching customer services:', e),
          _.NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => x], 603419)
    var E = e.i(603419)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/services/route',
          pathname: '/api/customer/services',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/services/route.ts',
        nextConfigOutput: 'standalone',
        userland: E,
      }),
      { workAsyncStorage: T, workUnitAsyncStorage: A, serverHooks: P } = C
    function S() {
      return (0, n.patchFetch)({ workAsyncStorage: T, workUnitAsyncStorage: A })
    }
    async function k(e, t, n) {
      C.isDev && (0, a.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let _ = '/api/customer/services/route'
      _ = _.replace(/\/index$/, '') || '/'
      let b = await C.prepare(e, t, { srcPage: _, multiZoneDraftMode: !1 })
      if (!b)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: y,
          nextConfig: x,
          parsedUrl: E,
          isDraftMode: T,
          prerenderManifest: A,
          routerServerContext: P,
          isOnDemandRevalidate: S,
          revalidateOnlyGenerated: k,
          resolvedPathname: I,
          clientReferenceManifest: N,
          serverActionsManifest: j,
        } = b,
        O = (0, l.normalizeAppPath)(_),
        q = !!(A.dynamicRoutes[O] || A.routes[I]),
        M = async () => (
          (null == P ? void 0 : P.render404)
            ? await P.render404(e, t, E, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !T) {
        let e = !!A.routes[I],
          t = A.dynamicRoutes[O]
        if (t && !1 === t.fallback && !e) {
          if (x.experimental.adapterPath) return await M()
          throw new R.NoFallbackError()
        }
      }
      let U = null
      !q || C.isDev || T || (U = '/index' === (U = I) ? '/' : U)
      let W = !0 === C.isDev || !q,
        H = q && !W
      j &&
        N &&
        (0, s.setReferenceManifestsSingleton)({
          page: _,
          clientReferenceManifest: N,
          serverActionsManifest: j,
          serverModuleMap: (0, o.createServerModuleMap)({ serverActionsManifest: j }),
        })
      let $ = e.method || 'GET',
        D = (0, i.getTracer)(),
        B = D.getActiveScopeSpan(),
        F = {
          params: y,
          prerenderManifest: A,
          renderOpts: {
            experimental: { authInterrupts: !!x.experimental.authInterrupts },
            cacheComponents: !!x.cacheComponents,
            supportsDynamicResponse: W,
            incrementalCache: (0, a.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: x.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => C.onRequestError(e, t, n, P),
          },
          sharedContext: { buildId: w },
        },
        K = new d.NodeNextRequest(e),
        L = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(K, (0, u.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            C.handle(V, F).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = D.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = r.get('next.route')
              if (n) {
                let t = `${$} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${$} ${_}`)
            }),
          o = !!(0, a.getRequestMeta)(e, 'minimalMode'),
          l = async (a) => {
            var i, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!o && S && k && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let i = await s(a)
                  e.fetchMetrics = F.renderOpts.fetchMetrics
                  let l = F.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let d = F.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(K, L, i, F.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await i.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(i.headers)
                    ;(d && (t[v.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== F.renderOpts.collectedRevalidate &&
                        !(F.renderOpts.collectedRevalidate >= v.INFINITE_CACHE) &&
                        F.renderOpts.collectedRevalidate,
                      n =
                        void 0 === F.renderOpts.collectedExpire ||
                        F.renderOpts.collectedExpire >= v.INFINITE_CACHE
                          ? void 0
                          : F.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: f.CachedRouteKind.APP_ROUTE,
                        status: i.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: n },
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
                          routePath: _,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: S,
                          }),
                        },
                        P
                      )),
                    t
                  )
                }
              },
              u = await C.handleResponse({
                req: e,
                nextConfig: x,
                cacheKey: U,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: A,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: S,
                revalidateOnlyGenerated: k,
                responseGenerator: d,
                waitUntil: n.waitUntil,
                isMinimalMode: o,
              })
            if (!q) return null
            if (
              (null == u || null == (i = u.value) ? void 0 : i.kind) !== f.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == u || null == (l = u.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(o ||
              t.setHeader(
                'x-nextjs-cache',
                S ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              T &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (o && q) || c.delete(v.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, g.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                K,
                L,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        B
          ? await l(B)
          : await D.withPropagatedContext(e.headers, () =>
              D.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${$} ${_}`,
                  kind: i.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: O,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: S,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(K, L, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => k,
        'patchFetch',
        () => S,
        'routeModule',
        () => C,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => T,
        'workUnitAsyncStorage',
        () => A,
      ],
      796759
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

//# sourceMappingURL=%5Broot-of-the-server%5D__fb4ec373._.js.map
