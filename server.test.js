const axios = require('axios')
const app = require('./server')
const { isUnique } = require('./testFunctions')


describe("test the application", () => {

    test('ping rout -- Should return a JSON success message equal true', async () => {
        const res = await axios.get('http://localhost:8080/api/ping')
        expect(res.data).toHaveProperty("success")
    })
    
    test('posts default router -- should return a JSON with a post object with unique elements in a crescent order by id', async () => {
        const res = await axios.get('http://localhost:8080/api/posts?tags=tech,history')
        const isUniqueElements = isUnique(res.data.posts, 'id')
        const sorted = res.data.posts.sort((a, b) => {
            return a.id - b.id
        })
        const isSortedById = (sorted[0].id == res.data.posts[0].id) &&
            (sorted[sorted.length - 1].id == res.data.posts[res.data.posts.length - 1].id)
        expect(isUniqueElements).toBe(true)
        expect(isSortedById).toBe(true)
    })

    test('ping rout  -- should return a JSON Error ', async () => {
        {
            await axios.get('http://localhost:8080/api/posts?tags=')
                .then(() => {
                    expect(false).toBe(true)// force a failure
                })
                .catch((err) => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data.error).toBe('Tags parameter is required')
                })
        }
        
        await axios.get('http://localhost:8080/api/posts?tags=history&sortBy=forceError')
            .then(() => {
                expect(false).toBe(true) // force a failure
            })
            .catch((err) => {
                expect(err.response.status).toBe(400)
                expect(err.response.data.error).toBe('sortBy parameter is required')
            })

    })

})