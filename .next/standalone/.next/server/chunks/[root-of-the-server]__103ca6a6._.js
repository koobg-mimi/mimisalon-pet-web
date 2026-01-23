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
        s = (0, a.toDate)(e, r?.in),
        o = s.getDay()
      return (s.setDate(s.getDate() - (7 * (o < n) + o - n)), s.setHours(0, 0, 0, 0), s)
    }
    e.s(['startOfWeek', () => n], 250354)
  },
  418789,
  (e) => {
    'use strict'
    var t = e.i(686880),
      r = e.i(343747)
    class a {
      config
      baseUrl
      constructor(e) {
        ;((this.config = e), (this.baseUrl = e.baseUrl || 'https://api.portone.io'))
      }
      async makeRequest(e, t = {}) {
        let r = `${this.baseUrl}${e}`,
          a = {
            'Content-Type': 'application/json',
            Authorization: `PortOne ${this.config.apiSecret}`,
            ...t.headers,
          },
          n = await fetch(r, { ...t, headers: a })
        if (!n.ok) {
          let e = await n.json().catch(() => null)
          throw Error(
            `PortOne API Error: ${n.status} ${n.statusText} - ${e?.message || 'Unknown error'}`
          )
        }
        return n.json()
      }
      async createPartner(e) {
        return this.makeRequest('/platform/partners', { method: 'POST', body: JSON.stringify(e) })
      }
      async getPartner(e) {
        return this.makeRequest(`/platform/partners/${e}`)
      }
      async updatePartner(e, t) {
        return this.makeRequest(`/platform/partners/${e}`, {
          method: 'PATCH',
          body: JSON.stringify(t),
        })
      }
      async listPartners(e, t) {
        let r = new URLSearchParams()
        ;(e?.ids && e.ids.forEach((e) => r.append('id', e)),
          e?.keyword && r.set('keyword', e.keyword),
          e?.tags && e.tags.forEach((e) => r.append('tag', e)),
          e?.isArchived !== void 0 && r.set('isArchived', e.isArchived.toString()),
          t?.number && r.set('page[number]', t.number.toString()),
          t?.size && r.set('page[size]', t.size.toString()))
        let a = r.toString(),
          n = `/platform/partners${a ? `?${a}` : ''}`
        return this.makeRequest(n)
      }
      async getContract(e) {
        return this.makeRequest(`/platform/contracts/${e}`)
      }
      async listContracts() {
        return this.makeRequest('/platform/contracts')
      }
      async createOrderTransfer(e) {
        return this.makeRequest('/platform/transfers/order', {
          method: 'POST',
          body: JSON.stringify(e),
        })
      }
      async getTransfer(e) {
        return this.makeRequest(`/platform/transfers/${e}`)
      }
      async listTransfers(e, t) {
        let r = new URLSearchParams()
        ;(e?.partnerIds && e.partnerIds.forEach((e) => r.append('partnerId', e)),
          e?.statuses && e.statuses.forEach((e) => r.append('status', e)),
          e?.keyword && r.set('keyword', e.keyword),
          t?.number && r.set('page[number]', t.number.toString()),
          t?.size && r.set('page[size]', t.size.toString()))
        let a = r.toString(),
          n = `/platform/transfers${a ? `?${a}` : ''}`
        return this.makeRequest(n)
      }
      async getPartnerSettlement(e) {
        return this.makeRequest(`/platform/partner-settlements/${e}`)
      }
      async listPartnerSettlements(e, t) {
        let r = new URLSearchParams()
        ;(e?.partnerIds && e.partnerIds.forEach((e) => r.append('partnerId', e)),
          e?.statuses && e.statuses.forEach((e) => r.append('status', e)),
          e?.settlementDates?.from && r.set('settlementDate[from]', e.settlementDates.from),
          e?.settlementDates?.until && r.set('settlementDate[until]', e.settlementDates.until),
          t?.number && r.set('page[number]', t.number.toString()),
          t?.size && r.set('page[size]', t.size.toString()))
        let a = r.toString(),
          n = `/platform/partner-settlements${a ? `?${a}` : ''}`
        return this.makeRequest(n)
      }
      async createBulkPayout(e) {
        return this.makeRequest('/platform/bulk-payouts', {
          method: 'POST',
          body: JSON.stringify(e),
        })
      }
      async getBulkPayout(e) {
        return this.makeRequest(`/platform/bulk-payouts/${e}`)
      }
      generatePartnerId(e) {
        return `groomer_${e}`
      }
      convertSettlementCycle(e) {
        switch (e) {
          case 'WEEKLY_TUESDAY':
          default:
            return { method: 'WEEKLY', lagDays: 2 }
          case 'MONTHLY':
            return { method: 'MONTHLY', lagDays: 3 }
        }
      }
      formatDate(e) {
        return (0, r.format)(e, 'yyyy-MM-dd', { locale: t.ko })
      }
      isPortOneError(e) {
        return (
          null != e &&
          'object' == typeof e &&
          'type' in e &&
          'message' in e &&
          'string' == typeof e.type &&
          'string' == typeof e.message
        )
      }
    }
    let n = null
    function s() {
      if (!n) {
        let e = {
          apiKey: process.env.PORTONE_API_KEY || '',
          apiSecret: process.env.PORTONE_API_SECRET || '',
          baseUrl: process.env.PORTONE_API_BASE_URL || 'https://api.portone.io',
          isProduction: !0,
        }
        if (!e.apiKey || !e.apiSecret) throw Error('PortOne API credentials are not configured')
        n = new a(e)
      }
      return n
    }
    function o() {
      return 'true' === process.env.PORTONE_PLATFORM_ENABLED
    }
    e.s(['getPortOneClient', () => s, 'isPortOneEnabled', () => o])
  },
  374848,
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
      c = e.i(487718),
      d = e.i(995169),
      p = e.i(47587),
      m = e.i(666012),
      h = e.i(570101),
      f = e.i(626937),
      g = e.i(10372),
      w = e.i(193695)
    e.i(52474)
    var y = e.i(600220),
      E = e.i(254799),
      R = e.i(89171),
      P = e.i(493458),
      O = e.i(657446),
      S = e.i(418789),
      v = e.i(547499)
    async function A(e) {
      let { partnerSettlementId: t, status: r } = e.data
      try {
        let e = await O.prisma.groomerSettlement.findFirst({ where: { portoneSettlementId: t } })
        if (!e) return void console.warn(`로컬 정산을 찾을 수 없음: PortOne ID ${t}`)
        let a = e.status,
          n = e.paidAt
        switch (r) {
          case 'PAYOUT_SCHEDULED':
          case 'PAYOUT_PREPARED':
            a = 'READY_FOR_PAYOUT'
            break
          case 'IN_PAYOUT':
          case 'PAYOUT_WITHHELD':
            a = 'PROCESSING'
            break
          case 'PAID_OUT':
            ;((a = 'PAID'), (n = new Date()))
            break
          case 'CANCELLED':
            a = 'CANCELLED'
            break
          case 'PAYOUT_FAILED':
            a = 'FAILED'
        }
        ;(await O.prisma.groomerSettlement.update({
          where: { id: e.id },
          data: { status: a, paidAt: n, processedAt: new Date() },
        }),
          console.log(`✅ 정산 상태 업데이트: ${e.id} -> ${a} (PortOne: ${r})`))
      } catch (e) {
        throw (console.error('파트너 정산 상태 변경 처리 실패:', e), e)
      }
    }
    async function b(e) {
      let { bulkPayoutId: t, status: r, partnerSettlementIds: a } = e.data
      try {
        let e = await O.prisma.groomerSettlement.findMany({
          where: { portoneSettlementId: { in: a } },
        })
        if (0 === e.length)
          return void console.warn(`일괄 지급에 해당하는 로컬 정산을 찾을 수 없음: ${t}`)
        let n = e[0].status
        switch (r) {
          case 'PROCESSING':
            n = 'PROCESSING'
            break
          case 'COMPLETED':
            n = 'PAID'
            break
          case 'CANCELLED':
          case 'STOPPED':
            n = 'FAILED'
        }
        ;(await O.prisma.groomerSettlement.updateMany({
          where: { portoneSettlementId: { in: a } },
          data: {
            status: n,
            paidAt: 'COMPLETED' === r ? new Date() : void 0,
            processedAt: new Date(),
          },
        }),
          console.log(`✅ 일괄 지급 상태 업데이트: ${e.length}개 정산 -> ${n} (PortOne: ${r})`))
      } catch (e) {
        throw (console.error('일괄 지급 상태 변경 처리 실패:', e), e)
      }
    }
    async function D(e) {
      let { payoutId: t, partnerSettlementId: r, amount: a, completedAt: n } = e.data
      try {
        let e = await O.prisma.groomerSettlement.findFirst({ where: { portoneSettlementId: r } })
        if (!e) return void console.warn(`지급 완료된 정산을 찾을 수 없음: ${r}`)
        ;(await O.prisma.groomerSettlement.update({
          where: { id: e.id },
          data: {
            status: 'PAID',
            paidAt: new Date(n),
            processedAt: new Date(),
            portonePayoutId: t,
          },
        }),
          console.log(`✅ 지급 완료: ${e.id} (${a}원, ${t})`))
      } catch (e) {
        throw (console.error('지급 완료 처리 실패:', e), e)
      }
    }
    async function k(e) {
      let { payoutId: t, partnerSettlementId: r, failureReason: a, failedAt: n } = e.data
      try {
        let e = await O.prisma.groomerSettlement.findFirst({ where: { portoneSettlementId: r } })
        if (!e) return void console.warn(`지급 실패된 정산을 찾을 수 없음: ${r}`)
        ;(await O.prisma.groomerSettlement.update({
          where: { id: e.id },
          data: {
            status: 'FAILED',
            failureReason: a,
            processedAt: new Date(n),
            portonePayoutId: t,
          },
        }),
          console.error(`❌ 지급 실패: ${e.id} - ${a} (${t})`))
      } catch (e) {
        throw (console.error('지급 실패 처리 실패:', e), e)
      }
    }
    async function C(e) {
      switch ((console.log(`📨 PortOne 웹훅 이벤트 수신: ${e.type}`), e.type)) {
        case 'PartnerSettlement.StatusChanged':
          await A(e)
          break
        case 'BulkPayout.StatusChanged':
          await b(e)
          break
        case 'Payout.Completed':
          await D(e)
          break
        case 'Payout.Failed':
          await k(e)
          break
        default:
          console.log(`⚠️ 처리되지 않은 웹훅 이벤트 타입: ${e.type}`)
      }
    }
    async function T(e) {
      try {
        let t
        if (!(0, S.isPortOneEnabled)())
          return (
            console.warn('PortOne 기능이 비활성화됨 - 웹훅 무시'),
            R.NextResponse.json({ success: !0, message: 'PortOne disabled' })
          )
        let r = await e.text(),
          a = (await (0, P.headers)()).get('x-portone-signature'),
          n = v.env.PORTONE_WEBHOOK_SECRET
        if (n && a) {
          if (
            !(function (e, t, r) {
              if (!t || !r) return !1
              try {
                let a = E.default.createHmac('sha256', r).update(e, 'utf8').digest('hex'),
                  n = t.replace(/^v1=/, '')
                return E.default.timingSafeEqual(Buffer.from(n, 'hex'), Buffer.from(a, 'hex'))
              } catch (e) {
                return (console.error('웹훅 서명 검증 중 오류:', e), !1)
              }
            })(r, a, n)
          )
            return (
              console.error('PortOne 웹훅 서명 검증 실패'),
              R.NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
            )
        } else if ('production' === v.env.NODE_ENV)
          return (
            console.error('PortOne 웹훅 서명 또는 시크릿이 없음'),
            R.NextResponse.json({ error: 'Missing signature or secret' }, { status: 401 })
          )
        try {
          t = JSON.parse(r)
        } catch (e) {
          return (
            console.error('PortOne 웹훅 JSON 파싱 실패:', e),
            R.NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
          )
        }
        return (await C(t), R.NextResponse.json({ success: !0 }))
      } catch (e) {
        return (
          console.error('PortOne 웹훅 처리 실패:', e),
          R.NextResponse.json(
            {
              error: 'Internal server error',
              message: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
          )
        )
      }
    }
    async function I() {
      return R.NextResponse.json({
        status: 'ready',
        enabled: (0, S.isPortOneEnabled)(),
        timestamp: new Date().toISOString(),
      })
    }
    e.s(['GET', () => I, 'POST', () => T], 585775)
    var N = e.i(585775)
    let x = new t.AppRouteRouteModule({
        definition: {
          kind: r.RouteKind.APP_ROUTE,
          page: '/api/webhooks/portone-settlement/route',
          pathname: '/api/webhooks/portone-settlement',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/webhooks/portone-settlement/route.ts',
        nextConfigOutput: 'standalone',
        userland: N,
      }),
      { workAsyncStorage: $, workUnitAsyncStorage: _, serverHooks: U } = x
    function q() {
      return (0, a.patchFetch)({ workAsyncStorage: $, workUnitAsyncStorage: _ })
    }
    async function L(e, t, a) {
      x.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let E = '/api/webhooks/portone-settlement/route'
      E = E.replace(/\/index$/, '') || '/'
      let R = await x.prepare(e, t, { srcPage: E, multiZoneDraftMode: !1 })
      if (!R)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == a.waitUntil || a.waitUntil.call(a, Promise.resolve()),
          null
        )
      let {
          buildId: P,
          params: O,
          nextConfig: S,
          parsedUrl: v,
          isDraftMode: A,
          prerenderManifest: b,
          routerServerContext: D,
          isOnDemandRevalidate: k,
          revalidateOnlyGenerated: C,
          resolvedPathname: T,
          clientReferenceManifest: I,
          serverActionsManifest: N,
        } = R,
        $ = (0, l.normalizeAppPath)(E),
        _ = !!(b.dynamicRoutes[$] || b.routes[T]),
        U = async () => (
          (null == D ? void 0 : D.render404)
            ? await D.render404(e, t, v, !1)
            : t.end('This page could not be found'),
          null
        )
      if (_ && !A) {
        let e = !!b.routes[T],
          t = b.dynamicRoutes[$]
        if (t && !1 === t.fallback && !e) {
          if (S.experimental.adapterPath) return await U()
          throw new w.NoFallbackError()
        }
      }
      let q = null
      !_ || x.isDev || A || (q = '/index' === (q = T) ? '/' : q)
      let L = !0 === x.isDev || !_,
        H = _ && !L
      N &&
        I &&
        (0, o.setReferenceManifestsSingleton)({
          page: E,
          clientReferenceManifest: I,
          serverActionsManifest: N,
          serverModuleMap: (0, i.createServerModuleMap)({ serverActionsManifest: N }),
        })
      let M = e.method || 'GET',
        F = (0, s.getTracer)(),
        j = F.getActiveScopeSpan(),
        K = {
          params: O,
          prerenderManifest: b,
          renderOpts: {
            experimental: { authInterrupts: !!S.experimental.authInterrupts },
            cacheComponents: !!S.cacheComponents,
            supportsDynamicResponse: L,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: S.cacheLife,
            waitUntil: a.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, r, a) => x.onRequestError(e, t, a, D),
          },
          sharedContext: { buildId: P },
        },
        B = new u.NodeNextRequest(e),
        Y = new u.NodeNextResponse(t),
        z = c.NextRequestAdapter.fromNodeNextRequest(B, (0, c.signalFromNodeResponse)(t))
      try {
        let o = async (e) =>
            x.handle(z, K).finally(() => {
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
                let t = `${M} ${a}`
                ;(e.setAttributes({ 'next.route': a, 'http.route': a, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${M} ${E}`)
            }),
          i = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          l = async (n) => {
            var s, l
            let u = async ({ previousCacheEntry: r }) => {
                try {
                  if (!i && k && C && !r)
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
                  if (!_)
                    return (await (0, m.sendResponse)(B, Y, s, K.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await s.blob(),
                      t = (0, h.toNodeOutgoingHttpHeaders)(s.headers)
                    ;(u && (t[g.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let r =
                        void 0 !== K.renderOpts.collectedRevalidate &&
                        !(K.renderOpts.collectedRevalidate >= g.INFINITE_CACHE) &&
                        K.renderOpts.collectedRevalidate,
                      a =
                        void 0 === K.renderOpts.collectedExpire ||
                        K.renderOpts.collectedExpire >= g.INFINITE_CACHE
                          ? void 0
                          : K.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: y.CachedRouteKind.APP_ROUTE,
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
                      (await x.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: E,
                          routeType: 'route',
                          revalidateReason: (0, p.getRevalidateReason)({
                            isStaticGeneration: H,
                            isOnDemandRevalidate: k,
                          }),
                        },
                        D
                      )),
                    t
                  )
                }
              },
              c = await x.handleResponse({
                req: e,
                nextConfig: S,
                cacheKey: q,
                routeKind: r.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: b,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: k,
                revalidateOnlyGenerated: C,
                responseGenerator: u,
                waitUntil: a.waitUntil,
                isMinimalMode: i,
              })
            if (!_) return null
            if (
              (null == c || null == (s = c.value) ? void 0 : s.kind) !== y.CachedRouteKind.APP_ROUTE
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
                k ? 'REVALIDATED' : c.isMiss ? 'MISS' : c.isStale ? 'STALE' : 'HIT'
              ),
              A &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, h.fromNodeOutgoingHttpHeaders)(c.value.headers)
            return (
              (i && _) || d.delete(g.NEXT_CACHE_TAGS_HEADER),
              !c.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, f.getCacheControlHeader)(c.cacheControl)),
              await (0, m.sendResponse)(
                B,
                Y,
                new Response(c.value.body, { headers: d, status: c.value.status || 200 })
              ),
              null
            )
          }
        j
          ? await l(j)
          : await F.withPropagatedContext(e.headers, () =>
              F.trace(
                d.BaseServerSpan.handleRequest,
                {
                  spanName: `${M} ${E}`,
                  kind: s.SpanKind.SERVER,
                  attributes: { 'http.method': M, 'http.target': e.url },
                },
                l
              )
            )
      } catch (t) {
        if (
          (t instanceof w.NoFallbackError ||
            (await x.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: $,
              routeType: 'route',
              revalidateReason: (0, p.getRevalidateReason)({
                isStaticGeneration: H,
                isOnDemandRevalidate: k,
              }),
            })),
          _)
        )
          throw t
        return (await (0, m.sendResponse)(B, Y, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => L,
        'patchFetch',
        () => q,
        'routeModule',
        () => x,
        'serverHooks',
        () => U,
        'workAsyncStorage',
        () => $,
        'workUnitAsyncStorage',
        () => _,
      ],
      374848
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__103ca6a6._.js.map
