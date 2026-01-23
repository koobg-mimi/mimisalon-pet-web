module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  854752,
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
      g = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      f = e.i(89171),
      E = e.i(493458),
      b = e.i(79832),
      S = e.i(657446)
    async function w({ params: e }) {
      try {
        let t = await b.default.api.getSession({ headers: await (0, E.headers)() })
        if (!t || t.user?.role !== 'ADMIN')
          return f.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r } = await e,
          a = await S.prisma.booking.findUnique({
            where: { id: r },
            select: { id: !0, status: !0, bookingNumber: !0, serviceDate: !0, serviceTime: !0 },
          })
        if (!a) return f.NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        let n = [S.BookingStatus.WORK_IN_PROGRESS, S.BookingStatus.ADDITIONAL_PAYMENT_COMPLETE]
        if (!n.includes(a.status))
          return f.NextResponse.json(
            { error: 'Invalid status for completion', currentStatus: a.status, allowedStatuses: n },
            { status: 400 }
          )
        let o = await S.prisma.booking.update({
          where: { id: r },
          data: {
            status: S.BookingStatus.SERVICE_COMPLETED,
            paymentStatus: S.PaymentStatus.COMPLETED,
            completedAt: new Date(),
            actualEndTime: new Date(),
          },
          include: {
            customer: { select: { id: !0, name: !0, email: !0, phoneNumber: !0 } },
            groomer: { select: { id: !0, name: !0, email: !0, phoneNumber: !0 } },
            bookingPets: { include: { pet: !0, services: { include: { service: !0 } } } },
            payments: !0,
          },
        })
        return (
          console.log(`[Complete] Booking ${a.bookingNumber} completed by admin`),
          f.NextResponse.json({
            success: !0,
            booking: {
              ...o,
              createdAt: o.createdAt.toISOString(),
              updatedAt: o.updatedAt.toISOString(),
              serviceDate: o.serviceDate.toISOString(),
              confirmedAt: o.confirmedAt?.toISOString() ?? null,
              cancelledAt: o.cancelledAt?.toISOString() ?? null,
              completedAt: o.completedAt?.toISOString() ?? null,
              actualStartTime: o.actualStartTime?.toISOString() ?? null,
              actualEndTime: o.actualEndTime?.toISOString() ?? null,
            },
            message: '서비스가 완료 처리되었습니다.',
          })
        )
      } catch (e) {
        return (
          console.error('[Complete] Error:', e),
          f.NextResponse.json(
            {
              error: 'Internal server error',
              message: e instanceof Error ? e.message : 'Unknown error occurred',
            },
            { status: 500 }
          )
        )
      }
    }
    e.s(['PATCH', () => w], 691125)
    var A = e.i(691125)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/bookings/[id]/complete/route',
          pathname: '/api/admin/bookings/[id]/complete',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/bookings/[id]/complete/route.ts',
        nextConfigOutput: 'standalone',
        userland: A,
      }),
      { workAsyncStorage: k, workUnitAsyncStorage: x, serverHooks: N } = C
    function P() {
      return (0, a.patchFetch)({ workAsyncStorage: k, workUnitAsyncStorage: x })
    }
    async function T(e, t, a) {
      C.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let f = '/api/admin/bookings/[id]/complete/route'
      f = f.replace(/\/index$/, '') || '/'
      let E = await C.prepare(e, t, { srcPage: f, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: b,
          params: S,
          nextConfig: w,
          parsedUrl: A,
          isDraftMode: k,
          prerenderManifest: x,
          routerServerContext: N,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: T,
          resolvedPathname: O,
          clientReferenceManifest: y,
          serverActionsManifest: I,
        } = E,
        j = (0, l.normalizeAppPath)(f),
        D = !!(x.dynamicRoutes[j] || x.routes[O]),
        M = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, A, !1)
            : t.end('This page could not be found'),
          null
        )
      if (D && !k) {
        let e = !!x.routes[O],
          t = x.dynamicRoutes[j]
        if (t && !1 === t.fallback && !e) {
          if (w.experimental.adapterPath) return await M()
          throw new g.NoFallbackError()
        }
      }
      let U = null
      !D || C.isDev || k || (U = '/index' === (U = O) ? '/' : U)
      let q = !0 === C.isDev || !D,
        H = D && !q
      I &&
        y &&
        (0, s.setReferenceManifestsSingleton)({
          page: f,
          clientReferenceManifest: y,
          serverActionsManifest: I,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: I }),
        })
      let B = e.method || 'GET',
        $ = (0, o.getTracer)(),
        K = $.getActiveScopeSpan(),
        L = {
          params: S,
          prerenderManifest: x,
          renderOpts: {
            experimental: { authInterrupts: !!w.experimental.authInterrupts },
            cacheComponents: !!w.cacheComponents,
            supportsDynamicResponse: q,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: w.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => C.onRequestError(e, t, a, N),
          },
          sharedContext: { buildId: b },
        },
        F = new u.NodeNextRequest(e),
        G = new u.NodeNextResponse(t),
        V = d.NextRequestAdapter.fromNodeNextRequest(F, (0, d.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            C.handle(V, L).finally(() => {
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
                let t = `${B} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${B} ${f}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var o, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && T && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await s(n)
                  e.fetchMetrics = L.renderOpts.fetchMetrics
                  let l = L.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = L.renderOpts.collectedTags
                  if (!D)
                    return (await (0, h.sendResponse)(F, G, o, L.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(u && (t[R.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== L.renderOpts.collectedRevalidate &&
                        !(L.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        L.renderOpts.collectedRevalidate,
                      a =
                        void 0 === L.renderOpts.collectedExpire ||
                        L.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : L.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: _.CachedRouteKind.APP_ROUTE,
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
                      (await C.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: f,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              d = await C.handleResponse({
                req: e,
                nextConfig: w,
                cacheKey: U,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: x,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: T,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!D) return null
            if (
              (null == d || null == (o = d.value) ? void 0 : o.kind) !== _.CachedRouteKind.APP_ROUTE
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
                P ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              k &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && D) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                F,
                G,
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
                  spanName: `${B} ${f}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': B, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof g.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: j,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: P,
              }),
            })),
          D)
        )
          throw t
        return (await (0, h.sendResponse)(F, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => T,
        'patchFetch',
        () => P,
        'routeModule',
        () => C,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => k,
        'workUnitAsyncStorage',
        () => x,
      ],
      854752
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c896b966._.js.map
