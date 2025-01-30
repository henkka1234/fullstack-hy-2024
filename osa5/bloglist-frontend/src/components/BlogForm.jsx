import { useState } from 'react'


const BlogForm = ( { createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog( {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return(
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            data-testid='title'
            id="title"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </div>

        <div>
        Author:
          <input
            data-testid='author'
            id="author"
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
          />
        </div>

        <div>
            Url:
          <input
            data-testid='url'
            id="url"
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )

}

export default BlogForm