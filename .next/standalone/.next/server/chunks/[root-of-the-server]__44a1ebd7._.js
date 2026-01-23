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
  569977,
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
      g = e.i(626937),
      f = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var v = e.i(600220),
      w = e.i(89171),
      _ = e.i(493458),
      x = e.i(79832),
      E = e.i(657446),
      A = e.i(125289),
      k = e.i(469719)
    let b = k.z.object({
      name: k.z.string().min(1, '근무 장소명은 필수입니다').optional(),
      centerLat: k.z.number().min(-90).max(90, '유효한 위도를 입력하세요').optional(),
      centerLng: k.z.number().min(-180).max(180, '유효한 경도를 입력하세요').optional(),
      radiusKm: k.z.number().min(0.5).max(50, '반경은 0.5km ~ 50km 사이여야 합니다').optional(),
      address: k.z.string().optional(),
      zonecode: k.z.string().optional(),
      description: k.z.string().optional(),
      isActive: k.z.boolean().optional(),
    })
    async function y(e, { params: t }) {
      try {
        let e = await x.default.api.getSession({ headers: await (0, _.headers)() })
        if (!e?.user?.id)
          return w.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        if ('GROOMER' !== e.user.role)
          return w.NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 })
        let { id: r } = await t,
          a = await E.prisma.groomerWorkArea.findFirst({ where: { id: r, groomerId: e.user.id } })
        if (!a)
          return w.NextResponse.json({ error: '근무 장소를 찾을 수 없습니다' }, { status: 404 })
        return w.NextResponse.json(a)
      } catch (e) {
        return (
          console.error('Failed to fetch work area:', e),
          w.NextResponse.json({ error: '근무 장소 조회에 실패했습니다' }, { status: 500 })
        )
      }
    }
    async function N(e, { params: t }) {
      try {
        let r = await x.default.api.getSession({ headers: await (0, _.headers)() })
        if (!r?.user?.id)
          return w.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        if ('GROOMER' !== r.user.role)
          return w.NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 })
        let a = await E.prisma.groomerWorkArea.findFirst({
          where: { id: (await t).id, groomerId: r.user.id },
        })
        if (!a)
          return w.NextResponse.json({ error: '근무 장소를 찾을 수 없습니다' }, { status: 404 })
        let s = await e.json()
        console.log('PUT request body:', s)
        let o = b.parse(s)
        console.log('Validated data:', o)
        let n = { ...o }
        if (o.address && o.address !== a.address) {
          console.log('Attempting geocoding for new address:', o.address)
          let e = await (0, A.geocodeAddress)(o.address)
          if ((console.log('Geocoding result:', e), !e))
            return w.NextResponse.json(
              { error: '주소를 좌표로 변환할 수 없습니다. 올바른 주소를 입력해주세요.' },
              { status: 400 }
            )
          n = { ...o, centerLat: e.latitude, centerLng: e.longitude, address: e.address }
        } else if (o.address === a.address) {
          console.log('Address unchanged, skipping geocoding')
          let { address: e, ...t } = o
          n = t
        }
        console.log('Final update data:', n)
        let i = await E.prisma.groomerWorkArea.update({ where: { id: (await t).id }, data: n })
        return w.NextResponse.json(i)
      } catch (e) {
        if (e instanceof k.z.ZodError)
          return w.NextResponse.json(
            { error: '입력 데이터가 올바르지 않습니다', details: e.issues },
            { status: 400 }
          )
        return (
          console.error('Failed to update work area:', e),
          w.NextResponse.json({ error: '근무 장소 수정에 실패했습니다' }, { status: 500 })
        )
      }
    }
    async function j(e, { params: t }) {
      try {
        let e = await x.default.api.getSession({ headers: await (0, _.headers)() })
        if (!e?.user?.id)
          return w.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        if ('GROOMER' !== e.user.role)
          return w.NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 })
        if (
          !(await E.prisma.groomerWorkArea.findFirst({
            where: { id: (await t).id, groomerId: e.user.id },
          }))
        )
          return w.NextResponse.json({ error: '근무 장소를 찾을 수 없습니다' }, { status: 404 })
        return (
          await E.prisma.groomerWorkArea.delete({ where: { id: (await t).id } }),
          w.NextResponse.json({ message: '근무 장소가 삭제되었습니다' })
        )
      } catch (e) {
        return (
          console.error('Failed to delete work area:', e),
          w.NextResponse.json({ error: '근무 장소 삭제에 실패했습니다' }, { status: 500 })
        )
      }
    }
    e.s(['DELETE', () => j, 'GET', () => y, 'PUT', () => N], 124627)
    var P = e.i(124627)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/groomer/work-areas/[id]/route',
          pathname: '/api/groomer/work-areas/[id]',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/groomer/work-areas/[id]/route.ts',
        nextConfigOutput: 'standalone',
        userland: P,
      }),
      { workAsyncStorage: O, workUnitAsyncStorage: T, serverHooks: S } = C
    function K() {
      return (0, a.patchFetch)({ workAsyncStorage: O, workUnitAsyncStorage: T })
    }
    async function I(e, t, a) {
      C.isDev && (0, s.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let w = '/api/groomer/work-areas/[id]/route'
      w = w.replace(/\/index$/, '') || '/'
      let _ = await C.prepare(e, t, { srcPage: w, multiZoneDraftMode: !1 })
      if (!_)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: x,
          params: E,
          nextConfig: A,
          parsedUrl: k,
          isDraftMode: b,
          prerenderManifest: y,
          routerServerContext: N,
          isOnDemandRevalidate: j,
          revalidateOnlyGenerated: P,
          resolvedPathname: O,
          clientReferenceManifest: T,
          serverActionsManifest: S,
        } = _,
        K = (0, l.normalizeAppPath)(w),
        I = !!(y.dynamicRoutes[K] || y.routes[O]),
        M = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, k, !1)
            : t.end('This page could not be found'),
          null
        )
      if (I && !b) {
        let e = !!y.routes[O],
          t = y.dynamicRoutes[K]
        if (t && !1 === t.fallback && !e) {
          if (A.experimental.adapterPath) return await M()
          throw new R.NoFallbackError()
        }
      }
      let q = null
      !I || C.isDev || b || (q = '/index' === (q = O) ? '/' : q)
      let U = !0 === C.isDev || !I,
        F = I && !U
      S &&
        T &&
        (0, n.setReferenceManifestsSingleton)({
          page: w,
          clientReferenceManifest: T,
          serverActionsManifest: S,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: S }),
        })
      let H = e.method || 'GET',
        D = (0, o.getTracer)(),
        L = D.getActiveScopeSpan(),
        z = {
          params: E,
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
            onInstrumentationRequestError: (t, r, a) => C.onRequestError(e, t, a, N),
          },
          sharedContext: { buildId: x },
        },
        $ = new d.NodeNextRequest(e),
        G = new d.NodeNextResponse(t),
        W = u.NextRequestAdapter.fromNodeNextRequest($, (0, u.signalFromNodeResponse)(t))
      try {
        let n = async (e) =>
            C.handle(W, z).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = D.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let a = r.get('next.route')
              if (a) {
                let t = `${H} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${H} ${w}`)
            }),
          i = !!(0, s.getRequestMeta)(e, 'minimalMode'),
          l = async (s) => {
            var o, l
            let d = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && j && P && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let o = await n(s)
                  e.fetchMetrics = z.renderOpts.fetchMetrics
                  let l = z.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let d = z.renderOpts.collectedTags
                  if (!I)
                    return (await (0, h.sendResponse)($, G, o, z.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(d && (t[f.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== z.renderOpts.collectedRevalidate &&
                        !(z.renderOpts.collectedRevalidate >= f.INFINITE_CACHE) &&
                        z.renderOpts.collectedRevalidate,
                      a =
                        void 0 === z.renderOpts.collectedExpire ||
                        z.renderOpts.collectedExpire >= f.INFINITE_CACHE
                          ? void 0
                          : z.renderOpts.collectedExpire
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
                      (await C.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: w,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: F,
                            isOnDemandRevalidate: j,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              u = await C.handleResponse({
                req: e,
                nextConfig: A,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: y,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: j,
                revalidateOnlyGenerated: P,
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
                j ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              b &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (i && I) || c.delete(f.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, g.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                $,
                G,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        L
          ? await l(L)
          : await D.withPropagatedContext(e.headers, () =>
              D.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${H} ${w}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': H, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: K,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: F,
                isOnDemandRevalidate: j,
              }),
            })),
          I)
        )
          throw t
        return (await (0, h.sendResponse)($, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => I,
        'patchFetch',
        () => K,
        'routeModule',
        () => C,
        'serverHooks',
        () => S,
        'workAsyncStorage',
        () => O,
        'workUnitAsyncStorage',
        () => T,
      ],
      569977
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

//# sourceMappingURL=%5Broot-of-the-server%5D__44a1ebd7._.js.map
