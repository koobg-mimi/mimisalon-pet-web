module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  248584,
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
      m = e.i(47587),
      p = e.i(666012),
      h = e.i(570101),
      g = e.i(626937),
      A = e.i(10372),
      v = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      R = e.i(89171),
      f = e.i(493458),
      E = e.i(79832),
      b = e.i(657446),
      w = e.i(469719)
    let C = w.z.object({
      page: w.z.string().optional().default('1'),
      limit: w.z.string().optional().default('20'),
      search: w.z.string().optional().default(''),
      status: w.z
        .enum(['ALL', 'CALCULATED', 'PAID', 'PENDING', 'FAILED', 'CANCELLED'])
        .optional()
        .default('ALL'),
      period: w.z.string().optional().default(''),
    })
    async function S(e) {
      try {
        let t = await E.default.api.getSession({ headers: await (0, f.headers)() })
        if (!t || t.user?.role !== 'ADMIN')
          return R.NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
        let { searchParams: r } = new URL(e.url),
          a = Object.fromEntries(r.entries()),
          n = C.parse(a),
          o = parseInt(n.page),
          s = parseInt(n.limit),
          i = {}
        if (('ALL' !== n.status && (i.status = n.status), n.period)) {
          let [e, t] = n.period.split('-'),
            r = new Date(parseInt(e), parseInt(t) - 1, 1),
            a = new Date(parseInt(e), parseInt(t), 0, 23, 59, 59)
          i.periodStartDate = { gte: r, lte: a }
        }
        n.search &&
          (i.groomer = {
            OR: [
              { name: { contains: n.search, mode: 'insensitive' } },
              { email: { contains: n.search, mode: 'insensitive' } },
            ],
          })
        let [l, u] = await Promise.all([
            b.prisma.groomerSettlement.findMany({
              where: i,
              skip: (o - 1) * s,
              take: s,
              orderBy: { createdAt: 'desc' },
              include: {
                groomer: { select: { name: !0, email: !0 } },
                groomerProfile: {
                  select: {
                    bankName: !0,
                    bankAccountNumber: !0,
                    bankAccountHolderName: !0,
                    commissionGrade: { select: { commissionRate: !0 } },
                  },
                },
              },
            }),
            b.prisma.groomerSettlement.count({ where: i }),
          ]),
          d = await b.prisma.groomerSettlement.aggregate({
            _sum: { netSettlementAmount: !0, commissionAmount: !0 },
            _count: { id: !0 },
            where: { status: { in: ['CALCULATED', 'PAID'] } },
          }),
          c = await b.prisma.groomerSettlement.aggregate({
            _sum: { netSettlementAmount: !0 },
            _count: { id: !0 },
            where: { status: 'CALCULATED' },
          }),
          m = await b.prisma.groomerSettlement.aggregate({
            _sum: { netSettlementAmount: !0 },
            where: { status: 'PAID' },
          }),
          p = l.map((e) => ({
            id: e.id,
            groomerId: e.groomerId,
            period: `${e.periodStartDate.getFullYear()}-${String(e.periodStartDate.getMonth() + 1).padStart(2, '0')}`,
            totalBookings: e.bookingCount,
            totalRevenue: e.totalRevenue,
            commission: e.commissionAmount,
            netAmount: e.netSettlementAmount,
            status: e.status,
            calculatedAt: e.createdAt.toISOString(),
            paidAt: 'PAID' === e.status ? e.updatedAt.toISOString() : null,
            createdAt: e.createdAt.toISOString(),
            updatedAt: e.updatedAt.toISOString(),
            groomer: {
              name: e.groomer.name,
              email: e.groomer.email,
              commissionRate: e.groomerProfile?.commissionGrade?.commissionRate || e.commissionRate,
              bankName: e.groomerProfile?.bankName || null,
              bankAccountNumber: e.groomerProfile?.bankAccountNumber || null,
              bankAccountHolderName: e.groomerProfile?.bankAccountHolderName || null,
            },
          }))
        return R.NextResponse.json({
          success: !0,
          settlements: p,
          totalCount: u,
          totalPages: Math.ceil(u / s),
          currentPage: o,
          summary: {
            totalPendingAmount: c._sum.netSettlementAmount || 0,
            totalPaidAmount: m._sum.netSettlementAmount || 0,
            totalCommission: d._sum.commissionAmount || 0,
            pendingCount: c._count.id || 0,
          },
        })
      } catch (e) {
        return (
          console.error('Error fetching settlements:', e),
          R.NextResponse.json({ error: '정산 목록 조회 중 오류가 발생했습니다' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => S], 905890)
    var P = e.i(905890)
    let N = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/settlements/route',
          pathname: '/api/admin/settlements',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/settlements/route.ts',
        nextConfigOutput: 'standalone',
        userland: P,
      }),
      { workAsyncStorage: k, workUnitAsyncStorage: x, serverHooks: I } = N
    function y() {
      return (0, a.patchFetch)({ workAsyncStorage: k, workUnitAsyncStorage: x })
    }
    async function D(e, t, a) {
      N.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let R = '/api/admin/settlements/route'
      R = R.replace(/\/index$/, '') || '/'
      let f = await N.prepare(e, t, { srcPage: R, multiZoneDraftMode: !1 })
      if (!f)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: E,
          params: b,
          nextConfig: w,
          parsedUrl: C,
          isDraftMode: S,
          prerenderManifest: P,
          routerServerContext: k,
          isOnDemandRevalidate: x,
          revalidateOnlyGenerated: I,
          resolvedPathname: y,
          clientReferenceManifest: D,
          serverActionsManifest: T,
        } = f,
        O = (0, l.normalizeAppPath)(R),
        j = !!(P.dynamicRoutes[O] || P.routes[y]),
        L = async () => (
          (null == k ? void 0 : k.render404)
            ? await k.render404(e, t, C, !1)
            : t.end('This page could not be found'),
          null
        )
      if (j && !S) {
        let e = !!P.routes[y],
          t = P.dynamicRoutes[O]
        if (t && !1 === t.fallback && !e) {
          if (w.experimental.adapterPath) return await L()
          throw new v.NoFallbackError()
        }
      }
      let H = null
      !j || N.isDev || S || (H = '/index' === (H = y) ? '/' : H)
      let M = !0 === N.isDev || !j,
        U = j && !M
      T &&
        D &&
        (0, s.setReferenceManifestsSingleton)({
          page: R,
          clientReferenceManifest: D,
          serverActionsManifest: T,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: T }),
        })
      let q = e.method || 'GET',
        $ = (0, o.getTracer)(),
        F = $.getActiveScopeSpan(),
        K = {
          params: b,
          prerenderManifest: P,
          renderOpts: {
            experimental: { authInterrupts: !!w.experimental.authInterrupts },
            cacheComponents: !!w.cacheComponents,
            supportsDynamicResponse: M,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: w.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => N.onRequestError(e, t, a, k),
          },
          sharedContext: { buildId: E },
        },
        z = new u.NodeNextRequest(e),
        B = new u.NodeNextResponse(t),
        G = d.NextRequestAdapter.fromNodeNextRequest(z, (0, d.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            N.handle(G, K).finally(() => {
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
                let t = `${q} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${q} ${R}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var o, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && x && I && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await s(n)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = K.renderOpts.collectedTags
                  if (!j)
                    return (await (0, p.sendResponse)(z, B, o, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(u && (t[A.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= A.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      a =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= A.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
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
                      (await N.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: R,
                          routeType: 'route',
                          revalidateReason: (0, m.getRevalidateReason)({
                            isStaticGeneration: U,
                            isOnDemandRevalidate: x,
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
                nextConfig: w,
                cacheKey: H,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: x,
                revalidateOnlyGenerated: I,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!j) return null
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
                x ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              S &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && j) || c.delete(A.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, g.getCacheControlHeader)(d.cacheControl)),
              await (0, p.sendResponse)(
                z,
                B,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
              ),
              null
            )
          }
        F
          ? await l(F)
          : await $.withPropagatedContext(e.headers, () =>
              $.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${q} ${R}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': q, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof v.NoFallbackError ||
            (await N.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: O,
              routeType: 'route',
              revalidateReason: (0, m.getRevalidateReason)({
                isStaticGeneration: U,
                isOnDemandRevalidate: x,
              }),
            })),
          j)
        )
          throw t
        return (await (0, p.sendResponse)(z, B, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => D,
        'patchFetch',
        () => y,
        'routeModule',
        () => N,
        'serverHooks',
        () => I,
        'workAsyncStorage',
        () => k,
        'workUnitAsyncStorage',
        () => x,
      ],
      248584
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

//# sourceMappingURL=%5Broot-of-the-server%5D__ad79c6f5._.js.map
