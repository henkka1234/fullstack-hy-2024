import { useState } from "react"

const Blog = ({ blog }) => {
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

  return(  

    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleView}>{!visible ? "view" : "hide"}</button>
      <div style={showWhenVisible}>
        <p>url: {blog.url}</p>
        <p>likes: {blog.likes} <button>Like</button> </p> 
        <p>posted by: {blog.user.name}</p>
      </div>
    </div>  

  )
}


export default Blog