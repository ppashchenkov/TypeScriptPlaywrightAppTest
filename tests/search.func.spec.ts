import {test, expect, request, APIRequestContext} from "@playwright/test";
import * as preconditions from "../utils/apiUtils";
import {HomePage} from "../pages/home.page";
import { SearchPage } from "../pages/search.page";
import { users } from "../testData/usersTestData";

[
    // {tcRunNumber: "Run_01" },
    // {tcRunNumber: "Run_02" },
    // {tcRunNumber: "Run_03" },
    // {tcRunNumber: "Run_04" },
    // {tcRunNumber: "Run_05" },
    // {tcRunNumber: "Run_06" },
    // {tcRunNumber: "Run_07" },
    // {tcRunNumber: "Run_08" },
    // {tcRunNumber: "Run_09" },
    // {tcRunNumber: "Run_10" },
    // {tcRunNumber: "Run_11" },
    // {tcRunNumber: "Run_12" },
    // {tcRunNumber: "Run_13" },
    // {tcRunNumber: "Run_14" },
    // {tcRunNumber: "Run_15" },
    // {tcRunNumber: "Run_16" },
    // {tcRunNumber: "Run_17" },
    // {tcRunNumber: "Run_18" },
    {tcRunNumber: "Run_19" }
].forEach(({tcRunNumber}) => {
    test.describe('Should Search Users By Search Criteria', async() => {
        let apiRequest: APIRequestContext;

        test.beforeEach('Create API Request Context, Create Preconditions', async({ page }) => {
            apiRequest = await request.newContext();
            await preconditions.deleteUsers(apiRequest);
            await preconditions.createUsers(apiRequest, users)
            await page.goto('/');
        })

        test(`Search User With Unique First Name: ${tcRunNumber}`, async({ page }) => {
            const searchTab = page.getByRole('link', {name: 'Search', exact: true});
            const tableRow = page.locator('tbody > tr');
            const firstNamePlaceHolder = page.getByPlaceholder('Enter first name');
            const searchButton = page.getByRole('button', {name: 'Search', exact: true});

            await expect(searchTab).toBeEnabled();

            await searchTab.hover();
            await searchTab.click();

            await expect(tableRow.first()).toBeAttached();
            await expect(searchButton).toBeDisabled();
            await expect(firstNamePlaceHolder).toBeVisible();

            await firstNamePlaceHolder.fill(users.user1.firstName);

            await expect(searchButton).toBeEnabled()

            await searchButton.click();

            await expect(tableRow).toHaveCount(1);

            await tableRow.first().hover();

            await expect(tableRow.first()).toBeVisible();

            const actualUserInfo = await tableRow.first().innerText().then(text => text.split("\t"));

            expect(actualUserInfo[1]).toStrictEqual(users.user1.firstName);
            expect(actualUserInfo[2]).toStrictEqual(users.user1.lastName);
            expect(actualUserInfo[3]).toStrictEqual(users.user1.age);
        })

        test.afterEach('Close API request context', async({ page }) => {
            await apiRequest.dispose();
        })
    })
})