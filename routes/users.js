const express = require('express')
const path = require('path')
const fs = require('fs')

const router = express.Router()

router.get('/users', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'users.html'))
})

router.get('/connection/ping', (req, res, next) => res
  .status(201)
  .json({ sucess: true }))

router.get('/postData1', (req, res, next) => res.status(200).json({
  code: '429',
  message: 'You exceeded your quota for the requested resource.',
  source: 'application',
  url: 'https://www.google.com'
}))

let postData1Count = 0
router.post('/postData1', (req, res, next) => {
  postData1Count += 1
  return res.status(200).json({
    code: 200,
    message: 'Success',
    data: {
      id: postData1Count,
      name: 'John Doe'
    }
  })
})

let postData12Count = 0
router.post('/postData12', (req, res, next) => {
  postData12Count += 1
  return res.status(200).json({
    data: [{
      code: 200,
      message: 'Success',
      data: {
        id: `postData12_${postData12Count}`,
        postData12_id: postData12Count,
        name: 'John Doe 12'
      }
    }]
  })
})

router.post('/nores', (req, res, next) => res.status(200).json({}))

// IO-222214 repro: always fail each record with a non-retryable application error
router.post('/postDataFail', (req, res, next) => res.status(422).json({
  code: '422',
  message: 'IO-222214 repro forced import failure',
  source: 'application'
}))

// router.post('/ping', (req, res, next) => res.status(200).json({ success: true }))

router.post('/ping', (req, res, next) => res.status(429).json({
  id: rateCount,
  code: '429',
  message: 'You exceeded your quota for the requested resource.',
  source: 'application',
  classification: 'rate_limit'
}))

router.post('/pingLender', (req, res, next) => res.status(200).json({
  id: 123,
  sucess: true
}))

router.post('/pingBorrower', (req, res, next) => res.status(200).json({
  id: 123,
  sucess: true
}))


let count = 0
let rateCount = 0
let pageCount = 0
let pageCounta = 0
let pageCountb = 0
let pageCountc = 0

router.patch('/postData', (req, res, next) => {
  rateCount += 1
  console.log(`rateCount = ${rateCount}`)
  console.log(`---------------${req.body.id}`)

  if (rateCount % 10 === 0 || req.body.id === 'childId1 2' || req.body.id === 'order_id_1') {
    return res.status(200).json({
      id: rateCount,
      message: '2nd records.',
      source: 'application',
      parentKey: 11,
      url: '/postData'
    })
  }
  // if (rateCount > 5) {
  //   setTimeout(() => res.status(200).json({
  //     id: rateCount,
  //     message: '2nd records.',
  //     source: 'application',
  //     parentKey: 11,
  //     url: '/postData'
  //   }), 10000)
  // } else {
  // if (rateCount === 10) {
  //   return res.status(302).json({
  //     id: rateCount,
  //     message: 'last resourcd.',
  //     source: 'application'
  //   })
  // }
  // if (rateCount % 999 === 0) {
  //   return res.status(200).json({
  //     id: rateCount,
  //     message: '2nd records.',
  //     source: 'application',
  //     parentKey: 11,
  //     url: '/postData'
  //   })
  // }
  return res.status(429).json({
    id: rateCount,
    code: '419',
    message: 'You exceeded your quota for the requested resource.',
    source: 'application',
    classification: 'rate_limit'
  })
  // }
})

router.get('/PageData', (req, res, next) => {
  pageCount += 1
  setTimeout(() => {
    console.log(`pageCount = ${pageCount}`)
    // if (pageCount % 2 === 0) {
    //   return res.status(500)
    //     .json({
    //       errors: [{
    //         code: '401',
    //         message: 'You exceeded your quota for the requested resource.',
    //       }]
    //     })
    //     // .json({
    //     //   id: pageCount,
    //     //   message: '0th records.',
    //     //   source: 'application',
    //     //   parentKey: 11,
    //     //   url: '/PageData'
    //     // })
    // }
    // if (pageCount === 4) {
    //   return res.status(200).json({})
    // }
    if (pageCount % 5 === 0) {
      return res.status(302).json({
        id: pageCount,
        message: 'last resourcd.',
        source: 'application'
      })
    }
    return res.status(200).json({
      id: pageCount,
      message: 'records.',
      source: 'application',
      url: '/PageData'
    })
  }, 20000)
})

