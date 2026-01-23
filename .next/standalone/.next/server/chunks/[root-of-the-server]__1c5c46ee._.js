module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  773294,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      n = e.i(759756),
      s = e.i(561916),
      i = e.i(114444),
      o = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      v = e.i(570101),
      R = e.i(626937),
      m = e.i(10372),
      w = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      _ = e.i(89171),
      g = e.i(493458),
      b = e.i(79832),
      E = e.i(657446)
    async function x(e, { params: t }) {
      try {
        let e = await b.default.api.getSession({ headers: await (0, g.headers)() })
        if (!e || e.user?.role !== 'ADMIN')
          return _.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r, action: a } = await t,
          n = await E.prisma.review.findUnique({ where: { id: r } })
        if (!n) return _.NextResponse.json({ error: 'Review not found' }, { status: 404 })
        let s = ''
        switch (a) {
          case 'approve':
            s = 'Review approved'
            break
          case 'flag':
            s = 'Review flagged for review'
            break
          case 'unflag':
            s = 'Review unflagged'
            break
          case 'hide':
            s = 'Review hidden from public'
            break
          case 'show':
            s = 'Review made public'
            break
          case 'delete':
            return (
              await E.prisma.$transaction([
                E.prisma.reviewResponse.deleteMany({ where: { reviewId: r } }),
                E.prisma.reviewImage.deleteMany({ where: { reviewId: r } }),
                E.prisma.review.delete({ where: { id: r } }),
              ]),
              _.NextResponse.json({ success: !0, message: 'Review deleted successfully' })
            )
          default:
            return _.NextResponse.json({ error: `Invalid action: ${a}` }, { status: 400 })
        }
        return _.NextResponse.json({
          success: !0,
          message: s,
          review: {
            id: n.id,
            rating: n.rating,
            comment: n.comment,
            createdAt: n.createdAt,
            updatedAt: n.updatedAt,
          },
        })
      } catch (r) {
        let { action: e } = await t
        return (
          console.error(`Failed to ${e} review:`, r),
          _.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['POST', () => x], 291623)
    var C = e.i(291623)
    let A = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/reviews/[id]/[action]/route',
          pathname: '/api/admin/reviews/[id]/[action]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/reviews/[id]/[action]/route.ts',
        nextConfigOutput: 'standalone',
        userland: C,
      }),
      { workAsyncStorage: y, workUnitAsyncStorage: k, serverHooks: N } = A
    function P() {
      return (0, a.patchFetch)({ workAsyncStorage: y, workUnitAsyncStorage: k })
    }
    async function j(e, t, a) {
      A.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let _ = '/api/admin/reviews/[id]/[action]/route'
      _ = _.replace(/\/index$/, '') || '/'
      let g = await A.prepare(e, t, { srcPage: _, multiZoneDraftMode: !1 })
      if (!g)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: b,
          params: E,
          nextConfig: x,
          parsedUrl: C,
          isDraftMode: y,
          prerenderManifest: k,
          routerServerContext: N,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: j,
          resolvedPathname: T,
          clientReferenceManifest: O,
          serverActionsManifest: S,
        } = g,
        I = (0, l.normalizeAppPath)(_),
        M = !!(k.dynamicRoutes[I] || k.routes[T]),
        q = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, C, !1)
            : t.end('This page could not be found'),
          null
        )
      if (M && !y) {
        let e = !!k.routes[T],
          t = k.dynamicRoutes[I]
        if (t && !1 === t.fallback && !e) {
          if (x.experimental.adapterPath) return await q()
          throw new w.NoFallbackError()
        }
      }
      let U = null
      !M || A.isDev || y || (U = '/index' === (U = T) ? '/' : U)
      let H = !0 === A.isDev || !M,
        D = M && !H
      S &&
        O &&
        (0, i.setReferenceManifestsSingleton)({
          page: _,
          clientReferenceManifest: O,
          serverActionsManifest: S,
          serverModuleMap: (0, o.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let $ = e.method || 'GET',
        F = (0, s.getTracer)(),
        K = F.getActiveScopeSpan(),
        B = {
          params: E,
          prerenderManifest: k,
          renderOpts: {
            experimental: { authInterrupts: !!x.experimental.authInterrupts },
            cacheComponents: !!x.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: x.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => A.onRequestError(e, t, a, N),
          },
          sharedContext: { buildId: b },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let i = async (e) =>
            A.handle(V, B).finally(() => {
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
              } else e.updateName(`${$} ${_}`)
            }),
          o = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!o && P && j && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await i(n)
                  e.fetchMetrics = B.renderOpts.fetchMetrics
                  let l = B.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = B.renderOpts.collectedTags
                  if (!M)
                    return (await (0, h.sendResponse)(L, G, s, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, v.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[m.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== B.renderOpts.collectedRevalidate &&
                        !(B.renderOpts.collectedRevalidate >= m.INFINITE_CACHE) &&
                        B.renderOpts.collectedRevalidate,
                      a =
                        void 0 === B.renderOpts.collectedExpire ||
                        B.renderOpts.collectedExpire >= m.INFINITE_CACHE
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
                      (await A.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: _,
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
              u = await A.handleResponse({
                req: e,
                nextConfig: x,
                cacheKey: U,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: k,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: j,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: o,
              })
            if (!M) return null
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
            ;(o ||
              t.setHeader(
                'x-nextjs-cache',
                P ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              y &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (o && M) || c.delete(m.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, R.getCacheControlHeader)(u.cacheControl)),
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
                  spanName: `${$} ${_}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof w.NoFallbackError ||
            (await A.onRequestError(e, t, {
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
        () => j,
        'patchFetch',
        () => P,
        'routeModule',
        () => A,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => y,
        'workUnitAsyncStorage',
        () => k,
      ],
      773294
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1c5c46ee._.js.map
