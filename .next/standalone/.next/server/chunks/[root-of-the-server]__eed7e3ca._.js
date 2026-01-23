module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  538318,
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
      f = e.i(626937),
      m = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      g = e.i(89171),
      w = e.i(493458),
      b = e.i(79832),
      E = e.i(657446)
    async function y() {
      try {
        let e = await b.default.api.getSession({ headers: await (0, w.headers)() })
        if (!e || 'ADMIN' !== e.user.role)
          return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let t = await E.prisma.breed.findMany({
          orderBy: [
            { petType: 'asc' },
            { category: 'asc' },
            { displayOrder: 'asc' },
            { name: 'asc' },
          ],
          include: { _count: { select: { pets: !0 } } },
        })
        return g.NextResponse.json(t)
      } catch (e) {
        return (
          console.error('Error fetching breeds:', e),
          g.NextResponse.json(
            {
              error: 'Failed to fetch breeds',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    async function x(e) {
      try {
        let t = await b.default.api.getSession({ headers: await (0, w.headers)() })
        if (!t || 'ADMIN' !== t.user.role)
          return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { petType: r, category: a, breedNames: n } = await e.json()
        if (!r || !a)
          return g.NextResponse.json({ error: 'petType과 category는 필수입니다' }, { status: 400 })
        if (!n) return g.NextResponse.json({ error: '품종명을 입력해주세요' }, { status: 400 })
        let s = n
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.length > 0)
        if (0 === s.length)
          return g.NextResponse.json(
            { error: '최소 하나의 품종명을 입력해주세요' },
            { status: 400 }
          )
        let o = await E.prisma.$transaction(async (e) => {
          let t = [],
            n = []
          for (let o = 0; o < s.length; o++) {
            let i = s[o],
              l = await e.breed.findUnique({ where: { name_petType: { name: i, petType: r } } })
            if (l) {
              let t = await e.breed.update({
                where: { id: l.id },
                data: { category: a, displayOrder: o + 1, isActive: !0 },
              })
              n.push(t)
            } else {
              let n = await e.breed.create({
                data: { name: i, petType: r, category: a, displayOrder: o + 1, isActive: !0 },
              })
              t.push(n)
            }
          }
          return { created: t, updated: n }
        })
        return g.NextResponse.json(
          {
            message: '품종이 저장되었습니다',
            created: o.created.length,
            updated: o.updated.length,
            total: s.length,
          },
          { status: 200 }
        )
      } catch (e) {
        return (
          console.error('Error saving breeds:', e),
          g.NextResponse.json(
            {
              error: 'Failed to save breeds',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    e.s(['GET', () => y, 'POST', () => x], 222451)
    var C = e.i(222451)
    let N = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/breeds/route',
          pathname: '/api/admin/breeds',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/breeds/route.ts',
        nextConfigOutput: 'standalone',
        userland: C,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: j, serverHooks: P } = N
    function T() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: j })
    }
    async function k(e, t, a) {
      N.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let g = '/api/admin/breeds/route'
      g = g.replace(/\/index$/, '') || '/'
      let w = await N.prepare(e, t, { srcPage: g, multiZoneDraftMode: !1 })
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
          nextConfig: y,
          parsedUrl: x,
          isDraftMode: C,
          prerenderManifest: A,
          routerServerContext: j,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: T,
          resolvedPathname: k,
          clientReferenceManifest: O,
          serverActionsManifest: S,
        } = w,
        U = (0, l.normalizeAppPath)(g),
        M = !!(A.dynamicRoutes[U] || A.routes[k]),
        q = async () => (
          (null == j ? void 0 : j.render404)
            ? await j.render404(e, t, x, !1)
            : t.end('This page could not be found'),
          null
        )
      if (M && !C) {
        let e = !!A.routes[k],
          t = A.dynamicRoutes[U]
        if (t && !1 === t.fallback && !e) {
          if (y.experimental.adapterPath) return await q()
          throw new R.NoFallbackError()
        }
      }
      let H = null
      !M || N.isDev || C || (H = '/index' === (H = k) ? '/' : H)
      let I = !0 === N.isDev || !M,
        D = M && !I
      S &&
        O &&
        (0, o.setReferenceManifestsSingleton)({
          page: g,
          clientReferenceManifest: O,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let F = e.method || 'GET',
        $ = (0, s.getTracer)(),
        K = $.getActiveScopeSpan(),
        B = {
          params: E,
          prerenderManifest: A,
          renderOpts: {
            experimental: { authInterrupts: !!y.experimental.authInterrupts },
            cacheComponents: !!y.cacheComponents,
            supportsDynamicResponse: I,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: y.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => N.onRequestError(e, t, a, j),
          },
          sharedContext: { buildId: b },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        z = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            N.handle(z, B).finally(() => {
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
              } else e.updateName(`${F} ${g}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && T && !r)
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
                        kind: _.CachedRouteKind.APP_ROUTE,
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
                      (await N.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: g,
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
              u = await N.handleResponse({
                req: e,
                nextConfig: y,
                cacheKey: H,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: A,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: T,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!M) return null
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
                P ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              C &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && M) || c.delete(m.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(u.cacheControl)),
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
          : await $.withPropagatedContext(e.headers, () =>
              $.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${g}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await N.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: U,
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
        () => k,
        'patchFetch',
        () => T,
        'routeModule',
        () => N,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => j,
      ],
      538318
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

//# sourceMappingURL=%5Broot-of-the-server%5D__eed7e3ca._.js.map