router.get('/postData12', async (req, res, next) => {
  await new Promise(resolve => setTimeout(resolve, 5000))
  return res.status(429).json({
    code: '429',
    message: 'You exceeded your quota for the requested resource.',
    source: 'application'
  })
})

router.get('/postData13', (req, res, next) => res.status(443).json({
  code: 'ETIMEDOUT',
  message: 'Target service is taking long time to respond. [connect ETIMEDOUT 136.34.67.39:8080]',
  source: 'application'
}))

router.post('/postData', async (req, res, next) => {
  count += 1
  // console.log(`req?.body = ${JSON.stringify(req?.body)}`)
  // await 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000))
  if (req?.body?.id === '269') {
    console.log(`req?.body = ${JSON.stringify(req?.body)}`)
    return res.status(422).json({
      code: '422',
      message: 'You exceeded your quota for the requested resource.',
      source: 'application'
    })
  }

  console.log(`34 count = ${count}`)

  // if (count % 2 === 0) {
  return res
    .status(200)
    // .json('Too Many Requests')
    .json({ data: req.body })
    //   code: '404',
    //   message: 'some random error.',
    //   source: 'application'
    // })
  // i will get multiple body data in this request return same number of response
  // const data = req.body.forEach(item => ({
  //   code: '404',
  //   message: 'some random error.',
  //   source: 'application'
  // }))
  // return res.status(200).json({ data })
})

let postData1_Count = 0
router.post('/postData1', (req, res, next) => {
  postData1_Count += 1
  return res
    .status(200)
    .json({
      id: `postData1_${postData1_Count}`,
      postData1_id: postData1_Count,
      sucess: true
    })
})

