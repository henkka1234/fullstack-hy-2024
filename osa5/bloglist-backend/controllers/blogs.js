const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs)
  })

  blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    console.log("post")
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      return response.status(401).json({error: 'token invalid'})
    }

    const user = request.user
    
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

  blogsRouter.delete('/:id', middleware.userExtractor, async (request, response,next) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      return response.status(401).json({error: 'token invalid'})
    }
    try{
      const user = request.user
      const blog = await Blog.findById(request.params.id)
      if(!blog){
        return response.status(410).json({"error": "blog already deleted"})
      }
      if(blog.user.toString() === user._id.toString()){
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
      }
      else{
        response.status(401).end()
      }
    }
    catch(exception){
      next(exception)
    }


  })

  blogsRouter.put('/:id', async (request, response, next) => {
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