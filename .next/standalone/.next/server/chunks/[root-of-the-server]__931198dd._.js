module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  32226,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      o = e.i(759756),
      n = e.i(561916),
      s = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      v = e.i(626937),
      f = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      g = e.i(89171),
      w = e.i(493458),
      E = e.i(79832),
      x = e.i(657446)
    async function b(e, { params: t }) {
      let { id: r, action: a } = await t
      try {
        let t = await E.default.api.getSession({ headers: await (0, w.headers)() })
        if (!t || t.user?.role !== 'ADMIN')
          return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let o = await x.prisma.user.findFirst({
          where: { id: r, role: 'GROOMER' },
          include: { groomerProfile: !0 },
        })
        if (!o) return g.NextResponse.json({ error: 'Groomer not found' }, { status: 404 })
        let n = o.groomerProfile
        switch (
          (!n &&
            (n = await x.prisma.groomerProfile.create({ data: { groomerId: r, isActive: !0 } })),
          a)
        ) {
          case 'activate':
            await x.prisma.groomerProfile.update({
              where: { groomerId: r },
              data: { isActive: !0 },
            })
            break
          case 'deactivate':
            await x.prisma.groomerProfile.update({
              where: { groomerId: r },
              data: { isActive: !1 },
            })
            break
          case 'suspend':
            await Promise.all([
              x.prisma.groomerProfile.update({ where: { groomerId: r }, data: { isActive: !1 } }),
            ])
            break
          case 'update-commission':
            let { commissionGradeId: s } = await e.json()
            if (!s)
              return g.NextResponse.json(
                { error: 'Commission grade ID is required' },
                { status: 400 }
              )
            if (!(await x.prisma.groomerCommissionGrade.findUnique({ where: { id: s } })))
              return g.NextResponse.json({ error: 'Commission grade not found' }, { status: 404 })
            await x.prisma.groomerProfile.update({
              where: { groomerId: r },
              data: { commissionGradeId: s },
            })
            break
          default:
            return g.NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }
        return g.NextResponse.json({ success: !0 })
      } catch (e) {
        return (
          console.error(`Error performing action ${a} on groomer ${r}:`, e),
          g.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['POST', () => b], 654476)
    var C = e.i(654476)
    let P = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/groomers/[id]/[action]/route',
          pathname: '/api/admin/groomers/[id]/[action]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/groomers/[id]/[action]/route.ts',
        nextConfigOutput: 'standalone',
        userland: C,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: N, serverHooks: y } = P
    function k() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: N })
    }
    async function j(e, t, a) {
      P.isDev && (0, o.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let g = '/api/admin/groomers/[id]/[action]/route'
      g = g.replace(/\/index$/, '') || '/'
      let w = await P.prepare(e, t, { srcPage: g, multiZoneDraftMode: !1 })
      if (!w)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: E,
          params: x,
          nextConfig: b,
          parsedUrl: C,
          isDraftMode: A,
          prerenderManifest: N,
          routerServerContext: y,
          isOnDemandRevalidate: k,
          revalidateOnlyGenerated: j,
          resolvedPathname: T,
          clientReferenceManifest: O,
          serverActionsManifest: S,
        } = w,
        I = (0, l.normalizeAppPath)(g),
        q = !!(N.dynamicRoutes[I] || N.routes[T]),
        M = async () => (
          (null == y ? void 0 : y.render404)
            ? await y.render404(e, t, C, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !A) {
        let e = !!N.routes[T],
          t = N.dynamicRoutes[I]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await M()
          throw new R.NoFallbackError()
        }
      }
      let U = null
      !q || P.isDev || A || (U = '/index' === (U = T) ? '/' : U)
      let H = !0 === P.isDev || !q,
        D = q && !H
      S &&
        O &&
        (0, s.setReferenceManifestsSingleton)({
          page: g,
          clientReferenceManifest: O,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let $ = e.method || 'GET',
        F = (0, n.getTracer)(),
        K = F.getActiveScopeSpan(),
        G = {
          params: x,
          prerenderManifest: N,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, o.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => P.onRequestError(e, t, a, y),
          },
          sharedContext: { buildId: E },
        },
        B = new d.NodeNextRequest(e),
        L = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(B, (0, u.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            P.handle(V, G).finally(() => {
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
              } else e.updateName(`${$} ${g}`)
            }),
          i = !!(0, o.getRequestMeta)(e, 'minimalMode'),
          l = async (o) => {
            var n, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && k && j && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let n = await s(o)
                  e.fetchMetrics = G.renderOpts.fetchMetrics
                  let l = G.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = G.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(B, L, n, G.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await n.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(n.headers)
                    ;(d && (t[f.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== G.renderOpts.collectedRevalidate &&
                        !(G.renderOpts.collectedRevalidate >= f.INFINITE_CACHE) &&
                        G.renderOpts.collectedRevalidate,
                      a =
                        void 0 === G.renderOpts.collectedExpire ||
                        G.renderOpts.collectedExpire >= f.INFINITE_CACHE
                          ? void 0
                          : G.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: _.CachedRouteKind.APP_ROUTE,
                        status: n.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: a },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await P.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: g,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: k,
                          }),
                        },
                        y
                      )),
                    t
                  )
                }
              },
              u = await P.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: U,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: N,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: k,
                revalidateOnlyGenerated: j,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!q) return null
            if (
              (null == u || null == (n = u.value) ? void 0 : n.kind) !== _.CachedRouteKind.APP_ROUTE
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
                k ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && q) || c.delete(f.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                B,
                L,
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
                  spanName: `${$} ${g}`,
                  kind: n.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await P.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: I,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: k,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(B, L, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => j,
        'patchFetch',
        () => k,
        'routeModule',
        () => P,
        'serverHooks',
        () => y,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => N,
      ],
      32226
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

//# sourceMappingURL=%5Broot-of-the-server%5D__931198dd._.js.map