router.get('/reportsDetails', (req, res, next) => res.status(200).json([[
  {
    id: '145011',
    recordType: 'expensereport',
    ReportID: '29ADAD4DD27A4AD19E03',
    ExternalID: 'AMEX_CBCP_29ADAD4DD27A4AD19E03',
    LineID: '0',
    JournalID: '',
    PaymentType: '',
    Amount: '.00',
    'Line ID': '0',
    IDID: '145011',
    ExpenseEntriesList: [
      {
        EntryImageID: '',
        JournalID: '36157533',
        ItemizationsList: [
          {
            JournalID: '36157533',
            EntryImageID: ''
          }
        ]
      },
      {
        EntryImageID: 'E08FB9A1FB614031B0D2D5457035183B',
        JournalID: '36157532',
        ItemizationsList: [
          {
            JournalID: '36157532',
            EntryImageID: 'E08FB9A1FB614031B0D2D5457035183B'
          }
        ],
        image: {
          Id: 'E08FB9A1FB614031B0D2D5457035183B',
          Url: 'https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/FB0359DC81E8B12B5D199B08F8CCEDD1746974E711BE11CC2DF963F55F80B32BE846556893F7A412AF115564D806895A971C159048CB9C49A464DA61CBC4118E1ACF1889793224114AFB34309B5262133AH79A584A0177E2D2B4CD8EED45EFAEAE1?id=E08FB9A1FB614031B0D2D5457035183B&e=p00211437zpd&t=SN&s=ConcurConnect'
        }
      },
      {
        EntryImageID: '1B657A161AE945928302A64B4049F5E6',
        JournalID: '36157535',
        ItemizationsList: [
          {
            JournalID: '36157535',
            EntryImageID: '1B657A161AE945928302A64B4049F5E6'
          },
          {
            JournalID: '36157534',
            EntryImageID: '1B657A161AE945928302A64B4049F5E6'
          }
        ],
        image: {
          Id: '1B657A161AE945928302A64B4049F5E6',
          Url: 'https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/B494BE6DFB3F9CB4BDB00E3D9E218A10BF0D6BC7DC03BB4B7812233F94FD34C93115E9E45F919B055B73294C37F05F7714513164CEF80F2953B0550BF797AE65FEB32BD15AA3BB1048E249C38326F27AA6HD7916AC776AF92884D9E8BC11E06AD8F?id=1B657A161AE945928302A64B4049F5E6&e=p00211437zpd&t=SN&s=ConcurConnect'
        }
      },
      {
        EntryImageID: '6D291C71B9E34AAB8807A815078C1F30',
        JournalID: '36157537',
        ItemizationsList: [
          {
            JournalID: '36157537',
            EntryImageID: '6D291C71B9E34AAB8807A815078C1F30'
          },
          {
            JournalID: '36157536',
            EntryImageID: '6D291C71B9E34AAB8807A815078C1F30'
          }
        ],
        image: {
          Id: '6D291C71B9E34AAB8807A815078C1F30',
          Url: 'https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/3E615647164A14DE0320DE5C988737980DC782A18DDA1FE1E58C9183C13D0C2DCD1193E24629632CF029D0FDDE6180FF13669A2AD64168198F2E5C392DF1214237A33FD8E2830BB5A0C7E10C0EE9DEC7E6H4BD33D81D0974616F618AF4E3461292D?id=6D291C71B9E34AAB8807A815078C1F30&e=p00211437zpd&t=SN&s=ConcurConnect'
        }
      },
      {
        EntryImageID: '',
        JournalID: '36157531',
        ItemizationsList: [
          {
            JournalID: '36157531',
            EntryImageID: ''
          }
        ]
      },
      {
        EntryImageID: '6DA6E054508B4FFD986D74C37278C746',
        JournalID: '36157530',
        ItemizationsList: [
          {
            JournalID: '36157530',
            EntryImageID: '6DA6E054508B4FFD986D74C37278C746'
          }
        ],
        image: {
          Id: '6DA6E054508B4FFD986D74C37278C746',
          Url: 'https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/E621AA6E775A54E6CBB2C2576AF93176DA8FC4DEDD41D50F8025094E311AA821C555EA8E17BED567ECC9F2FF4C41315152D7079CCCA661F5181CE035F15F0656029138E2A4EAAFF9826EA8EFE0227F8285HE4F504C84B737FE1894E3DF760C28C65?id=6DA6E054508B4FFD986D74C37278C746&e=p00211437zpd&t=SN&s=ConcurConnect'
        }
      },
      {
        EntryImageID: '',
        JournalID: '36157529',
        ItemizationsList: [
          {
            JournalID: '36157529',
            EntryImageID: ''
          }
        ]
      }
    ],
    sub_id: '',
    Sub_code: '',
    Sub_shortCode: '',
    Sub_value: ''
  }
]]))

let data = 0
router.post('/lookup', (req, res, next) => {
  data += 1
  console.log(data)
  console.log(`---------------${req.body.id}`)
  if (data % 8 === 0 || req.body.id === 'order_id_1') {
    return res.status(200).json({
      id: `result_id_${data}`,
      result_id: data,
      message: 'You exceeded your quota for the requested resource.',
      source: 'application',
      invoices: null
    })
  }
  // if ([16, 19, 24, 27].indexOf(req.body.id) === -1) {
  return res.status(429).json({
    code: '429',
    id: data,
    message: 'You exceeded your quota for the requested resource.',
    source: 'application',
    classification: 'rate_limit'
  })
  // }
  // if (data % 4 === 0) {
  //   return res.status(302).json({
  //     id: data,
  //     message: 'You exceeded your quota for the requested resource.',
  //     source: 'application'
  //   })
  // }
  // if (data % 3 === 0) {
  //   return res.status(422).json({
  //     id: data,
  //     message: 'You exceeded your quota for the requested resource.',
  //     error: 'application'
  //   })
  // }
  // const d = 0
})
let status = 0
router.get('/status', (req, res, next) => {
  status += 1
  if (status % 2 === 0) {
    return res.status(200).json({
      id: `status_${status}`,
      status_id: status,
      processingStatus: 'DONE',
      source: 'application'
    })
  }
  return res.status(200).json({
    id: `status_${status}`,
    status_id: status,
    processingStatus: 'IN_PROGRESS',
    source: 'application'
  })
})

