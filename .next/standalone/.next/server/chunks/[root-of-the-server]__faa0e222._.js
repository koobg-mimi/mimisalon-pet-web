module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  525013,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      s = e.i(759756),
      n = e.i(561916),
      o = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      f = e.i(570101),
      v = e.i(626937),
      m = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      w = e.i(89171),
      E = e.i(493458),
      x = e.i(79832),
      g = e.i(657446)
    async function C(e, { params: t }) {
      try {
        let { id: e } = await t,
          r = await x.default.api.getSession({ headers: await (0, E.headers)() })
        if (!r?.user?.email) return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if ('CUSTOMER' !== r.user.role)
          return w.NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        let a = await g.prisma.user.findUnique({ where: { email: r.user.email } })
        if (!a) return w.NextResponse.json({ error: 'User not found' }, { status: 404 })
        if (!(await g.prisma.address.findFirst({ where: { id: e, customerId: a.id } })))
          return w.NextResponse.json({ error: 'Address not found' }, { status: 404 })
        await g.prisma.address.updateMany({
          where: { customerId: a.id, isDefault: !0, id: { not: e } },
          data: { isDefault: !1 },
        })
        let s = await g.prisma.address.update({ where: { id: e }, data: { isDefault: !0 } })
        return w.NextResponse.json(s)
      } catch (e) {
        return (
          console.error('Set default address error:', e),
          w.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['PUT', () => C], 485862)
    var b = e.i(485862)
    let y = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/addresses/[id]/default/route',
          pathname: '/api/customer/addresses/[id]/default',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/addresses/[id]/default/route.ts',
        nextConfigOutput: 'standalone',
        userland: b,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: N, serverHooks: P } = y
    function j() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: N })
    }
    async function T(e, t, a) {
      y.isDev && (0, s.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/customer/addresses/[id]/default/route'
      w = w.replace(/\/index$/, '') || '/'
      let E = await y.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: x,
          params: g,
          nextConfig: C,
          parsedUrl: b,
          isDraftMode: A,
          prerenderManifest: N,
          routerServerContext: P,
          isOnDemandRevalidate: j,
          revalidateOnlyGenerated: T,
          resolvedPathname: k,
          clientReferenceManifest: S,
          serverActionsManifest: O,
        } = E,
        U = (0, l.normalizeAppPath)(w),
        q = !!(N.dynamicRoutes[U] || N.routes[k]),
        I = async () => (
          (null == P ? void 0 : P.render404)
            ? await P.render404(e, t, b, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !A) {
        let e = !!N.routes[k],
          t = N.dynamicRoutes[U]
        if (t && !1 === t.fallback && !e) {
          if (C.experimental.adapterPath) return await I()
          throw new R.NoFallbackError()
        }
      }
      let M = null
      !q || y.isDev || A || (M = '/index' === (M = k) ? '/' : M)
      let H = !0 === y.isDev || !q,
        D = q && !H
      O &&
        S &&
        (0, o.setReferenceManifestsSingleton)({
          page: w,
          clientReferenceManifest: S,
          serverActionsManifest: O,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: O }),
        })
      let F = e.method || 'GET',
        $ = (0, n.getTracer)(),
        K = $.getActiveScopeSpan(),
        B = {
          params: g,
          prerenderManifest: N,
          renderOpts: {
            experimental: { authInterrupts: !!C.experimental.authInterrupts },
            cacheComponents: !!C.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, s.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: C.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => y.onRequestError(e, t, a, P),
          },
          sharedContext: { buildId: x },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            y.handle(V, B).finally(() => {
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
          i = !!(0, s.getRequestMeta)(e, 'minimalMode'),
          l = async (s) => {
            var n, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && j && T && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let n = await o(s)
                  e.fetchMetrics = B.renderOpts.fetchMetrics
                  let l = B.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = B.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(L, G, n, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await n.blob(),
                      t = (0, f.toNodeOutgoingHttpHeaders)(n.headers)
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
                      (await y.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: D,
                            isOnDemandRevalidate: j,
                          }),
                        },
                        P
                      )),
                    t
                  )
                }
              },
              u = await y.handleResponse({
                req: e,
                nextConfig: C,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: N,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: j,
                revalidateOnlyGenerated: T,
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
                j ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, f.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && q) || c.delete(m.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, v.getCacheControlHeader)(u.cacheControl)),
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
                  spanName: `${F} ${w}`,
                  kind: n.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await y.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: U,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: j,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(L, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => T,
        'patchFetch',
        () => j,
        'routeModule',
        () => y,
        'serverHooks',
        () => P,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => N,
      ],
      525013
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

//# sourceMappingURL=%5Broot-of-the-server%5D__faa0e222._.js.map
