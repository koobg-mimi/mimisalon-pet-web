module.exports = [
  254799,
  (e, t, s) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  609730,
  438220,
  874321,
  (e) => {
    'use strict'
    let t = Symbol.for('constructDateFrom')
    function s(e, s) {
      return 'function' == typeof e
        ? e(s)
        : e && 'object' == typeof e && t in e
          ? e[t](s)
          : e instanceof Date
            ? new e.constructor(s)
            : new Date(s)
    }
    function r(e, t) {
      return s(t || e, e)
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
      e.s(['constructFrom', () => s], 874321),
      e.s(['toDate', () => r], 609730))
  },
  250354,
  662001,
  (e) => {
    'use strict'
    let t = {}
    function s() {
      return t
    }
    e.s(['getDefaultOptions', () => s], 662001)
    var r = e.i(609730)
    function n(e, s) {
      let n =
          s?.weekStartsOn ??
          s?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        o = (0, r.toDate)(e, s?.in),
        a = o.getDay()
      return (o.setDate(o.getDate() - (7 * (a < n) + a - n)), o.setHours(0, 0, 0, 0), o)
    }
    e.s(['startOfWeek', () => n], 250354)
  },
  121741,
  278052,
  (e) => {
    'use strict'
    var t = e.i(609730)
    function s(e, s) {
      let r = (0, t.toDate)(e, s?.in)
      return (r.setDate(1), r.setHours(0, 0, 0, 0), r)
    }
    function r(e, s) {
      let r = (0, t.toDate)(e, s?.in),
        n = r.getMonth()
      return (r.setFullYear(r.getFullYear(), n + 1, 0), r.setHours(23, 59, 59, 999), r)
    }
    ;(e.s(['startOfMonth', () => s], 121741), e.s(['endOfMonth', () => r], 278052))
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b7123c0e._.js.map
