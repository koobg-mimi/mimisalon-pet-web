module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  609730,
  438220,
  874321,
  (e) => {
    'use strict'
    let t = Symbol.for('constructDateFrom')
    function r(e, r) {
      return 'function' == typeof e
        ? e(r)
        : e && 'object' == typeof e && t in e
          ? e[t](r)
          : e instanceof Date
            ? new e.constructor(r)
            : new Date(r)
    }
    function n(e, t) {
      return r(t || e, e)
    }
    ;(e.s(
      [
        'constructFromSymbol',
        0,
        t,
        'millisecondsInDay',
        0,
        864e5,
        'millisecondsInHour',
        0,
        36e5,
        'millisecondsInMinute',
        0,
        6e4,
        'millisecondsInWeek',
        0,
        6048e5,
      ],
      438220
    ),
      e.s(['constructFrom', () => r], 874321),
      e.s(['toDate', () => n], 609730))
  },
  250354,
  662001,
  (e) => {
    'use strict'
    let t = {}
    function r() {
      return t
    }
    e.s(['getDefaultOptions', () => r], 662001)
    var n = e.i(609730)
    function o(e, r) {
      let o =
          r?.weekStartsOn ??
          r?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        a = (0, n.toDate)(e, r?.in),
        s = a.getDay()
      return (a.setDate(a.getDate() - (7 * (s < o) + s - o)), a.setHours(0, 0, 0, 0), a)
    }
    e.s(['startOfWeek', () => o], 250354)
  },
  770834,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      o = e.i(759756),
      a = e.i(561916),
      s = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      u = e.i(316795),
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      f = e.i(626937),
      g = e.i(10372),
      v = e.i(193695)
    e.i(52474)
    var R = e.i(600220),
      y = e.i(686880),
      b = e.i(89171),
      w = e.i(493458),
      _ = e.i(469719),
      k = e.i(79832),
      E = e.i(657446),
      x = e.i(343747)
    let N = _.z.object({ reason: _.z.string().optional() })
    async function C(e, { params: t }) {
      try {
        let e = await k.default.api.getSession({ headers: await (0, w.headers)() })
        if (!e?.user) return b.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        let { paymentId: r } = await t,
          n = await E.prisma.payment.findUnique({
            where: { paymentId: r },
            include: {
              booking: {
                include: {
                  customer: !0,
                  groomer: { include: { groomerProfile: !0 } },
                  bookingPets: { include: { pet: !0, services: { include: { service: !0 } } } },
                  customerAddress: !0,
                },
              },
            },
          })
        if (!n)
          return b.NextResponse.json({ error: '결제 정보를 찾을 수 없습니다' }, { status: 404 })
        if (n.customerId && n.customerId !== e.user.id)
          return b.NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
        let o = {
          id: n.id,
          amount: n.amount,
          method: n.method || '카드',
          paidAt: n.paidAt
            ? (0, x.format)(n.paidAt, 'yyyy-MM-dd HH:mm:ss', { locale: y.ko })
            : null,
          booking: n.booking
            ? {
                id: n.booking.id,
                services: n.booking.bookingPets.flatMap((e) =>
                  e.services.map((e) => ({
                    id: e.service.id,
                    name: e.service.name,
                    price: e.servicePrice,
                    duration: e.service.durationMinutes,
                  }))
                ),
                pet: n.booking.bookingPets[0]
                  ? {
                      name: n.booking.bookingPets[0].pet.name,
                      species: n.booking.bookingPets[0].pet.type,
                    }
                  : { name: '알 수 없음', species: '알 수 없음' },
                groomer: n.booking.groomer
                  ? {
                      name: n.booking.groomer.name || '미용사',
                      salon: n.booking.groomer.groomerProfile?.bankName || '미미살롱',
                      phone: n.booking.groomer.phoneNumber || '',
                    }
                  : { name: '미용사', salon: '미미살롱', phone: '' },
                scheduledDate: (0, x.format)(n.booking.serviceDate, 'yyyy-MM-dd', { locale: y.ko }),
                scheduledTime: n.booking.serviceTime,
              }
            : null,
          receipt: { receiptNumber: n.paymentId, downloadUrl: n.receiptUrl || '' },
        }
        return b.NextResponse.json(o)
      } catch (e) {
        return (
          console.error('[Payment Details] Error:', e),
          b.NextResponse.json({ error: '결제 정보 조회 중 오류가 발생했습니다' }, { status: 500 })
        )
      }
    }
    async function P(e, { params: t }) {
      try {
        let r = await k.default.api.getSession({ headers: await (0, w.headers)() })
        if (!r?.user) return b.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        let { paymentId: n } = await t,
          o = await e.json(),
          a = N.parse(o),
          s = await E.prisma.payment.findUnique({
            where: { paymentId: n },
            include: { booking: !0 },
          })
        if (!s)
          return b.NextResponse.json({ error: '결제 정보를 찾을 수 없습니다' }, { status: 404 })
        if (s.customerId !== r.user.id)
          return b.NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
        if ('PAID' !== s.status)
          return b.NextResponse.json({ error: '취소 가능한 결제가 아닙니다' }, { status: 400 })
        if (s.booking) {
          let e = new Date(s.booking.serviceDate),
            t = new Date(),
            r = (e.getTime() - t.getTime()) / 36e5
          if (r < 0)
            return b.NextResponse.json(
              { error: '이미 완료된 예약은 환불할 수 없습니다' },
              { status: 400 }
            )
          let n = Math.floor(s.amount * (r < 2 ? 0.5 : 1))
          return (
            await E.prisma.payment.update({
              where: { id: s.id },
              data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
                cancelReason: a.reason || '고객 요청',
                cancelledAmount: n,
              },
            }),
            s.bookingId &&
              (await E.prisma.booking.update({
                where: { id: s.bookingId },
                data: { status: 'SERVICE_CANCELLED', paymentStatus: 'REFUNDED' },
              })),
            b.NextResponse.json({
              success: !0,
              refundId: `refund_${Date.now()}`,
              refundAmount: n,
              estimatedDate: (0, x.format)(new Date(Date.now() + 432e6), 'yyyy-MM-dd', {
                locale: y.ko,
              }),
              message: '환불 요청이 성공적으로 접수되었습니다',
            })
          )
        }
        return b.NextResponse.json({ error: '예약 정보를 찾을 수 없습니다' }, { status: 404 })
      } catch (e) {
        if ((console.error('[Payment Refund] Error:', e), e instanceof _.z.ZodError))
          return b.NextResponse.json({ error: '잘못된 요청 데이터입니다' }, { status: 400 })
        return b.NextResponse.json({ error: '환불 처리 중 오류가 발생했습니다' }, { status: 500 })
      }
    }
    e.s(['GET', () => C, 'PATCH', () => P, 'refundPaymentSchema', 0, N], 179805)
    var A = e.i(179805)
    let D = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/payments/[paymentId]/route',
          pathname: '/api/payments/[paymentId]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/payments/[paymentId]/route.ts',
        nextConfigOutput: 'standalone',
        userland: A,
      }),
      { workAsyncStorage: j, workUnitAsyncStorage: I, serverHooks: S } = D
    function T() {
      return (0, n.patchFetch)({ workAsyncStorage: j, workUnitAsyncStorage: I })
    }
    async function O(e, t, n) {
      D.isDev && (0, o.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let y = '/api/payments/[paymentId]/route'
      y = y.replace(/\/index$/, '') || '/'
      let b = await D.prepare(e, t, { srcPage: y, multiZoneDraftMode: !1 })
      if (!b)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: _,
          nextConfig: k,
          parsedUrl: E,
          isDraftMode: x,
          prerenderManifest: N,
          routerServerContext: C,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: A,
          resolvedPathname: j,
          clientReferenceManifest: I,
          serverActionsManifest: S,
        } = b,
        T = (0, l.normalizeAppPath)(y),
        O = !!(N.dynamicRoutes[T] || N.routes[j]),
        M = async () => (
          (null == C ? void 0 : C.render404)
            ? await C.render404(e, t, E, !1)
            : t.end('This page could not be found'),
          null
        )
      if (O && !x) {
        let e = !!N.routes[j],
          t = N.dynamicRoutes[T]
        if (t && !1 === t.fallback && !e) {
          if (k.experimental.adapterPath) return await M()
          throw new v.NoFallbackError()
        }
      }
      let H = null
      !O || D.isDev || x || (H = '/index' === (H = j) ? '/' : H)
      let U = !0 === D.isDev || !O,
        q = O && !U
      S &&
        I &&
        (0, s.setReferenceManifestsSingleton)({
          page: y,
          clientReferenceManifest: I,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let F = e.method || 'GET',
        $ = (0, a.getTracer)(),
        L = $.getActiveScopeSpan(),
        K = {
          params: _,
          prerenderManifest: N,
          renderOpts: {
            experimental: { authInterrupts: !!k.experimental.authInterrupts },
            cacheComponents: !!k.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, o.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: k.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => D.onRequestError(e, t, n, C),
          },
          sharedContext: { buildId: w },
        },
        B = new u.NodeNextRequest(e),
        z = new u.NodeNextResponse(t),
        G = d.NextRequestAdapter.fromNodeNextRequest(B, (0, d.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            D.handle(G, K).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = $.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = r.get('next.route')
              if (n) {
                let t = `${F} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${F} ${y}`)
            }),
          i = !!(0, o.getRequestMeta)(e, 'minimalMode'),
          l = async (o) => {
            var a, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && A && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let a = await s(o)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let u = K.renderOpts.collectedTags
                  if (!O)
                    return (await (0, m.sendResponse)(B, z, a, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await a.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(a.headers)
                    ;(u && (t[g.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      n =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: R.CachedRouteKind.APP_ROUTE,
                        status: a.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: n },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await D.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: y,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: q,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        C
                      )),
                    t
                  )
                }
              },
              d = await D.handleResponse({
                req: e,
                nextConfig: k,
                cacheKey: H,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: N,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: A,
                responseGenerator: u,
                waitUntil: n.waitUntil,
                isMinimalMode: i,
              })
            if (!O) return null
            if (
              (null == d || null == (a = d.value) ? void 0 : a.kind) !== R.CachedRouteKind.APP_ROUTE
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
              x &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && O) || c.delete(g.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(d.cacheControl)),
              await (0, m.sendResponse)(
                B,
                z,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
              ),
              null
            )
          }
        L
          ? await l(L)
          : await $.withPropagatedContext(e.headers, () =>
              $.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${y}`,
                  kind: a.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof v.NoFallbackError ||
            (await D.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: T,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: q,
                isOnDemandRevalidate: P,
              }),
            })),
          O)
        )
          throw t
        return (await (0, m.sendResponse)(B, z, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => O,
        'patchFetch',
        () => T,
        'routeModule',
        () => D,
        'serverHooks',
        () => S,
        'workAsyncStorage',
        () => j,
        'workUnitAsyncStorage',
        () => I,
      ],
      770834
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

//# sourceMappingURL=%5Broot-of-the-server%5D__3766bc3a._.js.map
