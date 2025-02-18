import {test, expect, request, APIRequestContext} from "@playwright/test";
import * as preconditions from "../utils/apiUtils";
import {uniqueFirstNameUser, users} from "@data/usersTestData";
import { data } from "@data/searchFuncTestData";
import {SearchPage} from "@pages/search.page";
import {HomePage} from "@pages/home.page";


[
    {tcName: data._1.tcName, searchCriteria: data._1.searchCriteria, expectedCount: data._1.expectedCount, expectedUsers: data._1.expectedUsers},
    {tcName: data._2.tcName, searchCriteria: data._2.searchCriteria, expectedCount: data._2.expectedCount, expectedUsers: data._2.expectedUsers},
    {tcName: data._3.tcName, searchCriteria: data._3.searchCriteria, expectedCount: data._3.expectedCount, expectedUsers: data._3.expectedUsers},
    {tcName: data._4.tcName, searchCriteria: data._4.searchCriteria, expectedCount: data._4.expectedCount, expectedUsers: data._4.expectedUsers},
    {tcName: data._5.tcName, searchCriteria: data._5.searchCriteria, expectedCount: data._5.expectedCount, expectedUsers: data._5.expectedUsers},
    {tcName: data._6.tcName, searchCriteria: data._6.searchCriteria, expectedCount: data._6.expectedCount, expectedUsers: data._6.expectedUsers}

].forEach(({tcName, searchCriteria, expectedCount, expectedUsers}) => {
    test.describe('Should Search Users By Search Criteria', async () => {
        let apiRequest: APIRequestContext;

        test.beforeEach('Create API Request Context, Create Preconditions', async ({page}) => {
            apiRequest = await request.newContext();
            await preconditions.deleteUsers(apiRequest);
            await preconditions.createUsers(apiRequest, users)
            await page.goto('/');
        })

        test(`Search User POM: ${tcName}`, async ({page}) => {

            await new HomePage(page).tab.clickSearchTab();
            const searchPage = new SearchPage(page);
            await searchPage.form
                .inputFirstName(uniqueFirstNameUser.firstName);
            await searchPage.form.clickSearchButton();

            await expect(searchPage.table.tableRow).toHaveCount(1);

            const actualUserInfo = await searchPage.table.getFirstRowResultInfo();

            expect(actualUserInfo[1]).toStrictEqual(uniqueFirstNameUser.firstName);
            expect(actualUserInfo[2]).toStrictEqual(uniqueFirstNameUser.lastName);
            expect(actualUserInfo[3]).toStrictEqual(uniqueFirstNameUser.age);
        })

        test(`Search User by searchCriteria: ${tcName}`, async ({page}) => {

            await new HomePage(page).tab.clickSearchTab();
            const searchPage = new SearchPage(page);
            await searchPage.form.inputUserData(searchCriteria);
            await searchPage.form.clickSearchButton();

            await expect(searchPage.table.tableRow).toHaveCount(expectedCount);

            await searchPage.table.hoverToFirstRow();
            for (let i = 0; i < expectedCount; i++) {
                const actualUserData = await searchPage.table.getActualUserData(i);

                expect(actualUserData[0]).toEqual(expectedUsers[i].firstName)
                expect(actualUserData[1]).toEqual(expectedUsers[i].lastName)
                expect(actualUserData[2]).toEqual(expectedUsers[i].age)
            }
        })

        // test(`Search User by searchCriteria: ${tcName}`, async ({page}) => {
        //     const searchTab = page.getByRole('link', {name: 'Search', exact: true});
        //     const tableRow = page.locator('tbody > tr');
        //     const firstNamePlaceHolder = page.getByPlaceholder('Enter first name');
        //     const lastNamePlaceHolder = page.getByPlaceholder('Enter last name');
        //     const agePlaceHolder = page.getByPlaceholder('Enter age ( 1 - 150 )');
        //     const userIdPlaceHolder = page.getByPlaceholder('Enter user ID...');
        //     const searchButton = page.getByRole('button', {name: 'Search', exact: true});
        //
        //     await expect(searchTab).toBeEnabled();
        //
        //     await searchTab.hover();
        //     await searchTab.click();
        //
        //     await expect(tableRow.first()).toBeAttached();
        //     await expect(searchButton).toBeDisabled();
        //     await expect(userIdPlaceHolder).toBeVisible();
        //     await expect(firstNamePlaceHolder).toBeVisible();
        //     await expect(lastNamePlaceHolder).toBeVisible();
        //     await expect(agePlaceHolder).toBeVisible();
        //
        //     await userIdPlaceHolder.fill(searchCriteria[0]);
        //     await firstNamePlaceHolder.fill(searchCriteria[1]);
        //     await lastNamePlaceHolder.fill(searchCriteria[2]);
        //     await agePlaceHolder.fill(searchCriteria[3]);
        //
        //     await expect(searchButton).toBeEnabled()
        //
        //     await searchButton.click();
        //
        //     await expect(tableRow).toHaveCount(expectedCount);
        //
        //     await tableRow.first().hover();
        //
        //     await expect(tableRow.first()).toBeVisible();
        //
        //     const actualListSearchedUsers = await page.locator('tbody>tr').all()
        //     const actualCountSearchedUsers = actualListSearchedUsers.length
        //
        //     for (let i = 0; i < actualCountSearchedUsers; i++) {
        //         await page.waitForLoadState('domcontentloaded');
        //         const actualFirstUserName = await page.locator('tbody>tr')
        //             .nth(i).locator('td')
        //             .first().innerText()
        //         const actualLastUserName = await page.locator('tbody>tr')
        //             .nth(i).locator('td')
        //             .nth(1).innerText()
        //         const actualAge = await page.locator('tbody>tr')
        //             .nth(i).locator('td')
        //             .nth(2).innerText()
        //         await page.waitForLoadState('networkidle')
        //
        //         expect(actualFirstUserName).toEqual(expectedUsers[i].firstName)
        //         expect(actualLastUserName).toEqual(expectedUsers[i].lastName)
        //         expect(actualAge).toEqual(expectedUsers[i].age)
        //     }
        // })

        test.afterEach('Close API request context', async ({page}) => {
            await apiRequest.dispose();
        })
    })
})
