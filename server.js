const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

require('./routers/api')(app)
server.listen(process.env.PORT || 8080, console.log('server running'))