import {test, expect, Locator} from "@playwright/test"
import {HomePage} from "@pages/home.page";
import {Tab} from "@components/tab";
import {Headers} from "@components/headers";
import {Buttons} from "@components/buttons";
import {Form} from "@components/form";
import {epic, story, tags, Severity, step} from "allure-js-commons";
import {allureMeta} from "@base/base.test";

[
    {tabName: 'Add', header: 'Add User', buttonName: 'Add', count: 3, expected: [ "First Name", "Last Name", "Age" ], expectedClass: 'nav-link active', expectedURL: '/add', expectedTitle: 'Users app'},
    {tabName: 'Search', header: 'Search user', buttonName: 'Search', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedClass: 'nav-link active', expectedURL: '/search', expectedTitle: 'Search user'},
].forEach(({tabName, header, buttonName, count, expected, expectedClass, expectedURL, expectedTitle}) => {
    test.describe('Navigation tabs functionality', async () => {

        test.beforeEach('navigate to home page', async ({page}) => {
            await allureMeta(
                epic('FUN: Tab functionality.'),
                story('FUN: Verify functionality and visibility all tabs.'),
                tags('FUN', 'TAB', 'ADD', 'SEARCH'),
                Severity.NORMAL
            );
            await step('1. Open Home page.', async () => {
                await page.goto('/')
            })
            if (tabName === "Add") {
                await step('2. Click "Add" tab on the Home page.', async () => {
                    await new HomePage(page).tab.clickAddTab();
                })
            } else if (tabName === "Search") {
                await step('2. Click "Search" tab on the Home page.', async () => {
                    await new HomePage(page).tab.clickSearchTab();
                })
            }
        })

        test(`Test Case 2: Verify ${tabName} tab functionality`, async ({page}) => {

            let h2Header: Locator = await new Headers(page).getAddHeaderLocator();
            let button: Locator = await new Buttons(page).getAddButtonNameLocator();
            let tabClassAttribute: string | null = "";
            let formFields: Locator = await new Form(page).getFormFieldsLocator();
            let labelsTexts: String[] = [];

            if (tabName === "Add") {
                await step('3. Get class name Add tab.', async () => {
                    let tab = new Tab(page);
                    tabClassAttribute = await tab.getAddClassAtribute();
                })
                await step('4. Get locator for h2 header on Add page.', async () => {
                    h2Header = await new Headers(page).getAddHeaderLocator();
                })
                await step('5. Get locator for Add button.', async () => {
                    button = await new Buttons(page).getAddButtonNameLocator();
                })
            } else if (tabName === "Search") {
                await step('3. Get class name Search tab.', async () => {
                    let tab = new Tab(page);
                    tabClassAttribute = await tab.getSearchClassAtribute();
                })
                await step('4. Get locator for h2 header on Search page.', async () => {
                    h2Header = await new Headers(page).getSearchHeaderLocator();
                })
                await step('5. Get locator for Search button.', async () => {
                    button = await new Buttons(page).getSearchButtonNameLocator();
                })
            }
            await step('6. Collect all fields in the user\'s table.', async () => {
                formFields = await new Form(page).getFormFieldsLocator();
            })
            await step('7. Collect text all fields in the user\'s table.', async () => {
                labelsTexts = await new Form(page).getLabelsText();
            })

            await step(`8.1. Expect h2 header "${header}" is visible.`, async () => {
                await expect(h2Header).toBeVisible()
            })
            await step(`8.2. Expect "${buttonName}" button is visible.`, async () => {
                await expect(button).toBeVisible()
            })
            await step(`8.3. Expect "${buttonName}" button is enabled.`, async () => {
                await expect(button).toBeEnabled({enabled: false})
            })
            await step(`8.4. Expect count all fields is equal to "${count}".`, async () => {
                await expect(formFields).toHaveCount(count);
            })
            await step(`8.5. Expect field text is "${expected}".`, async () => {
                expect(labelsTexts).toEqual(expected);
            })
            await step(`8.6. Expect that class name of the "${tabName}" tab is "${expectedClass}".`, async () => {
                expect(tabClassAttribute).toStrictEqual(expectedClass);
            })
        })

           test(`Test Case 4: Verify ${expectedURL} URL change to ${tabName}`, async ({ page}) => {
               const actualUrl = page.url()
               const actualTitle = await page.title()

               await step(`3.1. Expect that URL is "${expectedURL}".`, async () => {
                   expect(actualUrl).toContain(expectedURL);
               })
               await step(`3.2. Expect that Title is "${expectedTitle}".`, async () => {
                   expect(actualTitle).toContain(expectedTitle);
               })
        })

        test(`Test Case 5: Verify ${tabName} Tab Persistence on Page Refresh`, async ({ page }) => {
            let tabClassAttribute: string | null = "";
            if (tabName === "Add") {
                await step('3. Get class name Add tab.', async () => {
                    let tab = new Tab(page);
                    tabClassAttribute = await tab.getAddClassAtribute();
                })
            } else if (tabName === "Search") {
                await step('3. Get class name Search tab.', async () => {
                    let tab = new Tab(page);
                    tabClassAttribute = await tab.getSearchClassAtribute();
                })
            }

            await step(`4. Expect that class name of the "${tabName}" tab is "${expectedClass}".`, async () => {
                expect(tabClassAttribute).toStrictEqual(`${expectedClass}`);
            })
    })
    })
})
