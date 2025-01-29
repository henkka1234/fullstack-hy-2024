import { useState, useEffect, useRef } from 'react'
import './index.css'
import Togglable from './components/Toggable'
//import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Login from './services/login'


const Notification = ({type, msg }) => {
  if (msg === null || type === null) {
    return null
  }

  if(type === "error"){
    return (
      <div className="error">
        {msg}
      </div>
    )
  }
  if(type === "success"){
    return (
      <div className="success">
        {msg}
      </div>
    )    
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [msgType, setType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      console.log(blogs)
      setBlogs( blogs )}
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {    
    event.preventDefault()    
    console.log('logging in with', username, password)  

    try{
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch(execption){
      console.log("wrong credentials")
      setType("error")
      setMessage("Wrong credentials!!!")
      setTimeout(() => {
        setType(null)        
        setMessage(null)      
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    //the username should be the same as the logged in user
    const modified = {...returnedBlog, user}
    console.log("modified blog:", modified)
    setBlogs(blogs.concat(modified))
    setType('success');
    setMessage(`A new blog "${blogObject.title}" by "${blogObject.author}" added!`);
    setTimeout(() => {
      setType(null);
      setMessage(null);
    }, 5000);
  } 

  const likeBlog = async (blogObject, user, id) => {
    const returnedBlog = await blogService.update(blogObject, id)
    //backend doesn't have user in it's reponse so add it back manually
    const modified = {...returnedBlog, user: user}
    setBlogs(blogs.map(blog => blog.id === id ? modified: blog))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>        
    <div>          
      username            
      <input            
      type="text"            
      value={username}            
      name="Username"            
      onChange={({ target }) => setUsername(target.value)}          
      />        
      </div>        
      <div>          
        password            
        <input            
        type="password"            
        value={password}            
        name="Password"            
        onChange={({ target }) => setPassword(target.value)}          
        />        
        </div>        
        <button type="submit">login</button>      
        </form>
  )

  const blogForm = () =>{
    return(
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm
            createBlog={addBlog}
          />
      </Togglable>
    )
  }

  const logoutUser = () => {
    console.log("logoutuser")
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload(false)
  }

  return (
    <div>
      <Notification type={msgType} msg={message} />

      {!user && 
        <div>
          <h2>Log in to the application</h2>
          {loginForm()}
        </div>
      }


      {user && 
        <div>
        <p>{user.username} logged in </p>
        <button onClick={logoutUser}>logout</button>
        {blogForm()}
        
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={likeBlog} />
        )}
        
        </div>}

    </div>
  )
}

export default App