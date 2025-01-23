const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    
    const user = await User.findById(request.body.userId)
    
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user._id})

    try{
    const res = await blog.save()
    user.blogs = user.blogs.concat(res._id)
    await user.save()
    response.status(201).json(res)
    }
    catch(exception){
      next(exception)
    }
  })

  blogsRouter.delete('/:id', async (request, response) => {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()

  })

  blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body
  
    const res = await Blog.findByIdAndUpdate(request.params.id, { likes },
      { new: true, runValidators: true, context: 'query' })

      if(res===null){
        response.status(410).end()
      }
      else{
        response.json(res)
      }
  })

module.exports = blogsRouter