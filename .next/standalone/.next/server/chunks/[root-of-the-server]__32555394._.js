module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  287058,
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
      u = e.i(316795),
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      f = e.i(626937),
      v = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      w = e.i(89171),
      E = e.i(493458),
      g = e.i(469719),
      x = e.i(79832),
      b = e.i(657446)
    let C = g.z.object({
      name: g.z.string().min(1, 'Name is required').optional(),
      phone: g.z
        .string()
        .regex(
          /^(\+82|0)(1[0-9]|2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70)[0-9]{3,4}[0-9]{4}$/,
          'Invalid Korean phone number format'
        )
        .optional(),
    })
    async function N() {
      try {
        let e = await x.default.api.getSession({ headers: await (0, E.headers)() })
        if (!e?.user?.email) return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if ('CUSTOMER' !== e.user.role)
          return w.NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        let t = await b.prisma.user.findUnique({
          where: { email: e.user.email },
          select: {
            id: !0,
            name: !0,
            email: !0,
            phoneNumber: !0,
            image: !0,
            role: !0,
            createdAt: !0,
            updatedAt: !0,
            addresses: { orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] },
          },
        })
        if (!t) return w.NextResponse.json({ error: 'User not found' }, { status: 404 })
        return w.NextResponse.json(t)
      } catch (e) {
        return (
          console.error('Profile fetch error:', e),
          w.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    async function A(e) {
      try {
        let t = await x.default.api.getSession({ headers: await (0, E.headers)() })
        if (!t?.user?.email) return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if ('CUSTOMER' !== t.user.role)
          return w.NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        let r = await e.json(),
          a = C.parse(r),
          n = await b.prisma.user.update({
            where: { email: t.user.email },
            data: { name: a.name, phoneNumber: a.phone },
            select: {
              id: !0,
              name: !0,
              email: !0,
              phoneNumber: !0,
              image: !0,
              role: !0,
              createdAt: !0,
              updatedAt: !0,
            },
          })
        return w.NextResponse.json(n)
      } catch (e) {
        if (e instanceof g.z.ZodError)
          return w.NextResponse.json({ error: 'Invalid data', details: e.issues }, { status: 400 })
        return (
          console.error('Profile update error:', e),
          w.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => N, 'PUT', () => A, 'updateProfileSchema', 0, C], 730187)
    var y = e.i(730187)
    let j = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/profile/route',
          pathname: '/api/customer/profile',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/profile/route.ts',
        nextConfigOutput: 'standalone',
        userland: y,
      }),
      { workAsyncStorage: P, workUnitAsyncStorage: T, serverHooks: k } = j
    function S() {
      return (0, a.patchFetch)({ workAsyncStorage: P, workUnitAsyncStorage: T })
    }
    async function O(e, t, a) {
      j.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/customer/profile/route'
      w = w.replace(/\/index$/, '') || '/'
      let E = await j.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!E)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: g,
          params: x,
          nextConfig: b,
          parsedUrl: C,
          isDraftMode: N,
          prerenderManifest: A,
          routerServerContext: y,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: T,
          resolvedPathname: k,
          clientReferenceManifest: S,
          serverActionsManifest: O,
        } = E,
        U = (0, l.normalizeAppPath)(w),
        q = !!(A.dynamicRoutes[U] || A.routes[k]),
        I = async () => (
          (null == y ? void 0 : y.render404)
            ? await y.render404(e, t, C, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !N) {
        let e = !!A.routes[k],
          t = A.dynamicRoutes[U]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await I()
          throw new R.NoFallbackError()
        }
      }
      let M = null
      !q || j.isDev || N || (M = '/index' === (M = k) ? '/' : M)
      let H = !0 === j.isDev || !q,
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
        $ = (0, s.getTracer)(),
        K = $.getActiveScopeSpan(),
        z = {
          params: x,
          prerenderManifest: A,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: H,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => j.onRequestError(e, t, a, y),
          },
          sharedContext: { buildId: g },
        },
        B = new u.NodeNextRequest(e),
        L = new u.NodeNextResponse(t),
        G = d.NextRequestAdapter.fromNodeNextRequest(B, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            j.handle(G, z).finally(() => {
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
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && P && T && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = z.renderOpts.fetchMetrics
                  let l = z.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = z.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(B, L, s, z.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[v.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== z.renderOpts.collectedRevalidate &&
                        !(z.renderOpts.collectedRevalidate >= v.INFINITE_CACHE) &&
                        z.renderOpts.collectedRevalidate,
                      a =
                        void 0 === z.renderOpts.collectedExpire ||
                        z.renderOpts.collectedExpire >= v.INFINITE_CACHE
                          ? void 0
                          : z.renderOpts.collectedExpire
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
                      (await j.onRequestError(
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
                        y
                      )),
                    t
                  )
                }
              },
              d = await j.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: M,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: A,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: T,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!q) return null
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
              N &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && q) || c.delete(v.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                B,
                L,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
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
          (t instanceof R.NoFallbackError ||
            (await j.onRequestError(e, t, {
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
        return (await (0, h.sendResponse)(B, L, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => O,
        'patchFetch',
        () => S,
        'routeModule',
        () => j,
        'serverHooks',
        () => k,
        'workAsyncStorage',
        () => P,
        'workUnitAsyncStorage',
        () => T,
      ],
      287058
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

//# sourceMappingURL=%5Broot-of-the-server%5D__32555394._.js.map
