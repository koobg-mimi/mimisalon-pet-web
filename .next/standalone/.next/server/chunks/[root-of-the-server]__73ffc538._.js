module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  685359,
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
      v = e.i(570101),
      R = e.i(626937),
      m = e.i(10372),
      f = e.i(193695)
    e.i(52474)
    var _ = e.i(600220),
      w = e.i(89171),
      E = e.i(493458),
      g = e.i(79832),
      x = e.i(657446),
      b = e.i(469719)
    let N = b.z.object({
      name: b.z.string().min(1, '옵션 이름을 입력해주세요').optional(),
      description: b.z.string().optional(),
      price: b.z.number().positive('가격은 0보다 커야 합니다').optional(),
      applicableCategories: b.z
        .array(b.z.nativeEnum(x.BreedCategory))
        .min(1, '최소 1개 이상의 품종 카테고리를 선택해주세요')
        .optional(),
      displayOrder: b.z.number().int().optional(),
      isActive: b.z.boolean().optional(),
    })
    async function y(e, { params: t }) {
      try {
        let e = await g.default.api.getSession({ headers: await (0, E.headers)() })
        if (!e?.user || 'ADMIN' !== e.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r } = await t,
          a = await x.prisma.serviceOption.findUnique({
            where: { id: r },
            include: { _count: { select: { bookingPetOptions: !0 } } },
          })
        if (!a) return w.NextResponse.json({ error: '옵션을 찾을 수 없습니다' }, { status: 404 })
        return w.NextResponse.json(a)
      } catch (e) {
        return (
          console.error('Error fetching service option:', e),
          w.NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        )
      }
    }
    async function C(e, { params: t }) {
      try {
        let r = await g.default.api.getSession({ headers: await (0, E.headers)() })
        if (!r?.user || 'ADMIN' !== r.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: a } = await t,
          n = await e.json(),
          s = N.parse(n),
          o = await x.prisma.serviceOption.update({ where: { id: a }, data: s })
        return w.NextResponse.json(o)
      } catch (e) {
        if (e instanceof b.z.ZodError)
          return w.NextResponse.json(
            { error: '입력 데이터가 올바르지 않습니다', details: e.issues },
            { status: 400 }
          )
        return (
          console.error('Error updating service option:', e),
          w.NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        )
      }
    }
    async function j(e, { params: t }) {
      try {
        let e = await g.default.api.getSession({ headers: await (0, E.headers)() })
        if (!e?.user || 'ADMIN' !== e.user.role)
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { id: r } = await t
        if ((await x.prisma.bookingPetOption.count({ where: { serviceOptionId: r } })) > 0)
          return w.NextResponse.json(
            {
              error: '이 옵션은 예약에서 사용 중이므로 삭제할 수 없습니다. 비활성화를 권장합니다.',
            },
            { status: 400 }
          )
        return (
          await x.prisma.serviceOption.delete({ where: { id: r } }),
          w.NextResponse.json({ message: '옵션이 삭제되었습니다' })
        )
      } catch (e) {
        return (
          console.error('Error deleting service option:', e),
          w.NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        )
      }
    }
    e.s(['DELETE', () => j, 'GET', () => y, 'PUT', () => C], 158991)
    var A = e.i(158991)
    let P = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/admin/service-options/[id]/route',
          pathname: '/api/admin/service-options/[id]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/service-options/[id]/route.ts',
        nextConfigOutput: 'standalone',
        userland: A,
      }),
      { workAsyncStorage: O, workUnitAsyncStorage: k, serverHooks: T } = P
    function S() {
      return (0, a.patchFetch)({ workAsyncStorage: O, workUnitAsyncStorage: k })
    }
    async function I(e, t, a) {
      P.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/admin/service-options/[id]/route'
      w = w.replace(/\/index$/, '') || '/'
      let E = await P.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
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
          parsedUrl: N,
          isDraftMode: y,
          prerenderManifest: C,
          routerServerContext: j,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: O,
          resolvedPathname: k,
          clientReferenceManifest: T,
          serverActionsManifest: S,
        } = E,
        I = (0, l.normalizeAppPath)(w),
        U = !!(C.dynamicRoutes[I] || C.routes[k]),
        M = async () => (
          (null == j ? void 0 : j.render404)
            ? await j.render404(e, t, N, !1)
            : t.end('This page could not be found'),
          null
        )
      if (U && !y) {
        let e = !!C.routes[k],
          t = C.dynamicRoutes[I]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await M()
          throw new f.NoFallbackError()
        }
      }
      let q = null
      !U || P.isDev || y || (q = '/index' === (q = k) ? '/' : q)
      let D = !0 === P.isDev || !U,
        H = U && !D
      S &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: w,
          clientReferenceManifest: T,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let z = e.method || 'GET',
        $ = (0, s.getTracer)(),
        F = $.getActiveScopeSpan(),
        K = {
          params: x,
          prerenderManifest: C,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: D,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => P.onRequestError(e, t, a, j),
          },
          sharedContext: { buildId: g },
        },
        B = new u.NodeNextRequest(e),
        L = new u.NodeNextResponse(t),
        G = d.NextRequestAdapter.fromNodeNextRequest(B, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            P.handle(G, K).finally(() => {
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
                let t = `${z} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${z} ${w}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && A && O && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = K.renderOpts.collectedTags
                  if (!U)
                    return (await (0, h.sendResponse)(B, L, s, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, v.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[m.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= m.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      a =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= m.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
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
                      (await P.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        j
                      )),
                    t
                  )
                }
              },
              d = await P.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: C,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: O,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!U) return null
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
                A ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              y &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, v.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && U) || c.delete(m.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, R.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                B,
                L,
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
                  spanName: `${z} ${w}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': z, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof f.NoFallbackError ||
            (await P.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: I,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: A,
              }),
            })),
          U)
        )
          throw t
        return (await (0, h.sendResponse)(B, L, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => I,
        'patchFetch',
        () => S,
        'routeModule',
        () => P,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => O,
        'workUnitAsyncStorage',
        () => k,
      ],
      685359
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

//# sourceMappingURL=%5Broot-of-the-server%5D__73ffc538._.js.map
