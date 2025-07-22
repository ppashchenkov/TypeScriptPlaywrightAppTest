import {test, expect, allureMeta} from "@base/base.test";
import {uniqueFirstNameUser} from "@data/usersTestData";
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

            await step('3. Expect one found user', async () => {
                await expect(searchPage.table.tableRow).toHaveCount(1);
            });
            await step('2. Collect actual user info', async () => {
                actualUserInfo = await searchPage.table.getFirstRowResultInfo();
            });

            await step('Expect firstName founded user', async () => {
                expect(actualUserInfo[1]).toStrictEqual(uniqueFirstNameUser.firstName);
            });
            await step('Expect lastName founded user', async () => {
                expect(actualUserInfo[2]).toStrictEqual(uniqueFirstNameUser.lastName);
            });
            await step('Expect age founded user', async () => {
                expect(actualUserInfo[3]).toStrictEqual(uniqueFirstNameUser.age);
            });
        })

        test(`Search User by searchCriteria: ${tcName}`, async ({createDB, homePage, searchPage}) => {
            let actualUserData: string[] = [];
            await step('1. Click "Search" tab on the Home page.', async () => {
                await homePage.tab.clickSearchTab();
            });
            await step('2. Fill user\'s info for search', async () => {
                await searchPage.form.inputUserData(searchCriteria);
            });
            await step('2. Click "search" button', async () => {
                await searchPage.form.clickSearchButton();
            });
            await step('3. Expect a lot founded users', async () => {
                await expect(searchPage.table.tableRow).toHaveCount(expectedCount);
            });
            await step('2. Hover mouse on first founded user', async () => {
                await searchPage.table.hoverToFirstRow();
            });
            for (let i = 0; i < expectedCount; i++) {
                await step('2. Collect actual user info', async () => {
                    actualUserData = await searchPage.table.getActualUserData(i);
                });
                await step('Expect firstName founded user', async () => {
                    expect(actualUserData[0]).toEqual(expectedUsers[i].firstName)
                });
                await step('Expect lastName founded user', async () => {
                    expect(actualUserData[1]).toEqual(expectedUsers[i].lastName)
                });
                await step('Expect age founded user', async () => {
                    expect(actualUserData[2]).toEqual(expectedUsers[i].age)
                });
            }
        })
    })
})
