module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  635976,
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
      w = e.i(493458),
      b = e.i(79832),
      E = e.i(657446)
    async function k({ params: e }) {
      try {
        let t = await b.default.api.getSession({ headers: await (0, w.headers)() })
        if (!t || t.user?.role !== 'ADMIN')
          return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r } = await e,
          a = await E.prisma.booking.findUnique({
            where: { id: r },
            select: {
              id: !0,
              bookingNumber: !0,
              status: !0,
              payments: { select: { id: !0, status: !0 } },
            },
          })
        if (!a) return g.NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        if (a.payments.some((e) => 'PAID' === e.status || 'COMPLETED' === e.status))
          return g.NextResponse.json(
            {
              error: 'Cannot delete booking with active payments',
              message: '활성 결제가 있는 예약은 삭제할 수 없습니다. 먼저 예약을 취소해주세요.',
            },
            { status: 400 }
          )
        return (
          await E.prisma.$transaction(async (e) => {
            ;(await e.bookingService.deleteMany({ where: { bookingPet: { bookingId: r } } }),
              await e.bookingPet.deleteMany({ where: { bookingId: r } }),
              await e.payment.updateMany({ where: { bookingId: r }, data: { bookingId: null } }),
              await e.booking.delete({ where: { id: r } }))
          }),
          console.log(`[Delete] Booking ${a.bookingNumber} deleted by admin`),
          g.NextResponse.json({ success: !0, message: '예약이 삭제되었습니다.' })
        )
      } catch (e) {
        return (
          console.error('[Delete] Error:', e),
          g.NextResponse.json(
            {
              error: 'Internal server error',
              message: e instanceof Error ? e.message : 'Unknown error occurred',
            },
            { status: 500 }
          )
        )
      }
    }
    e.s(['DELETE', () => k], 233650)
    var y = e.i(233650)
    let x = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/bookings/[id]/route',
          pathname: '/api/admin/bookings/[id]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/bookings/[id]/route.ts',
        nextConfigOutput: 'standalone',
        userland: y,
      }),
      { workAsyncStorage: C, workUnitAsyncStorage: P, serverHooks: A } = x
    function N() {
      return (0, a.patchFetch)({ workAsyncStorage: C, workUnitAsyncStorage: P })
    }
    async function T(e, t, a) {
      x.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let g = '/api/admin/bookings/[id]/route'
      g = g.replace(/\/index$/, '') || '/'
      let w = await x.prepare(e, t, { srcPage: g, multiZoneDraftMode: !1 })
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
          nextConfig: k,
          parsedUrl: y,
          isDraftMode: C,
          prerenderManifest: P,
          routerServerContext: A,
          isOnDemandRevalidate: N,
          revalidateOnlyGenerated: T,
          resolvedPathname: j,
          clientReferenceManifest: O,
          serverActionsManifest: S,
        } = w,
        M = (0, l.normalizeAppPath)(g),
        D = !!(P.dynamicRoutes[M] || P.routes[j]),
        I = async () => (
          (null == A ? void 0 : A.render404)
            ? await A.render404(e, t, y, !1)
            : t.end('This page could not be found'),
          null
        )
      if (D && !C) {
        let e = !!P.routes[j],
          t = P.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (k.experimental.adapterPath) return await I()
          throw new _.NoFallbackError()
        }
      }
      let U = null
      !D || x.isDev || C || (U = '/index' === (U = j) ? '/' : U)
      let q = !0 === x.isDev || !D,
        H = D && !q
      S &&
        O &&
        (0, o.setReferenceManifestsSingleton)({
          page: g,
          clientReferenceManifest: O,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let $ = e.method || 'GET',
        F = (0, s.getTracer)(),
        K = F.getActiveScopeSpan(),
        B = {
          params: E,
          prerenderManifest: P,
          renderOpts: {
            experimental: { authInterrupts: !!k.experimental.authInterrupts },
            cacheComponents: !!k.cacheComponents,
            supportsDynamicResponse: q,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: k.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => x.onRequestError(e, t, a, A),
          },
          sharedContext: { buildId: b },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            x.handle(V, B).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = F.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = r.get('next.route')
              if (a) {
                let t = `${$} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${$} ${g}`)
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
                  e.fetchMetrics = B.renderOpts.fetchMetrics
                  let l = B.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = B.renderOpts.collectedTags
                  if (!D)
                    return (await (0, h.sendResponse)(L, G, s, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[R.NEXT_CACHE_TAGS_HEADER] = d),
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
                      (await x.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: g,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: N,
                          }),
                        },
                        A
                      )),
                    t
                  )
                }
              },
              u = await x.handleResponse({
                req: e,
                nextConfig: k,
                cacheKey: U,
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
            if (!D) return null
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
              C &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && D) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
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
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${$} ${g}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof _.NoFallbackError ||
            (await x.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: N,
              }),
            })),
          D)
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
        () => N,
        'routeModule',
        () => x,
        'serverHooks',
        () => A,
        'workAsyncStorage',
        () => C,
        'workUnitAsyncStorage',
        () => P,
      ],
      635976
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

//# sourceMappingURL=%5Broot-of-the-server%5D__92bb4476._.js.map