router.get('/lookup', (req, res, next) => res.status(200).json([{
  id: 'repro-not-required-001',
  has_bcid: true,
  has_variant_changes: false,
  require_manual_review: false
}]))

router.post('/postDataS', (req, res, next) => res.status(429).json({
  code: '429',
  message: 'You exceeded your quota for the requested resource.',
  source: 'application'
}))

// bulkData

router.post('/bulkData', (req, res, next) => res.status(200).json({
  success: true,
}))

// res.status(500)
//   .json({
//     errors: [{
//       code: '401',
//       message: 'You exceeded your quota for the requested resource.',
//     }]
//   }))

const largeData_export = require('./data_1.json')

let data_oneToMany = 0
router.get('/oneToMany', (req, res, next) => {
  data_oneToMany += 1
  const dataSlice = largeData_export[0]
  dataSlice.child = largeData_export[0].child.slice(0, 4)
  // if (data_oneToMany % 3 === 0) {
  //   return res.status(302).json({
  //     id: data_oneToMany,
  //     message: 'You exceeded your quota for the requested resource.',
  //     source: 'application'
  //   })
  // }
  // if (data_oneToMany % 2 === 0) {
  //   return res.status(422).json({
  //     id: data_oneToMany,
  //     message: 'You exceeded your quota for the requested resource.',
  //     error: 'application'
  //   })
  // }
  // return res.status(401).json({ error: "Couldn't authenticate you" })
  return res.status(200).json([{ ...dataSlice, id: 'order_id_1' }, { ...dataSlice, id: 'order_id_2' }, { ...dataSlice, id: 'order_id_3' }, { ...dataSlice, id: 'order_id_4' }, { ...dataSlice, id: 'order_id_5' }])
})
// .json([
//   {
//     id: 15,
//     code: '429',
//     message: 'You exceeded your quota for the requested resource.',
//     source: 'application',
//     parentKey: 11,
//     child: [
//       {
//         id: 16,
//         name: 'name',
//         parentKey: 12,
//         childKey: 22,
//         currentErrors: [
//           {
//             errorData: {
//               message: 'message',
//               errorData: [{
//                 errorData: 'errorData'
//               }]
//             },
//             message: 'message 1'
//           }
//         ]
//       }, {
//         id: 17,
//         name: 'name',
//         parentKey: 12,
//         childKey: 23,
//         currentErrors: [{
//           errorData: [{
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           }],
//           message: 'message 2'
//         }]
//       }, {
//         id: 18,
//         name: 'name',
//         parentKey: 12,
//         childKey: 24,
//         currentErrors: [
//           {
//             errorData: {
//               message: 'message',
//               errorData: [{
//                 errorData: 'errorData'
//               }]
//             },
//             message: 'message 3'
//           }
//         ]
//       }, {
//         id: 19,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: [{
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           }],
//           message: 'message 4'
//         }]
//       }, {
//         id: 20,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: [{
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           }],
//           message: 'message 5'
//         }]
//       }, {
//         id: 21,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 6'
//         }]
//       }, {
//         id: 22,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 7'
//         }]
//       }, {
//         id: 23,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 7'
//         }]
//       }, {
//         id: 24,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 7'
//         }]
//       }, {
//         id: 25,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 7'
//         }]
//       }, {
//         id: 26,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 7'
//         }]
//       }, {
//         id: 27,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 7'
//         }]
//       }, {
//         id: 28,
//         name: 'name',
//         parentKey: 12,
//         childKey: 25,
//         currentErrors: [{
//           errorData: {
//             message: 'message',
//             errorData: {
//               errorData: 'errorData'
//             }
//           },
//           message: 'message 7'
//         }]
//       }]
//   }]))

