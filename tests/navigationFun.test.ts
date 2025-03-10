import {test, expect, Locator} from "@playwright/test"
import {SearchPage} from "@pages/search.page";
import {HomePage} from "@pages/home.page";
import {Tab} from "@components/tab";
import {Headers} from "@components/headers";
import {Buttons} from "@components/buttons";
import {Form} from "@components/form";

//const HOME_PAGE_URL = '/';
[
    {tabName: 'Add', count: 3, expected: [ "First Name", "Last Name", "Age" ], expectedClass: 'nav-link active', expectedURL: '/add', expectedTitle: 'Users app'},
    {tabName: 'Search', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedClass: 'nav-link active', expectedURL: '/search', expectedTitle: 'Search user'},
].forEach(({tabName, count, expected, expectedClass, expectedURL, expectedTitle}) => {
    test.describe('Navigation tabs functionality', async () => {

        test.beforeEach('navigate to home page', async ({page}) => {
            await page.goto('/')
        })

        test(`Test Case 2: Verify ${tabName} tab functionality`, async ({page}) => {

            let h2Header: Locator = await new Headers(page).getAddHeaderLocator();
            let button: Locator = await new Buttons(page).getAddButtonNameLocator();
            let tabClassAttribute: string | null = "";

            if (tabName === "Add") {
                await new HomePage(page).tab.clickAddTab();
                let tab = new Tab(page);
                tabClassAttribute = await tab.getAddClassAtribute();
                h2Header = await new Headers(page).getAddHeaderLocator();
                button = await new Buttons(page).getAddButtonNameLocator();
            } else if (tabName === "Search") {
                await new HomePage(page).tab.clickSearchTab();
                let tab = new Tab(page);
                tabClassAttribute = await tab.getSearchClassAtribute();
                h2Header = await new Headers(page).getSearchHeaderLocator();
                button = await new Buttons(page).getSearchButtonNameLocator()
            }
            const formFields = await new Form(page).getFormFieldsLocator();
            const labelsTexts = await new Form(page).getLabelsText();

            await expect(h2Header).toBeVisible()
            await expect(button).toBeVisible()
            await expect(button).toBeEnabled({enabled: false})
            await expect(formFields).toHaveCount(count)
            expect(labelsTexts).toEqual(expected)
            expect(tabClassAttribute).toStrictEqual(expectedClass)
        })

        //   test(`Test Case 4: Verify ${expectedURL} URL change to ${tabName}`, async ({ page}) => {
        //       const tab = await page.getByRole('link',
        //           {name: `${tabName}`, exact: true})
        //       await tab.click()
        //       const actualUrl = page.url()
        //       const actualTitle = await page.title()

//        await expect(actualUrl).toContain(expectedURL)
//        await expect(actualTitle).toContain(expectedTitle)
//    })

//    test(`Test Case 5: Verify ${tabName} Tab Persistence on Page Refresh`, async ({ page }) => {
//        const tab = await page.getByRole('link',
//            {name: `${tabName}`, exact: true})
//        await tab.click()
//        await page.waitForLoadState('domcontentloaded')
//        const tabClassAttribute = await tab.getAttribute('class')

//        expect(tabClassAttribute).toStrictEqual(`${expectedClass}`)
//    })
    })
})
