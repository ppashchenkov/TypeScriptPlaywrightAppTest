import {test, expect}  from "@playwright/test"

[
    {tabName: 'Add', expectedClass: 'nav-link active'},
    {tabName: 'Search', expectedClass: 'nav-link'},
].forEach(({tabName, expectedClass}) => {
    test.describe('Navigation tab are available', async () => {

        test.beforeEach('navigate to home page', async({ page }) => {
            await page.goto('/')
        })

        test( `Test Case 1: Verify ${tabName} tab should be available`, async ({ page}) => {
            const tab = page.getByRole('link', {name: `${tabName}`, exact: true})
            const tabClassAttribute = await tab.getAttribute('class')

            await expect(tab).toBeAttached()
            await expect(tab).toHaveCount(1)
            await expect(tab).toBeVisible()
            await expect(tab).toBeEnabled()
            expect(tabClassAttribute).toStrictEqual(`${expectedClass}`)
        })
    })
})