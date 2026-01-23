module.exports = [
  171967,
  (a) => {
    'use strict'
    var b = a.i(572131)
    let c = null,
      d = { jsSdkUrl: 'https://cdn.portone.io/v2/browser-sdk.js' }
    var e = a.i(463052)
    a.s(
      [
        'usePayment',
        0,
        () => {
          let [a, f] = (0, b.useState)(!1),
            [g, h] = (0, b.useState)(null),
            { data: i, isLoading: j } = (0, e.usePublicEnv)(),
            k = (0, b.useCallback)(() => {
              h(null)
            }, [])
          return {
            requestPayment: (0, b.useCallback)(
              async (a) => {
                if (j || !i)
                  return {
                    success: !1,
                    error: '환경 설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
                  }
                ;(f(!0), h(null))
                try {
                  var b
                  if (
                    (console.log('[usePayment] Processing web payment'),
                    !i.NEXT_PUBLIC_PORTONE_STORE_ID)
                  )
                    throw Error(
                      'storeId 파라미터는 필수 입력입니다. 환경 변수 NEXT_PUBLIC_PORTONE_STORE_ID를 확인해주세요.'
                    )
                  if (!i.NEXT_PUBLIC_PORTONE_CHANNEL_KEY)
                    throw Error(
                      'channelKey 파라미터는 필수 입력입니다. 환경 변수 NEXT_PUBLIC_PORTONE_CHANNEL_KEY를 확인해주세요.'
                    )
                  let e = {
                    storeId: i.NEXT_PUBLIC_PORTONE_STORE_ID,
                    channelKey: i.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
                    paymentId: a.orderId,
                    orderName: a.orderName,
                    totalAmount: a.amount,
                    currency: 'KRW',
                    payMethod: 'CARD',
                    customer: a.customer || {
                      fullName: a.customerName || '',
                      phoneNumber: a.customerPhone || '',
                      email: a.customerEmail || '',
                    },
                    customData: a.customData || {},
                    redirectUrl: 'http://localhost:3000/payment/success',
                  }
                  console.log('[usePayment] Requesting web payment:', e)
                  let f = await ((b = e),
                  (null != c
                    ? c
                    : (c = new Promise((a, b) => {
                        if (window.PortOne) return a(window.PortOne)
                        try {
                          let c =
                            document.querySelector(`script[src="${d.jsSdkUrl}"]`) ||
                            (function () {
                              let a = document.createElement('script')
                              a.src = d.jsSdkUrl
                              let b = document.head || document.body
                              if (!b) throw Error('[PortOne] Expected document.body not to be null')
                              return b.appendChild(a)
                            })()
                          ;(c.addEventListener('load', () => {
                            if (window.PortOne) return a(window.PortOne)
                            b(Error('[PortOne] Failed to load window.PortOne'))
                          }),
                            c.addEventListener('error', () => {
                              b(Error('[PortOne] Failed to load window.PortOne'))
                            }))
                        } catch (a) {
                          return b(a)
                        }
                      }))
                  ).then((a) => a.requestPayment(b)))
                  if (f?.code !== void 0) {
                    let a = f?.message || '알 수 없는 오류'
                    if (
                      'FAILURE_TYPE_USER_CANCEL' === f.code ||
                      'PG_CANCEL' === f.code ||
                      a.includes('사용자') ||
                      a.includes('취소')
                    )
                      return (
                        console.log('[usePayment] Payment cancelled by user'),
                        {
                          success: !1,
                          code: f.code,
                          message: '결제가 취소되었습니다',
                          cancelled: !0,
                        }
                      )
                    return (
                      console.error('[usePayment] Web payment failed:', a),
                      h(`결제에 실패했습니다: ${a}`),
                      { success: !1, code: f.code, message: a, error: a }
                    )
                  }
                  return (
                    console.log('[usePayment] Web payment successful:', f),
                    { success: !0, paymentId: f?.paymentId, transactionId: f?.transactionId }
                  )
                } catch (b) {
                  console.error('[usePayment] Unexpected error:', b)
                  let a =
                    b instanceof Error ? b.message : '결제 처리 중 예기치 않은 오류가 발생했습니다.'
                  return (h(a), { success: !1, error: a })
                } finally {
                  f(!1)
                }
              },
              [i, j]
            ),
            isLoading: a,
            error: g,
            clearError: k,
          }
        },
      ],
      171967
    )
  },
]

//# sourceMappingURL=src_hooks_usePayment_ts_3f6b1708._.js.map
