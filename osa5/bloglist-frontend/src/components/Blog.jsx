import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, userid, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleView = () => {
    setVisible(!visible)
  }

  const likeBlog = async (event) => {
    event.preventDefault()
    //give user info and blog id back to updateBlog in app
    updateBlog( {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes+1
    }, blog.user, blog.id)
  }
  
  //If the blog doesn't have user (maybe deleted user), don't show the remove button
  const showRemove = { display: blog.user && blog.user.username===userid ? '' : 'none' }

  const removeBlog = async (event) => {
    console.log('useid',userid)
    console.log('blog user', blog.user.username)
    if(window.confirm(`delete blog "${blog.title}" by "${blog.author}" ?`)){
      deleteBlog(blog.id)
    }
  }
  return(

    <div style={blogStyle} className='blog'>
      <p>{blog.title} {blog.author} <button onClick={toggleView}>{!visible ? 'view' : 'hide'}</button></p>
      <div style={showWhenVisible} className='extrainfo'>
        <p className='url'>url: {blog.url}</p>
        <p className='likes'
            data-testid='likes'>likes: {blog.likes} <button onClick={likeBlog}>Like</button> </p>
        {/*Add some protection against undefined users, like in a case where the user is deleted*/}
        <p className='postedby'>posted by: {blog.user?.name ?? 'deleted user'}</p>
      </div>
      <div style={showRemove}>
        <button onClick={removeBlog}>remove</button>
      </div>
    </div>

  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  userid: PropTypes.string.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog