const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/users', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'users.html'))
})

router.get('/connection/ping', (req, res, next) => {
    return res
    .status(201)
    .json({sucess: true})
})

router.get('/postData1', (req, res, next) => {
    return res.status(200).json({
        "code": "429",
        "message": "You exceeded your quota for the requested resource.",
        "source": "application"
    })
})

router.post('/postData1', (req, res, next) => {
    return res.status(200).json({
        "code": "429",
        "message": "You exceeded your quota for the requested resource.",
        "source": "application"
    })
})

router.post('/nores', (req, res, next) => {
    return res.status(200).json({})
})

router.get('/postData', (req, res, next) => {
    return res.status(429).json({
        "code": "429",
        "message": "You exceeded your quota for the requested resource.",
        "source": "application"
    })
})

var count = 0

router.post('/postData', (req, res, next) => {
  count++

  console.log(`34 count = ${count}`)
 
  if(count%2 == 0) {
    return res
    .status(200)
    // .json('Too Many Requests')
    .json({
        "code": "404",
        "message": "You exceeded your quota for the requested resource.",
        "source": "application"
    })
  }
    return res
    .status(413)
    // .json('Too Many Requests')
    .json({
        "code": "response_size_exceeded",
        "message": "You exceeded your quota for the requested resource.",
        "source": "application"
    })
})



router.get('/reportsDetails', (req, res, next) => {
    return res.status(200).json([[
        {
          "id": "145011",
          "recordType": "expensereport",
          "ReportID": "29ADAD4DD27A4AD19E03",
          "ExternalID": "AMEX_CBCP_29ADAD4DD27A4AD19E03",
          "LineID": "0",
          "JournalID": "",
          "PaymentType": "",
          "Amount": ".00",
          "Line ID": "0",
          "IDID": "145011",
          "ExpenseEntriesList": [
            {
              "EntryImageID": "",
              "JournalID": "36157533",
              "ItemizationsList": [
                {
                  "JournalID": "36157533",
                  "EntryImageID": ""
                }
              ]
            },
            {
              "EntryImageID": "E08FB9A1FB614031B0D2D5457035183B",
              "JournalID": "36157532",
              "ItemizationsList": [
                {
                  "JournalID": "36157532",
                  "EntryImageID": "E08FB9A1FB614031B0D2D5457035183B"
                }
              ],
              "image": {
                "Id": "E08FB9A1FB614031B0D2D5457035183B",
                "Url": "https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/FB0359DC81E8B12B5D199B08F8CCEDD1746974E711BE11CC2DF963F55F80B32BE846556893F7A412AF115564D806895A971C159048CB9C49A464DA61CBC4118E1ACF1889793224114AFB34309B5262133AH79A584A0177E2D2B4CD8EED45EFAEAE1?id=E08FB9A1FB614031B0D2D5457035183B&e=p00211437zpd&t=SN&s=ConcurConnect"
              }
            },
            {
              "EntryImageID": "1B657A161AE945928302A64B4049F5E6",
              "JournalID": "36157535",
              "ItemizationsList": [
                {
                  "JournalID": "36157535",
                  "EntryImageID": "1B657A161AE945928302A64B4049F5E6"
                },
                {
                  "JournalID": "36157534",
                  "EntryImageID": "1B657A161AE945928302A64B4049F5E6"
                }
              ],
              "image": {
                "Id": "1B657A161AE945928302A64B4049F5E6",
                "Url": "https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/B494BE6DFB3F9CB4BDB00E3D9E218A10BF0D6BC7DC03BB4B7812233F94FD34C93115E9E45F919B055B73294C37F05F7714513164CEF80F2953B0550BF797AE65FEB32BD15AA3BB1048E249C38326F27AA6HD7916AC776AF92884D9E8BC11E06AD8F?id=1B657A161AE945928302A64B4049F5E6&e=p00211437zpd&t=SN&s=ConcurConnect"
              }
            },
            {
              "EntryImageID": "6D291C71B9E34AAB8807A815078C1F30",
              "JournalID": "36157537",
              "ItemizationsList": [
                {
                  "JournalID": "36157537",
                  "EntryImageID": "6D291C71B9E34AAB8807A815078C1F30"
                },
                {
                  "JournalID": "36157536",
                  "EntryImageID": "6D291C71B9E34AAB8807A815078C1F30"
                }
              ],
              "image": {
                "Id": "6D291C71B9E34AAB8807A815078C1F30",
                "Url": "https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/3E615647164A14DE0320DE5C988737980DC782A18DDA1FE1E58C9183C13D0C2DCD1193E24629632CF029D0FDDE6180FF13669A2AD64168198F2E5C392DF1214237A33FD8E2830BB5A0C7E10C0EE9DEC7E6H4BD33D81D0974616F618AF4E3461292D?id=6D291C71B9E34AAB8807A815078C1F30&e=p00211437zpd&t=SN&s=ConcurConnect"
              }
            },
            {
              "EntryImageID": "",
              "JournalID": "36157531",
              "ItemizationsList": [
                {
                  "JournalID": "36157531",
                  "EntryImageID": ""
                }
              ]
            },
            {
              "EntryImageID": "6DA6E054508B4FFD986D74C37278C746",
              "JournalID": "36157530",
              "ItemizationsList": [
                {
                  "JournalID": "36157530",
                  "EntryImageID": "6DA6E054508B4FFD986D74C37278C746"
                }
              ],
              "image": {
                "Id": "6DA6E054508B4FFD986D74C37278C746",
                "Url": "https://api.concursolutions.com/imaging/web/us1/file/p00211437zpd/E621AA6E775A54E6CBB2C2576AF93176DA8FC4DEDD41D50F8025094E311AA821C555EA8E17BED567ECC9F2FF4C41315152D7079CCCA661F5181CE035F15F0656029138E2A4EAAFF9826EA8EFE0227F8285HE4F504C84B737FE1894E3DF760C28C65?id=6DA6E054508B4FFD986D74C37278C746&e=p00211437zpd&t=SN&s=ConcurConnect"
              }
            },
            {
              "EntryImageID": "",
              "JournalID": "36157529",
              "ItemizationsList": [
                {
                  "JournalID": "36157529",
                  "EntryImageID": ""
                }
              ]
            }
          ],
          "sub_id": "",
          "Sub_code": "",
          "Sub_shortCode": "",
          "Sub_value": ""
        }
      ]])
})

