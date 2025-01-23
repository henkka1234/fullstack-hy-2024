const { test, after, beforeEach, describe } = require('node:test')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)




beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})
describe('API integration tests', () => {
    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('the first blog is from matti', async () => {
        const response = await api.get('/api/blogs')
    
        const contents = response.body.map(e => e.author)
        //console.log(contents)
        assert(contents.includes('matti'))
    })

    test('identification field has to be called id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => assert('id' in blog))
    })

    test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "new blog",
        author: "ramses",
        url: "poliisi.fi",
        likes: 21,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(title.includes('new blog'))
    })


    test('If no like value is given, likes default to 0 ', async () => {
        const newBlog = {
            title: "no likes blog",
            author: "ray",
            url: "ray.fi",
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        
        const likes = response.body.map(r => r.likes)
        assert(likes.includes(0))
        })


    test('Return 400 if no title is given', async () => {
        const newBlog = {
            url: "wrong.com",
            author: "ray",
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

    test('Return 400 if no url is given', async () => {
        const newBlog = {
            title: "wrong blog",
            author: "ray",
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length)

        })
          
        test('a blog can be deleted', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            
            
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)
            
            const blogsAtEnd = await helper.blogsInDb()
            
            const titles = blogsAtEnd.map(r => r.title)
            assert(!titles.includes(blogToDelete.title))
            
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        })


        test('Update likes with valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            
            const newData = {
                likes: '666'
            }
            
            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(newData)
                .expect(200)

            const updatedBlog = await Blog.findById(blogToUpdate.id)

            assert.deepEqual(updatedBlog.likes, 666)

        })

        test('Try to update blog that does not exist', async() => {            
            const newData = {
                likes: '666'
            }
            
            const fakeId = await helper.nonExistingId()

            await api
                .put(`/api/blogs/${fakeId}`)
                .send(newData)
                .expect(410)
        })
})

after(async () => {
  await mongoose.connection.close()
})