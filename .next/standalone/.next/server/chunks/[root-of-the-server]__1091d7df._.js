module.exports = [
  254799,
  (e, t, a) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  224361,
  (e, t, a) => {
    t.exports = e.x('util', () => require('util'))
  },
  814747,
  (e, t, a) => {
    t.exports = e.x('path', () => require('path'))
  },
  278164,
  (e) => {
    'use strict'
    var t = e.i(469719)
    let a = t.z.enum([
        'BOOKING_CONFIRMED',
        'BOOKING_CANCELLED',
        'BOOKING_REMINDER',
        'GROOMING_STARTED',
        'GROOMING_COMPLETED',
        'PAYMENT_RECEIVED',
        'PAYMENT_FAILED',
        'REFUND_PROCESSED',
        'REVIEW_REQUEST',
        'PROMOTION',
        'SYSTEM_NOTICE',
      ]),
      n = t.z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
      i = t.z.enum(['UNREAD', 'READ', 'ARCHIVED']),
      r = t.z.object({
        type: a,
        title: t.z
          .string()
          .min(1, '제목을 입력해주세요')
          .max(100, '제목은 100자 이하로 입력해주세요'),
        content: t.z
          .string()
          .min(1, '내용을 입력해주세요')
          .max(500, '내용은 500자 이하로 입력해주세요'),
        priority: n.default('NORMAL'),
        recipientId: t.z.string().min(1, '수신자 ID가 필요합니다'),
        relatedId: t.z.string().optional(),
        metadata: t.z.record(t.z.string(), t.z.any()).optional(),
        scheduledAt: t.z.date().optional(),
      })
    ;(t.z.object({
      status: i.optional(),
      readAt: t.z.date().optional(),
      archivedAt: t.z.date().optional(),
    }),
      t.z.object({
        status: i.optional(),
        type: a.optional(),
        priority: n.optional(),
        fromDate: t.z.string().optional(),
        toDate: t.z.string().optional(),
        page: t.z.number().min(1).default(1),
        limit: t.z.number().min(1).max(100).default(20),
      }),
      t.z.object({
        bookingUpdates: t.z.boolean().default(!0),
        paymentNotifications: t.z.boolean().default(!0),
        promotions: t.z.boolean().default(!1),
        systemNotices: t.z.boolean().default(!0),
        emailNotifications: t.z.boolean().default(!0),
        smsNotifications: t.z.boolean().default(!1),
      }),
      t.z.object({
        type: a,
        title: t.z.string().min(1).max(100),
        content: t.z.string().min(1).max(500),
        priority: n.default('NORMAL'),
        recipientIds: t.z.array(t.z.string()).min(1, '수신자를 선택해주세요'),
        metadata: t.z.record(t.z.string(), t.z.any()).optional(),
        scheduledAt: t.z.date().optional(),
      }))
    let o = t.z.object({
        userId: t.z.string().cuid('유효하지 않은 사용자 ID입니다'),
        title: t.z
          .string()
          .min(1, '제목을 입력해주세요')
          .max(100, '제목은 100자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '제목에 공백만 포함될 수 없습니다'),
        body: t.z
          .string()
          .min(1, '내용을 입력해주세요')
          .max(500, '내용은 500자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '내용에 공백만 포함될 수 없습니다'),
      }),
      s = t.z.object({
        userId: t.z.string().cuid('유효하지 않은 사용자 ID입니다'),
        title: t.z
          .string()
          .min(1, '제목을 입력해주세요')
          .max(100, '제목은 100자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '제목에 공백만 포함될 수 없습니다'),
        body: t.z
          .string()
          .min(1, '내용을 입력해주세요')
          .max(500, '내용은 500자 이하로 입력해주세요')
          .refine((e) => e.trim().length > 0, '내용에 공백만 포함될 수 없습니다'),
        delayMinutes: t.z
          .number()
          .int('정수만 입력 가능합니다')
          .min(1, '최소 1분 이상이어야 합니다')
          .max(60, '최대 60분까지 설정 가능합니다'),
      })
    e.s([
      'adminFcmNotificationSchema',
      0,
      o,
      'adminScheduleNotificationSchema',
      0,
      s,
      'createNotificationSchema',
      0,
      r,
    ])
  },
  450028,
  (e) => {
    'use strict'
    var t = e.i(747909),
      a = e.i(174017),
      n = e.i(996250),
      i = e.i(759756),
      r = e.i(561916),
      o = e.i(114444),
      s = e.i(837092),
      l = e.i(869741),
      d = e.i(316795),
      u = e.i(487718),
      c = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      f = e.i(626937),
      R = e.i(10372),
      E = e.i(193695)
    e.i(52474)
    var g = e.i(600220),
      v = e.i(89171),
      _ = e.i(493458),
      N = e.i(79832),
      y = e.i(657446),
      b = e.i(398163),
      x = e.i(278164),
      A = e.i(963585)
    async function w(e) {
      try {
        let t = await N.default.api.getSession({ headers: await (0, _.headers)() })
        if (!t?.user || 'ADMIN' !== t.user.role)
          return v.NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        let a = await e.json(),
          {
            userId: n,
            delayMinutes: i,
            title: r,
            body: o,
          } = x.adminScheduleNotificationSchema.parse(a),
          s = await y.prisma.user.findUnique({
            where: { id: n },
            select: { id: !0, name: !0, email: !0, notificationsEnabled: !0 },
          })
        if (!s) return v.NextResponse.json({ error: 'User not found' }, { status: 404 })
        ;(await b.workerApiClient.sendImmediateNotification({
          type: 'status_update',
          bookingId: '',
          targetAudience: 'CUSTOMER',
          title: `[테스트] ${r}`,
          body: `${o} (원래 ${i}분 지연 예정이었으나 즉시 발송)`,
          data: {
            isTest: !0,
            originalDelayMinutes: i,
            scheduledAt: new Date().toISOString(),
            userId: n,
          },
        }),
          console.log(
            `Sent test notification to user ${s.name} (${s.email}) immediately (originally ${i} minutes)`
          ))
        let l = await y.prisma.notification.create({
          data: {
            userId: s.id,
            title: `[테스트] ${r}`,
            body: o,
            type: 'SYSTEM',
            isRead: !1,
            metadata: {
              scheduledBy: t.user.id,
              scheduledAt: new Date().toISOString(),
              originalDelayMinutes: i,
              isScheduled: !1,
              sentImmediately: !0,
            },
          },
        })
        return v.NextResponse.json({
          success: !0,
          message: `Test notification sent immediately (originally scheduled for ${i} minutes)`,
          notificationId: l.id,
          note: 'Scheduled notifications require Worker API endpoint enhancement',
          user: { id: s.id, name: s.name, email: s.email },
        })
      } catch (e) {
        if (e instanceof A.ZodError)
          return v.NextResponse.json(
            {
              error: '유효하지 않은 입력 데이터입니다',
              details: e.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
            },
            { status: 400 }
          )
        if (
          (console.error('Schedule test notification error:', e),
          e instanceof Error && 'PrismaClientKnownRequestError' === e.name)
        )
          return v.NextResponse.json({ error: '데이터베이스 오류가 발생했습니다' }, { status: 500 })
        return v.NextResponse.json({ error: '서버 내부 오류가 발생했습니다' }, { status: 500 })
      }
    }
    e.s(['POST', () => w], 563744)
    var z = e.i(563744)
    let C = new t.AppRouteRouteModule({
        definition: {
          kind: a.RouteKind.APP_ROUTE,
          page: '/api/admin/notifications/schedule-test/route',
          pathname: '/api/admin/notifications/schedule-test',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/admin/notifications/schedule-test/route.ts',
        nextConfigOutput: 'standalone',
        userland: z,
      }),
      { workAsyncStorage: I, workUnitAsyncStorage: O, serverHooks: S } = C
    function T() {
      return (0, n.patchFetch)({ workAsyncStorage: I, workUnitAsyncStorage: O })
    }
    async function P(e, t, n) {
      C.isDev && (0, i.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let v = '/api/admin/notifications/schedule-test/route'
      v = v.replace(/\/index$/, '') || '/'
      let _ = await C.prepare(e, t, { srcPage: v, multiZoneDraftMode: !1 })
      if (!_)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == n.waitUntil || n.waitUntil.call(n, Promise.resolve()),
          null
        )
      let {
          buildId: N,
          params: y,
          nextConfig: b,
          parsedUrl: x,
          isDraftMode: A,
          prerenderManifest: w,
          routerServerContext: z,
          isOnDemandRevalidate: I,
          revalidateOnlyGenerated: O,
          resolvedPathname: S,
          clientReferenceManifest: T,
          serverActionsManifest: P,
        } = _,
        D = (0, l.normalizeAppPath)(v),
        M = !!(w.dynamicRoutes[D] || w.routes[S]),
        j = async () => (
          (null == z ? void 0 : z.render404)
            ? await z.render404(e, t, x, !1)
            : t.end('This page could not be found'),
          null
        )
      if (M && !A) {
        let e = !!w.routes[S],
          t = w.dynamicRoutes[D]
        if (t && !1 === t.fallback && !e) {
          if (b.experimental.adapterPath) return await j()
          throw new E.NoFallbackError()
        }
      }
      let k = null
      !M || C.isDev || A || (k = '/index' === (k = S) ? '/' : k)
      let U = !0 === C.isDev || !M,
        q = M && !U
      P &&
        T &&
        (0, o.setReferenceManifestsSingleton)({
          page: v,
          clientReferenceManifest: T,
          serverActionsManifest: P,
          serverModuleMap: (0, s.createServerModuleMap)({ serverActionsManifest: P }),
        })
      let H = e.method || 'GET',
        $ = (0, r.getTracer)(),
        L = $.getActiveScopeSpan(),
        F = {
          params: y,
          prerenderManifest: w,
          renderOpts: {
            experimental: { authInterrupts: !!b.experimental.authInterrupts },
            cacheComponents: !!b.cacheComponents,
            supportsDynamicResponse: U,
            incrementalCache: (0, i.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: b.cacheLife,
            waitUntil: n.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, a, n) => C.onRequestError(e, t, n, z),
          },
          sharedContext: { buildId: N },
        },
        G = new d.NodeNextRequest(e),
        K = new d.NodeNextResponse(t),
        B = u.NextRequestAdapter.fromNodeNextRequest(G, (0, u.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            C.handle(B, F).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let a = $.getRootSpanAttributes()
              if (!a) return
              if (a.get('next.span_type') !== c.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${a.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let n = a.get('next.route')
              if (n) {
                let t = `${H} ${n}`
                ;(e.setAttributes({ 'next.route': n, 'http.route': n, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${H} ${v}`)
            }),
          s = !!(0, i.getRequestMeta)(e, 'minimalMode'),
          l = async (i) => {
            var r, l
            let d = async ({ previousCacheEntry: a }) => {
                try {
                  if (!s && I && O && !a)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let r = await o(i)
                  e.fetchMetrics = F.renderOpts.fetchMetrics
                  let l = F.renderOpts.pendingWaitUntil
                  l && n.waitUntil && (n.waitUntil(l), (l = void 0))
                  let d = F.renderOpts.collectedTags
                  if (!M)
                    return (await (0, m.sendResponse)(G, K, r, F.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await r.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(r.headers)
                    ;(d && (t[R.NEXT_CACHE_TAGS_HEADER] = d),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let a =
                        void 0 !== F.renderOpts.collectedRevalidate &&
                        !(F.renderOpts.collectedRevalidate >= R.INFINITE_CACHE) &&
                        F.renderOpts.collectedRevalidate,
                      n =
                        void 0 === F.renderOpts.collectedExpire ||
                        F.renderOpts.collectedExpire >= R.INFINITE_CACHE
                          ? void 0
                          : F.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: g.CachedRouteKind.APP_ROUTE,
                        status: r.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: a, expire: n },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == a ? void 0 : a.isStale) &&
                      (await C.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: v,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: q,
                            isOnDemandRevalidate: I,
                          }),
                        },
                        z
                      )),
                    t
                  )
                }
              },
              u = await C.handleResponse({
                req: e,
                nextConfig: b,
                cacheKey: k,
                routeKind: a.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: w,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: I,
                revalidateOnlyGenerated: O,
                responseGenerator: d,
                waitUntil: n.waitUntil,
                isMinimalMode: s,
              })
            if (!M) return null
            if (
              (null == u || null == (r = u.value) ? void 0 : r.kind) !== g.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == u || null == (l = u.value) ? void 0 : l.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(s ||
              t.setHeader(
                'x-nextjs-cache',
                I ? 'REVALIDATED' : u.isMiss ? 'MISS' : u.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let c = (0, h.fromNodeOutgoingHttpHeaders)(u.value.headers)
            return (
              (s && M) || c.delete(R.NEXT_CACHE_TAGS_HEADER),
              !u.cacheControl ||
                t.getHeader('Cache-Control') ||
                c.get('Cache-Control') ||
                c.set('Cache-Control', (0, f.getCacheControlHeader)(u.cacheControl)),
              await (0, m.sendResponse)(
                G,
                K,
                new Response(u.value.body, { headers: c, status: u.value.status || 200 })
              ),
              null
            )
          }
        L
          ? await l(L)
          : await $.withPropagatedContext(e.headers, () =>
              $.trace(
                c.BaseServerSpan.handleRequest,
                {
                  spanName: `${H} ${v}`,
                  kind: r.SpanKind.SERVER,
                  attributes: { 'http.method': H, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof E.NoFallbackError ||
            (await C.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: D,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: q,
                isOnDemandRevalidate: I,
              }),
            })),
          M)
        )
          throw t
        return (await (0, m.sendResponse)(G, K, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => P,
        'patchFetch',
        () => T,
        'routeModule',
        () => C,
        'serverHooks',
        () => S,
        'workAsyncStorage',
        () => I,
        'workUnitAsyncStorage',
        () => O,
      ],
      450028
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
        ['server/chunks/[root-of-the-server]__77683f7c._.js', 'server/chunks/_46980750._.js'].map(
          (t) => e.l(t)
        )
      ).then(() => t(315159))
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__1091d7df._.js.map
