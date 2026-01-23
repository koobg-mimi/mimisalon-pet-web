module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  788189,
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
      c = e.i(487718),
      d = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      f = e.i(626937),
      R = e.i(10372),
      v = e.i(193695)
    e.i(52474)
    var b = e.i(600220),
      g = e.i(89171),
      _ = e.i(493458),
      k = e.i(79832),
      w = e.i(657446),
      N = e.i(469719)
    function A(e) {
      return e.trim().replace(/[<>"']/g, '')
    }
    let x = N.z.object({
      bankName: N.z.string().min(1, 'Bank name is required'),
      accountNumber: N.z
        .string()
        .min(8, 'Account number is too short')
        .max(20, 'Account number is too long'),
      accountHolder: N.z
        .string()
        .min(1, 'Account holder name is required')
        .max(50, 'Account holder name is too long'),
    })
    async function E(e) {
      try {
        let t = await k.default.api.getSession({ headers: await (0, _.headers)() })
        if (!t || t.user?.role !== 'GROOMER')
          return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let r = await e.json(),
          { bankName: a, accountNumber: n, accountHolder: o } = x.parse(r),
          s = A(a),
          i = n.replace(/[-\s]/g, ''),
          l = A(o)
        if (!/^\d+$/.test(i))
          return g.NextResponse.json(
            { error: 'Account number must contain only digits' },
            { status: 400 }
          )
        let u = await w.prisma.user.findUnique({
          where: { id: t.user.id },
          select: { groomerProfile: { select: { id: !0 } } },
        })
        if (!u?.groomerProfile)
          return g.NextResponse.json({ error: 'Groomer profile not found' }, { status: 404 })
        let c = await w.prisma.groomerProfile.update({
          where: { id: u.groomerProfile.id },
          data: {
            bankName: s,
            bankAccountNumber: i,
            bankAccountHolderName: l,
            updatedAt: new Date(),
          },
          select: { bankName: !0, bankAccountNumber: !0, bankAccountHolderName: !0 },
        })
        return (
          console.log(
            `Bank account updated for groomer ID: ${t.user.id} at ${new Date().toISOString()}`
          ),
          g.NextResponse.json({ message: 'Bank account information updated successfully', data: c })
        )
      } catch (e) {
        return (
          console.error('Failed to update bank account:', e),
          g.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    async function P(e) {
      try {
        let e = await k.default.api.getSession({ headers: await (0, _.headers)() })
        if (!e || e.user?.role !== 'GROOMER')
          return g.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let t = await w.prisma.user.findUnique({
          where: { id: e.user.id },
          select: {
            groomerProfile: {
              select: { bankName: !0, bankAccountNumber: !0, bankAccountHolderName: !0 },
            },
          },
        })
        if (!t?.groomerProfile)
          return g.NextResponse.json({ error: 'Groomer profile not found' }, { status: 404 })
        return g.NextResponse.json({
          bankName: t.groomerProfile.bankName || null,
          bankAccountNumber: t.groomerProfile.bankAccountNumber || null,
          bankAccountHolderName: t.groomerProfile.bankAccountHolderName || null,
        })
      } catch (e) {
        return (
          console.error('Failed to get bank account:', e),
          g.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => P, 'PUT', () => E, 'updateBankAccountSchema', 0, x], 388684)
    var C = e.i(388684)
    let y = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/groomer/profile/bank-account/route',
          pathname: '/api/groomer/profile/bank-account',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/groomer/profile/bank-account/route.ts',
        nextConfigOutput: 'standalone',
        userland: C,
      }),
      { workAsyncStorage: j, workUnitAsyncStorage: O, serverHooks: T } = y
    function S() {
      return (0, a.patchFetch)({ workAsyncStorage: j, workUnitAsyncStorage: O })
    }
    async function H(e, t, a) {
      y.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let g = '/api/groomer/profile/bank-account/route'
      g = g.replace(/\/index$/, '') || '/'
      let _ = await y.prepare(e, t, { srcPage: g, multiZoneDraftMode: !1 })
      if (!_)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: k,
          params: w,
          nextConfig: N,
          parsedUrl: A,
          isDraftMode: x,
          prerenderManifest: E,
          routerServerContext: P,
          isOnDemandRevalidate: C,
          revalidateOnlyGenerated: j,
          resolvedPathname: O,
          clientReferenceManifest: T,
          serverActionsManifest: S,
        } = _,
        H = (0, l.normalizeAppPath)(g),
        q = !!(E.dynamicRoutes[H] || E.routes[O]),
        U = async () => (
          (null == P ? void 0 : P.render404)
            ? await P.render404(e, t, A, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !x) {
        let e = !!E.routes[O],
          t = E.dynamicRoutes[H]
        if (t && !1 === t.fallback && !e) {
          if (N.experimental.adapterPath) return await U()
          throw new v.NoFallbackError()
        }
      }
      let I = null
      !q || y.isDev || x || (I = '/index' === (I = O) ? '/' : I)
      let M = !0 === y.isDev || !q,
        D = q && !M
      S &&
        T &&
        (0, s.setReferenceManifestsSingleton)({
          page: g,
          clientReferenceManifest: T,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let $ = e.method || 'GET',
        F = (0, o.getTracer)(),
        B = F.getActiveScopeSpan(),
        G = {
          params: w,
          prerenderManifest: E,
          renderOpts: {
            experimental: { authInterrupts: !!N.experimental.authInterrupts },
            cacheComponents: !!N.cacheComponents,
            supportsDynamicResponse: M,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: N.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => y.onRequestError(e, t, a, P),
          },
          sharedContext: { buildId: k },
        },
        K = new u.NodeNextRequest(e),
        z = new u.NodeNextResponse(t),
        L = c.NextRequestAdapter.fromNodeNextRequest(K, (0, c.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            y.handle(L, G).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = F.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== d.BaseServerSpan.handleRequest)
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
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var o, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && C && j && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await s(n)
                  e.fetchMetrics = G.renderOpts.fetchMetrics
                  let l = G.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = G.renderOpts.collectedTags
                  if (!q)
                    return (await (0, m.sendResponse)(K, z, o, G.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(u && (t[R.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== G.renderOpts.collectedRevalidate &&
                        !(G.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        G.renderOpts.collectedRevalidate,
                      a =
                        void 0 === G.renderOpts.collectedExpire ||
                        G.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : G.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: b.CachedRouteKind.APP_ROUTE,
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
                            isOnDemandRevalidate: C,
                          }),
                        },
                        P
                      )),
                    t
                  )
                }
              },
              c = await y.handleResponse({
                req: e,
                nextConfig: N,
                cacheKey: I,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: E,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: C,
                revalidateOnlyGenerated: j,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!q) return null
            if (
              (null == c || null == (o = c.value) ? void 0 : o.kind) !== b.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == c || null == (l = c.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(i ||
              t.setHeader(
                'x-nextjs-cache',
                C ? 'REVALIDATED' : c.isMiss ? 'MISS' : c.isStale ? 'STALE' : 'HIT'
              ),
              x &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, h.fromNodeOutgoingHttpHeaders)(c.value.headers)
            return (
              (i && q) || d.delete(R.NEXT_CACHE_TAGS_HEADER),
              !c.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, f.getCacheControlHeader)(c.cacheControl)),
              await (0, m.sendResponse)(
                K,
                z,
                new Response(c.value.body, { headers: d, status: c.value.status || 200 })
              ),
              null
            )
          }
        B
          ? await l(B)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                d.BaseServerSpan.handleRequest,
                {
                  spanName: `${$} ${g}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': $, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof v.NoFallbackError ||
            (await y.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: H,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: D,
                isOnDemandRevalidate: C,
              }),
            })),
          q)
        )
          throw t
        return (await (0, m.sendResponse)(K, z, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => H,
        'patchFetch',
        () => S,
        'routeModule',
        () => y,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => j,
        'workUnitAsyncStorage',
        () => O,
      ],
      788189
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

//# sourceMappingURL=%5Broot-of-the-server%5D__6077fde4._.js.map