router.get('/oneToManyD', (req, res, next) => res.status(200).json([
  {

    id: 11,
    name: 'name',
    parentKey: 12,
    childKey: 22,
    currentErrors: [
      {
        errorData: [{
          message: 'message',
          errorData: [
            {
              errorData: 'errorData'
            }
          ]
        }],
        message: 'message 1'
      }
    ]
  },
  {
    id: 12,
    name: 'name',
    parentKey: 12,
    childKey: 22,
    currentErrors: [
      {
        errorData: {
          message: 'message',
          errorData: [
            {
              errorData: 'errorData'
            }
          ]
        },
        message: 'message 2'
      }
    ]
  },
  {
    id: 13,
    name: 'name',
    parentKey: 12,
    childKey: 22,
    currentErrors: [
      {
        errorData: {
          message: 'message',
          errorData: [
            {
              errorData: 'errorData'
            }
          ]
        },
        message: 'message 3'
      }
    ]
  },
  {
    id: 14,
    name: 'name',
    parentKey: 12,
    childKey: 22,
    currentErrors: [
      {
        errorData: [{
          message: 'message',
          errorData: [
            {
              errorData: 'errorData'
            }
          ]
        }],
        message: 'message 4'
      }
    ]
  },
  {
    id: 15,
    name: 'name',
    parentKey: 12,
    childKey: 22,
    currentErrors: [
      {
        errorData: {
          message: 'message',
          errorData: [
            {
              errorData: 'errorData'
            }
          ]
        },
        message: 'message 5'
      }
    ]

  },
  {
    id: 16,
    name: 'name',
    parentKey: 12,
    childKey: 22,
    currentErrors: [
      {
        errorData: {
          message: 'message',
          errorData: [
            {
              errorData: 'errorData'
            }
          ]
        },
        message: 'message 6'
      }
    ]
  }
]))

router.get('/pathToMany', (req, res, next) => res.status(200).json([
  [{
    id: 15,
    code: '429',
    message: 'You exceeded your quota for the requested resource.',
    source: 'application',
    parentKey: 11
  }],
  [{
    id: 18,
    code: '429',
    message: 'You exceeded your quota for the requested resource.',
    source: 'application',
    parentKey: 14
  }],
  [{
    id: 30,
    code: '429',
    message: 'You exceeded your quota for the requested resource.',
    child: [],
    parentKey: 19
  }]
]))

router.get('/noresponse', (req, res, next) => res.status(200).json({
  success: true,
}))

router.get('/unlimitedReq', (req, res, next) => res.status(200).json([
  {
    id: 15,
    code: '429',
    message: 'You exceeded your quota for the requested resource.',
    source: 'application',
    parentKey: 11
  },
  {
    id: 18,
    code: '429',
    message: 'You exceeded your quota for the requested resource.',
    source: 'application',
    parentKey: 14
  },
  {
    id: 30,
    code: '429',
    message: 'You exceeded your quota for the requested resource.',
    parentKey: 19,
    nextUrl: 'unlimitedReq'
  }
]))

router.get('/unlimitedLookup', (req, res, next) => res.status(200).json([
  {
    id: 45,
    parentKeys: 11
  },
  {
    id: 330,
    nextUrl: 'unlimitedReq'
  }
]))

let count1 = 0

router.get('/changeTypes', (req, res, next) => {
  count1 += 1
  // if (count1 % 2 === 0) {
  return res.status(200).json([
    {
      id: count1,
      message: 11,
      errorData: [
        {
          message: 'data'
        }
      ]
    },
    {
      id: count1,
      message: 98,
      errorData: {
        message: 'data 2'
      }
    }
  ])
  // }
  // return res.status(200).json({
  //   id: count1,
  //   message: 24
  // })
})

router.get('/page', (req, res, next) => res.render('<form action="http://someotherserver.com" method="post">'))

router.get('/emptyReq', (req, res, next) => res.json([{}]))

let rateLimitCount = 0
// router.post('/rateLimit', (req, res, next) => {
//   rateLimitCount += 1
//   if (rateLimitCount === 1 || rateLimitCount === 2 || rateLimitCount === 3) {
//     return res.status(200).json({
//       id: rateLimitCount,
//       sucess: true
//     })
//   }
//   res.status(429).json({
//     code: '429',
//     message: 'You exceeded your quota for the requested resource.',
//     source: 'application',
//     classification: 'rate_limit'
//   })
// })

