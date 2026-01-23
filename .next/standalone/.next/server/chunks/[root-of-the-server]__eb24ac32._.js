module.exports = [
  270406,
  (e, t, r) => {
    t.exports = e.x('next/dist/compiled/@opentelemetry/api', () =>
      require('next/dist/compiled/@opentelemetry/api')
    )
  },
  918622,
  (e, t, r) => {
    t.exports = e.x('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js', () =>
      require('next/dist/compiled/next-server/app-page-turbo.runtime.prod.js')
    )
  },
  556704,
  (e, t, r) => {
    t.exports = e.x('next/dist/server/app-render/work-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-async-storage.external.js')
    )
  },
  832319,
  (e, t, r) => {
    t.exports = e.x('next/dist/server/app-render/work-unit-async-storage.external.js', () =>
      require('next/dist/server/app-render/work-unit-async-storage.external.js')
    )
  },
  324725,
  (e, t, r) => {
    t.exports = e.x('next/dist/server/app-render/after-task-async-storage.external.js', () =>
      require('next/dist/server/app-render/after-task-async-storage.external.js')
    )
  },
  193695,
  (e, t, r) => {
    t.exports = e.x('next/dist/shared/lib/no-fallback-error.external.js', () =>
      require('next/dist/shared/lib/no-fallback-error.external.js')
    )
  },
  442315,
  (e, t, r) => {
    'use strict'
    t.exports = e.r(918622)
  },
  347540,
  (e, t, r) => {
    'use strict'
    t.exports = e.r(442315).vendored['react-rsc'].React
  },
  819481,
  (e, t, r) => {
    'use strict'
    var n = Object.defineProperty,
      a = Object.getOwnPropertyDescriptor,
      i = Object.getOwnPropertyNames,
      s = Object.prototype.hasOwnProperty,
      o = {},
      l = {
        RequestCookies: () => m,
        ResponseCookies: () => g,
        parseCookie: () => d,
        parseSetCookie: () => c,
        stringifyCookie: () => u,
      }
    for (var p in l) n(o, p, { get: l[p], enumerable: !0 })
    function u(e) {
      var t
      let r = [
          'path' in e && e.path && `Path=${e.path}`,
          'expires' in e &&
            (e.expires || 0 === e.expires) &&
            `Expires=${('number' == typeof e.expires ? new Date(e.expires) : e.expires).toUTCString()}`,
          'maxAge' in e && 'number' == typeof e.maxAge && `Max-Age=${e.maxAge}`,
          'domain' in e && e.domain && `Domain=${e.domain}`,
          'secure' in e && e.secure && 'Secure',
          'httpOnly' in e && e.httpOnly && 'HttpOnly',
          'sameSite' in e && e.sameSite && `SameSite=${e.sameSite}`,
          'partitioned' in e && e.partitioned && 'Partitioned',
          'priority' in e && e.priority && `Priority=${e.priority}`,
        ].filter(Boolean),
        n = `${e.name}=${encodeURIComponent(null != (t = e.value) ? t : '')}`
      return 0 === r.length ? n : `${n}; ${r.join('; ')}`
    }
    function d(e) {
      let t = new Map()
      for (let r of e.split(/; */)) {
        if (!r) continue
        let e = r.indexOf('=')
        if (-1 === e) {
          t.set(r, 'true')
          continue
        }
        let [n, a] = [r.slice(0, e), r.slice(e + 1)]
        try {
          t.set(n, decodeURIComponent(null != a ? a : 'true'))
        } catch {}
      }
      return t
    }
    function c(e) {
      if (!e) return
      let [[t, r], ...n] = d(e),
        {
          domain: a,
          expires: i,
          httponly: s,
          maxage: o,
          path: l,
          samesite: p,
          secure: u,
          partitioned: c,
          priority: m,
        } = Object.fromEntries(n.map(([e, t]) => [e.toLowerCase().replace(/-/g, ''), t]))
      {
        var g,
          v,
          x = {
            name: t,
            value: decodeURIComponent(r),
            domain: a,
            ...(i && { expires: new Date(i) }),
            ...(s && { httpOnly: !0 }),
            ...('string' == typeof o && { maxAge: Number(o) }),
            path: l,
            ...(p && { sameSite: h.includes((g = (g = p).toLowerCase())) ? g : void 0 }),
            ...(u && { secure: !0 }),
            ...(m && { priority: f.includes((v = (v = m).toLowerCase())) ? v : void 0 }),
            ...(c && { partitioned: !0 }),
          }
        let e = {}
        for (let t in x) x[t] && (e[t] = x[t])
        return e
      }
    }
    t.exports = ((e, t, r, o) => {
      if ((t && 'object' == typeof t) || 'function' == typeof t)
        for (let r of i(t))
          s.call(e, r) ||
            void 0 === r ||
            n(e, r, { get: () => t[r], enumerable: !(o = a(t, r)) || o.enumerable })
      return e
    })(n({}, '__esModule', { value: !0 }), o)
    var h = ['strict', 'lax', 'none'],
      f = ['low', 'medium', 'high'],
      m = class {
        constructor(e) {
          ;((this._parsed = new Map()), (this._headers = e))
          const t = e.get('cookie')
          if (t) for (const [e, r] of d(t)) this._parsed.set(e, { name: e, value: r })
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]()
        }
        get size() {
          return this._parsed.size
        }
        get(...e) {
          let t = 'string' == typeof e[0] ? e[0] : e[0].name
          return this._parsed.get(t)
        }
        getAll(...e) {
          var t
          let r = Array.from(this._parsed)
          if (!e.length) return r.map(([e, t]) => t)
          let n = 'string' == typeof e[0] ? e[0] : null == (t = e[0]) ? void 0 : t.name
          return r.filter(([e]) => e === n).map(([e, t]) => t)
        }
        has(e) {
          return this._parsed.has(e)
        }
        set(...e) {
          let [t, r] = 1 === e.length ? [e[0].name, e[0].value] : e,
            n = this._parsed
          return (
            n.set(t, { name: t, value: r }),
            this._headers.set(
              'cookie',
              Array.from(n)
                .map(([e, t]) => u(t))
                .join('; ')
            ),
            this
          )
        }
        delete(e) {
          let t = this._parsed,
            r = Array.isArray(e) ? e.map((e) => t.delete(e)) : t.delete(e)
          return (
            this._headers.set(
              'cookie',
              Array.from(t)
                .map(([e, t]) => u(t))
                .join('; ')
            ),
            r
          )
        }
        clear() {
          return (this.delete(Array.from(this._parsed.keys())), this)
        }
        [Symbol.for('edge-runtime.inspect.custom')]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`
        }
        toString() {
          return [...this._parsed.values()]
            .map((e) => `${e.name}=${encodeURIComponent(e.value)}`)
            .join('; ')
        }
      },
      g = class {
        constructor(e) {
          var t, r, n
          ;((this._parsed = new Map()), (this._headers = e))
          const a =
            null !=
            (n =
              null != (r = null == (t = e.getSetCookie) ? void 0 : t.call(e))
                ? r
                : e.get('set-cookie'))
              ? n
              : []
          for (const e of Array.isArray(a)
            ? a
            : (function (e) {
                if (!e) return []
                var t,
                  r,
                  n,
                  a,
                  i,
                  s = [],
                  o = 0
                function l() {
                  for (; o < e.length && /\s/.test(e.charAt(o)); ) o += 1
                  return o < e.length
                }
                for (; o < e.length; ) {
                  for (t = o, i = !1; l(); )
                    if (',' === (r = e.charAt(o))) {
                      for (
                        n = o, o += 1, l(), a = o;
                        o < e.length && '=' !== (r = e.charAt(o)) && ';' !== r && ',' !== r;

                      )
                        o += 1
                      o < e.length && '=' === e.charAt(o)
                        ? ((i = !0), (o = a), s.push(e.substring(t, n)), (t = o))
                        : (o = n + 1)
                    } else o += 1
                  ;(!i || o >= e.length) && s.push(e.substring(t, e.length))
                }
                return s
              })(a)) {
            const t = c(e)
            t && this._parsed.set(t.name, t)
          }
        }
        get(...e) {
          let t = 'string' == typeof e[0] ? e[0] : e[0].name
          return this._parsed.get(t)
        }
        getAll(...e) {
          var t
          let r = Array.from(this._parsed.values())
          if (!e.length) return r
          let n = 'string' == typeof e[0] ? e[0] : null == (t = e[0]) ? void 0 : t.name
          return r.filter((e) => e.name === n)
        }
        has(e) {
          return this._parsed.has(e)
        }
        set(...e) {
          let [t, r, n] = 1 === e.length ? [e[0].name, e[0].value, e[0]] : e,
            a = this._parsed
          return (
            a.set(
              t,
              (function (e = { name: '', value: '' }) {
                return (
                  'number' == typeof e.expires && (e.expires = new Date(e.expires)),
                  e.maxAge && (e.expires = new Date(Date.now() + 1e3 * e.maxAge)),
                  (null === e.path || void 0 === e.path) && (e.path = '/'),
                  e
                )
              })({ name: t, value: r, ...n })
            ),
            (function (e, t) {
              for (let [, r] of (t.delete('set-cookie'), e)) {
                let e = u(r)
                t.append('set-cookie', e)
              }
            })(a, this._headers),
            this
          )
        }
        delete(...e) {
          let [t, r] = 'string' == typeof e[0] ? [e[0]] : [e[0].name, e[0]]
          return this.set({ ...r, name: t, value: '', expires: new Date(0) })
        }
        [Symbol.for('edge-runtime.inspect.custom')]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`
        }
        toString() {
          return [...this._parsed.values()].map(u).join('; ')
        }
      }
  },
  29173,
  (e, t, r) => {
    t.exports = e.x('@prisma/client', () => require('@prisma/client'))
  },
  954098,
  (e, t, r) => {
    'use strict'
    ;(Object.defineProperty(r, '__esModule', { value: !0 }), (r.prisma = void 0))
    let n = e.r(29173)
    r.prisma = globalThis.prisma ?? new n.PrismaClient({ log: ['error'] })
  },
  428112,
  (e, t, r) => {
    'use strict'
    ;(Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.WorkerApiError = void 0),
      (r.WorkerApiError = class extends Error {
        constructor(e, t, r, n) {
          ;(super(e),
            (this.code = t),
            (this.statusCode = r),
            (this.details = n),
            (this.name = 'WorkerApiError'))
        }
      }))
  },
  85051,
  (e, t, r) => {
    'use strict'
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              void 0 === n && (n = r)
              var a = Object.getOwnPropertyDescriptor(t, r)
              ;((!a || ('get' in a ? !t.__esModule : a.writable || a.configurable)) &&
                (a = {
                  enumerable: !0,
                  get: function () {
                    return t[r]
                  },
                }),
                Object.defineProperty(e, n, a))
            }
          : function (e, t, r, n) {
              ;(void 0 === n && (n = r), (e[n] = t[r]))
            }),
      a =
        (e.e && e.e.__exportStar) ||
        function (e, t) {
          for (var r in e)
            'default' === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
        }
    ;(Object.defineProperty(r, '__esModule', { value: !0 }), a(e.r(29173), r), a(e.r(428112), r))
  },
  657446,
  (e, t, r) => {
    'use strict'
    var n =
        (e.e && e.e.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              void 0 === n && (n = r)
              var a = Object.getOwnPropertyDescriptor(t, r)
              ;((!a || ('get' in a ? !t.__esModule : a.writable || a.configurable)) &&
                (a = {
                  enumerable: !0,
                  get: function () {
                    return t[r]
                  },
                }),
                Object.defineProperty(e, n, a))
            }
          : function (e, t, r, n) {
              ;(void 0 === n && (n = r), (e[n] = t[r]))
            }),
      a =
        (e.e && e.e.__exportStar) ||
        function (e, t) {
          for (var r in e)
            'default' === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
        }
    ;(Object.defineProperty(r, '__esModule', { value: !0 }), (r.prisma = void 0))
    var i = e.r(954098)
    ;(Object.defineProperty(r, 'prisma', {
      enumerable: !0,
      get: function () {
        return i.prisma
      },
    }),
      a(e.r(85051), r))
  },
  583682,
  (e) => {
    'use strict'
    var t = e.i(747909),
      r = e.i(174017),
      n = e.i(996250),
      a = e.i(759756),
      i = e.i(561916),
      s = e.i(114444),
      o = e.i(837092),
      l = e.i(869741),
      p = e.i(316795),
      u = e.i(487718),
      d = e.i(995169),
      c = e.i(47587),
      h = e.i(666012),
      f = e.i(570101),
      m = e.i(626937),
      g = e.i(10372),
      v = e.i(193695)
    e.i(52474)
    var x = e.i(600220),
      y = e.i(89171),
      b = e.i(657446)
    async function R() {
      try {
        let e = await b.prisma.breed.findMany({
          where: { isActive: !0 },
          orderBy: [{ petType: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
        })
        return y.NextResponse.json(e)
      } catch (e) {
        return (
          console.error('Error fetching breeds:', e),
          y.NextResponse.json(
            {
              error: 'Failed to fetch breeds',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    e.s(['GET', () => R], 472948)
    var _ = e.i(472948)
    let w = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/breeds/route',
          pathname: '/api/breeds',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/breeds/route.ts',
        nextConfigOutput: 'standalone',
        userland: _,
      }),
      { workAsyncStorage: O, workUnitAsyncStorage: A, serverHooks: C } = w
    function E() {
      return (0, n.patchFetch)({ workAsyncStorage: O, workUnitAsyncStorage: A })
    }
    async function j(e, t, n) {
      w.isDev && (0, a.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let y = '/api/breeds/route'
      y = y.replace(/\/index$/, '') || '/'
      let b = await w.prepare(e, t, { srcPage: y, multiZoneDraftMode: !1 })
      if (!b)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: R,
          params: _,
          nextConfig: O,
          parsedUrl: A,
          isDraftMode: C,
          prerenderManifest: E,
          routerServerContext: j,
          isOnDemandRevalidate: P,
          revalidateOnlyGenerated: k,
          resolvedPathname: S,
          clientReferenceManifest: N,
          serverActionsManifest: M,
        } = b,
        T = (0, l.normalizeAppPath)(y),
        q = !!(E.dynamicRoutes[T] || E.routes[S]),
        D = async () => (
          (null == j ? void 0 : j.render404)
            ? await j.render404(e, t, A, !1)
            : t.end('This page could not be found'),
          null
        )
      if (q && !C) {
        let e = !!E.routes[S],
          t = E.dynamicRoutes[T]
        if (t && !1 === t.fallback && !e) {
          if (O.experimental.adapterPath) return await D()
          throw new v.NoFallbackError()
        }
      }
      let $ = null
      !q || w.isDev || C || ($ = '/index' === ($ = S) ? '/' : $)
      let U = !0 === w.isDev || !q,
        I = q && !U
      M &&
        N &&
        (0, s.setReferenceManifestsSingleton)({
          page: y,
          clientReferenceManifest: N,
          serverActionsManifest: M,
          serverModuleMap: (0, o.createServerModuleMap)({ serverActionsManifest: M }),
        })
      let H = e.method || 'GET',
        B = (0, i.getTracer)(),
        F = B.getActiveScopeSpan(),
        K = {
          params: _,
          prerenderManifest: E,
          renderOpts: {
            experimental: { authInterrupts: !!O.experimental.authInterrupts },
            cacheComponents: !!O.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, a.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: O.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, n) => w.onRequestError(e, t, n, j),
          },
          sharedContext: { buildId: R },
        },
        L = new p.NodeNextRequest(e),
        W = new p.NodeNextResponse(t),
        G = u.NextRequestAdapter.fromNodeNextRequest(L, (0, u.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            w.handle(G, K).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = B.getRootSpanAttributes()
              if (!r) return
              if (r.get('next.span_type') !== d.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${r.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = r.get('next.route')
              if (n) {
                let t = `${H} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${H} ${y}`)
            }),
          o = !!(0, a.getRequestMeta)(e, 'minimalMode'),
          l = async (a) => {
            var i, l
            let p = async ({ previousCacheEntry: r }) => {
                try {
                  if (!o && P && k && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let i = await s(a)
                  e.fetchMetrics = K.renderOpts.fetchMetrics
                  let l = K.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let p = K.renderOpts.collectedTags
                  if (!q)
                    return (await (0, h.sendResponse)(L, W, i, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await i.blob(),
                      t = (0, f.toNodeOutgoingHttpHeaders)(i.headers)
                    ;(p && (t[g.NEXT_CACHE_TAGS_HEADER] = p),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      n =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: x.CachedRouteKind.APP_ROUTE,
                        status: i.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: r, expire: n },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == r ? void 0 : r.isStale) &&
                      (await w.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: y,
                          routeType: 'route',
                          revalidateReason: (0, c.getRevalidateReason)({
                            isStaticGeneration: I,
                            isOnDemandRevalidate: P,
                          }),
                        },
                        j
                      )),
                    t
                  )
                }
              },
              u = await w.handleResponse({
                req: e,
                nextConfig: O,
                cacheKey: $,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: E,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: P,
                revalidateOnlyGenerated: k,
                responseGenerator: p,
                waitUntil: n.waitUntil,
                isMinimalMode: o,
              })
            if (!q) return null
            if (
              (null == u || null == (i = u.value) ? void 0 : i.kind) !== x.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == u || null == (l = u.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(o ||
              t.setHeader(
                'x-nextjs-cache',
                P ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              C &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, f.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (o && q) || d.delete(g.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, m.getCacheControlHeader)(u.cacheControl)),
              await (0, h.sendResponse)(
                L,
                W,
                new Response(u.value.body, { headers: d, status: u.value.status || 200 })
              ),
              null
            )
          }
        F
          ? await l(F)
          : await B.withPropagatedContext(e.headers, () =>
              B.trace(
                d.BaseServerSpan.handleRequest,
                {
                  spanName: `${H} ${y}`,
                  kind: i.SpanKind.SERVER,
                  attributes: { 'http.method': H, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof v.NoFallbackError ||
            (await w.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: T,
              routeType: 'route',
              revalidateReason: (0, c.getRevalidateReason)({
                isStaticGeneration: I,
                isOnDemandRevalidate: P,
              }),
            })),
          q)
        )
          throw t
        return (await (0, h.sendResponse)(L, W, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => j,
        'patchFetch',
        () => E,
        'routeModule',
        () => w,
        'serverHooks',
        () => C,
        'workAsyncStorage',
        () => O,
        'workUnitAsyncStorage',
        () => A,
      ],
      583682
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__eb24ac32._.js.map
