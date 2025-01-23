const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)

    try{
    const res = await blog.save()
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