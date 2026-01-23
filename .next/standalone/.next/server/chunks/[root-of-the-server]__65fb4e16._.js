module.exports = [
  254799,
  (e, t, r) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  224361,
  (e, t, r) => {
    t.exports = e.x('util', () => require('util'))
  },
  814747,
  (e, t, r) => {
    t.exports = e.x('path', () => require('path'))
  },
  992097,
  (e, t, r) => {
    t.exports = e.x('punycode', () => require('punycode'))
  },
  725705,
  (e, t, r) => {
    'use strict'
    var a = Object.prototype.hasOwnProperty,
      n = Object.prototype.toString,
      s = Object.defineProperty,
      o = Object.getOwnPropertyDescriptor,
      i = function (e) {
        return 'function' == typeof Array.isArray
          ? Array.isArray(e)
          : '[object Array]' === n.call(e)
      },
      l = function (e) {
        if (!e || '[object Object]' !== n.call(e)) return !1
        var t,
          r = a.call(e, 'constructor'),
          s =
            e.constructor &&
            e.constructor.prototype &&
            a.call(e.constructor.prototype, 'isPrototypeOf')
        if (e.constructor && !r && !s) return !1
        for (t in e);
        return void 0 === t || a.call(e, t)
      },
      u = function (e, t) {
        s && '__proto__' === t.name
          ? s(e, t.name, { enumerable: !0, configurable: !0, value: t.newValue, writable: !0 })
          : (e[t.name] = t.newValue)
      },
      d = function (e, t) {
        if ('__proto__' === t) {
          if (!a.call(e, t)) return
          else if (o) return o(e, t).value
        }
        return e[t]
      }
    t.exports = function e() {
      var t,
        r,
        a,
        n,
        s,
        o,
        c = arguments[0],
        p = 1,
        m = arguments.length,
        f = !1
      for (
        'boolean' == typeof c && ((f = c), (c = arguments[1] || {}), (p = 2)),
          (null == c || ('object' != typeof c && 'function' != typeof c)) && (c = {});
        p < m;
        ++p
      )
        if (((t = arguments[p]), null != t))
          for (r in t)
            ((a = d(c, r)),
              c !== (n = d(t, r)) &&
                (f && n && (l(n) || (s = i(n)))
                  ? (s ? ((s = !1), (o = a && i(a) ? a : [])) : (o = a && l(a) ? a : {}),
                    u(c, { name: r, newValue: e(f, o, n) }))
                  : void 0 !== n && u(c, { name: r, newValue: n })))
      return c
    }
  },
  630276,
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
      m = e.i(666012),
      f = e.i(570101),
      h = e.i(626937),
      g = e.i(10372),
      v = e.i(193695)
    e.i(52474)
    var w = e.i(600220),
      R = e.i(89171),
      y = e.i(493458),
      _ = e.i(79832),
      x = e.i(657446),
      E = e.i(469719),
      b = e.i(820908)
    let I = E.z.object({ imageIds: E.z.array(E.z.string()).min(1) })
    async function j(e, { params: t }) {
      try {
        let { id: e } = await t,
          r = await _.default.api.getSession({ headers: await (0, y.headers)() })
        if (!r?.user?.id) return R.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let a = await x.prisma.review.findFirst({
          where: { id: e, customerId: r.user.id },
          include: { images: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] } },
        })
        if (!a) return R.NextResponse.json({ error: 'Review not found' }, { status: 404 })
        return R.NextResponse.json({ images: a.images })
      } catch (e) {
        return (
          console.error('Failed to fetch review images:', e),
          R.NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        )
      }
    }
    async function N(e, { params: t }) {
      try {
        let { id: r } = await t,
          a = await _.default.api.getSession({ headers: await (0, y.headers)() })
        if (!a?.user?.id) return R.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let n = await x.prisma.review.findFirst({
          where: { id: r, customerId: a.user.id },
          include: { images: !0 },
        })
        if (!n) return R.NextResponse.json({ error: 'Review not found' }, { status: 404 })
        if (n.images.length >= b.IMAGE_UPLOAD_CONFIG.maxImagesPerReview)
          return R.NextResponse.json(
            {
              error: `Maximum ${b.IMAGE_UPLOAD_CONFIG.maxImagesPerReview} images allowed per review`,
            },
            { status: 400 }
          )
        if (!(0, b.isGcsConfigured)())
          return R.NextResponse.json(
            { error: 'Image upload service not configured' },
            { status: 503 }
          )
        let s = (await e.formData()).getAll('files')
        if (0 === s.length)
          return R.NextResponse.json({ error: 'No files provided' }, { status: 400 })
        console.log(`Processing ${s.length} files for review ${r}`)
        let o = [],
          i = [],
          l = 0
        for (let e = 0; e < s.length; e++) {
          let t = s[e]
          console.log(
            `Processing file ${e + 1}/${s.length}: ${t.name} (${t.type}, ${t.size} bytes)`
          )
          try {
            if (!(0, b.isAllowedImageType)(t.type)) {
              ;(console.error(`Invalid file type: ${t.type} for ${t.name}`), i.push(t.name))
              continue
            }
            if (!(0, b.isValidFileSize)(t.size, b.ImageType.REVIEW)) {
              ;(console.error(`Invalid file size: ${t.size} for ${t.name}`), i.push(t.name))
              continue
            }
            let e = (0, b.generateImageFilename)(t.name, r, b.ImageType.REVIEW),
              s = await t.arrayBuffer(),
              u = Buffer.from(s)
            console.log(`Uploading ${t.name} to GCS as ${e}`)
            let d = await (0, b.uploadBuffer)(u, e, t.type, {
              reviewId: r,
              uploadedBy: a.user.email || a.user.id,
            })
            console.log(`Successfully uploaded ${t.name} to GCS: ${d}`)
            let c = n.images.length + l,
              p = await x.prisma.reviewImage.create({
                data: {
                  reviewId: r,
                  url: d,
                  filename: t.name,
                  mimeType: t.type,
                  size: t.size,
                  order: c,
                },
                select: {
                  id: !0,
                  reviewId: !0,
                  url: !0,
                  filename: !0,
                  mimeType: !0,
                  size: !0,
                  order: !0,
                  createdAt: !0,
                },
              })
            ;(o.push(p), l++, console.log(`Created database record for ${t.name}: ${p.id}`))
          } catch (e) {
            ;(console.error(`Failed to upload ${t.name}:`, e), i.push(t.name))
          }
        }
        let u = {
          message:
            o.length > 0 && 0 === i.length
              ? `${o.length} images uploaded successfully`
              : o.length > 0 && i.length > 0
                ? `${o.length} images uploaded, ${i.length} failed`
                : 'No images were uploaded',
          images: o,
        }
        return (i.length > 0 && (u.failedFiles = i), R.NextResponse.json(u))
      } catch (e) {
        return (
          console.error('Failed to upload images:', e),
          R.NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
        )
      }
    }
    async function A(e, { params: t }) {
      try {
        let { id: r } = await t,
          a = await _.default.api.getSession({ headers: await (0, y.headers)() })
        if (!a?.user?.id) return R.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (!(await x.prisma.review.findFirst({ where: { id: r, customerId: a.user.id } })))
          return R.NextResponse.json({ error: 'Review not found' }, { status: 404 })
        let n = await e.json(),
          { imageIds: s } = I.parse(n),
          o = (await x.prisma.reviewImage.findMany({ where: { id: { in: s }, reviewId: r } }))
            .filter((e) => (0, b.isGcsUrl)(e.url))
            .map((e) => (0, b.extractFilenameFromUrl)(e.url))
            .filter((e) => null !== e)
        ;(o.length > 0 && (await (0, b.deleteImages)(o)),
          await x.prisma.reviewImage.deleteMany({ where: { id: { in: s }, reviewId: r } }))
        let i = await x.prisma.reviewImage.findMany({
          where: { reviewId: r },
          orderBy: { order: 'asc' },
        })
        for (let e = 0; e < i.length; e++)
          i[e].order !== e &&
            (await x.prisma.reviewImage.update({ where: { id: i[e].id }, data: { order: e } }))
        return R.NextResponse.json({ message: 'Images deleted successfully' })
      } catch (e) {
        if (e instanceof E.z.ZodError)
          return R.NextResponse.json({ error: 'Invalid data', details: e.issues }, { status: 400 })
        return (
          console.error('Failed to delete images:', e),
          R.NextResponse.json({ error: 'Failed to delete images' }, { status: 500 })
        )
      }
    }
    e.s(['DELETE', () => A, 'GET', () => j, 'POST', () => N], 94470)
    var C = e.i(94470)
    let P = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/reviews/[id]/images/route',
          pathname: '/api/reviews/[id]/images',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/reviews/[id]/images/route.ts',
        nextConfigOutput: 'standalone',
        userland: C,
      }),
      { workAsyncStorage: O, workUnitAsyncStorage: T, serverHooks: $ } = P
    function S() {
      return (0, a.patchFetch)({ workAsyncStorage: O, workUnitAsyncStorage: T })
    }
    async function k(e, t, a) {
      P.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let R = '/api/reviews/[id]/images/route'
      R = R.replace(/\/index$/, '') || '/'
      let y = await P.prepare(e, t, { srcPage: R, multiZoneDraftMode: !1 })
      if (!y)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: _,
          params: x,
          nextConfig: E,
          parsedUrl: b,
          isDraftMode: I,
          prerenderManifest: j,
          routerServerContext: N,
          isOnDemandRevalidate: A,
          revalidateOnlyGenerated: C,
          resolvedPathname: O,
          clientReferenceManifest: T,
          serverActionsManifest: $,
        } = y,
        S = (0, l.normalizeAppPath)(R),
        k = !!(j.dynamicRoutes[S] || j.routes[O]),
        F = async () => (
          (null == N ? void 0 : N.render404)
            ? await N.render404(e, t, b, !1)
            : t.end('This page could not be found'),
          null
        )
      if (k && !I) {
        let e = !!j.routes[O],
          t = j.dynamicRoutes[S]
        if (t && !1 === t.fallback && !e) {
          if (E.experimental.adapterPath) return await F()
          throw new v.NoFallbackError()
        }
      }
      let U = null
      !k || P.isDev || I || (U = '/index' === (U = O) ? '/' : U)
      let M = !0 === P.isDev || !k,
        q = k && !M
      $ &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: R,
          clientReferenceManifest: T,
          serverActionsManifest: $,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: $ }),
        })
      let D = e.method || 'GET',
        H = (0, s.getTracer)(),
        z = H.getActiveScopeSpan(),
        G = {
          params: x,
          prerenderManifest: j,
          renderOpts: {
            experimental: { authInterrupts: !!E.experimental.authInterrupts },
            cacheComponents: !!E.cacheComponents,
            supportsDynamicResponse: M,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: E.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => P.onRequestError(e, t, a, N),
          },
          sharedContext: { buildId: _ },
        },
        B = new u.NodeNextRequest(e),
        V = new u.NodeNextResponse(t),
        K = d.NextRequestAdapter.fromNodeNextRequest(B, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            P.handle(K, G).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let r = H.getRootSpanAttributes()
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
              } else e.updateName(`${D} ${R}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && A && C && !r)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let s = await o(n)
                  e.fetchMetrics = G.renderOpts.fetchMetrics
                  let l = G.renderOpts.pendingWaitUntil
                  l && a.waitUntil && (a.waitUntil(l), (l = void 0))
                  let u = G.renderOpts.collectedTags
                  if (!k)
                    return (await (0, m.sendResponse)(B, V, s, G.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, f.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[g.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== G.renderOpts.collectedRevalidate &&
                        !(G.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        G.renderOpts.collectedRevalidate,
                      a =
                        void 0 === G.renderOpts.collectedExpire ||
                        G.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : G.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: w.CachedRouteKind.APP_ROUTE,
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
                          routePath: R,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: q,
                            isOnDemandRevalidate: A,
                          }),
                        },
                        N
                      )),
                    t
                  )
                }
              },
              d = await P.handleResponse({
                req: e,
                nextConfig: E,
                cacheKey: U,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: j,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: A,
                revalidateOnlyGenerated: C,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!k) return null
            if (
              (null == d || null == (s = d.value) ? void 0 : s.kind) !== w.CachedRouteKind.APP_ROUTE
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
              I &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, f.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && k) || c.delete(g.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, h.getCacheControlHeader)(d.cacheControl)),
              await (0, m.sendResponse)(
                B,
                V,
                new Response(d.value.body, { headers: c, status: d.value.status || 200 })
              ),
              null
            )
          }
        z
          ? await l(z)
          : await H.withPropagatedContext(e.headers, () =>
              H.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${D} ${R}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': D, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof v.NoFallbackError ||
            (await P.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: S,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: q,
                isOnDemandRevalidate: A,
              }),
            })),
          k)
        )
          throw t
        return (await (0, m.sendResponse)(B, V, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => k,
        'patchFetch',
        () => S,
        'routeModule',
        () => P,
        'serverHooks',
        () => $,
        'workAsyncStorage',
        () => O,
        'workUnitAsyncStorage',
        () => T,
      ],
      630276
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
          'server/chunks/[root-of-the-server]__aba85d3d._.js',
          'server/chunks/node_modules_0f478c9c._.js',
          'server/chunks/_46980750._.js',
          'server/chunks/node_modules_mime-db_db_json_a85ad9f0._.js',
        ].map((t) => e.l(t))
      ).then(() => t(315159))
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__65fb4e16._.js.map
