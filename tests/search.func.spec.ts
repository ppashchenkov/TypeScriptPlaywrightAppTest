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
    {tcRunNumber: "Run_08" }
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
            await new HomePage(page)
                .clickSearchTab();
            const searchPage = new SearchPage(page);
            await searchPage.inputFirstName(userJohn.firstName).then((res) => {
                return res;
            }).catch((err) => {
                return err;
            });
            await searchPage.clickSearchButton();

            expect(await searchPage.getTbodyRowCounts()).toBe(1);
        })

        test.afterEach('Close API request context', async({ page }) => {
            await apiRequest.dispose();
        })
    })
})