router.post('/rateLimit', (req, res, next) => {
  rateLimitCount += 1
  if (rateLimitCount === 1) {
    return res.status(200).json({
      id: rateLimitCount,
      sucess: true
    })
  }
  res.status(302).json({
    id: 123,
    sucess: true
  })
})

router.post('/rateLimitImp', (req, res, next) => res.status(429).json({
  code: '429',
  message: 'You exceeded your quota for the requested resource.',
  source: 'application',
  classification: 'rate_limit'
}))

// router.post('/rateLimitImp', (req, res, next) => res.status(200).json({
//   id: 123,
//   sucess: true
// }))

router.post('/rateLimitExp', (req, res, next) => res.status(429).json({
  code: '429',
  message: 'You exceeded your quota for the requested resource.',
  source: 'application',
  classification: 'rate_limit'
}))

// router.post('/rateLimitExp', (req, res, next) => res.status(200).json({
//   id: 123,
//   sucess: true
// }))

router.get('/PageDataa', (req, res, next) => {
  pageCounta += 1
  setTimeout(() => {
    console.log(`pageCounta = ${pageCounta}`)
    if (pageCounta === 1) {
      return res.status(200).json({
        id: pageCounta,
        message: '0th records.',
        source: 'application',
        parentKey: 11,
        url: '/PageDataa'
      })
    }
    // if (pageCount === 4) {
    //   return res.status(200).json({})
    // }
    if (pageCounta === 25) {
      return res.status(302).json({
        id: pageCounta,
        message: 'last resourcd.',
        source: 'application'
      })
    }
    return res.status(200).json({
      id: pageCounta,
      message: 'records.',
      source: 'application',
      url: '/PageDataa'
    })
  }, 20000)
})

router.get('/PageDatab', (req, res, next) => {
  pageCountb += 1
  setTimeout(() => {
    console.log(`pageCountb = ${pageCountb}`)
    const traceKey = `${pageCountb}_message`

    if (pageCountb === 1) {
      return res.status(200).json({
        id: pageCountb,
        number: pageCountb,
        message: '0th_records.',
        source: 'application',
        parentKey: 11,
        url: '/PageDatab',
        ...(pageCountb % 2 === 1 ? {
          traceKeyObj: [
            {
              traceKey
            }
          ]
        } : {})
      })
    }
    // if (pageCount === 4) {
    //   return res.status(200).json({})
    // }
    if (pageCountb === 15) {
      return res.status(302).json({
        id: pageCountb,
        number: pageCountb,
        message: 'last_resourcd.',
        source: 'application',
        ...(pageCountb % 2 === 1 ? {
          traceKeyObj: [
            {
              traceKey
            }
          ]
        } : {})
      })
    }
    return res.status(200).json({
      id: pageCountb,
      number: pageCountb,
      message: 'records.',
      source: 'application',
      url: '/PageDatab',
      ...(pageCountb % 2 === 1 ? {
        traceKeyObj: [
          {
            traceKey
          }
        ]
      } : {})
    })
  }, 30000)
})

router.get('/PageDatac', (req, res, next) => {
  pageCountc += 1
  setTimeout(() => {
    console.log(`pageCountc = ${pageCountc}`)
    if (pageCountc === 1) {
      return res.status(200).json({
        id: pageCountc,
        message: '0th records.',
        source: 'application',
        parentKey: 11,
        url: '/PageDatac'
      })
    }
    // if (pageCount === 4) {
    //   return res.status(200).json({})
    // }
    if (pageCountc === 25) {
      return res.status(302).json({
        id: pageCountc,
        message: 'last resourcd.',
        source: 'application'
      })
    }
    return res.status(200).json({
      id: pageCountc,
      message: 'records.',
      source: 'application',
      url: '/PageDatac'
    })
  }, 30000)
})

