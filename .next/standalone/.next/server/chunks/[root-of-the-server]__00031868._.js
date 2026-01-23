module.exports = [
  254799,
  (e, t, n) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  518184,
  (e) => {
    'use strict'
    class t extends Error {
      constructor(e, t) {
        ;(super(e, t), (this.stack = Error(e, t).stack))
      }
    }
    e.s(['PortOneError', () => t])
  },
  584375,
  (e) => {
    'use strict'
    var t = e.i(747909),
      n = e.i(174017),
      a = e.i(996250),
      r = e.i(759756),
      s = e.i(561916),
      o = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      c = e.i(316795),
      u = e.i(487718),
      d = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      g = e.i(626937),
      R = e.i(10372),
      E = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      f = e.i(89171),
      v = e.i(493458),
      y = e.i(79832),
      C = e.i(657446),
      k = e.i(378725)
    async function N({ params: e }) {
      try {
        let t = await y.default.api.getSession({ headers: await (0, v.headers)() })
        if (!t || t.user?.role !== 'ADMIN')
          return f.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: n } = await e,
          a = await C.prisma.user.findUnique({
            where: { email: t.user.email },
            select: { id: !0, name: !0 },
          })
        if (!a) return f.NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
        let r = await C.prisma.booking.findUnique({
          where: { id: n },
          include: {
            payments: {
              where: { status: { in: [C.PaymentStatus.PAID, C.PaymentStatus.COMPLETED] } },
            },
            customer: { select: { name: !0, email: !0 } },
          },
        })
        if (!r) return f.NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        if (r.status === C.BookingStatus.SERVICE_CANCELLED)
          return f.NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 })
        if (
          ![
            C.BookingStatus.FIRST_PAYMENT_PENDING,
            C.BookingStatus.FIRST_PAYMENT_COMPLETE,
            C.BookingStatus.FIRST_PAYMENT_VERIFY,
            C.BookingStatus.GROOMER_CONFIRM_PENDING,
            C.BookingStatus.GROOMER_CONFIRM,
            C.BookingStatus.ADDITIONAL_PAYMENT_PENDING,
            C.BookingStatus.ADDITIONAL_PAYMENT_COMPLETE,
            C.BookingStatus.WORK_IN_PROGRESS,
            C.BookingStatus.SERVICE_COMPLETED,
          ].includes(r.status)
        )
          return f.NextResponse.json(
            { error: 'Booking cannot be cancelled in current status' },
            { status: 400 }
          )
        let s = [],
          o = [],
          i = r.status === C.BookingStatus.SERVICE_COMPLETED,
          l = i
            ? `관리자 환불 처리 - 예약번호: ${r.bookingNumber} (서비스 완료 후 환불)`
            : `관리자 예약 취소 - 예약번호: ${r.bookingNumber}`
        for (let e of r.payments)
          try {
            ;(console.log(`[Cancel] Processing payment cancellation for paymentId: ${e.paymentId}`),
              await (0, k.cancelPayment)(e.paymentId, l),
              s.push(e.paymentId),
              console.log(`[Cancel] Successfully cancelled payment: ${e.paymentId}`))
          } catch (t) {
            ;(console.error(`[Cancel] Failed to cancel payment ${e.paymentId}:`, t),
              t instanceof Error && t.message.includes('already cancelled')
                ? s.push(e.paymentId)
                : o.push({
                    paymentId: e.paymentId,
                    error: t instanceof Error ? t.message : 'Unknown error',
                  }))
          }
        if (0 === s.length && r.payments.length > 0)
          return f.NextResponse.json(
            { error: 'Failed to cancel all payments', details: o },
            { status: 500 }
          )
        let c = await C.prisma.$transaction(
          async (e) => (
            s.length > 0 &&
              (await e.payment.updateMany({
                where: { bookingId: n, paymentId: { in: s } },
                data: {
                  status: C.PaymentStatus.CANCELLED,
                  cancelledAt: new Date(),
                  cancelReason: i ? '관리자 환불 처리' : '관리자 예약 취소',
                  cancelledAmount: r.totalPrice,
                },
              })),
            await e.booking.update({
              where: { id: n },
              data: {
                status: C.BookingStatus.SERVICE_CANCELLED,
                paymentStatus: C.PaymentStatus.CANCELLED,
                cancelledAt: new Date(),
                cancelledBy: `${a.name} (${a.id})`,
                cancellationReason: i ? '관리자에 의한 환불 처리' : '관리자에 의한 예약 취소',
              },
              include: {
                customer: !0,
                groomer: !0,
                bookingPets: { include: { pet: !0, services: { include: { service: !0 } } } },
                payments: !0,
              },
            })
          )
        )
        return (
          console.log(`[Cancel] Booking ${r.bookingNumber} cancelled by admin ${a.name}`),
          console.log(`[Cancel] Customer: ${r.customer.name} (${r.customer.email})`),
          console.log(`[Cancel] Successful cancellations: ${s.length}`),
          console.log(`[Cancel] Failed cancellations: ${o.length}`),
          f.NextResponse.json({
            success: !0,
            booking: {
              id: c.id,
              bookingNumber: c.bookingNumber,
              status: c.status,
              cancelledAt: c.cancelledAt?.toISOString() ?? null,
              cancelledBy: c.cancelledBy,
              cancellationReason: c.cancellationReason,
            },
            cancellationResults: {
              totalPayments: r.payments.length,
              successfulCancellations: s.length,
              failedCancellations: o.length,
              details: o.length > 0 ? o : void 0,
            },
            message:
              o.length > 0
                ? i
                  ? `환불 처리되었습니다. 일부 결제 환불 실패 (${o.length}건)`
                  : `예약이 취소되었습니다. 일부 결제 취소 실패 (${o.length}건)`
                : i
                  ? '예약과 모든 결제가 성공적으로 환불 처리되었습니다.'
                  : '예약과 모든 결제가 성공적으로 취소되었습니다.',
          })
        )
      } catch (e) {
        return (
          console.error('[Cancel] Unexpected error:', e),
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
    e.s(['PATCH', () => N], 84820)
    var b = e.i(84820)
    let w = new t.AppRouteRouteModule({
        definition: {
          kind: n.RouteKind.APP_ROUTE,
          page: '/api/admin/bookings/[id]/cancel/route',
          pathname: '/api/admin/bookings/[id]/cancel',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/bookings/[id]/cancel/route.ts',
        nextConfigOutput: 'standalone',
        userland: b,
      }),
      { workAsyncStorage: P, workUnitAsyncStorage: A, serverHooks: S } = w
    function I() {
      return (0, a.patchFetch)({ workAsyncStorage: P, workUnitAsyncStorage: A })
    }
    async function x(e, t, a) {
      w.isDev && (0, r.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let f = '/api/admin/bookings/[id]/cancel/route'
      f = f.replace(/\/index$/, '') || '/'
      let v = await w.prepare(e, t, { srcPage: f, multiZoneDraftMode: !1 })
      if (!v)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: y,
          params: C,
          nextConfig: k,
          parsedUrl: N,
          isDraftMode: b,
          prerenderManifest: P,
          routerServerContext: A,
          isOnDemandRevalidate: S,
          revalidateOnlyGenerated: I,
          resolvedPathname: x,
          clientReferenceManifest: T,
          serverActionsManifest: O,
        } = v,
        M = (0, l.normalizeAppPath)(f),
        D = !!(P.dynamicRoutes[M] || P.routes[x]),
        j = async () => (
          (null == A ? void 0 : A.render404)
            ? await A.render404(e, t, N, !1)
            : t.end('This page could not be found'),
          null
        )
      if (D && !b) {
        let e = !!P.routes[x],
          t = P.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (k.experimental.adapterPath) return await j()
          throw new E.NoFallbackError()
        }
      }
      let $ = null
      !D || w.isDev || b || ($ = '/index' === ($ = x) ? '/' : $)
      let B = !0 === w.isDev || !D,
        U = D && !B
      O &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: f,
          clientReferenceManifest: T,
          serverActionsManifest: O,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: O }),
        })
      let L = e.method || 'GET',
        q = (0, s.getTracer)(),
        H = q.getActiveScopeSpan(),
        F = {
          params: C,
          prerenderManifest: P,
          renderOpts: {
            experimental: { authInterrupts: !!k.experimental.authInterrupts },
            cacheComponents: !!k.cacheComponents,
            supportsDynamicResponse: B,
            incrementalCache: (0, r.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: k.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, n, a) => w.onRequestError(e, t, a, A),
          },
          sharedContext: { buildId: y },
        },
        G = new c.NodeNextRequest(e),
        K = new c.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(G, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            w.handle(V, F).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let n = q.getRootSpanAttributes()
              if (!n) return
              if (n.get('next.span_type') !== d.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${n.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = n.get('next.route')
              if (a) {
                let t = `${L} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${L} ${f}`)
            }),
          i = !!(0, r.getRequestMeta)(e, 'minimalMode'),
          l = async (r) => {
            var s, l
            let c = async ({ previousCacheEntry: n }) => {
                try {
                  if (!i && S && I && !n)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(r)
                  e.fetchMetrics = F.renderOpts.fetchMetrics
                  let l = F.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let c = F.renderOpts.collectedTags
                  if (!D)
                    return (await (0, m.sendResponse)(G, K, s, F.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(c && (t[R.NEXT_CACHE_TAGS_HEADER] = c),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let n =
                        void 0 !== F.renderOpts.collectedRevalidate &&
                        !(F.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        F.renderOpts.collectedRevalidate,
                      a =
                        void 0 === F.renderOpts.collectedExpire ||
                        F.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : F.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: _.CachedRouteKind.APP_ROUTE,
                        status: s.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: n, expire: a },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == n ? void 0 : n.isStale) &&
                      (await w.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: f,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: U,
                            isOnDemandRevalidate: S,
                          }),
                        },
                        A
                      )),
                    t
                  )
                }
              },
              u = await w.handleResponse({
                req: e,
                nextConfig: k,
                cacheKey: $,
                routeKind: n.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: S,
                revalidateOnlyGenerated: I,
                responseGenerator: c,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!D) return null
            if (
              (null == u || null == (s = u.value) ? void 0 : s.kind) !== _.CachedRouteKind.APP_ROUTE
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
                S ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              b &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, h.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && D) || d.delete(R.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, g.getCacheControlHeader)(u.cacheControl)),
              await (0, m.sendResponse)(
                G,
                K,
                new Response(u.value.body, { headers: d, status: u.value.status || 200 })
              ),
              null
            )
          }
        H
          ? await l(H)
          : await q.withPropagatedContext(e.headers, () =>
              q.trace(
                d.BaseServerSpan.handleRequest,
                {
                  spanName: `${L} ${f}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': L, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof E.NoFallbackError ||
            (await w.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: U,
                isOnDemandRevalidate: S,
              }),
            })),
          D)
        )
          throw t
        return (await (0, m.sendResponse)(G, K, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => x,
        'patchFetch',
        () => I,
        'routeModule',
        () => w,
        'serverHooks',
        () => S,
        'workAsyncStorage',
        () => P,
        'workUnitAsyncStorage',
        () => A,
      ],
      584375
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

//# sourceMappingURL=%5Broot-of-the-server%5D__00031868._.js.map
