import { useState } from "react"

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  
  return(  
    <div>
      {blog.title} {blog.author}
    </div>  
  )
}


export default Blog