import {Browser, BrowserContext, Page, test, chromium, expect} from "@playwright/test";
import {step, Severity} from "allure-js-commons";
import * as data from "@data/constants.data";
import * as allure from "allure-js-commons";

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll('Setup Playwright envirement', async () => {
    await step('Launch Chromium Browser', async () => {
        browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
    })
})

test.describe('Verify the server is responsive', async() => {
    // await allure.epic('SRV: Server Availability and Homepage Load.');
    // await allure.story('SRV-LOAD: Verify API responds successfully upon navigation.');
    // await allure.tags('SRV', '/api/', '/api/users/');

    test.beforeEach('Create new Context and new Page', async() => {
        await allure.severity(Severity.BLOCKER);

        await step('Create new BrowserContext', async () => {
            context = await browser.newContext();
        })
        await step('Create new Page', async () => {
            page = await browser.newPage();
        })

    })

    test('@allure.id:SRV-LOAD-TC01 Ensure page "/api/" is responsive', async() => {
        {
            await allure.description('Ensure that the "/api/" page loads correctly by verifying "/api/" response and App name.');
        }
        await step('1. Navigate to "/api/", verify the successful response ', async () => {
            await Promise.all([
                page.waitForResponse(response =>
                    response.url().endsWith('/api/')
                    && response.status() === 200),
                page.goto(`/api/`)
            ])
        })
        await step(`VERIFY the App name "${data.APP_NAME}"`, async () => {
            await expect(page.getByText(data.APP_NAME)).toBeVisible()
        })
    })

    test.afterEach('Close Context and Page', async() => {
        await step('Close Page', async () => {
            await page.close();
        })
        await step('Close Context', async () => {
            await context.close();
        })
    })
})

test.afterAll('Teardown Playwright envirement', async() => {
    await step('Close Chromium Browser', async () => {
        await browser.close();
    })
})