router.get('/googleRateLImit', (req, res) => {
  res.status(403).json({
    error: {
      code: 403,
      message: "Quota exceeded for quota metric 'Queries' and limit 'Queries per minute per user' of service 'gmail.googleapis.com' for consumer 'project_number:677032035677'.",
      errors: [
        {
          message: "Quota exceeded for quota metric 'Queries' and limit 'Queries per minute per user' of service 'gmail.googleapis.com' for consumer 'project_number:677032035677'.",
          domain: 'usageLimits',
          reason: 'rateLimitExceeded'
        }
      ],
      status: 'PERMISSION_DENIED',
      details: [
        {
          '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
          reason: 'RATE_LIMIT_EXCEEDED',
          domain: 'googleapis.com',
          metadata: {
            quota_metric: 'gmail.googleapis.com/default',
            quota_limit_value: '15000',
            service: 'gmail.googleapis.com',
            consumer: 'projects/677032035677',
            quota_location: 'global',
            quota_limit: 'defaultPerMinutePerUser'
          }
        },
        {
          '@type': 'type.googleapis.com/google.rpc.Help',
          links: [
            {
              description: 'Request a higher quota limit.',
              url: 'https://cloud.google.com/docs/quota#requesting_higher_quota'
            }
          ]
        }
      ]
    }
  })
})

router.get('/httpWebSocketError', (req, res) => {
  res.status(403).json({
    message: 'Connection lost while processing the request. Please contact Celigo Support for more details.',
    code: 'unexpected_error',
    source: 'websocketServer'
  })
})

router.post('/httpWebSocketError', (req, res) => {
  res.status(403).json({
    message: 'Connection lost while processing the request. Please contact Celigo Support for more details.',
    code: 'unexpected_error',
    source: 'websocketServer'
  })
})

router.get('/handlebarCheck', (req, res) => {
  res.status(200).json([
    {
      id: 1,
      subItem: [
        {
          id: 1.1
        }
      ]
    },
    {
      id: 2
    },
    {
      id: 3,
      subItem: [
        {
          id: 3.1
        }
      ]
    }
  ])
})

router.post('/handlebarCheck', (req, res) => {
  res.status(200).json({})
})

let unlimitedNumber = 0

router.get('/unlimitExportData', async (req, res) => {
  unlimitedNumber += 1
  if (unlimitedNumber % 2 === 0) {
    return res.status(302).json({
      _id: unlimitedNumber,
      name: 'name'
    })
  }
  // wait 5 seconds
  await new Promise(resolve => { setTimeout(resolve, 20000) })
  res.status(200).json({
    _id: unlimitedNumber,
    name: 'name'
  })
})

router.get('/delayedExportData', async (req, res) => {
  // wait 5 seconds
  await new Promise(resolve => { setTimeout(resolve, 2500) })
  res.status(200).json({
    _id: 123,
    name: 'name'
  })
})

const largeData = require('./data.json')
const tenMBData = require('../data/10mb.json')
const objectSizeOf = require('object-sizeof')

router.get('/largeData', (req, res) => {
  console.log('largeData', objectSizeOf(largeData))
  console.log('tenMBData', objectSizeOf(tenMBData))
  return res.status(200).json({
    data: largeData,
    data2: tenMBData
  })
})

const { randomUUID } = require('crypto')

router.post('/intermittentAPI', (req, res) => res.status(414).json({
  id: 1,
  name: 'intermittent error'
}))

router.post('/blobImport', (req, res) => {
  const file = fs.readFileSync(path.join(__dirname, 'file.json'))
  // store the file in the folder called intermittentAPI with date as filename
  const date = new Date().toISOString().split('T')[0]
  fs.writeFileSync(path.join(__dirname, 'intermittentAPI', `${date}.json`), file)
  res.status(200).json({
    message: 'File stored successfully'
  })
})

// slowLookup: staggered delays for deterministic IO-221997 SBA credit-loss repro (remove after testing).
// The first FAST_CALLS requests of a run answer almost immediately so the SBA import receives
// pages (and dispatches its t=as) early; every later request holds SLOW_MS so the lookups cannot
// complete — and cannot forward doneExporting credits — until ~90s later. This guarantees a wide
// premature-finalization window on every run, regardless of consumer concurrency (serial local
// queues or parallel QA consumers). Counter resets after 5 idle minutes (i.e. per flow run).
let slowLookupCallCount = 0
let slowLookupLastCallAt = 0
router.get('/slowLookup', (req, res) => {
  const FAST_CALLS = 8
  const FAST_MS = 200
  const SLOW_MS = 90000
  const now = Date.now()
  if (now - slowLookupLastCallAt > 5 * 60 * 1000) slowLookupCallCount = 0 // new run
  slowLookupLastCallAt = now
  slowLookupCallCount += 1
  const delayMs = slowLookupCallCount <= FAST_CALLS ? FAST_MS : SLOW_MS
  setTimeout(() => {
    res.status(200).json([{ ok: true }])
  }, delayMs)
})

