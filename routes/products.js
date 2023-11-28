const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/products', (req, res, next) => {
    // res.send('<html><nav>Good Morning</nav></html>')
    res.sendFile(path.join(__dirname, '../', 'views', 'products.html'))
    // res.redirect('/')
})

// router.post('/products', (req, res, next) => {
//     // res.send('<html><nav>Good Morning</nav></html>')
//     res.sendFile(path.join(__dirname, '../', 'views', 'products.html'))
//     // res.redirect('/')
// })

module.exports = router