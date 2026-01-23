module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  200125,
  (e) => {
    'use strict'
    var t = e.i(657446)
    async function r(e) {
      try {
        let r = await t.prisma.review.findMany({
          where: { booking: { bookingPets: { some: { services: { some: { serviceId: e } } } } } },
          select: { rating: !0 },
        })
        if (0 === r.length) return null
        let a = r.reduce((e, t) => e + t.rating, 0) / r.length
        return Math.round(10 * a) / 10
      } catch (t) {
        return (console.error(`Error calculating average rating for service ${e}:`, t), null)
      }
    }
    async function a(e) {
      let r = new Map()
      try {
        let a = await t.prisma.review.findMany({
            where: {
              booking: { bookingPets: { some: { services: { some: { serviceId: { in: e } } } } } },
            },
            select: {
              rating: !0,
              booking: {
                select: { bookingPets: { select: { services: { select: { serviceId: !0 } } } } },
              },
            },
          }),
          s = new Map()
        for (let e of a)
          for (let t of e.booking.bookingPets)
            for (let r of t.services) {
              let t = r.serviceId
              ;(s.has(t) || s.set(t, []), s.get(t).push(e.rating))
            }
        for (let t of e) {
          let e = s.get(t)
          if (e && e.length > 0) {
            let a = e.reduce((e, t) => e + t, 0) / e.length
            r.set(t, Math.round(10 * a) / 10)
          } else r.set(t, null)
        }
        return r
      } catch (t) {
        for (let a of (console.error('Error calculating multiple service ratings:', t), e))
          r.set(a, null)
        return r
      }
    }
    e.s(['calculateMultipleServiceRatings', () => a, 'calculateServiceAverageRating', () => r])
  },
  942191,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      s = e.i(759756),
      i = e.i(561916),
      n = e.i(114444),
      o = e.i(837092),
      c = e.i(869741),
      l = e.i(316795),
      d = e.i(487718),
      u = e.i(995169),
      p = e.i(47587),
      v = e.i(666012),
      h = e.i(570101),
      g = e.i(626937),
      m = e.i(10372),
      f = e.i(193695)
    e.i(52474)
    var R = e.i(600220),
      w = e.i(89171),
      _ = e.i(493458),
      y = e.i(79832),
      b = e.i(657446),
      E = e.i(200125)
    async function C(e, { params: t }) {
      try {
        let e = await y.default.api.getSession({ headers: await (0, _.headers)() })
        if (!e || 'ADMIN' !== e.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r } = await t,
          a = await b.prisma.service.findUnique({
            where: { id: r },
            include: {
              servicePetTypes: !0,
              serviceBreedCategories: !0,
              priceRanges: { include: { applicableBreeds: { include: { breed: !0 } } } },
              _count: { select: { bookingServices: !0 } },
            },
          })
        if (!a) return w.NextResponse.json({ error: 'Service not found' }, { status: 404 })
        let s = await (0, E.calculateServiceAverageRating)(r),
          i = {
            id: a.id,
            name: a.name,
            description: a.description,
            duration: a.durationMinutes,
            isActive: a.isActive,
            petTypes: a.servicePetTypes.map((e) => e.petType),
            breedCategories: a.serviceBreedCategories.map((e) => e.breedCategory),
            priceRanges: a.priceRanges.map((e) => ({
              ...e,
              selectedBreedIds: e.applicableBreeds?.map((e) => e.breedId) || [],
            })),
            requirements: a.requiresVaccination ? '예방접종 필요' : void 0,
            afterCareInstructions: void 0,
            createdAt: a.createdAt.toISOString(),
            updatedAt: a.updatedAt.toISOString(),
            bookingCount: a._count.bookingServices,
            averageRating: s ?? 0,
          }
        return w.NextResponse.json(i)
      } catch (e) {
        return (
          console.error('Error fetching service:', e),
          w.NextResponse.json(
            {
              error: 'Failed to fetch service details',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    async function A(e, { params: t }) {
      try {
        let r = await y.default.api.getSession({ headers: await (0, _.headers)() })
        if (!r || 'ADMIN' !== r.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: a } = await t,
          {
            name: s,
            description: i,
            duration: n,
            priceRanges: o = [],
            petTypes: c,
            breedCategories: l = [],
            requirements: d,
            isActive: u,
          } = await e.json()
        if (!o || 0 === o.length)
          return w.NextResponse.json(
            { error: '최소 하나의 가격 설정이 필요합니다' },
            { status: 400 }
          )
        await b.prisma.$transaction(async (e) => {
          let t = await e.service.update({
            where: { id: a },
            data: {
              name: s,
              description: i,
              durationMinutes: n,
              requiresVaccination: !!d && d.includes('예방접종'),
              isActive: u,
            },
          })
          if (
            (await e.servicePetType.deleteMany({ where: { serviceId: a } }),
            await e.serviceBreedCategory.deleteMany({ where: { serviceId: a } }),
            await e.servicePriceRange.deleteMany({ where: { serviceId: a } }),
            c &&
              c.length > 0 &&
              (await e.servicePetType.createMany({
                data: c.map((e) => ({ serviceId: a, petType: e })),
              })),
            l &&
              l.length > 0 &&
              (await e.serviceBreedCategory.createMany({
                data: l.map((e) => ({ serviceId: a, breedCategory: e })),
              })),
            o.length > 0)
          )
            for (let t of o) {
              let r = await e.servicePriceRange.create({
                data: {
                  serviceId: a,
                  petType: t.petType,
                  minWeight: t.minWeight ?? 0,
                  maxWeight: t.maxWeight,
                  price: t.price,
                },
              })
              t.selectedBreedIds &&
                t.selectedBreedIds.length > 0 &&
                (await e.servicePriceBreed.createMany({
                  data: t.selectedBreedIds.map((e) => ({ servicePriceRangeId: r.id, breedId: e })),
                }))
            }
          return t
        })
        let p = await b.prisma.service.findUnique({
            where: { id: a },
            include: {
              servicePetTypes: !0,
              serviceBreedCategories: !0,
              priceRanges: { include: { applicableBreeds: { include: { breed: !0 } } } },
              _count: { select: { bookingServices: !0 } },
            },
          }),
          v = await (0, E.calculateServiceAverageRating)(a),
          h = {
            id: p.id,
            name: p.name,
            description: p.description,
            duration: p.durationMinutes,
            isActive: p.isActive,
            petTypes: p.servicePetTypes.map((e) => e.petType),
            breedCategories: p.serviceBreedCategories.map((e) => e.breedCategory),
            priceRanges: p.priceRanges.map((e) => ({
              ...e,
              selectedBreedIds: e.applicableBreeds?.map((e) => e.breedId) || [],
            })),
            requirements: p.requiresVaccination ? '예방접종 필요' : void 0,
            afterCareInstructions: void 0,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
            bookingCount: p._count.bookingServices,
            averageRating: v ?? 0,
          }
        return w.NextResponse.json(h)
      } catch (e) {
        return (
          console.error('Error updating service:', e),
          w.NextResponse.json(
            {
              error: 'Failed to update service',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    async function x(e, { params: t }) {
      try {
        let e = await y.default.api.getSession({ headers: await (0, _.headers)() })
        if (!e || 'ADMIN' !== e.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r } = await t
        return (
          await b.prisma.service.delete({ where: { id: r } }),
          w.NextResponse.json({ message: 'Service deleted successfully' })
        )
      } catch (e) {
        return (
          console.error('Error deleting service:', e),
          w.NextResponse.json(
            {
              error: 'Failed to delete service',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    e.s(['DELETE', () => x, 'GET', () => C, 'PUT', () => A], 543978)
    var P = e.i(543978)
    let k = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/services/[id]/route',
          pathname: '/api/admin/services/[id]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/services/[id]/route.ts',
        nextConfigOutput: 'standalone',
        userland: P,
      }),
      { workAsyncStorage: I, workUnitAsyncStorage: S, serverHooks: T } = k
    function N() {
      return (0, a.patchFetch)({ workAsyncStorage: I, workUnitAsyncStorage: S })
    }
    async function M(e, t, a) {
      k.isDev && (0, s.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/admin/services/[id]/route'
      w = w.replace(/\/index$/, '') || '/'
      let _ = await k.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!_)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: y,
          params: b,
          nextConfig: E,
          parsedUrl: C,
          isDraftMode: A,
          prerenderManifest: x,
          routerServerContext: P,
          isOnDemandRevalidate: I,
          revalidateOnlyGenerated: S,
          resolvedPathname: T,
          clientReferenceManifest: N,
          serverActionsManifest: M,
        } = _,
        j = (0, c.normalizeAppPath)(w),
        O = !!(x.dynamicRoutes[j] || x.routes[T]),
        U = async () => (
          (null == P ? void 0 : P.render404)
            ? await P.render404(e, t, C, !1)
            : t.end('This page could not be found'),
          null
        )
      if (O && !A) {
        let e = !!x.routes[T],
          t = x.dynamicRoutes[j]
        if (t && !1 === t.fallback && !e) {
          if (E.experimental.adapterPath) return await U()
          throw new f.NoFallbackError()
        }
      }
      let q = null
      !O || k.isDev || A || (q = '/index' === (q = T) ? '/' : q)
      let B = !0 === k.isDev || !O,
        D = O && !B
      M &&
        N &&
        (0, n.setReferenceManifestsSingleton)({
          page: w,
          clientReferenceManifest: N,
          serverActionsManifest: M,
          serverModuleMap: (0, o.createServerModuleMap)({ serverActionsManifest: M }),
        })
      let H = e.method || 'GET',
        F = (0, i.getTracer)(),
        $ = F.getActiveScopeSpan(),
        K = {
          params: b,
          prerenderManifest: x,
          renderOpts: {
            experimental: { authInterrupts: !!E.experimental.authInterrupts },
            cacheComponents: !!E.cacheComponents,
            supportsDynamicResponse: B,
            incrementalCache: (0, s.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: E.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => k.onRequestError(e, t, a, P),
          },
          sharedContext: { buildId: y },
        },
        L = new l.NodeNextRequest(e),
        V = new l.NodeNextResponse(t),
        W = d.NextRequestAdapter.fromNodeNextRequest(L, (0, d.signalFromNodeResponse)(t))
      try {
        let n = async (e) =>
            k.handle(W, K).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = F.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== u.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = r.get('next.route')
              if (a) {
                let t = `${H} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${H} ${w}`)
            }),
          o = !!(0, s.getRequestMeta)(e, 'minimalMode'),
          c = async (s) => {
            var i, c
            let l = async ({ previousCacheEntry: r }) => {
                try {
                  if (!o && I && S && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let i = await n(s)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let c = K.renderOpts.pendingWaitUntil
                  c && a.waitUntil && (a.waitUntil(c), (c = void 0))
                  let l = K.renderOpts.collectedTags
                  if (!O)
                    return (await (0, v.sendResponse)(L, V, i, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await i.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(i.headers)
                    ;(l && (t[m.NEXT_CACHE_TAGS_HEADER] = l),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= m.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      a =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= m.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: R.CachedRouteKind.APP_ROUTE,
                        status: i.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: a },
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
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: I,
                          }),
                        },
                        P
                      )),
                    t
                  )
                }
              },
              d = await k.handleResponse({
                req: e,
                nextConfig: E,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: x,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: I,
                revalidateOnlyGenerated: S,
                responseGenerator: l,
                waitUntil: a.waitUntil,
                isMinimalMode: o,
              })
            if (!O) return null
            if (
              (null == d || null == (i = d.value) ? void 0 : i.kind) !== R.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == d || null == (c = d.value) ? void 0 : c.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(o ||
              t.setHeader(
                'x-nextjs-cache',
                I ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let u = (0, h.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (o && O) || u.delete(m.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                u.get('Cache-Control') ||
                u.set('Cache-Control', (0, g.getCacheControlHeader)(d.cacheControl)),
              await (0, v.sendResponse)(
                L,
                V,
                new Response(d.value.body, { headers: u, status: d.value.status || 200 })
              ),
              null
            )
          }
        $
          ? await c($)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                u.BaseServerSpan.handleRequest,
                {
                  spanName: `${H} ${w}`,
                  kind: i.SpanKind.SERVER,
                  attributes: { 'http.method': H, 'http.target': e.url },
                },
                c
              )
            )
      } catch (t) {
        if (
          (t instanceof f.NoFallbackError ||
            (await k.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: j,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: I,
              }),
            })),
          O)
        )
          throw t
        return (await (0, v.sendResponse)(L, V, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => M,
        'patchFetch',
        () => N,
        'routeModule',
        () => k,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => I,
        'workUnitAsyncStorage',
        () => S,
      ],
      942191
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4107c506._.js.map
