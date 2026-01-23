module.exports = [
  988712,
  (e, r, s) => {
    r.exports = e.x('nodemailer', () => require('nodemailer'))
  },
  492749,
  (e) => {
    'use strict'
    var r = e.i(988712),
      s = e.i(547499)
    function n() {
      return {
        host: s.env.SMTP_HOST,
        port: s.env.SMTP_PORT,
        secure: 465 === s.env.SMTP_PORT,
        auth: { user: s.env.SMTP_USERNAME, pass: s.env.SMTP_PASSWORD },
      }
    }
    let t = null
    function o() {
      if (!t) {
        let e = n()
        t = r.default.createTransport(e)
      }
      return t
    }
    async function a({ to: e, subject: r, html: n, text: t }) {
      try {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
          return { success: !1, error: `Invalid recipient email address: ${e}` }
        let a = o(),
          c = await a.sendMail({
            from: s.env.SMTP_USERNAME,
            to: e,
            subject: r,
            text: t || void 0,
            html: n,
          })
        return (
          console.log('📧 Email sent successfully:', { messageId: c.messageId, to: e, subject: r }),
          { success: !0, messageId: c.messageId }
        )
      } catch (e) {
        return (
          console.error('❌ Failed to send email:', e),
          { success: !1, error: e instanceof Error ? e.message : 'Unknown error' }
        )
      }
    }
    async function c() {
      try {
        let e = o()
        return (await e.verify(), { success: !0, message: 'SMTP connection test successful' })
      } catch (e) {
        return { success: !1, message: e instanceof Error ? e.message : 'Unknown error' }
      }
    }
    function i() {
      try {
        let e = n()
        if (!e.host || !e.auth.user || !e.auth.pass)
          return { healthy: !1, message: 'SMTP configuration is incomplete' }
        return { healthy: !0, message: `SMTP configured for ${e.host}:${e.port}` }
      } catch (e) {
        return { healthy: !1, message: e instanceof Error ? e.message : 'Unknown SMTP error' }
      }
    }
    e.s(['checkSMTPHealth', () => i, 'sendEmail', () => a, 'testSMTPConnection', () => c])
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__fd3a5b9b._.js.map
