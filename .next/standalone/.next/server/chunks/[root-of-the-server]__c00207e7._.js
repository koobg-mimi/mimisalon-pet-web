module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  125289,
  (e) => {
    'use strict'
    async function t(e) {
      let t = process.env.KAKAO_REST_API_KEY
      if (!t) return (console.error('KAKAO_REST_API_KEY is not configured'), null)
      try {
        let r = encodeURIComponent(e),
          a = `https://dapi.kakao.com/v2/local/search/address.json?query=${r}`
        console.log('Kakao API Request:', {
          url: a,
          apiKeyLength: t.length,
          apiKeyPrefix: t.substring(0, 8) + '...',
          address: e,
        })
        let s = await fetch(a, {
          headers: {
            Authorization: `KakaoAK ${t}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; MimiSalon/1.0)',
            KA: 'sdk/1.0.0 os/javascript origin/http://localhost:3001',
          },
        })
        if (!s.ok) {
          let e = await s.text()
          if (
            (console.error('Kakao geocoding API error:', {
              status: s.status,
              statusText: s.statusText,
              body: e,
            }),
            401 === s.status)
          ) {
            let t = JSON.parse(e)
            t.message?.includes('domain mismatched') &&
              console.error(
                "Domain mismatch error. Please add localhost to your Kakao app's registered domains."
              )
          } else if (403 === s.status) {
            let t = JSON.parse(e)
            t.message?.includes('disabled OPEN_MAP_AND_LOCAL service') &&
              console.error(
                "Kakao Local API service is disabled. Enable 'Maps and Local' service in your Kakao app."
              )
          }
          return null
        }
        let o = await s.json()
        if (0 === o.documents.length)
          return (console.warn('No geocoding results found for address:', e), null)
        let n = o.documents[0]
        return { latitude: parseFloat(n.y), longitude: parseFloat(n.x), address: n.address_name }
      } catch (e) {
        return (console.error('Error during geocoding:', e), null)
      }
    }
    e.s(['geocodeAddress', () => t])
  },
  31104,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      a = e.i(996250),
      s = e.i(759756),
      o = e.i(561916),
      n = e.i(114444),
      i = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      R = e.i(626937),
      g = e.i(10372),
      f = e.i(193695)
    e.i(52474)
    var v = e.i(600220),
      _ = e.i(89171),
      w = e.i(493458),
      E = e.i(79832),
      x = e.i(657446),
      A = e.i(125289),
      k = e.i(469719)
    let b = k.z.object({
      name: k.z.string().min(1, '근무 장소명은 필수입니다'),
      centerLat: k.z.number().min(-90).max(90, '유효한 위도를 입력하세요').optional(),
      centerLng: k.z.number().min(-180).max(180, '유효한 경도를 입력하세요').optional(),
      radiusKm: k.z.number().min(0.5).max(50, '반경은 0.5km ~ 50km 사이여야 합니다'),
      address: k.z.string().min(1, '주소는 필수입니다'),
      zonecode: k.z.string().optional(),
      description: k.z.string().optional(),
    })
    async function y() {
      try {
        let e = await E.default.api.getSession({ headers: await (0, w.headers)() })
        if (!e?.user?.id)
          return _.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        if ('GROOMER' !== e.user.role)
          return _.NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 })
        let t = await x.prisma.groomerWorkArea.findMany({
          where: { groomerId: e.user.id },
          orderBy: { createdAt: 'desc' },
        })
        return _.NextResponse.json(t)
      } catch (e) {
        return (
          console.error('Failed to fetch work areas:', e),
          _.NextResponse.json({ error: '근무 장소 조회에 실패했습니다' }, { status: 500 })
        )
      }
    }
    async function C(e) {
      try {
        let t = await E.default.api.getSession({ headers: await (0, w.headers)() })
        if (!t?.user?.id)
          return _.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        if ('GROOMER' !== t.user.role)
          return _.NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 })
        let r = await e.json(),
          a = b.parse(r),
          s = await (0, A.geocodeAddress)(a.address)
        if (!s)
          return _.NextResponse.json(
            { error: '주소를 좌표로 변환할 수 없습니다. 올바른 주소를 입력해주세요.' },
            { status: 400 }
          )
        let o = await x.prisma.groomerWorkArea.create({
          data: {
            groomerId: t.user.id,
            name: a.name,
            centerLat: s.latitude,
            centerLng: s.longitude,
            radiusKm: a.radiusKm,
            address: s.address,
            description: a.description,
          },
        })
        return _.NextResponse.json(o, { status: 201 })
      } catch (e) {
        if (e instanceof k.z.ZodError)
          return _.NextResponse.json(
            { error: '입력 데이터가 올바르지 않습니다', details: e },
            { status: 400 }
          )
        return (
          console.error('Failed to create work area:', e),
          _.NextResponse.json({ error: '근무 장소 생성에 실패했습니다' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => y, 'POST', () => C, 'createWorkAreaSchema', 0, b], 173810)
    var N = e.i(173810)
    let P = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/groomer/work-areas/route',
          pathname: '/api/groomer/work-areas',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/groomer/work-areas/route.ts',
        nextConfigOutput: 'standalone',
        userland: N,
      }),
      { workAsyncStorage: j, workUnitAsyncStorage: O, serverHooks: T } = P
    function S() {
      return (0, a.patchFetch)({ workAsyncStorage: j, workUnitAsyncStorage: O })
    }
    async function K(e, t, a) {
      P.isDev && (0, s.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let _ = '/api/groomer/work-areas/route'
      _ = _.replace(/\/index$/, '') || '/'
      let w = await P.prepare(e, t, { srcPage: _, multiZoneDraftMode: !1 })
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
          nextConfig: A,
          parsedUrl: k,
          isDraftMode: b,
          prerenderManifest: y,
          routerServerContext: C,
          isOnDemandRevalidate: N,
          revalidateOnlyGenerated: j,
          resolvedPathname: O,
          clientReferenceManifest: T,
          serverActionsManifest: S,
        } = w,
        K = (0, l.normalizeAppPath)(_),
        I = !!(y.dynamicRoutes[K] || y.routes[O]),
        M = async () => (
          (null == C ? void 0 : C.render404)
            ? await C.render404(e, t, k, !1)
            : t.end('This page could not be found'),
          null
        )
      if (I && !b) {
        let e = !!y.routes[O],
          t = y.dynamicRoutes[K]
        if (t && !1 === t.fallback && !e) {
          if (A.experimental.adapterPath) return await M()
          throw new f.NoFallbackError()
        }
      }
      let q = null
      !I || P.isDev || b || (q = '/index' === (q = O) ? '/' : q)
      let U = !0 === P.isDev || !I,
        H = I && !U
      S &&
        T &&
        (0, n.setReferenceManifestsSingleton)({
          page: _,
          clientReferenceManifest: T,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let D = e.method || 'GET',
        L = (0, o.getTracer)(),
        z = L.getActiveScopeSpan(),
        F = {
          params: x,
          prerenderManifest: y,
          renderOpts: {
            experimental: { authInterrupts: !!A.experimental.authInterrupts },
            cacheComponents: !!A.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, s.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: A.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => P.onRequestError(e, t, a, C),
          },
          sharedContext: { buildId: E },
        },
        $ = new d.NodeNextRequest(e),
        B = new d.NodeNextResponse(t),
        G = u.NextRequestAdapter.fromNodeNextRequest($, (0, u.signalFromNodeResponse)(t))
      try {
        let n = async (e) =>
            P.handle(G, F).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = L.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = r.get('next.route')
              if (a) {
                let t = `${D} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${D} ${_}`)
            }),
          i = !!(0, s.getRequestMeta)(e, 'minimalMode'),
          l = async (s) => {
            var o, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && N && j && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await n(s)
                  e.fetchMetrics = F.renderOpts.fetchMetrics
                  let l = F.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = F.renderOpts.collectedTags
                  if (!I)
                    return (await (0, h.sendResponse)($, B, o, F.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(d && (t[g.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== F.renderOpts.collectedRevalidate &&
                        !(F.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        F.renderOpts.collectedRevalidate,
                      a =
                        void 0 === F.renderOpts.collectedExpire ||
                        F.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : F.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: v.CachedRouteKind.APP_ROUTE,
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
                      (await P.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: _,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: N,
                          }),
                        },
                        C
                      )),
                    t
                  )
                }
              },
              u = await P.handleResponse({
                req: e,
                nextConfig: A,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: y,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: N,
                revalidateOnlyGenerated: j,
                responseGenerator: d,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!I) return null
            if (
              (null == u || null == (o = u.value) ? void 0 : o.kind) !== v.CachedRouteKind.APP_ROUTE
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
                N ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              b &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && I) || c.delete(g.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, R.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                $,
                B,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        z
          ? await l(z)
          : await L.withPropagatedContext(e.headers, () =>
              L.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${D} ${_}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': D, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof f.NoFallbackError ||
            (await P.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: K,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: N,
              }),
            })),
          I)
        )
          throw t
        return (await (0, h.sendResponse)($, B, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => K,
        'patchFetch',
        () => S,
        'routeModule',
        () => P,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => j,
        'workUnitAsyncStorage',
        () => O,
      ],
      31104
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c00207e7._.js.map
