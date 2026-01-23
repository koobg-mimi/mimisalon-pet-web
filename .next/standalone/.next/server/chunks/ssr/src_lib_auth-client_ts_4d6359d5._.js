module.exports = [
  529139,
  (a) => {
    'use strict'
    let b, c, d
    var e = Object.defineProperty,
      f = Object.defineProperties,
      g = Object.getOwnPropertyDescriptors,
      h = Object.getOwnPropertySymbols,
      i = Object.prototype.hasOwnProperty,
      j = Object.prototype.propertyIsEnumerable,
      k = (a, b, c) =>
        b in a ? e(a, b, { enumerable: !0, configurable: !0, writable: !0, value: c }) : (a[b] = c),
      l = (a, b) => {
        for (var c in b || (b = {})) i.call(b, c) && k(a, c, b[c])
        if (h) for (var c of h(b)) j.call(b, c) && k(a, c, b[c])
        return a
      },
      m = (a, b) => f(a, g(b)),
      n = class extends Error {
        constructor(a, b, c) {
          ;(super(b || a.toString(), { cause: c }),
            (this.status = a),
            (this.statusText = b),
            (this.error = c))
        }
      },
      o = async (a, b) => {
        var c, d, e, f, g, h
        let i = b || {},
          j = {
            onRequest: [null == b ? void 0 : b.onRequest],
            onResponse: [null == b ? void 0 : b.onResponse],
            onSuccess: [null == b ? void 0 : b.onSuccess],
            onError: [null == b ? void 0 : b.onError],
            onRetry: [null == b ? void 0 : b.onRetry],
          }
        if (!b || !(null == b ? void 0 : b.plugins)) return { url: a, options: i, hooks: j }
        for (let k of (null == b ? void 0 : b.plugins) || []) {
          if (k.init) {
            let d = await (null == (c = k.init) ? void 0 : c.call(k, a.toString(), b))
            ;((i = d.options || i), (a = d.url))
          }
          ;(j.onRequest.push(null == (d = k.hooks) ? void 0 : d.onRequest),
            j.onResponse.push(null == (e = k.hooks) ? void 0 : e.onResponse),
            j.onSuccess.push(null == (f = k.hooks) ? void 0 : f.onSuccess),
            j.onError.push(null == (g = k.hooks) ? void 0 : g.onError),
            j.onRetry.push(null == (h = k.hooks) ? void 0 : h.onRetry))
        }
        return { url: a, options: i, hooks: j }
      },
      p = class {
        constructor(a) {
          this.options = a
        }
        shouldAttemptRetry(a, b) {
          return this.options.shouldRetry
            ? Promise.resolve(a < this.options.attempts && this.options.shouldRetry(b))
            : Promise.resolve(a < this.options.attempts)
        }
        getDelay() {
          return this.options.delay
        }
      },
      q = class {
        constructor(a) {
          this.options = a
        }
        shouldAttemptRetry(a, b) {
          return this.options.shouldRetry
            ? Promise.resolve(a < this.options.attempts && this.options.shouldRetry(b))
            : Promise.resolve(a < this.options.attempts)
        }
        getDelay(a) {
          return Math.min(this.options.maxDelay, this.options.baseDelay * 2 ** a)
        }
      },
      r = async (a) => {
        let b = {},
          c = async (a) => ('function' == typeof a ? await a() : a)
        if (null == a ? void 0 : a.auth) {
          if ('Bearer' === a.auth.type) {
            let d = await c(a.auth.token)
            if (!d) return b
            b.authorization = `Bearer ${d}`
          } else if ('Basic' === a.auth.type) {
            let d = c(a.auth.username),
              e = c(a.auth.password)
            if (!d || !e) return b
            b.authorization = `Basic ${btoa(`${d}:${e}`)}`
          } else if ('Custom' === a.auth.type) {
            let d = c(a.auth.value)
            if (!d) return b
            b.authorization = `${c(a.auth.prefix)} ${d}`
          }
        }
        return b
      },
      s = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i
    function t(a) {
      if (void 0 === a) return !1
      let b = typeof a
      return (
        'string' === b ||
        'number' === b ||
        'boolean' === b ||
        null === b ||
        ('object' === b &&
          (!!Array.isArray(a) ||
            (!a.buffer &&
              ((a.constructor && 'Object' === a.constructor.name) ||
                'function' == typeof a.toJSON))))
      )
    }
    function u(a) {
      try {
        return JSON.parse(a)
      } catch (b) {
        return a
      }
    }
    async function v(a) {
      let b = new Headers(null == a ? void 0 : a.headers)
      for (let [c, d] of Object.entries((await r(a)) || {})) b.set(c, d)
      if (!b.has('content-type')) {
        let c = t(null == a ? void 0 : a.body) ? 'application/json' : null
        c && b.set('content-type', c)
      }
      return b
    }
    var w = class a extends Error {
      constructor(b, c) {
        ;(super(c || JSON.stringify(b, null, 2)),
          (this.issues = b),
          Object.setPrototypeOf(this, a.prototype))
      }
    }
    async function x(a, b) {
      let c = await a['~standard'].validate(b)
      if (c.issues) throw new w(c.issues)
      return c.value
    }
    var y = ['get', 'post', 'put', 'patch', 'delete'],
      z = async (a, b) => {
        var c, d, e, f, g, h, i, j
        let k,
          { hooks: r, url: w, options: A } = await o(a, b),
          B = (function (a) {
            if (null == a ? void 0 : a.customFetchImpl) return a.customFetchImpl
            if ('undefined' != typeof globalThis && 'function' == typeof globalThis.fetch)
              return globalThis.fetch
            throw Error('No fetch implementation found')
          })(A),
          C = new AbortController(),
          D = null != (c = A.signal) ? c : C.signal,
          E = (function (a, b) {
            let { baseURL: c, params: d, query: e } = b || { query: {}, params: {}, baseURL: '' },
              f = a.startsWith('http') ? a.split('/').slice(0, 3).join('/') : c || ''
            if (a.startsWith('@')) {
              let b = a.toString().split('@')[1].split('/')[0]
              y.includes(b) && (a = a.replace(`@${b}/`, '/'))
            }
            f.endsWith('/') || (f += '/')
            let [g, h] = a.replace(f, '').split('?'),
              i = new URLSearchParams(h)
            for (let [a, b] of Object.entries(e || {})) null != b && i.set(a, String(b))
            if (d)
              if (Array.isArray(d))
                for (let [a, b] of g
                  .split('/')
                  .filter((a) => a.startsWith(':'))
                  .entries()) {
                  let c = d[a]
                  g = g.replace(b, c)
                }
              else for (let [a, b] of Object.entries(d)) g = g.replace(`:${a}`, String(b))
            ;(g = g.split('/').map(encodeURIComponent).join('/')).startsWith('/') &&
              (g = g.slice(1))
            let j = i.toString()
            return ((j = j.length > 0 ? `?${j}`.replace(/\+/g, '%20') : ''), f.startsWith('http'))
              ? new URL(`${g}${j}`, f)
              : `${f}${g}${j}`
          })(w, A),
          F = (function (a) {
            if (!(null == a ? void 0 : a.body)) return null
            let b = new Headers(null == a ? void 0 : a.headers)
            if (t(a.body) && !b.has('content-type')) {
              for (let [b, c] of Object.entries(null == a ? void 0 : a.body))
                c instanceof Date && (a.body[b] = c.toISOString())
              return JSON.stringify(a.body)
            }
            return a.body
          })(A),
          G = await v(A),
          H = (function (a, b) {
            var c
            if (null == b ? void 0 : b.method) return b.method.toUpperCase()
            if (a.startsWith('@')) {
              let d = null == (c = a.split('@')[1]) ? void 0 : c.split('/')[0]
              return y.includes(d)
                ? d.toUpperCase()
                : (null == b ? void 0 : b.body)
                  ? 'POST'
                  : 'GET'
            }
            return (null == b ? void 0 : b.body) ? 'POST' : 'GET'
          })(w, A),
          I = m(l({}, A), { url: E, headers: G, body: F, method: H, signal: D })
        for (let a of r.onRequest)
          if (a) {
            let b = await a(I)
            b instanceof Object && (I = b)
          }
        ;(('pipeTo' in I && 'function' == typeof I.pipeTo) ||
          'function' == typeof (null == (d = null == b ? void 0 : b.body) ? void 0 : d.pipe)) &&
          !('duplex' in I) &&
          (I.duplex = 'half')
        let { clearTimeout: J } =
            (!(null == A ? void 0 : A.signal) &&
              (null == A ? void 0 : A.timeout) &&
              (k = setTimeout(
                () => (null == C ? void 0 : C.abort()),
                null == A ? void 0 : A.timeout
              )),
            {
              abortTimeout: k,
              clearTimeout: () => {
                k && clearTimeout(k)
              },
            }),
          K = await B(I.url, I)
        J()
        let L = { response: K, request: I }
        for (let a of r.onResponse)
          if (a) {
            let c = await a(
              m(l({}, L), {
                response: (
                  null == (e = null == b ? void 0 : b.hookOptions) ? void 0 : e.cloneResponse
                )
                  ? K.clone()
                  : K,
              })
            )
            c instanceof Response ? (K = c) : c instanceof Object && (K = c.response)
          }
        if (K.ok) {
          if ('HEAD' === I.method) return { data: '', error: null }
          let a = (function (a) {
              let b = a.headers.get('content-type'),
                c = new Set([
                  'image/svg',
                  'application/xml',
                  'application/xhtml',
                  'application/html',
                ])
              if (!b) return 'json'
              let d = b.split(';').shift() || ''
              return s.test(d) ? 'json' : c.has(d) || d.startsWith('text/') ? 'text' : 'blob'
            })(K),
            c = { data: '', response: K, request: I }
          if ('json' === a || 'text' === a) {
            let a = await K.text(),
              b = null != (f = I.jsonParser) ? f : u
            c.data = await b(a)
          } else c.data = await K[a]()
          for (let a of ((null == I ? void 0 : I.output) &&
            I.output &&
            !I.disableValidation &&
            (c.data = await x(I.output, c.data)),
          r.onSuccess))
            a &&
              (await a(
                m(l({}, c), {
                  response: (
                    null == (g = null == b ? void 0 : b.hookOptions) ? void 0 : g.cloneResponse
                  )
                    ? K.clone()
                    : K,
                })
              ))
          return (null == b ? void 0 : b.throw) ? c.data : { data: c.data, error: null }
        }
        let M = null != (h = null == b ? void 0 : b.jsonParser) ? h : u,
          N = await K.text(),
          O = (function (a) {
            try {
              return (JSON.parse(a), !0)
            } catch (a) {
              return !1
            }
          })(N),
          P = O ? await M(N) : null,
          Q = {
            response: K,
            responseText: N,
            request: I,
            error: m(l({}, P), { status: K.status, statusText: K.statusText }),
          }
        for (let a of r.onError)
          a &&
            (await a(
              m(l({}, Q), {
                response: (
                  null == (i = null == b ? void 0 : b.hookOptions) ? void 0 : i.cloneResponse
                )
                  ? K.clone()
                  : K,
              })
            ))
        if (null == b ? void 0 : b.retry) {
          let c = (function (a) {
              if ('number' == typeof a) return new p({ type: 'linear', attempts: a, delay: 1e3 })
              switch (a.type) {
                case 'linear':
                  return new p(a)
                case 'exponential':
                  return new q(a)
                default:
                  throw Error('Invalid retry strategy')
              }
            })(b.retry),
            d = null != (j = b.retryAttempt) ? j : 0
          if (await c.shouldAttemptRetry(d, K)) {
            for (let a of r.onRetry) a && (await a(L))
            let e = c.getDelay(d)
            return (
              await new Promise((a) => setTimeout(a, e)),
              await z(a, m(l({}, b), { retryAttempt: d + 1 }))
            )
          }
        }
        if (null == b ? void 0 : b.throw) throw new n(K.status, K.statusText, O ? P : N)
        return { data: null, error: m(l({}, P), { status: K.status, statusText: K.statusText }) }
      }
    let A = Object.create(null),
      B = (a) =>
        globalThis.process?.env ||
        globalThis.Deno?.env.toObject() ||
        globalThis.__env__ ||
        (a ? A : globalThis),
      C = new Proxy(A, {
        get: (a, b) => B()[b] ?? A[b],
        has: (a, b) => b in B() || b in A,
        set: (a, b, c) => ((B(!0)[b] = c), !0),
        deleteProperty(a, b) {
          if (!b) return !1
          let c = B(!0)
          return (delete c[b], !0)
        },
        ownKeys: () => Object.keys(B(!0)),
      })
    function D(a, b) {
      return 'undefined' != typeof process && process.env
        ? (process.env[a] ?? b)
        : 'undefined' != typeof Deno
          ? (Deno.env.get(a) ?? b)
          : 'undefined' != typeof Bun
            ? (Bun.env[a] ?? b)
            : b
    }
    ;('undefined' != typeof process && process.env,
      Object.freeze({
        get BETTER_AUTH_SECRET() {
          return D('BETTER_AUTH_SECRET')
        },
        get AUTH_SECRET() {
          return D('AUTH_SECRET')
        },
        get BETTER_AUTH_TELEMETRY() {
          return D('BETTER_AUTH_TELEMETRY')
        },
        get BETTER_AUTH_TELEMETRY_ID() {
          return D('BETTER_AUTH_TELEMETRY_ID')
        },
        get NODE_ENV() {
          return D('NODE_ENV', 'development')
        },
        get PACKAGE_VERSION() {
          return D('PACKAGE_VERSION', '0.0.0')
        },
        get BETTER_AUTH_TELEMETRY_ENDPOINT() {
          return D('BETTER_AUTH_TELEMETRY_ENDPOINT', 'https://telemetry.better-auth.com/v1/track')
        },
      }))
    let E = {
        eterm: 4,
        cons25: 4,
        console: 4,
        cygwin: 4,
        dtterm: 4,
        gnome: 4,
        hurd: 4,
        jfbterm: 4,
        konsole: 4,
        kterm: 4,
        mlterm: 4,
        mosh: 24,
        putty: 4,
        st: 4,
        'rxvt-unicode-24bit': 24,
        terminator: 24,
        'xterm-kitty': 24,
      },
      F = new Map(
        Object.entries({
          APPVEYOR: 8,
          BUILDKITE: 8,
          CIRCLECI: 24,
          DRONE: 8,
          GITEA_ACTIONS: 24,
          GITHUB_ACTIONS: 24,
          GITLAB_CI: 8,
          TRAVIS: 8,
        })
      ),
      G = [
        /ansi/,
        /color/,
        /linux/,
        /direct/,
        /^con[0-9]*x[0-9]/,
        /^rxvt/,
        /^screen/,
        /^xterm/,
        /^vt100/,
        /^vt220/,
      ],
      H = '\x1b[0m',
      I = '\x1b[31m',
      J = '\x1b[32m',
      K = '\x1b[33m',
      L = '\x1b[34m',
      M = '\x1b[35m',
      N = ['info', 'success', 'warn', 'error', 'debug'],
      O = { info: L, success: J, warn: K, error: I, debug: M }
    ;((b = void 0 ?? 'error'),
      (c =
        1 !==
        (function () {
          if (void 0 !== D('FORCE_COLOR'))
            switch (D('FORCE_COLOR')) {
              case '':
              case '1':
              case 'true':
                return 4
              case '2':
                return 8
              case '3':
                return 24
              default:
                return 1
            }
          if (
            (void 0 !== D('NODE_DISABLE_COLORS') && '' !== D('NODE_DISABLE_COLORS')) ||
            (void 0 !== D('NO_COLOR') && '' !== D('NO_COLOR')) ||
            'dumb' === D('TERM')
          )
            return 1
          if (D('TMUX')) return 24
          if ('TF_BUILD' in C && 'AGENT_NAME' in C) return 4
          if ('CI' in C) {
            for (let { 0: a, 1: b } of F) if (a in C) return b
            return 'codeship' === D('CI_NAME') ? 8 : 1
          }
          if ('TEAMCITY_VERSION' in C)
            return null !== /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec(D('TEAMCITY_VERSION')) ? 4 : 1
          switch (D('TERM_PROGRAM')) {
            case 'iTerm.app':
              if (!D('TERM_PROGRAM_VERSION') || null !== /^[0-2]\./.exec(D('TERM_PROGRAM_VERSION')))
                return 8
              return 24
            case 'HyperTerm':
            case 'MacTerm':
              return 24
            case 'Apple_Terminal':
              return 8
          }
          if ('truecolor' === D('COLORTERM') || '24bit' === D('COLORTERM')) return 24
          if (D('TERM')) {
            if (null !== /truecolor/.exec(D('TERM'))) return 24
            if (null !== /^xterm-256/.exec(D('TERM'))) return 8
            let a = D('TERM').toLowerCase()
            if (E[a]) return E[a]
            if (G.some((b) => null !== b.exec(a))) return 4
          }
          return D('COLORTERM') ? 4 : 1
        })()),
      Object.fromEntries(
        N.map((a) => [
          a,
          (...[d, ...e]) =>
            ((a, d, e = []) => {
              let f
              if (!(N.indexOf(a) <= N.indexOf(b))) return
              let g =
                ((f = new Date().toISOString()),
                c
                  ? `\x1b[2m${f}${H} ${O[a]}${a.toUpperCase()}${H} \x1b[1m[Better Auth]:${H} ${d}`
                  : `${f} ${a.toUpperCase()} [Better Auth]: ${d}`)
              'error' === a
                ? console.error(g, ...e)
                : 'warn' === a
                  ? console.warn(g, ...e)
                  : console.log(g, ...e)
            })(a, d, e),
        ])
      ))
    class P extends Error {
      constructor(a, b) {
        ;(super(a),
          (this.name = 'BetterAuthError'),
          (this.message = a),
          (this.cause = b),
          (this.stack = ''))
      }
    }
    function Q(a, b = '/api/auth') {
      if (
        (function (a) {
          try {
            let b = new URL(a).pathname.replace(/\/+$/, '') || '/'
            return '/' !== b
          } catch (b) {
            throw new P(`Invalid base URL: ${a}. Please provide a valid base URL.`)
          }
        })(a)
      )
        return a
      let c = a.replace(/\/+$/, '')
      return b && '/' !== b ? ((b = b.startsWith('/') ? b : `/${b}`), `${c}${b}`) : c
    }
    let R = [],
      S = 0,
      T = 0,
      U = (a) => {
        let b = [],
          c = {
            get: () => (c.lc || c.listen(() => {})(), c.value),
            lc: 0,
            listen: (a) => (
              (c.lc = b.push(a)),
              () => {
                for (let b = S + 4; b < R.length; ) R[b] === a ? R.splice(b, 4) : (b += 4)
                let d = b.indexOf(a)
                ~d && (b.splice(d, 1), --c.lc || c.off())
              }
            ),
            notify(a, d) {
              T++
              let e = !R.length
              for (let e of b) R.push(e, c.value, a, d)
              if (e) {
                for (S = 0; S < R.length; S += 4) R[S](R[S + 1], R[S + 2], R[S + 3])
                R.length = 0
              }
            },
            off() {},
            set(a) {
              let b = c.value
              b !== a && ((c.value = a), c.notify(b))
            },
            subscribe(a) {
              let b = c.listen(a)
              return (a(c.value), b)
            },
            value: a,
          }
        return c
      },
      V = {
        proto:
          /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
        constructor:
          /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
        protoShort: /"__proto__"\s*:/,
        constructorShort: /"constructor"\s*:/,
      },
      W = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/,
      X = {
        true: !0,
        false: !1,
        null: null,
        undefined: void 0,
        nan: NaN,
        infinity: 1 / 0,
        '-infinity': -1 / 0,
      },
      Y =
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/,
      Z = {
        id: 'redirect',
        name: 'Redirect',
        hooks: {
          onSuccess(a) {
            a.data?.url && a.data?.redirect
          },
        },
      }
    var $ = a.i(572131)
    function _(a) {
      return {
        newRole: (a) => {
          var b
          return {
            authorize(a, c = 'AND') {
              let d = !1
              for (let [e, f] of Object.entries(a)) {
                let a = b[e]
                if (!a)
                  return { success: !1, error: `You are not allowed to access resource: ${e}` }
                if (Array.isArray(f)) d = f.every((b) => a.includes(b))
                else if ('object' == typeof f)
                  d =
                    'OR' === f.connector
                      ? f.actions.some((b) => a.includes(b))
                      : f.actions.every((b) => a.includes(b))
                else throw new P('Invalid access control request')
                if (d && 'OR' === c) return { success: d }
                if (!d && 'AND' === c)
                  return { success: !1, error: `unauthorized to access resource "${e}"` }
              }
              return d ? { success: d } : { success: !1, error: 'Not authorized' }
            },
            statements: (b = a),
          }
        },
        statements: a,
      }
    }
    let aa = _({
      organization: ['update', 'delete'],
      member: ['create', 'update', 'delete'],
      invitation: ['create', 'cancel'],
      team: ['create', 'update', 'delete'],
      ac: ['create', 'read', 'update', 'delete'],
    })
    ;(aa.newRole({
      organization: ['update'],
      invitation: ['create', 'cancel'],
      member: ['create', 'update', 'delete'],
      team: ['create', 'update', 'delete'],
      ac: ['create', 'read', 'update', 'delete'],
    }),
      aa.newRole({
        organization: ['update', 'delete'],
        member: ['create', 'update', 'delete'],
        invitation: ['create', 'cancel'],
        team: ['create', 'update', 'delete'],
        ac: ['create', 'read', 'update', 'delete'],
      }),
      aa.newRole({ organization: [], member: [], invitation: [], team: [], ac: ['read'] }),
      new (class {
        constructor() {
          Object.defineProperty(this, 'controller', {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          })
        }
        createNewAbortSignal() {
          if (this.controller) {
            let a = Error('Cancelling existing WebAuthn API call for new one')
            ;((a.name = 'AbortError'), this.controller.abort(a))
          }
          let a = new AbortController()
          return ((this.controller = a), a.signal)
        }
        cancelCeremony() {
          if (this.controller) {
            let a = Error('Manually cancelling existing WebAuthn API call')
            ;((a.name = 'AbortError'), this.controller.abort(a), (this.controller = void 0))
          }
        }
      })())
    let ab = _({
        user: [
          'create',
          'list',
          'set-role',
          'ban',
          'impersonate',
          'delete',
          'set-password',
          'get',
          'update',
        ],
        session: ['list', 'revoke', 'delete'],
      }),
      ac = ab.newRole({
        user: [
          'create',
          'list',
          'set-role',
          'ban',
          'impersonate',
          'delete',
          'set-password',
          'get',
          'update',
        ],
        session: ['list', 'revoke', 'delete'],
      }),
      ad = ab.newRole({ user: [], session: [] }),
      ae = { admin: ac, user: ad },
      af = (function (a) {
        var b, c
        let {
            pluginPathMethods: d,
            pluginsActions: e,
            pluginsAtoms: f,
            $fetch: g,
            $store: h,
            atomListeners: i,
          } = ((a, b) => {
            var c
            let d,
              e = 'credentials' in Request.prototype,
              f =
                (function (a, b, c, d) {
                  if (a) return Q(a, b)
                  if (!1 !== d) {
                    let a =
                      C.BETTER_AUTH_URL ||
                      C.NEXT_PUBLIC_BETTER_AUTH_URL ||
                      C.PUBLIC_BETTER_AUTH_URL ||
                      C.NUXT_PUBLIC_BETTER_AUTH_URL ||
                      C.NUXT_PUBLIC_AUTH_URL ||
                      ('/' !== C.BASE_URL ? C.BASE_URL : void 0)
                    if (a) return Q(a, b)
                  }
                  let e = c?.headers.get('x-forwarded-host'),
                    f = c?.headers.get('x-forwarded-proto')
                  if (e && f) return Q(`${f}://${e}`, b)
                  if (c) {
                    let a = (function (a) {
                      try {
                        return new URL(a).origin
                      } catch (a) {
                        return null
                      }
                    })(c.url)
                    if (!a)
                      throw new P(
                        'Could not get origin from request. Please provide a valid base URL.'
                      )
                    return Q(a, b)
                  }
                })(a?.baseURL, a?.basePath, void 0, void 0) ?? '/api/auth',
              g = a?.plugins?.flatMap((a) => a.fetchPlugins).filter((a) => void 0 !== a) || [],
              h = {
                id: 'lifecycle-hooks',
                name: 'lifecycle-hooks',
                hooks: {
                  onSuccess: a?.fetchOptions?.onSuccess,
                  onError: a?.fetchOptions?.onError,
                  onRequest: a?.fetchOptions?.onRequest,
                  onResponse: a?.fetchOptions?.onResponse,
                },
              },
              {
                onSuccess: i,
                onError: j,
                onRequest: k,
                onResponse: n,
                ...o
              } = a?.fetchOptions || {},
              p =
                ((c = {
                  baseURL: f,
                  ...(e ? { credentials: 'include' } : {}),
                  method: 'GET',
                  jsonParser: (a) =>
                    a
                      ? (function (a, b = { strict: !0 }) {
                          return (function (a, b = {}) {
                            let {
                              strict: c = !1,
                              warnings: d = !1,
                              reviver: e,
                              parseDates: f = !0,
                            } = b
                            if ('string' != typeof a) return a
                            let g = a.trim()
                            if (
                              g.length > 0 &&
                              '"' === g[0] &&
                              g.endsWith('"') &&
                              !g.slice(1, -1).includes('"')
                            )
                              return g.slice(1, -1)
                            let h = g.toLowerCase()
                            if (h.length <= 9 && h in X) return X[h]
                            if (!W.test(g)) {
                              if (c) throw SyntaxError('[better-json] Invalid JSON')
                              return a
                            }
                            if (
                              Object.entries(V).some(([a, b]) => {
                                let c = b.test(g)
                                return (
                                  c &&
                                    d &&
                                    console.warn(
                                      `[better-json] Detected potential prototype pollution attempt using ${a} pattern`
                                    ),
                                  c
                                )
                              }) &&
                              c
                            )
                              throw Error(
                                '[better-json] Potential prototype pollution attempt detected'
                              )
                            try {
                              return JSON.parse(g, (a, b) => {
                                if (
                                  '__proto__' === a ||
                                  ('constructor' === a &&
                                    b &&
                                    'object' == typeof b &&
                                    'prototype' in b)
                                ) {
                                  d &&
                                    console.warn(
                                      `[better-json] Dropping "${a}" key to prevent prototype pollution`
                                    )
                                  return
                                }
                                if (f && 'string' == typeof b) {
                                  let a = (function (a) {
                                    let b = Y.exec(a)
                                    if (!b) return null
                                    let [, c, d, e, f, g, h, i, j, k, l] = b,
                                      m = new Date(
                                        Date.UTC(
                                          parseInt(c, 10),
                                          parseInt(d, 10) - 1,
                                          parseInt(e, 10),
                                          parseInt(f, 10),
                                          parseInt(g, 10),
                                          parseInt(h, 10),
                                          i ? parseInt(i.padEnd(3, '0'), 10) : 0
                                        )
                                      )
                                    if (j) {
                                      let a =
                                        (60 * parseInt(k, 10) + parseInt(l, 10)) *
                                        ('+' === j ? -1 : 1)
                                      m.setUTCMinutes(m.getUTCMinutes() + a)
                                    }
                                    return m instanceof Date && !isNaN(m.getTime()) ? m : null
                                  })(b)
                                  if (a) return a
                                }
                                return e ? e(a, b) : b
                              })
                            } catch (b) {
                              if (c) throw b
                              return a
                            }
                          })(a, b)
                        })(a, { strict: !1 })
                      : null,
                  customFetchImpl: fetch,
                  ...o,
                  plugins: [
                    h,
                    ...(o.plugins || []),
                    ...(a?.disableDefaultFetchPlugins ? [] : [Z]),
                    ...g,
                  ],
                }),
                async function (a, b) {
                  let d,
                    e = m(l(l({}, c), b), {
                      plugins: [
                        ...((null == c ? void 0 : c.plugins) || []),
                        ((d = c || {}),
                        {
                          id: 'apply-schema',
                          name: 'Apply Schema',
                          version: '1.0.0',
                          async init(a, b) {
                            var c, e, f, g
                            let h =
                              (null ==
                              (e =
                                null == (c = d.plugins)
                                  ? void 0
                                  : c.find((b) => {
                                      var c
                                      return (
                                        null != (c = b.schema) &&
                                        !!c.config &&
                                        (a.startsWith(b.schema.config.baseURL || '') ||
                                          a.startsWith(b.schema.config.prefix || ''))
                                      )
                                    }))
                                ? void 0
                                : e.schema) || d.schema
                            if (h) {
                              let c = a
                              ;((null == (f = h.config) ? void 0 : f.prefix) &&
                                c.startsWith(h.config.prefix) &&
                                ((c = c.replace(h.config.prefix, '')),
                                h.config.baseURL &&
                                  (a = a.replace(h.config.prefix, h.config.baseURL))),
                                (null == (g = h.config) ? void 0 : g.baseURL) &&
                                  c.startsWith(h.config.baseURL) &&
                                  (c = c.replace(h.config.baseURL, '')))
                              let d = h.schema[c]
                              if (d) {
                                let c = m(l({}, b), { method: d.method, output: d.output })
                                return (
                                  (null == b ? void 0 : b.disableValidation) ||
                                    (c = m(l({}, c), {
                                      body: d.input
                                        ? await x(d.input, null == b ? void 0 : b.body)
                                        : null == b
                                          ? void 0
                                          : b.body,
                                      params: d.params
                                        ? await x(d.params, null == b ? void 0 : b.params)
                                        : null == b
                                          ? void 0
                                          : b.params,
                                      query: d.query
                                        ? await x(d.query, null == b ? void 0 : b.query)
                                        : null == b
                                          ? void 0
                                          : b.query,
                                    })),
                                  { url: a, options: c }
                                )
                              }
                            }
                            return { url: a, options: b }
                          },
                        }),
                      ],
                    })
                  if (null == c ? void 0 : c.catchAllError)
                    try {
                      return await z(a, e)
                    } catch (a) {
                      return {
                        data: null,
                        error: {
                          status: 500,
                          statusText: 'Fetch Error',
                          message:
                            'Fetch related error. Captured by catchAllError option. See error property for more details.',
                          error: a,
                        },
                      }
                    }
                  return await z(a, e)
                }),
              { $sessionSignal: q, session: r } = {
                session: ((a, b, c, d) => {
                  let e = U({
                      data: null,
                      error: null,
                      isPending: !0,
                      isRefetching: !1,
                      refetch: (a) => f(a),
                    }),
                    f = (a) => {
                      let f =
                        'function' == typeof d
                          ? d({
                              data: e.get().data,
                              error: e.get().error,
                              isPending: e.get().isPending,
                            })
                          : d
                      c(b, {
                        ...f,
                        query: { ...f?.query, ...a?.query },
                        async onSuccess(a) {
                          ;(e.set({
                            data: a.data,
                            error: null,
                            isPending: !1,
                            isRefetching: !1,
                            refetch: e.value.refetch,
                          }),
                            await f?.onSuccess?.(a))
                        },
                        async onError(a) {
                          let { request: b } = a,
                            c = 'number' == typeof b.retry ? b.retry : b.retry?.attempts,
                            d = b.retryAttempt || 0
                          ;(c && d < c) ||
                            (e.set({
                              error: a.error,
                              data: null,
                              isPending: !1,
                              isRefetching: !1,
                              refetch: e.value.refetch,
                            }),
                            await f?.onError?.(a))
                        },
                        async onRequest(a) {
                          let b = e.get()
                          ;(e.set({
                            isPending: null === b.data,
                            data: b.data,
                            error: null,
                            isRefetching: !0,
                            refetch: e.value.refetch,
                          }),
                            await f?.onRequest?.(a))
                        },
                      }).catch((a) => {
                        e.set({
                          error: a,
                          data: null,
                          isPending: !1,
                          isRefetching: !1,
                          refetch: e.value.refetch,
                        })
                      })
                    }
                  for (let b of (a = Array.isArray(a) ? a : [a])) b.subscribe(() => {})
                  return e
                })((d = U(!1)), '/get-session', p, { method: 'GET' }),
                $sessionSignal: d,
              },
              s = a?.plugins || [],
              t = {},
              u = { $sessionSignal: q, session: r },
              v = {
                '/sign-out': 'POST',
                '/revoke-sessions': 'POST',
                '/revoke-other-sessions': 'POST',
                '/delete-user': 'POST',
              },
              w = [
                {
                  signal: '$sessionSignal',
                  matcher: (a) =>
                    '/sign-out' === a ||
                    '/update-user' === a ||
                    a.startsWith('/sign-in') ||
                    a.startsWith('/sign-up') ||
                    '/delete-user' === a ||
                    '/verify-email' === a,
                },
              ]
            for (let a of s)
              (a.getAtoms && Object.assign(u, a.getAtoms?.(p)),
                a.pathMethods && Object.assign(v, a.pathMethods),
                a.atomListeners && w.push(...a.atomListeners))
            let y = {
              notify: (a) => {
                u[a].set(!u[a].get())
              },
              listen: (a, b) => {
                u[a].subscribe(b)
              },
              atoms: u,
            }
            for (let b of s) b.getActions && Object.assign(t, b.getActions?.(p, y, a))
            return {
              get baseURL() {
                return f
              },
              pluginsActions: t,
              pluginsAtoms: u,
              pluginPathMethods: v,
              atomListeners: w,
              $fetch: p,
              $store: y,
            }
          })(a),
          j = {}
        for (let [a, b] of Object.entries(f)) {
          j[`use${(c = a).charAt(0).toUpperCase() + c.slice(1)}`] = () =>
            (function (a, b = {}) {
              let c = (0, $.useRef)(a.get()),
                { keys: d, deps: e = [a, d] } = b,
                f = (0, $.useCallback)((b) => {
                  let e = (a) => {
                    c.current !== a && ((c.current = a), b())
                  }
                  if ((e(a.value), d?.length)) {
                    let b
                    return (
                      (b = new Set(d).add(void 0)),
                      a.listen((a, c, d) => {
                        b.has(d) && e(a, c, d)
                      })
                    )
                  }
                  return a.listen(e)
                }, e),
                g = () => c.current
              return (0, $.useSyncExternalStore)(f, g, g)
            })(b)
        }
        return (
          (b = { ...e, ...j, $fetch: g, $store: h }),
          (function a(c = []) {
            return new Proxy(function () {}, {
              get(d, e) {
                var f
                if ('string' != typeof e || 'then' === e || 'catch' === e || 'finally' === e) return
                let g = [...c, e],
                  h = b
                for (let a of g)
                  if (h && 'object' == typeof h && a in h) h = h[a]
                  else {
                    h = void 0
                    break
                  }
                return 'function' == typeof h
                  ? h
                  : 'object' == typeof (f = h) &&
                      null !== f &&
                      'get' in f &&
                      'function' == typeof f.get &&
                      'lc' in f &&
                      'number' == typeof f.lc
                    ? h
                    : a(g)
              },
              apply: async (a, b, e) => {
                let h =
                    '/' + c.map((a) => a.replace(/[A-Z]/g, (a) => `-${a.toLowerCase()}`)).join('/'),
                  j = e[0] || {},
                  k = e[1] || {},
                  { query: l, fetchOptions: m, ...n } = j,
                  o = { ...k, ...m },
                  p = (function (a, b, c) {
                    let d = b[a],
                      { fetchOptions: e, query: f, ...g } = c || {}
                    return (
                      d || (e?.method ? e.method : g && Object.keys(g).length > 0 ? 'POST' : 'GET')
                    )
                  })(h, d, j)
                return await g(h, {
                  ...o,
                  body: 'GET' === p ? void 0 : { ...n, ...(o?.body || {}) },
                  query: l || o?.query,
                  method: p,
                  async onSuccess(a) {
                    if ((await o?.onSuccess?.(a), !i)) return
                    let b = i.filter((a) => a.matcher(h))
                    if (b.length)
                      for (let a of b) {
                        let b = f[a.signal]
                        if (!b) return
                        let c = b.get()
                        setTimeout(() => {
                          b.set(!c)
                        }, 10)
                      }
                  },
                })
              },
            })
          })()
        )
      })({
        baseURL:
          process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
          process.env.BETTER_AUTH_URL ||
          'http://localhost:3000',
        basePath: '/api/auth',
        plugins: [
          ((d = { admin: ac, user: ad, ...void 0 }),
          {
            id: 'admin-client',
            $InferServerPlugin: {},
            getActions: () => ({
              admin: {
                checkRolePermission: (a) =>
                  ((a) => {
                    if (a.userId && a.options?.adminUserIds?.includes(a.userId)) return !0
                    if (!a.permissions && !a.permission) return !1
                    let b = (a.role || a.options?.defaultRole || 'user').split(','),
                      c = a.options?.roles || ae
                    for (let d of b) {
                      let b = c[d],
                        e = b?.authorize(a.permission ?? a.permissions)
                      if (e?.success) return !0
                    }
                    return !1
                  })({
                    role: a.role,
                    options: { ac: void 0, roles: d },
                    permissions: a.permissions ?? a.permission,
                  }),
              },
            }),
            pathMethods: { '/admin/list-users': 'GET', '/admin/stop-impersonating': 'POST' },
          }),
          { id: 'email-otp', $InferServerPlugin: {} },
          {
            id: 'phoneNumber',
            $InferServerPlugin: {},
            atomListeners: [
              {
                matcher: (a) => '/phone-number/update' === a || '/phone-number/verify' === a,
                signal: '$sessionSignal',
              },
            ],
          },
        ],
      }),
      ag = af.useSession,
      { signIn: ah, signOut: ai, signUp: aj } = af
    a.s(['authClient', 0, af, 'useSession', 0, ag], 529139)
  },
]

//# sourceMappingURL=src_lib_auth-client_ts_4d6359d5._.js.map
