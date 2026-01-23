module.exports = [
  398163,
  (e) => {
    'use strict'
    let t, r, n, o
    function i(e, t) {
      return function () {
        return e.apply(t, arguments)
      }
    }
    let { toString: s } = Object.prototype,
      { getPrototypeOf: a } = Object,
      { iterator: l, toStringTag: u } = Symbol,
      c =
        ((t = Object.create(null)),
        (e) => {
          let r = s.call(e)
          return t[r] || (t[r] = r.slice(8, -1).toLowerCase())
        }),
      d = (e) => ((e = e.toLowerCase()), (t) => c(t) === e),
      f = (e) => (t) => typeof t === e,
      { isArray: h } = Array,
      p = f('undefined')
    function m(e) {
      return (
        null !== e &&
        !p(e) &&
        null !== e.constructor &&
        !p(e.constructor) &&
        b(e.constructor.isBuffer) &&
        e.constructor.isBuffer(e)
      )
    }
    let y = d('ArrayBuffer'),
      g = f('string'),
      b = f('function'),
      E = f('number'),
      w = (e) => null !== e && 'object' == typeof e,
      R = (e) => {
        if ('object' !== c(e)) return !1
        let t = a(e)
        return (
          (null === t || t === Object.prototype || null === Object.getPrototypeOf(t)) &&
          !(u in e) &&
          !(l in e)
        )
      },
      O = d('Date'),
      T = d('File'),
      A = d('Blob'),
      N = d('FileList'),
      I = d('URLSearchParams'),
      [S, C, _, k] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(d)
    function x(e, t, { allOwnKeys: r = !1 } = {}) {
      let n, o
      if (null != e)
        if (('object' != typeof e && (e = [e]), h(e)))
          for (n = 0, o = e.length; n < o; n++) t.call(null, e[n], n, e)
        else {
          let o
          if (m(e)) return
          let i = r ? Object.getOwnPropertyNames(e) : Object.keys(e),
            s = i.length
          for (n = 0; n < s; n++) ((o = i[n]), t.call(null, e[o], o, e))
        }
    }
    function D(e, t) {
      let r
      if (m(e)) return null
      t = t.toLowerCase()
      let n = Object.keys(e),
        o = n.length
      for (; o-- > 0; ) if (t === (r = n[o]).toLowerCase()) return r
      return null
    }
    let L = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof self ? self : e.g,
      P = (e) => !p(e) && e !== L,
      v = ((r = 'undefined' != typeof Uint8Array && a(Uint8Array)), (e) => r && e instanceof r),
      U = d('HTMLFormElement'),
      B = (
        ({ hasOwnProperty: e }) =>
        (t, r) =>
          e.call(t, r)
      )(Object.prototype),
      F = d('RegExp'),
      j = (e, t) => {
        let r = Object.getOwnPropertyDescriptors(e),
          n = {}
        ;(x(r, (r, o) => {
          let i
          !1 !== (i = t(r, o, e)) && (n[o] = i || r)
        }),
          Object.defineProperties(e, n))
      },
      M = d('AsyncFunction'),
      q =
        ((es = 'function' == typeof setImmediate),
        (ea = b(L.postMessage)),
        es
          ? setImmediate
          : ea
            ? ((el = `axios@${Math.random()}`),
              (eu = []),
              L.addEventListener(
                'message',
                ({ source: e, data: t }) => {
                  e === L && t === el && eu.length && eu.shift()()
                },
                !1
              ),
              (e) => {
                ;(eu.push(e), L.postMessage(el, '*'))
              })
            : (e) => setTimeout(e)),
      z =
        'undefined' != typeof queueMicrotask
          ? queueMicrotask.bind(L)
          : ('undefined' != typeof process && process.nextTick) || q,
      $ = {
        isArray: h,
        isArrayBuffer: y,
        isBuffer: m,
        isFormData: (e) => {
          let t
          return (
            e &&
            (('function' == typeof FormData && e instanceof FormData) ||
              (b(e.append) &&
                ('formdata' === (t = c(e)) ||
                  ('object' === t && b(e.toString) && '[object FormData]' === e.toString()))))
          )
        },
        isArrayBufferView: function (e) {
          return 'undefined' != typeof ArrayBuffer && ArrayBuffer.isView
            ? ArrayBuffer.isView(e)
            : e && e.buffer && y(e.buffer)
        },
        isString: g,
        isNumber: E,
        isBoolean: (e) => !0 === e || !1 === e,
        isObject: w,
        isPlainObject: R,
        isEmptyObject: (e) => {
          if (!w(e) || m(e)) return !1
          try {
            return 0 === Object.keys(e).length && Object.getPrototypeOf(e) === Object.prototype
          } catch (e) {
            return !1
          }
        },
        isReadableStream: S,
        isRequest: C,
        isResponse: _,
        isHeaders: k,
        isUndefined: p,
        isDate: O,
        isFile: T,
        isBlob: A,
        isRegExp: F,
        isFunction: b,
        isStream: (e) => w(e) && b(e.pipe),
        isURLSearchParams: I,
        isTypedArray: v,
        isFileList: N,
        forEach: x,
        merge: function e() {
          let { caseless: t, skipUndefined: r } = (P(this) && this) || {},
            n = {},
            o = (o, i) => {
              let s = (t && D(n, i)) || i
              R(n[s]) && R(o)
                ? (n[s] = e(n[s], o))
                : R(o)
                  ? (n[s] = e({}, o))
                  : h(o)
                    ? (n[s] = o.slice())
                    : (r && p(o)) || (n[s] = o)
            }
          for (let e = 0, t = arguments.length; e < t; e++) arguments[e] && x(arguments[e], o)
          return n
        },
        extend: (e, t, r, { allOwnKeys: n } = {}) => (
          x(
            t,
            (t, n) => {
              r && b(t) ? (e[n] = i(t, r)) : (e[n] = t)
            },
            { allOwnKeys: n }
          ),
          e
        ),
        trim: (e) => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')),
        stripBOM: (e) => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
        inherits: (e, t, r, n) => {
          ;((e.prototype = Object.create(t.prototype, n)),
            (e.prototype.constructor = e),
            Object.defineProperty(e, 'super', { value: t.prototype }),
            r && Object.assign(e.prototype, r))
        },
        toFlatObject: (e, t, r, n) => {
          let o,
            i,
            s,
            l = {}
          if (((t = t || {}), null == e)) return t
          do {
            for (i = (o = Object.getOwnPropertyNames(e)).length; i-- > 0; )
              ((s = o[i]), (!n || n(s, e, t)) && !l[s] && ((t[s] = e[s]), (l[s] = !0)))
            e = !1 !== r && a(e)
          } while (e && (!r || r(e, t)) && e !== Object.prototype)
          return t
        },
        kindOf: c,
        kindOfTest: d,
        endsWith: (e, t, r) => {
          ;((e = String(e)), (void 0 === r || r > e.length) && (r = e.length), (r -= t.length))
          let n = e.indexOf(t, r)
          return -1 !== n && n === r
        },
        toArray: (e) => {
          if (!e) return null
          if (h(e)) return e
          let t = e.length
          if (!E(t)) return null
          let r = Array(t)
          for (; t-- > 0; ) r[t] = e[t]
          return r
        },
        forEachEntry: (e, t) => {
          let r,
            n = (e && e[l]).call(e)
          for (; (r = n.next()) && !r.done; ) {
            let n = r.value
            t.call(e, n[0], n[1])
          }
        },
        matchAll: (e, t) => {
          let r,
            n = []
          for (; null !== (r = e.exec(t)); ) n.push(r)
          return n
        },
        isHTMLForm: U,
        hasOwnProperty: B,
        hasOwnProp: B,
        reduceDescriptors: j,
        freezeMethods: (e) => {
          j(e, (t, r) => {
            if (b(e) && -1 !== ['arguments', 'caller', 'callee'].indexOf(r)) return !1
            if (b(e[r])) {
              if (((t.enumerable = !1), 'writable' in t)) {
                t.writable = !1
                return
              }
              t.set ||
                (t.set = () => {
                  throw Error("Can not rewrite read-only method '" + r + "'")
                })
            }
          })
        },
        toObjectSet: (e, t) => {
          let r = {}
          return (
            (h(e) ? e : String(e).split(t)).forEach((e) => {
              r[e] = !0
            }),
            r
          )
        },
        toCamelCase: (e) =>
          e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, r) {
            return t.toUpperCase() + r
          }),
        noop: () => {},
        toFiniteNumber: (e, t) => (null != e && Number.isFinite((e *= 1)) ? e : t),
        findKey: D,
        global: L,
        isContextDefined: P,
        isSpecCompliantForm: function (e) {
          return !!(e && b(e.append) && 'FormData' === e[u] && e[l])
        },
        toJSONObject: (e) => {
          let t = Array(10),
            r = (e, n) => {
              if (w(e)) {
                if (t.indexOf(e) >= 0) return
                if (m(e)) return e
                if (!('toJSON' in e)) {
                  t[n] = e
                  let o = h(e) ? [] : {}
                  return (
                    x(e, (e, t) => {
                      let i = r(e, n + 1)
                      p(i) || (o[t] = i)
                    }),
                    (t[n] = void 0),
                    o
                  )
                }
              }
              return e
            }
          return r(e, 0)
        },
        isAsyncFn: M,
        isThenable: (e) => e && (w(e) || b(e)) && b(e.then) && b(e.catch),
        setImmediate: q,
        asap: z,
        isIterable: (e) => null != e && b(e[l]),
      }
    function H(e, t, r, n, o) {
      ;(Error.call(this),
        Error.captureStackTrace
          ? Error.captureStackTrace(this, this.constructor)
          : (this.stack = Error().stack),
        (this.message = e),
        (this.name = 'AxiosError'),
        t && (this.code = t),
        r && (this.config = r),
        n && (this.request = n),
        o && ((this.response = o), (this.status = o.status ? o.status : null)))
    }
    $.inherits(H, Error, {
      toJSON: function () {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: $.toJSONObject(this.config),
          code: this.code,
          status: this.status,
        }
      },
    })
    let W = H.prototype,
      G = {}
    ;([
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED',
      'ERR_NOT_SUPPORT',
      'ERR_INVALID_URL',
    ].forEach((e) => {
      G[e] = { value: e }
    }),
      Object.defineProperties(H, G),
      Object.defineProperty(W, 'isAxiosError', { value: !0 }),
      (H.from = (e, t, r, n, o, i) => {
        let s = Object.create(W)
        $.toFlatObject(
          e,
          s,
          function (e) {
            return e !== Error.prototype
          },
          (e) => 'isAxiosError' !== e
        )
        let a = e && e.message ? e.message : 'Error',
          l = null == t && e ? e.code : t
        return (
          H.call(s, a, l, r, n, o),
          e && null == s.cause && Object.defineProperty(s, 'cause', { value: e, configurable: !0 }),
          (s.name = (e && e.name) || 'Error'),
          i && Object.assign(s, i),
          s
        )
      }))
    let K = e.i(799433).default
    function J(e) {
      return $.isPlainObject(e) || $.isArray(e)
    }
    function Q(e) {
      return $.endsWith(e, '[]') ? e.slice(0, -2) : e
    }
    function Y(e, t, r) {
      return e
        ? e
            .concat(t)
            .map(function (e, t) {
              return ((e = Q(e)), !r && t ? '[' + e + ']' : e)
            })
            .join(r ? '.' : '')
        : t
    }
    let V = $.toFlatObject($, {}, null, function (e) {
        return /^is[A-Z]/.test(e)
      }),
      X = function (e, t, r) {
        if (!$.isObject(e)) throw TypeError('target must be an object')
        t = t || new (K || FormData)()
        let n = (r = $.toFlatObject(
            r,
            { metaTokens: !0, dots: !1, indexes: !1 },
            !1,
            function (e, t) {
              return !$.isUndefined(t[e])
            }
          )).metaTokens,
          o = r.visitor || u,
          i = r.dots,
          s = r.indexes,
          a = (r.Blob || ('undefined' != typeof Blob && Blob)) && $.isSpecCompliantForm(t)
        if (!$.isFunction(o)) throw TypeError('visitor must be a function')
        function l(e) {
          if (null === e) return ''
          if ($.isDate(e)) return e.toISOString()
          if ($.isBoolean(e)) return e.toString()
          if (!a && $.isBlob(e)) throw new H('Blob is not supported. Use a Buffer instead.')
          return $.isArrayBuffer(e) || $.isTypedArray(e)
            ? a && 'function' == typeof Blob
              ? new Blob([e])
              : Buffer.from(e)
            : e
        }
        function u(e, r, o) {
          let a = e
          if (e && !o && 'object' == typeof e)
            if ($.endsWith(r, '{}')) ((r = n ? r : r.slice(0, -2)), (e = JSON.stringify(e)))
            else {
              var u
              if (
                ($.isArray(e) && ((u = e), $.isArray(u) && !u.some(J))) ||
                (($.isFileList(e) || $.endsWith(r, '[]')) && (a = $.toArray(e)))
              )
                return (
                  (r = Q(r)),
                  a.forEach(function (e, n) {
                    $.isUndefined(e) ||
                      null === e ||
                      t.append(!0 === s ? Y([r], n, i) : null === s ? r : r + '[]', l(e))
                  }),
                  !1
                )
            }
          return !!J(e) || (t.append(Y(o, r, i), l(e)), !1)
        }
        let c = [],
          d = Object.assign(V, { defaultVisitor: u, convertValue: l, isVisitable: J })
        if (!$.isObject(e)) throw TypeError('data must be an object')
        return (
          !(function e(r, n) {
            if (!$.isUndefined(r)) {
              if (-1 !== c.indexOf(r)) throw Error('Circular reference detected in ' + n.join('.'))
              ;(c.push(r),
                $.forEach(r, function (r, i) {
                  !0 ===
                    (!($.isUndefined(r) || null === r) &&
                      o.call(t, r, $.isString(i) ? i.trim() : i, n, d)) &&
                    e(r, n ? n.concat(i) : [i])
                }),
                c.pop())
            }
          })(e),
          t
        )
      }
    function Z(e) {
      let t = {
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '~': '%7E',
        '%20': '+',
        '%00': '\0',
      }
      return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (e) {
        return t[e]
      })
    }
    function ee(e, t) {
      ;((this._pairs = []), e && X(e, this, t))
    }
    let et = ee.prototype
    function er(e) {
      return encodeURIComponent(e)
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
    }
    function en(e, t, r) {
      let n
      if (!t) return e
      let o = (r && r.encode) || er
      $.isFunction(r) && (r = { serialize: r })
      let i = r && r.serialize
      if ((n = i ? i(t, r) : $.isURLSearchParams(t) ? t.toString() : new ee(t, r).toString(o))) {
        let t = e.indexOf('#')
        ;(-1 !== t && (e = e.slice(0, t)), (e += (-1 === e.indexOf('?') ? '?' : '&') + n))
      }
      return e
    }
    ;((et.append = function (e, t) {
      this._pairs.push([e, t])
    }),
      (et.toString = function (e) {
        let t = e
          ? function (t) {
              return e.call(this, t, Z)
            }
          : Z
        return this._pairs
          .map(function (e) {
            return t(e[0]) + '=' + t(e[1])
          }, '')
          .join('&')
      }))
    let eo = class {
        constructor() {
          this.handlers = []
        }
        use(e, t, r) {
          return (
            this.handlers.push({
              fulfilled: e,
              rejected: t,
              synchronous: !!r && r.synchronous,
              runWhen: r ? r.runWhen : null,
            }),
            this.handlers.length - 1
          )
        }
        eject(e) {
          this.handlers[e] && (this.handlers[e] = null)
        }
        clear() {
          this.handlers && (this.handlers = [])
        }
        forEach(e) {
          $.forEach(this.handlers, function (t) {
            null !== t && e(t)
          })
        }
      },
      ei = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 }
    var es,
      ea,
      el,
      eu,
      ec = e.i(254799)
    let ed = e.i(792509).default.URLSearchParams,
      ef = 'abcdefghijklmnopqrstuvwxyz',
      eh = '0123456789',
      ep = { DIGIT: eh, ALPHA: ef, ALPHA_DIGIT: ef + ef.toUpperCase() + eh },
      em = {
        isNode: !0,
        classes: {
          URLSearchParams: ed,
          FormData: K,
          Blob: ('undefined' != typeof Blob && Blob) || null,
        },
        ALPHABET: ep,
        generateString: (e = 16, t = ep.ALPHA_DIGIT) => {
          let r = '',
            { length: n } = t,
            o = new Uint32Array(e)
          ec.default.randomFillSync(o)
          for (let i = 0; i < e; i++) r += t[o[i] % n]
          return r
        },
        protocols: ['http', 'https', 'file', 'data'],
      },
      ey = ('object' == typeof navigator && navigator) || void 0,
      eg =
        'undefined' != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope &&
        'function' == typeof self.importScripts
    e.s(
      [
        'hasBrowserEnv',
        () => !1,
        'hasStandardBrowserEnv',
        () => !1,
        'hasStandardBrowserWebWorkerEnv',
        () => eg,
        'navigator',
        () => ey,
        'origin',
        () => 'http://localhost',
      ],
      429846
    )
    let eb = { ...e.i(429846), ...em },
      eE = function (e) {
        if ($.isFormData(e) && $.isFunction(e.entries)) {
          let t = {}
          return (
            $.forEachEntry(e, (e, r) => {
              !(function e(t, r, n, o) {
                let i = t[o++]
                if ('__proto__' === i) return !0
                let s = Number.isFinite(+i),
                  a = o >= t.length
                return (
                  ((i = !i && $.isArray(n) ? n.length : i), a)
                    ? $.hasOwnProp(n, i)
                      ? (n[i] = [n[i], r])
                      : (n[i] = r)
                    : ((n[i] && $.isObject(n[i])) || (n[i] = []),
                      e(t, r, n[i], o) &&
                        $.isArray(n[i]) &&
                        (n[i] = (function (e) {
                          let t,
                            r,
                            n = {},
                            o = Object.keys(e),
                            i = o.length
                          for (t = 0; t < i; t++) n[(r = o[t])] = e[r]
                          return n
                        })(n[i]))),
                  !s
                )
              })(
                $.matchAll(/\w+|\[(\w*)]/g, e).map((e) => ('[]' === e[0] ? '' : e[1] || e[0])),
                r,
                t,
                0
              )
            }),
            t
          )
        }
        return null
      },
      ew = {
        transitional: ei,
        adapter: ['xhr', 'http', 'fetch'],
        transformRequest: [
          function (e, t) {
            let r,
              n = t.getContentType() || '',
              o = n.indexOf('application/json') > -1,
              i = $.isObject(e)
            if ((i && $.isHTMLForm(e) && (e = new FormData(e)), $.isFormData(e)))
              return o ? JSON.stringify(eE(e)) : e
            if (
              $.isArrayBuffer(e) ||
              $.isBuffer(e) ||
              $.isStream(e) ||
              $.isFile(e) ||
              $.isBlob(e) ||
              $.isReadableStream(e)
            )
              return e
            if ($.isArrayBufferView(e)) return e.buffer
            if ($.isURLSearchParams(e))
              return (
                t.setContentType('application/x-www-form-urlencoded;charset=utf-8', !1),
                e.toString()
              )
            if (i) {
              if (n.indexOf('application/x-www-form-urlencoded') > -1) {
                var s, a
                return ((s = e),
                (a = this.formSerializer),
                X(s, new eb.classes.URLSearchParams(), {
                  visitor: function (e, t, r, n) {
                    return eb.isNode && $.isBuffer(e)
                      ? (this.append(t, e.toString('base64')), !1)
                      : n.defaultVisitor.apply(this, arguments)
                  },
                  ...a,
                })).toString()
              }
              if ((r = $.isFileList(e)) || n.indexOf('multipart/form-data') > -1) {
                let t = this.env && this.env.FormData
                return X(r ? { 'files[]': e } : e, t && new t(), this.formSerializer)
              }
            }
            if (i || o) {
              t.setContentType('application/json', !1)
              var l = e
              if ($.isString(l))
                try {
                  return ((0, JSON.parse)(l), $.trim(l))
                } catch (e) {
                  if ('SyntaxError' !== e.name) throw e
                }
              return (0, JSON.stringify)(l)
            }
            return e
          },
        ],
        transformResponse: [
          function (e) {
            let t = this.transitional || ew.transitional,
              r = t && t.forcedJSONParsing,
              n = 'json' === this.responseType
            if ($.isResponse(e) || $.isReadableStream(e)) return e
            if (e && $.isString(e) && ((r && !this.responseType) || n)) {
              let r = t && t.silentJSONParsing
              try {
                return JSON.parse(e, this.parseReviver)
              } catch (e) {
                if (!r && n) {
                  if ('SyntaxError' === e.name)
                    throw H.from(e, H.ERR_BAD_RESPONSE, this, null, this.response)
                  throw e
                }
              }
            }
            return e
          },
        ],
        timeout: 0,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        maxBodyLength: -1,
        env: { FormData: eb.classes.FormData, Blob: eb.classes.Blob },
        validateStatus: function (e) {
          return e >= 200 && e < 300
        },
        headers: {
          common: { Accept: 'application/json, text/plain, */*', 'Content-Type': void 0 },
        },
      }
    $.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (e) => {
      ew.headers[e] = {}
    })
    let eR = $.toObjectSet([
        'age',
        'authorization',
        'content-length',
        'content-type',
        'etag',
        'expires',
        'from',
        'host',
        'if-modified-since',
        'if-unmodified-since',
        'last-modified',
        'location',
        'max-forwards',
        'proxy-authorization',
        'referer',
        'retry-after',
        'user-agent',
      ]),
      eO = Symbol('internals')
    function eT(e) {
      return e && String(e).trim().toLowerCase()
    }
    function eA(e) {
      return !1 === e || null == e ? e : $.isArray(e) ? e.map(eA) : String(e)
    }
    function eN(e, t, r, n, o) {
      if ($.isFunction(n)) return n.call(this, t, r)
      if ((o && (t = r), $.isString(t))) {
        if ($.isString(n)) return -1 !== t.indexOf(n)
        if ($.isRegExp(n)) return n.test(t)
      }
    }
    class eI {
      constructor(e) {
        e && this.set(e)
      }
      set(e, t, r) {
        let n = this
        function o(e, t, r) {
          let o = eT(t)
          if (!o) throw Error('header name must be a non-empty string')
          let i = $.findKey(n, o)
          ;(i && void 0 !== n[i] && !0 !== r && (void 0 !== r || !1 === n[i])) ||
            (n[i || t] = eA(e))
        }
        let i = (e, t) => $.forEach(e, (e, r) => o(e, r, t))
        if ($.isPlainObject(e) || e instanceof this.constructor) i(e, t)
        else {
          let n
          if (
            $.isString(e) &&
            (e = e.trim()) &&
            ((n = e), !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim()))
          ) {
            var s
            let r, n, o, a
            i(
              ((a = {}),
              (s = e) &&
                s.split('\n').forEach(function (e) {
                  ;((o = e.indexOf(':')),
                    (r = e.substring(0, o).trim().toLowerCase()),
                    (n = e.substring(o + 1).trim()),
                    !r ||
                      (a[r] && eR[r]) ||
                      ('set-cookie' === r
                        ? a[r]
                          ? a[r].push(n)
                          : (a[r] = [n])
                        : (a[r] = a[r] ? a[r] + ', ' + n : n)))
                }),
              a),
              t
            )
          } else if ($.isObject(e) && $.isIterable(e)) {
            let r = {},
              n,
              o
            for (let t of e) {
              if (!$.isArray(t)) throw TypeError('Object iterator must return a key-value pair')
              r[(o = t[0])] = (n = r[o]) ? ($.isArray(n) ? [...n, t[1]] : [n, t[1]]) : t[1]
            }
            i(r, t)
          } else null != e && o(t, e, r)
        }
        return this
      }
      get(e, t) {
        if ((e = eT(e))) {
          let r = $.findKey(this, e)
          if (r) {
            let e = this[r]
            if (!t) return e
            if (!0 === t) {
              let t,
                r = Object.create(null),
                n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g
              for (; (t = n.exec(e)); ) r[t[1]] = t[2]
              return r
            }
            if ($.isFunction(t)) return t.call(this, e, r)
            if ($.isRegExp(t)) return t.exec(e)
            throw TypeError('parser must be boolean|regexp|function')
          }
        }
      }
      has(e, t) {
        if ((e = eT(e))) {
          let r = $.findKey(this, e)
          return !!(r && void 0 !== this[r] && (!t || eN(this, this[r], r, t)))
        }
        return !1
      }
      delete(e, t) {
        let r = this,
          n = !1
        function o(e) {
          if ((e = eT(e))) {
            let o = $.findKey(r, e)
            o && (!t || eN(r, r[o], o, t)) && (delete r[o], (n = !0))
          }
        }
        return ($.isArray(e) ? e.forEach(o) : o(e), n)
      }
      clear(e) {
        let t = Object.keys(this),
          r = t.length,
          n = !1
        for (; r--; ) {
          let o = t[r]
          ;(!e || eN(this, this[o], o, e, !0)) && (delete this[o], (n = !0))
        }
        return n
      }
      normalize(e) {
        let t = this,
          r = {}
        return (
          $.forEach(this, (n, o) => {
            let i = $.findKey(r, o)
            if (i) {
              ;((t[i] = eA(n)), delete t[o])
              return
            }
            let s = e
              ? o
                  .trim()
                  .toLowerCase()
                  .replace(/([a-z\d])(\w*)/g, (e, t, r) => t.toUpperCase() + r)
              : String(o).trim()
            ;(s !== o && delete t[o], (t[s] = eA(n)), (r[s] = !0))
          }),
          this
        )
      }
      concat(...e) {
        return this.constructor.concat(this, ...e)
      }
      toJSON(e) {
        let t = Object.create(null)
        return (
          $.forEach(this, (r, n) => {
            null != r && !1 !== r && (t[n] = e && $.isArray(r) ? r.join(', ') : r)
          }),
          t
        )
      }
      [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]()
      }
      toString() {
        return Object.entries(this.toJSON())
          .map(([e, t]) => e + ': ' + t)
          .join('\n')
      }
      getSetCookie() {
        return this.get('set-cookie') || []
      }
      get [Symbol.toStringTag]() {
        return 'AxiosHeaders'
      }
      static from(e) {
        return e instanceof this ? e : new this(e)
      }
      static concat(e, ...t) {
        let r = new this(e)
        return (t.forEach((e) => r.set(e)), r)
      }
      static accessor(e) {
        let t = (this[eO] = this[eO] = { accessors: {} }).accessors,
          r = this.prototype
        function n(e) {
          let n = eT(e)
          if (!t[n]) {
            let o
            ;((o = $.toCamelCase(' ' + e)),
              ['get', 'set', 'has'].forEach((t) => {
                Object.defineProperty(r, t + o, {
                  value: function (r, n, o) {
                    return this[t].call(this, e, r, n, o)
                  },
                  configurable: !0,
                })
              }),
              (t[n] = !0))
          }
        }
        return ($.isArray(e) ? e.forEach(n) : n(e), this)
      }
    }
    function eS(e, t) {
      let r = this || ew,
        n = t || r,
        o = eI.from(n.headers),
        i = n.data
      return (
        $.forEach(e, function (e) {
          i = e.call(r, i, o.normalize(), t ? t.status : void 0)
        }),
        o.normalize(),
        i
      )
    }
    function eC(e) {
      return !!(e && e.__CANCEL__)
    }
    function e_(e, t, r) {
      ;(H.call(this, null == e ? 'canceled' : e, H.ERR_CANCELED, t, r),
        (this.name = 'CanceledError'))
    }
    ;(eI.accessor([
      'Content-Type',
      'Content-Length',
      'Accept',
      'Accept-Encoding',
      'User-Agent',
      'Authorization',
    ]),
      $.reduceDescriptors(eI.prototype, ({ value: e }, t) => {
        let r = t[0].toUpperCase() + t.slice(1)
        return {
          get: () => e,
          set(e) {
            this[r] = e
          },
        }
      }),
      $.freezeMethods(eI),
      $.inherits(e_, H, { __CANCEL__: !0 }))
    var ek = e.i(925328)
    function ex(e, t, r) {
      let n = r.config.validateStatus
      !r.status || !n || n(r.status)
        ? e(r)
        : t(
            new H(
              'Request failed with status code ' + r.status,
              [H.ERR_BAD_REQUEST, H.ERR_BAD_RESPONSE][Math.floor(r.status / 100) - 4],
              r.config,
              r.request,
              r
            )
          )
    }
    function eD(e, t, r) {
      let n = !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)
      return e && (n || !1 == r)
        ? t
          ? e.replace(/\/?\/$/, '') + '/' + t.replace(/^\/+/, '')
          : e
        : t
    }
    var eL = e.i(859938),
      eP = e.i(921517),
      ev = e.i(524836),
      eU = e.i(224361),
      eB = e.i(210894),
      eF = e.i(406461)
    let ej = '1.13.1'
    function eM(e) {
      let t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e)
      return (t && t[1]) || ''
    }
    let eq = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/
    var ez = e.i(688947),
      e$ = ez
    let eH = Symbol('internals')
    class eW extends e$.default.Transform {
      constructor(e) {
        super({
          readableHighWaterMark: (e = $.toFlatObject(
            e,
            {
              maxRate: 0,
              chunkSize: 65536,
              minChunkSize: 100,
              timeWindow: 500,
              ticksRate: 2,
              samplesCount: 15,
            },
            null,
            (e, t) => !$.isUndefined(t[e])
          )).chunkSize,
        })
        const t = (this[eH] = {
          timeWindow: e.timeWindow,
          chunkSize: e.chunkSize,
          maxRate: e.maxRate,
          minChunkSize: e.minChunkSize,
          bytesSeen: 0,
          isCaptured: !1,
          notifiedBytesLoaded: 0,
          ts: Date.now(),
          bytes: 0,
          onReadCallback: null,
        })
        this.on('newListener', (e) => {
          'progress' !== e || t.isCaptured || (t.isCaptured = !0)
        })
      }
      _read(e) {
        let t = this[eH]
        return (t.onReadCallback && t.onReadCallback(), super._read(e))
      }
      _transform(e, t, r) {
        let n = this[eH],
          o = n.maxRate,
          i = this.readableHighWaterMark,
          s = n.timeWindow,
          a = o / (1e3 / s),
          l = !1 !== n.minChunkSize ? Math.max(n.minChunkSize, 0.01 * a) : 0,
          u = (e, t) => {
            let r = Buffer.byteLength(e)
            ;((n.bytesSeen += r),
              (n.bytes += r),
              n.isCaptured && this.emit('progress', n.bytesSeen),
              this.push(e)
                ? process.nextTick(t)
                : (n.onReadCallback = () => {
                    ;((n.onReadCallback = null), process.nextTick(t))
                  }))
          },
          c = (e, t) => {
            let r,
              c = Buffer.byteLength(e),
              d = null,
              f = i,
              h = 0
            if (o) {
              let e = Date.now()
              ;((!n.ts || (h = e - n.ts) >= s) &&
                ((n.ts = e), (r = a - n.bytes), (n.bytes = r < 0 ? -r : 0), (h = 0)),
                (r = a - n.bytes))
            }
            if (o) {
              if (r <= 0)
                return setTimeout(() => {
                  t(null, e)
                }, s - h)
              r < f && (f = r)
            }
            ;(f && c > f && c - f > l && ((d = e.subarray(f)), (e = e.subarray(0, f))),
              u(
                e,
                d
                  ? () => {
                      process.nextTick(t, null, d)
                    }
                  : t
              ))
          }
        c(e, function e(t, n) {
          if (t) return r(t)
          n ? c(n, e) : r(null)
        })
      }
    }
    var eG = e.i(427699)
    let { asyncIterator: eK } = Symbol,
      eJ = async function* (e) {
        e.stream
          ? yield* e.stream()
          : e.arrayBuffer
            ? yield await e.arrayBuffer()
            : e[eK]
              ? yield* e[eK]()
              : yield e
      },
      eQ = eb.ALPHABET.ALPHA_DIGIT + '-_',
      eY = 'function' == typeof TextEncoder ? new TextEncoder() : new eU.default.TextEncoder(),
      eV = eY.encode('\r\n')
    class eX {
      constructor(e, t) {
        const { escapeName: r } = this.constructor,
          n = $.isString(t)
        let o = `Content-Disposition: form-data; name="${r(e)}"${!n && t.name ? `; filename="${r(t.name)}"` : ''}\r
`
        ;(n
          ? (t = eY.encode(String(t).replace(/\r?\n|\r\n?/g, '\r\n')))
          : (o += `Content-Type: ${t.type || 'application/octet-stream'}\r
`),
          (this.headers = eY.encode(o + '\r\n')),
          (this.contentLength = n ? t.byteLength : t.size),
          (this.size = this.headers.byteLength + this.contentLength + 2),
          (this.name = e),
          (this.value = t))
      }
      async *encode() {
        yield this.headers
        let { value: e } = this
        ;($.isTypedArray(e) ? yield e : yield* eJ(e), yield eV)
      }
      static escapeName(e) {
        return String(e).replace(/[\r\n"]/g, (e) => ({ '\r': '%0D', '\n': '%0A', '"': '%22' })[e])
      }
    }
    var eZ = ez
    class e0 extends eZ.default.Transform {
      __transform(e, t, r) {
        ;(this.push(e), r())
      }
      _transform(e, t, r) {
        if (0 !== e.length && ((this._transform = this.__transform), 120 !== e[0])) {
          let e = Buffer.alloc(2)
          ;((e[0] = 120), (e[1] = 156), this.push(e, t))
        }
        this.__transform(e, t, r)
      }
    }
    let e1 = function (e, t) {
        let r,
          n = Array((e = e || 10)),
          o = Array(e),
          i = 0,
          s = 0
        return (
          (t = void 0 !== t ? t : 1e3),
          function (a) {
            let l = Date.now(),
              u = o[s]
            ;(r || (r = l), (n[i] = a), (o[i] = l))
            let c = s,
              d = 0
            for (; c !== i; ) ((d += n[c++]), (c %= e))
            if (((i = (i + 1) % e) === s && (s = (s + 1) % e), l - r < t)) return
            let f = u && l - u
            return f ? Math.round((1e3 * d) / f) : void 0
          }
        )
      },
      e2 = function (e, t) {
        let r,
          n,
          o = 0,
          i = 1e3 / t,
          s = (t, i = Date.now()) => {
            ;((o = i), (r = null), n && (clearTimeout(n), (n = null)), e(...t))
          }
        return [
          (...e) => {
            let t = Date.now(),
              a = t - o
            a >= i
              ? s(e, t)
              : ((r = e),
                n ||
                  (n = setTimeout(() => {
                    ;((n = null), s(r))
                  }, i - a)))
          },
          () => r && s(r),
        ]
      },
      e4 = (e, t, r = 3) => {
        let n = 0,
          o = e1(50, 250)
        return e2((r) => {
          let i = r.loaded,
            s = r.lengthComputable ? r.total : void 0,
            a = i - n,
            l = o(a)
          ;((n = i),
            e({
              loaded: i,
              total: s,
              progress: s ? i / s : void 0,
              bytes: a,
              rate: l || void 0,
              estimated: l && s && i <= s ? (s - i) / l : void 0,
              event: r,
              lengthComputable: null != s,
              [t ? 'download' : 'upload']: !0,
            }))
        }, r)
      },
      e5 = (e, t) => {
        let r = null != e
        return [(n) => t[0]({ lengthComputable: r, total: e, loaded: n }), t[1]]
      },
      e3 =
        (e) =>
        (...t) =>
          $.asap(() => e(...t)),
      e6 = {
        flush: eF.default.constants.Z_SYNC_FLUSH,
        finishFlush: eF.default.constants.Z_SYNC_FLUSH,
      },
      e8 = {
        flush: eF.default.constants.BROTLI_OPERATION_FLUSH,
        finishFlush: eF.default.constants.BROTLI_OPERATION_FLUSH,
      },
      {
        HTTP2_HEADER_SCHEME: e7,
        HTTP2_HEADER_METHOD: e9,
        HTTP2_HEADER_PATH: te,
        HTTP2_HEADER_STATUS: tt,
      } = ek.constants,
      tr = $.isFunction(eF.default.createBrotliDecompress),
      { http: tn, https: to } = eB.default,
      ti = /https:?/,
      ts = eb.protocols.map((e) => e + ':'),
      ta = (e, [t, r]) => (e.on('end', r).on('error', r), t),
      tl = new (class {
        constructor() {
          this.sessions = Object.create(null)
        }
        getSession(e, t) {
          let r, n
          if (((t = Object.assign({ sessionTimeout: 1e3 }, t)), (r = this.sessions[e]))) {
            let e = r.length
            for (let n = 0; n < e; n++) {
              let [e, o] = r[n]
              if (!e.destroyed && !e.closed && eU.default.isDeepStrictEqual(o, t)) return e
            }
          }
          let o = (0, ek.connect)(e, t),
            i = () => {
              if (n) return
              n = !0
              let t = r,
                i = t.length,
                s = i
              for (; s--; )
                if (t[s][0] === o && (t.splice(s, 1), 1 === i)) return void delete this.sessions[e]
            },
            s = o.request,
            { sessionTimeout: a } = t
          if (null != a) {
            let e,
              t = 0
            o.request = function () {
              let r = s.apply(this, arguments)
              return (
                t++,
                e && (clearTimeout(e), (e = null)),
                r.once('close', () => {
                  --t ||
                    (e = setTimeout(() => {
                      ;((e = null), i())
                    }, a))
                }),
                r
              )
            }
          }
          o.once('close', i)
          let l = this.sessions[e],
            u = [o, t]
          return (l ? this.sessions[e].push(u) : (r = this.sessions[e] = [u]), o)
        }
      })()
    function tu(e, t) {
      ;(e.beforeRedirects.proxy && e.beforeRedirects.proxy(e),
        e.beforeRedirects.config && e.beforeRedirects.config(e, t))
    }
    let tc = 'undefined' != typeof process && 'process' === $.kindOf(process),
      td = (e, t) =>
        (({ address: e, family: t }) => {
          if (!$.isString(e)) throw TypeError('address must be a string')
          return { address: e, family: t || (0 > e.indexOf('.') ? 6 : 4) }
        })($.isObject(e) ? e : { address: e, family: t }),
      tf = {
        request(e, t) {
          let r = e.protocol + '//' + e.hostname + ':' + (e.port || 80),
            { http2Options: n, headers: o } = e,
            i = tl.getSession(r, n),
            s = { [e7]: e.protocol.replace(':', ''), [e9]: e.method, [te]: e.path }
          $.forEach(o, (e, t) => {
            ':' !== t.charAt(0) && (s[t] = e)
          })
          let a = i.request(s)
          return (
            a.once('response', (e) => {
              let r = (e = Object.assign({}, e))[tt]
              ;(delete e[tt], (a.headers = e), (a.statusCode = +r), t(a))
            }),
            a
          )
        },
      },
      th =
        tc &&
        function (e) {
          let t
          return (
            (t = async function (t, r, n) {
              let o,
                i,
                s,
                a,
                l,
                u,
                c,
                { data: d, lookup: f, family: h, httpVersion: p = 1, http2Options: m } = e,
                { responseType: y, responseEncoding: g } = e,
                b = e.method.toUpperCase(),
                E = !1
              if (Number.isNaN((p *= 1)))
                throw TypeError(`Invalid protocol version: '${e.httpVersion}' is not a number`)
              if (1 !== p && 2 !== p) throw TypeError(`Unsupported protocol version '${p}'`)
              let w = 2 === p
              if (f) {
                let e,
                  t,
                  r =
                    ((e = f),
                    (t = (e) => ($.isArray(e) ? e : [e])),
                    $.isAsyncFn(e)
                      ? function (...r) {
                          let n = r.pop()
                          e.apply(this, r).then((e) => {
                            try {
                              t ? n(null, ...t(e)) : n(null, e)
                            } catch (e) {
                              n(e)
                            }
                          }, n)
                        }
                      : e)
                f = (e, t, n) => {
                  r(e, t, (e, r, o) => {
                    if (e) return n(e)
                    let i = $.isArray(r) ? r.map((e) => td(e)) : [td(r, o)]
                    t.all ? n(e, i) : n(e, i[0].address, i[0].family)
                  })
                }
              }
              let R = new eG.EventEmitter()
              function O(t) {
                try {
                  R.emit('abort', !t || t.type ? new e_(null, e, l) : t)
                } catch (e) {
                  console.warn('emit error', e)
                }
              }
              R.once('abort', r)
              let T = () => {
                ;(e.cancelToken && e.cancelToken.unsubscribe(O),
                  e.signal && e.signal.removeEventListener('abort', O),
                  R.removeAllListeners())
              }
              ;((e.cancelToken || e.signal) &&
                (e.cancelToken && e.cancelToken.subscribe(O),
                e.signal && (e.signal.aborted ? O() : e.signal.addEventListener('abort', O))),
                n((e, t) => {
                  if (((a = !0), t)) {
                    ;((E = !0), T())
                    return
                  }
                  let { data: r } = e
                  if (r instanceof ez.default.Readable || r instanceof ez.default.Duplex) {
                    let e = ez.default.finished(r, () => {
                      ;(e(), T())
                    })
                  } else T()
                }))
              let A = eD(e.baseURL, e.url, e.allowAbsoluteUrls),
                N = new URL(A, eb.hasBrowserEnv ? eb.origin : void 0),
                I = N.protocol || ts[0]
              if ('data:' === I) {
                let n
                if (
                  e.maxContentLength > -1 &&
                  (function (e) {
                    if (!e || 'string' != typeof e || !e.startsWith('data:')) return 0
                    let t = e.indexOf(',')
                    if (t < 0) return 0
                    let r = e.slice(5, t),
                      n = e.slice(t + 1)
                    if (/;base64/i.test(r)) {
                      let e = n.length,
                        t = n.length
                      for (let r = 0; r < t; r++)
                        if (37 === n.charCodeAt(r) && r + 2 < t) {
                          let t = n.charCodeAt(r + 1),
                            o = n.charCodeAt(r + 2)
                          ;((t >= 48 && t <= 57) ||
                            (t >= 65 && t <= 70) ||
                            (t >= 97 && t <= 102)) &&
                            ((o >= 48 && o <= 57) ||
                              (o >= 65 && o <= 70) ||
                              (o >= 97 && o <= 102)) &&
                            ((e -= 2), (r += 2))
                        }
                      let r = 0,
                        o = t - 1,
                        i = (e) =>
                          e >= 2 &&
                          37 === n.charCodeAt(e - 2) &&
                          51 === n.charCodeAt(e - 1) &&
                          (68 === n.charCodeAt(e) || 100 === n.charCodeAt(e))
                      ;(o >= 0 && (61 === n.charCodeAt(o) ? (r++, o--) : i(o) && (r++, (o -= 3))),
                        1 === r && o >= 0 && (61 === n.charCodeAt(o) ? r++ : i(o) && r++))
                      let s = 3 * Math.floor(e / 4) - (r || 0)
                      return s > 0 ? s : 0
                    }
                    return Buffer.byteLength(n, 'utf8')
                  })(String(e.url || A || '')) > e.maxContentLength
                )
                  return r(
                    new H(
                      'maxContentLength size of ' + e.maxContentLength + ' exceeded',
                      H.ERR_BAD_RESPONSE,
                      e
                    )
                  )
                if ('GET' !== b)
                  return ex(t, r, {
                    status: 405,
                    statusText: 'method not allowed',
                    headers: {},
                    config: e,
                  })
                try {
                  n = (function (e, t, r) {
                    let n = (r && r.Blob) || eb.classes.Blob,
                      o = eM(e)
                    if ((void 0 === t && n && (t = !0), 'data' === o)) {
                      e = o.length ? e.slice(o.length + 1) : e
                      let r = eq.exec(e)
                      if (!r) throw new H('Invalid URL', H.ERR_INVALID_URL)
                      let i = r[1],
                        s = r[2],
                        a = r[3],
                        l = Buffer.from(decodeURIComponent(a), s ? 'base64' : 'utf8')
                      if (t) {
                        if (!n) throw new H('Blob is not supported', H.ERR_NOT_SUPPORT)
                        return new n([l], { type: i })
                      }
                      return l
                    }
                    throw new H('Unsupported protocol ' + o, H.ERR_NOT_SUPPORT)
                  })(e.url, 'blob' === y, { Blob: e.env && e.env.Blob })
                } catch (t) {
                  throw H.from(t, H.ERR_BAD_REQUEST, e)
                }
                return (
                  'text' === y
                    ? ((n = n.toString(g)), (g && 'utf8' !== g) || (n = $.stripBOM(n)))
                    : 'stream' === y && (n = ez.default.Readable.from(n)),
                  ex(t, r, { data: n, status: 200, statusText: 'OK', headers: new eI(), config: e })
                )
              }
              if (-1 === ts.indexOf(I))
                return r(new H('Unsupported protocol ' + I, H.ERR_BAD_REQUEST, e))
              let S = eI.from(e.headers).normalize()
              S.set('User-Agent', 'axios/' + ej, !1)
              let { onUploadProgress: C, onDownloadProgress: _ } = e,
                k = e.maxRate
              if ($.isSpecCompliantForm(d)) {
                let e = S.getContentType(/boundary=([-_\w\d]{10,70})/i)
                d = ((e, t, r) => {
                  let {
                    tag: n = 'form-data-boundary',
                    size: o = 25,
                    boundary: i = n + '-' + eb.generateString(o, eQ),
                  } = r || {}
                  if (!$.isFormData(e)) throw TypeError('FormData instance required')
                  if (i.length < 1 || i.length > 70)
                    throw Error('boundary must be 10-70 characters long')
                  let s = eY.encode('--' + i + '\r\n'),
                    a = eY.encode('--' + i + '--\r\n'),
                    l = a.byteLength,
                    u = Array.from(e.entries()).map(([e, t]) => {
                      let r = new eX(e, t)
                      return ((l += r.size), r)
                    })
                  l += s.byteLength * u.length
                  let c = { 'Content-Type': `multipart/form-data; boundary=${i}` }
                  return (
                    Number.isFinite((l = $.toFiniteNumber(l))) && (c['Content-Length'] = l),
                    t && t(c),
                    ez.Readable.from(
                      (async function* () {
                        for (let e of u) (yield s, yield* e.encode())
                        yield a
                      })()
                    )
                  )
                })(
                  d,
                  (e) => {
                    S.set(e)
                  },
                  { tag: `axios-${ej}-boundary`, boundary: (e && e[1]) || void 0 }
                )
              } else if ($.isFormData(d) && $.isFunction(d.getHeaders)) {
                if ((S.set(d.getHeaders()), !S.hasContentLength()))
                  try {
                    let e = await eU.default.promisify(d.getLength).call(d)
                    Number.isFinite(e) && e >= 0 && S.setContentLength(e)
                  } catch (e) {}
              } else if ($.isBlob(d) || $.isFile(d))
                (d.size && S.setContentType(d.type || 'application/octet-stream'),
                  S.setContentLength(d.size || 0),
                  (d = ez.default.Readable.from(eJ(d))))
              else if (d && !$.isStream(d)) {
                if (Buffer.isBuffer(d));
                else if ($.isArrayBuffer(d)) d = Buffer.from(new Uint8Array(d))
                else {
                  if (!$.isString(d))
                    return r(
                      new H(
                        'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
                        H.ERR_BAD_REQUEST,
                        e
                      )
                    )
                  d = Buffer.from(d, 'utf-8')
                }
                if (
                  (S.setContentLength(d.length, !1),
                  e.maxBodyLength > -1 && d.length > e.maxBodyLength)
                )
                  return r(
                    new H('Request body larger than maxBodyLength limit', H.ERR_BAD_REQUEST, e)
                  )
              }
              let x = $.toFiniteNumber(S.getContentLength())
              ;($.isArray(k) ? ((o = k[0]), (i = k[1])) : (o = i = k),
                d &&
                  (C || o) &&
                  ($.isStream(d) || (d = ez.default.Readable.from(d, { objectMode: !1 })),
                  (d = ez.default.pipeline([d, new eW({ maxRate: $.toFiniteNumber(o) })], $.noop)),
                  C && d.on('progress', ta(d, e5(x, e4(e3(C), !1, 3))))),
                e.auth && (s = (e.auth.username || '') + ':' + (e.auth.password || '')),
                !s && N.username && (s = N.username + ':' + N.password),
                s && S.delete('authorization'))
              try {
                u = en(N.pathname + N.search, e.params, e.paramsSerializer).replace(/^\?/, '')
              } catch (n) {
                let t = Error(n.message)
                return ((t.config = e), (t.url = e.url), (t.exists = !0), r(t))
              }
              S.set('Accept-Encoding', 'gzip, compress, deflate' + (tr ? ', br' : ''), !1)
              let D = {
                path: u,
                method: b,
                headers: S.toJSON(),
                agents: { http: e.httpAgent, https: e.httpsAgent },
                auth: s,
                protocol: I,
                family: h,
                beforeRedirect: tu,
                beforeRedirects: {},
                http2Options: m,
              }
              ;($.isUndefined(f) || (D.lookup = f),
                e.socketPath
                  ? (D.socketPath = e.socketPath)
                  : ((D.hostname = N.hostname.startsWith('[')
                      ? N.hostname.slice(1, -1)
                      : N.hostname),
                    (D.port = N.port),
                    (function e(t, r, n) {
                      let o = r
                      if (!o && !1 !== o) {
                        let e = eL.default.getProxyForUrl(n)
                        e && (o = new URL(e))
                      }
                      if (o) {
                        if (
                          (o.username && (o.auth = (o.username || '') + ':' + (o.password || '')),
                          o.auth)
                        ) {
                          ;(o.auth.username || o.auth.password) &&
                            (o.auth = (o.auth.username || '') + ':' + (o.auth.password || ''))
                          let e = Buffer.from(o.auth, 'utf8').toString('base64')
                          t.headers['Proxy-Authorization'] = 'Basic ' + e
                        }
                        t.headers.host = t.hostname + (t.port ? ':' + t.port : '')
                        let e = o.hostname || o.host
                        ;((t.hostname = e),
                          (t.host = e),
                          (t.port = o.port),
                          (t.path = n),
                          o.protocol &&
                            (t.protocol = o.protocol.includes(':') ? o.protocol : `${o.protocol}:`))
                      }
                      t.beforeRedirects.proxy = function (t) {
                        e(t, r, t.href)
                      }
                    })(D, e.proxy, I + '//' + N.hostname + (N.port ? ':' + N.port : '') + D.path)))
              let L = ti.test(D.protocol)
              if (
                ((D.agent = L ? e.httpsAgent : e.httpAgent),
                w
                  ? (c = tf)
                  : e.transport
                    ? (c = e.transport)
                    : 0 === e.maxRedirects
                      ? (c = L ? ev.default : eP.default)
                      : (e.maxRedirects && (D.maxRedirects = e.maxRedirects),
                        e.beforeRedirect && (D.beforeRedirects.config = e.beforeRedirect),
                        (c = L ? to : tn)),
                e.maxBodyLength > -1
                  ? (D.maxBodyLength = e.maxBodyLength)
                  : (D.maxBodyLength = 1 / 0),
                e.insecureHTTPParser && (D.insecureHTTPParser = e.insecureHTTPParser),
                (l = c.request(D, function (n) {
                  if (l.destroyed) return
                  let o = [n],
                    s = $.toFiniteNumber(n.headers['content-length'])
                  if (_ || i) {
                    let e = new eW({ maxRate: $.toFiniteNumber(i) })
                    ;(_ && e.on('progress', ta(e, e5(s, e4(e3(_), !0, 3)))), o.push(e))
                  }
                  let a = n,
                    u = n.req || l
                  if (!1 !== e.decompress && n.headers['content-encoding'])
                    switch (
                      (('HEAD' === b || 204 === n.statusCode) &&
                        delete n.headers['content-encoding'],
                      (n.headers['content-encoding'] || '').toLowerCase())
                    ) {
                      case 'gzip':
                      case 'x-gzip':
                      case 'compress':
                      case 'x-compress':
                        ;(o.push(eF.default.createUnzip(e6)), delete n.headers['content-encoding'])
                        break
                      case 'deflate':
                        ;(o.push(new e0()),
                          o.push(eF.default.createUnzip(e6)),
                          delete n.headers['content-encoding'])
                        break
                      case 'br':
                        tr &&
                          (o.push(eF.default.createBrotliDecompress(e8)),
                          delete n.headers['content-encoding'])
                    }
                  a = o.length > 1 ? ez.default.pipeline(o, $.noop) : o[0]
                  let c = {
                    status: n.statusCode,
                    statusText: n.statusMessage,
                    headers: new eI(n.headers),
                    config: e,
                    request: u,
                  }
                  if ('stream' === y) ((c.data = a), ex(t, r, c))
                  else {
                    let n = [],
                      o = 0
                    ;(a.on('data', function (t) {
                      ;(n.push(t),
                        (o += t.length),
                        e.maxContentLength > -1 &&
                          o > e.maxContentLength &&
                          ((E = !0),
                          a.destroy(),
                          O(
                            new H(
                              'maxContentLength size of ' + e.maxContentLength + ' exceeded',
                              H.ERR_BAD_RESPONSE,
                              e,
                              u
                            )
                          )))
                    }),
                      a.on('aborted', function () {
                        if (E) return
                        let t = new H('stream has been aborted', H.ERR_BAD_RESPONSE, e, u)
                        ;(a.destroy(t), r(t))
                      }),
                      a.on('error', function (t) {
                        l.destroyed || r(H.from(t, null, e, u))
                      }),
                      a.on('end', function () {
                        try {
                          let e = 1 === n.length ? n[0] : Buffer.concat(n)
                          ;('arraybuffer' !== y &&
                            ((e = e.toString(g)), (g && 'utf8' !== g) || (e = $.stripBOM(e))),
                            (c.data = e))
                        } catch (t) {
                          return r(H.from(t, null, e, c.request, c))
                        }
                        ex(t, r, c)
                      }))
                  }
                  R.once('abort', (e) => {
                    a.destroyed || (a.emit('error', e), a.destroy())
                  })
                })),
                R.once('abort', (e) => {
                  l.close ? l.close() : l.destroy(e)
                }),
                l.on('error', function (t) {
                  r(H.from(t, null, e, l))
                }),
                l.on('socket', function (e) {
                  e.setKeepAlive(!0, 6e4)
                }),
                e.timeout)
              ) {
                let t = parseInt(e.timeout, 10)
                if (Number.isNaN(t))
                  return void O(
                    new H(
                      'error trying to parse `config.timeout` to int',
                      H.ERR_BAD_OPTION_VALUE,
                      e,
                      l
                    )
                  )
                l.setTimeout(t, function () {
                  if (a) return
                  let t = e.timeout
                      ? 'timeout of ' + e.timeout + 'ms exceeded'
                      : 'timeout exceeded',
                    r = e.transitional || ei
                  ;(e.timeoutErrorMessage && (t = e.timeoutErrorMessage),
                    O(new H(t, r.clarifyTimeoutError ? H.ETIMEDOUT : H.ECONNABORTED, e, l)))
                })
              }
              if ($.isStream(d)) {
                let t = !1,
                  r = !1
                ;(d.on('end', () => {
                  t = !0
                }),
                  d.once('error', (e) => {
                    ;((r = !0), l.destroy(e))
                  }),
                  d.on('close', () => {
                    t || r || O(new e_('Request stream has been aborted', e, l))
                  }),
                  d.pipe(l))
              } else (d && l.write(d), l.end())
            }),
            new Promise((e, r) => {
              let n,
                o,
                i = (e, t) => {
                  !o && ((o = !0), n && n(e, t))
                },
                s = (e) => {
                  ;(i(e, !0), r(e))
                }
              t(
                (t) => {
                  ;(i(t), e(t))
                },
                s,
                (e) => (n = e)
              ).catch(s)
            })
          )
        },
      tp = eb.hasStandardBrowserEnv
        ? ((n = new URL(eb.origin)),
          (o = eb.navigator && /(msie|trident)/i.test(eb.navigator.userAgent)),
          (e) => (
            (e = new URL(e, eb.origin)),
            n.protocol === e.protocol && n.host === e.host && (o || n.port === e.port)
          ))
        : () => !0,
      tm = eb.hasStandardBrowserEnv
        ? {
            write(e, t, r, n, o, i, s) {
              if ('undefined' == typeof document) return
              let a = [`${e}=${encodeURIComponent(t)}`]
              ;($.isNumber(r) && a.push(`expires=${new Date(r).toUTCString()}`),
                $.isString(n) && a.push(`path=${n}`),
                $.isString(o) && a.push(`domain=${o}`),
                !0 === i && a.push('secure'),
                $.isString(s) && a.push(`SameSite=${s}`),
                (document.cookie = a.join('; ')))
            },
            read(e) {
              if ('undefined' == typeof document) return null
              let t = document.cookie.match(RegExp('(?:^|; )' + e + '=([^;]*)'))
              return t ? decodeURIComponent(t[1]) : null
            },
            remove(e) {
              this.write(e, '', Date.now() - 864e5, '/')
            },
          }
        : { write() {}, read: () => null, remove() {} },
      ty = (e) => (e instanceof eI ? { ...e } : e)
    function tg(e, t) {
      t = t || {}
      let r = {}
      function n(e, t, r, n) {
        return $.isPlainObject(e) && $.isPlainObject(t)
          ? $.merge.call({ caseless: n }, e, t)
          : $.isPlainObject(t)
            ? $.merge({}, t)
            : $.isArray(t)
              ? t.slice()
              : t
      }
      function o(e, t, r, o) {
        return $.isUndefined(t) ? ($.isUndefined(e) ? void 0 : n(void 0, e, r, o)) : n(e, t, r, o)
      }
      function i(e, t) {
        if (!$.isUndefined(t)) return n(void 0, t)
      }
      function s(e, t) {
        return $.isUndefined(t) ? ($.isUndefined(e) ? void 0 : n(void 0, e)) : n(void 0, t)
      }
      function a(r, o, i) {
        return i in t ? n(r, o) : i in e ? n(void 0, r) : void 0
      }
      let l = {
        url: i,
        method: i,
        data: i,
        baseURL: s,
        transformRequest: s,
        transformResponse: s,
        paramsSerializer: s,
        timeout: s,
        timeoutMessage: s,
        withCredentials: s,
        withXSRFToken: s,
        adapter: s,
        responseType: s,
        xsrfCookieName: s,
        xsrfHeaderName: s,
        onUploadProgress: s,
        onDownloadProgress: s,
        decompress: s,
        maxContentLength: s,
        maxBodyLength: s,
        beforeRedirect: s,
        transport: s,
        httpAgent: s,
        httpsAgent: s,
        cancelToken: s,
        socketPath: s,
        responseEncoding: s,
        validateStatus: a,
        headers: (e, t, r) => o(ty(e), ty(t), r, !0),
      }
      return (
        $.forEach(Object.keys({ ...e, ...t }), function (n) {
          let i = l[n] || o,
            s = i(e[n], t[n], n)
          ;($.isUndefined(s) && i !== a) || (r[n] = s)
        }),
        r
      )
    }
    let tb = (e) => {
        let t = tg({}, e),
          {
            data: r,
            withXSRFToken: n,
            xsrfHeaderName: o,
            xsrfCookieName: i,
            headers: s,
            auth: a,
          } = t
        if (
          ((t.headers = s = eI.from(s)),
          (t.url = en(eD(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer)),
          a &&
            s.set(
              'Authorization',
              'Basic ' +
                btoa(
                  (a.username || '') +
                    ':' +
                    (a.password ? unescape(encodeURIComponent(a.password)) : '')
                )
            ),
          $.isFormData(r))
        ) {
          if (eb.hasStandardBrowserEnv || eb.hasStandardBrowserWebWorkerEnv)
            s.setContentType(void 0)
          else if ($.isFunction(r.getHeaders)) {
            let e = r.getHeaders(),
              t = ['content-type', 'content-length']
            Object.entries(e).forEach(([e, r]) => {
              t.includes(e.toLowerCase()) && s.set(e, r)
            })
          }
        }
        if (
          eb.hasStandardBrowserEnv &&
          (n && $.isFunction(n) && (n = n(t)), n || (!1 !== n && tp(t.url)))
        ) {
          let e = o && i && tm.read(i)
          e && s.set(o, e)
        }
        return t
      },
      tE =
        'undefined' != typeof XMLHttpRequest &&
        function (e) {
          return new Promise(function (t, r) {
            let n,
              o,
              i,
              s,
              a,
              l = tb(e),
              u = l.data,
              c = eI.from(l.headers).normalize(),
              { responseType: d, onUploadProgress: f, onDownloadProgress: h } = l
            function p() {
              ;(s && s(),
                a && a(),
                l.cancelToken && l.cancelToken.unsubscribe(n),
                l.signal && l.signal.removeEventListener('abort', n))
            }
            let m = new XMLHttpRequest()
            function y() {
              if (!m) return
              let n = eI.from('getAllResponseHeaders' in m && m.getAllResponseHeaders())
              ;(ex(
                function (e) {
                  ;(t(e), p())
                },
                function (e) {
                  ;(r(e), p())
                },
                {
                  data: d && 'text' !== d && 'json' !== d ? m.response : m.responseText,
                  status: m.status,
                  statusText: m.statusText,
                  headers: n,
                  config: e,
                  request: m,
                }
              ),
                (m = null))
            }
            ;(m.open(l.method.toUpperCase(), l.url, !0),
              (m.timeout = l.timeout),
              'onloadend' in m
                ? (m.onloadend = y)
                : (m.onreadystatechange = function () {
                    !m ||
                      4 !== m.readyState ||
                      ((0 !== m.status ||
                        (m.responseURL && 0 === m.responseURL.indexOf('file:'))) &&
                        setTimeout(y))
                  }),
              (m.onabort = function () {
                m && (r(new H('Request aborted', H.ECONNABORTED, e, m)), (m = null))
              }),
              (m.onerror = function (t) {
                let n = new H(t && t.message ? t.message : 'Network Error', H.ERR_NETWORK, e, m)
                ;((n.event = t || null), r(n), (m = null))
              }),
              (m.ontimeout = function () {
                let t = l.timeout ? 'timeout of ' + l.timeout + 'ms exceeded' : 'timeout exceeded',
                  n = l.transitional || ei
                ;(l.timeoutErrorMessage && (t = l.timeoutErrorMessage),
                  r(new H(t, n.clarifyTimeoutError ? H.ETIMEDOUT : H.ECONNABORTED, e, m)),
                  (m = null))
              }),
              void 0 === u && c.setContentType(null),
              'setRequestHeader' in m &&
                $.forEach(c.toJSON(), function (e, t) {
                  m.setRequestHeader(t, e)
                }),
              $.isUndefined(l.withCredentials) || (m.withCredentials = !!l.withCredentials),
              d && 'json' !== d && (m.responseType = l.responseType),
              h && (([i, a] = e4(h, !0)), m.addEventListener('progress', i)),
              f &&
                m.upload &&
                (([o, s] = e4(f)),
                m.upload.addEventListener('progress', o),
                m.upload.addEventListener('loadend', s)),
              (l.cancelToken || l.signal) &&
                ((n = (t) => {
                  m && (r(!t || t.type ? new e_(null, e, m) : t), m.abort(), (m = null))
                }),
                l.cancelToken && l.cancelToken.subscribe(n),
                l.signal && (l.signal.aborted ? n() : l.signal.addEventListener('abort', n))))
            let g = eM(l.url)
            g && -1 === eb.protocols.indexOf(g)
              ? r(new H('Unsupported protocol ' + g + ':', H.ERR_BAD_REQUEST, e))
              : m.send(u || null)
          })
        },
      tw = function* (e, t) {
        let r,
          n = e.byteLength
        if (!t || n < t) return void (yield e)
        let o = 0
        for (; o < n; ) ((r = o + t), yield e.slice(o, r), (o = r))
      },
      tR = async function* (e, t) {
        for await (let r of tO(e)) yield* tw(r, t)
      },
      tO = async function* (e) {
        if (e[Symbol.asyncIterator]) return void (yield* e)
        let t = e.getReader()
        try {
          for (;;) {
            let { done: e, value: r } = await t.read()
            if (e) break
            yield r
          }
        } finally {
          await t.cancel()
        }
      },
      tT = (e, t, r, n) => {
        let o,
          i = tR(e, t),
          s = 0,
          a = (e) => {
            !o && ((o = !0), n && n(e))
          }
        return new ReadableStream(
          {
            async pull(e) {
              try {
                let { done: t, value: n } = await i.next()
                if (t) {
                  ;(a(), e.close())
                  return
                }
                let o = n.byteLength
                if (r) {
                  let e = (s += o)
                  r(e)
                }
                e.enqueue(new Uint8Array(n))
              } catch (e) {
                throw (a(e), e)
              }
            },
            cancel: (e) => (a(e), i.return()),
          },
          { highWaterMark: 2 }
        )
      },
      { isFunction: tA } = $,
      tN = (({ Request: e, Response: t }) => ({ Request: e, Response: t }))($.global),
      { ReadableStream: tI, TextEncoder: tS } = $.global,
      tC = (e, ...t) => {
        try {
          return !!e(...t)
        } catch (e) {
          return !1
        }
      },
      t_ = (e) => {
        let t,
          { fetch: r, Request: n, Response: o } = (e = $.merge.call({ skipUndefined: !0 }, tN, e)),
          i = r ? tA(r) : 'function' == typeof fetch,
          s = tA(n),
          a = tA(o)
        if (!i) return !1
        let l = i && tA(tI),
          u =
            i &&
            ('function' == typeof tS
              ? ((t = new tS()), (e) => t.encode(e))
              : async (e) => new Uint8Array(await new n(e).arrayBuffer())),
          c =
            s &&
            l &&
            tC(() => {
              let e = !1,
                t = new n(eb.origin, {
                  body: new tI(),
                  method: 'POST',
                  get duplex() {
                    return ((e = !0), 'half')
                  },
                }).headers.has('Content-Type')
              return e && !t
            }),
          d = a && l && tC(() => $.isReadableStream(new o('').body)),
          f = { stream: d && ((e) => e.body) }
        i &&
          ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach((e) => {
            f[e] ||
              (f[e] = (t, r) => {
                let n = t && t[e]
                if (n) return n.call(t)
                throw new H(`Response type '${e}' is not supported`, H.ERR_NOT_SUPPORT, r)
              })
          })
        let h = async (e) => {
            if (null == e) return 0
            if ($.isBlob(e)) return e.size
            if ($.isSpecCompliantForm(e)) {
              let t = new n(eb.origin, { method: 'POST', body: e })
              return (await t.arrayBuffer()).byteLength
            }
            return $.isArrayBufferView(e) || $.isArrayBuffer(e)
              ? e.byteLength
              : ($.isURLSearchParams(e) && (e += ''), $.isString(e))
                ? (await u(e)).byteLength
                : void 0
          },
          p = async (e, t) => {
            let r = $.toFiniteNumber(e.getContentLength())
            return null == r ? h(t) : r
          }
        return async (e) => {
          let t,
            {
              url: i,
              method: a,
              data: l,
              signal: u,
              cancelToken: h,
              timeout: m,
              onDownloadProgress: y,
              onUploadProgress: g,
              responseType: b,
              headers: E,
              withCredentials: w = 'same-origin',
              fetchOptions: R,
            } = tb(e),
            O = r || fetch
          b = b ? (b + '').toLowerCase() : 'text'
          let T = ((e, t) => {
              let { length: r } = (e = e ? e.filter(Boolean) : [])
              if (t || r) {
                let r,
                  n = new AbortController(),
                  o = function (e) {
                    if (!r) {
                      ;((r = !0), s())
                      let t = e instanceof Error ? e : this.reason
                      n.abort(t instanceof H ? t : new e_(t instanceof Error ? t.message : t))
                    }
                  },
                  i =
                    t &&
                    setTimeout(() => {
                      ;((i = null), o(new H(`timeout ${t} of ms exceeded`, H.ETIMEDOUT)))
                    }, t),
                  s = () => {
                    e &&
                      (i && clearTimeout(i),
                      (i = null),
                      e.forEach((e) => {
                        e.unsubscribe ? e.unsubscribe(o) : e.removeEventListener('abort', o)
                      }),
                      (e = null))
                  }
                e.forEach((e) => e.addEventListener('abort', o))
                let { signal: a } = n
                return ((a.unsubscribe = () => $.asap(s)), a)
              }
            })([u, h && h.toAbortSignal()], m),
            A = null,
            N =
              T &&
              T.unsubscribe &&
              (() => {
                T.unsubscribe()
              })
          try {
            if (g && c && 'get' !== a && 'head' !== a && 0 !== (t = await p(E, l))) {
              let e,
                r = new n(i, { method: 'POST', body: l, duplex: 'half' })
              if (
                ($.isFormData(l) && (e = r.headers.get('content-type')) && E.setContentType(e),
                r.body)
              ) {
                let [e, n] = e5(t, e4(e3(g)))
                l = tT(r.body, 65536, e, n)
              }
            }
            $.isString(w) || (w = w ? 'include' : 'omit')
            let r = s && 'credentials' in n.prototype,
              u = {
                ...R,
                signal: T,
                method: a.toUpperCase(),
                headers: E.normalize().toJSON(),
                body: l,
                duplex: 'half',
                credentials: r ? w : void 0,
              }
            A = s && new n(i, u)
            let h = await (s ? O(A, R) : O(i, u)),
              m = d && ('stream' === b || 'response' === b)
            if (d && (y || (m && N))) {
              let e = {}
              ;['status', 'statusText', 'headers'].forEach((t) => {
                e[t] = h[t]
              })
              let t = $.toFiniteNumber(h.headers.get('content-length')),
                [r, n] = (y && e5(t, e4(e3(y), !0))) || []
              h = new o(
                tT(h.body, 65536, r, () => {
                  ;(n && n(), N && N())
                }),
                e
              )
            }
            b = b || 'text'
            let I = await f[$.findKey(f, b) || 'text'](h, e)
            return (
              !m && N && N(),
              await new Promise((t, r) => {
                ex(t, r, {
                  data: I,
                  headers: eI.from(h.headers),
                  status: h.status,
                  statusText: h.statusText,
                  config: e,
                  request: A,
                })
              })
            )
          } catch (t) {
            if ((N && N(), t && 'TypeError' === t.name && /Load failed|fetch/i.test(t.message)))
              throw Object.assign(new H('Network Error', H.ERR_NETWORK, e, A), {
                cause: t.cause || t,
              })
            throw H.from(t, t && t.code, e, A)
          }
        }
      },
      tk = new Map(),
      tx = (e) => {
        let t = (e && e.env) || {},
          { fetch: r, Request: n, Response: o } = t,
          i = [n, o, r],
          s = i.length,
          a,
          l,
          u = tk
        for (; s--; )
          ((a = i[s]), void 0 === (l = u.get(a)) && u.set(a, (l = s ? new Map() : t_(t))), (u = l))
        return l
      }
    tx()
    let tD = { http: th, xhr: tE, fetch: { get: tx } }
    $.forEach(tD, (e, t) => {
      if (e) {
        try {
          Object.defineProperty(e, 'name', { value: t })
        } catch (e) {}
        Object.defineProperty(e, 'adapterName', { value: t })
      }
    })
    let tL = (e) => `- ${e}`,
      tP = (e) => $.isFunction(e) || null === e || !1 === e,
      tv = function (e, t) {
        let r,
          n,
          { length: o } = (e = $.isArray(e) ? e : [e]),
          i = {}
        for (let s = 0; s < o; s++) {
          let o
          if (((n = r = e[s]), !tP(r) && void 0 === (n = tD[(o = String(r)).toLowerCase()])))
            throw new H(`Unknown adapter '${o}'`)
          if (n && ($.isFunction(n) || (n = n.get(t)))) break
          i[o || '#' + s] = n
        }
        if (!n) {
          let e = Object.entries(i).map(
            ([e, t]) =>
              `adapter ${e} ` +
              (!1 === t ? 'is not supported by the environment' : 'is not available in the build')
          )
          throw new H(
            'There is no suitable adapter to dispatch the request ' +
              (o
                ? e.length > 1
                  ? 'since :\n' + e.map(tL).join('\n')
                  : ' ' + tL(e[0])
                : 'as no adapter specified'),
            'ERR_NOT_SUPPORT'
          )
        }
        return n
      }
    function tU(e) {
      if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted))
        throw new e_(null, e)
    }
    function tB(e) {
      return (
        tU(e),
        (e.headers = eI.from(e.headers)),
        (e.data = eS.call(e, e.transformRequest)),
        -1 !== ['post', 'put', 'patch'].indexOf(e.method) &&
          e.headers.setContentType('application/x-www-form-urlencoded', !1),
        tv(
          e.adapter || ew.adapter,
          e
        )(e).then(
          function (t) {
            return (
              tU(e),
              (t.data = eS.call(e, e.transformResponse, t)),
              (t.headers = eI.from(t.headers)),
              t
            )
          },
          function (t) {
            return (
              !eC(t) &&
                (tU(e),
                t &&
                  t.response &&
                  ((t.response.data = eS.call(e, e.transformResponse, t.response)),
                  (t.response.headers = eI.from(t.response.headers)))),
              Promise.reject(t)
            )
          }
        )
      )
    }
    let tF = {}
    ;['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((e, t) => {
      tF[e] = function (r) {
        return typeof r === e || 'a' + (t < 1 ? 'n ' : ' ') + e
      }
    })
    let tj = {}
    ;((tF.transitional = function (e, t, r) {
      function n(e, t) {
        return '[Axios v' + ej + "] Transitional option '" + e + "'" + t + (r ? '. ' + r : '')
      }
      return (r, o, i) => {
        if (!1 === e)
          throw new H(n(o, ' has been removed' + (t ? ' in ' + t : '')), H.ERR_DEPRECATED)
        return (
          t &&
            !tj[o] &&
            ((tj[o] = !0),
            console.warn(
              n(o, ' has been deprecated since v' + t + ' and will be removed in the near future')
            )),
          !e || e(r, o, i)
        )
      }
    }),
      (tF.spelling = function (e) {
        return (t, r) => (console.warn(`${r} is likely a misspelling of ${e}`), !0)
      }))
    let tM = function (e, t, r) {
      if ('object' != typeof e) throw new H('options must be an object', H.ERR_BAD_OPTION_VALUE)
      let n = Object.keys(e),
        o = n.length
      for (; o-- > 0; ) {
        let i = n[o],
          s = t[i]
        if (s) {
          let t = e[i],
            r = void 0 === t || s(t, i, e)
          if (!0 !== r) throw new H('option ' + i + ' must be ' + r, H.ERR_BAD_OPTION_VALUE)
          continue
        }
        if (!0 !== r) throw new H('Unknown option ' + i, H.ERR_BAD_OPTION)
      }
    }
    class tq {
      constructor(e) {
        ;((this.defaults = e || {}),
          (this.interceptors = { request: new eo(), response: new eo() }))
      }
      async request(e, t) {
        try {
          return await this._request(e, t)
        } catch (e) {
          if (e instanceof Error) {
            let t = {}
            Error.captureStackTrace ? Error.captureStackTrace(t) : (t = Error())
            let r = t.stack ? t.stack.replace(/^.+\n/, '') : ''
            try {
              e.stack
                ? r &&
                  !String(e.stack).endsWith(r.replace(/^.+\n.+\n/, '')) &&
                  (e.stack += '\n' + r)
                : (e.stack = r)
            } catch (e) {}
          }
          throw e
        }
      }
      _request(e, t) {
        let r, n
        'string' == typeof e ? ((t = t || {}).url = e) : (t = e || {})
        let { transitional: o, paramsSerializer: i, headers: s } = (t = tg(this.defaults, t))
        ;(void 0 !== o &&
          tM(
            o,
            {
              silentJSONParsing: tF.transitional(tF.boolean),
              forcedJSONParsing: tF.transitional(tF.boolean),
              clarifyTimeoutError: tF.transitional(tF.boolean),
            },
            !1
          ),
          null != i &&
            ($.isFunction(i)
              ? (t.paramsSerializer = { serialize: i })
              : tM(i, { encode: tF.function, serialize: tF.function }, !0)),
          void 0 !== t.allowAbsoluteUrls ||
            (void 0 !== this.defaults.allowAbsoluteUrls
              ? (t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
              : (t.allowAbsoluteUrls = !0)),
          tM(
            t,
            { baseUrl: tF.spelling('baseURL'), withXsrfToken: tF.spelling('withXSRFToken') },
            !0
          ),
          (t.method = (t.method || this.defaults.method || 'get').toLowerCase()))
        let a = s && $.merge(s.common, s[t.method])
        ;(s &&
          $.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], (e) => {
            delete s[e]
          }),
          (t.headers = eI.concat(a, s)))
        let l = [],
          u = !0
        this.interceptors.request.forEach(function (e) {
          ;('function' != typeof e.runWhen || !1 !== e.runWhen(t)) &&
            ((u = u && e.synchronous), l.unshift(e.fulfilled, e.rejected))
        })
        let c = []
        this.interceptors.response.forEach(function (e) {
          c.push(e.fulfilled, e.rejected)
        })
        let d = 0
        if (!u) {
          let e = [tB.bind(this), void 0]
          for (e.unshift(...l), e.push(...c), n = e.length, r = Promise.resolve(t); d < n; )
            r = r.then(e[d++], e[d++])
          return r
        }
        n = l.length
        let f = t
        for (; d < n; ) {
          let e = l[d++],
            t = l[d++]
          try {
            f = e(f)
          } catch (e) {
            t.call(this, e)
            break
          }
        }
        try {
          r = tB.call(this, f)
        } catch (e) {
          return Promise.reject(e)
        }
        for (d = 0, n = c.length; d < n; ) r = r.then(c[d++], c[d++])
        return r
      }
      getUri(e) {
        return en(
          eD((e = tg(this.defaults, e)).baseURL, e.url, e.allowAbsoluteUrls),
          e.params,
          e.paramsSerializer
        )
      }
    }
    ;($.forEach(['delete', 'get', 'head', 'options'], function (e) {
      tq.prototype[e] = function (t, r) {
        return this.request(tg(r || {}, { method: e, url: t, data: (r || {}).data }))
      }
    }),
      $.forEach(['post', 'put', 'patch'], function (e) {
        function t(t) {
          return function (r, n, o) {
            return this.request(
              tg(o || {}, {
                method: e,
                headers: t ? { 'Content-Type': 'multipart/form-data' } : {},
                url: r,
                data: n,
              })
            )
          }
        }
        ;((tq.prototype[e] = t()), (tq.prototype[e + 'Form'] = t(!0)))
      }))
    class tz {
      constructor(e) {
        let t
        if ('function' != typeof e) throw TypeError('executor must be a function.')
        this.promise = new Promise(function (e) {
          t = e
        })
        const r = this
        ;(this.promise.then((e) => {
          if (!r._listeners) return
          let t = r._listeners.length
          for (; t-- > 0; ) r._listeners[t](e)
          r._listeners = null
        }),
          (this.promise.then = (e) => {
            let t,
              n = new Promise((e) => {
                ;(r.subscribe(e), (t = e))
              }).then(e)
            return (
              (n.cancel = function () {
                r.unsubscribe(t)
              }),
              n
            )
          }),
          e(function (e, n, o) {
            r.reason || ((r.reason = new e_(e, n, o)), t(r.reason))
          }))
      }
      throwIfRequested() {
        if (this.reason) throw this.reason
      }
      subscribe(e) {
        this.reason
          ? e(this.reason)
          : this._listeners
            ? this._listeners.push(e)
            : (this._listeners = [e])
      }
      unsubscribe(e) {
        if (!this._listeners) return
        let t = this._listeners.indexOf(e)
        ;-1 !== t && this._listeners.splice(t, 1)
      }
      toAbortSignal() {
        let e = new AbortController(),
          t = (t) => {
            e.abort(t)
          }
        return (this.subscribe(t), (e.signal.unsubscribe = () => this.unsubscribe(t)), e.signal)
      }
      static source() {
        let e
        return {
          token: new tz(function (t) {
            e = t
          }),
          cancel: e,
        }
      }
    }
    let t$ = {
      Continue: 100,
      SwitchingProtocols: 101,
      Processing: 102,
      EarlyHints: 103,
      Ok: 200,
      Created: 201,
      Accepted: 202,
      NonAuthoritativeInformation: 203,
      NoContent: 204,
      ResetContent: 205,
      PartialContent: 206,
      MultiStatus: 207,
      AlreadyReported: 208,
      ImUsed: 226,
      MultipleChoices: 300,
      MovedPermanently: 301,
      Found: 302,
      SeeOther: 303,
      NotModified: 304,
      UseProxy: 305,
      Unused: 306,
      TemporaryRedirect: 307,
      PermanentRedirect: 308,
      BadRequest: 400,
      Unauthorized: 401,
      PaymentRequired: 402,
      Forbidden: 403,
      NotFound: 404,
      MethodNotAllowed: 405,
      NotAcceptable: 406,
      ProxyAuthenticationRequired: 407,
      RequestTimeout: 408,
      Conflict: 409,
      Gone: 410,
      LengthRequired: 411,
      PreconditionFailed: 412,
      PayloadTooLarge: 413,
      UriTooLong: 414,
      UnsupportedMediaType: 415,
      RangeNotSatisfiable: 416,
      ExpectationFailed: 417,
      ImATeapot: 418,
      MisdirectedRequest: 421,
      UnprocessableEntity: 422,
      Locked: 423,
      FailedDependency: 424,
      TooEarly: 425,
      UpgradeRequired: 426,
      PreconditionRequired: 428,
      TooManyRequests: 429,
      RequestHeaderFieldsTooLarge: 431,
      UnavailableForLegalReasons: 451,
      InternalServerError: 500,
      NotImplemented: 501,
      BadGateway: 502,
      ServiceUnavailable: 503,
      GatewayTimeout: 504,
      HttpVersionNotSupported: 505,
      VariantAlsoNegotiates: 506,
      InsufficientStorage: 507,
      LoopDetected: 508,
      NotExtended: 510,
      NetworkAuthenticationRequired: 511,
      WebServerIsDown: 521,
      ConnectionTimedOut: 522,
      OriginIsUnreachable: 523,
      TimeoutOccurred: 524,
      SslHandshakeFailed: 525,
      InvalidSslCertificate: 526,
    }
    Object.entries(t$).forEach(([e, t]) => {
      t$[t] = e
    })
    let tH = (function e(t) {
      let r = new tq(t),
        n = i(tq.prototype.request, r)
      return (
        $.extend(n, tq.prototype, r, { allOwnKeys: !0 }),
        $.extend(n, r, null, { allOwnKeys: !0 }),
        (n.create = function (r) {
          return e(tg(t, r))
        }),
        n
      )
    })(ew)
    ;((tH.Axios = tq),
      (tH.CanceledError = e_),
      (tH.CancelToken = tz),
      (tH.isCancel = eC),
      (tH.VERSION = ej),
      (tH.toFormData = X),
      (tH.AxiosError = H),
      (tH.Cancel = tH.CanceledError),
      (tH.all = function (e) {
        return Promise.all(e)
      }),
      (tH.spread = function (e) {
        return function (t) {
          return e.apply(null, t)
        }
      }),
      (tH.isAxiosError = function (e) {
        return $.isObject(e) && !0 === e.isAxiosError
      }),
      (tH.mergeConfig = tg),
      (tH.AxiosHeaders = eI),
      (tH.formToJSON = (e) => eE($.isHTMLForm(e) ? new FormData(e) : e)),
      (tH.getAdapter = tv),
      (tH.HttpStatusCode = t$),
      (tH.default = tH))
    var tW = e.i(657446),
      tG = e.i(29173)
    let tK = process.env.WORKER_API_KEY || '',
      tJ = new (class {
        client
        config
        constructor(e) {
          ;((this.config = {
            ...{
              baseURL: process.env.WORKER_API_URL || 'http://localhost:3001',
              apiKey: tK,
              timeout: parseInt(process.env.WORKER_API_TIMEOUT || '10000', 10),
              maxRetries: 3,
              retryDelay: 1e3,
            },
            ...e,
          }),
            (this.client = tH.create({
              baseURL: this.config.baseURL,
              timeout: this.config.timeout,
              headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
              },
            })),
            this.client.interceptors.request.use((e) => e),
            this.client.interceptors.response.use(
              (e) => e,
              async (e) => this.handleError(e)
            ))
        }
        async handleError(e) {
          let t = e.config
          if (e.response?.status === 401 || e.response?.status === 403)
            throw this.createWorkerApiError(e)
          if (
            (!e.response || e.response.status >= 500) &&
            (t._retryCount || 0) < (this.config.maxRetries || 3) &&
            t
          ) {
            t._retryCount = (t._retryCount || 0) + 1
            let e = this.config.retryDelay * t._retryCount
            return (
              console.log(
                `⏳ Retrying worker API request (attempt ${t._retryCount}/${this.config.maxRetries}) after ${e}ms...`
              ),
              await new Promise((t) => setTimeout(t, e)),
              this.client.request(t)
            )
          }
          throw this.createWorkerApiError(e)
        }
        createWorkerApiError(e) {
          let t = e.response?.data?.error,
            r = Error(t?.message || e.message || 'Worker API request failed')
          return (
            (r.name = 'WorkerApiError'),
            (r.code = t?.code || 'UNKNOWN_ERROR'),
            (r.statusCode = e.response?.status || 500),
            (r.details = t?.details),
            r
          )
        }
        async scheduleBookingReminder(e) {
          try {
            let t = new Date(e.serviceDateTime),
              r = new Date(t.getTime() - 72e5),
              n = await tW.prisma.taskQueue.create({
                data: {
                  type: 'BOOKING_REMINDER',
                  jobId: e.bookingId,
                  payload: JSON.stringify(e),
                  scheduledAt: r,
                  status: 'PENDING',
                },
              })
            return {
              bookingId: e.bookingId,
              type: 'booking_reminder',
              status: 'scheduled',
              serviceDateTime: e.serviceDateTime,
              reminderTime: n.scheduledAt.toISOString(),
            }
          } catch (t) {
            if (t instanceof tG.Prisma.PrismaClientKnownRequestError && 'P2002' === t.code) {
              let t = await tW.prisma.taskQueue.findFirst({
                where: {
                  type: 'BOOKING_REMINDER',
                  jobId: e.bookingId,
                  status: { in: ['PENDING', 'RUNNING'] },
                },
              })
              if (!t)
                throw Error(
                  `Race condition detected but no existing reminder found for booking: ${e.bookingId}`
                )
              return {
                bookingId: e.bookingId,
                type: 'booking_reminder',
                status: 'scheduled',
                serviceDateTime: e.serviceDateTime,
                reminderTime: t.scheduledAt.toISOString(),
              }
            }
            throw t
          }
        }
        async scheduleTodayNotification(e) {
          try {
            let t = new Date(e.serviceDate),
              r = new Date(t)
            r.setHours(8, 0, 0, 0)
            let n = await tW.prisma.taskQueue.create({
              data: {
                type: 'TODAY_NOTIFICATION',
                jobId: `${e.bookingId}-today`,
                payload: JSON.stringify(e),
                scheduledAt: r,
                status: 'PENDING',
              },
            })
            return {
              bookingId: e.bookingId,
              type: 'today_booking',
              status: 'scheduled',
              notificationTime: n.scheduledAt.toISOString(),
            }
          } catch (t) {
            if (t instanceof tG.Prisma.PrismaClientKnownRequestError && 'P2002' === t.code) {
              let t = await tW.prisma.taskQueue.findFirst({
                where: {
                  type: 'TODAY_NOTIFICATION',
                  jobId: `${e.bookingId}-today`,
                  status: { in: ['PENDING', 'RUNNING'] },
                },
              })
              if (!t)
                throw Error(
                  `Race condition detected but no existing today notification found for booking: ${e.bookingId}`
                )
              return {
                bookingId: e.bookingId,
                type: 'today_booking',
                status: 'scheduled',
                notificationTime: t.scheduledAt.toISOString(),
              }
            }
            throw t
          }
        }
        async sendImmediateNotification(e) {
          try {
            let t = e.bookingId
              ? `${e.bookingId}-immediate-${Date.now()}`
              : `immediate-${Date.now()}`
            return (
              await tW.prisma.taskQueue.create({
                data: {
                  type: 'IMMEDIATE_NOTIFICATION',
                  jobId: t,
                  payload: JSON.stringify(e),
                  scheduledAt: new Date(),
                  status: 'PENDING',
                },
              }),
              {
                bookingId: e.bookingId,
                type: e.type,
                status: 'queued',
                targetAudience: e.targetAudience,
                title: e.title,
                priority: 'high',
              }
            )
          } catch (e) {
            throw (console.error('Failed to create immediate notification task:', e), e)
          }
        }
        async cancelBookingNotifications(e) {
          return (
            await tW.prisma.$transaction(async (t) => {
              await t.taskQueue.updateMany({
                where: {
                  type: {
                    in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'],
                  },
                  OR: [
                    { jobId: e },
                    { jobId: `${e}-today` },
                    { jobId: { startsWith: `${e}-immediate-` } },
                  ],
                  status: { in: ['PENDING', 'RUNNING'] },
                },
                data: { status: 'CANCELLED' },
              })
            }),
            {
              bookingId: e,
              status: 'cancelled',
              message: 'All scheduled notifications for this booking have been cancelled',
            }
          )
        }
        async getNotificationQueueStatus() {
          let [e, t, r, n, o] = await Promise.all([
            tW.prisma.taskQueue.count({
              where: {
                type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
                status: 'PENDING',
              },
            }),
            tW.prisma.taskQueue.count({
              where: {
                type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
                status: 'RUNNING',
              },
            }),
            tW.prisma.taskQueue.count({
              where: {
                type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
                status: 'COMPLETED',
              },
            }),
            tW.prisma.taskQueue.count({
              where: {
                type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
                status: 'FAILED',
              },
            }),
            tW.prisma.taskQueue.count({
              where: {
                type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
                status: 'CANCELLED',
              },
            }),
          ])
          return {
            queue: 'notification',
            counts: {
              waiting: e,
              active: t,
              completed: r,
              failed: n,
              delayed: await tW.prisma.taskQueue.count({
                where: {
                  type: {
                    in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'],
                  },
                  status: 'PENDING',
                  scheduledAt: { gt: new Date() },
                },
              }),
              total: e + t + r + n + o,
            },
          }
        }
        async schedulePaymentCleanup(e) {
          try {
            let t = await tW.prisma.taskQueue.create({
              data: {
                type: 'PAYMENT_CLEANUP',
                jobId: e.paymentId,
                payload: JSON.stringify(e),
                scheduledAt: new Date(Date.now() + 3e5),
                status: 'PENDING',
              },
            })
            return {
              bookingId: e.bookingId,
              cleanupTime: t.scheduledAt.toISOString(),
              delayMs: 3e5,
              jobId: t.id,
              paymentId: e.paymentId,
              status: 'scheduled',
            }
          } catch (t) {
            if (t instanceof tG.Prisma.PrismaClientKnownRequestError && 'P2002' === t.code) {
              let t = await tW.prisma.taskQueue.findFirst({
                where: {
                  type: 'PAYMENT_CLEANUP',
                  jobId: e.paymentId,
                  status: { in: ['PENDING', 'RUNNING'] },
                },
              })
              if (!t)
                throw Error(
                  `Race condition detected but no existing task found for payment: ${e.paymentId}`
                )
              return {
                bookingId: e.bookingId,
                cleanupTime: t.scheduledAt.toISOString(),
                delayMs: 3e5,
                jobId: t.id,
                paymentId: e.paymentId,
                status: 'scheduled',
              }
            }
            throw t
          }
        }
        async cancelPaymentCleanup(e) {
          return (
            await tW.prisma.$transaction(async (t) => {
              await t.taskQueue.updateMany({
                where: {
                  type: 'PAYMENT_CLEANUP',
                  jobId: e,
                  status: { in: ['PENDING', 'RUNNING'] },
                },
                data: { status: 'CANCELLED' },
              })
            }),
            { paymentId: e, status: 'cancelled', message: 'Payment cleanup job has been cancelled' }
          )
        }
        async executePaymentCleanup(e) {
          try {
            let t = await tW.prisma.taskQueue.create({
              data: {
                type: 'PAYMENT_CLEANUP',
                jobId: `${e.paymentId}-immediate`,
                payload: JSON.stringify(e),
                scheduledAt: new Date(),
                status: 'PENDING',
              },
            })
            return {
              jobId: t.id,
              paymentId: e.paymentId,
              bookingId: e.bookingId,
              delayMs: 0,
              cleanupTime: t.scheduledAt.toISOString(),
              status: 'queued',
              priority: 'high',
              message: 'Immediate payment cleanup queued',
            }
          } catch (e) {
            throw (console.error('Failed to execute immediate payment cleanup:', e), e)
          }
        }
      })()
    e.s(['workerApiClient', 0, tJ], 398163)
  },
]

//# sourceMappingURL=src_lib_worker-api-client_ts_ee28cdab._.js.map
