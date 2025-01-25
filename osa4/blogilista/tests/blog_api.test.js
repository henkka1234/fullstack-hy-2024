const { test, after, beforeEach, describe } = require('node:test')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const app = require('../app')
const { log } = require('node:console')

const api = supertest(app)




beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  //create one user and one blog for that user
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'roottester', name: 'roottest', passwordHash: passwordHash })
  const res = await user.save()  
  //This blog isn't counted in initial blogs which makes the code a bit confusing but works for now
  const userBlog = new Blog({
    title: 'testing',
    autor: 'tester',
    url: 'example.org',
    user: res._id
  })

  await userBlog.save()

})
describe('API integration tests', () => {
    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are three blogs', async () => {
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
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
    //first login to get jwt

    const loginInfo = {
        username: "roottester",
        password: "sekret"
    }

    const loginRes = await api.post('/api/login').send(loginInfo)
    
    const newBlog = {
        title: "new blog",
        author: "ramses",
        url: "poliisi.fi",
        likes: 21,
    }
    console.log("logintoken", loginRes.body.token)
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set({'Authorization':`Bearer ${loginRes.body.token}`})
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 2)

    assert(title.includes('new blog'))
    })


    test('If no like value is given, likes default to 0 ', async () => {

        const loginInfo = {
            username: "roottester",
            password: "sekret"
        }
    
        const loginRes = await api.post('/api/login').send(loginInfo)

        const newBlog = {
            title: "no likes blog",
            author: "ray",
            url: "ray.fi",
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({'Authorization':`Bearer ${loginRes.body.token}`})
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 2)
        
        const likes = response.body.map(r => r.likes)
        assert(likes.includes(0))
        })


    test('Return 400 if no title is given', async () => {

        const loginInfo = {
            username: "roottester",
            password: "sekret"
        }
    
        const loginRes = await api.post('/api/login').send(loginInfo)

        const newBlog = {
            url: "wrong.com",
            author: "ray",
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({'Authorization':`Bearer ${loginRes.body.token}`})
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
        })

    test('Return 400 if no url is given', async () => {
        const loginInfo = {
            username: "roottester",
            password: "sekret"
        }
    
        const loginRes = await api.post('/api/login').send(loginInfo)

        const newBlog = {
            title: "wrong blog",
            author: "ray",
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({'Authorization':`Bearer ${loginRes.body.token}`})
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length+1)

        })
          
        test('a blog can be deleted', async () => {
            const loginInfo = {
                username: "roottester",
                password: "sekret"
            }
        
            const loginRes = await api.post('/api/login').send(loginInfo)


            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[2]
            //Fails because have to delete blog that the user has created
            //Why error 500 if blogsatstart[0], because no userid field in those blogs?
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set({'Authorization':`Bearer ${loginRes.body.token}`})
                .expect(204)
            
            const blogsAtEnd = await helper.blogsInDb()
            
            const titles = blogsAtEnd.map(r => r.title)
            assert(!titles.includes(blogToDelete.title))
            
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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

        test('Can not post blog if not authenticated', async() =>{
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[2]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(401)
            
            const blogsAtEnd = await helper.blogsInDb()
            
            const titles = blogsAtEnd.map(r => r.title)
            assert(titles.includes(blogToDelete.title))
            
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length+1)
        })
})

after(async () => {
  await mongoose.connection.close()
})