// blobLookup send file as response using fs.readFileSync
// NOTE: 30s delay added intentionally for IO-221997 SBA race repro (remove after testing)
router.get('/blobLookup', async (req, res) => {
  // delay 30 seconds
  const file = fs.readFileSync(path.join(__dirname, '../data/10mb.json'))
  setTimeout(() => {
    res.status(200).send(file)
  }, 30000)
})

router.get('/async_results', (req, res) => {
  res.status(200).json({
    id: 1,
    name: 'name'
  })
})

let asyncStatus = 1
router.get('/async_status', (req, res) => {
  asyncStatus += 1
  if (asyncStatus % 2 === 0) {
    return res.status(200).json({
      status: 'DONE'
    })
  }
  return res.status(200).json({
    status: 'IN_PROGRESS'
  })
})

let rateLimitSuccessCount = 0
router.get('/rateLimitSuccess', (req, res) => {
  rateLimitSuccessCount += 1
  return res.status(200).json({
    id: rateLimitSuccessCount,
    name: 'name'
  })
  // return res.status(429).json({
  //   id: rateLimitSuccessCount,
  //   name: 'name'
  // })
})

router.get('/rateLimitFailure', async (req, res) => {
  rateLimitSuccessCount += 1
  // add delay of 1 second
  await new Promise(resolve => { setTimeout(resolve, 5000) })
  if (rateLimitSuccessCount % 6 === 0) {
    return res.status(302).json({
      id: rateLimitSuccessCount,
      name: 'name'
    })
  }
  return res.status(429).json({
    id: rateLimitSuccessCount,
    name: 'name'
  })
})

router.get('/customData_1', async (req, res) => {
  const f = 3
  return res.status(200).json([
    {
      id: 'repro-rebuild-001',
      sku: 'SKU-REBUILD-001',
      name: 'Variant rebuild 1',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-rebuild-002',
      sku: 'SKU-REBUILD-002',
      name: 'Variant rebuild 2',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-rebuild-003',
      sku: 'SKU-REBUILD-003',
      name: 'Variant rebuild 3',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-rebuild-004',
      sku: 'SKU-REBUILD-004',
      name: 'Variant rebuild 4',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-rebuild-005',
      sku: 'SKU-REBUILD-005',
      name: 'Variant rebuild 5',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-rebuild-006',
      sku: 'SKU-REBUILD-006',
      name: 'Variant rebuild 6',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-rebuild-007',
      sku: 'SKU-REBUILD-007',
      name: 'Variant rebuild 7',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-rebuild-008',
      sku: 'SKU-REBUILD-008',
      name: 'Variant rebuild 8',
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false
    },
    {
      id: 'repro-not-required-009',
      sku: 'SKU-NR-009',
      name: 'No change with BCID',
      has_variant_changes: false,
      require_manual_review: false,
      has_bcid: true
    },
    {
      id: 'repro-not-required-010',
      sku: 'SKU-NR-010',
      name: 'No change without BCID',
      has_variant_changes: false,
      require_manual_review: false,
      has_bcid: false
    },
    {
      has_variant_changes: true,
      require_manual_review: false,
      variant_diff: { action: 'REBUILD_VARIANTS' },
      has_bcid: false,
      id: 'sku-001',
      sku: 'sku-001'
    }
  ])
})

module.exports = router

exports.removePrevStageAndHasRLFlagFromEntries = function (page, prevStage) {
  page.forEach(function (entry) {
    if (entry.stage === prevStage) entry.stage = undefined
    delete entry.hasRateLimitErrors
  })
}
