const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/ping', (req, res) => {
    try {
        res.status(200)
        return res.json({
            success: true
        })
    } catch (err) {
        return res.json(err)
    }
})

router.get('/posts', (req, res) => {
    function FunctionsortBy(sort = 'id', direction = 'asc', arr) {
        const sortListAccept = ['id', 'reads', 'likes', 'popularity']
    
        if (sortListAccept.indexOf(sort) === -1) {
            res.status(400)
            throw { "error": "sortBy parameter is required" }
        }
        if (direction !== 'desc' && direction !== 'asc') {
            res.status(400)
            throw { "error": "sortBy parameter is invalid" }
        }
        if (direction == 'desc') {
            return arr.sort((a, b) => {
                return b[sort] - a[sort]
            })
        } else {
            return arr.sort((a, b) => {
                return a[sort] - b[sort]
            })
        }
    }
    try {
        const url = 'https://api.hatchways.io/assessment/blog/posts?tag='
        const { tags, sortBy, direction } = req.query
        if (tags == undefined || tags.trim() == '') {
            res.status(400)
            throw { "error": "Tags parameter is required" }
        }
        const tagList = tags.split(',')
        const requests = tagList.map((element) => {
            return axios.get(url + element)
        });
        axios.all(requests)
            .then(axios.spread((...response) => {

                let list = []
                response.forEach((arr) => {
                    arr.data.posts.forEach((post) => {
                        list.push(post)
                    })
                })
                return list
                // const result = data.data.posts = FunctionsortBy(sortBy, direction, data.data.posts)

                // data.data.posts = result
                // res.status(200)
                // return res.json(data.data)


                // })
            }))
            .then((info) => {
                const sorted = FunctionsortBy(sortBy, direction, info)
                const result = sorted.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === value.id
                    ))
                )
                return res.json({ "posts": result })

            })
            .catch(err => {
                return res.json(err)
            })
    } catch (err) {
        return res.json(err)
    }
})
module.exports = app => app.use('/api', router)

