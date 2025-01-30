const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    //Another user for some tests
    await request.post('http://localhost:3001/api/users', {
        data: {
          name: 'not matti',
          username: 'user2',
          password: 'secret'
        }
      })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    //await page.goto('http://localhost:5173')
    //check that the username and password field are visible
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    //Check that the login button is visible
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })

  describe('login', () => {

  test('succeeds with correct credentials', async({page})=>{
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('mluukkai logged in')).toBeVisible()    
  })

  test('login fails with wrong credentials', async ({ page }) =>{
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()
  
    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials!!!')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  
  
    await expect(page.getByText('mluukkai logged in')).not.toBeVisible()
  })  

    })

  describe('when logged in', () => {

    beforeEach(async ({page}) => {
        //log in
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('mluukkai logged in')).toBeVisible()  
    })

    test('a new blog can be created', async({page}) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('how to do tests')
        await page.getByTestId('author').fill('playwright')
        await page.getByTestId('url').fill('tester.com')

        await page.getByRole('button', { name: 'save' }).click()

        const errorDiv = await page.locator('.success')
        await expect(errorDiv).toContainText('A new blog "how to do tests" by "playwright" added!')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

        await expect(page.getByText('how to do tests playwright')).toBeVisible()
    })


    describe('Basic blog tasks when one blog exists', () => {

        beforeEach(async ({page})=>{
            //add one blog
            await page.getByRole('button', { name: 'new blog' }).click()
            await page.getByTestId('title').fill('how to do tests')
            await page.getByTestId('author').fill('playwright')
            await page.getByTestId('url').fill('tester.com')
    
            await page.getByRole('button', { name: 'save' }).click()
        })


        test('blog can be liked', async({page})=>{
            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByTestId('likes')).toContainText('likes: 0')
            await page.getByRole('button', { name: 'Like' }).click()
            await expect(page.getByTestId('likes')).toContainText('likes: 1')
        })

        test('blog can be deleted by the creator', async({page})=>{
            //check that the blog is there first
            await expect(page.getByText('how to do tests playwright')).toBeVisible()
            
            //register handler to accept the dialog
            page.on('dialog', async (dialog) => {
                console.log(dialog.message())
                await dialog.accept()
            })
            //click to remove
            await page.getByRole('button', { name: 'remove' }).click()
            //the blog shouldn't be there anymore
            await expect(page.getByText('how to do tests playwright')).not.toBeVisible()
        })

        test('remove button not shown when logged in user isnt the creator of the blog', async({page})=>{
            //Log in as another user
            await page.getByRole('button', {name: 'logout'}).click()
            await page.getByTestId('username').fill('user2')
            await page.getByTestId('password').fill('secret')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('user2 logged in')).toBeVisible()  

            await expect(page.getByText('remove')).not.toBeVisible()         
        })

  })

  describe('multiple blogs are added', () => {
    beforeEach(async ({page})=>{
        //add three blogs blog
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('blog1')
        await page.getByTestId('author').fill('playwright')
        await page.getByTestId('url').fill('tester.com')
        await page.getByRole('button', { name: 'save' }).click()

        await page.getByText('blog1 playwright').waitFor()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('blog2')
        await page.getByTestId('author').fill('playwright')
        await page.getByTestId('url').fill('tester.com')
        await page.getByRole('button', { name: 'save' }).click()
        
        await page.getByText('blog2 playwright').waitFor()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('blog3')
        await page.getByTestId('author').fill('playwright')
        await page.getByTestId('url').fill('tester.com')
        await page.getByRole('button', { name: 'save' }).click()        

        await page.getByText('blog3 playwright').waitFor()
    })

    test('blogs are ordered by the number of likes', async({page})=>{
        
        //At first blogs should be in the order they were added so 1 on top, then 2 and 3 last
        let blogTitles = await page.locator('.blog').allTextContents();
        expect(blogTitles[0]).toContain('blog1');
        expect(blogTitles[1]).toContain('blog2');
        expect(blogTitles[2]).toContain('blog3');
        //click view on all blogs
        //clicking view causes the browser view to shift, hence view buttons are fetched again for every click
        //when view button is clicked it changes to hide, thus this method works
        let viewButtons = await page.getByRole('button', { name: 'view' }).all();
        await viewButtons[0].click()
        viewButtons = await page.getByRole('button', { name: 'view' }).all();
        await viewButtons[0].click()
        viewButtons = await page.getByRole('button', { name: 'view' }).all();
        await viewButtons[0].click()

        //like blog3 twice
        //when liked, the blogs change order (as they should)
        //that's why blog 3 is first at index 2 and then at index 0
        let likeButtons = await page.getByRole('button', { name: 'Like' }).all();
        await likeButtons[2].click();
        await page.waitForTimeout(500);
        likeButtons = await page.getByRole('button', { name: 'Like' }).all();
        await likeButtons[0].click();
        await page.waitForTimeout(500);

        //like blog1 once
        //blog1 is at index 1 because it was first added (so index 0) but blog3 is most liked
        //which makes it the first one in the list
        likeButtons = await page.getByRole('button', { name: 'Like' }).all();
        await likeButtons[1].click();
        await page.waitForTimeout(500);

        //check that blogs are in order, 3 on top, then 1 and 2 last
        blogTitles = await page.locator('.blog').allTextContents();
        expect(blogTitles[0]).toContain('blog3');
        expect(blogTitles[1]).toContain('blog1');
        expect(blogTitles[2]).toContain('blog2');        

    })

  })

})

})