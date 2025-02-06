import {test, expect, request, APIRequestContext} from "@playwright/test";
import * as preconditions from "../utils/apiUtils";
import {HomePage} from "../pages/home.page";
import { SearchPage } from "../pages/search.page";
import { users } from "../testData/usersTestData";

[
    {tcRunNumber: "Run_01" },
    {tcRunNumber: "Run_02" },
    {tcRunNumber: "Run_03" },
    {tcRunNumber: "Run_04" },
    {tcRunNumber: "Run_05" },
    {tcRunNumber: "Run_06" },
    {tcRunNumber: "Run_07" },
    {tcRunNumber: "Run_08" },
    {tcRunNumber: "Run_09" },
    {tcRunNumber: "Run_10" },
    {tcRunNumber: "Run_11" },
    {tcRunNumber: "Run_12" },
    {tcRunNumber: "Run_13" },
    {tcRunNumber: "Run_14" },
    {tcRunNumber: "Run_15" },
    {tcRunNumber: "Run_16" },
    {tcRunNumber: "Run_17" },
    {tcRunNumber: "Run_18" },
    {tcRunNumber: "Run_19" },
].forEach(({tcRunNumber}) => {
    test.describe('Should Search Users By Search Criteria', async() => {
        let apiRequest: APIRequestContext;
        test.beforeEach('Create API Request Context, Create Preconditions', async({ page }) => {
            apiRequest = await request.newContext();
            await preconditions.deleteAllUsers(apiRequest);
            await preconditions.createUsers(apiRequest)
            await page.goto('/');
        })

        test(`Search User With Unique First Name: ${tcRunNumber}`, async({ page }) => {
            const userJohn = users.user1;
            const homePage = new HomePage(page);
            await homePage.clickSearchTab();

            const searchPage = new SearchPage(page);
            await searchPage.inputFirstName(userJohn.firstName);
            await searchPage.clickSearchButton();
            const count = await searchPage.getTbodyRowCounts();

            expect(count).toBe(1);
        })

        test.afterEach('Close API request context', async({ page }) => {
            await apiRequest.dispose();
        })
    })
})