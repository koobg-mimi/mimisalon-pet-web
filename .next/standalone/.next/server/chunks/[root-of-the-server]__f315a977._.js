module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  508791,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      n = e.i(759756),
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
      R = e.i(10372),
      _ = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      E = e.i(89171),
      g = e.i(493458),
      w = e.i(79832),
      b = e.i(657446)
    async function C(e, { params: t }) {
      try {
        let e = await w.default.api.getSession({ headers: await (0, g.headers)() })
        if (!e?.user || 'GROOMER' !== e.user.role)
          return E.NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 403 })
        let { id: r } = await t,
          a = await b.prisma.booking.findFirst({ where: { id: r, groomerId: e.user.id } })
        if (!a) return E.NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
        if (a.status === b.BookingStatus.SERVICE_COMPLETED)
          return E.NextResponse.json({ error: '이미 완료된 예약입니다' }, { status: 400 })
        let n = await b.prisma.booking.update({
          where: { id: r },
          data: { status: b.BookingStatus.SERVICE_COMPLETED, actualEndTime: new Date() },
        })
        return E.NextResponse.json({
          success: !0,
          booking: { id: n.id, status: n.status, actualEndTime: n.actualEndTime },
        })
      } catch (e) {
        return (
          console.error('Service completion error:', e),
          E.NextResponse.json({ error: '서비스 완료 처리 중 오류가 발생했습니다' }, { status: 500 })
        )
      }
    }
    e.s(['POST', () => C], 978083)
    var x = e.i(978083)
    let k = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/groomer/bookings/[id]/complete/route',
          pathname: '/api/groomer/bookings/[id]/complete',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/groomer/bookings/[id]/complete/route.ts',
        nextConfigOutput: 'standalone',
        userland: x,
      }),
      { workAsyncStorage: P, workUnitAsyncStorage: y, serverHooks: T } = k
    function A() {
      return (0, a.patchFetch)({ workAsyncStorage: P, workUnitAsyncStorage: y })
    }
    async function N(e, t, a) {
      k.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let E = '/api/groomer/bookings/[id]/complete/route'
      E = E.replace(/\/index$/, '') || '/'
      let g = await k.prepare(e, t, { srcPage: E, multiZoneDraftMode: !1 })
      if (!g)
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
          parsedUrl: x,
          isDraftMode: P,
          prerenderManifest: y,
          routerServerContext: T,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: N,
          resolvedPathname: S,
          clientReferenceManifest: O,
          serverActionsManifest: j,
        } = g,
        M = (0, l.normalizeAppPath)(E),
        I = !!(y.dynamicRoutes[M] || y.routes[S]),
        q = async () => (
          (null == T ? void 0 : T.render404)
            ? await T.render404(e, t, x, !1)
            : t.end('This page could not be found'),
          null
        )
      if (I && !P) {
        let e = !!y.routes[S],
          t = y.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await q()
          throw new _.NoFallbackError()
        }
      }
      let H = null
      !I || k.isDev || P || (H = '/index' === (H = S) ? '/' : H)
      let D = !0 === k.isDev || !I,
        U = I && !D
      j &&
        O &&
        (0, s.setReferenceManifestsSingleton)({
          page: E,
          clientReferenceManifest: O,
          serverActionsManifest: j,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: j }),
        })
      let F = e.method || 'GET',
        $ = (0, o.getTracer)(),
        K = $.getActiveScopeSpan(),
        B = {
          params: b,
          prerenderManifest: y,
          renderOpts: {
            experimental: { authInterrupts: !!C.experimental.authInterrupts },
            cacheComponents: !!C.cacheComponents,
            supportsDynamicResponse: D,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: C.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => k.onRequestError(e, t, a, T),
          },
          sharedContext: { buildId: w },
        },
        L = new u.NodeNextRequest(e),
        V = new u.NodeNextResponse(t),
        G = d.NextRequestAdapter.fromNodeNextRequest(L, (0, d.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            k.handle(G, B).finally(() => {
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
              } else e.updateName(`${F} ${E}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var o, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && A && N && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await s(n)
                  e.fetchMetrics = B.renderOpts.fetchMetrics
                  let l = B.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = B.renderOpts.collectedTags
                  if (!I)
                    return (await (0, h.sendResponse)(L, V, o, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(u && (t[R.NEXT_CACHE_TAGS_HEADER] = u),
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
                        status: o.status,
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
                          routePath: E,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: U,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        T
                      )),
                    t
                  )
                }
              },
              d = await k.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: H,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: y,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: N,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!I) return null
            if (
              (null == d || null == (o = d.value) ? void 0 : o.kind) !== f.CachedRouteKind.APP_ROUTE
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
              P &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && I) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                L,
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
                  spanName: `${F} ${E}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof _.NoFallbackError ||
            (await k.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: U,
                isOnDemandRevalidate: A,
              }),
            })),
          I)
        )
          throw t
        return (await (0, h.sendResponse)(L, V, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => N,
        'patchFetch',
        () => A,
        'routeModule',
        () => k,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => P,
        'workUnitAsyncStorage',
        () => y,
      ],
      508791
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f315a977._.js.map
