const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const userRouter = require('./routes/users')
const productRouter = require('./routes/products')
const tokenRouter = require('./routes/token')

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(express.static(path.join(__dirname, 'public')))

// Logger middleware - logs all incoming requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  const { method } = req
  const url = req.originalUrl || req.url
  const ip = req.ip || req.connection.remoteAddress

  // Log the incoming request
  console.log(`[${timestamp}] ${method} ${url}`)

  // Log request body if present (for POST, PUT, PATCH requests)
  if (req.body && Object.keys(req.body).length > 0) {
    // console.log('  Request Body:', JSON.stringify(req.body))
  }

  // Log query parameters if present
  // if (req.query && Object.keys(req.query).length > 0) {
  //   console.log('  Query Params:', JSON.stringify(req.query))
  // }

  // Capture the original res.send function
  const originalSend = res.send
  const startTime = Date.now()

  // Override res.send to log response
  res.send = function (data) {
    const duration = Date.now() - startTime
    console.log(`[${timestamp}] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`)

    // Call the original send function
    return originalSend.call(this, data)
  }

  next()
})

app.use(userRouter)
app.use(productRouter)
app.use(tokenRouter)

// app.use((req, res, next) => {
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     myHeaders.append("Authorization", "Bearer b765e68c377349b08cd368db9d003f4b");
//     var raw = JSON.stringify({
//         "type":"http","name":"AmazonSellerCentral New","assistant":"amazonmws",
//         "offline":true,"sandbox":false,"http":{"formType":"assistant","type":"Amazon-SP-API","mediaType":"json",
//         "baseURI":"https://sellingpartnerapi-na.amazon.com/","unencrypted":{"marketplaceId":"A2EUQ1WTGCTBG2","sellingRegion":"northAmerica"},
//         "auth":{"type":"oauth","failStatusCode":403,"oauth":{"authURI":"http://localhost:3000/apps/authorize/consent",
//         "tokenURI":"https://api.amazon.com/auth/o2/token","accessTokenPath":"access_token","grantType":"authorizecode","useIClientFields":false},"token":{"location":"body","refreshMediaType":"urlencoded"}}},"microServices":{"disableNetSuiteWebServices":false},"queues":[{"name":"63f6d3fd28619c1eb3baa528","size":0}]});

//     fetch("https://api.staging.integrator.io/v1/connections", {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//       })
//     .then(response => response.text())
//     .then(result => {
//         console.log('result', result)
//         return res
//         .status(200)
//         .send(result)
//     })
//     .catch(error => console.log('error', error));
// })

app.listen(3005)
