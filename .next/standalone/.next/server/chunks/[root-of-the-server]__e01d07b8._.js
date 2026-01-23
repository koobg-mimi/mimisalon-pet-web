module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  793553,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      s = e.i(996250),
      a = e.i(759756),
      n = e.i(561916),
      o = e.i(114444),
      i = e.i(837092),
      u = e.i(869741),
      l = e.i(316795),
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      v = e.i(626937),
      R = e.i(10372),
      g = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      _ = e.i(89171),
      b = e.i(493458),
      E = e.i(79832),
      y = e.i(657446)
    async function k(e, { params: t }) {
      try {
        let e = await E.default.api.getSession({ headers: await (0, b.headers)() })
        if (!e?.user) return _.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        let { paymentId: r } = await t,
          s = await y.prisma.payment.findUnique({
            where: { paymentId: r },
            include: {
              booking: {
                include: {
                  customer: !0,
                  groomer: !0,
                  bookingPets: {
                    include: {
                      pet: { include: { breed: !0 } },
                      services: { include: { service: !0 } },
                    },
                  },
                  customerAddress: !0,
                },
              },
            },
          })
        if (!s)
          return _.NextResponse.json(
            {
              success: !1,
              status: 'NOT_FOUND',
              error: '결제 정보를 찾을 수 없습니다.',
              message: '결제가 아직 처리되지 않았습니다. 잠시 후 다시 시도해주세요.',
            },
            { status: 404 }
          )
        if (s.customerId && s.customerId !== e.user.id)
          return _.NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
        switch (s.status) {
          case 'PAID':
            return _.NextResponse.json({
              success: !0,
              payment: {
                id: s.id,
                paymentId: s.paymentId,
                amount: s.amount,
                method: s.method,
                status: s.status,
                paidAt: s.paidAt,
                receiptUrl: s.receiptUrl,
                booking: s.booking
                  ? {
                      id: s.booking.id,
                      bookingNumber: s.booking.bookingNumber,
                      serviceDate: s.booking.serviceDate,
                      serviceTime: s.booking.serviceTime,
                      status: s.booking.status,
                      groomer: s.booking.groomer ? { name: s.booking.groomer.name } : null,
                      pets: s.booking.bookingPets.map((e) => ({
                        name: e.pet.name,
                        breed: e.pet.breed?.name || '알 수 없음',
                        services: e.services.map((e) => ({
                          name: e.service.name,
                          price: e.servicePrice,
                          duration: e.service.durationMinutes,
                        })),
                      })),
                      address: s.booking.customerAddress
                        ? {
                            street: s.booking.customerAddress.street,
                            city: s.booking.customerAddress.city,
                            state: s.booking.customerAddress.state,
                            zipCode: s.booking.customerAddress.zipCode,
                          }
                        : null,
                    }
                  : null,
              },
            })
          case 'PENDING':
            return _.NextResponse.json({
              success: !1,
              status: 'PENDING',
              message: '결제가 처리 중입니다. 잠시 후 다시 확인해주세요.',
            })
          case 'FAILED':
            return _.NextResponse.json({
              success: !1,
              status: 'FAILED',
              error: s.failReason || '결제가 실패했습니다',
              message: '결제가 실패했습니다. 다시 시도해주세요.',
            })
          case 'CANCELLED':
            return _.NextResponse.json({
              success: !1,
              status: 'CANCELLED',
              error: s.cancelReason || '결제가 취소되었습니다',
              message: '결제가 취소되었습니다.',
            })
          default:
            return _.NextResponse.json({
              success: !1,
              status: s.status,
              message: '결제 상태를 확인할 수 없습니다.',
            })
        }
      } catch (e) {
        return (
          console.error('[Payment Status Check] Error:', e),
          _.NextResponse.json({ error: '결제 상태 확인 중 오류가 발생했습니다' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => k], 146011)
    var w = e.i(146011)
    let x = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/payments/verify/[paymentId]/route',
          pathname: '/api/payments/verify/[paymentId]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/payments/verify/[paymentId]/route.ts',
        nextConfigOutput: 'standalone',
        userland: w,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: C, serverHooks: N } = x
    function P() {
      return (0, s.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: C })
    }
    async function j(e, t, s) {
      x.isDev && (0, a.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let _ = '/api/payments/verify/[paymentId]/route'
      _ = _.replace(/\/index$/, '') || '/'
      let b = await x.prepare(e, t, { srcPage: _, multiZoneDraftMode: !1 })
      if (!b)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == s.waitUntil || s.waitUntil.call(s, Promise.resolve()),
          null
        )
      let {
          buildId: E,
          params: y,
          nextConfig: k,
          parsedUrl: w,
          isDraftMode: A,
          prerenderManifest: C,
          routerServerContext: N,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: j,
          resolvedPathname: I,
          clientReferenceManifest: T,
          serverActionsManifest: D,
        } = b,
        O = (0, u.normalizeAppPath)(_),
        S = !!(C.dynamicRoutes[O] || C.routes[I]),
        U = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, w, !1)
            : t.end('This page could not be found'),
          null
        )
      if (S && !A) {
        let e = !!C.routes[I],
          t = C.dynamicRoutes[O]
        if (t && !1 === t.fallback && !e) {
          if (k.experimental.adapterPath) return await U()
          throw new g.NoFallbackError()
        }
      }
      let q = null
      !S || x.isDev || A || (q = '/index' === (q = I) ? '/' : q)
      let H = !0 === x.isDev || !S,
        M = S && !H
      D &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: _,
          clientReferenceManifest: T,
          serverActionsManifest: D,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: D }),
        })
      let F = e.method || 'GET',
        L = (0, n.getTracer)(),
        $ = L.getActiveScopeSpan(),
        K = {
          params: y,
          prerenderManifest: C,
          renderOpts: {
            experimental: { authInterrupts: !!k.experimental.authInterrupts },
            cacheComponents: !!k.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, a.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: k.cacheLife,
            waitUntil: s.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, s) => x.onRequestError(e, t, s, N),
          },
          sharedContext: { buildId: E },
        },
        G = new l.NodeNextRequest(e),
        B = new l.NodeNextResponse(t),
        z = d.NextRequestAdapter.fromNodeNextRequest(G, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            x.handle(z, K).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = L.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let s = r.get('next.route')
              if (s) {
                let t = `${F} ${s}`
                ;(e.setAttributes({ 'next.route': s, 'http.route': s, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${F} ${_}`)
            }),
          i = !!(0, a.getRequestMeta)(e, 'minimalMode'),
          u = async (a) => {
            var n, u
            let l = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && j && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let n = await o(a)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let u = K.renderOpts.pendingWaitUntil
                  u && s.waitUntil && (s.waitUntil(u), (u = void 0))
                  let l = K.renderOpts.collectedTags
                  if (!S)
                    return (await (0, m.sendResponse)(G, B, n, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await n.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(n.headers)
                    ;(l && (t[R.NEXT_CACHE_TAGS_HEADER] = l),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      s =
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
                      cacheControl: { revalidate: r, expire: s },
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
                          routePath: _,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: M,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              d = await x.handleResponse({
                req: e,
                nextConfig: k,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: C,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: j,
                responseGenerator: l,
                waitUntil: s.waitUntil,
                isMinimalMode: i,
              })
            if (!S) return null
            if (
              (null == d || null == (n = d.value) ? void 0 : n.kind) !== f.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == d || null == (u = d.value) ? void 0 : u.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(i ||
              t.setHeader(
                'x-nextjs-cache',
                P ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && S) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(d.cacheControl)),
              await (0, m.sendResponse)(
                G,
                B,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
              ),
              null
            )
          }
        $
          ? await u($)
          : await L.withPropagatedContext(e.headers, () =>
              L.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${_}`,
                  kind: n.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                u
              )
            )
      } catch (t) {
        if (
          (t instanceof g.NoFallbackError ||
            (await x.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: O,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: M,
                isOnDemandRevalidate: P,
              }),
            })),
          S)
        )
          throw t
        return (await (0, m.sendResponse)(G, B, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => j,
        'patchFetch',
        () => P,
        'routeModule',
        () => x,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => C,
      ],
      793553
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

//# sourceMappingURL=%5Broot-of-the-server%5D__e01d07b8._.js.map
