module.exports = [
  684713,
  (a) => {
    'use strict'
    var b = a.i(187924),
      c = a.i(529139),
      d = a.i(50944),
      e = a.i(572131),
      f = a.i(699570),
      g = a.i(205138),
      h = a.i(737984),
      i = a.i(256711),
      j = a.i(302491),
      k = a.i(941675),
      l = a.i(713513),
      m = a.i(384273),
      n = a.i(559565),
      o = a.i(510448),
      p = a.i(976472)
    let q = (0, a.i(170106).default)('syringe', [
      ['path', { d: 'm18 2 4 4', key: '22kx64' }],
      ['path', { d: 'm17 7 3-3', key: '1w1zoj' }],
      [
        'path',
        { d: 'M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5', key: '1exhtz' },
      ],
      ['path', { d: 'm9 11 4 4', key: 'rovt3i' }],
      ['path', { d: 'm5 19-3 3', key: '59f2uf' }],
      ['path', { d: 'm14 4 6 6', key: 'yqp9t2' }],
    ])
    var r = a.i(781560),
      s = a.i(786304),
      t = a.i(591119),
      u = a.i(486192),
      v = a.i(571987)
    function w({ pet: a, onEdit: c, onDelete: d }) {
      let [g, h] = (0, e.useState)(!1),
        w = ((a, b) => {
          if (a) {
            let c
            if ('string' == typeof a) {
              if (isNaN((c = new Date(a)).getTime())) return b
            } else c = a
            let d = new Date(),
              e = d.getFullYear() - c.getFullYear(),
              f = d.getMonth() - c.getMonth()
            return f < 0 || (0 === f && d.getDate() < c.getDate()) ? e - 1 : e
          }
          return b
        })(a.birthDate, a.age),
        x = a.images?.find((a) => a.isPrimary) || a.images?.[0]
      return (0, b.jsxs)(b.Fragment, {
        children: [
          (0, b.jsxs)(t.Card, {
            className: 'overflow-hidden transition-shadow hover:shadow-lg',
            children: [
              (0, b.jsxs)('div', {
                className: 'bg-muted relative h-48',
                children: [
                  x
                    ? (0, b.jsx)(v.default, {
                        src: x.url,
                        alt: a.name,
                        fill: !0,
                        className: 'object-cover',
                        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
                      })
                    : (0, b.jsx)('div', {
                        className: 'flex h-full items-center justify-center',
                        children: (0, b.jsxs)('div', {
                          className: 'text-center',
                          children: [
                            'DOG' === a.type
                              ? (0, b.jsx)(n.Dog, {
                                  className: 'text-muted-foreground/50 mx-auto h-16 w-16',
                                })
                              : (0, b.jsx)(m.Cat, {
                                  className: 'text-muted-foreground/50 mx-auto h-16 w-16',
                                }),
                            (0, b.jsx)('p', {
                              className: 'text-muted-foreground mt-2 text-xs',
                              children: '사진 없음',
                            }),
                          ],
                        }),
                      }),
                  a.images &&
                    a.images.length > 0 &&
                    (0, b.jsxs)('div', {
                      className:
                        'absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white',
                      children: [(0, b.jsx)(l.Camera, { className: 'h-3 w-3' }), a.images.length],
                    }),
                  (0, b.jsx)('div', {
                    className: 'absolute top-2 right-2',
                    children: ((a) => {
                      switch (a) {
                        case 'UP_TO_DATE':
                          return (0, b.jsx)(s.Badge, {
                            className: 'bg-green-500',
                            children: '접종 완료',
                          })
                        case 'OVERDUE':
                          return (0, b.jsx)(s.Badge, {
                            variant: 'destructive',
                            children: '접종 지연',
                          })
                        case 'PARTIAL':
                          return (0, b.jsx)(s.Badge, {
                            variant: 'secondary',
                            children: '부분 접종',
                          })
                        default:
                          return (0, b.jsx)(s.Badge, { variant: 'outline', children: '미확인' })
                      }
                    })(a.vaccinationStatus),
                  }),
                ],
              }),
              (0, b.jsx)(t.CardHeader, {
                className: 'pb-3',
                children: (0, b.jsx)('div', {
                  className: 'flex items-start justify-between',
                  children: (0, b.jsxs)('div', {
                    className: 'flex items-center gap-3',
                    children: [
                      (0, b.jsx)('div', {
                        className:
                          'bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full',
                        children:
                          'DOG' === a.type
                            ? (0, b.jsx)(n.Dog, { className: 'text-primary h-5 w-5' })
                            : (0, b.jsx)(m.Cat, { className: 'text-primary h-5 w-5' }),
                      }),
                      (0, b.jsxs)('div', {
                        children: [
                          (0, b.jsx)('h3', {
                            className: 'text-lg font-semibold',
                            children: a.name,
                          }),
                          (0, b.jsx)('p', {
                            className: 'text-muted-foreground text-sm',
                            children: a.breed?.name || ('DOG' === a.type ? '믹스견' : '믹스묘'),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
              (0, b.jsxs)(t.CardContent, {
                className: 'space-y-3 pt-0',
                children: [
                  (0, b.jsxs)('div', {
                    className: 'grid grid-cols-2 gap-3 text-sm',
                    children: [
                      'DOG' === a.type &&
                        a.breed?.name &&
                        (0, b.jsxs)('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            (0, b.jsx)(p.Heart, { className: 'text-muted-foreground h-4 w-4' }),
                            (0, b.jsx)('span', { children: a.breed.name }),
                          ],
                        }),
                      'CAT' === a.type &&
                        a.hairType &&
                        (0, b.jsxs)('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            (0, b.jsx)(p.Heart, { className: 'text-muted-foreground h-4 w-4' }),
                            (0, b.jsx)('span', {
                              children: ((a) => {
                                switch (a) {
                                  case 'SHORT_HAIR':
                                    return '단모'
                                  case 'LONG_HAIR':
                                    return '장모'
                                  default:
                                    return null
                                }
                              })(a.hairType),
                            }),
                          ],
                        }),
                      a.gender &&
                        'UNKNOWN' !== a.gender &&
                        (0, b.jsxs)('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            (0, b.jsx)('span', {
                              className: 'text-muted-foreground',
                              children: '성별:',
                            }),
                            (0, b.jsx)('span', { children: 'MALE' === a.gender ? '남자' : '여자' }),
                          ],
                        }),
                      null != w &&
                        (0, b.jsxs)('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            (0, b.jsx)(k.Calendar, { className: 'text-muted-foreground h-4 w-4' }),
                            (0, b.jsxs)('span', { children: [w, '살'] }),
                          ],
                        }),
                      a.weight &&
                        (0, b.jsxs)('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            (0, b.jsx)('span', {
                              className: 'text-muted-foreground',
                              children: '체중:',
                            }),
                            (0, b.jsxs)('span', { children: [a.weight, 'kg'] }),
                          ],
                        }),
                    ],
                  }),
                  a.specialNeeds &&
                    (0, b.jsxs)('div', {
                      className: 'bg-muted/50 rounded-lg p-3',
                      children: [
                        (0, b.jsx)('p', {
                          className: 'mb-1 text-xs font-medium',
                          children: '특이사항',
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-muted-foreground line-clamp-2 text-xs',
                          children: a.specialNeeds,
                        }),
                      ],
                    }),
                  a.vaccinationDate &&
                    (0, b.jsxs)('div', {
                      className: 'text-muted-foreground flex items-center gap-2 text-xs',
                      children: [
                        (0, b.jsx)(q, { className: 'h-3 w-3' }),
                        (0, b.jsxs)('span', {
                          children: [
                            '최근 접종: ',
                            (0, i.format)(a.vaccinationDate, 'yyyy-MM-dd', { locale: j.ko }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
              (0, b.jsxs)(t.CardFooter, {
                className: 'flex flex-row gap-2 pt-3',
                children: [
                  (0, b.jsxs)(f.Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: () => c(a),
                    className: 'flex-1',
                    children: [(0, b.jsx)(o.Edit2, { className: 'mr-2 h-4 w-4' }), '수정'],
                  }),
                  (0, b.jsxs)(f.Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: () => {
                      h(!0)
                    },
                    className: 'text-destructive hover:text-destructive flex-1',
                    children: [(0, b.jsx)(r.Trash2, { className: 'mr-2 h-4 w-4' }), '삭제'],
                  }),
                ],
              }),
            ],
          }),
          (0, b.jsx)(u.AlertDialog, {
            open: g,
            onOpenChange: h,
            children: (0, b.jsxs)(u.AlertDialogContent, {
              children: [
                (0, b.jsxs)(u.AlertDialogHeader, {
                  children: [
                    (0, b.jsx)(u.AlertDialogTitle, { children: '반려동물 삭제' }),
                    (0, b.jsxs)(u.AlertDialogDescription, {
                      children: [a.name, '을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'],
                    }),
                  ],
                }),
                (0, b.jsxs)(u.AlertDialogFooter, {
                  children: [
                    (0, b.jsx)(u.AlertDialogCancel, { children: '취소' }),
                    (0, b.jsx)(u.AlertDialogAction, {
                      onClick: () => {
                        ;(d(a.id), h(!1))
                      },
                      className:
                        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                      children: '삭제',
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      })
    }
    var x = a.i(838632),
      y = a.i(405784),
      z = a.i(767552),
      A = a.i(866718),
      B = a.i(870430),
      C = a.i(429246),
      D = a.i(814574),
      E = a.i(580701),
      F = a.i(505084),
      G = a.i(823292),
      H = a.i(821374),
      I = a.i(596221),
      J = a.i(296101),
      K = a.i(368114)
    let L = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    function M({
      images: a = [],
      onUpload: c,
      onDelete: d,
      onSetPrimary: g,
      maxImages: h = 10,
      isUploading: i = !1,
      className: j,
    }) {
      let [k, m] = (0, e.useState)(new Set()),
        [n, o] = (0, e.useState)(!1),
        [p, q] = (0, e.useState)(null),
        s = (0, e.useRef)(null),
        t = (0, e.useRef)(null),
        w = (0, e.useCallback)(
          async (b) => {
            console.log('Processing files for upload:', {
              count: b.length,
              files: b.map((a) => ({
                name: a.name,
                type: a.type || 'unknown',
                size: a.size,
                sizeMB: (a.size / 1048576).toFixed(2),
              })),
            })
            let d = b.filter((a) =>
              a.type
                ? L.includes(a.type)
                  ? !(a.size > 0xa00000) ||
                    (console.error(
                      `File too large: ${a.name} (${(a.size / 1048576).toFixed(2)}MB)`
                    ),
                    alert(
                      `${a.name}: 파일이 너무 큽니다 (${(a.size / 1048576).toFixed(2)}MB). 최대 10MB까지 가능합니다.`
                    ),
                    !1)
                  : (console.error(`Invalid file type: ${a.type} for ${a.name}`),
                    alert(
                      `${a.name}: 지원하지 않는 파일 형식입니다 (${a.type}). JPG, PNG, WebP, GIF만 가능합니다.`
                    ),
                    !1)
                : (console.error(`No file type detected for ${a.name}`),
                  alert(`${a.name}: 파일 형식을 인식할 수 없습니다. 다른 이미지를 사용해주세요.`),
                  !1)
            )
            console.log(`Valid files after filtering: ${d.length}`)
            let e = h - a.length
            if (e <= 0) return void alert(`최대 ${h}개의 이미지만 업로드할 수 있습니다`)
            let f = d.slice(0, e)
            if (f.length > 0) {
              console.log(`Uploading ${f.length} files...`)
              try {
                await c(f)
              } catch (a) {
                ;(console.error('Upload failed:', a),
                  a instanceof Error &&
                    a.message.includes('Invalid files data') &&
                    alert(
                      '파일 업로드에 실패했습니다. 스크린샷 파일은 직접 업로드할 수 없을 수 있습니다. 다른 이미지를 사용해주세요.'
                    ))
              }
            } else console.log('No files to upload after validation')
            d.length > f.length && alert(`${d.length - f.length}개 파일이 제한을 초과했습니다`)
          },
          [a.length, h, c]
        ),
        y = (0, e.useCallback)(
          async (a) => {
            let b = a.target.files ? Array.from(a.target.files) : []
            ;(console.log(`File input selected ${b.length} files`), 0 === b.length)
              ? console.log('No files selected from input')
              : (await w(b),
                s.current && (s.current.value = ''),
                t.current && (t.current.value = ''))
          },
          [w]
        ),
        z = async () => {
          ;(p && (await d(p), q(null)), o(!1))
        }
      return (0, b.jsxs)(b.Fragment, {
        children: [
          (0, b.jsxs)('div', {
            className: (0, K.cn)('space-y-4', j),
            children: [
              (0, b.jsxs)('div', {
                className: 'space-y-3',
                children: [
                  (0, b.jsx)('div', {
                    className: 'text-center',
                    children: (0, b.jsxs)('p', {
                      className: 'text-muted-foreground mb-3 text-sm',
                      children: ['JPG, PNG, WebP, GIF (최대 10MB) • ', a.length, '/', h, ' 이미지'],
                    }),
                  }),
                  (0, b.jsxs)('div', {
                    className: 'flex justify-center gap-3',
                    children: [
                      (0, b.jsx)(f.Button, {
                        type: 'button',
                        variant: 'outline',
                        size: 'lg',
                        onClick: () => s.current?.click(),
                        disabled: i || a.length >= h,
                        className: 'h-12 max-w-[160px] flex-1',
                        children: i
                          ? (0, b.jsxs)(b.Fragment, {
                              children: [
                                (0, b.jsx)(I.Loader2, { className: 'mr-2 h-5 w-5 animate-spin' }),
                                '업로드 중...',
                              ],
                            })
                          : (0, b.jsxs)(b.Fragment, {
                              children: [
                                (0, b.jsx)(J.FolderOpen, { className: 'mr-2 h-5 w-5' }),
                                '이미지 열기',
                              ],
                            }),
                      }),
                      (0, b.jsxs)(f.Button, {
                        type: 'button',
                        variant: 'outline',
                        size: 'lg',
                        onClick: () => t.current?.click(),
                        disabled: i || a.length >= h,
                        className: 'h-12 max-w-[160px] flex-1',
                        children: [
                          (0, b.jsx)(l.Camera, { className: 'mr-2 h-5 w-5' }),
                          '카메라 사용',
                        ],
                      }),
                    ],
                  }),
                  (0, b.jsx)('input', {
                    ref: s,
                    type: 'file',
                    multiple: !0,
                    accept: 'image/*',
                    onChange: y,
                    className: 'hidden',
                    disabled: i || a.length >= h,
                  }),
                  (0, b.jsx)('input', {
                    ref: t,
                    type: 'file',
                    accept: 'image/*',
                    capture: 'environment',
                    onChange: y,
                    className: 'hidden',
                    disabled: i || a.length >= h,
                  }),
                ],
              }),
              a.length > 0 &&
                (0, b.jsx)('div', {
                  className: 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4',
                  children: a.map((a) =>
                    (0, b.jsxs)(
                      'div',
                      {
                        className: (0, K.cn)(
                          'group relative overflow-hidden rounded-lg border',
                          k.has(a.id) ? 'border-primary ring-primary ring-2' : 'border-border'
                        ),
                        children: [
                          (0, b.jsx)('div', {
                            className: 'bg-muted relative aspect-square',
                            children: a.url
                              ? (0, b.jsx)(v.default, {
                                  src: a.url,
                                  alt: a.filename,
                                  fill: !0,
                                  className: 'object-cover',
                                  sizes: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
                                })
                              : (0, b.jsx)('div', {
                                  className: 'flex h-full items-center justify-center',
                                  children: (0, b.jsx)(x.Image, {
                                    className: 'text-muted-foreground h-8 w-8',
                                  }),
                                }),
                          }),
                          a.isPrimary &&
                            (0, b.jsxs)('div', {
                              className:
                                'bg-primary text-primary-foreground absolute top-2 left-2 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium',
                              children: [
                                (0, b.jsx)(H.Star, { className: 'h-3 w-3 fill-current' }),
                                '대표',
                              ],
                            }),
                          (0, b.jsxs)('div', {
                            className:
                              'absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100',
                            children: [
                              !a.isPrimary &&
                                (0, b.jsxs)(f.Button, {
                                  type: 'button',
                                  size: 'sm',
                                  variant: 'secondary',
                                  onClick: () => g(a.id),
                                  className: 'h-8',
                                  children: [
                                    (0, b.jsx)(H.Star, { className: 'mr-1 h-4 w-4' }),
                                    '대표',
                                  ],
                                }),
                              (0, b.jsx)(f.Button, {
                                type: 'button',
                                size: 'sm',
                                variant: 'destructive',
                                onClick: () => {
                                  ;(q(a.id), o(!0))
                                },
                                className: 'h-8',
                                children: (0, b.jsx)(r.Trash2, { className: 'h-4 w-4' }),
                              }),
                            ],
                          }),
                          (0, b.jsx)('button', {
                            type: 'button',
                            onClick: () => {
                              var b
                              let c
                              return (
                                (b = a.id),
                                void ((c = new Set(k)).has(b) ? c.delete(b) : c.add(b), m(c))
                              )
                            },
                            className:
                              'absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md border-2 border-gray-300 bg-white opacity-0 transition-opacity group-hover:opacity-100',
                            children:
                              k.has(a.id) &&
                              (0, b.jsx)('div', { className: 'bg-primary h-3 w-3 rounded-sm' }),
                          }),
                        ],
                      },
                      a.id
                    )
                  ),
                }),
              k.size > 0 &&
                (0, b.jsxs)('div', {
                  className: 'bg-muted flex items-center gap-2 rounded-lg p-3',
                  children: [
                    (0, b.jsxs)('span', {
                      className: 'text-sm font-medium',
                      children: [k.size, '개 선택됨'],
                    }),
                    (0, b.jsx)(f.Button, {
                      type: 'button',
                      size: 'sm',
                      variant: 'outline',
                      onClick: () => m(new Set()),
                      children: '선택 해제',
                    }),
                    (0, b.jsxs)(f.Button, {
                      type: 'button',
                      size: 'sm',
                      variant: 'destructive',
                      onClick: () => {
                        ;(k.forEach((a) => d(a)), m(new Set()))
                      },
                      children: [(0, b.jsx)(r.Trash2, { className: 'mr-1 h-4 w-4' }), '삭제'],
                    }),
                  ],
                }),
            ],
          }),
          (0, b.jsx)(u.AlertDialog, {
            open: n,
            onOpenChange: o,
            children: (0, b.jsxs)(u.AlertDialogContent, {
              children: [
                (0, b.jsxs)(u.AlertDialogHeader, {
                  children: [
                    (0, b.jsx)(u.AlertDialogTitle, { children: '이미지 삭제' }),
                    (0, b.jsx)(u.AlertDialogDescription, {
                      children: '이 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
                    }),
                  ],
                }),
                (0, b.jsxs)(u.AlertDialogFooter, {
                  children: [
                    (0, b.jsx)(u.AlertDialogCancel, { onClick: () => q(null), children: '취소' }),
                    (0, b.jsx)(u.AlertDialogAction, {
                      onClick: z,
                      className:
                        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                      children: '삭제',
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      })
    }
    function N({ isOpen: a, onClose: c, onSave: d, pet: h, mode: i, onImagesUpdated: j }) {
      let [k, l] = (0, e.useState)(!1),
        [o, p] = (0, e.useState)({}),
        [q, r] = (0, e.useState)([]),
        [s, t] = (0, e.useState)([]),
        [u, w] = (0, e.useState)(!1),
        [H, I] = (0, e.useState)(!1),
        [J, K] = (0, e.useState)({
          name: '',
          type: 'DOG',
          breedId: '',
          weight: void 0,
          age: void 0,
          birthDate: void 0,
          gender: void 0,
          hairType: void 0,
          specialNeeds: '',
          vaccinationStatus: 'UNKNOWN',
          vaccinationDate: void 0,
          termsAcception: !1,
        }),
        {
          images: L,
          isLoading: N,
          isUploading: O,
          fetchImages: P,
          uploadImages: Q,
          deleteImage: R,
          setPrimaryImage: S,
        } = (function (a) {
          let [b, c] = (0, e.useState)([]),
            [d, f] = (0, e.useState)(!1),
            [g, h] = (0, e.useState)({}),
            [i, j] = (0, e.useState)(!1),
            k = (0, e.useCallback)(async () => {
              if (a)
                try {
                  f(!0)
                  let b = await fetch(`/api/customer/pets/${a}/images`)
                  if (!b.ok) throw Error('Failed to fetch images')
                  let d = await b.json()
                  c(d)
                } catch (a) {
                  ;(console.error('Error fetching pet images:', a),
                    G.toast.error('이미지를 불러오는데 실패했습니다'))
                } finally {
                  f(!1)
                }
            }, [a]),
            l = (0, e.useCallback)(
              async (b) => {
                if (!a) {
                  ;(console.error('No petId provided for image upload'),
                    G.toast.error('펫 정보가 필요합니다. 펫을 먼저 저장해주세요.'))
                  return
                }
                ;(console.log('Starting pet image upload:', {
                  petId: a,
                  filesCount: b.length,
                  files: b.map((a) => ({
                    name: a.name,
                    type: a.type,
                    size: a.size,
                    sizeMB: (a.size / 1048576).toFixed(2),
                  })),
                }),
                  j(!0))
                let d = []
                try {
                  let e = b.filter((a) =>
                    a.type && a.type.startsWith('image/')
                      ? !(a.size > 0xa00000) ||
                        (console.error(
                          `File too large: ${a.name} (${(a.size / 1048576).toFixed(2)}MB)`
                        ),
                        G.toast.error(`${a.name}: 파일이 너무 큽니다 (최대 10MB)`),
                        d.push(a.name),
                        !1)
                      : (console.error(`Invalid file type for ${a.name}: ${a.type || 'unknown'}`),
                        G.toast.error(`${a.name}: 이미지 파일이 아닙니다`),
                        d.push(a.name),
                        !1)
                  )
                  if (0 === e.length)
                    return (G.toast.error('업로드할 유효한 이미지가 없습니다'), [])
                  let f = new FormData()
                  ;(e.forEach((a) => {
                    f.append('files', a)
                  }),
                    console.log(`Uploading ${e.length} files to server...`))
                  let g = await fetch(`/api/customer/pets/${a}/images`, { method: 'POST', body: f })
                  if (!g.ok) {
                    let a = await g
                      .json()
                      .catch(() => ({ error: `HTTP ${g.status}: ${g.statusText}` }))
                    throw (
                      console.error('Failed to upload images:', a),
                      Error(a.error || 'Failed to upload images')
                    )
                  }
                  let h = await g.json()
                  console.log('Upload result:', h)
                  let i = h.images || []
                  return (
                    i.length > 0 &&
                      (c((a) => [...a, ...i]), G.toast.success(`${i.length}개 이미지 업로드 완료`)),
                    d.length > 0 && G.toast.warning(`일부 파일 업로드 실패: ${d.join(', ')}`),
                    i
                  )
                } catch (a) {
                  return (
                    console.error('Failed to upload images:', a),
                    a instanceof Error
                      ? a.message.includes('network') || a.message.includes('fetch')
                        ? G.toast.error('네트워크 오류가 발생했습니다')
                        : G.toast.error(`업로드 실패: ${a.message}`)
                      : G.toast.error('이미지 업로드에 실패했습니다'),
                    []
                  )
                } finally {
                  ;(j(!1), h({}))
                }
              },
              [a]
            ),
            m = (0, e.useCallback)(
              async (b) => {
                if (a)
                  try {
                    if (
                      !(await fetch(`/api/customer/pets/${a}/images/${b}`, { method: 'DELETE' })).ok
                    )
                      throw Error('Failed to delete image')
                    ;(c((a) => a.filter((a) => a.id !== b)),
                      G.toast.success('이미지가 삭제되었습니다'))
                  } catch (a) {
                    throw (
                      console.error('Error deleting image:', a),
                      G.toast.error('이미지 삭제에 실패했습니다'),
                      a
                    )
                  }
              },
              [a]
            ),
            n = (0, e.useCallback)(
              async (b) => {
                if (a && 0 !== b.length)
                  try {
                    if (
                      !(
                        await fetch(`/api/customer/pets/${a}/images`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ imageIds: b }),
                        })
                      ).ok
                    )
                      throw Error('Failed to delete images')
                    ;(c((a) => a.filter((a) => !b.includes(a.id))),
                      G.toast.success('이미지가 삭제되었습니다'))
                  } catch (a) {
                    throw (
                      console.error('Error deleting images:', a),
                      G.toast.error('이미지 삭제에 실패했습니다'),
                      a
                    )
                  }
              },
              [a]
            ),
            o = (0, e.useCallback)(
              async (b) => {
                if (a)
                  try {
                    if (
                      !(
                        await fetch(`/api/customer/pets/${a}/images/${b}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isPrimary: !0 }),
                        })
                      ).ok
                    )
                      throw Error('Failed to set primary image')
                    ;(c((a) => a.map((a) => ({ ...a, isPrimary: a.id === b }))),
                      G.toast.success('대표 이미지가 설정되었습니다'))
                  } catch (a) {
                    throw (
                      console.error('Error setting primary image:', a),
                      G.toast.error('대표 이미지 설정에 실패했습니다'),
                      a
                    )
                  }
              },
              [a]
            ),
            p = (0, e.useCallback)(
              async (b, c) => {
                if (a)
                  try {
                    if (
                      !(
                        await fetch(`/api/customer/pets/${a}/images/${b}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ displayOrder: c }),
                        })
                      ).ok
                    )
                      throw Error('Failed to reorder image')
                    await k()
                  } catch (a) {
                    throw (
                      console.error('Error reordering image:', a),
                      G.toast.error('이미지 순서 변경에 실패했습니다'),
                      a
                    )
                  }
              },
              [a, k]
            )
          return {
            images: b,
            isLoading: d,
            isUploading: i,
            uploadProgress: g,
            fetchImages: k,
            uploadImages: l,
            deleteImage: m,
            deleteImages: n,
            setPrimaryImage: o,
            reorderImages: p,
          }
        })(h?.id || ''),
        T = async () => {
          w(!0)
          try {
            let a = await fetch('/api/breeds')
            if (!a.ok) throw Error('Failed to fetch breeds')
            let b = await a.json()
            t(b)
          } catch (a) {
            ;(console.error('Error fetching breeds:', a),
              G.toast.error('품종 목록을 불러오는데 실패했습니다'))
          } finally {
            w(!1)
          }
        },
        U = async (a) => {
          ;(await Q(a), j && j())
        },
        V = async (a) => {
          ;(await R(a), j && j())
        },
        W = async (a) => {
          ;(await S(a), j && j())
        }
      ;(0, e.useEffect)(() => {
        if ((a && T(), h && 'edit' === i)) {
          let a, b, c, d, e, f, g, i
          ;(K({
            name: h.name,
            type: h.type,
            breedId: h.breedId || '',
            weight: h.weight || void 0,
            age: h.age || void 0,
            birthDate: h.birthDate
              ? ((b = (a = new Date(h.birthDate)).getFullYear()),
                (c = String(a.getMonth() + 1).padStart(2, '0')),
                (d = String(a.getDate()).padStart(2, '0')),
                `${b}-${c}-${d}`)
              : void 0,
            gender: h.gender || void 0,
            hairType: h.hairType || void 0,
            specialNeeds: h.specialNeeds || '',
            vaccinationStatus: h.vaccinationStatus || 'UNKNOWN',
            vaccinationDate: h.vaccinationDate
              ? ((f = (e = new Date(h.vaccinationDate)).getFullYear()),
                (g = String(e.getMonth() + 1).padStart(2, '0')),
                (i = String(e.getDate()).padStart(2, '0')),
                `${f}-${g}-${i}`)
              : void 0,
            termsAcception: h.termsAcception || !1,
          }),
            h.id && P())
        } else
          (K({
            name: '',
            type: 'DOG',
            breedId: '',
            weight: void 0,
            age: void 0,
            birthDate: void 0,
            gender: void 0,
            hairType: void 0,
            specialNeeds: '',
            vaccinationStatus: 'UNKNOWN',
            vaccinationDate: void 0,
            termsAcception: !1,
          }),
            r([]))
        p({})
      }, [h, i, a, P])
      let X = (a) => {
          let { name: b, value: c } = a.target
          ;('weight' === b || 'age' === b
            ? K((a) => ({ ...a, [b]: c ? parseFloat(c) : void 0 }))
            : K((a) => ({ ...a, [b]: c })),
            o[b] && p((a) => ({ ...a, [b]: '' })))
        },
        Y = (a, b) => {
          ;(K((c) => ({ ...c, [a]: b })),
            'type' === a &&
              K((a) => ({ ...a, breedId: '', hairType: 'DOG' === b ? void 0 : a.hairType })))
        },
        Z = async () => {
          let a
          if (
            ((a = {}),
            J.name || (a.name = '이름은 필수입니다'),
            J.type || (a.type = '종류는 필수입니다'),
            J.termsAcception ||
              (a.termsAcception = '지병·노령견 미용 동의서에 동의해주셔야 합니다'),
            p(a),
            0 === Object.keys(a).length)
          ) {
            l(!0)
            try {
              let a = {
                ...J,
                birthDate: J.birthDate ? new Date(J.birthDate).toISOString() : void 0,
                vaccinationDate: J.vaccinationDate
                  ? new Date(J.vaccinationDate).toISOString()
                  : void 0,
              }
              ;('create' === i && q.length > 0 ? await d({ ...a, images: q }) : await d(a), c())
            } catch (a) {
              ;(console.error('Failed to save pet:', a),
                G.toast.error('반려동물 저장에 실패했습니다'))
            } finally {
              l(!1)
            }
          }
        }
      return (0, b.jsx)(D.Dialog, {
        open: a,
        onOpenChange: c,
        children: (0, b.jsxs)(D.DialogContent, {
          className: 'max-h-[90vh] overflow-y-auto sm:max-w-[700px]',
          children: [
            (0, b.jsx)(D.DialogHeader, {
              children: (0, b.jsx)(D.DialogTitle, {
                children: 'create' === i ? '반려동물 등록' : '반려동물 정보 수정',
              }),
            }),
            (0, b.jsxs)('div', {
              className: 'space-y-6',
              children: [
                'edit' === i && h?.id
                  ? (0, b.jsxs)('div', {
                      className: 'space-y-4',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'text-lg font-semibold',
                              children: '사진',
                            }),
                            (0, b.jsxs)('span', {
                              className: 'text-muted-foreground text-sm',
                              children: [L.length, '/10 사진'],
                            }),
                          ],
                        }),
                        (0, b.jsx)(M, {
                          images: L,
                          onUpload: U,
                          onDelete: V,
                          onSetPrimary: W,
                          maxImages: 10,
                          isUploading: O,
                          className: 'pb-4',
                        }),
                        0 === L.length &&
                          !N &&
                          (0, b.jsxs)('div', {
                            className: 'bg-muted/30 rounded-lg py-6 text-center',
                            children: [
                              (0, b.jsx)(x.Image, {
                                className: 'mx-auto mb-3 h-12 w-12 opacity-50',
                              }),
                              (0, b.jsx)('p', {
                                className: 'text-muted-foreground text-sm',
                                children: '사진을 추가하여 반려동물을 소개해주세요',
                              }),
                            ],
                          }),
                      ],
                    })
                  : 'create' === i &&
                    (0, b.jsxs)('div', {
                      className: 'space-y-4',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            (0, b.jsx)('h3', {
                              className: 'text-lg font-semibold',
                              children: '사진 추가 (선택사항)',
                            }),
                            (0, b.jsxs)('span', {
                              className: 'text-muted-foreground text-sm',
                              children: [q.length, '/10 사진'],
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'border-border rounded-lg border-2 border-dashed p-6',
                          children: [
                            (0, b.jsx)('input', {
                              type: 'file',
                              accept: 'image/*',
                              multiple: !0,
                              onChange: (a) => {
                                var b
                                let c, d
                                a.target.files &&
                                  ((b = Array.from(a.target.files)),
                                  (c = [
                                    'image/jpeg',
                                    'image/jpg',
                                    'image/png',
                                    'image/gif',
                                    'image/webp',
                                  ]),
                                  (d = b.filter((a) =>
                                    c.includes(a.type)
                                      ? !(a.size > 0xa00000) ||
                                        (G.toast.error(`${a.name}: 파일 크기가 10MB를 초과합니다`),
                                        !1)
                                      : (G.toast.error(`${a.name}: 지원하지 않는 파일 형식입니다`),
                                        !1)
                                  )),
                                  q.length + d.length > 10
                                    ? G.toast.error('최대 10개의 이미지만 업로드할 수 있습니다')
                                    : r((a) => [...a, ...d]))
                              },
                              className: 'hidden',
                              id: 'image-upload',
                            }),
                            (0, b.jsxs)('label', {
                              htmlFor: 'image-upload',
                              className: 'flex cursor-pointer flex-col items-center justify-center',
                              children: [
                                (0, b.jsx)(x.Image, { className: 'mb-3 h-12 w-12 opacity-50' }),
                                (0, b.jsx)('p', {
                                  className: 'mb-1 text-sm font-medium',
                                  children: '사진을 선택하세요',
                                }),
                                (0, b.jsx)('p', {
                                  className: 'text-muted-foreground text-xs',
                                  children: 'JPG, PNG, GIF, WebP (최대 10MB)',
                                }),
                              ],
                            }),
                          ],
                        }),
                        q.length > 0 &&
                          (0, b.jsx)('div', {
                            className: 'grid grid-cols-3 gap-2',
                            children: q.map((a, c) =>
                              (0, b.jsxs)(
                                'div',
                                {
                                  className: 'group relative',
                                  children: [
                                    (0, b.jsx)(v.default, {
                                      src: URL.createObjectURL(a),
                                      alt: `Preview ${c + 1}`,
                                      width: 120,
                                      height: 96,
                                      className: 'h-24 w-full rounded-lg object-cover',
                                    }),
                                    (0, b.jsx)('button', {
                                      type: 'button',
                                      onClick: () => {
                                        r((a) => a.filter((a, b) => b !== c))
                                      },
                                      className:
                                        'bg-destructive text-destructive-foreground absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100',
                                      children: (0, b.jsxs)('svg', {
                                        xmlns: 'http://www.w3.org/2000/svg',
                                        width: '16',
                                        height: '16',
                                        viewBox: '0 0 24 24',
                                        fill: 'none',
                                        stroke: 'currentColor',
                                        strokeWidth: '2',
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round',
                                        children: [
                                          (0, b.jsx)('line', {
                                            x1: '18',
                                            y1: '6',
                                            x2: '6',
                                            y2: '18',
                                          }),
                                          (0, b.jsx)('line', {
                                            x1: '6',
                                            y1: '6',
                                            x2: '18',
                                            y2: '18',
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                },
                                c
                              )
                            ),
                          }),
                      ],
                    }),
                (0, b.jsx)(F.Separator, {}),
                (0, b.jsxs)('div', {
                  className: 'space-y-4',
                  children: [
                    (0, b.jsx)('h3', { className: 'text-lg font-semibold', children: '기본 정보' }),
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)(B.Label, { htmlFor: 'type', children: '반려동물 종류 *' }),
                        (0, b.jsxs)(E.Select, {
                          value: J.type,
                          onValueChange: (a) => Y('type', a),
                          children: [
                            (0, b.jsx)(E.SelectTrigger, {
                              children: (0, b.jsx)(E.SelectValue, { placeholder: '종류 선택' }),
                            }),
                            (0, b.jsxs)(E.SelectContent, {
                              children: [
                                (0, b.jsx)(E.SelectItem, {
                                  value: 'DOG',
                                  children: (0, b.jsxs)('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      (0, b.jsx)(n.Dog, { className: 'h-4 w-4' }),
                                      '강아지',
                                    ],
                                  }),
                                }),
                                (0, b.jsx)(E.SelectItem, {
                                  value: 'CAT',
                                  children: (0, b.jsxs)('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      (0, b.jsx)(m.Cat, { className: 'h-4 w-4' }),
                                      '고양이',
                                    ],
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        o.type &&
                          (0, b.jsx)('p', { className: 'text-sm text-red-500', children: o.type }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'grid grid-cols-2 gap-4',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(B.Label, { htmlFor: 'name', children: '이름 *' }),
                            (0, b.jsx)(A.Input, {
                              id: 'name',
                              name: 'name',
                              value: J.name,
                              onChange: X,
                              placeholder: '반려동물 이름',
                              className: o.name ? 'border-red-500' : '',
                            }),
                            o.name &&
                              (0, b.jsx)('p', {
                                className: 'text-sm text-red-500',
                                children: o.name,
                              }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(B.Label, { htmlFor: 'breed', children: '품종' }),
                            u
                              ? (0, b.jsx)('div', {
                                  className:
                                    'flex h-10 items-center justify-center rounded-md border',
                                  children: (0, b.jsx)(g.LoadingSpinner, { size: 'sm' }),
                                })
                              : (0, b.jsxs)(E.Select, {
                                  value: J.breedId,
                                  onValueChange: (a) => Y('breedId', a),
                                  children: [
                                    (0, b.jsx)(E.SelectTrigger, {
                                      children: (0, b.jsx)(E.SelectValue, {
                                        placeholder: '품종을 선택하세요',
                                      }),
                                    }),
                                    (0, b.jsx)(E.SelectContent, {
                                      children: s
                                        .filter((a) => a.petType === J.type)
                                        .map((a) =>
                                          (0, b.jsx)(
                                            E.SelectItem,
                                            { value: a.id, children: a.name },
                                            a.id
                                          )
                                        ),
                                    }),
                                  ],
                                }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'grid grid-cols-2 gap-4',
                      children: [
                        'CAT' === J.type &&
                          (0, b.jsxs)('div', {
                            className: 'space-y-2',
                            children: [
                              (0, b.jsx)(B.Label, { htmlFor: 'hairType', children: '털 타입' }),
                              (0, b.jsxs)(E.Select, {
                                value: J.hairType,
                                onValueChange: (a) => Y('hairType', a),
                                children: [
                                  (0, b.jsx)(E.SelectTrigger, {
                                    children: (0, b.jsx)(E.SelectValue, {
                                      placeholder: '털 타입 선택',
                                    }),
                                  }),
                                  (0, b.jsxs)(E.SelectContent, {
                                    children: [
                                      (0, b.jsx)(E.SelectItem, {
                                        value: 'SHORT_HAIR',
                                        children: '단모',
                                      }),
                                      (0, b.jsx)(E.SelectItem, {
                                        value: 'LONG_HAIR',
                                        children: '장모',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(B.Label, { htmlFor: 'gender', children: '성별' }),
                            (0, b.jsxs)(E.Select, {
                              value: J.gender,
                              onValueChange: (a) => Y('gender', a),
                              children: [
                                (0, b.jsx)(E.SelectTrigger, {
                                  children: (0, b.jsx)(E.SelectValue, { placeholder: '성별 선택' }),
                                }),
                                (0, b.jsxs)(E.SelectContent, {
                                  children: [
                                    (0, b.jsx)(E.SelectItem, { value: 'MALE', children: '남자' }),
                                    (0, b.jsx)(E.SelectItem, { value: 'FEMALE', children: '여자' }),
                                    (0, b.jsx)(E.SelectItem, {
                                      value: 'UNKNOWN',
                                      children: '모름',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'grid grid-cols-2 gap-4',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(B.Label, { htmlFor: 'weight', children: '체중 (kg)' }),
                            (0, b.jsx)(A.Input, {
                              id: 'weight',
                              name: 'weight',
                              type: 'number',
                              step: '0.1',
                              value: J.weight || '',
                              onChange: X,
                              placeholder: '예: 5.5',
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(B.Label, { htmlFor: 'birthDate', children: '생년월일' }),
                            (0, b.jsx)(A.Input, {
                              id: 'birthDate',
                              name: 'birthDate',
                              type: 'date',
                              value: J.birthDate || '',
                              onChange: X,
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'grid grid-cols-2 gap-4',
                      children: [
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(B.Label, {
                              htmlFor: 'vaccinationStatus',
                              children: '예방접종 상태',
                            }),
                            (0, b.jsxs)(E.Select, {
                              value: J.vaccinationStatus,
                              onValueChange: (a) => Y('vaccinationStatus', a),
                              children: [
                                (0, b.jsx)(E.SelectTrigger, {
                                  children: (0, b.jsx)(E.SelectValue, {
                                    placeholder: '접종 상태 선택',
                                  }),
                                }),
                                (0, b.jsxs)(E.SelectContent, {
                                  children: [
                                    (0, b.jsx)(E.SelectItem, {
                                      value: 'UP_TO_DATE',
                                      children: '접종 완료',
                                    }),
                                    (0, b.jsx)(E.SelectItem, {
                                      value: 'OVERDUE',
                                      children: '접종 지연',
                                    }),
                                    (0, b.jsx)(E.SelectItem, {
                                      value: 'PARTIAL',
                                      children: '부분 접종',
                                    }),
                                    (0, b.jsx)(E.SelectItem, {
                                      value: 'UNKNOWN',
                                      children: '미확인',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, b.jsxs)('div', {
                          className: 'space-y-2',
                          children: [
                            (0, b.jsx)(B.Label, {
                              htmlFor: 'vaccinationDate',
                              children: '최근 접종일',
                            }),
                            (0, b.jsx)(A.Input, {
                              id: 'vaccinationDate',
                              name: 'vaccinationDate',
                              type: 'date',
                              value: J.vaccinationDate || '',
                              onChange: X,
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, b.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, b.jsx)(B.Label, { htmlFor: 'specialNeeds', children: '특이사항' }),
                        (0, b.jsx)(C.Textarea, {
                          id: 'specialNeeds',
                          name: 'specialNeeds',
                          value: J.specialNeeds,
                          onChange: X,
                          placeholder: '알레르기, 지병, 주의사항 등을 입력해주세요',
                          rows: 3,
                        }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsx)(F.Separator, {}),
                (0, b.jsxs)('div', {
                  className: 'rounded-lg border-2 border-orange-200 bg-orange-50 p-6',
                  children: [
                    (0, b.jsxs)('div', {
                      className: 'mb-4',
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-2 text-lg font-semibold text-orange-900',
                          children: '지병·노령견 미용 동의서',
                        }),
                        (0, b.jsx)('p', {
                          className: 'text-sm text-orange-700',
                          children:
                            '반려동물의 안전한 미용을 위해 아래 동의서를 확인하고 동의해주세요.',
                        }),
                      ],
                    }),
                    (0, b.jsxs)(f.Button, {
                      type: 'button',
                      variant: 'outline',
                      size: 'sm',
                      onClick: () => I(!H),
                      className:
                        'mb-4 w-full justify-between border-orange-300 bg-white hover:bg-orange-100',
                      children: [
                        (0, b.jsx)('span', {
                          className: 'text-sm font-medium',
                          children: H ? '동의서 내용 접기' : '동의서 내용 보기',
                        }),
                        H
                          ? (0, b.jsx)(z.ChevronUp, { className: 'h-4 w-4' })
                          : (0, b.jsx)(y.ChevronDown, { className: 'h-4 w-4' }),
                      ],
                    }),
                    H &&
                      (0, b.jsxs)('div', {
                        className: 'mb-4 space-y-4 rounded-lg bg-white p-4 text-sm',
                        children: [
                          (0, b.jsxs)('div', {
                            className: 'rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3',
                            children: [
                              (0, b.jsx)('p', {
                                className: 'mb-1 font-semibold text-orange-800',
                                children: '※ 안내사항 ※',
                              }),
                              (0, b.jsx)('p', {
                                className: 'text-orange-700',
                                children:
                                  '지병(뇌질환, 심장질환, 보행불가 등)이 있거나 노령견(만 10세 이상)인 경우 반드시 "지병·노령견 미용 동의서"를 작성해주셔야 합니다.',
                              }),
                            ],
                          }),
                          (0, b.jsxs)('ol', {
                            className: 'list-decimal space-y-3 pl-5 text-gray-700',
                            children: [
                              (0, b.jsx)('li', {
                                children:
                                  '미미살롱펫은 반려견 미용 시 반려견의 건강과 안전을 최우선으로 고려하여 소홀함 없이 최대한 주의를 기울여 미용을 진행할 것을 약속드립니다.',
                              }),
                              (0, b.jsx)('li', {
                                children:
                                  '다만, 노령견 및 지병이 있는 반려견의 경우 노화 및 기존 질환으로 인한 각종 위험 요인이 존재할 수 있으며 미용 후 상태 악화 또는 스트레스 유발로 인한 원치 않는 상황이 발생할 가능성이 있음을 사전 고지드립니다.',
                              }),
                              (0, b.jsx)('li', {
                                children:
                                  '미미살롱펫은 최대한 보호자의 입장에서 아이들의 상태를 살피며 미용을 진행하겠습니다. 그러나 위와 같은 상황으로 인해 발생하는 건강 이상 및 사고에 대해 미미살롱펫은 법적 책임을 지지 않음에 대해 보호자의 사전 동의를 요청드립니다.',
                              }),
                              (0, b.jsx)('li', {
                                children:
                                  '또한, 본 동의서는 미용 서비스 진행 시마다 매번 작성하실 필요 없이, 1회 서명으로 향후 동일 조건 하에 동일하게 적용됩니다.',
                              }),
                            ],
                          }),
                        ],
                      }),
                    (0, b.jsxs)('div', {
                      className: 'flex items-start space-x-3',
                      children: [
                        (0, b.jsx)('input', {
                          type: 'checkbox',
                          id: 'termsAcception',
                          checked: J.termsAcception,
                          onChange: (a) => K((b) => ({ ...b, termsAcception: a.target.checked })),
                          className:
                            'mt-1 h-5 w-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500',
                        }),
                        (0, b.jsxs)('div', {
                          className: 'flex-1',
                          children: [
                            (0, b.jsxs)(B.Label, {
                              htmlFor: 'termsAcception',
                              className: 'cursor-pointer text-base font-semibold text-orange-900',
                              children: [
                                '위 내용을 확인하였으며 지병·노령견 미용 동의서에 동의합니다',
                                ' ',
                                (0, b.jsx)('span', { className: 'text-red-500', children: '*' }),
                              ],
                            }),
                            o.termsAcception &&
                              (0, b.jsx)('p', {
                                className: 'mt-1 text-sm text-red-500',
                                children: o.termsAcception,
                              }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, b.jsxs)(D.DialogFooter, {
              children: [
                (0, b.jsx)(f.Button, {
                  variant: 'outline',
                  onClick: c,
                  disabled: k,
                  children: '취소',
                }),
                (0, b.jsx)(f.Button, {
                  onClick: Z,
                  disabled: k,
                  children: k
                    ? (0, b.jsxs)(b.Fragment, {
                        children: [
                          (0, b.jsx)(g.LoadingSpinner, { size: 'sm', className: 'mr-2' }),
                          '저장 중...',
                        ],
                      })
                    : '저장',
                }),
              ],
            }),
          ],
        }),
      })
    }
    var O = a.i(251653),
      P = a.i(915618),
      Q = a.i(920140)
    function R() {
      let { data: a, isPending: i } = (0, c.useSession)(),
        j = (0, d.useRouter)(),
        {
          pets: k,
          isLoading: l,
          createPet: m,
          updatePet: n,
          deletePet: o,
          fetchPets: p,
        } = (0, O.usePets)(),
        [q, r] = (0, e.useState)(!1),
        [s, t] = (0, e.useState)(),
        [u, v] = (0, e.useState)('create')
      ;(0, e.useEffect)(() => {
        ;(a || j.push('/auth/signin'),
          a?.user?.role && 'CUSTOMER' !== a.user.role && j.push('/dashboard'))
      }, [a, j])
      let x = () => {
          ;(t(void 0), v('create'), r(!0))
        },
        y = (a) => {
          ;(t(a), v('edit'), r(!0))
        },
        z = async (a) => {
          if ('edit' === u && s) (await n(s.id, a), await p())
          else {
            let { images: b, ...c } = a,
              d = await m(c)
            if (b && b.length > 0 && d?.id)
              try {
                let a = new FormData()
                ;(b.forEach((b) => {
                  a.append('files', b)
                }),
                  (await fetch(`/api/customer/pets/${d.id}/images`, { method: 'POST', body: a })).ok
                    ? (G.toast.success(`${b.length}개의 이미지가 업로드되었습니다`), await p())
                    : (console.error('Failed to upload images'),
                      G.toast.error('이미지 업로드에 실패했습니다')))
              } catch (a) {
                console.error('Error uploading images:', a)
              }
          }
        }
      return i
        ? (0, b.jsx)('div', {
            className: 'flex min-h-screen items-center justify-center',
            children: (0, b.jsx)(g.LoadingSpinner, { size: 'lg' }),
          })
        : a && a.user?.role === 'CUSTOMER'
          ? (0, b.jsxs)('div', {
              className: 'bg-background min-h-screen',
              children: [
                (0, b.jsx)('header', {
                  className: 'border-border border-b',
                  children: (0, b.jsx)(h.PageHeader, {
                    title: '내 반려동물',
                    description: '반려동물 정보를 관리하고 예약 시 선택할 수 있습니다',
                    children: (0, b.jsxs)(f.Button, {
                      onClick: x,
                      children: [
                        (0, b.jsx)(P.Plus, { className: 'mr-2 h-4 w-4' }),
                        '반려동물 추가',
                      ],
                    }),
                  }),
                }),
                (0, b.jsxs)('main', {
                  className: 'container mx-auto px-4 py-8',
                  children: [
                    l
                      ? (0, b.jsx)('div', {
                          className: 'flex items-center justify-center py-12',
                          children: (0, b.jsx)(g.LoadingSpinner, { size: 'lg' }),
                        })
                      : 0 === k.length
                        ? (0, b.jsx)('div', {
                            className: 'mx-auto max-w-md',
                            children: (0, b.jsxs)('div', {
                              className:
                                'border-border rounded-lg border-2 border-dashed p-12 text-center',
                              children: [
                                (0, b.jsx)(Q.PawPrint, {
                                  className: 'text-muted-foreground mx-auto mb-4 h-16 w-16',
                                }),
                                (0, b.jsx)('h2', {
                                  className: 'mb-2 text-xl font-semibold',
                                  children: '등록된 반려동물이 없습니다',
                                }),
                                (0, b.jsx)('p', {
                                  className: 'text-muted-foreground mb-6',
                                  children: '반려동물을 등록하고 미용 서비스를 예약해보세요',
                                }),
                                (0, b.jsxs)(f.Button, {
                                  onClick: x,
                                  size: 'lg',
                                  children: [
                                    (0, b.jsx)(P.Plus, { className: 'mr-2 h-5 w-5' }),
                                    '첫 반려동물 등록하기',
                                  ],
                                }),
                              ],
                            }),
                          })
                        : (0, b.jsx)('div', {
                            className: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
                            children: k.map((a) =>
                              (0, b.jsx)(w, { pet: a, onEdit: y, onDelete: o }, a.id)
                            ),
                          }),
                    k.length > 0 &&
                      (0, b.jsxs)('div', {
                        className: 'bg-card border-border mt-12 rounded-lg border p-6',
                        children: [
                          (0, b.jsx)('h2', {
                            className: 'mb-4 text-lg font-semibold',
                            children: '반려동물 통계',
                          }),
                          (0, b.jsxs)('div', {
                            className: 'grid grid-cols-1 gap-6 md:grid-cols-3',
                            children: [
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('p', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '총 반려동물',
                                  }),
                                  (0, b.jsxs)('p', {
                                    className: 'text-2xl font-bold',
                                    children: [k.length, '마리'],
                                  }),
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('p', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '강아지',
                                  }),
                                  (0, b.jsxs)('p', {
                                    className: 'text-2xl font-bold',
                                    children: [k.filter((a) => 'DOG' === a.type).length, '마리'],
                                  }),
                                ],
                              }),
                              (0, b.jsxs)('div', {
                                children: [
                                  (0, b.jsx)('p', {
                                    className: 'text-muted-foreground text-sm',
                                    children: '고양이',
                                  }),
                                  (0, b.jsxs)('p', {
                                    className: 'text-2xl font-bold',
                                    children: [k.filter((a) => 'CAT' === a.type).length, '마리'],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    (0, b.jsxs)('div', {
                      className: 'bg-muted/50 mt-8 rounded-lg p-6',
                      children: [
                        (0, b.jsx)('h3', {
                          className: 'mb-3 font-semibold',
                          children: '💡 알아두세요',
                        }),
                        (0, b.jsxs)('ul', {
                          className: 'text-muted-foreground space-y-2 text-sm',
                          children: [
                            (0, b.jsx)('li', {
                              children: '• 반려동물 정보는 예약 시 미용사에게 전달됩니다',
                            }),
                            (0, b.jsx)('li', {
                              children: '• 예방접종 정보를 최신으로 유지해주세요',
                            }),
                            (0, b.jsx)('li', {
                              children: '• 특이사항은 미용 시 주의사항으로 활용됩니다',
                            }),
                            (0, b.jsx)('li', {
                              children: '• 정확한 체중 정보는 서비스 요금 산정에 도움이 됩니다',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsx)(N, {
                  isOpen: q,
                  onClose: () => {
                    ;(r(!1), t(void 0))
                  },
                  onSave: z,
                  pet: s,
                  mode: u,
                  onImagesUpdated: p,
                }),
              ],
            })
          : null
    }
    a.s(['default', () => R], 684713)
  },
]

//# sourceMappingURL=src_app_customer_pets_page_tsx_219730ff._.js.map
