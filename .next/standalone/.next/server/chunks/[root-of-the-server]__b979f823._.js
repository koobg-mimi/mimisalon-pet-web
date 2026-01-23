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
        h = !1
      for (
        'boolean' == typeof c && ((h = c), (c = arguments[1] || {}), (p = 2)),
          (null == c || ('object' != typeof c && 'function' != typeof c)) && (c = {});
        p < m;
        ++p
      )
        if (((t = arguments[p]), null != t))
          for (r in t)
            ((a = d(c, r)),
              c !== (n = d(t, r)) &&
                (h && n && (l(n) || (s = i(n)))
                  ? (s ? ((s = !1), (o = a && i(a) ? a : [])) : (o = a && l(a) ? a : {}),
                    u(c, { name: r, newValue: e(h, o, n) }))
                  : void 0 !== n && u(c, { name: r, newValue: n })))
      return c
    }
  },
  378350,
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
      h = e.i(570101),
      f = e.i(626937),
      g = e.i(10372),
      w = e.i(193695)
    e.i(52474)
    var v = e.i(600220),
      y = e.i(89171),
      R = e.i(493458),
      _ = e.i(469719),
      x = e.i(79832),
      E = e.i(657446),
      P = e.i(820908)
    let b = _.z.object({ imageIds: _.z.array(_.z.string()).min(1) })
    async function I(e, { params: t }) {
      try {
        let { id: e } = await t,
          r = await x.default.api.getSession({ headers: await (0, R.headers)() })
        if (!r?.user?.id) return new y.NextResponse('Unauthorized', { status: 401 })
        let a = await E.prisma.pet.findFirst({
          where: { id: e, customerId: r.user.id, isActive: !0 },
          include: {
            images: {
              orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
            },
          },
        })
        if (!a) return new y.NextResponse('Pet not found', { status: 404 })
        let n = await Promise.all(
            a.images.map(async (e) => {
              if ((0, P.isGcsUrl)(e.url)) {
                let t = (0, P.extractFilenameFromUrl)(e.url)
                if (t)
                  try {
                    let r = await (0, P.generateSignedReadUrl)(t, 60)
                    return { ...e, url: r, originalUrl: e.url }
                  } catch (e) {
                    console.error(`Failed to generate signed URL for ${t}:`, e)
                  }
              }
              return e
            })
          ),
          s = y.NextResponse.json(n)
        return (
          s.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate'),
          s.headers.set('Pragma', 'no-cache'),
          s.headers.set('Expires', '0'),
          s
        )
      } catch (e) {
        return (
          console.error('Failed to fetch pet images:', e),
          new y.NextResponse('Internal Server Error', { status: 500 })
        )
      }
    }
    async function A(e, { params: t }) {
      try {
        let { id: r } = await t,
          a = await x.default.api.getSession({ headers: await (0, R.headers)() })
        if (!a?.user?.id) return new y.NextResponse('Unauthorized', { status: 401 })
        let n = await E.prisma.pet.findFirst({
          where: { id: r, customerId: a.user.id, isActive: !0 },
          include: { images: !0 },
        })
        if (!n) return new y.NextResponse('Pet not found', { status: 404 })
        if (n.images.length >= P.IMAGE_UPLOAD_CONFIG.maxImagesPerPet)
          return y.NextResponse.json(
            { error: `Maximum ${P.IMAGE_UPLOAD_CONFIG.maxImagesPerPet} images allowed per pet` },
            { status: 400 }
          )
        if (!(0, P.isGcsConfigured)())
          return y.NextResponse.json(
            { error: 'Image upload service not configured' },
            { status: 503 }
          )
        let s = (await e.formData()).getAll('files')
        if (0 === s.length)
          return y.NextResponse.json({ error: 'No files provided' }, { status: 400 })
        console.log(`Processing ${s.length} files for pet ${r}`)
        let o = [],
          i = [],
          l = 0
        for (let e = 0; e < s.length; e++) {
          let t = s[e]
          console.log(
            `Processing file ${e + 1}/${s.length}: ${t.name} (${t.type}, ${t.size} bytes)`
          )
          try {
            if (!(0, P.isAllowedImageType)(t.type)) {
              ;(console.error(`Invalid file type: ${t.type} for ${t.name}`), i.push(t.name))
              continue
            }
            if (!(0, P.isValidFileSize)(t.size, P.ImageType.PET)) {
              ;(console.error(`Invalid file size: ${t.size} for ${t.name}`), i.push(t.name))
              continue
            }
            let e = (0, P.generateImageFilename)(t.name, r, P.ImageType.PET),
              s = await t.arrayBuffer(),
              u = Buffer.from(s)
            console.log(`Uploading ${t.name} to GCS as ${e}`)
            let d = await (0, P.uploadBuffer)(u, e, t.type, {
              petId: r,
              uploadedBy: a.user.email || a.user.id,
            })
            console.log(`Successfully uploaded ${t.name} to GCS: ${d}`)
            let c = 0 === n.images.length && 0 === l,
              p = n.images.length + l,
              m = await E.prisma.petImage.create({
                data: {
                  petId: r,
                  url: d,
                  filename: t.name,
                  mimeType: t.type,
                  size: t.size,
                  isPrimary: c,
                  displayOrder: p,
                },
              })
            ;(o.push(m), l++, console.log(`Created database record for ${t.name}: ${m.id}`))
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
        return (i.length > 0 && (u.failedFiles = i), y.NextResponse.json(u))
      } catch (e) {
        return (
          console.error('Failed to upload images:', e),
          new y.NextResponse('Internal Server Error', { status: 500 })
        )
      }
    }
    async function C(e, { params: t }) {
      try {
        let { id: r } = await t,
          a = await x.default.api.getSession({ headers: await (0, R.headers)() })
        if (!a?.user?.id) return new y.NextResponse('Unauthorized', { status: 401 })
        if (
          !(await E.prisma.pet.findFirst({ where: { id: r, customerId: a.user.id, isActive: !0 } }))
        )
          return new y.NextResponse('Pet not found', { status: 404 })
        let n = await e.json(),
          { imageIds: s } = b.parse(n)
        for (let e of await E.prisma.petImage.findMany({ where: { id: { in: s }, petId: r } }))
          if ((0, P.isGcsUrl)(e.url)) {
            let t = (0, P.extractFilenameFromUrl)(e.url)
            t && (await (0, P.deleteImage)(t).catch(console.error))
          }
        await E.prisma.petImage.deleteMany({ where: { id: { in: s }, petId: r } })
        let o = await E.prisma.petImage.findMany({
          where: { petId: r },
          orderBy: { createdAt: 'asc' },
        })
        return (
          o.length > 0 &&
            !o.some((e) => e.isPrimary) &&
            (await E.prisma.petImage.update({ where: { id: o[0].id }, data: { isPrimary: !0 } })),
          y.NextResponse.json({ message: 'Images deleted successfully' })
        )
      } catch (e) {
        if (e instanceof _.z.ZodError)
          return y.NextResponse.json({ error: 'Invalid data', details: e.issues }, { status: 400 })
        return (
          console.error('Failed to delete images:', e),
          new y.NextResponse('Internal Server Error', { status: 500 })
        )
      }
    }
    e.s(['DELETE', () => C, 'GET', () => I, 'POST', () => A, 'deleteImagesSchema', 0, b], 770966)
    var N = e.i(770966)
    let j = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/customer/pets/[id]/images/route',
          pathname: '/api/customer/pets/[id]/images',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/customer/pets/[id]/images/route.ts',
        nextConfigOutput: 'standalone',
        userland: N,
      }),
      { workAsyncStorage: O, workUnitAsyncStorage: S, serverHooks: T } = j
    function $() {
      return (0, a.patchFetch)({ workAsyncStorage: O, workUnitAsyncStorage: S })
    }
    async function U(e, t, a) {
      j.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let y = '/api/customer/pets/[id]/images/route'
      y = y.replace(/\/index$/, '') || '/'
      let R = await j.prepare(e, t, { srcPage: y, multiZoneDraftMode: !1 })
      if (!R)
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
          parsedUrl: P,
          isDraftMode: b,
          prerenderManifest: I,
          routerServerContext: A,
          isOnDemandRevalidate: C,
          revalidateOnlyGenerated: N,
          resolvedPathname: O,
          clientReferenceManifest: S,
          serverActionsManifest: T,
        } = R,
        $ = (0, l.normalizeAppPath)(y),
        U = !!(I.dynamicRoutes[$] || I.routes[O]),
        F = async () => (
          (null == A ? void 0 : A.render404)
            ? await A.render404(e, t, P, !1)
            : t.end('This page could not be found'),
          null
        )
      if (U && !b) {
        let e = !!I.routes[O],
          t = I.dynamicRoutes[$]
        if (t && !1 === t.fallback && !e) {
          if (E.experimental.adapterPath) return await F()
          throw new w.NoFallbackError()
        }
      }
      let k = null
      !U || j.isDev || b || (k = '/index' === (k = O) ? '/' : k)
      let M = !0 === j.isDev || !U,
        q = U && !M
      T &&
        S &&
        (0, o.setReferenceManifestsSingleton)({
          page: y,
          clientReferenceManifest: S,
          serverActionsManifest: T,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: T }),
        })
      let D = e.method || 'GET',
        H = (0, s.getTracer)(),
        z = H.getActiveScopeSpan(),
        G = {
          params: x,
          prerenderManifest: I,
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
            onInstrumentationRequestError: (t, r, a) => j.onRequestError(e, t, a, A),
          },
          sharedContext: { buildId: _ },
        },
        B = new u.NodeNextRequest(e),
        L = new u.NodeNextResponse(t),
        K = d.NextRequestAdapter.fromNodeNextRequest(B, (0, d.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            j.handle(K, G).finally(() => {
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
              } else e.updateName(`${D} ${y}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && C && N && !r)
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
                  if (!U)
                    return (await (0, m.sendResponse)(B, L, s, G.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(s.headers)
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
                        kind: v.CachedRouteKind.APP_ROUTE,
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
                          routePath: y,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: q,
                            isOnDemandRevalidate: C,
                          }),
                        },
                        A
                      )),
                    t
                  )
                }
              },
              d = await j.handleResponse({
                req: e,
                nextConfig: E,
                cacheKey: k,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: I,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: C,
                revalidateOnlyGenerated: N,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!U) return null
            if (
              (null == d || null == (s = d.value) ? void 0 : s.kind) !== v.CachedRouteKind.APP_ROUTE
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
                C ? 'REVALIDATED' : d.isMiss ? 'MISS' : d.isStale ? 'STALE' : 'HIT'
              ),
              b &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(d.value.headers)
            return (
              (i && U) || c.delete(g.NEXT_CACHE_TAGS_HEADER),
              !d.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(d.cacheControl)),
              await (0, m.sendResponse)(
                B,
                L,
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
                  spanName: `${D} ${y}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': D, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof w.NoFallbackError ||
            (await j.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: $,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: q,
                isOnDemandRevalidate: C,
              }),
            })),
          U)
        )
          throw t
        return (await (0, m.sendResponse)(B, L, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => U,
        'patchFetch',
        () => $,
        'routeModule',
        () => j,
        'serverHooks',
        () => T,
        'workAsyncStorage',
        () => O,
        'workUnitAsyncStorage',
        () => S,
      ],
      378350
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b979f823._.js.map
