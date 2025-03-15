import {test, expect, request, APIRequest, APIRequestContext, Locator} from "@playwright/test"
import  { users } from "@data/usersTestData";
import {deleteAllUsers, createUsers, getRandomIndex} from "@preconditions/apiUtils";
import {Form} from "@components/form";
import {Buttons} from "@components/buttons";
import {Table} from "@components/table";

[
    {tcName: '01', editCriteria: [users.user5.firstName, '', '']},
    {tcName: '02', editCriteria: ['', users.user5.lastName, '']},
    {tcName: '03', editCriteria: ['', '', users.user5.age]},
    {tcName: '04', editCriteria: [users.user5.firstName, users.user5.lastName, '']},
    {tcName: '05', editCriteria: [users.user5.firstName, '', users.user5.age]},
    {tcName: '06', editCriteria: ['', users.user5.lastName, users.user5.age]},
    {tcName: '07', editCriteria: [users.user5.firstName, users.user5.lastName, users.user5.age]}
].forEach(({tcName, editCriteria}) => {
    test.describe('Edit and Delete users functionality', async () => {
        let apiRequest: APIRequestContext;
        let usersAmount: number;
        let randomUser: Locator;
        let form: Form;
        let table: Table;
        let buttons: Buttons;
        const usersDB = [users.user1, users.user2, users.user3, users.user4]
        test.beforeEach('Land on Home Page, Create tested users', async ({page}) => {
            apiRequest = await request.newContext();
            await deleteAllUsers(apiRequest);
            await createUsers(apiRequest, usersDB);
            await page.goto('/');

            form = new Form(page);
            table = new Table(page);
            buttons = new Buttons(page);

            usersAmount = await table.getUsersAmount();

            expect(usersAmount).toBeGreaterThanOrEqual(1);

            const randomUserIndex = getRandomIndex(await usersAmount);
            randomUser = await table.getUserLocator(randomUserIndex);
        })

        test(`TC-editUserFun-${tcName}`, async ({page}) => {
            await (await table.getEditIcon(randomUser)).click();
            let choicesUser = await form.getUserInfoFromPlaceholders();
            let updatedUser = [];
            const fields = await form.getFields();

            expect(await fields[0].isDisabled()).toBe(true);
            expect(await fields[0].isEditable()).toBe(false);

            await (await form.getFirstNameField()).fill(editCriteria[0]);
            await (await form.getLastNameField()).fill(editCriteria[1]);
            await (await form.getAgeField()).fill(editCriteria[2]);
            await buttons.editButtonClick();
            updatedUser = await table.getUserInfo(randomUser);

            expect(updatedUser[0]).toEqual(choicesUser[0])
            for(let i = 0; i <=2; i++) {
                updatedUser.push(await randomUser.locator('td').nth(i).innerText());
                if(editCriteria[i]) {

                    expect(updatedUser[i + 1]).toEqual(editCriteria[i])
                } else {

                    expect(updatedUser[i + 1]).toEqual(choicesUser[i + 1])
                }
            }
        })

        test(`TC-deleteUserFun-${tcName}`, async ({page}) => {
            await (await table.getDeleteIcon(randomUser)).click();
            const fields = await form.getFields();

            for(let i = 0; i <= 3; i++) {
                expect(await fields[i].isDisabled()).toBe(true)
                expect(await fields[i].isEditable()).toBe(false)
            }

            await buttons.deleteButtonClick();
            await page.waitForLoadState('networkidle')
            const actualCountUsers = await table.getUsersAmount();

            expect(actualCountUsers).toEqual(usersAmount - 1)
        })

        test.afterEach('Close API request context', async ({page}) => {
            await apiRequest.dispose()
        })
    })
})