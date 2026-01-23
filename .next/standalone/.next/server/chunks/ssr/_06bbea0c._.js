module.exports = [
  277421,
  (a) => {
    'use strict'
    var b = a.i(42724),
      c = a.i(774016)
    function d(a, d, e) {
      let f = (0, c.toDate)(a, e?.in)
      return isNaN(d) ? (0, b.constructFrom)(e?.in || a, NaN) : (d && f.setDate(f.getDate() + d), f)
    }
    a.s(['addDays', () => d])
  },
  35596,
  (a) => {
    'use strict'
    var b = a.i(774016)
    function c(a, c) {
      return +(0, b.toDate)(a) < +(0, b.toDate)(c)
    }
    a.s(['isBefore', () => c])
  },
  835262,
  751041,
  (a) => {
    'use strict'
    Symbol.for('constructDateFrom')
    let b = {},
      c = {}
    function d(a, d) {
      try {
        let e = (b[a] ||= new Intl.DateTimeFormat('en-US', {
          timeZone: a,
          timeZoneName: 'longOffset',
        }).format)(d).split('GMT')[1]
        if (e in c) return c[e]
        return f(e, e.split(':'))
      } catch {
        if (a in c) return c[a]
        let b = a?.match(e)
        if (b) return f(a, b.slice(1))
        return NaN
      }
    }
    let e = /([+-]\d\d):?(\d\d)?/
    function f(a, b) {
      let d = +(b[0] || 0),
        e = +(b[1] || 0),
        f = (b[2] || 0) / 60
      return (c[a] = 60 * d + e > 0 ? 60 * d + e + f : 60 * d - e - f)
    }
    class g extends Date {
      constructor(...a) {
        ;(super(),
          a.length > 1 && 'string' == typeof a[a.length - 1] && (this.timeZone = a.pop()),
          (this.internal = new Date()),
          isNaN(d(this.timeZone, this))
            ? this.setTime(NaN)
            : a.length
              ? 'number' == typeof a[0] &&
                (1 === a.length || (2 === a.length && 'number' != typeof a[1]))
                ? this.setTime(a[0])
                : 'string' == typeof a[0]
                  ? this.setTime(+new Date(a[0]))
                  : a[0] instanceof Date
                    ? this.setTime(+a[0])
                    : (this.setTime(+new Date(...a)), j(this, NaN), i(this))
              : this.setTime(Date.now()))
      }
      static tz(a, ...b) {
        return b.length ? new g(...b, a) : new g(Date.now(), a)
      }
      withTimeZone(a) {
        return new g(+this, a)
      }
      getTimezoneOffset() {
        let a = -d(this.timeZone, this)
        return a > 0 ? Math.floor(a) : Math.ceil(a)
      }
      setTime(a) {
        return (Date.prototype.setTime.apply(this, arguments), i(this), +this)
      }
      [Symbol.for('constructDateFrom')](a) {
        return new g(+new Date(a), this.timeZone)
      }
    }
    let h = /^(get|set)(?!UTC)/
    function i(a) {
      ;(a.internal.setTime(+a),
        a.internal.setUTCSeconds(a.internal.getUTCSeconds() - Math.round(-(60 * d(a.timeZone, a)))))
    }
    function j(a) {
      let b = d(a.timeZone, a),
        c = b > 0 ? Math.floor(b) : Math.ceil(b),
        e = new Date(+a)
      e.setUTCHours(e.getUTCHours() - 1)
      let f = -new Date(+a).getTimezoneOffset(),
        g = f - -new Date(+e).getTimezoneOffset(),
        h = Date.prototype.getHours.apply(a) !== a.internal.getUTCHours()
      g && h && a.internal.setUTCMinutes(a.internal.getUTCMinutes() + g)
      let i = f - c
      i && Date.prototype.setUTCMinutes.call(a, Date.prototype.getUTCMinutes.call(a) + i)
      let j = new Date(+a)
      j.setUTCSeconds(0)
      let k = f > 0 ? j.getSeconds() : (j.getSeconds() - 60) % 60,
        l = Math.round(-(60 * d(a.timeZone, a))) % 60
      ;(l || k) &&
        (a.internal.setUTCSeconds(a.internal.getUTCSeconds() + l),
        Date.prototype.setUTCSeconds.call(a, Date.prototype.getUTCSeconds.call(a) + l + k))
      let m = d(a.timeZone, a),
        n = m > 0 ? Math.floor(m) : Math.ceil(m),
        o = -new Date(+a).getTimezoneOffset() - n - i
      if (n !== c && o) {
        Date.prototype.setUTCMinutes.call(a, Date.prototype.getUTCMinutes.call(a) + o)
        let b = d(a.timeZone, a),
          c = n - (b > 0 ? Math.floor(b) : Math.ceil(b))
        c &&
          (a.internal.setUTCMinutes(a.internal.getUTCMinutes() + c),
          Date.prototype.setUTCMinutes.call(a, Date.prototype.getUTCMinutes.call(a) + c))
      }
    }
    Object.getOwnPropertyNames(Date.prototype).forEach((a) => {
      if (!h.test(a)) return
      let b = a.replace(h, '$1UTC')
      g.prototype[b] &&
        (a.startsWith('get')
          ? (g.prototype[a] = function () {
              return this.internal[b]()
            })
          : ((g.prototype[a] = function () {
              var a
              return (
                Date.prototype[b].apply(this.internal, arguments),
                (a = this),
                Date.prototype.setFullYear.call(
                  a,
                  a.internal.getUTCFullYear(),
                  a.internal.getUTCMonth(),
                  a.internal.getUTCDate()
                ),
                Date.prototype.setHours.call(
                  a,
                  a.internal.getUTCHours(),
                  a.internal.getUTCMinutes(),
                  a.internal.getUTCSeconds(),
                  a.internal.getUTCMilliseconds()
                ),
                j(a),
                +this
              )
            }),
            (g.prototype[b] = function () {
              return (Date.prototype[b].apply(this, arguments), i(this), +this)
            })))
    })
    class k extends g {
      static tz(a, ...b) {
        return b.length ? new k(...b, a) : new k(Date.now(), a)
      }
      toISOString() {
        let [a, b, c] = this.tzComponents(),
          d = `${a}${b}:${c}`
        return this.internal.toISOString().slice(0, -1) + d
      }
      toString() {
        return `${this.toDateString()} ${this.toTimeString()}`
      }
      toDateString() {
        let [a, b, c, d] = this.internal.toUTCString().split(' ')
        return `${a?.slice(0, -1)} ${c} ${b} ${d}`
      }
      toTimeString() {
        let a = this.internal.toUTCString().split(' ')[4],
          [b, c, d] = this.tzComponents()
        return `${a} GMT${b}${c}${d} (${(function (a, b, c = 'long') {
          return new Intl.DateTimeFormat('en-US', { hour: 'numeric', timeZone: a, timeZoneName: c })
            .format(b)
            .split(/\s/g)
            .slice(2)
            .join(' ')
        })(this.timeZone, this)})`
      }
      toLocaleString(a, b) {
        return Date.prototype.toLocaleString.call(this, a, {
          ...b,
          timeZone: b?.timeZone || this.timeZone,
        })
      }
      toLocaleDateString(a, b) {
        return Date.prototype.toLocaleDateString.call(this, a, {
          ...b,
          timeZone: b?.timeZone || this.timeZone,
        })
      }
      toLocaleTimeString(a, b) {
        return Date.prototype.toLocaleTimeString.call(this, a, {
          ...b,
          timeZone: b?.timeZone || this.timeZone,
        })
      }
      tzComponents() {
        let a = this.getTimezoneOffset(),
          b = String(Math.floor(Math.abs(a) / 60)).padStart(2, '0'),
          c = String(Math.abs(a) % 60).padStart(2, '0')
        return [a > 0 ? '-' : '+', b, c]
      }
      withTimeZone(a) {
        return new k(+this, a)
      }
      [Symbol.for('constructDateFrom')](a) {
        return new k(+new Date(a), this.timeZone)
      }
    }
    ;(a.s(['TZDate', () => k], 751041), a.s([], 835262))
  },
  986451,
  275632,
  133885,
  238124,
  359326,
  167497,
  65052,
  37756,
  322658,
  717869,
  331882,
  885736,
  189766,
  (a) => {
    'use strict'
    var b = a.i(42724),
      c = a.i(774016)
    function d(a, d, e) {
      let f = (0, c.toDate)(a, e?.in)
      if (isNaN(d)) return (0, b.constructFrom)(e?.in || a, NaN)
      if (!d) return f
      let g = f.getDate(),
        h = (0, b.constructFrom)(e?.in || a, f.getTime())
      return (h.setMonth(f.getMonth() + d + 1, 0), g >= h.getDate())
        ? h
        : (f.setFullYear(h.getFullYear(), h.getMonth(), g), f)
    }
    a.s(['addMonths', () => d], 986451)
    var e = a.i(277421)
    function f(a, b, c) {
      return (0, e.addDays)(a, 7 * b, c)
    }
    function g(a, b, c) {
      return d(a, 12 * b, c)
    }
    ;(a.s(['addWeeks', () => f], 275632), a.s(['addYears', () => g], 133885))
    var h = a.i(57270)
    function i(a, b, c) {
      let [d, e] = (0, h.normalizeDates)(c?.in, a, b)
      return 12 * (d.getFullYear() - e.getFullYear()) + (d.getMonth() - e.getMonth())
    }
    function j(a, b) {
      let [c, d] = (0, h.normalizeDates)(a, b.start, b.end)
      return { start: c, end: d }
    }
    function k(a, c) {
      let { start: d, end: e } = j(c?.in, a),
        f = +d > +e,
        g = f ? +d : +e,
        h = f ? e : d
      ;(h.setHours(0, 0, 0, 0), h.setDate(1))
      let i = c?.step ?? 1
      if (!i) return []
      i < 0 && ((i = -i), (f = !f))
      let k = []
      for (; +h <= g; ) (k.push((0, b.constructFrom)(d, h)), h.setMonth(h.getMonth() + i))
      return f ? k.reverse() : k
    }
    function l(a, c) {
      let { start: d, end: e } = j(c?.in, a),
        f = +d > +e,
        g = f ? +d : +e,
        h = f ? e : d
      ;(h.setHours(0, 0, 0, 0), h.setMonth(0, 1))
      let i = c?.step ?? 1
      if (!i) return []
      i < 0 && ((i = -i), (f = !f))
      let k = []
      for (; +h <= g; ) (k.push((0, b.constructFrom)(d, h)), h.setFullYear(h.getFullYear() + i))
      return f ? k.reverse() : k
    }
    ;(a.s(['differenceInCalendarMonths', () => i], 238124),
      a.s(['eachMonthOfInterval', () => k], 359326),
      a.s(['eachYearOfInterval', () => l], 167497))
    var m = a.i(852587)
    function n(a, b) {
      let d = (0, m.getDefaultOptions)(),
        e =
          b?.weekStartsOn ??
          b?.locale?.options?.weekStartsOn ??
          d.weekStartsOn ??
          d.locale?.options?.weekStartsOn ??
          0,
        f = (0, c.toDate)(a, b?.in),
        g = f.getDay()
      return (
        f.setDate(f.getDate() + ((g < e ? -7 : 0) + 6 - (g - e))),
        f.setHours(23, 59, 59, 999),
        f
      )
    }
    function o(a, b) {
      return n(a, { ...b, weekStartsOn: 1 })
    }
    function p(a, b) {
      let d = (0, c.toDate)(a, b?.in),
        e = d.getMonth()
      return (d.setFullYear(d.getFullYear(), e + 1, 0), d.setHours(23, 59, 59, 999), d)
    }
    function q(a, b) {
      let d = (0, c.toDate)(a, b?.in),
        e = d.getFullYear()
      return (d.setFullYear(e + 1, 0, 0), d.setHours(23, 59, 59, 999), d)
    }
    function r(a, b) {
      return (0, c.toDate)(a, b?.in).getMonth()
    }
    function s(a, b) {
      return (0, c.toDate)(a, b?.in).getFullYear()
    }
    function t(a, b) {
      return +(0, c.toDate)(a) > +(0, c.toDate)(b)
    }
    ;(a.s(['endOfWeek', () => n], 65052),
      a.s(['endOfISOWeek', () => o], 37756),
      a.s(['endOfMonth', () => p], 322658),
      a.s(['endOfYear', () => q], 717869),
      a.s(['getMonth', () => r], 331882),
      a.s(['getYear', () => s], 885736),
      a.s(['isAfter', () => t], 189766))
  },
  320146,
  (a) => {
    'use strict'
    var b,
      c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      k,
      l = a.i(187924),
      m = a.i(256711),
      n = a.i(302491),
      o = a.i(572131),
      p = a.i(177991),
      q = a.i(281643),
      r = a.i(352254)
    a.i(835262)
    var s = a.i(751041),
      t = a.i(277421),
      u = a.i(986451),
      v = a.i(275632),
      w = a.i(133885),
      x = a.i(87685),
      y = a.i(238124),
      z = a.i(359326),
      A = a.i(167497),
      B = a.i(37756),
      C = a.i(322658),
      D = a.i(65052),
      E = a.i(717869),
      F = a.i(182199),
      G = a.i(331882),
      H = a.i(982888),
      I = a.i(885736),
      J = a.i(189766),
      K = a.i(35596),
      L = a.i(924785),
      M = a.i(57270),
      N = a.i(367638),
      O = a.i(42724),
      P = a.i(774016),
      Q = a.i(830560),
      R = a.i(609635),
      S = a.i(275218),
      T = a.i(97117)
    function U(a, b) {
      let c = b.startOfMonth(a),
        d = c.getDay()
      return 1 === d ? c : 0 === d ? b.addDays(c, -6) : b.addDays(c, -1 * (d - 1))
    }
    class V {
      constructor(a, b) {
        ;((this.Date = Date),
          (this.today = () =>
            this.overrides?.today
              ? this.overrides.today()
              : this.options.timeZone
                ? s.TZDate.tz(this.options.timeZone)
                : new this.Date()),
          (this.newDate = (a, b, c) =>
            this.overrides?.newDate
              ? this.overrides.newDate(a, b, c)
              : this.options.timeZone
                ? new s.TZDate(a, b, c, this.options.timeZone)
                : new Date(a, b, c)),
          (this.addDays = (a, b) =>
            this.overrides?.addDays ? this.overrides.addDays(a, b) : (0, t.addDays)(a, b)),
          (this.addMonths = (a, b) =>
            this.overrides?.addMonths ? this.overrides.addMonths(a, b) : (0, u.addMonths)(a, b)),
          (this.addWeeks = (a, b) =>
            this.overrides?.addWeeks ? this.overrides.addWeeks(a, b) : (0, v.addWeeks)(a, b)),
          (this.addYears = (a, b) =>
            this.overrides?.addYears ? this.overrides.addYears(a, b) : (0, w.addYears)(a, b)),
          (this.differenceInCalendarDays = (a, b) =>
            this.overrides?.differenceInCalendarDays
              ? this.overrides.differenceInCalendarDays(a, b)
              : (0, x.differenceInCalendarDays)(a, b)),
          (this.differenceInCalendarMonths = (a, b) =>
            this.overrides?.differenceInCalendarMonths
              ? this.overrides.differenceInCalendarMonths(a, b)
              : (0, y.differenceInCalendarMonths)(a, b)),
          (this.eachMonthOfInterval = (a) =>
            this.overrides?.eachMonthOfInterval
              ? this.overrides.eachMonthOfInterval(a)
              : (0, z.eachMonthOfInterval)(a)),
          (this.eachYearOfInterval = (a) => {
            let b = this.overrides?.eachYearOfInterval
                ? this.overrides.eachYearOfInterval(a)
                : (0, A.eachYearOfInterval)(a),
              c = new Set(b.map((a) => this.getYear(a)))
            if (c.size === b.length) return b
            let d = []
            return (
              c.forEach((a) => {
                d.push(new Date(a, 0, 1))
              }),
              d
            )
          }),
          (this.endOfBroadcastWeek = (a) => {
            let b, c, d, e, f, g
            return this.overrides?.endOfBroadcastWeek
              ? this.overrides.endOfBroadcastWeek(a)
              : ((b = U(a, this)),
                (d = (c = this.startOfMonth(a)).getDay() > 0 ? c.getDay() : 7),
                (e = this.addDays(a, -d + 1)),
                (f = this.addDays(e, 34)),
                (g = this.getMonth(a) === this.getMonth(f) ? 5 : 4),
                this.addDays(b, 7 * g - 1))
          }),
          (this.endOfISOWeek = (a) =>
            this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(a) : (0, B.endOfISOWeek)(a)),
          (this.endOfMonth = (a) =>
            this.overrides?.endOfMonth ? this.overrides.endOfMonth(a) : (0, C.endOfMonth)(a)),
          (this.endOfWeek = (a, b) =>
            this.overrides?.endOfWeek
              ? this.overrides.endOfWeek(a, b)
              : (0, D.endOfWeek)(a, this.options)),
          (this.endOfYear = (a) =>
            this.overrides?.endOfYear ? this.overrides.endOfYear(a) : (0, E.endOfYear)(a)),
          (this.format = (a, b, c) => {
            let d = this.overrides?.format
              ? this.overrides.format(a, b, this.options)
              : (0, m.format)(a, b, this.options)
            return this.options.numerals && 'latn' !== this.options.numerals
              ? this.replaceDigits(d)
              : d
          }),
          (this.getISOWeek = (a) =>
            this.overrides?.getISOWeek ? this.overrides.getISOWeek(a) : (0, F.getISOWeek)(a)),
          (this.getMonth = (a, b) =>
            this.overrides?.getMonth
              ? this.overrides.getMonth(a, this.options)
              : (0, G.getMonth)(a, this.options)),
          (this.getYear = (a, b) =>
            this.overrides?.getYear
              ? this.overrides.getYear(a, this.options)
              : (0, I.getYear)(a, this.options)),
          (this.getWeek = (a, b) =>
            this.overrides?.getWeek
              ? this.overrides.getWeek(a, this.options)
              : (0, H.getWeek)(a, this.options)),
          (this.isAfter = (a, b) =>
            this.overrides?.isAfter ? this.overrides.isAfter(a, b) : (0, J.isAfter)(a, b)),
          (this.isBefore = (a, b) =>
            this.overrides?.isBefore ? this.overrides.isBefore(a, b) : (0, K.isBefore)(a, b)),
          (this.isDate = (a) =>
            this.overrides?.isDate ? this.overrides.isDate(a) : (0, L.isDate)(a)),
          (this.isSameDay = (a, b) =>
            this.overrides?.isSameDay
              ? this.overrides.isSameDay(a, b)
              : (function (a, b, c) {
                  let [d, e] = (0, M.normalizeDates)(void 0, a, b)
                  return +(0, N.startOfDay)(d) == +(0, N.startOfDay)(e)
                })(a, b)),
          (this.isSameMonth = (a, b) =>
            this.overrides?.isSameMonth
              ? this.overrides.isSameMonth(a, b)
              : (function (a, b, c) {
                  let [d, e] = (0, M.normalizeDates)(void 0, a, b)
                  return d.getFullYear() === e.getFullYear() && d.getMonth() === e.getMonth()
                })(a, b)),
          (this.isSameYear = (a, b) =>
            this.overrides?.isSameYear
              ? this.overrides.isSameYear(a, b)
              : (function (a, b, c) {
                  let [d, e] = (0, M.normalizeDates)(void 0, a, b)
                  return d.getFullYear() === e.getFullYear()
                })(a, b)),
          (this.max = (a) => {
            let b, c
            return this.overrides?.max
              ? this.overrides.max(a)
              : ((c = void 0),
                a.forEach((a) => {
                  c || 'object' != typeof a || (c = O.constructFrom.bind(null, a))
                  let d = (0, P.toDate)(a, c)
                  ;(!b || b < d || isNaN(+d)) && (b = d)
                }),
                (0, O.constructFrom)(c, b || NaN))
          }),
          (this.min = (a) => {
            let b, c
            return this.overrides?.min
              ? this.overrides.min(a)
              : ((c = void 0),
                a.forEach((a) => {
                  c || 'object' != typeof a || (c = O.constructFrom.bind(null, a))
                  let d = (0, P.toDate)(a, c)
                  ;(!b || b > d || isNaN(+d)) && (b = d)
                }),
                (0, O.constructFrom)(c, b || NaN))
          }),
          (this.setMonth = (a, b) => {
            let c, d, e, f, g, h, i, j, k
            return this.overrides?.setMonth
              ? this.overrides.setMonth(a, b)
              : ((d = (c = (0, P.toDate)(a, void 0)).getFullYear()),
                (e = c.getDate()),
                (f = (0, O.constructFrom)(a, 0)).setFullYear(d, b, 15),
                f.setHours(0, 0, 0, 0),
                (h = (g = (0, P.toDate)(f, void 0)).getFullYear()),
                (i = g.getMonth()),
                (j = (0, O.constructFrom)(g, 0)).setFullYear(h, i + 1, 0),
                j.setHours(0, 0, 0, 0),
                (k = j.getDate()),
                c.setMonth(b, Math.min(e, k)),
                c)
          }),
          (this.setYear = (a, b) => {
            let c
            return this.overrides?.setYear
              ? this.overrides.setYear(a, b)
              : isNaN(+(c = (0, P.toDate)(a, void 0)))
                ? (0, O.constructFrom)(a, NaN)
                : (c.setFullYear(b), c)
          }),
          (this.startOfBroadcastWeek = (a, b) =>
            this.overrides?.startOfBroadcastWeek
              ? this.overrides.startOfBroadcastWeek(a, this)
              : U(a, this)),
          (this.startOfDay = (a) =>
            this.overrides?.startOfDay ? this.overrides.startOfDay(a) : (0, N.startOfDay)(a)),
          (this.startOfISOWeek = (a) =>
            this.overrides?.startOfISOWeek
              ? this.overrides.startOfISOWeek(a)
              : (0, Q.startOfISOWeek)(a)),
          (this.startOfMonth = (a) => {
            let b
            return this.overrides?.startOfMonth
              ? this.overrides.startOfMonth(a)
              : ((b = (0, P.toDate)(a, void 0)).setDate(1), b.setHours(0, 0, 0, 0), b)
          }),
          (this.startOfWeek = (a, b) =>
            this.overrides?.startOfWeek
              ? this.overrides.startOfWeek(a, this.options)
              : (0, R.startOfWeek)(a, this.options)),
          (this.startOfYear = (a) =>
            this.overrides?.startOfYear ? this.overrides.startOfYear(a) : (0, S.startOfYear)(a)),
          (this.options = { locale: T.enUS, ...a }),
          (this.overrides = b))
      }
      getDigitMap() {
        let { numerals: a = 'latn' } = this.options,
          b = new Intl.NumberFormat('en-US', { numberingSystem: a }),
          c = {}
        for (let a = 0; a < 10; a++) c[a.toString()] = b.format(a)
        return c
      }
      replaceDigits(a) {
        let b = this.getDigitMap()
        return a.replace(/\d/g, (a) => b[a] || a)
      }
      formatNumber(a) {
        return this.replaceDigits(a.toString())
      }
      getMonthYearOrder() {
        let a = this.options.locale?.code
        return a && V.yearFirstLocales.has(a) ? 'year-first' : 'month-first'
      }
      formatMonthYear(a) {
        let { locale: b, timeZone: c, numerals: d } = this.options,
          e = b?.code
        if (e && V.yearFirstLocales.has(e))
          try {
            return new Intl.DateTimeFormat(e, {
              month: 'long',
              year: 'numeric',
              timeZone: c,
              numberingSystem: d,
            }).format(a)
          } catch {}
        let f = 'year-first' === this.getMonthYearOrder() ? 'y LLLL' : 'LLLL y'
        return this.format(a, f)
      }
    }
    V.yearFirstLocales = new Set([
      'eu',
      'hu',
      'ja',
      'ja-Hira',
      'ja-JP',
      'ko',
      'ko-KR',
      'lt',
      'lt-LT',
      'lv',
      'lv-LV',
      'mn',
      'mn-MN',
      'zh',
      'zh-CN',
      'zh-HK',
      'zh-TW',
    ])
    let W = new V()
    var X = a.i(244513)
    function Y(a, b, c = !1, d = W) {
      let { from: e, to: f } = a,
        { differenceInCalendarDays: g, isSameDay: h } = d
      return e && f
        ? (0 > g(f, e) && ([e, f] = [f, e]), g(b, e) >= +!!c && g(f, b) >= +!!c)
        : !c && f
          ? h(f, b)
          : !c && !!e && h(e, b)
    }
    function Z(a) {
      return !!(a && 'object' == typeof a && 'before' in a && 'after' in a)
    }
    function $(a) {
      return !!(a && 'object' == typeof a && 'from' in a)
    }
    function _(a) {
      return !!(a && 'object' == typeof a && 'after' in a)
    }
    function aa(a) {
      return !!(a && 'object' == typeof a && 'before' in a)
    }
    function ab(a) {
      return !!(a && 'object' == typeof a && 'dayOfWeek' in a)
    }
    function ac(a, b) {
      return Array.isArray(a) && a.every(b.isDate)
    }
    function ad(a, b, c = W) {
      let d = Array.isArray(b) ? b : [b],
        { isSameDay: e, differenceInCalendarDays: f, isAfter: g } = c
      return d.some((b) => {
        if ('boolean' == typeof b) return b
        if (c.isDate(b)) return e(a, b)
        if (ac(b, c)) return b.includes(a)
        if ($(b)) return Y(b, a, !1, c)
        if (ab(b))
          return Array.isArray(b.dayOfWeek)
            ? b.dayOfWeek.includes(a.getDay())
            : b.dayOfWeek === a.getDay()
        if (Z(b)) {
          let c = f(b.before, a),
            d = f(b.after, a),
            e = c > 0,
            h = d < 0
          return g(b.before, b.after) ? h && e : e || h
        }
        return _(b)
          ? f(a, b.after) > 0
          : aa(b)
            ? f(b.before, a) > 0
            : 'function' == typeof b && b(a)
      })
    }
    function ae(a) {
      return o.default.createElement('button', { ...a })
    }
    function af(a) {
      return o.default.createElement('span', { ...a })
    }
    function ag(a) {
      let { size: b = 24, orientation: c = 'left', className: d } = a
      return o.default.createElement(
        'svg',
        { className: d, width: b, height: b, viewBox: '0 0 24 24' },
        'up' === c &&
          o.default.createElement('polygon', {
            points: '6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28',
          }),
        'down' === c &&
          o.default.createElement('polygon', {
            points: '6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72',
          }),
        'left' === c &&
          o.default.createElement('polygon', {
            points: '16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20',
          }),
        'right' === c &&
          o.default.createElement('polygon', {
            points: '8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20',
          })
      )
    }
    function ah(a) {
      let { day: b, modifiers: c, ...d } = a
      return o.default.createElement('td', { ...d })
    }
    function ai(a) {
      let { day: b, modifiers: c, ...d } = a,
        e = o.default.useRef(null)
      return (
        o.default.useEffect(() => {
          c.focused && e.current?.focus()
        }, [c.focused]),
        o.default.createElement('button', { ref: e, ...d })
      )
    }
    function aj(a) {
      let { options: b, className: c, components: d, classNames: e, ...f } = a,
        h = [e[g.Dropdown], c].join(' '),
        i = b?.find(({ value: a }) => a === f.value)
      return o.default.createElement(
        'span',
        { 'data-disabled': f.disabled, className: e[g.DropdownRoot] },
        o.default.createElement(
          d.Select,
          { className: h, ...f },
          b?.map(({ value: a, label: b, disabled: c }) =>
            o.default.createElement(d.Option, { key: a, value: a, disabled: c }, b)
          )
        ),
        o.default.createElement(
          'span',
          { className: e[g.CaptionLabel], 'aria-hidden': !0 },
          i?.label,
          o.default.createElement(d.Chevron, {
            orientation: 'down',
            size: 18,
            className: e[g.Chevron],
          })
        )
      )
    }
    function ak(a) {
      return o.default.createElement('div', { ...a })
    }
    function al(a) {
      return o.default.createElement('div', { ...a })
    }
    function am(a) {
      let { calendarMonth: b, displayIndex: c, ...d } = a
      return o.default.createElement('div', { ...d }, a.children)
    }
    function an(a) {
      let { calendarMonth: b, displayIndex: c, ...d } = a
      return o.default.createElement('div', { ...d })
    }
    function ao(a) {
      return o.default.createElement('table', { ...a })
    }
    function ap(a) {
      return o.default.createElement('div', { ...a })
    }
    ;(((b = g || (g = {})).Root = 'root'),
      (b.Chevron = 'chevron'),
      (b.Day = 'day'),
      (b.DayButton = 'day_button'),
      (b.CaptionLabel = 'caption_label'),
      (b.Dropdowns = 'dropdowns'),
      (b.Dropdown = 'dropdown'),
      (b.DropdownRoot = 'dropdown_root'),
      (b.Footer = 'footer'),
      (b.MonthGrid = 'month_grid'),
      (b.MonthCaption = 'month_caption'),
      (b.MonthsDropdown = 'months_dropdown'),
      (b.Month = 'month'),
      (b.Months = 'months'),
      (b.Nav = 'nav'),
      (b.NextMonthButton = 'button_next'),
      (b.PreviousMonthButton = 'button_previous'),
      (b.Week = 'week'),
      (b.Weeks = 'weeks'),
      (b.Weekday = 'weekday'),
      (b.Weekdays = 'weekdays'),
      (b.WeekNumber = 'week_number'),
      (b.WeekNumberHeader = 'week_number_header'),
      (b.YearsDropdown = 'years_dropdown'),
      ((c = h || (h = {})).disabled = 'disabled'),
      (c.hidden = 'hidden'),
      (c.outside = 'outside'),
      (c.focused = 'focused'),
      (c.today = 'today'),
      ((d = i || (i = {})).range_end = 'range_end'),
      (d.range_middle = 'range_middle'),
      (d.range_start = 'range_start'),
      (d.selected = 'selected'),
      ((e = j || (j = {})).weeks_before_enter = 'weeks_before_enter'),
      (e.weeks_before_exit = 'weeks_before_exit'),
      (e.weeks_after_enter = 'weeks_after_enter'),
      (e.weeks_after_exit = 'weeks_after_exit'),
      (e.caption_after_enter = 'caption_after_enter'),
      (e.caption_after_exit = 'caption_after_exit'),
      (e.caption_before_enter = 'caption_before_enter'),
      (e.caption_before_exit = 'caption_before_exit'),
      a.s([], 466502),
      a.i(466502),
      a.s(['Button', () => ae], 303128),
      a.i(303128),
      a.s(['CaptionLabel', () => af], 458583),
      a.i(458583),
      a.s(['Chevron', () => ag], 885790),
      a.i(885790),
      a.s(['Day', () => ah], 144619),
      a.i(144619),
      a.s(['DayButton', () => ai], 471819),
      a.i(471819),
      a.s(['Dropdown', () => aj], 994006),
      a.i(994006),
      a.s(['DropdownNav', () => ak], 686466),
      a.i(686466),
      a.s(['Footer', () => al], 558575),
      a.i(558575),
      a.s(['Month', () => am], 719223),
      a.i(719223),
      a.s(['MonthCaption', () => an], 351380),
      a.i(351380),
      a.s(['MonthGrid', () => ao], 251710),
      a.i(251710),
      a.s(['Months', () => ap], 804630),
      a.i(804630))
    let aq = (0, o.createContext)(void 0)
    function ar() {
      let a = (0, o.useContext)(aq)
      if (void 0 === a) throw Error('useDayPicker() must be used within a custom component.')
      return a
    }
    function as(a) {
      let { components: b } = ar()
      return o.default.createElement(b.Dropdown, { ...a })
    }
    function at(a) {
      let { onPreviousClick: b, onNextClick: c, previousMonth: d, nextMonth: e, ...f } = a,
        {
          components: h,
          classNames: i,
          labels: { labelPrevious: j, labelNext: k },
        } = ar(),
        l = (0, o.useCallback)(
          (a) => {
            e && c?.(a)
          },
          [e, c]
        ),
        m = (0, o.useCallback)(
          (a) => {
            d && b?.(a)
          },
          [d, b]
        )
      return o.default.createElement(
        'nav',
        { ...f },
        o.default.createElement(
          h.PreviousMonthButton,
          {
            type: 'button',
            className: i[g.PreviousMonthButton],
            tabIndex: d ? void 0 : -1,
            'aria-disabled': !d || void 0,
            'aria-label': j(d),
            onClick: m,
          },
          o.default.createElement(h.Chevron, {
            disabled: !d || void 0,
            className: i[g.Chevron],
            orientation: 'left',
          })
        ),
        o.default.createElement(
          h.NextMonthButton,
          {
            type: 'button',
            className: i[g.NextMonthButton],
            tabIndex: e ? void 0 : -1,
            'aria-disabled': !e || void 0,
            'aria-label': k(e),
            onClick: l,
          },
          o.default.createElement(h.Chevron, {
            disabled: !e || void 0,
            orientation: 'right',
            className: i[g.Chevron],
          })
        )
      )
    }
    function au(a) {
      let { components: b } = ar()
      return o.default.createElement(b.Button, { ...a })
    }
    function av(a) {
      return o.default.createElement('option', { ...a })
    }
    function aw(a) {
      let { components: b } = ar()
      return o.default.createElement(b.Button, { ...a })
    }
    function ax(a) {
      let { rootRef: b, ...c } = a
      return o.default.createElement('div', { ...c, ref: b })
    }
    function ay(a) {
      return o.default.createElement('select', { ...a })
    }
    function az(a) {
      let { week: b, ...c } = a
      return o.default.createElement('tr', { ...c })
    }
    function aA(a) {
      return o.default.createElement('th', { ...a })
    }
    function aB(a) {
      return o.default.createElement(
        'thead',
        { 'aria-hidden': !0 },
        o.default.createElement('tr', { ...a })
      )
    }
    function aC(a) {
      let { week: b, ...c } = a
      return o.default.createElement('th', { ...c })
    }
    function aD(a) {
      return o.default.createElement('th', { ...a })
    }
    function aE(a) {
      return o.default.createElement('tbody', { ...a })
    }
    function aF(a) {
      let { components: b } = ar()
      return o.default.createElement(b.Dropdown, { ...a })
    }
    ;(a.s(['MonthsDropdown', () => as], 509474),
      a.i(509474),
      a.s(['Nav', () => at], 654844),
      a.i(654844),
      a.s(['NextMonthButton', () => au], 787701),
      a.i(787701),
      a.s(['Option', () => av], 642382),
      a.i(642382),
      a.s(['PreviousMonthButton', () => aw], 541402),
      a.i(541402),
      a.s(['Root', () => ax], 200312),
      a.i(200312),
      a.s(['Select', () => ay], 852619),
      a.i(852619),
      a.s(['Week', () => az], 3095),
      a.i(3095),
      a.s(['Weekday', () => aA], 387721),
      a.i(387721),
      a.s(['Weekdays', () => aB], 506406),
      a.i(506406),
      a.s(['WeekNumber', () => aC], 910892),
      a.i(910892),
      a.s(['WeekNumberHeader', () => aD], 90154),
      a.i(90154),
      a.s(['Weeks', () => aE], 562942),
      a.i(562942),
      a.s(['YearsDropdown', () => aF], 727110),
      a.i(727110),
      a.s(
        [
          'Button',
          () => ae,
          'CaptionLabel',
          () => af,
          'Chevron',
          () => ag,
          'Day',
          () => ah,
          'DayButton',
          () => ai,
          'Dropdown',
          () => aj,
          'DropdownNav',
          () => ak,
          'Footer',
          () => al,
          'Month',
          () => am,
          'MonthCaption',
          () => an,
          'MonthGrid',
          () => ao,
          'Months',
          () => ap,
          'MonthsDropdown',
          () => as,
          'Nav',
          () => at,
          'NextMonthButton',
          () => au,
          'Option',
          () => av,
          'PreviousMonthButton',
          () => aw,
          'Root',
          () => ax,
          'Select',
          () => ay,
          'Week',
          () => az,
          'WeekNumber',
          () => aC,
          'WeekNumberHeader',
          () => aD,
          'Weekday',
          () => aA,
          'Weekdays',
          () => aB,
          'Weeks',
          () => aE,
          'YearsDropdown',
          () => aF,
        ],
        30952
      ))
    var aG = a.i(30952)
    function aH() {
      let a = {}
      for (let b in g) a[g[b]] = `rdp-${g[b]}`
      for (let b in h) a[h[b]] = `rdp-${h[b]}`
      for (let b in i) a[i[b]] = `rdp-${i[b]}`
      for (let b in j) a[j[b]] = `rdp-${j[b]}`
      return a
    }
    function aI(a, b, c) {
      return (c ?? new V(b)).formatMonthYear(a)
    }
    function aJ(a, b, c) {
      return (c ?? new V(b)).format(a, 'd')
    }
    function aK(a, b = W) {
      return b.format(a, 'LLLL')
    }
    function aL(a, b, c) {
      return (c ?? new V(b)).format(a, 'cccccc')
    }
    function aM(a, b = W) {
      return a < 10
        ? b.formatNumber(`0${a.toLocaleString()}`)
        : b.formatNumber(`${a.toLocaleString()}`)
    }
    function aN() {
      return ''
    }
    function aO(a, b = W) {
      return b.format(a, 'yyyy')
    }
    ;(a.s([], 764652),
      a.i(764652),
      a.s(['formatCaption', () => aI, 'formatMonthCaption', 0, aI], 400029),
      a.i(400029),
      a.s(['formatDay', () => aJ], 882648),
      a.i(882648),
      a.s(['formatMonthDropdown', () => aK], 404156),
      a.i(404156),
      a.s(['formatWeekdayName', () => aL], 979596),
      a.i(979596),
      a.s(['formatWeekNumber', () => aM], 900991),
      a.i(900991),
      a.s(['formatWeekNumberHeader', () => aN], 451973),
      a.i(451973),
      a.s(['formatYearCaption', 0, aO, 'formatYearDropdown', () => aO], 168113),
      a.i(168113),
      a.s(
        [
          'formatCaption',
          () => aI,
          'formatDay',
          () => aJ,
          'formatMonthCaption',
          0,
          aI,
          'formatMonthDropdown',
          () => aK,
          'formatWeekNumber',
          () => aM,
          'formatWeekNumberHeader',
          () => aN,
          'formatWeekdayName',
          () => aL,
          'formatYearCaption',
          0,
          aO,
          'formatYearDropdown',
          () => aO,
        ],
        51780
      ))
    var aP = a.i(51780)
    function aQ(a, b, c, d) {
      let e = (d ?? new V(c)).format(a, 'PPPP')
      return (b.today && (e = `Today, ${e}`), b.selected && (e = `${e}, selected`), e)
    }
    function aR(a, b, c) {
      return (c ?? new V(b)).formatMonthYear(a)
    }
    function aS(a, b, c, d) {
      let e = (d ?? new V(c)).format(a, 'PPPP')
      return (b?.today && (e = `Today, ${e}`), e)
    }
    function aT(a) {
      return 'Choose the Month'
    }
    function aU() {
      return ''
    }
    function aV(a) {
      return 'Go to the Next Month'
    }
    function aW(a) {
      return 'Go to the Previous Month'
    }
    function aX(a, b, c) {
      return (c ?? new V(b)).format(a, 'cccc')
    }
    function aY(a, b) {
      return `Week ${a}`
    }
    function aZ(a) {
      return 'Week Number'
    }
    function a$(a) {
      return 'Choose the Year'
    }
    ;(a.s([], 339326),
      a.i(339326),
      a.s(['labelDay', 0, aQ, 'labelDayButton', () => aQ], 313681),
      a.i(313681),
      a.s(['labelCaption', 0, aR, 'labelGrid', () => aR], 654471),
      a.i(654471),
      a.s(['labelGridcell', () => aS], 717011),
      a.i(717011),
      a.s(['labelMonthDropdown', () => aT], 459538),
      a.i(459538),
      a.s(['labelNav', () => aU], 123700),
      a.i(123700),
      a.s(['labelNext', () => aV], 107901),
      a.i(107901),
      a.s(['labelPrevious', () => aW], 6162),
      a.i(6162),
      a.s(['labelWeekday', () => aX], 883894),
      a.i(883894),
      a.s(['labelWeekNumber', () => aY], 264272),
      a.i(264272),
      a.s(['labelWeekNumberHeader', () => aZ], 294704),
      a.i(294704),
      a.s(['labelYearDropdown', () => a$], 320630),
      a.i(320630),
      a.s(
        [
          'labelCaption',
          0,
          aR,
          'labelDay',
          0,
          aQ,
          'labelDayButton',
          () => aQ,
          'labelGrid',
          () => aR,
          'labelGridcell',
          () => aS,
          'labelMonthDropdown',
          () => aT,
          'labelNav',
          () => aU,
          'labelNext',
          () => aV,
          'labelPrevious',
          () => aW,
          'labelWeekNumber',
          () => aY,
          'labelWeekNumberHeader',
          () => aZ,
          'labelWeekday',
          () => aX,
          'labelYearDropdown',
          () => a$,
        ],
        533698
      ))
    var a_ = a.i(533698)
    let a0 = (a) => (a instanceof HTMLElement ? a : null),
      a1 = (a) => [...(a.querySelectorAll('[data-animated-month]') ?? [])],
      a2 = (a) => a0(a.querySelector('[data-animated-caption]')),
      a3 = (a) => a0(a.querySelector('[data-animated-weeks]'))
    function a4(a, b, c, d) {
      let { month: e, defaultMonth: f, today: g = d.today(), numberOfMonths: h = 1 } = a,
        i = e || f || g,
        { differenceInCalendarMonths: j, addMonths: k, startOfMonth: l } = d
      return (c && j(c, i) < h - 1 && (i = k(c, -1 * (h - 1))), b && 0 > j(i, b) && (i = b), l(i))
    }
    class a5 {
      constructor(a, b, c = W) {
        ;((this.date = a),
          (this.displayMonth = b),
          (this.outside = !!(b && !c.isSameMonth(a, b))),
          (this.dateLib = c))
      }
      isEqualTo(a) {
        return (
          this.dateLib.isSameDay(a.date, this.date) &&
          this.dateLib.isSameMonth(a.displayMonth, this.displayMonth)
        )
      }
    }
    class a6 {
      constructor(a, b) {
        ;((this.date = a), (this.weeks = b))
      }
    }
    class a7 {
      constructor(a, b) {
        ;((this.days = b), (this.weekNumber = a))
      }
    }
    function a8(a, b) {
      let [c, d] = (0, o.useState)(a)
      return [void 0 === b ? c : b, d]
    }
    function a9(a) {
      return !a[h.disabled] && !a[h.hidden] && !a[h.outside]
    }
    function ba(a, b, c = W) {
      return Y(a, b.from, !1, c) || Y(a, b.to, !1, c) || Y(b, a.from, !1, c) || Y(b, a.to, !1, c)
    }
    function bb(a) {
      var b
      let c,
        d = a
      d.timeZone &&
        ((d = { ...a }).today && (d.today = new s.TZDate(d.today, d.timeZone)),
        d.month && (d.month = new s.TZDate(d.month, d.timeZone)),
        d.defaultMonth && (d.defaultMonth = new s.TZDate(d.defaultMonth, d.timeZone)),
        d.startMonth && (d.startMonth = new s.TZDate(d.startMonth, d.timeZone)),
        d.endMonth && (d.endMonth = new s.TZDate(d.endMonth, d.timeZone)),
        'single' === d.mode && d.selected
          ? (d.selected = new s.TZDate(d.selected, d.timeZone))
          : 'multiple' === d.mode && d.selected
            ? (d.selected = d.selected?.map((a) => new s.TZDate(a, d.timeZone)))
            : 'range' === d.mode &&
              d.selected &&
              (d.selected = {
                from: d.selected.from ? new s.TZDate(d.selected.from, d.timeZone) : void 0,
                to: d.selected.to ? new s.TZDate(d.selected.to, d.timeZone) : void 0,
              }))
      let {
          components: e,
          formatters: f,
          labels: l,
          dateLib: m,
          locale: n,
          classNames: p,
        } = (0, o.useMemo)(() => {
          var a, b
          let c = { ...X.defaultLocale, ...d.locale }
          return {
            dateLib: new V(
              {
                locale: c,
                weekStartsOn: d.broadcastCalendar ? 1 : d.weekStartsOn,
                firstWeekContainsDate: d.firstWeekContainsDate,
                useAdditionalWeekYearTokens: d.useAdditionalWeekYearTokens,
                useAdditionalDayOfYearTokens: d.useAdditionalDayOfYearTokens,
                timeZone: d.timeZone,
                numerals: d.numerals,
              },
              d.dateLib
            ),
            components: ((a = d.components), { ...aG, ...a }),
            formatters:
              ((b = d.formatters),
              b?.formatMonthCaption && !b.formatCaption && (b.formatCaption = b.formatMonthCaption),
              b?.formatYearCaption &&
                !b.formatYearDropdown &&
                (b.formatYearDropdown = b.formatYearCaption),
              { ...aP, ...b }),
            labels: { ...a_, ...d.labels },
            locale: c,
            classNames: { ...aH(), ...d.classNames },
          }
        }, [
          d.locale,
          d.broadcastCalendar,
          d.weekStartsOn,
          d.firstWeekContainsDate,
          d.useAdditionalWeekYearTokens,
          d.useAdditionalDayOfYearTokens,
          d.timeZone,
          d.numerals,
          d.dateLib,
          d.components,
          d.formatters,
          d.labels,
          d.classNames,
        ]),
        {
          captionLayout: q,
          mode: r,
          navLayout: t,
          numberOfMonths: u = 1,
          onDayBlur: v,
          onDayClick: w,
          onDayFocus: x,
          onDayKeyDown: y,
          onDayMouseEnter: z,
          onDayMouseLeave: A,
          onNextClick: B,
          onPrevClick: C,
          showWeekNumber: D,
          styles: E,
        } = d,
        {
          formatCaption: F,
          formatDay: G,
          formatMonthDropdown: H,
          formatWeekNumber: I,
          formatWeekNumberHeader: J,
          formatWeekdayName: K,
          formatYearDropdown: L,
        } = f,
        M = (function (a, b) {
          let c,
            [d, e] = (function (a, b) {
              let { startMonth: c, endMonth: d } = a,
                {
                  startOfYear: e,
                  startOfDay: f,
                  startOfMonth: g,
                  endOfMonth: h,
                  addYears: i,
                  endOfYear: j,
                  newDate: k,
                  today: l,
                } = b,
                { fromYear: m, toYear: n, fromMonth: o, toMonth: p } = a
              ;(!c && o && (c = o),
                !c && m && (c = b.newDate(m, 0, 1)),
                !d && p && (d = p),
                !d && n && (d = k(n, 11, 31)))
              let q = 'dropdown' === a.captionLayout || 'dropdown-years' === a.captionLayout
              return (
                c ? (c = g(c)) : m ? (c = k(m, 0, 1)) : !c && q && (c = e(i(a.today ?? l(), -100))),
                d ? (d = h(d)) : n ? (d = k(n, 11, 31)) : !d && q && (d = j(a.today ?? l())),
                [c ? f(c) : c, d ? f(d) : d]
              )
            })(a, b),
            { startOfMonth: f, endOfMonth: g } = b,
            h = a4(a, d, e, b),
            [i, j] = a8(h, a.month ? h : void 0)
          ;(0, o.useEffect)(() => {
            j(a4(a, d, e, b))
          }, [a.timeZone])
          let k = (function (a, b, c, d) {
              let { numberOfMonths: e = 1 } = c,
                f = []
              for (let c = 0; c < e; c++) {
                let e = d.addMonths(a, c)
                if (b && e > b) break
                f.push(e)
              }
              return f
            })(i, e, a, b),
            l = (function (a, b, c, d) {
              let e = a[0],
                f = a[a.length - 1],
                { ISOWeek: g, fixedWeeks: h, broadcastCalendar: i } = c ?? {},
                {
                  addDays: j,
                  differenceInCalendarDays: k,
                  differenceInCalendarMonths: l,
                  endOfBroadcastWeek: m,
                  endOfISOWeek: n,
                  endOfMonth: o,
                  endOfWeek: p,
                  isAfter: q,
                  startOfBroadcastWeek: r,
                  startOfISOWeek: s,
                  startOfWeek: t,
                } = d,
                u = i ? r(e, d) : g ? s(e) : t(e),
                v = k(i ? m(f) : g ? n(o(f)) : p(o(f)), u),
                w = l(f, e) + 1,
                x = []
              for (let a = 0; a <= v; a++) {
                let c = j(u, a)
                if (b && q(c, b)) break
                x.push(c)
              }
              let y = (i ? 35 : 42) * w
              if (h && x.length < y) {
                let a = y - x.length
                for (let b = 0; b < a; b++) {
                  let a = j(x[x.length - 1], 1)
                  x.push(a)
                }
              }
              return x
            })(k, a.endMonth ? g(a.endMonth) : void 0, a, b),
            m = (function (a, b, c, d) {
              let {
                  addDays: e,
                  endOfBroadcastWeek: f,
                  endOfISOWeek: g,
                  endOfMonth: h,
                  endOfWeek: i,
                  getISOWeek: j,
                  getWeek: k,
                  startOfBroadcastWeek: l,
                  startOfISOWeek: m,
                  startOfWeek: n,
                } = d,
                o = a.reduce((a, o) => {
                  let p = c.broadcastCalendar ? l(o, d) : c.ISOWeek ? m(o) : n(o),
                    q = c.broadcastCalendar ? f(o) : c.ISOWeek ? g(h(o)) : i(h(o)),
                    r = b.filter((a) => a >= p && a <= q),
                    s = c.broadcastCalendar ? 35 : 42
                  if (c.fixedWeeks && r.length < s) {
                    let a = b.filter((a) => {
                      let b = s - r.length
                      return a > q && a <= e(q, b)
                    })
                    r.push(...a)
                  }
                  let t = r.reduce((a, b) => {
                      let e = c.ISOWeek ? j(b) : k(b),
                        f = a.find((a) => a.weekNumber === e),
                        g = new a5(b, o, d)
                      return (f ? f.days.push(g) : a.push(new a7(e, [g])), a)
                    }, []),
                    u = new a6(o, t)
                  return (a.push(u), a)
                }, [])
              return c.reverseMonths ? o.reverse() : o
            })(k, l, a, b),
            n = m.reduce((a, b) => a.concat(b.weeks.slice()), []),
            p =
              ((c = []),
              m.reduce((a, b) => {
                let d = b.weeks.reduce((a, b) => a.concat(b.days.slice()), c.slice())
                return a.concat(d.slice())
              }, c.slice())),
            q = (function (a, b, c, d) {
              if (c.disableNavigation) return
              let { pagedNavigation: e, numberOfMonths: f } = c,
                { startOfMonth: g, addMonths: h, differenceInCalendarMonths: i } = d,
                j = g(a)
              if (!b || !(0 >= i(j, b))) return h(j, -(e ? (f ?? 1) : 1))
            })(i, d, a, b),
            r = (function (a, b, c, d) {
              if (c.disableNavigation) return
              let { pagedNavigation: e, numberOfMonths: f = 1 } = c,
                { startOfMonth: g, addMonths: h, differenceInCalendarMonths: i } = d,
                j = g(a)
              if (!b || !(i(b, a) < f)) return h(j, e ? f : 1)
            })(i, e, a, b),
            { disableNavigation: s, onMonthChange: t } = a,
            u = (a) => {
              if (s) return
              let b = f(a)
              ;(d && b < f(d) && (b = f(d)), e && b > f(e) && (b = f(e)), j(b), t?.(b))
            }
          return {
            months: m,
            weeks: n,
            days: p,
            navStart: d,
            navEnd: e,
            previousMonth: q,
            nextMonth: r,
            goToMonth: u,
            goToDay: (a) => {
              n.some((b) => b.days.some((b) => b.isEqualTo(a))) || u(a.date)
            },
          }
        })(d, m),
        {
          days: N,
          months: O,
          navStart: P,
          navEnd: Q,
          previousMonth: R,
          nextMonth: S,
          goToMonth: T,
        } = M,
        U = (function (a, b, c, d, e) {
          let {
              disabled: f,
              hidden: g,
              modifiers: i,
              showOutsideDays: j,
              broadcastCalendar: k,
              today: l,
            } = b,
            {
              isSameDay: m,
              isSameMonth: n,
              startOfMonth: o,
              isBefore: p,
              endOfMonth: q,
              isAfter: r,
            } = e,
            s = c && o(c),
            t = d && q(d),
            u = {
              [h.focused]: [],
              [h.outside]: [],
              [h.disabled]: [],
              [h.hidden]: [],
              [h.today]: [],
            },
            v = {}
          for (let b of a) {
            let { date: a, displayMonth: c } = b,
              d = !!(c && !n(a, c)),
              h = !!(s && p(a, s)),
              o = !!(t && r(a, t)),
              q = !!(f && ad(a, f, e)),
              w = !!(g && ad(a, g, e)) || h || o || (!k && !j && d) || (k && !1 === j && d),
              x = m(a, l ?? e.today())
            ;(d && u.outside.push(b),
              q && u.disabled.push(b),
              w && u.hidden.push(b),
              x && u.today.push(b),
              i &&
                Object.keys(i).forEach((c) => {
                  let d = i?.[c]
                  d && ad(a, d, e) && (v[c] ? v[c].push(b) : (v[c] = [b]))
                }))
          }
          return (a) => {
            let b = {
                [h.focused]: !1,
                [h.disabled]: !1,
                [h.hidden]: !1,
                [h.outside]: !1,
                [h.today]: !1,
              },
              c = {}
            for (let c in u) {
              let d = u[c]
              b[c] = d.some((b) => b === a)
            }
            for (let b in v) c[b] = v[b].some((b) => b === a)
            return { ...b, ...c }
          }
        })(N, d, P, Q, m),
        {
          isSelected: ae,
          select: af,
          selected: ag,
        } = (function (a, b) {
          let c = (function (a, b) {
              let { selected: c, required: d, onSelect: e } = a,
                [f, g] = a8(c, e ? c : void 0),
                h = e ? c : f,
                { isSameDay: i } = b
              return {
                selected: h,
                select: (a, b, c) => {
                  let f = a
                  return (!d && h && h && i(a, h) && (f = void 0), e || g(f), e?.(f, a, b, c), f)
                },
                isSelected: (a) => !!h && i(h, a),
              }
            })(a, b),
            d = (function (a, b) {
              let { selected: c, required: d, onSelect: e } = a,
                [f, g] = a8(c, e ? c : void 0),
                h = e ? c : f,
                { isSameDay: i } = b,
                j = (a) => h?.some((b) => i(b, a)) ?? !1,
                { min: k, max: l } = a
              return {
                selected: h,
                select: (a, b, c) => {
                  let f = [...(h ?? [])]
                  if (j(a)) {
                    if (h?.length === k || (d && h?.length === 1)) return
                    f = h?.filter((b) => !i(b, a))
                  } else f = h?.length === l ? [a] : [...f, a]
                  return (e || g(f), e?.(f, a, b, c), f)
                },
                isSelected: j,
              }
            })(a, b),
            e = (function (a, b) {
              let { disabled: c, excludeDisabled: d, selected: e, required: f, onSelect: g } = a,
                [h, i] = a8(e, g ? e : void 0),
                j = g ? e : h
              return {
                selected: j,
                select: (e, h, k) => {
                  let { min: l, max: m } = a,
                    n = e
                      ? (function (a, b, c = 0, d = 0, e = !1, f = W) {
                          let g,
                            { from: h, to: i } = b || {},
                            { isSameDay: j, isAfter: k, isBefore: l } = f
                          if (h || i) {
                            if (h && !i)
                              g = j(h, a)
                                ? 0 === c
                                  ? { from: h, to: a }
                                  : e
                                    ? { from: h, to: void 0 }
                                    : void 0
                                : l(a, h)
                                  ? { from: a, to: h }
                                  : { from: h, to: a }
                            else if (h && i)
                              if (j(h, a) && j(i, a)) g = e ? { from: h, to: i } : void 0
                              else if (j(h, a)) g = { from: h, to: c > 0 ? void 0 : a }
                              else if (j(i, a)) g = { from: a, to: c > 0 ? void 0 : a }
                              else if (l(a, h)) g = { from: a, to: i }
                              else if (k(a, h)) g = { from: h, to: a }
                              else if (k(a, i)) g = { from: h, to: a }
                              else throw Error('Invalid range')
                          } else g = { from: a, to: c > 0 ? void 0 : a }
                          if (g?.from && g?.to) {
                            let b = f.differenceInCalendarDays(g.to, g.from)
                            d > 0 && b > d
                              ? (g = { from: a, to: void 0 })
                              : c > 1 && b < c && (g = { from: a, to: void 0 })
                          }
                          return g
                        })(e, j, l, m, f, b)
                      : void 0
                  return (
                    d &&
                      c &&
                      n?.from &&
                      n.to &&
                      (function (a, b, c = W) {
                        let d = Array.isArray(b) ? b : [b]
                        if (
                          d
                            .filter((a) => 'function' != typeof a)
                            .some((b) =>
                              'boolean' == typeof b
                                ? b
                                : c.isDate(b)
                                  ? Y(a, b, !1, c)
                                  : ac(b, c)
                                    ? b.some((b) => Y(a, b, !1, c))
                                    : $(b)
                                      ? !!b.from && !!b.to && ba(a, { from: b.from, to: b.to }, c)
                                      : ab(b)
                                        ? (function (a, b, c = W) {
                                            let d = Array.isArray(b) ? b : [b],
                                              e = a.from,
                                              f = Math.min(
                                                c.differenceInCalendarDays(a.to, a.from),
                                                6
                                              )
                                            for (let a = 0; a <= f; a++) {
                                              if (d.includes(e.getDay())) return !0
                                              e = c.addDays(e, 1)
                                            }
                                            return !1
                                          })(a, b.dayOfWeek, c)
                                        : Z(b)
                                          ? c.isAfter(b.before, b.after)
                                            ? ba(
                                                a,
                                                {
                                                  from: c.addDays(b.after, 1),
                                                  to: c.addDays(b.before, -1),
                                                },
                                                c
                                              )
                                            : ad(a.from, b, c) || ad(a.to, b, c)
                                          : !!(_(b) || aa(b)) &&
                                            (ad(a.from, b, c) || ad(a.to, b, c))
                            )
                        )
                          return !0
                        let e = d.filter((a) => 'function' == typeof a)
                        if (e.length) {
                          let b = a.from,
                            d = c.differenceInCalendarDays(a.to, a.from)
                          for (let a = 0; a <= d; a++) {
                            if (e.some((a) => a(b))) return !0
                            b = c.addDays(b, 1)
                          }
                        }
                        return !1
                      })({ from: n.from, to: n.to }, c, b) &&
                      ((n.from = e), (n.to = void 0)),
                    g || i(n),
                    g?.(n, e, h, k),
                    n
                  )
                },
                isSelected: (a) => j && Y(j, a, !1, b),
              }
            })(a, b)
          switch (a.mode) {
            case 'single':
              return c
            case 'multiple':
              return d
            case 'range':
              return e
            default:
              return
          }
        })(d, m) ?? {},
        {
          blur: ah,
          focused: ai,
          isFocusTarget: aj,
          moveFocus: ak,
          setFocused: al,
        } = (function (a, b, c, d, e) {
          let { autoFocus: f } = a,
            [g, i] = (0, o.useState)(),
            j = (function (a, b, c, d) {
              let e,
                f = -1
              for (let g of a) {
                let a = b(g)
                a9(a) &&
                  (a[h.focused] && f < k.FocusedModifier
                    ? ((e = g), (f = k.FocusedModifier))
                    : d?.isEqualTo(g) && f < k.LastFocused
                      ? ((e = g), (f = k.LastFocused))
                      : c(g.date) && f < k.Selected
                        ? ((e = g), (f = k.Selected))
                        : a[h.today] && f < k.Today && ((e = g), (f = k.Today)))
              }
              return (e || (e = a.find((a) => a9(b(a)))), e)
            })(b.days, c, d || (() => !1), g),
            [l, m] = (0, o.useState)(f ? j : void 0)
          return {
            isFocusTarget: (a) => !!j?.isEqualTo(a),
            setFocused: m,
            focused: l,
            blur: () => {
              ;(i(l), m(void 0))
            },
            moveFocus: (c, d) => {
              if (!l) return
              let f = (function a(b, c, d, e, f, g, h, i = 0) {
                if (i > 365) return
                let j = (function (a, b, c, d, e, f, g) {
                    let { ISOWeek: h, broadcastCalendar: i } = f,
                      {
                        addDays: j,
                        addMonths: k,
                        addWeeks: l,
                        addYears: m,
                        endOfBroadcastWeek: n,
                        endOfISOWeek: o,
                        endOfWeek: p,
                        max: q,
                        min: r,
                        startOfBroadcastWeek: s,
                        startOfISOWeek: t,
                        startOfWeek: u,
                      } = g,
                      v = {
                        day: j,
                        week: l,
                        month: k,
                        year: m,
                        startOfWeek: (a) => (i ? s(a, g) : h ? t(a) : u(a)),
                        endOfWeek: (a) => (i ? n(a) : h ? o(a) : p(a)),
                      }[a](c, 'after' === b ? 1 : -1)
                    return (
                      'before' === b && d ? (v = q([d, v])) : 'after' === b && e && (v = r([e, v])),
                      v
                    )
                  })(b, c, d.date, e, f, g, h),
                  k = !!(g.disabled && ad(j, g.disabled, h)),
                  l = !!(g.hidden && ad(j, g.hidden, h)),
                  m = new a5(j, j, h)
                return k || l ? a(b, c, m, e, f, g, h, i + 1) : m
              })(c, d, l, b.navStart, b.navEnd, a, e)
              if (f) {
                if (a.disableNavigation && !b.days.some((a) => a.isEqualTo(f))) return
                ;(b.goToDay(f), m(f))
              }
            },
          }
        })(d, M, U, ae ?? (() => !1), m),
        {
          labelDayButton: am,
          labelGridcell: an,
          labelGrid: ao,
          labelMonthDropdown: ap,
          labelNav: ar,
          labelPrevious: as,
          labelNext: at,
          labelWeekday: au,
          labelWeekNumber: av,
          labelWeekNumberHeader: aw,
          labelYearDropdown: ax,
        } = l,
        ay = (0, o.useMemo)(
          () =>
            (function (a, b, c) {
              let d = a.today(),
                e = b ? a.startOfISOWeek(d) : a.startOfWeek(d),
                f = []
              for (let b = 0; b < 7; b++) {
                let c = a.addDays(e, b)
                f.push(c)
              }
              return f
            })(m, d.ISOWeek),
          [m, d.ISOWeek]
        ),
        az = void 0 !== r || void 0 !== w,
        aA = (0, o.useCallback)(() => {
          R && (T(R), C?.(R))
        }, [R, T, C]),
        aB = (0, o.useCallback)(() => {
          S && (T(S), B?.(S))
        }, [T, S, B]),
        aC = (0, o.useCallback)(
          (a, b) => (c) => {
            ;(c.preventDefault(), c.stopPropagation(), al(a), af?.(a.date, b, c), w?.(a.date, b, c))
          },
          [af, w, al]
        ),
        aD = (0, o.useCallback)(
          (a, b) => (c) => {
            ;(al(a), x?.(a.date, b, c))
          },
          [x, al]
        ),
        aE = (0, o.useCallback)(
          (a, b) => (c) => {
            ;(ah(), v?.(a.date, b, c))
          },
          [ah, v]
        ),
        aF = (0, o.useCallback)(
          (a, b) => (c) => {
            let e = {
              ArrowLeft: [c.shiftKey ? 'month' : 'day', 'rtl' === d.dir ? 'after' : 'before'],
              ArrowRight: [c.shiftKey ? 'month' : 'day', 'rtl' === d.dir ? 'before' : 'after'],
              ArrowDown: [c.shiftKey ? 'year' : 'week', 'after'],
              ArrowUp: [c.shiftKey ? 'year' : 'week', 'before'],
              PageUp: [c.shiftKey ? 'year' : 'month', 'before'],
              PageDown: [c.shiftKey ? 'year' : 'month', 'after'],
              Home: ['startOfWeek', 'before'],
              End: ['endOfWeek', 'after'],
            }
            if (e[c.key]) {
              ;(c.preventDefault(), c.stopPropagation())
              let [a, b] = e[c.key]
              ak(a, b)
            }
            y?.(a.date, b, c)
          },
          [ak, y, d.dir]
        ),
        aI = (0, o.useCallback)(
          (a, b) => (c) => {
            z?.(a.date, b, c)
          },
          [z]
        ),
        aJ = (0, o.useCallback)(
          (a, b) => (c) => {
            A?.(a.date, b, c)
          },
          [A]
        ),
        aK = (0, o.useCallback)(
          (a) => (b) => {
            let c = Number(b.target.value)
            T(m.setMonth(m.startOfMonth(a), c))
          },
          [m, T]
        ),
        aL = (0, o.useCallback)(
          (a) => (b) => {
            let c = Number(b.target.value)
            T(m.setYear(m.startOfMonth(a), c))
          },
          [m, T]
        ),
        { className: aM, style: aN } = (0, o.useMemo)(
          () => ({
            className: [p[g.Root], d.className].filter(Boolean).join(' '),
            style: { ...E?.[g.Root], ...d.style },
          }),
          [p, d.className, d.style, E]
        ),
        aO =
          ((c = {
            'data-mode': (b = d).mode ?? void 0,
            'data-required': 'required' in b ? b.required : void 0,
            'data-multiple-months': (b.numberOfMonths && b.numberOfMonths > 1) || void 0,
            'data-week-numbers': b.showWeekNumber || void 0,
            'data-broadcast-calendar': b.broadcastCalendar || void 0,
            'data-nav-layout': b.navLayout || void 0,
          }),
          Object.entries(b).forEach(([a, b]) => {
            a.startsWith('data-') && (c[a] = b)
          }),
          c),
        aQ = (0, o.useRef)(null)
      !(function (a, b, { classNames: c, months: d, focused: e, dateLib: f }) {
        let g = (0, o.useRef)(null),
          h = (0, o.useRef)(d),
          i = (0, o.useRef)(!1)
        ;(0, o.useLayoutEffect)(() => {
          let k = h.current
          if (
            ((h.current = d),
            !b ||
              !a.current ||
              !(a.current instanceof HTMLElement) ||
              0 === d.length ||
              0 === k.length ||
              d.length !== k.length)
          )
            return
          let l = f.isSameMonth(d[0].date, k[0].date),
            m = f.isAfter(d[0].date, k[0].date),
            n = m ? c[j.caption_after_enter] : c[j.caption_before_enter],
            o = m ? c[j.weeks_after_enter] : c[j.weeks_before_enter],
            p = g.current,
            q = a.current.cloneNode(!0)
          if (
            (q instanceof HTMLElement
              ? (a1(q).forEach((a) => {
                  if (!(a instanceof HTMLElement)) return
                  let b = a0(a.querySelector('[data-animated-month]'))
                  b && a.contains(b) && a.removeChild(b)
                  let c = a2(a)
                  c && c.classList.remove(n)
                  let d = a3(a)
                  d && d.classList.remove(o)
                }),
                (g.current = q))
              : (g.current = null),
            i.current || l || e)
          )
            return
          let r = p instanceof HTMLElement ? a1(p) : [],
            s = a1(a.current)
          if (
            s?.every((a) => a instanceof HTMLElement) &&
            r &&
            r.every((a) => a instanceof HTMLElement)
          ) {
            i.current = !0
            let b = []
            a.current.style.isolation = 'isolate'
            let d = a0(a.current.querySelector('[data-animated-nav]'))
            ;(d && (d.style.zIndex = '1'),
              s.forEach((e, f) => {
                let g = r[f]
                if (!g) return
                ;((e.style.position = 'relative'), (e.style.overflow = 'hidden'))
                let h = a2(e)
                h && h.classList.add(n)
                let k = a3(e)
                k && k.classList.add(o)
                let l = () => {
                  ;((i.current = !1),
                    a.current && (a.current.style.isolation = ''),
                    d && (d.style.zIndex = ''),
                    h && h.classList.remove(n),
                    k && k.classList.remove(o),
                    (e.style.position = ''),
                    (e.style.overflow = ''),
                    e.contains(g) && e.removeChild(g))
                }
                ;(b.push(l),
                  (g.style.pointerEvents = 'none'),
                  (g.style.position = 'absolute'),
                  (g.style.overflow = 'hidden'),
                  g.setAttribute('aria-hidden', 'true'))
                let p = a0(g.querySelector('[data-animated-weekdays]'))
                p && (p.style.opacity = '0')
                let q = a2(g)
                q &&
                  (q.classList.add(m ? c[j.caption_before_exit] : c[j.caption_after_exit]),
                  q.addEventListener('animationend', l))
                let s = a3(g)
                ;(s && s.classList.add(m ? c[j.weeks_before_exit] : c[j.weeks_after_exit]),
                  e.insertBefore(g, e.firstChild))
              }))
          }
        })
      })(aQ, !!d.animate, { classNames: p, months: O, focused: ai, dateLib: m })
      let aR = {
        dayPickerProps: d,
        selected: ag,
        select: af,
        isSelected: ae,
        months: O,
        nextMonth: S,
        previousMonth: R,
        goToMonth: T,
        getModifiers: U,
        components: e,
        classNames: p,
        styles: E,
        labels: l,
        formatters: f,
      }
      return o.default.createElement(
        aq.Provider,
        { value: aR },
        o.default.createElement(
          e.Root,
          {
            rootRef: d.animate ? aQ : void 0,
            className: aM,
            style: aN,
            dir: d.dir,
            id: d.id,
            lang: d.lang,
            nonce: d.nonce,
            title: d.title,
            role: d.role,
            'aria-label': d['aria-label'],
            'aria-labelledby': d['aria-labelledby'],
            ...aO,
          },
          o.default.createElement(
            e.Months,
            { className: p[g.Months], style: E?.[g.Months] },
            !d.hideNavigation &&
              !t &&
              o.default.createElement(e.Nav, {
                'data-animated-nav': d.animate ? 'true' : void 0,
                className: p[g.Nav],
                style: E?.[g.Nav],
                'aria-label': ar(),
                onPreviousClick: aA,
                onNextClick: aB,
                previousMonth: R,
                nextMonth: S,
              }),
            O.map((a, b) => {
              let c, j
              return o.default.createElement(
                e.Month,
                {
                  'data-animated-month': d.animate ? 'true' : void 0,
                  className: p[g.Month],
                  style: E?.[g.Month],
                  key: b,
                  displayIndex: b,
                  calendarMonth: a,
                },
                'around' === t &&
                  !d.hideNavigation &&
                  0 === b &&
                  o.default.createElement(
                    e.PreviousMonthButton,
                    {
                      type: 'button',
                      className: p[g.PreviousMonthButton],
                      tabIndex: R ? void 0 : -1,
                      'aria-disabled': !R || void 0,
                      'aria-label': as(R),
                      onClick: aA,
                      'data-animated-button': d.animate ? 'true' : void 0,
                    },
                    o.default.createElement(e.Chevron, {
                      disabled: !R || void 0,
                      className: p[g.Chevron],
                      orientation: 'rtl' === d.dir ? 'right' : 'left',
                    })
                  ),
                o.default.createElement(
                  e.MonthCaption,
                  {
                    'data-animated-caption': d.animate ? 'true' : void 0,
                    className: p[g.MonthCaption],
                    style: E?.[g.MonthCaption],
                    calendarMonth: a,
                    displayIndex: b,
                  },
                  q?.startsWith('dropdown')
                    ? o.default.createElement(
                        e.DropdownNav,
                        { className: p[g.Dropdowns], style: E?.[g.Dropdowns] },
                        ((c =
                          'dropdown' === q || 'dropdown-months' === q
                            ? o.default.createElement(e.MonthsDropdown, {
                                key: 'month',
                                className: p[g.MonthsDropdown],
                                'aria-label': ap(),
                                classNames: p,
                                components: e,
                                disabled: !!d.disableNavigation,
                                onChange: aK(a.date),
                                options: (function (a, b, c, d, e) {
                                  let {
                                    startOfMonth: f,
                                    startOfYear: g,
                                    endOfYear: h,
                                    eachMonthOfInterval: i,
                                    getMonth: j,
                                  } = e
                                  return i({ start: g(a), end: h(a) }).map((a) => {
                                    let g = d.formatMonthDropdown(a, e)
                                    return {
                                      value: j(a),
                                      label: g,
                                      disabled: (b && a < f(b)) || (c && a > f(c)) || !1,
                                    }
                                  })
                                })(a.date, P, Q, f, m),
                                style: E?.[g.Dropdown],
                                value: m.getMonth(a.date),
                              })
                            : o.default.createElement('span', { key: 'month' }, H(a.date, m))),
                        (j =
                          'dropdown' === q || 'dropdown-years' === q
                            ? o.default.createElement(e.YearsDropdown, {
                                key: 'year',
                                className: p[g.YearsDropdown],
                                'aria-label': ax(m.options),
                                classNames: p,
                                components: e,
                                disabled: !!d.disableNavigation,
                                onChange: aL(a.date),
                                options: (function (a, b, c, d, e = !1) {
                                  if (!a || !b) return
                                  let {
                                      startOfYear: f,
                                      endOfYear: g,
                                      eachYearOfInterval: h,
                                      getYear: i,
                                    } = d,
                                    j = h({ start: f(a), end: g(b) })
                                  return (
                                    e && j.reverse(),
                                    j.map((a) => {
                                      let b = c.formatYearDropdown(a, d)
                                      return { value: i(a), label: b, disabled: !1 }
                                    })
                                  )
                                })(P, Q, f, m, !!d.reverseYears),
                                style: E?.[g.Dropdown],
                                value: m.getYear(a.date),
                              })
                            : o.default.createElement('span', { key: 'year' }, L(a.date, m))),
                        'year-first' === m.getMonthYearOrder() ? [j, c] : [c, j]),
                        o.default.createElement(
                          'span',
                          {
                            role: 'status',
                            'aria-live': 'polite',
                            style: {
                              border: 0,
                              clip: 'rect(0 0 0 0)',
                              height: '1px',
                              margin: '-1px',
                              overflow: 'hidden',
                              padding: 0,
                              position: 'absolute',
                              width: '1px',
                              whiteSpace: 'nowrap',
                              wordWrap: 'normal',
                            },
                          },
                          F(a.date, m.options, m)
                        )
                      )
                    : o.default.createElement(
                        e.CaptionLabel,
                        { className: p[g.CaptionLabel], role: 'status', 'aria-live': 'polite' },
                        F(a.date, m.options, m)
                      )
                ),
                'around' === t &&
                  !d.hideNavigation &&
                  b === u - 1 &&
                  o.default.createElement(
                    e.NextMonthButton,
                    {
                      type: 'button',
                      className: p[g.NextMonthButton],
                      tabIndex: S ? void 0 : -1,
                      'aria-disabled': !S || void 0,
                      'aria-label': at(S),
                      onClick: aB,
                      'data-animated-button': d.animate ? 'true' : void 0,
                    },
                    o.default.createElement(e.Chevron, {
                      disabled: !S || void 0,
                      className: p[g.Chevron],
                      orientation: 'rtl' === d.dir ? 'left' : 'right',
                    })
                  ),
                b === u - 1 &&
                  'after' === t &&
                  !d.hideNavigation &&
                  o.default.createElement(e.Nav, {
                    'data-animated-nav': d.animate ? 'true' : void 0,
                    className: p[g.Nav],
                    style: E?.[g.Nav],
                    'aria-label': ar(),
                    onPreviousClick: aA,
                    onNextClick: aB,
                    previousMonth: R,
                    nextMonth: S,
                  }),
                o.default.createElement(
                  e.MonthGrid,
                  {
                    role: 'grid',
                    'aria-multiselectable': 'multiple' === r || 'range' === r,
                    'aria-label': ao(a.date, m.options, m) || void 0,
                    className: p[g.MonthGrid],
                    style: E?.[g.MonthGrid],
                  },
                  !d.hideWeekdays &&
                    o.default.createElement(
                      e.Weekdays,
                      {
                        'data-animated-weekdays': d.animate ? 'true' : void 0,
                        className: p[g.Weekdays],
                        style: E?.[g.Weekdays],
                      },
                      D &&
                        o.default.createElement(
                          e.WeekNumberHeader,
                          {
                            'aria-label': aw(m.options),
                            className: p[g.WeekNumberHeader],
                            style: E?.[g.WeekNumberHeader],
                            scope: 'col',
                          },
                          J()
                        ),
                      ay.map((a) =>
                        o.default.createElement(
                          e.Weekday,
                          {
                            'aria-label': au(a, m.options, m),
                            className: p[g.Weekday],
                            key: String(a),
                            style: E?.[g.Weekday],
                            scope: 'col',
                          },
                          K(a, m.options, m)
                        )
                      )
                    ),
                  o.default.createElement(
                    e.Weeks,
                    {
                      'data-animated-weeks': d.animate ? 'true' : void 0,
                      className: p[g.Weeks],
                      style: E?.[g.Weeks],
                    },
                    a.weeks.map((a) =>
                      o.default.createElement(
                        e.Week,
                        { className: p[g.Week], key: a.weekNumber, style: E?.[g.Week], week: a },
                        D &&
                          o.default.createElement(
                            e.WeekNumber,
                            {
                              week: a,
                              style: E?.[g.WeekNumber],
                              'aria-label': av(a.weekNumber, { locale: n }),
                              className: p[g.WeekNumber],
                              scope: 'row',
                              role: 'rowheader',
                            },
                            I(a.weekNumber, m)
                          ),
                        a.days.map((a) => {
                          let { date: b } = a,
                            c = U(a)
                          if (
                            ((c[h.focused] = !c.hidden && !!ai?.isEqualTo(a)),
                            (c[i.selected] = ae?.(b) || c.selected),
                            $(ag))
                          ) {
                            let { from: a, to: d } = ag
                            ;((c[i.range_start] = !!(a && d && m.isSameDay(b, a))),
                              (c[i.range_end] = !!(a && d && m.isSameDay(b, d))),
                              (c[i.range_middle] = Y(ag, b, !0, m)))
                          }
                          let f = (function (a, b = {}, c = {}) {
                              let d = { ...b?.[g.Day] }
                              return (
                                Object.entries(a)
                                  .filter(([, a]) => !0 === a)
                                  .forEach(([a]) => {
                                    d = { ...d, ...c?.[a] }
                                  }),
                                d
                              )
                            })(c, E, d.modifiersStyles),
                            j = (function (a, b, c = {}) {
                              return Object.entries(a)
                                .filter(([, a]) => !0 === a)
                                .reduce(
                                  (a, [d]) => (
                                    c[d]
                                      ? a.push(c[d])
                                      : b[h[d]]
                                        ? a.push(b[h[d]])
                                        : b[i[d]] && a.push(b[i[d]]),
                                    a
                                  ),
                                  [b[g.Day]]
                                )
                            })(c, p, d.modifiersClassNames),
                            k = az || c.hidden ? void 0 : an(b, c, m.options, m)
                          return o.default.createElement(
                            e.Day,
                            {
                              key: `${m.format(b, 'yyyy-MM-dd')}_${m.format(a.displayMonth, 'yyyy-MM')}`,
                              day: a,
                              modifiers: c,
                              className: j.join(' '),
                              style: f,
                              role: 'gridcell',
                              'aria-selected': c.selected || void 0,
                              'aria-label': k,
                              'data-day': m.format(b, 'yyyy-MM-dd'),
                              'data-month': a.outside ? m.format(b, 'yyyy-MM') : void 0,
                              'data-selected': c.selected || void 0,
                              'data-disabled': c.disabled || void 0,
                              'data-hidden': c.hidden || void 0,
                              'data-outside': a.outside || void 0,
                              'data-focused': c.focused || void 0,
                              'data-today': c.today || void 0,
                            },
                            !c.hidden && az
                              ? o.default.createElement(
                                  e.DayButton,
                                  {
                                    className: p[g.DayButton],
                                    style: E?.[g.DayButton],
                                    type: 'button',
                                    day: a,
                                    modifiers: c,
                                    disabled: c.disabled || void 0,
                                    tabIndex: aj(a) ? 0 : -1,
                                    'aria-label': am(b, c, m.options, m),
                                    onClick: aC(a, c),
                                    onBlur: aE(a, c),
                                    onFocus: aD(a, c),
                                    onKeyDown: aF(a, c),
                                    onMouseEnter: aI(a, c),
                                    onMouseLeave: aJ(a, c),
                                  },
                                  G(b, m.options, m)
                                )
                              : !c.hidden && G(a.date, m.options, m)
                          )
                        })
                      )
                    )
                  )
                )
              )
            })
          ),
          d.footer &&
            o.default.createElement(
              e.Footer,
              {
                className: p[g.Footer],
                style: E?.[g.Footer],
                role: 'status',
                'aria-live': 'polite',
              },
              d.footer
            )
        )
      )
    }
    ;(((f = k || (k = {}))[(f.Today = 0)] = 'Today'),
      (f[(f.Selected = 1)] = 'Selected'),
      (f[(f.LastFocused = 2)] = 'LastFocused'),
      (f[(f.FocusedModifier = 3)] = 'FocusedModifier'))
    var bc = a.i(368114),
      bd = a.i(699570)
    function be({
      className: a,
      classNames: b,
      showOutsideDays: c = !0,
      captionLayout: d = 'label',
      buttonVariant: e = 'ghost',
      formatters: f,
      components: g,
      ...h
    }) {
      let i = aH()
      return (0, l.jsx)(bb, {
        showOutsideDays: c,
        className: (0, bc.cn)(
          'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          a
        ),
        captionLayout: d,
        formatters: {
          formatMonthDropdown: (a) => (0, m.format)(a, 'yyyy-MM-dd HH:mm:ss', { locale: n.ko }),
          ...f,
        },
        classNames: {
          root: (0, bc.cn)('w-fit', i.root),
          months: (0, bc.cn)('flex gap-4 flex-col md:flex-row relative', i.months),
          month: (0, bc.cn)('flex flex-col w-full gap-4', i.month),
          nav: (0, bc.cn)(
            'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
            i.nav
          ),
          button_previous: (0, bc.cn)(
            (0, bd.buttonVariants)({ variant: e }),
            'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
            i.button_previous
          ),
          button_next: (0, bc.cn)(
            (0, bd.buttonVariants)({ variant: e }),
            'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
            i.button_next
          ),
          month_caption: (0, bc.cn)(
            'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
            i.month_caption
          ),
          dropdowns: (0, bc.cn)(
            'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
            i.dropdowns
          ),
          dropdown_root: (0, bc.cn)(
            'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
            i.dropdown_root
          ),
          dropdown: (0, bc.cn)('absolute bg-popover inset-0 opacity-0', i.dropdown),
          caption_label: (0, bc.cn)(
            'select-none font-medium',
            'label' === d
              ? 'text-sm'
              : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
            i.caption_label
          ),
          table: 'w-full border-collapse',
          weekdays: (0, bc.cn)('flex', i.weekdays),
          weekday: (0, bc.cn)(
            'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
            i.weekday
          ),
          week: (0, bc.cn)('flex w-full mt-2', i.week),
          week_number_header: (0, bc.cn)('select-none w-(--cell-size)', i.week_number_header),
          week_number: (0, bc.cn)('text-[0.8rem] select-none text-muted-foreground', i.week_number),
          day: (0, bc.cn)(
            'relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
            i.day
          ),
          range_start: (0, bc.cn)('rounded-l-md bg-accent', i.range_start),
          range_middle: (0, bc.cn)('rounded-none', i.range_middle),
          range_end: (0, bc.cn)('rounded-r-md bg-accent', i.range_end),
          today: (0, bc.cn)(
            'bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none',
            i.today
          ),
          outside: (0, bc.cn)(
            'text-muted-foreground aria-selected:text-muted-foreground',
            i.outside
          ),
          disabled: (0, bc.cn)('text-muted-foreground opacity-50', i.disabled),
          hidden: (0, bc.cn)('invisible', i.hidden),
          ...b,
        },
        components: {
          Root: ({ className: a, rootRef: b, ...c }) =>
            (0, l.jsx)('div', { 'data-slot': 'calendar', ref: b, className: (0, bc.cn)(a), ...c }),
          Chevron: ({ className: a, orientation: b, ...c }) =>
            'left' === b
              ? (0, l.jsx)(q.ChevronLeftIcon, { className: (0, bc.cn)('size-4', a), ...c })
              : 'right' === b
                ? (0, l.jsx)(r.ChevronRightIcon, { className: (0, bc.cn)('size-4', a), ...c })
                : (0, l.jsx)(p.ChevronDownIcon, { className: (0, bc.cn)('size-4', a), ...c }),
          DayButton: bf,
          WeekNumber: ({ children: a, ...b }) =>
            (0, l.jsx)('td', {
              ...b,
              children: (0, l.jsx)('div', {
                className: 'flex size-(--cell-size) items-center justify-center text-center',
                children: a,
              }),
            }),
          ...g,
        },
        ...h,
      })
    }
    function bf({ className: a, day: b, modifiers: c, ...d }) {
      let e = aH(),
        f = o.useRef(null)
      return (
        o.useEffect(() => {
          c.focused && f.current?.focus()
        }, [c.focused]),
        (0, l.jsx)(bd.Button, {
          ref: f,
          variant: 'ghost',
          size: 'icon',
          'data-day': (0, m.format)(b.date, 'yyyy-MM-dd', { locale: n.ko }),
          'data-selected-single': c.selected && !c.range_start && !c.range_end && !c.range_middle,
          'data-range-start': c.range_start,
          'data-range-end': c.range_end,
          'data-range-middle': c.range_middle,
          className: (0, bc.cn)(
            'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70',
            e.day,
            a
          ),
          ...d,
        })
      )
    }
    a.s(['Calendar', () => be], 320146)
  },
]

//# sourceMappingURL=_06bbea0c._.js.map
