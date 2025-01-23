const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: "blog1",
      author: "matti",
      url: "as.fi",
      likes: 100,
    },
    {
      title: "another blog",
      author: "pekka",
      url: "tietokilta.fi",
      likes: 2,
    },
  ]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'remove', url: 'remo.ve' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
    initialBlogs, nonExistingId, blogsInDb,
    usersInDb
}