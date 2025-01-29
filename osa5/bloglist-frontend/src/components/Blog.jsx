import { useState } from "react"

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
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

  return(  

    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleView}>{!visible ? "view" : "hide"}</button>
      <div style={showWhenVisible}>
        <p>url: {blog.url}</p>
        <p>likes: {blog.likes} <button onClick={likeBlog}>Like</button> </p> 
        <p>posted by: {blog.user.name}</p>
      </div>
    </div>  

  )
}


export default Blog