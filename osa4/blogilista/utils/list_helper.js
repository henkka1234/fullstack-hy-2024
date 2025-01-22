const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const calcLikes = (sum, blog) =>{
        return sum + blog.likes
    }
    return blogs.reduce(calcLikes, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length===0){
        return null
    }

    const {title, author, likes} = blogs.reduce((maxLikes, blog)=> 
        blog.likes>maxLikes.likes ? blog : maxLikes
        )

    return {title, author, likes}
}

const mostBlogs = (blogs) => {
    if(blogs.length===0){
        return null
    }
    //set removes all duplicate authors and it's converted back to array with spread operator
    let authors = [...new Set(blogs.map(blog=>blog.author))]

    //create another array for the blog counts
    const authorBlogCount = authors.reduce((autBlogCount, author) => {
        autBlogCount[author] = 0
        return autBlogCount
    }, {})

    //calculate how many blogs each one has
    blogs.forEach(blog => {
        authorBlogCount[blog.author]++
    });

    //check who had most blogs
    let blogsMaxCount = 0
    let mostBlogsAuthor

    for(const author in authorBlogCount) {
        if(authorBlogCount[author] > blogsMaxCount) {
            blogsMaxCount = authorBlogCount[author]
            mostBlogsAuthor = author
        }
    }

    return {author: mostBlogsAuthor, blogs: blogsMaxCount}
}

const mostLikes = (blogs) => {
    if(blogs.length===0){
        return null
    }
    //set removes all duplicate authors and it's converted back to array with spread operator
    let authors = [...new Set(blogs.map(blog=>blog.author))]

    //create another array for the blog counts
    const authorBlogCount = authors.reduce((autBlogCount, author) => {
        autBlogCount[author] = 0
        return autBlogCount
    }, {})

    //calculate how many blogs each one has
    blogs.forEach(blog => {
        authorBlogCount[blog.author]+= blog.likes
    });

    //check who had most blogs
    let likesMaxCount = 0
    let mostLikesAuthor

    for(const author in authorBlogCount) {
        if(authorBlogCount[author] > likesMaxCount) {
            likesMaxCount = authorBlogCount[author]
            mostLikesAuthor = author
        }
    }

    return {author: mostLikesAuthor, likes: likesMaxCount}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}