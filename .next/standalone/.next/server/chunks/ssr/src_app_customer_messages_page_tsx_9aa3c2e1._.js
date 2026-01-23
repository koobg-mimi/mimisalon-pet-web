module.exports = [
  677808,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(256711),
      d = a.i(302491),
      e = a.i(572131),
      f = a.i(50944),
      g = a.i(571987),
      h = a.i(433217),
      i = a.i(370025),
      j = a.i(937927),
      k = a.i(529139),
      l = a.i(699570),
      m = a.i(866718),
      n = a.i(786304),
      o = a.i(205138),
      p = a.i(695245),
      q = a.i(159501),
      r = a.i(429246),
      s = a.i(335732),
      t = a.i(606406),
      u = a.i(170106)
    let v = (0, u.default)('check-check', [
      ['path', { d: 'M18 6 7 17l-5-5', key: '116fxf' }],
      ['path', { d: 'm22 10-7.5 7.5L13 16', key: 'ke71qq' }],
    ])
    var w = a.i(592284)
    let x = (0, u.default)('reply', [
        ['path', { d: 'M20 18v-2a4 4 0 0 0-4-4H4', key: '5vmcpk' }],
        ['path', { d: 'm9 17-5-5 5-5', key: 'nvlc11' }],
      ]),
      y = (0, u.default)('copy', [
        ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
        ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }],
      ])
    var z = a.i(983290),
      A = a.i(465734),
      B = a.i(730769)
    let C = (0, u.default)('file', [
      ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', key: '1rqfz7' }],
      ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
    ])
    var D = a.i(485155),
      E = a.i(368114)
    function F({
      message: a,
      isOwn: f,
      showSender: h = !1,
      showTimestamp: i = !0,
      onReply: j,
      onDelete: k,
      className: m,
    }) {
      let o,
        p,
        q,
        r,
        [u, F] = (0, e.useState)(!1),
        G = () => {
          switch (a.type) {
            case 'TEXT':
              return (0, b.jsx)('div', {
                className: 'break-words whitespace-pre-wrap',
                children: a.content,
              })
            case 'IMAGE':
              return (0, b.jsxs)('div', {
                className: 'space-y-2',
                children: [
                  a.attachments?.map((a, c) =>
                    (0, b.jsx)(
                      'div',
                      {
                        className: 'relative max-w-sm overflow-hidden rounded-lg',
                        children: (0, b.jsx)(g.default, {
                          src: a.fileUrl,
                          alt: a.fileName,
                          width: 300,
                          height: 200,
                          className:
                            'cursor-pointer object-cover transition-opacity hover:opacity-90',
                          onClick: () => window.open(a.fileUrl, '_blank'),
                        }),
                      },
                      c
                    )
                  ),
                  a.content && (0, b.jsx)('div', { className: 'text-sm', children: a.content }),
                ],
              })
            case 'FILE':
              return (0, b.jsxs)('div', {
                className: 'space-y-2',
                children: [
                  a.attachments?.map((a, c) =>
                    (0, b.jsxs)(
                      'div',
                      {
                        className:
                          'flex max-w-sm items-center space-x-3 rounded-lg bg-gray-100 p-3',
                        children: [
                          (0, b.jsx)(C, { className: 'h-8 w-8 text-gray-600' }),
                          (0, b.jsxs)('div', {
                            className: 'min-w-0 flex-1',
                            children: [
                              (0, b.jsx)('div', {
                                className: 'truncate text-sm font-medium',
                                children: a.fileName,
                              }),
                              (0, b.jsx)('div', {
                                className: 'text-xs text-gray-500',
                                children: ((a) => {
                                  if (0 === a) return '0 Bytes'
                                  let b = Math.floor(Math.log(a) / Math.log(1024))
                                  return (
                                    parseFloat((a / Math.pow(1024, b)).toFixed(2)) +
                                    ' ' +
                                    ['Bytes', 'KB', 'MB', 'GB'][b]
                                  )
                                })(a.fileSize),
                              }),
                            ],
                          }),
                          (0, b.jsx)(l.Button, {
                            variant: 'ghost',
                            size: 'sm',
                            onClick: () => {
                              let b
                              ;(((b = document.createElement('a')).href = a.fileUrl),
                                (b.download = a.fileName),
                                document.body.appendChild(b),
                                b.click(),
                                document.body.removeChild(b))
                            },
                            children: (0, b.jsx)(A.DownloadIcon, { className: 'h-4 w-4' }),
                          }),
                        ],
                      },
                      c
                    )
                  ),
                  a.content && (0, b.jsx)('div', { className: 'text-sm', children: a.content }),
                ],
              })
            case 'BOOKING_INFO':
              return (0, b.jsxs)('div', {
                className: 'max-w-sm rounded-lg border border-blue-200 bg-blue-50 p-3',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'mb-2 flex items-center space-x-2',
                    children: [
                      (0, b.jsx)(B.CalendarIcon, { className: 'h-4 w-4 text-blue-600' }),
                      (0, b.jsx)('span', {
                        className: 'text-sm font-medium text-blue-900',
                        children: '예약 정보',
                      }),
                    ],
                  }),
                  (0, b.jsx)('div', { className: 'text-sm text-blue-800', children: a.content }),
                  a.metadata?.bookingId &&
                    (0, b.jsx)(l.Button, {
                      variant: 'outline',
                      size: 'sm',
                      className: 'mt-2 border-blue-300 text-blue-600',
                      onClick: () =>
                        window.open(`/customer/booking/${a.metadata?.bookingId}`, '_blank'),
                      children: '예약 상세보기',
                    }),
                ],
              })
            case 'SYSTEM':
              return (0, b.jsx)('div', {
                className: 'text-center',
                children: (0, b.jsx)(n.Badge, {
                  variant: 'secondary',
                  className: 'text-xs',
                  children: a.content,
                }),
              })
            default:
              return (0, b.jsx)('div', { children: a.content })
          }
        }
      return 'SYSTEM' === a.type
        ? (0, b.jsx)('div', { className: (0, E.cn)('my-4 flex justify-center', m), children: G() })
        : (0, b.jsxs)('div', {
            className: (0, E.cn)('mb-4 flex gap-3', f ? 'justify-end' : 'justify-start', m),
            children: [
              !f &&
                (0, b.jsx)('div', {
                  className: 'flex-shrink-0',
                  children: a.senderAvatar
                    ? (0, b.jsx)(g.default, {
                        src: a.senderAvatar,
                        alt: a.senderName,
                        width: 32,
                        height: 32,
                        className: 'rounded-full',
                      })
                    : (0, b.jsx)('div', {
                        className:
                          'flex h-8 w-8 items-center justify-center rounded-full bg-gray-300',
                        children: (0, b.jsx)('span', {
                          className: 'text-xs font-medium text-gray-600',
                          children: a.senderName.charAt(0).toUpperCase(),
                        }),
                      }),
                }),
              (0, b.jsxs)('div', {
                className: (0, E.cn)(
                  'flex max-w-xs flex-col sm:max-w-md',
                  f ? 'items-end' : 'items-start'
                ),
                children: [
                  h &&
                    !f &&
                    (0, b.jsx)('span', {
                      className: 'mb-1 px-1 text-xs text-gray-500',
                      children: a.senderName,
                    }),
                  a.replyTo &&
                    (0, b.jsxs)('div', {
                      className:
                        'mb-2 max-w-full rounded border-l-2 border-gray-400 bg-gray-100 p-2 text-xs',
                      children: [
                        (0, b.jsx)('div', {
                          className: 'font-medium text-gray-600',
                          children: a.replyTo.senderName,
                        }),
                        (0, b.jsx)('div', {
                          className: 'truncate text-gray-500',
                          children: a.replyTo.content,
                        }),
                      ],
                    }),
                  (0, b.jsxs)('div', {
                    className: 'group relative',
                    children: [
                      (0, b.jsx)('div', {
                        className: (0, E.cn)(
                          'rounded-lg px-4 py-2 break-words',
                          f
                            ? 'rounded-br-sm bg-blue-600 text-white'
                            : 'rounded-bl-sm bg-gray-100 text-gray-900'
                        ),
                        children: G(),
                      }),
                      (0, b.jsx)('div', {
                        className: (0, E.cn)(
                          'absolute top-0 opacity-0 transition-opacity group-hover:opacity-100',
                          f ? '-left-8' : '-right-8'
                        ),
                        children: (0, b.jsxs)(s.DropdownMenu, {
                          open: u,
                          onOpenChange: F,
                          children: [
                            (0, b.jsx)(s.DropdownMenuTrigger, {
                              asChild: !0,
                              children: (0, b.jsx)(l.Button, {
                                variant: 'ghost',
                                size: 'sm',
                                className: 'h-6 w-6 border bg-white p-0 shadow-sm',
                                children: (0, b.jsx)(w.MoreVerticalIcon, { className: 'h-3 w-3' }),
                              }),
                            }),
                            (0, b.jsxs)(s.DropdownMenuContent, {
                              align: f ? 'end' : 'start',
                              children: [
                                j &&
                                  (0, b.jsxs)(s.DropdownMenuItem, {
                                    onClick: () => j(a),
                                    children: [
                                      (0, b.jsx)(x, { className: 'mr-2 h-4 w-4' }),
                                      '답장',
                                    ],
                                  }),
                                (0, b.jsxs)(s.DropdownMenuItem, {
                                  onClick: () => {
                                    ;(navigator.clipboard.writeText(a.content), F(!1))
                                  },
                                  children: [(0, b.jsx)(y, { className: 'mr-2 h-4 w-4' }), '복사'],
                                }),
                                f &&
                                  k &&
                                  (0, b.jsxs)(s.DropdownMenuItem, {
                                    onClick: () => k(a.id),
                                    className: 'text-red-600 focus:text-red-600',
                                    children: [
                                      (0, b.jsx)(z.TrashIcon, { className: 'mr-2 h-4 w-4' }),
                                      '삭제',
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                  i &&
                    (0, b.jsxs)('div', {
                      className: (0, E.cn)(
                        'mt-1 flex items-center space-x-1 px-1',
                        f ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                      ),
                      children: [
                        (0, b.jsx)('span', {
                          className: 'text-xs text-gray-500',
                          children:
                            ((o = new Date(a.createdAt)),
                            (q = new Date(
                              (p = new Date()).getFullYear(),
                              p.getMonth(),
                              p.getDate()
                            )),
                            (r = new Date(o.getFullYear(), o.getMonth(), o.getDate())).getTime() ===
                            q.getTime()
                              ? (0, c.format)(o, 'HH:mm:ss', { locale: d.ko })
                              : r.getTime() === q.getTime() - 864e5
                                ? `어제 ${(0, c.format)(o, 'HH:mm:ss', { locale: d.ko })}`
                                : (0, c.format)(o, 'yyyy-MM-dd HH:mm:ss', { locale: d.ko })),
                        }),
                        f &&
                          (0, b.jsx)('div', {
                            className: 'text-gray-500',
                            children: ((a) => {
                              switch (a) {
                                case 'SENT':
                                  return (0, b.jsx)(t.CheckIcon, { className: 'h-3 w-3' })
                                case 'DELIVERED':
                                  return (0, b.jsx)(v, { className: 'h-3 w-3' })
                                case 'READ':
                                  return (0, b.jsx)(v, { className: 'h-3 w-3 text-blue-500' })
                                case 'FAILED':
                                  return (0, b.jsx)(D.AlertCircleIcon, {
                                    className: 'h-3 w-3 text-red-500',
                                  })
                                default:
                                  return null
                              }
                            })(a.status),
                          }),
                      ],
                    }),
                ],
              }),
            ],
          })
    }
    var G = a.i(601304),
      G = G
    let H = (0, u.default)('paperclip', [
      [
        'path',
        {
          d: 'm16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551',
          key: '1miecu',
        },
      ],
    ])
    var I = a.i(179165),
      J = a.i(254688)
    let K = (0, u.default)('video', [
      [
        'path',
        {
          d: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5',
          key: 'ftymec',
        },
      ],
      ['rect', { x: '2', y: '6', width: '14', height: '12', rx: '2', key: '158x01' }],
    ])
    var L = a.i(422262),
      M = a.i(156757)
    let N = M.z.enum(['TEXT', 'IMAGE', 'FILE', 'BOOKING_INFO', 'SYSTEM']),
      O = M.z.enum(['CUSTOMER_GROOMER', 'CUSTOMER_ADMIN', 'GROOMER_ADMIN', 'GROUP']),
      P = M.z.enum(['SENT', 'DELIVERED', 'READ', 'FAILED']),
      Q = M.z.object({
        conversationId: M.z.string().min(1, '대화 ID가 필요합니다'),
        content: M.z
          .string()
          .min(1, '메시지 내용을 입력해주세요')
          .max(1e3, '메시지는 1000자 이하로 입력해주세요'),
        type: N,
        attachments: M.z
          .array(
            M.z.object({
              fileName: M.z.string(),
              fileUrl: M.z.string().url(),
              fileSize: M.z.number(),
              mimeType: M.z.string(),
            })
          )
          .optional(),
        metadata: M.z.record(M.z.string(), M.z.unknown()).optional(),
        replyToId: M.z.string().optional(),
      })
    function R({
      conversation: a,
      currentUserId: f,
      onSendMessage: h,
      onMarkAsRead: i,
      onDeleteMessage: j,
      className: k,
    }) {
      let [m, n] = (0, e.useState)([]),
        [s, t] = (0, e.useState)(!0),
        [u, v] = (0, e.useState)(!1),
        [x, y] = (0, e.useState)(null),
        [z] = (0, e.useState)([]),
        A = (0, e.useRef)(null),
        B = (0, e.useRef)(null),
        {
          register: C,
          handleSubmit: D,
          watch: M,
          reset: N,
          formState: { errors: O },
        } = (0, p.useForm)({
          resolver: (0, q.zodResolver)(Q),
          defaultValues: { conversationId: a.id, type: 'TEXT' },
        }),
        P = M('content')
      ;((0, e.useEffect)(() => {
        ;(async () => {
          t(!0)
          try {
            let b = await fetch(`/api/conversations/${a.id}/messages`)
            if (b.ok) {
              let a = await b.json()
              n(a.messages)
              let c = a.messages
                .filter((a) => a.senderId !== f && 'READ' !== a.status)
                .map((a) => a.id)
              c.length > 0 && (await i(c))
            }
          } catch (a) {
            console.error('Error fetching messages:', a)
          } finally {
            t(!1)
          }
        })()
      }, [a.id, f, i]),
        (0, e.useEffect)(() => {
          R()
        }, [m]),
        (0, e.useEffect)(() => {}, [a.id]))
      let R = () => {
          A.current?.scrollIntoView({ behavior: 'smooth' })
        },
        S = async (a) => {
          if (a.content.trim()) {
            v(!0)
            try {
              let b = { ...a, replyToId: x?.id }
              ;(await h(b), N(), y(null))
            } catch (a) {
              console.error('Error sending message:', a)
            } finally {
              v(!1)
            }
          }
        },
        T = async (b) => {
          let c = b.target.files
          if (!c || 0 === c.length) return
          let d = c[0],
            e = new FormData()
          ;(e.append('file', d), e.append('conversationId', a.id))
          try {
            let b = await fetch('/api/upload', { method: 'POST', body: e })
            if (b.ok) {
              let c = await b.json(),
                e = {
                  conversationId: a.id,
                  content: `파일을 전송했습니다: ${d.name}`,
                  type: d.type.startsWith('image/') ? 'IMAGE' : 'FILE',
                  attachments: [
                    { fileName: d.name, fileUrl: c.fileUrl, fileSize: d.size, mimeType: d.type },
                  ],
                }
              await h(e)
            }
          } catch (a) {
            console.error('Error uploading file:', a)
          }
          B.current && (B.current.value = '')
        },
        U = (a) => {
          ;(y(a), document.querySelector('textarea')?.focus())
        },
        V = a.participants.find((a) => a.id !== f)
      return (0, b.jsxs)('div', {
        className: (0, E.cn)('flex h-full flex-col', k),
        children: [
          (0, b.jsxs)('div', {
            className: 'flex items-center justify-between border-b bg-white p-4',
            children: [
              (0, b.jsxs)('div', {
                className: 'flex items-center space-x-3',
                children: [
                  V?.avatar
                    ? (0, b.jsx)(g.default, {
                        src: V.avatar,
                        alt: V.name,
                        width: 40,
                        height: 40,
                        className: 'h-10 w-10 rounded-full',
                      })
                    : (0, b.jsx)('div', {
                        className:
                          'flex h-10 w-10 items-center justify-center rounded-full bg-gray-300',
                        children: (0, b.jsx)('span', {
                          className: 'text-sm font-medium text-gray-600',
                          children: V?.name.charAt(0).toUpperCase(),
                        }),
                      }),
                  (0, b.jsxs)('div', {
                    children: [
                      (0, b.jsx)('h3', {
                        className: 'font-semibold',
                        children: a.title || V?.name || '채팅',
                      }),
                      (0, b.jsx)('div', {
                        className: 'flex items-center space-x-2 text-sm text-gray-500',
                        children: V?.isOnline
                          ? (0, b.jsx)('span', { className: 'text-green-600', children: '온라인' })
                          : (0, b.jsxs)('span', {
                              children: [
                                '마지막 접속:',
                                ' ',
                                V?.lastSeen
                                  ? (0, c.format)(new Date(V.lastSeen), 'yyyy-MM-dd HH:mm:ss', {
                                      locale: d.ko,
                                    })
                                  : '알 수 없음',
                              ],
                            }),
                      }),
                    ],
                  }),
                ],
              }),
              (0, b.jsxs)('div', {
                className: 'flex items-center space-x-2',
                children: [
                  (0, b.jsx)(l.Button, {
                    variant: 'ghost',
                    size: 'sm',
                    children: (0, b.jsx)(J.PhoneIcon, { className: 'h-4 w-4' }),
                  }),
                  (0, b.jsx)(l.Button, {
                    variant: 'ghost',
                    size: 'sm',
                    children: (0, b.jsx)(K, { className: 'h-4 w-4' }),
                  }),
                  (0, b.jsx)(l.Button, {
                    variant: 'ghost',
                    size: 'sm',
                    children: (0, b.jsx)(w.MoreVerticalIcon, { className: 'h-4 w-4' }),
                  }),
                ],
              }),
            ],
          }),
          (0, b.jsx)('div', {
            className: 'flex-1 overflow-y-auto bg-gray-50 p-4',
            children: s
              ? (0, b.jsx)('div', {
                  className: 'flex h-full items-center justify-center',
                  children: (0, b.jsx)(o.LoadingSpinner, { size: 'lg' }),
                })
              : 0 === m.length
                ? (0, b.jsx)('div', {
                    className: 'flex h-full items-center justify-center',
                    children: (0, b.jsxs)('div', {
                      className: 'text-center text-gray-500',
                      children: [
                        (0, b.jsx)('p', { children: '아직 메시지가 없습니다.' }),
                        (0, b.jsx)('p', {
                          className: 'text-sm',
                          children: '첫 메시지를 보내보세요!',
                        }),
                      ],
                    }),
                  })
                : (0, b.jsxs)('div', {
                    className: 'space-y-4',
                    children: [
                      m.map((a, c) => {
                        let d = a.senderId === f,
                          e = !d && (0 === c || m[c - 1].senderId !== a.senderId),
                          g =
                            c === m.length - 1 ||
                            new Date(m[c + 1].createdAt).getTime() -
                              new Date(a.createdAt).getTime() >
                              3e5
                        return (0, b.jsx)(
                          F,
                          {
                            message: a,
                            isOwn: d,
                            showSender: e,
                            showTimestamp: g,
                            onReply: U,
                            onDelete: j,
                          },
                          a.id
                        )
                      }),
                      z.length > 0 &&
                        (0, b.jsx)('div', {
                          className: 'flex justify-start',
                          children: (0, b.jsx)('div', {
                            className: 'rounded-full bg-gray-200 px-4 py-2',
                            children: (0, b.jsxs)('div', {
                              className: 'flex space-x-1',
                              children: [
                                (0, b.jsx)('div', {
                                  className: 'h-2 w-2 animate-bounce rounded-full bg-gray-400',
                                }),
                                (0, b.jsx)('div', {
                                  className: 'h-2 w-2 animate-bounce rounded-full bg-gray-400',
                                  style: { animationDelay: '0.1s' },
                                }),
                                (0, b.jsx)('div', {
                                  className: 'h-2 w-2 animate-bounce rounded-full bg-gray-400',
                                  style: { animationDelay: '0.2s' },
                                }),
                              ],
                            }),
                          }),
                        }),
                      (0, b.jsx)('div', { ref: A }),
                    ],
                  }),
          }),
          x &&
            (0, b.jsx)('div', {
              className: 'border-t border-blue-200 bg-blue-50 px-4 py-2',
              children: (0, b.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'flex-1',
                    children: [
                      (0, b.jsxs)('div', {
                        className: 'text-sm font-medium text-blue-900',
                        children: [x.senderName, '에게 답장'],
                      }),
                      (0, b.jsx)('div', {
                        className: 'truncate text-sm text-blue-700',
                        children: x.content,
                      }),
                    ],
                  }),
                  (0, b.jsx)(l.Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => {
                      y(null)
                    },
                    className: 'text-blue-600',
                    children: (0, b.jsx)(L.XIcon, { className: 'h-4 w-4' }),
                  }),
                ],
              }),
            }),
          (0, b.jsx)('div', {
            className: 'border-t bg-white p-4',
            children: (0, b.jsx)('form', {
              onSubmit: D(S),
              className: 'space-y-3',
              children: (0, b.jsxs)('div', {
                className: 'flex items-end space-x-2',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'flex-1',
                    children: [
                      (0, b.jsx)(r.Textarea, {
                        placeholder: '메시지를 입력하세요...',
                        ...C('content'),
                        rows: 1,
                        className: 'max-h-32 min-h-[40px] resize-none',
                        onKeyDown: (a) => {
                          'Enter' !== a.key || a.shiftKey || (a.preventDefault(), D(S)())
                        },
                      }),
                      O.content &&
                        (0, b.jsx)('p', {
                          className: 'mt-1 text-sm text-red-600',
                          children: O.content.message,
                        }),
                    ],
                  }),
                  (0, b.jsxs)('div', {
                    className: 'flex items-center space-x-1',
                    children: [
                      (0, b.jsx)('input', {
                        ref: B,
                        type: 'file',
                        className: 'hidden',
                        onChange: T,
                        accept: 'image/*,application/pdf,.doc,.docx,.txt',
                      }),
                      (0, b.jsx)(l.Button, {
                        type: 'button',
                        variant: 'ghost',
                        size: 'sm',
                        onClick: () => B.current?.click(),
                        children: (0, b.jsx)(H, { className: 'h-4 w-4' }),
                      }),
                      (0, b.jsx)(l.Button, {
                        type: 'button',
                        variant: 'ghost',
                        size: 'sm',
                        onClick: () => B.current?.click(),
                        children: (0, b.jsx)(I.ImageIcon, { className: 'h-4 w-4' }),
                      }),
                      (0, b.jsx)(l.Button, {
                        type: 'submit',
                        disabled: !P?.trim() || u,
                        className: 'px-3',
                        children: u
                          ? (0, b.jsx)(o.LoadingSpinner, { size: 'sm' })
                          : (0, b.jsx)(G.default, { className: 'h-4 w-4' }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
        ],
      })
    }
    ;(M.z.object({
      type: O,
      participants: M.z.array(M.z.string()).min(2, '최소 2명의 참가자가 필요합니다'),
      title: M.z.string().optional(),
      bookingId: M.z.string().optional(),
      metadata: M.z.record(M.z.string(), M.z.unknown()).optional(),
    }),
      M.z.object({
        conversationId: M.z.string(),
        page: M.z.number().min(1).default(1),
        limit: M.z.number().min(1).max(100).default(20),
        beforeMessageId: M.z.string().optional(),
        afterMessageId: M.z.string().optional(),
      }),
      M.z.object({
        type: O.optional(),
        page: M.z.number().min(1).default(1),
        limit: M.z.number().min(1).max(50).default(20),
        search: M.z.string().optional(),
        unreadOnly: M.z.boolean().default(!1),
      }),
      M.z.object({
        content: M.z.string().min(1).max(1e3).optional(),
        status: P.optional(),
        readAt: M.z.date().optional(),
      }),
      M.z.object({
        title: M.z.string().max(100).optional(),
        isArchived: M.z.boolean().optional(),
        isMuted: M.z.boolean().optional(),
        mutedUntil: M.z.date().optional(),
      }),
      M.z.object({
        file: M.z.instanceof(File),
        conversationId: M.z.string(),
        caption: M.z.string().optional(),
      }),
      M.z.object({
        query: M.z.string().min(1, '검색어를 입력해주세요'),
        conversationId: M.z.string().optional(),
        type: N.optional(),
        fromDate: M.z.string().optional(),
        toDate: M.z.string().optional(),
        page: M.z.number().min(1).default(1),
        limit: M.z.number().min(1).max(50).default(20),
      }),
      M.z.object({
        type: M.z.enum([
          'MESSAGE_SENT',
          'MESSAGE_READ',
          'TYPING_START',
          'TYPING_STOP',
          'USER_JOINED',
          'USER_LEFT',
        ]),
        conversationId: M.z.string(),
        userId: M.z.string(),
        messageId: M.z.string().optional(),
        data: M.z.record(M.z.string(), M.z.unknown()).optional(),
      }))
    var S = a.i(842391),
      T = a.i(312207),
      U = a.i(808235),
      V = a.i(130748),
      W = a.i(988552)
    function X() {
      let a = (0, f.useRouter)(),
        { data: p, isPending: q } = (0, k.useSession)(),
        r = (0, j.useQueryClient)(),
        [s, t] = (0, e.useState)(null),
        [u, v] = (0, e.useState)(''),
        [w, x] = (0, e.useState)(!1),
        y = p?.user?.id || 'current-user-id',
        { data: z, isLoading: A } = (0, h.useQuery)({
          queryKey: ['customer', 'conversations'],
          queryFn: async () => {
            let a = await fetch('/api/conversations')
            if (!a.ok) throw Error('Failed to fetch conversations')
            return (await a.json()).conversations
          },
          enabled: !!p?.user && 'CUSTOMER' === p.user.role,
        })
      ;(0, e.useEffect)(() => {
        let a = () => {
          x(window.innerWidth < 768)
        }
        return (
          a(),
          window.addEventListener('resize', a),
          () => window.removeEventListener('resize', a)
        )
      }, [])
      let C = (0, i.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch('/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(a),
            })
            if (!b.ok) throw Error('Failed to send message')
            return b.json()
          },
          onSuccess: () => {
            r.invalidateQueries({ queryKey: ['customer', 'conversations'] })
          },
        }),
        D = (0, i.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch('/api/messages/mark-read', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageIds: a }),
            })
            if (!b.ok) throw Error('Failed to mark messages as read')
            return b.json()
          },
          onSuccess: () => {
            r.invalidateQueries({ queryKey: ['customer', 'conversations'] })
          },
        }),
        F = (0, i.useMutation)({
          mutationFn: async (a) => {
            let b = await fetch(`/api/messages/${a}`, { method: 'DELETE' })
            if (!b.ok) throw Error('Failed to delete message')
            return b.json()
          },
          onSuccess: () => {
            r.invalidateQueries({ queryKey: ['customer', 'conversations'] })
          },
        }),
        G = async (a) => {
          await C.mutateAsync(a)
        },
        H = async (a) => {
          await D.mutateAsync(a)
        },
        I = async (a) => {
          await F.mutateAsync(a)
        },
        J = () => {
          a.push('/customer/messages/new')
        },
        K = (z || []).filter((a) => {
          let b = a.participants.find((a) => a.id !== y)
          return (
            (a.title || b?.name || '').toLowerCase().includes(u.toLowerCase()) ||
            a.lastMessage?.content.toLowerCase().includes(u.toLowerCase())
          )
        }),
        L = (0, b.jsxs)('div', {
          className: 'flex h-full flex-col',
          children: [
            (0, b.jsxs)('div', {
              className: 'border-b bg-white p-4',
              children: [
                (0, b.jsxs)('div', {
                  className: 'mb-4 flex items-center justify-between',
                  children: [
                    (0, b.jsx)('h1', { className: 'text-xl font-bold', children: '메시지' }),
                    (0, b.jsxs)(l.Button, {
                      size: 'sm',
                      onClick: J,
                      children: [(0, b.jsx)(U.PlusIcon, { className: 'mr-1 h-4 w-4' }), '새 대화'],
                    }),
                  ],
                }),
                (0, b.jsxs)('div', {
                  className: 'relative',
                  children: [
                    (0, b.jsx)(T.SearchIcon, {
                      className:
                        'text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform',
                    }),
                    (0, b.jsx)(m.Input, {
                      placeholder: '대화 검색...',
                      value: u,
                      onChange: (a) => v(a.target.value),
                      className: 'pl-10',
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsx)('div', {
              className: 'flex-1 overflow-y-auto',
              children: A
                ? (0, b.jsx)('div', {
                    className: 'flex h-full items-center justify-center',
                    children: (0, b.jsx)(o.LoadingSpinner, { size: 'lg' }),
                  })
                : 0 === K.length
                  ? (0, b.jsxs)('div', {
                      className: 'flex h-full flex-col items-center justify-center p-8 text-center',
                      children: [
                        (0, b.jsx)(S.MessageCircleIcon, {
                          className: 'text-muted-foreground mb-4 h-12 w-12',
                        }),
                        (0, b.jsx)('h3', {
                          className: 'mb-2 text-lg font-semibold text-gray-900',
                          children: u ? '검색 결과가 없습니다' : '대화가 없습니다',
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground mb-4',
                          children: u ? '다른 검색어로 시도해보세요' : '새로운 대화를 시작해보세요',
                        }),
                        !u &&
                          (0, b.jsxs)(l.Button, {
                            onClick: J,
                            children: [
                              (0, b.jsx)(U.PlusIcon, { className: 'mr-2 h-4 w-4' }),
                              '새 대화 시작',
                            ],
                          }),
                      ],
                    })
                  : (0, b.jsx)('div', {
                      className: 'divide-y',
                      children: K.map((a) => {
                        let e = a.participants.find((a) => a.id !== y),
                          f = s?.id === a.id
                        return (0, b.jsx)(
                          'div',
                          {
                            className: (0, E.cn)(
                              'cursor-pointer p-4 transition-colors hover:bg-gray-50',
                              f && 'border-r-2 border-blue-500 bg-blue-50'
                            ),
                            onClick: () => t(a),
                            children: (0, b.jsxs)('div', {
                              className: 'flex items-center space-x-3',
                              children: [
                                e?.avatar
                                  ? (0, b.jsx)(g.default, {
                                      src: e.avatar,
                                      alt: e.name,
                                      width: 48,
                                      height: 48,
                                      className: 'h-12 w-12 rounded-full object-cover',
                                    })
                                  : (0, b.jsx)('div', {
                                      className:
                                        'flex h-12 w-12 items-center justify-center rounded-full bg-gray-300',
                                      children: (0, b.jsx)(V.UserIcon, {
                                        className: 'h-6 w-6 text-gray-600',
                                      }),
                                    }),
                                (0, b.jsxs)('div', {
                                  className: 'min-w-0 flex-1',
                                  children: [
                                    (0, b.jsxs)('div', {
                                      className: 'mb-1 flex items-center justify-between',
                                      children: [
                                        (0, b.jsx)('h4', {
                                          className: 'truncate font-medium',
                                          children: a.title || e?.name || 'Unknown',
                                        }),
                                        (0, b.jsxs)('div', {
                                          className: 'flex items-center space-x-2',
                                          children: [
                                            a.lastMessage &&
                                              (0, b.jsx)('span', {
                                                className: 'text-xs text-gray-500',
                                                children: ((a) => {
                                                  let b = new Date(a),
                                                    e = Math.floor(
                                                      (new Date().getTime() - b.getTime()) / 6e4
                                                    )
                                                  if (e < 1) return '방금 전'
                                                  if (e < 60) return `${e}분 전`
                                                  let f = Math.floor(e / 60)
                                                  if (f < 24) return `${f}시간 전`
                                                  let g = Math.floor(f / 24)
                                                  return g < 7
                                                    ? `${g}일 전`
                                                    : (0, c.format)(b, 'yyyy-MM-dd', {
                                                        locale: d.ko,
                                                      })
                                                })(a.lastMessage.createdAt),
                                              }),
                                            a.unreadCount > 0 &&
                                              (0, b.jsx)(n.Badge, {
                                                variant: 'destructive',
                                                className: 'rounded-full px-2 py-1 text-xs',
                                                children: a.unreadCount,
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, b.jsxs)('div', {
                                      className: 'flex items-center justify-between',
                                      children: [
                                        (0, b.jsx)('p', {
                                          className: 'truncate text-sm text-gray-600',
                                          children:
                                            a.lastMessage?.content || '아직 메시지가 없습니다',
                                        }),
                                        a.bookingId &&
                                          (0, b.jsx)(B.CalendarIcon, {
                                            className: 'h-4 w-4 flex-shrink-0 text-blue-500',
                                          }),
                                      ],
                                    }),
                                    (0, b.jsx)('div', {
                                      className: 'mt-1',
                                      children: (0, b.jsxs)(n.Badge, {
                                        variant: 'outline',
                                        className: 'text-xs',
                                        children: [
                                          e?.role === 'GROOMER' && '미용사',
                                          e?.role === 'ADMIN' && '관리자',
                                          e?.role === 'CUSTOMER' && '고객',
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          },
                          a.id
                        )
                      }),
                    }),
            }),
          ],
        })
      return w && s
        ? (0, b.jsxs)('div', {
            className: 'flex h-screen flex-col',
            children: [
              (0, b.jsxs)('div', {
                className: 'flex items-center border-b bg-white p-4',
                children: [
                  (0, b.jsx)(l.Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => t(null),
                    className: 'mr-3',
                    children: (0, b.jsx)(W.ArrowLeftIcon, { className: 'h-4 w-4' }),
                  }),
                  (0, b.jsx)('h1', {
                    className: 'font-semibold',
                    children: s.title || s.participants.find((a) => a.id !== y)?.name || '대화',
                  }),
                ],
              }),
              (0, b.jsx)('div', {
                className: 'flex-1',
                children: (0, b.jsx)(R, {
                  conversation: s,
                  currentUserId: y,
                  onSendMessage: G,
                  onMarkAsRead: H,
                  onDeleteMessage: I,
                }),
              }),
            ],
          })
        : (0, b.jsx)('div', {
            className: 'container mx-auto px-4 py-8',
            children: (0, b.jsx)('div', {
              className: 'mx-auto max-w-7xl',
              children: (0, b.jsxs)('div', {
                className:
                  'grid h-[800px] grid-cols-1 gap-0 overflow-hidden rounded-lg border bg-white md:grid-cols-3',
                children: [
                  (0, b.jsx)('div', { className: 'md:border-r', children: L }),
                  (0, b.jsx)('div', {
                    className: 'md:col-span-2',
                    children: s
                      ? (0, b.jsx)(R, {
                          conversation: s,
                          currentUserId: y,
                          onSendMessage: G,
                          onMarkAsRead: H,
                          onDeleteMessage: I,
                        })
                      : (0, b.jsx)('div', {
                          className: 'flex h-full items-center justify-center bg-gray-50',
                          children: (0, b.jsxs)('div', {
                            className: 'text-center',
                            children: [
                              (0, b.jsx)(S.MessageCircleIcon, {
                                className: 'mx-auto mb-4 h-16 w-16 text-gray-400',
                              }),
                              (0, b.jsx)('h3', {
                                className: 'mb-2 text-lg font-semibold text-gray-900',
                                children: '대화를 선택해주세요',
                              }),
                              (0, b.jsx)('p', {
                                className: 'text-gray-500',
                                children: '왼쪽에서 대화를 선택하거나 새로운 대화를 시작하세요',
                              }),
                            ],
                          }),
                        }),
                  }),
                ],
              }),
            }),
          })
    }
    a.s(['default', () => X], 677808)
  },
]

//# sourceMappingURL=src_app_customer_messages_page_tsx_9aa3c2e1._.js.map
