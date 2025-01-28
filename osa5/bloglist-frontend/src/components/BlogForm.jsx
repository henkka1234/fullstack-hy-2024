const BlogForm = ({
    handleAddBlog,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange,
    newTitle,
    newAuthor,
    newUrl
  }) => {
    return(
      
    <form onSubmit={handleAddBlog}>
      <div>
      Title:
      <input
        value={newTitle}
        onChange={handleTitleChange}
      />
      </div>
  
      <div>
      Author:
      <input
        value={newAuthor}
        onChange={handleAuthorChange}
      />
      </div>
  
      <div>
        Url:
      <input
        value={newUrl}
        onChange={handleUrlChange}
      />
      </div>
      <button type="submit">save</button>
    </form>  
  )}

export default BlogForm