router.get('/lookup', (req, res, next) => {
    return res.status(200).json({
        "code": "429",
        "message": "You exceeded your quota for the requested resource.",
        "source": "application"
    })
})


// bulkData

router.post('/bulkData', (req, res, next) => {
  return res.status(200).json({
    "success": true,
  })
})


router.get('/oneToMany', (req, res, next) => {
  return res.status(200).json([
    {
      id: 15,
      "code": "429",
      "message": "You exceeded your quota for the requested resource.",
      "source": "application",
      parentKey: 11,
      "child": [
        {
          "id": 16,
          name: "name",
          parentKey: 12
        },
        {
          "id": 17,
          name: "name",
          parentKey: 13
        },
        // null
      ],
      "child1": [
        {
          "id": 21,
          name: "name",
          parentKey: 12
        },
        {
          "id": 22,
          name: "name",
          parentKey: 13
        }
      ]
  },
  {
    id: 18,
    "code": "429",
    "message": "You exceeded your quota for the requested resource.",
    "source": "application",
    parentKey: 14,
    "child": [
      {
        "id": 19,
        name: "name",
        parentKey: 15
      },
      {
        "id": 20,
        name: "name",
        parentKey: 16
      },
      {
        "id": 25,
        name: "name",
        parentKey: 17
      },
      {
        "id": 26,
        name: "name",
        parentKey: 18
      }
    ],
    "child1": [
      {
        "id": 23,
        name: "name",
        parentKey: 15
      },
      {
        "id": 24,
        name: "name",
        parentKey: 16
      }
    ]
 },
  {
    id: 30,
    "code": "429",
    "message": "You exceeded your quota for the requested resource.",
    "child": "application",
    parentKey: 19
  }
]
)
})

router.get('/noresponse', (req, res, next) => {
  return res.status(200).json({
    "success": true,
  })
})


module.exports = router