module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  609730,
  438220,
  874321,
  (e) => {
    'use strict'
    let t = Symbol.for('constructDateFrom')
    function r(e, r) {
      return 'function' == typeof e
        ? e(r)
        : e && 'object' == typeof e && t in e
          ? e[t](r)
          : e instanceof Date
            ? new e.constructor(r)
            : new Date(r)
    }
    function a(e, t) {
      return r(t || e, e)
    }
    ;(e.s(
      [
        'constructFromSymbol',
        0,
        t,
        'millisecondsInDay',
        0,
        864e5,
        'millisecondsInHour',
        0,
        36e5,
        'millisecondsInMinute',
        0,
        6e4,
        'millisecondsInWeek',
        0,
        6048e5,
      ],
      438220
    ),
      e.s(['constructFrom', () => r], 874321),
      e.s(['toDate', () => a], 609730))
  },
  250354,
  662001,
  (e) => {
    'use strict'
    let t = {}
    function r() {
      return t
    }
    e.s(['getDefaultOptions', () => r], 662001)
    var a = e.i(609730)
    function n(e, r) {
      let n =
          r?.weekStartsOn ??
          r?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        o = (0, a.toDate)(e, r?.in),
        s = o.getDay()
      return (o.setDate(o.getDate() - (7 * (s < n) + s - n)), o.setHours(0, 0, 0, 0), o)
    }
    e.s(['startOfWeek', () => n], 250354)
  },
  993586,
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
      d = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      h = e.i(666012),
      m = e.i(570101),
      f = e.i(626937),
      v = e.i(10372),
      R = e.i(193695)
    e.i(52474)
    var g = e.i(600220),
      _ = e.i(686880),
      w = e.i(89171),
      y = e.i(493458),
      b = e.i(343747),
      E = e.i(79832),
      k = e.i(657446)
    async function x(e) {
      try {
        let t = await E.default.api.getSession({ headers: await (0, y.headers)() })
        if (!t || t.user?.role !== 'GROOMER')
          return w.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let { searchParams: r } = new URL(e.url),
          a = parseInt(r.get('week') ?? '0'),
          n = t.user.id,
          o = new Date(),
          s = new Date(o)
        ;(s.setDate(o.getDate() - o.getDay() + 7 * a), s.setHours(0, 0, 0, 0))
        let i = new Date(s)
        ;(i.setDate(s.getDate() + 6), i.setHours(23, 59, 59, 999))
        let l = await k.prisma.groomerSchedule.findUnique({ where: { groomerId: n } })
        if (!l) return w.NextResponse.json([])
        let u = await k.prisma.groomerAvailability.findMany({
            where: { groomerId: n, date: { gte: s, lte: i } },
            include: { booking: !0 },
          }),
          d = [],
          c = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        for (let e = 0; e < 7; e++) {
          let t = new Date(s)
          t.setDate(s.getDate() + e)
          let r = t.getDay(),
            a = l.workingDays.includes(r),
            n = {
              date: (0, b.format)(t, 'yyyy-MM-dd', { locale: _.ko }),
              dayOfWeek: c[r],
              isWorkingDay: a,
              timeSlots: [],
            }
          if (a)
            for (let e of (function (e, t, r) {
              let a = [],
                [n, o] = e.split(':').map(Number),
                [s, i] = t.split(':').map(Number),
                l = 60 * n + o,
                u = 60 * s + i
              for (; l < u && !(l + r > u); ) {
                let e = Math.floor(l / 60),
                  t = l % 60,
                  n = `${e.toString().padStart(2, '0')}:${t.toString().padStart(2, '0')}`
                ;(a.push(n), (l += r))
              }
              return a
            })(l.workingHoursStart, l.workingHoursEnd, l.slotDurationMinutes)) {
              let t = u.find(
                (t) =>
                  (0, b.format)(t.date, 'yyyy-MM-dd', { locale: _.ko }) === n.date &&
                  t.timeSlot === e
              )
              n.timeSlots.push({
                time: e,
                available: !t || t.isAvailable,
                booked: !!t && t.isBooked,
                bookingId: t?.bookingId || void 0,
              })
            }
          d.push(n)
        }
        return w.NextResponse.json(d)
      } catch (e) {
        return (
          console.error('Failed to fetch groomer availability:', e),
          w.NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => x], 114480)
    var D = e.i(114480)
    let S = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/groomer/availability/route',
          pathname: '/api/groomer/availability',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/groomer/availability/route.ts',
        nextConfigOutput: 'standalone',
        userland: D,
      }),
      { workAsyncStorage: C, workUnitAsyncStorage: A, serverHooks: O } = S
    function N() {
      return (0, a.patchFetch)({ workAsyncStorage: C, workUnitAsyncStorage: A })
    }
    async function P(e, t, a) {
      S.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let _ = '/api/groomer/availability/route'
      _ = _.replace(/\/index$/, '') || '/'
      let w = await S.prepare(e, t, { srcPage: _, multiZoneDraftMode: !1 })
      if (!w)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: y,
          params: b,
          nextConfig: E,
          parsedUrl: k,
          isDraftMode: x,
          prerenderManifest: D,
          routerServerContext: C,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: O,
          resolvedPathname: N,
          clientReferenceManifest: P,
          serverActionsManifest: j,
        } = w,
        M = (0, l.normalizeAppPath)(_),
        T = !!(D.dynamicRoutes[M] || D.routes[N]),
        H = async () => (
          (null == C ? void 0 : C.render404)
            ? await C.render404(e, t, k, !1)
            : t.end('This page could not be found'),
          null
        )
      if (T && !x) {
        let e = !!D.routes[N],
          t = D.dynamicRoutes[M]
        if (t && !1 === t.fallback && !e) {
          if (E.experimental.adapterPath) return await H()
          throw new R.NoFallbackError()
        }
      }
      let I = null
      !T || S.isDev || x || (I = '/index' === (I = N) ? '/' : I)
      let U = !0 === S.isDev || !T,
        q = T && !U
      j &&
        P &&
        (0, s.setReferenceManifestsSingleton)({
          page: _,
          clientReferenceManifest: P,
          serverActionsManifest: j,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: j }),
        })
      let F = e.method || 'GET',
        $ = (0, o.getTracer)(),
        K = $.getActiveScopeSpan(),
        B = {
          params: b,
          prerenderManifest: D,
          renderOpts: {
            experimental: { authInterrupts: !!E.experimental.authInterrupts },
            cacheComponents: !!E.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: E.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => S.onRequestError(e, t, a, C),
          },
          sharedContext: { buildId: y },
        },
        L = new u.NodeNextRequest(e),
        G = new u.NodeNextResponse(t),
        W = d.NextRequestAdapter.fromNodeNextRequest(L, (0, d.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            S.handle(W, B).finally(() => {
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
              } else e.updateName(`${F} ${_}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var o, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && A && O && !r)
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
                  let u = B.renderOpts.collectedTags
                  if (!T)
                    return (await (0, h.sendResponse)(L, G, o, B.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await o.blob(),
                      t = (0, m.toNodeOutgoingHttpHeaders)(o.headers)
                    ;(u && (t[v.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== B.renderOpts.collectedRevalidate &&
                        !(B.renderOpts.collectedRevalidate >= v.INFINITE_CACHE) &&
                        B.renderOpts.collectedRevalidate,
                      a =
                        void 0 === B.renderOpts.collectedExpire ||
                        B.renderOpts.collectedExpire >= v.INFINITE_CACHE
                          ? void 0
                          : B.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: g.CachedRouteKind.APP_ROUTE,
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
                      (await S.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: _,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: q,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        C
                      )),
                    t
                  )
                }
              },
              d = await S.handleResponse({
                req: e,
                nextConfig: E,
                cacheKey: I,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: D,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: O,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!T) return null
            if (
              (null == d || null == (o = d.value) ? void 0 : o.kind) !== g.CachedRouteKind.APP_ROUTE
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
              x &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, m.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && T) || c.delete(v.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(d.cacheControl)),
              await (0, h.sendResponse)(
                L,
                G,
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
                  spanName: `${F} ${_}`,
                  kind: o.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof R.NoFallbackError ||
            (await S.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: M,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: q,
                isOnDemandRevalidate: A,
              }),
            })),
          T)
        )
          throw t
        return (await (0, h.sendResponse)(L, G, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => P,
        'patchFetch',
        () => N,
        'routeModule',
        () => S,
        'serverHooks',
        () => O,
        'workAsyncStorage',
        () => C,
        'workUnitAsyncStorage',
        () => A,
      ],
      993586
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0ff79787._.js.map
