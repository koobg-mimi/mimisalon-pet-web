module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  765047,
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
      w = e.i(89171),
      g = e.i(493458),
      E = e.i(79832),
      x = e.i(657446)
    async function C(e) {
      try {
        let t = await E.default.api.getSession({ headers: await (0, g.headers)() })
        if (!t?.user?.id) return new w.NextResponse('Unauthorized', { status: 401 })
        if ('CUSTOMER' !== t.user.role)
          return new w.NextResponse('Forbidden - Customer access only', { status: 403 })
        let { searchParams: r } = new URL(e.url),
          a = r.get('addressId')
        if (!a) return new w.NextResponse('addressId parameter is required', { status: 400 })
        let s = await x.prisma.address.findFirst({ where: { id: a, customerId: t.user.id } })
        if (!s) return new w.NextResponse('Address not found or access denied', { status: 404 })
        let n = (
          await x.prisma.user.findMany({
            where: {
              role: 'GROOMER',
              workAreas: {
                some: {
                  isActive: !0,
                  OR: [
                    { address: { contains: s.city, mode: 'insensitive' } },
                    { address: { contains: s.state, mode: 'insensitive' } },
                    { id: { not: void 0 } },
                  ],
                },
              },
            },
            include: {
              workAreas: { where: { isActive: !0 } },
              schedule: !0,
              _count: { select: { groomerBookings: { where: { status: 'SERVICE_COMPLETED' } } } },
            },
          })
        ).map((e) => ({
          id: e.id,
          name: e.name || 'Unknown Groomer',
          rating: 4.5,
          availability: [],
          location: e.workAreas[0]?.name || `${s.city} 지역`,
          workAreas: e.workAreas.map((e) => ({ id: e.id, name: e.name, address: e.address })),
          totalBookings: e._count.groomerBookings,
        }))
        return w.NextResponse.json(n)
      } catch (e) {
        return (
          console.error('Failed to fetch groomers:', e),
          new w.NextResponse('Internal Server Error', { status: 500 })
        )
      }
    }
    e.s(['GET', () => C], 467277)
    var A = e.i(467277)
    let b = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/groomers/route',
          pathname: '/api/customer/groomers',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/groomers/route.ts',
        nextConfigOutput: 'standalone',
        userland: A,
      }),
      { workAsyncStorage: y, workUnitAsyncStorage: k, serverHooks: N } = b
    function P() {
      return (0, a.patchFetch)({ workAsyncStorage: y, workUnitAsyncStorage: k })
    }
    async function T(e, t, a) {
      b.isDev && (0, s.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/customer/groomers/route'
      w = w.replace(/\/index$/, '') || '/'
      let g = await b.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!g)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: E,
          params: x,
          nextConfig: C,
          parsedUrl: A,
          isDraftMode: y,
          prerenderManifest: k,
          routerServerContext: N,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: T,
          resolvedPathname: O,
          clientReferenceManifest: S,
          serverActionsManifest: j,
        } = g,
        I = (0, l.normalizeAppPath)(w),
        M = !!(k.dynamicRoutes[I] || k.routes[O]),
        U = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, A, !1)
            : t.end('This page could not be found'),
          null
        )
      if (M && !y) {
        let e = !!k.routes[O],
          t = k.dynamicRoutes[I]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await U()
          throw new _.NoFallbackError()
        }
      }
      let q = null
      !M || b.isDev || y || (q = '/index' === (q = O) ? '/' : q)
      let H = !0 === b.isDev || !M,
        D = M && !H
      j &&
        S &&
        (0, o.setReferenceManifestsSingleton)({
          page: w,
          clientReferenceManifest: S,
          serverActionsManifest: j,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: j }),
        })
      let F = e.method || 'GET',
        $ = (0, n.getTracer)(),
        B = $.getActiveScopeSpan(),
        K = {
          params: x,
          prerenderManifest: k,
          renderOpts: {
            experimental: { authInterrupts: !!C.experimental.authInterrupts },
            cacheComponents: !!C.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, s.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: C.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => b.onRequestError(e, t, a, N),
          },
          sharedContext: { buildId: E },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            b.handle(V, K).finally(() => {
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
              } else e.updateName(`${F} ${w}`)
            }),
          i = !!(0, s.getRequestMeta)(e, 'minimalMode'),
          l = async (s) => {
            var n, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && T && !r)
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
                  let d = K.renderOpts.collectedTags
                  if (!M)
                    return (await (0, h.sendResponse)(L, G, n, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await n.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(n.headers)
                    ;(d && (t[R.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      a =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: f.CachedRouteKind.APP_ROUTE,
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
                      (await b.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              u = await b.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: k,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: T,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!M) return null
            if (
              (null == u || null == (n = u.value) ? void 0 : n.kind) !== f.CachedRouteKind.APP_ROUTE
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
                P ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
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
                L,
                G,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        B
          ? await l(B)
          : await $.withPropagatedContext(e.headers, () =>
              $.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${w}`,
                  kind: n.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof _.NoFallbackError ||
            (await b.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: I,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: P,
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
        () => T,
        'patchFetch',
        () => P,
        'routeModule',
        () => b,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => y,
        'workUnitAsyncStorage',
        () => k,
      ],
      765047
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

//# sourceMappingURL=%5Broot-of-the-server%5D__750fd587._.js.map
