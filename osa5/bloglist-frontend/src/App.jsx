import { useState, useEffect } from 'react'
import './index.css'
import Togglable from './components/Toggable'
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

  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setLikes] = useState('')

  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [msgType, setType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))

    setType("success")
    setMessage(`a new blog ${newTitle} by ${newAuthor} added`)
    setTimeout(() => {
      setType(null)        
      setMessage(null)      
    }, 5000)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
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
      <Togglable buttonLabel="new blog">
          <BlogForm
            newTitle={newTitle}
            newAuthor={newAuthor}
            newUrl={newUrl}
            handleTitleChange={({target}) => setNewTitle(target.value)}
            handleAuthorChange={({target}) => setNewAuthor(target.value)}
            handleUrlChange={({target}) => setNewUrl(target.value)}
            handleAddBlog={addBlog}
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
        <h2>blogs</h2>
        <p>{user.username} logged in </p>
        <button onClick={logoutUser}>logout</button>
        <h2>create new</h2>
        {blogForm()}
        
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        
        </div>}

    </div>
  )
}

export default App