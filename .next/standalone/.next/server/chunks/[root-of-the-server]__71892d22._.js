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
    function i(e, r) {
      let i =
          r?.weekStartsOn ??
          r?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        s = (0, n.toDate)(e, r?.in),
        o = s.getDay()
      return (s.setDate(s.getDate() - (7 * (o < i) + o - i)), s.setHours(0, 0, 0, 0), s)
    }
    e.s(['startOfWeek', () => i], 250354)
  },
  250423,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      i = e.i(759756),
      s = e.i(561916),
      o = e.i(114444),
      a = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      v = e.i(626937),
      g = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      E = e.i(686880),
      _ = e.i(89171),
      P = e.i(493458),
      b = e.i(79832),
      w = e.i(657446),
      k = e.i(343747),
      O = e.i(547499)
    async function S(e, { params: t }) {
      try {
        let e = await b.default.api.getSession({ headers: await (0, P.headers)() })
        if (!e?.user?.email) return _.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if ('CUSTOMER' !== e.user.role)
          return _.NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        let { id: r } = await t,
          n = await w.prisma.user.findUnique({ where: { email: e.user.email } })
        if (!n) return _.NextResponse.json({ error: 'User not found' }, { status: 404 })
        let i = await w.prisma.booking.findUnique({
          where: { id: r, customerId: n.id },
          include: {
            groomer: {
              select: {
                id: !0,
                name: !0,
                email: !0,
                phoneNumber: !0,
                image: !0,
                groomerProfile: { select: { id: !0, isActive: !0 } },
              },
            },
            customerAddress: !0,
            bookingPets: {
              include: {
                pet: {
                  include: {
                    breed: { select: { name: !0 } },
                    images: {
                      select: { url: !0, isPrimary: !0 },
                      where: { isPrimary: !0 },
                      take: 1,
                    },
                  },
                },
                services: {
                  include: {
                    service: {
                      select: {
                        id: !0,
                        name: !0,
                        description: !0,
                        durationMinutes: !0,
                        priceRanges: { select: { price: !0 } },
                      },
                    },
                  },
                },
                selectedOptions: {
                  include: { serviceOption: { select: { id: !0, name: !0, description: !0 } } },
                },
              },
            },
          },
        })
        if (!i) return _.NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        let s = {
          id: i.id,
          appointmentDate: (0, k.format)(i.serviceDate, 'yyyy-MM-dd', { locale: E.ko }),
          startTime: i.serviceTime,
          endTime: i.serviceTime,
          status: i.status,
          totalAmount: i.totalPrice,
          paidAmount: i.basePrice,
          additionalAmount: i.additionalCharges,
          paymentStatus: 'PAID' === i.paymentStatus ? 'PAID' : 'PENDING',
          pet: i.bookingPets?.[0]?.pet
            ? {
                id: i.bookingPets[0].pet.id,
                name: i.bookingPets[0].pet.name,
                species: i.bookingPets[0].pet.type,
                breed: i.bookingPets[0].pet.breed?.name || 'Unknown',
                weight: i.bookingPets[0].pet.weight || 0,
                age: i.bookingPets[0].pet.age || null,
                photoUrl: i.bookingPets[0].pet.images?.[0]?.url || null,
              }
            : {
                id: 'unknown',
                name: 'Unknown Pet',
                species: 'Unknown',
                breed: 'Unknown',
                weight: 0,
                age: null,
                photoUrl: null,
              },
          services: i.bookingPets?.[0]?.services?.map((e) => ({
            id: e.service.id,
            name: e.service.name,
            description: e.service.description || '',
            duration: e.service.durationMinutes,
            price: e.service.priceRanges?.[0]?.price || 0,
            status:
              'SERVICE_COMPLETED' === i.status
                ? 'COMPLETED'
                : 'WORK_IN_PROGRESS' === i.status
                  ? 'IN_PROGRESS'
                  : 'PENDING',
          })) || [
            {
              id: 'default',
              name: i.serviceType,
              description: i.serviceDescription || '',
              duration: i.estimatedDurationMinutes,
              price: i.totalPrice,
              status:
                'SERVICE_COMPLETED' === i.status
                  ? 'COMPLETED'
                  : 'WORK_IN_PROGRESS' === i.status
                    ? 'IN_PROGRESS'
                    : 'PENDING',
            },
          ],
          options:
            i.bookingPets?.[0]?.selectedOptions?.map((e) => ({
              id: e.serviceOption.id,
              name: e.serviceOption.name,
              description: e.serviceOption.description || '',
              price: e.optionPrice,
            })) || [],
          groomer: {
            id: i.groomer?.id || 'unassigned',
            name: i.groomer?.name || 'Unassigned',
            photoUrl: i.groomer?.image || null,
            rating: 0,
            experience: null,
            phone: i.groomer?.phoneNumber || '',
            salon: {
              id: 'default',
              name: '미미살롱',
              address: i.customerAddress?.street || '주소 미확인',
              phone: O.env.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE,
            },
          },
          timeline: [
            {
              id: 'created',
              type: 'CREATED',
              title: '예약 생성',
              description: `반려동물의 미용 예약이 생성되었습니다.`,
              timestamp: i.createdAt.toISOString(),
            },
            ...(i.confirmedAt
              ? [
                  {
                    id: 'confirmed',
                    type: 'CONFIRMED',
                    title: '예약 확정',
                    description: '미용사가 예약을 확정했습니다.',
                    timestamp: i.confirmedAt.toISOString(),
                  },
                ]
              : []),
            ...(i.startedAt
              ? [
                  {
                    id: 'started',
                    type: 'STARTED',
                    title: '미용 시작',
                    description: `반려동물의 미용이 시작되었습니다.`,
                    timestamp: i.startedAt.toISOString(),
                  },
                ]
              : []),
            ...(i.completedAt
              ? [
                  {
                    id: 'completed',
                    type: 'COMPLETED',
                    title: '미용 완료',
                    description: '모든 서비스가 완료되었습니다.',
                    timestamp: i.completedAt.toISOString(),
                  },
                ]
              : []),
            ...(i.cancelledAt
              ? [
                  {
                    id: 'cancelled',
                    type: 'CANCELLED',
                    title: '예약 취소',
                    description: i.cancellationReason || '예약이 취소되었습니다.',
                    timestamp: i.cancelledAt.toISOString(),
                  },
                ]
              : []),
          ],
          notes: i.specialRequests,
          estimatedEndTime: i.serviceTime,
        }
        return _.NextResponse.json(s)
      } catch (e) {
        return (
          console.error('Booking detail API error:', e),
          _.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => S], 792536)
    var y = e.i(792536)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/booking/[id]/route',
          pathname: '/api/customer/booking/[id]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/booking/[id]/route.ts',
        nextConfigOutput: 'standalone',
        userland: y,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: N, serverHooks: T } = C
    function D() {
      return (0, n.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: N })
    }
    async function I(e, t, n) {
      C.isDev && (0, i.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let E = '/api/customer/booking/[id]/route'
      E = E.replace(/\/index$/, '') || '/'
      let _ = await C.prepare(e, t, { srcPage: E, multiZoneDraftMode: !1 })
      if (!_)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: P,
          params: b,
          nextConfig: w,
          parsedUrl: k,
          isDraftMode: O,
          prerenderManifest: S,
          routerServerContext: y,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: N,
          resolvedPathname: T,
          clientReferenceManifest: D,
          serverActionsManifest: I,
        } = _,
        x = (0, l.normalizeAppPath)(E),
        U = !!(S.dynamicRoutes[x] || S.routes[T]),
        M = async () => (
          (null == y ? void 0 : y.render404)
            ? await y.render404(e, t, k, !1)
            : t.end('This page could not be found'),
          null
        )
      if (U && !O) {
        let e = !!S.routes[T],
          t = S.dynamicRoutes[x]
        if (t && !1 === t.fallback && !e) {
          if (w.experimental.adapterPath) return await M()
          throw new R.NoFallbackError()
        }
      }
      let j = null
      !U || C.isDev || O || (j = '/index' === (j = T) ? '/' : j)
      let q = !0 === C.isDev || !U,
        H = U && !q
      I &&
        D &&
        (0, o.setReferenceManifestsSingleton)({
          page: E,
          clientReferenceManifest: D,
          serverActionsManifest: I,
          serverModuleMap: (0, a.createServerModuleMap)({ serverActionsManifest: I }),
        })
      let F = e.method || 'GET',
        L = (0, s.getTracer)(),
        G = L.getActiveScopeSpan(),
        K = {
          params: b,
          prerenderManifest: S,
          renderOpts: {
            experimental: { authInterrupts: !!w.experimental.authInterrupts },
            cacheComponents: !!w.cacheComponents,
            supportsDynamicResponse: q,
            incrementalCache: (0, i.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: w.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => C.onRequestError(e, t, n, y),
          },
          sharedContext: { buildId: P },
        },
        $ = new d.NodeNextRequest(e),
        B = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest($, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            C.handle(V, K).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = L.getRootSpanAttributes()
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
              } else e.updateName(`${F} ${E}`)
            }),
          a = !!(0, i.getRequestMeta)(e, 'minimalMode'),
          l = async (i) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!a && A && N && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(i)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let d = K.renderOpts.collectedTags
                  if (!U)
                    return (await (0, m.sendResponse)($, B, s, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[g.NEXT_CACHE_TAGS_HEADER] = d),
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
                        kind: f.CachedRouteKind.APP_ROUTE,
                        status: s.status,
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
                          routePath: E,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        y
                      )),
                    t
                  )
                }
              },
              u = await C.handleResponse({
                req: e,
                nextConfig: w,
                cacheKey: j,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: S,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: N,
                responseGenerator: d,
                waitUntil: n.waitUntil,
                isMinimalMode: a,
              })
            if (!U) return null
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
            ;(a ||
              t.setHeader(
                'x-nextjs-cache',
                A ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              O &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (a && U) || c.delete(g.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(u.cacheControl)),
              await (0, m.sendResponse)(
                $,
                B,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        G
          ? await l(G)
          : await L.withPropagatedContext(e.headers, () =>
              L.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${E}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: x,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: A,
              }),
            })),
          U)
        )
          throw t
        return (await (0, m.sendResponse)($, B, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => I,
        'patchFetch',
        () => D,
        'routeModule',
        () => C,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => N,
      ],
      250423
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

//# sourceMappingURL=%5Broot-of-the-server%5D__71892d22._.js.map
