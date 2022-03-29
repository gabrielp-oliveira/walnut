const nodeCache = require('node-cache')
const myCache = new nodeCache({stdTTL: 20})

module.exports = seconds => (req, res, next) =>{
    const key = req.originalUrl
    const cacheResponse = myCache.get(key)
    if(cacheResponse){
        return res.send(cacheResponse)
    }else{
        res.originalSend = res.send
        res.send = body => {
            res.originalSend(body)
            myCache.set(key, body, seconds)
        }
        next()
    }
}