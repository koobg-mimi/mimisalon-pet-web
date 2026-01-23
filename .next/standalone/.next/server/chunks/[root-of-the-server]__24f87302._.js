module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  732181,
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
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      v = e.i(626937),
      R = e.i(10372),
      f = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      g = e.i(89171),
      E = e.i(493458),
      w = e.i(79832),
      C = e.i(657446)
    async function x() {
      try {
        let e = await w.default.api.getSession({ headers: await (0, E.headers)() })
        if (!e?.user?.id) return new g.NextResponse('Unauthorized', { status: 401 })
        if ('CUSTOMER' !== e.user.role)
          return new g.NextResponse('Forbidden - Customer access only', { status: 403 })
        let t = await C.prisma.groomerWorkArea.findMany({
            where: { isActive: !0 },
            include: { groomer: { select: { id: !0, name: !0 } } },
            orderBy: { name: 'asc' },
          }),
          r = new Map()
        t.forEach((e) => {
          let t = e.name
          r.has(t) ||
            r.set(t, {
              id: e.id,
              name: e.name,
              address: e.address || '',
              groomers: [],
              groomerCount: 0,
            })
          let a = r.get(t)
          !a.groomers.find((t) => t.id === e.groomer.id) &&
            (a.groomers.push(e.groomer), a.groomerCount++)
        })
        let a = Array.from(r.values())
        0 === a.length &&
          a.push(
            {
              id: 'default-gangnam',
              name: '강남구',
              address: '서울특별시 강남구',
              groomers: [],
              groomerCount: 3,
            },
            {
              id: 'default-hongdae',
              name: '홍대 근처',
              address: '서울특별시 마포구',
              groomers: [],
              groomerCount: 2,
            },
            {
              id: 'default-jamsil',
              name: '잠실',
              address: '서울특별시 송파구',
              groomers: [],
              groomerCount: 1,
            }
          )
        let n = a.map((e) => ({
          id: e.id,
          name: e.name,
          address: e.address,
          phone: '02-1234-5678',
          groomerCount: e.groomerCount,
          availableServices: ['기본 미용', '스파', '네일 케어'],
        }))
        return g.NextResponse.json(n)
      } catch (e) {
        return (
          console.error('Failed to fetch locations:', e),
          new g.NextResponse('Internal Server Error', { status: 500 })
        )
      }
    }
    e.s(['GET', () => x], 733439)
    var b = e.i(733439)
    let y = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/locations/route',
          pathname: '/api/customer/locations',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/locations/route.ts',
        nextConfigOutput: 'standalone',
        userland: b,
      }),
      { workAsyncStorage: A, workUnitAsyncStorage: P, serverHooks: N } = y
    function k() {
      return (0, a.patchFetch)({ workAsyncStorage: A, workUnitAsyncStorage: P })
    }
    async function T(e, t, a) {
      y.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let g = '/api/customer/locations/route'
      g = g.replace(/\/index$/, '') || '/'
      let E = await y.prepare(e, t, { srcPage: g, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: w,
          params: C,
          nextConfig: x,
          parsedUrl: b,
          isDraftMode: A,
          prerenderManifest: P,
          routerServerContext: N,
          isOnDemandRevalidate: k,
          revalidateOnlyGenerated: T,
          resolvedPathname: S,
          clientReferenceManifest: j,
          serverActionsManifest: O,
        } = E,
        M = (0, l.normalizeAppPath)(g),
        U = !!(P.dynamicRoutes[M] || P.routes[S]),
        q = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, b, !1)
            : t.end('This page could not be found'),
          null
        )
      if (U && !A) {
        let e = !!P.routes[S],
          t = P.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (x.experimental.adapterPath) return await q()
          throw new f.NoFallbackError()
        }
      }
      let H = null
      !U || y.isDev || A || (H = '/index' === (H = S) ? '/' : H)
      let I = !0 === y.isDev || !U,
        D = U && !I
      O &&
        j &&
        (0, s.setReferenceManifestsSingleton)({
          page: g,
          clientReferenceManifest: j,
          serverActionsManifest: O,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: O }),
        })
      let F = e.method || 'GET',
        $ = (0, o.getTracer)(),
        K = $.getActiveScopeSpan(),
        B = {
          params: C,
          prerenderManifest: P,
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
            onInstrumentationRequestError: (t, r, a) => y.onRequestError(e, t, a, N),
          },
          sharedContext: { buildId: w },
        },
        L = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        V = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
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
              } else e.updateName(`${F} ${g}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var o, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && k && T && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await s(n)
                  e.fetchMetrics = B.renderOpts.fetchMetrics
                  let l = B.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = B.renderOpts.collectedTags
                  if (!U)
                    return (await (0, h.sendResponse)(L, G, o, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(d && (t[R.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== B.renderOpts.collectedRevalidate &&
                        !(B.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        B.renderOpts.collectedRevalidate,
                      a =
                        void 0 === B.renderOpts.collectedExpire ||
                        B.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : B.renderOpts.collectedExpire
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
                      (await y.onRequestError(
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
                        N
                      )),
                    t
                  )
                }
              },
              u = await y.handleResponse({
                req: e,
                nextConfig: x,
                cacheKey: H,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: P,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: k,
                revalidateOnlyGenerated: T,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!U) return null
            if (
              (null == u || null == (o = u.value) ? void 0 : o.kind) !== _.CachedRouteKind.APP_ROUTE
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
              (i && U) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
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
                  spanName: `${F} ${g}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof f.NoFallbackError ||
            (await y.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: k,
              }),
            })),
          U)
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
        () => k,
        'routeModule',
        () => y,
        'serverHooks',
        () => N,
        'workAsyncStorage',
        () => A,
        'workUnitAsyncStorage',
        () => P,
      ],
      732181
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

//# sourceMappingURL=%5Broot-of-the-server%5D__24f87302._.js.map
