module.exports = [
  254799,
  (e, t, a) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  768467,
  (e) => {
    'use strict'
    var t = e.i(747909),
      a = e.i(174017),
      r = e.i(996250),
      n = e.i(759756),
      s = e.i(561916),
      o = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      u = e.i(316795),
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      R = e.i(626937),
      v = e.i(10372),
      f = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      E = e.i(89171),
      g = e.i(493458),
      w = e.i(79832),
      A = e.i(657446)
    async function C(e, { params: t }) {
      try {
        let e,
          a = await w.default.api.getSession({ headers: await (0, g.headers)() })
        if (!a || a.user?.role !== 'ADMIN')
          return E.NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
        let { id: r, action: n } = await t,
          s = await A.prisma.groomerSettlement.findUnique({
            where: { id: r },
            include: { groomer: { select: { name: !0 } } },
          })
        if (!s) return E.NextResponse.json({ error: '정산을 찾을 수 없습니다' }, { status: 404 })
        switch (n) {
          case 'calculate':
            if (s.status !== A.SettlementStatus.PENDING)
              return E.NextResponse.json(
                { error: '계산할 수 없는 정산 상태입니다' },
                { status: 400 }
              )
            e = { status: A.SettlementStatus.CALCULATED, updatedAt: new Date() }
            break
          case 'pay':
            if (s.status !== A.SettlementStatus.CALCULATED)
              return E.NextResponse.json(
                { error: '지급할 수 없는 정산 상태입니다' },
                { status: 400 }
              )
            e = { status: A.SettlementStatus.PAID, updatedAt: new Date() }
            break
          case 'fail':
            if (
              s.status !== A.SettlementStatus.CALCULATED &&
              s.status !== A.SettlementStatus.PROCESSING
            )
              return E.NextResponse.json(
                { error: '실패 처리할 수 없는 정산 상태입니다' },
                { status: 400 }
              )
            e = { status: A.SettlementStatus.FAILED, updatedAt: new Date() }
            break
          default:
            return E.NextResponse.json({ error: '알 수 없는 액션입니다' }, { status: 400 })
        }
        let o = await A.prisma.groomerSettlement.update({
          where: { id: r },
          data: e,
          include: { groomer: { select: { name: !0 } } },
        })
        return E.NextResponse.json({
          success: !0,
          message: {
            calculate: '정산이 계산되었습니다',
            pay: '정산이 지급 처리되었습니다',
            fail: '정산이 실패 처리되었습니다',
          }[n],
          settlement: {
            id: o.id,
            status: o.status,
            groomerName: o.groomer.name,
            netAmount: o.netSettlementAmount,
            updatedAt: o.updatedAt.toISOString(),
          },
        })
      } catch (e) {
        return (
          console.error('Error updating settlement:', e),
          E.NextResponse.json(
            { error: '정산 상태 업데이트 중 오류가 발생했습니다' },
            { status: 500 }
          )
        )
      }
    }
    e.s(['PATCH', () => C], 249559)
    var S = e.i(249559)
    let x = new t.AppRouteRouteModule({
        definition: {
          kind: a.RouteKind.APP_ROUTE,
          page: '/api/admin/settlements/[id]/[action]/route',
          pathname: '/api/admin/settlements/[id]/[action]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/settlements/[id]/[action]/route.ts',
        nextConfigOutput: 'standalone',
        userland: S,
      }),
      { workAsyncStorage: b, workUnitAsyncStorage: N, serverHooks: y } = x
    function P() {
      return (0, r.patchFetch)({ workAsyncStorage: b, workUnitAsyncStorage: N })
    }
    async function j(e, t, r) {
      x.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let E = '/api/admin/settlements/[id]/[action]/route'
      E = E.replace(/\/index$/, '') || '/'
      let g = await x.prepare(e, t, { srcPage: E, multiZoneDraftMode: !1 })
      if (!g)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == r.waitUntil || r.waitUntil.call(r, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: A,
          nextConfig: C,
          parsedUrl: S,
          isDraftMode: b,
          prerenderManifest: N,
          routerServerContext: y,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: j,
          resolvedPathname: k,
          clientReferenceManifest: T,
          serverActionsManifest: D,
        } = g,
        O = (0, l.normalizeAppPath)(E),
        I = !!(N.dynamicRoutes[O] || N.routes[k]),
        U = async () => (
          (null == y ? void 0 : y.render404)
            ? await y.render404(e, t, S, !1)
            : t.end('This page could not be found'),
          null
        )
      if (I && !b) {
        let e = !!N.routes[k],
          t = N.dynamicRoutes[O]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await U()
          throw new f.NoFallbackError()
        }
      }
      let q = null
      !I || x.isDev || b || (q = '/index' === (q = k) ? '/' : q)
      let H = !0 === x.isDev || !I,
        M = I && !H
      D &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: E,
          clientReferenceManifest: T,
          serverActionsManifest: D,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: D }),
        })
      let L = e.method || 'GET',
        F = (0, s.getTracer)(),
        $ = F.getActiveScopeSpan(),
        K = {
          params: A,
          prerenderManifest: N,
          renderOpts: {
            experimental: { authInterrupts: !!C.experimental.authInterrupts },
            cacheComponents: !!C.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: C.cacheLife,
            waitUntil: r.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, a, r) => x.onRequestError(e, t, r, y),
          },
          sharedContext: { buildId: w },
        },
        B = new u.NodeNextRequest(e),
        G = new u.NodeNextResponse(t),
        V = d.NextRequestAdapter.fromNodeNextRequest(B, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            x.handle(V, K).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let a = F.getRootSpanAttributes()
              if (!a) return
              if (a.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${a.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let r = a.get('next.route')
              if (r) {
                let t = `${L} ${r}`
                ;(e.setAttributes({ 'next.route': r, 'http.route': r, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${L} ${E}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: a }) => {
                try {
                  if (!i && P && j && !a)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && r.waitUntil && (r.waitUntil(l), (l = void 0))
                  let u = K.renderOpts.collectedTags
                  if (!I)
                    return (await (0, h.sendResponse)(B, G, s, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[v.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let a =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= v.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      r =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= v.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: _.CachedRouteKind.APP_ROUTE,
                        status: s.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: a, expire: r },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == a ? void 0 : a.isStale) &&
                      (await x.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: E,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: M,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        y
                      )),
                    t
                  )
                }
              },
              d = await x.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: q,
                routeKind: a.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: N,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: j,
                responseGenerator: u,
                waitUntil: r.waitUntil,
                isMinimalMode: i,
              })
            if (!I) return null
            if (
              (null == d || null == (s = d.value) ? void 0 : s.kind) !== _.CachedRouteKind.APP_ROUTE
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
              b &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && I) || c.delete(v.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, R.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                B,
                G,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
              ),
              null
            )
          }
        $
          ? await l($)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${L} ${E}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': L, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof f.NoFallbackError ||
            (await x.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: O,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: M,
                isOnDemandRevalidate: P,
              }),
            })),
          I)
        )
          throw t
        return (await (0, h.sendResponse)(B, G, new Response(null, { status: 500 })), null)
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
        () => y,
        'workAsyncStorage',
        () => b,
        'workUnitAsyncStorage',
        () => N,
      ],
      768467
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

//# sourceMappingURL=%5Broot-of-the-server%5D__ddab9554._.js.map
