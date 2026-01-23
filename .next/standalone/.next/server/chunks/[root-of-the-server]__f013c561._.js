module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  630492,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      s = e.i(759756),
      n = e.i(561916),
      o = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      u = e.i(316795),
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      v = e.i(626937),
      f = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var w = e.i(600220),
      g = e.i(89171),
      _ = e.i(493458),
      x = e.i(79832),
      E = e.i(657446)
    async function b(e) {
      try {
        let t = await x.default.api.getSession({ headers: await (0, _.headers)() })
        if (!t?.user?.email) return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if ('CUSTOMER' !== t.user.role)
          return g.NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        let r = await E.prisma.user.findUnique({ where: { email: t.user.email } })
        if (!r) return g.NextResponse.json({ error: 'User not found' }, { status: 404 })
        let a = await e.formData(),
          s = a.get('bookingId'),
          n = parseInt(a.get('rating'), 10),
          o = a.get('comment'),
          i = a.getAll('images')
        if (!s || !n || !o)
          return g.NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        if (n < 1 || n > 5)
          return g.NextResponse.json({ error: 'Invalid rating value' }, { status: 400 })
        let l = await E.prisma.booking.findUnique({
          where: { id: s, customerId: r.id },
          include: { reviews: { where: { customerId: r.id } } },
        })
        if (!l) return g.NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        if ('SERVICE_COMPLETED' !== l.status)
          return g.NextResponse.json({ error: 'Cannot review incomplete booking' }, { status: 400 })
        if (l.reviews.length > 0)
          return g.NextResponse.json(
            { error: 'Review already exists for this booking' },
            { status: 400 }
          )
        let u = []
        for (let e = 0; e < i.length; e++) {
          let t = i[e],
            r = await t.arrayBuffer(),
            a = Buffer.from(r).toString('base64'),
            s = `data:${t.type};base64,${a}`
          u.push({ url: s, filename: t.name, mimeType: t.type, size: t.size, order: e })
        }
        let d = await E.prisma.review.create({
          data: { bookingId: s, customerId: r.id, rating: n, comment: o, images: { create: u } },
          include: { images: !0, customer: { select: { id: !0, name: !0, image: !0 } } },
        })
        return (
          await E.prisma.booking.update({
            where: { id: s },
            data: { customerRating: n, customerReview: o, reviewDate: new Date() },
          }),
          g.NextResponse.json({
            success: !0,
            review: {
              id: d.id,
              rating: d.rating,
              comment: d.comment,
              images: d.images.map((e) => ({ id: e.id, url: e.url, order: e.order })),
              createdAt: d.createdAt,
              customer: d.customer,
            },
          })
        )
      } catch (e) {
        return (
          console.error('Review creation error:', e),
          g.NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
        )
      }
    }
    async function y(e) {
      try {
        let t = await x.default.api.getSession({ headers: await (0, _.headers)() })
        if (!t?.user?.email) return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let r = await E.prisma.user.findUnique({ where: { email: t.user.email } })
        if (!r) return g.NextResponse.json({ error: 'User not found' }, { status: 404 })
        let { searchParams: a } = new URL(e.url),
          s = a.get('bookingId')
        if (s) {
          let e = await E.prisma.review.findFirst({
            where: { bookingId: s, customerId: r.id },
            include: {
              images: { orderBy: { order: 'asc' } },
              response: !0,
              booking: {
                select: {
                  id: !0,
                  serviceDate: !0,
                  groomer: { select: { id: !0, name: !0, image: !0 } },
                },
              },
            },
          })
          if (!e) return g.NextResponse.json({ error: 'Review not found' }, { status: 404 })
          return g.NextResponse.json(e)
        }
        {
          let e = await E.prisma.review.findMany({
            where: { customerId: r.id },
            include: {
              images: { orderBy: { order: 'asc' } },
              response: !0,
              booking: {
                select: {
                  id: !0,
                  serviceDate: !0,
                  serviceType: !0,
                  groomer: { select: { id: !0, name: !0, image: !0 } },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          })
          return g.NextResponse.json(e)
        }
      } catch (e) {
        return (
          console.error('Review fetch error:', e),
          g.NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => y, 'POST', () => b], 177711)
    var C = e.i(177711)
    let N = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/reviews/route',
          pathname: '/api/customer/reviews',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/reviews/route.ts',
        nextConfigOutput: 'standalone',
        userland: C,
      }),
      { workAsyncStorage: j, workUnitAsyncStorage: k, serverHooks: A } = N
    function P() {
      return (0, a.patchFetch)({ workAsyncStorage: j, workUnitAsyncStorage: k })
    }
    async function T(e, t, a) {
      N.isDev && (0, s.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let g = '/api/customer/reviews/route'
      g = g.replace(/\/index$/, '') || '/'
      let _ = await N.prepare(e, t, { srcPage: g, multiZoneDraftMode: !1 })
      if (!_)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: x,
          params: E,
          nextConfig: b,
          parsedUrl: y,
          isDraftMode: C,
          prerenderManifest: j,
          routerServerContext: k,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: P,
          resolvedPathname: T,
          clientReferenceManifest: S,
          serverActionsManifest: I,
        } = _,
        U = (0, l.normalizeAppPath)(g),
        O = !!(j.dynamicRoutes[U] || j.routes[T]),
        q = async () => (
          (null == k ? void 0 : k.render404)
            ? await k.render404(e, t, y, !1)
            : t.end('This page could not be found'),
          null
        )
      if (O && !C) {
        let e = !!j.routes[T],
          t = j.dynamicRoutes[U]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await q()
          throw new R.NoFallbackError()
        }
      }
      let M = null
      !O || N.isDev || C || (M = '/index' === (M = T) ? '/' : M)
      let D = !0 === N.isDev || !O,
        H = O && !D
      I &&
        S &&
        (0, o.setReferenceManifestsSingleton)({
          page: g,
          clientReferenceManifest: S,
          serverActionsManifest: I,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: I }),
        })
      let F = e.method || 'GET',
        B = (0, n.getTracer)(),
        $ = B.getActiveScopeSpan(),
        K = {
          params: E,
          prerenderManifest: j,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: D,
            incrementalCache: (0, s.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => N.onRequestError(e, t, a, k),
          },
          sharedContext: { buildId: x },
        },
        L = new u.NodeNextRequest(e),
        z = new u.NodeNextResponse(t),
        G = d.NextRequestAdapter.fromNodeNextRequest(L, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            N.handle(G, K).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = B.getRootSpanAttributes()
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
              } else e.updateName(`${F} ${g}`)
            }),
          i = !!(0, s.getRequestMeta)(e, 'minimalMode'),
          l = async (s) => {
            var n, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && A && P && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let n = await o(s)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = K.renderOpts.collectedTags
                  if (!O)
                    return (await (0, m.sendResponse)(L, z, n, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await n.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(n.headers)
                    ;(u && (t[f.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= f.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      a =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= f.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: w.CachedRouteKind.APP_ROUTE,
                        status: n.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: a },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await N.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: g,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        k
                      )),
                    t
                  )
                }
              },
              d = await N.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: j,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: P,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!O) return null
            if (
              (null == d || null == (n = d.value) ? void 0 : n.kind) !== w.CachedRouteKind.APP_ROUTE
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
              C &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && O) || c.delete(f.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(d.cacheControl)),
              await (0, m.sendResponse)(
                L,
                z,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
              ),
              null
            )
          }
        $
          ? await l($)
          : await B.withPropagatedContext(e.headers, () =>
              B.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${g}`,
                  kind: n.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await N.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: U,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: A,
              }),
            })),
          O)
        )
          throw t
        return (await (0, m.sendResponse)(L, z, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => T,
        'patchFetch',
        () => P,
        'routeModule',
        () => N,
        'serverHooks',
        () => A,
        'workAsyncStorage',
        () => j,
        'workUnitAsyncStorage',
        () => k,
      ],
      630492
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f013c561._.js.map
