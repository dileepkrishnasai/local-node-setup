const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/products', (req, res, next) => {
  // res.send('<html><nav>Good Morning</nav></html>')
  res.sendFile(path.join(__dirname, '../', 'views', 'products.html'))
  // res.redirect('/')
})
let lookupRateLimit = 1
router.post('/lookupRateLimit', (req, res, next) => {
  lookupRateLimit += 1
  console.log(`lookupRateLimit = ${lookupRateLimit}`)
  const { id, parent_id } = req.query
  console.log(`id = ${id}`)
  // if (id === 'childId1 1' || id === 'childId1 3' || parent_id === 'order_id_1' || id === 'order_id_1' || id === 'order_id_2') {
  // // if (id === 'order_id_1') {
  //   return res.status(200).json({
  //     code: '200',
  //     id: `${lookupRateLimit}_${id}`
  //   })
  // }
  // if (lookupRateLimit % 6 === 0) {
  return res.status(200).json({
    code: '200',
    id: `${lookupRateLimit}_${id}`,
    // nextUrl: `http://localhost.io:3005/lookupRateLimit?id=${id}&paging=true`
  })
  // }
  // if (lookupRateLimit % 7 === 0) {
  // return res.status(200).json({
  //   code: '200',
  //   id: `${lookupRateLimit}_${id}`
  // })
  // }
  // if (lookupRateLimit === 2) {
  //   return res.status(200).json({
  //     code: '200',
  //     id: lookupRateLimit,
  //     nextUrl: `http://localhost.io:3005/lookupRateLimit?id=${id}&paging=true`
  //   })
  // }
  // return res.status(429).json({
  //   code: '429',
  //   id: `${lookupRateLimit}_${id}`,
  //   message: 'You exceeded your quota for the requested resource.',
  //   source: 'application',
  // })
})

let importRateLimit = 1
router.post('/importRateLimit', (req, res, next) => {
  importRateLimit += 1
  const { id, parent_id } = req.query
  console.log(`id = ${id} parent_id = ${parent_id}`)
  // if (id === 'childId1 1' || id === 'childId1 3' || parent_id === 'order_id_1') {
  if (importRateLimit % 8 === 0) {
    return res.status(200).json({
      code: '200',
      id: `${importRateLimit}_${id}`,
      name: `name ${id}`
    })
  }
  if (id === 'item_id_1' || id === 'item_id_3' || id === 'item_id_4') {
    return res.status(200).json({
      code: '200',
      id: `${importRateLimit}_${id}`,
      name: `name ${id}`
    })
  }

  res.status(429).json({
    code: '429',
    id: `${importRateLimit}_${id}`,
    message: 'You exceeded your quota for the requested resource.',
    source: 'application',
    classification: 'rate_limit'
  })
})

module.exports = router
