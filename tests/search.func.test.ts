import {test, expect, allureMeta} from "@base/base.test";
import {uniqueFirstNameUser, users} from "@data/usersTestData";
import { data } from "@data/searchFuncTestData";
import {epic, story, tags, Severity, description, step} from "allure-js-commons";


[
    {tcName: data._1.tcName, searchCriteria: data._1.searchCriteria, expectedCount: data._1.expectedCount, expectedUsers: data._1.expectedUsers},
    {tcName: data._2.tcName, searchCriteria: data._2.searchCriteria, expectedCount: data._2.expectedCount, expectedUsers: data._2.expectedUsers},
    {tcName: data._3.tcName, searchCriteria: data._3.searchCriteria, expectedCount: data._3.expectedCount, expectedUsers: data._3.expectedUsers},
    {tcName: data._4.tcName, searchCriteria: data._4.searchCriteria, expectedCount: data._4.expectedCount, expectedUsers: data._4.expectedUsers},
    {tcName: data._5.tcName, searchCriteria: data._5.searchCriteria, expectedCount: data._5.expectedCount, expectedUsers: data._5.expectedUsers},
    {tcName: data._6.tcName, searchCriteria: data._6.searchCriteria, expectedCount: data._6.expectedCount, expectedUsers: data._6.expectedUsers}

].forEach(({tcName, searchCriteria, expectedCount, expectedUsers}) => {
    test.describe('Should Search Users By Search Criteria', async () => {

        test.beforeEach('Create API Request Context, Create Preconditions', async () => {
            await allureMeta(
                epic('FUN: Search Users By Search Criteria'),
                story('FUN-SEARCH: Search for a user/users using one or multiple criteries.'),
                tags('FUN', 'SEARCH'),
                Severity.NORMAL
            );
        })

        test(`Search User POM: ${tcName}`, async ({createDB, homePage, searchPage}) => {
            await allureMeta(
                description('This test verifies that the "Search" tab is accessible, allows user input, ' +
                    'enables the search button upon valid input, and correctly displays the searched user’s details ' +
                    'in the results table.')
            )
            let actualUserInfo: string[] = [];
            await step('1. Click "Search" tab on the Home page.', async () => {
                await homePage.tab.clickSearchTab();
            });
            await step('2. Fill firstName info', async () => {
                await searchPage.form
                    .inputFirstName(uniqueFirstNameUser.firstName);
            });
            await step('2. Click "search" button', async () => {
                await searchPage.form.clickSearchButton();
            });

            await step('3. Expect that we found one unique user', async () => {
                await expect(searchPage.table.tableRow).toHaveCount(1);
            });
            await step('2. Collect user info', async () => {
                actualUserInfo = await searchPage.table.getFirstRowResultInfo();
            });

            await step('Expect: firstName, lastName and age from founded user', async () => {
                expect(actualUserInfo[1]).toStrictEqual(uniqueFirstNameUser.firstName);
                expect(actualUserInfo[2]).toStrictEqual(uniqueFirstNameUser.lastName);
                expect(actualUserInfo[3]).toStrictEqual(uniqueFirstNameUser.age);
            });
        })

        test(`Search User by searchCriteria: ${tcName}`, async ({createDB, homePage, searchPage}) => {

            await homePage.tab.clickSearchTab();
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
    })
})
