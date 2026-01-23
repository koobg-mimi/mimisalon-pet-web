module.exports = [
  254799,
  (e, r, s) => {
    r.exports = e.x('crypto', () => require('crypto'))
  },
  224361,
  (e, r, s) => {
    r.exports = e.x('util', () => require('util'))
  },
  814747,
  (e, r, s) => {
    r.exports = e.x('path', () => require('path'))
  },
  688947,
  (e, r, s) => {
    r.exports = e.x('stream', () => require('stream'))
  },
  406461,
  (e, r, s) => {
    r.exports = e.x('zlib', () => require('zlib'))
  },
  921517,
  (e, r, s) => {
    r.exports = e.x('http', () => require('http'))
  },
  524836,
  (e, r, s) => {
    r.exports = e.x('https', () => require('https'))
  },
  427699,
  (e, r, s) => {
    r.exports = e.x('events', () => require('events'))
  },
  522734,
  (e, r, s) => {
    r.exports = e.x('fs', () => require('fs'))
  },
  446786,
  (e, r, s) => {
    r.exports = e.x('os', () => require('os'))
  },
  141528,
  (e, r, s) => {
    function t(e, r, s, t) {
      return Math.round(e / s) + ' ' + t + (r >= 1.5 * s ? 's' : '')
    }
    r.exports = function (e, r) {
      r = r || {}
      var s,
        n,
        o,
        a,
        u = typeof e
      if ('string' === u && e.length > 0) {
        var c = e
        if (!((c = String(c)).length > 100)) {
          var i =
            /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
              c
            )
          if (i) {
            var f = parseFloat(i[1])
            switch ((i[2] || 'ms').toLowerCase()) {
              case 'years':
              case 'year':
              case 'yrs':
              case 'yr':
              case 'y':
                return 315576e5 * f
              case 'weeks':
              case 'week':
              case 'w':
                return 6048e5 * f
              case 'days':
              case 'day':
              case 'd':
                return 864e5 * f
              case 'hours':
              case 'hour':
              case 'hrs':
              case 'hr':
              case 'h':
                return 36e5 * f
              case 'minutes':
              case 'minute':
              case 'mins':
              case 'min':
              case 'm':
                return 6e4 * f
              case 'seconds':
              case 'second':
              case 'secs':
              case 'sec':
              case 's':
                return 1e3 * f
              case 'milliseconds':
              case 'millisecond':
              case 'msecs':
              case 'msec':
              case 'ms':
                return f
              default:
                break
            }
          }
        }
        return
      }
      if ('number' === u && isFinite(e)) {
        return r.long
          ? (n = Math.abs((s = e))) >= 864e5
            ? t(s, n, 864e5, 'day')
            : n >= 36e5
              ? t(s, n, 36e5, 'hour')
              : n >= 6e4
                ? t(s, n, 6e4, 'minute')
                : n >= 1e3
                  ? t(s, n, 1e3, 'second')
                  : s + ' ms'
          : (a = Math.abs((o = e))) >= 864e5
            ? Math.round(o / 864e5) + 'd'
            : a >= 36e5
              ? Math.round(o / 36e5) + 'h'
              : a >= 6e4
                ? Math.round(o / 6e4) + 'm'
                : a >= 1e3
                  ? Math.round(o / 1e3) + 's'
                  : o + 'ms'
      }
      throw Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(e))
    }
  },
  500874,
  (e, r, s) => {
    r.exports = e.x('buffer', () => require('buffer'))
  },
  223469,
  (e, r, s) => {
    var t = e.r(500874),
      n = t.Buffer
    function o(e, r) {
      for (var s in e) r[s] = e[s]
    }
    function a(e, r, s) {
      return n(e, r, s)
    }
    ;(n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow
      ? (r.exports = t)
      : (o(t, s), (s.Buffer = a)),
      (a.prototype = Object.create(n.prototype)),
      o(n, a),
      (a.from = function (e, r, s) {
        if ('number' == typeof e) throw TypeError('Argument must not be a number')
        return n(e, r, s)
      }),
      (a.alloc = function (e, r, s) {
        if ('number' != typeof e) throw TypeError('Argument must be a number')
        var t = n(e)
        return (void 0 !== r ? ('string' == typeof s ? t.fill(r, s) : t.fill(r)) : t.fill(0), t)
      }),
      (a.allocUnsafe = function (e) {
        if ('number' != typeof e) throw TypeError('Argument must be a number')
        return n(e)
      }),
      (a.allocUnsafeSlow = function (e) {
        if ('number' != typeof e) throw TypeError('Argument must be a number')
        return t.SlowBuffer(e)
      }))
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__09b4a2a2._.js.map
