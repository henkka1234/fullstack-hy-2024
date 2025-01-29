import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach, describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('renders title and author', () => {
  const blog = {
    title: 'how to component test',
    author: 'robot',
    url: 'vite.js',
    user: {username: 'testaaja', name: 'testi testi', id:'1234'}
  }

  const {container} = render(<Blog blog={blog} userid={'testaaja'} />)
  //"how to component test" is the blog name and "robot" is the user, both should be visible

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('how to component test robot')

  //const element = screen.getByText('how to component test robot')
  //expect(element).toBeDefined()
})

describe('view button', () => {

    let container

    beforeEach(() => {
        const blog = {
            title: 'how to component test',
            author: 'robot',
            url: 'vite.js',
            user: {username: 'testaaja', name: 'testi testi', id:'1234'}
          }
        container = render(<Blog blog={blog} userid={'testaaja'} />).container
    })

  test('at the beginning url, likes and user arent shown', async () => {

    //At start the extra information shouldn't be visible

    const div = container.querySelector('.extrainfo')
    expect(div).toHaveStyle('display: none')
  })

  test('after pressing view button extra information is visible', async () => {


    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    //check that now all of the information is visible
    //Likes don't have value as there's no connection to the backend database
    const paragraph = container.querySelector('.url')
    expect(paragraph).toHaveTextContent('vite.js')

    const likes = container.querySelector('.likes')
    expect(likes).toHaveTextContent('likes: Like')
        
    const postedby = container.querySelector('.postedby')
    expect(postedby).toHaveTextContent('testi testi')   
        
    //check also that the style is correct
    const div = container.querySelector('.extrainfo')
    expect(div).not.toHaveStyle('display: none')
})
    
})

test('If like is pressed twice the handler is called twice', async () => {
    const blog = {
        title: 'how to component test',
        author: 'robot',
        url: 'vite.js',
        user: {username: 'testaaja', name: 'testi testi', id:'1234'}
      }
      const mockHandler = vi.fn()
      
      render(<Blog blog={blog} updateBlog={mockHandler} userid={'testaaja'} />)

      const user = userEvent.setup()
      const button = screen.getByText('Like')
      //click the button twice
      await user.click(button)
      await user.click(button)

      expect(mockHandler.mock.calls).toHaveLength(2)
})