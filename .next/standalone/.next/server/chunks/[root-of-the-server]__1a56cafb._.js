module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  813367,
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
      v = e.i(570101),
      R = e.i(626937),
      m = e.i(10372),
      _ = e.i(193695)
    e.i(52474)
    var f = e.i(600220),
      w = e.i(89171),
      g = e.i(493458),
      E = e.i(79832),
      b = e.i(657446)
    async function x(e, { params: t }) {
      try {
        let e = await E.default.api.getSession({ headers: await (0, g.headers)() })
        if (!e || 'ADMIN' !== e.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r } = await t,
          a = await b.prisma.breed.findUnique({
            where: { id: r },
            include: { _count: { select: { pets: !0 } } },
          })
        if (!a) return w.NextResponse.json({ error: '품종을 찾을 수 없습니다' }, { status: 404 })
        if (a._count.pets > 0)
          return w.NextResponse.json(
            {
              error: '이 품종을 사용하는 반려동물이 있어 삭제할 수 없습니다',
              petCount: a._count.pets,
              suggestion: '대신 비활성화를 권장합니다',
            },
            { status: 400 }
          )
        return (
          await b.prisma.breed.delete({ where: { id: r } }),
          w.NextResponse.json({ message: '품종이 삭제되었습니다' })
        )
      } catch (e) {
        return (
          console.error('Error deleting breed:', e),
          w.NextResponse.json(
            {
              error: 'Failed to delete breed',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    async function C(e, { params: t }) {
      try {
        let r = await E.default.api.getSession({ headers: await (0, g.headers)() })
        if (!r || 'ADMIN' !== r.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: a } = await t,
          { isActive: n } = await e.json(),
          s = await b.prisma.breed.update({ where: { id: a }, data: { isActive: n } })
        return w.NextResponse.json(s)
      } catch (e) {
        return (
          console.error('Error updating breed:', e),
          w.NextResponse.json(
            {
              error: 'Failed to update breed',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    e.s(['DELETE', () => x, 'PATCH', () => C], 66283)
    var N = e.i(66283)
    let y = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/breeds/[id]/route',
          pathname: '/api/admin/breeds/[id]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/breeds/[id]/route.ts',
        nextConfigOutput: 'standalone',
        userland: N,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: j, serverHooks: P } = y
    function k() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: j })
    }
    async function T(e, t, a) {
      y.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/admin/breeds/[id]/route'
      w = w.replace(/\/index$/, '') || '/'
      let g = await y.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!g)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: E,
          params: b,
          nextConfig: x,
          parsedUrl: C,
          isDraftMode: N,
          prerenderManifest: A,
          routerServerContext: j,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: k,
          resolvedPathname: T,
          clientReferenceManifest: S,
          serverActionsManifest: O,
        } = g,
        U = (0, l.normalizeAppPath)(w),
        q = !!(A.dynamicRoutes[U] || A.routes[T]),
        H = async () => (
          (null == j ? void 0 : j.render404)
            ? await j.render404(e, t, C, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !N) {
        let e = !!A.routes[T],
          t = A.dynamicRoutes[U]
        if (t && !1 === t.fallback && !e) {
          if (x.experimental.adapterPath) return await H()
          throw new _.NoFallbackError()
        }
      }
      let M = null
      !q || y.isDev || N || (M = '/index' === (M = T) ? '/' : M)
      let I = !0 === y.isDev || !q,
        D = q && !I
      O &&
        S &&
        (0, o.setReferenceManifestsSingleton)({
          page: w,
          clientReferenceManifest: S,
          serverActionsManifest: O,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: O }),
        })
      let F = e.method || 'GET',
        $ = (0, s.getTracer)(),
        K = $.getActiveScopeSpan(),
        L = {
          params: b,
          prerenderManifest: A,
          renderOpts: {
            experimental: { authInterrupts: !!x.experimental.authInterrupts },
            cacheComponents: !!x.cacheComponents,
            supportsDynamicResponse: I,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: x.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => y.onRequestError(e, t, a, j),
          },
          sharedContext: { buildId: E },
        },
        B = new d.NodeNextRequest(e),
        z = new d.NodeNextResponse(t),
        G = u.NextRequestAdapter.fromNodeNextRequest(B, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            y.handle(G, L).finally(() => {
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
              } else e.updateName(`${F} ${w}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && k && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = L.renderOpts.fetchMetrics
                  let l = L.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = L.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(B, z, s, L.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, v.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(d && (t[m.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== L.renderOpts.collectedRevalidate &&
                        !(L.renderOpts.collectedRevalidate >= m.INFINITE_CACHE) &&
                        L.renderOpts.collectedRevalidate,
                      a =
                        void 0 === L.renderOpts.collectedExpire ||
                        L.renderOpts.collectedExpire >= m.INFINITE_CACHE
                          ? void 0
                          : L.renderOpts.collectedExpire
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
                      (await y.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        j
                      )),
                    t
                  )
                }
              },
              u = await y.handleResponse({
                req: e,
                nextConfig: x,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: A,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: k,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!q) return null
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
                P ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              N &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && q) || c.delete(m.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, R.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                B,
                z,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
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
                  spanName: `${F} ${w}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof _.NoFallbackError ||
            (await y.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: U,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: P,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(B, z, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => T,
        'patchFetch',
        () => k,
        'routeModule',
        () => y,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => j,
      ],
      813367
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1a56cafb._.js.map
