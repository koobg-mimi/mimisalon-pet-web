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
    function s(e, t) {
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
      e.s(['toDate', () => s], 609730))
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
    var s = e.i(609730)
    function o(e, r) {
      let o =
          r?.weekStartsOn ??
          r?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        n = (0, s.toDate)(e, r?.in),
        a = n.getDay()
      return (n.setDate(n.getDate() - (7 * (a < o) + a - o)), n.setHours(0, 0, 0, 0), n)
    }
    e.s(['startOfWeek', () => o], 250354)
  },
  418789,
  (e) => {
    'use strict'
    var t = e.i(686880),
      r = e.i(343747)
    class s {
      config
      baseUrl
      constructor(e) {
        ;((this.config = e), (this.baseUrl = e.baseUrl || 'https://api.portone.io'))
      }
      async makeRequest(e, t = {}) {
        let r = `${this.baseUrl}${e}`,
          s = {
            'Content-Type': 'application/json',
            Authorization: `PortOne ${this.config.apiSecret}`,
            ...t.headers,
          },
          o = await fetch(r, { ...t, headers: s })
        if (!o.ok) {
          let e = await o.json().catch(() => null)
          throw Error(
            `PortOne API Error: ${o.status} ${o.statusText} - ${e?.message || 'Unknown error'}`
          )
        }
        return o.json()
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
        let s = r.toString(),
          o = `/platform/partners${s ? `?${s}` : ''}`
        return this.makeRequest(o)
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
        let s = r.toString(),
          o = `/platform/transfers${s ? `?${s}` : ''}`
        return this.makeRequest(o)
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
        let s = r.toString(),
          o = `/platform/partner-settlements${s ? `?${s}` : ''}`
        return this.makeRequest(o)
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
    let o = null
    function n() {
      if (!o) {
        let e = {
          apiKey: process.env.PORTONE_API_KEY || '',
          apiSecret: process.env.PORTONE_API_SECRET || '',
          baseUrl: process.env.PORTONE_API_BASE_URL || 'https://api.portone.io',
          isProduction: !0,
        }
        if (!e.apiKey || !e.apiSecret) throw Error('PortOne API credentials are not configured')
        o = new s(e)
      }
      return o
    }
    function a() {
      return 'true' === process.env.PORTONE_PLATFORM_ENABLED
    }
    e.s(['getPortOneClient', () => n, 'isPortOneEnabled', () => a])
  },
  528164,
  458325,
  (e) => {
    'use strict'
    var t = e.i(662001),
      r = e.i(609730)
    function s(e, s) {
      let o = (0, t.getDefaultOptions)(),
        n =
          s?.weekStartsOn ??
          s?.locale?.options?.weekStartsOn ??
          o.weekStartsOn ??
          o.locale?.options?.weekStartsOn ??
          0,
        a = (0, r.toDate)(e, s?.in),
        i = a.getDay()
      return (
        a.setDate(a.getDate() + ((i < n ? -7 : 0) + 6 - (i - n))),
        a.setHours(23, 59, 59, 999),
        a
      )
    }
    e.s(['endOfWeek', () => s], 528164)
    var o = e.i(874321)
    function n(e, t, s) {
      var n
      let a
      return (
        (n = -(7 * t)),
        (a = (0, r.toDate)(e, s?.in)),
        isNaN(n) ? (0, o.constructFrom)(s?.in || e, NaN) : (n && a.setDate(a.getDate() + n), a)
      )
    }
    e.s(['subWeeks', () => n], 458325)
  },
  905404,
  (e) => {
    'use strict'
    var t = e.i(657446)
    class r {
      static validateGroomer(e) {
        return e.groomerProfile
          ? e.groomerProfile.commissionGrade
            ? e.groomerProfile.commissionGrade.commissionRate
              ? { isValid: !0 }
              : {
                  isValid: !1,
                  reason: 'no_commission_rate',
                  details: '수수료율이 설정되지 않았습니다',
                }
            : {
                isValid: !1,
                reason: 'no_commission_grade',
                details: '수수료 등급이 설정되지 않았습니다',
              }
          : { isValid: !1, reason: 'no_profile', details: '미용사 프로필이 없습니다' }
      }
      static calculateSettlement(e, t, r = 0) {
        if (0 === e.length)
          return {
            totalRevenue: 0,
            commissionRate: t,
            platformCommission: 0,
            netSettlementAmount: 0,
            taxAmount: 0,
            bookingCount: 0,
          }
        let s = e.reduce((e, t) => e + t.totalPrice, 0),
          o = (t / 100) * s,
          n = r > 0 ? (r / 100) * s : 0
        return {
          totalRevenue: s,
          commissionRate: t,
          platformCommission: o,
          netSettlementAmount: s - o - n,
          taxAmount: n,
          bookingCount: e.length,
        }
      }
      static async fetchActiveGroomers() {
        return await t.prisma.user.findMany({
          where: { role: 'GROOMER', groomerProfile: { isActive: !0, isSettlementActive: !0 } },
          select: {
            id: !0,
            name: !0,
            email: !0,
            groomerProfile: {
              select: {
                id: !0,
                groomerId: !0,
                commissionGradeId: !0,
                taxRate: !0,
                portonePartnerId: !0,
                portoneContractId: !0,
                commissionGrade: { select: { id: !0, name: !0, commissionRate: !0 } },
              },
            },
          },
        })
      }
      static async fetchBookingsForGroomers(e, r, s) {
        let o = await t.prisma.booking.findMany({
            where: {
              groomerId: { in: e },
              status: 'SERVICE_COMPLETED',
              completedAt: { gte: r, lte: s },
            },
            select: {
              id: !0,
              bookingNumber: !0,
              totalPrice: !0,
              completedAt: !0,
              groomerId: !0,
              payments: {
                where: { status: 'PAID' },
                select: { id: !0, paymentId: !0, status: !0, amount: !0, paidAt: !0 },
              },
            },
          }),
          n = new Map()
        for (let e of o) {
          let { groomerId: t, ...r } = e
          if (!t) {
            console.warn(`Booking ${e.id} has no groomerId, skipping`)
            continue
          }
          ;(n.has(t) || n.set(t, []), n.get(t).push(r))
        }
        return n
      }
      static async checkExistingSettlements(e, r, s) {
        return new Set(
          (
            await t.prisma.groomerSettlement.findMany({
              where: { groomerId: { in: e }, periodStartDate: r, periodEndDate: s },
              select: { groomerId: !0 },
            })
          ).map((e) => e.groomerId)
        )
      }
      static async createSettlement(e, r, s, o, n, a) {
        return await t.prisma.$transaction(async (t) => {
          let i = await t.groomerSettlement.create({
            data: {
              groomerId: e.id,
              groomerProfileId: e.groomerProfile.id,
              settlementDate: new Date(),
              periodStartDate: o,
              periodEndDate: n,
              totalRevenue: s.totalRevenue,
              commissionRate: s.commissionRate,
              commissionAmount: s.platformCommission,
              taxAmount: s.taxAmount,
              netSettlementAmount: s.netSettlementAmount,
              status: 'CALCULATED',
              bookingCount: s.bookingCount,
              notes: a || '자동 정산',
              processedAt: new Date(),
            },
          })
          for (let o of r) {
            let r = o.totalPrice * (s.commissionRate / 100),
              n = s.taxAmount > 0 ? o.totalPrice * (s.taxAmount / s.totalRevenue) : 0,
              a = o.totalPrice - r - n
            await t.groomerSettlementDetail.create({
              data: {
                settlementId: i.id,
                groomerProfileId: e.groomerProfile.id,
                bookingId: o.id,
                bookingDate: o.completedAt,
                serviceAmount: o.totalPrice,
                commissionRate: s.commissionRate,
                commissionAmount: r,
                taxAmount: n,
                netAmount: a,
              },
            })
          }
          return i.id
        })
      }
      static async processSettlements(e, t, r = {}) {
        let { skipExisting: s = !0, dryRun: o = !1, onProgress: n } = r,
          a = await this.fetchActiveGroomers(),
          i = [],
          m = 0
        n?.({ completed: 0, total: a.length, current: 'Fetching groomer data...' })
        let l = a.map((e) => e.id),
          c = s ? await this.checkExistingSettlements(l, e, t) : new Set(),
          u = await this.fetchBookingsForGroomers(l, e, t)
        n?.({ completed: 0, total: a.length, current: 'Processing settlements...' })
        let d = 0
        for (let r of a) {
          try {
            let s
            if (
              (n?.({
                completed: d,
                total: a.length,
                current: `Processing ${r.name || r.email}...`,
              }),
              c.has(r.id))
            ) {
              ;(i.push({
                groomerId: r.id,
                groomerName: r.name || '알 수 없음',
                status: 'skipped',
                reason: 'already_exists',
              }),
                d++)
              continue
            }
            let l = this.validateGroomer(r)
            if (!l.isValid) {
              ;(i.push({
                groomerId: r.id,
                groomerName: r.name || '알 수 없음',
                status: 'skipped',
                reason: l.reason,
                error: l.details,
              }),
                d++)
              continue
            }
            let p = u.get(r.id) || []
            if (0 === p.length) {
              ;(i.push({
                groomerId: r.id,
                groomerName: r.name || '알 수 없음',
                status: 'skipped',
                reason: 'no_bookings',
              }),
                d++)
              continue
            }
            let g = this.calculateSettlement(
              p,
              r.groomerProfile.commissionGrade.commissionRate,
              r.groomerProfile.taxRate
            )
            ;(o || (s = await this.createSettlement(r, p, g, e, t, '배치 자동 정산')),
              i.push({
                groomerId: r.id,
                groomerName: r.name || '알 수 없음',
                status: 'success',
                settlementId: s,
                calculation: g,
              }),
              (m += g.netSettlementAmount))
          } catch (e) {
            i.push({
              groomerId: r.id,
              groomerName: r.name || '알 수 없음',
              status: 'failed',
              error: e instanceof Error ? e.message : '알 수 없는 오류',
            })
          }
          d++
        }
        n?.({ completed: d, total: a.length, current: 'Complete!' })
        let p = {
          total: i.length,
          successful: i.filter((e) => 'success' === e.status).length,
          failed: i.filter((e) => 'failed' === e.status).length,
          skipped: i.filter((e) => 'skipped' === e.status).length,
          totalAmount: m,
        }
        return { results: i, summary: p }
      }
    }
    e.s(['SettlementCalculator', () => r])
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b96b207f._.js.map
