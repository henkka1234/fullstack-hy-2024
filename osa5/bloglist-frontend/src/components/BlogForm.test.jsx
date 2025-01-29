import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import { beforeEach, describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('BlogForm calls the props callback function with right information', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const {container} = render(<BlogForm createBlog={createBlog} />)

  let title = container.querySelector('#title')
  let author = container.querySelector('#author')
  let url = container.querySelector('#url')

  const sendButton = screen.getByText('save')

  await user.type(title, 'testtitle')
  await user.type(author, 'testauthor')
  await user.type(url, 'test.url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'testtitle',
    author: 'testauthor',
    url: 'test.url'
  })
})