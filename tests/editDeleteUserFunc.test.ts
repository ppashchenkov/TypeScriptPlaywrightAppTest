import {test, expect, request, APIRequest, APIRequestContext, Locator} from "@playwright/test"
import  { users } from "@data/usersTestData";
import {deleteAllUsers} from "../utils/apiUtils";

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
        let apiRequest: APIRequestContext
        let randomUser: Locator
        const usersDB = [users.user1, users.user2, users.user3, users.user4]
        test.beforeEach('Land on Home Page, Create tested users', async ({page}) => {
            apiRequest = await request.newContext()
            await deleteAllUsers(apiRequest)
            await page.goto('/')
            const firstNameField = page.getByPlaceholder('Enter first name')
            const lastNameField = page.getByPlaceholder('Enter last name')
            const ageField = page.getByPlaceholder('Enter age ( 1 - 150 )')

            for (const user of usersDB) {
                await firstNameField.fill(user.firstName)
                await lastNameField.fill(user.lastName)
                await ageField.fill(user.age)

                const addButton = page.getByRole('button', {name: 'Add'})
                await addButton.click()
                user.id = await page.locator('tbody>tr').last()
                    .locator('td').nth(3)
                    .innerText()
            }
            await page.goto('/');

            const usersLocator = page.locator('tbody > tr');
            const usersAmount = await usersLocator.count();

            expect(usersAmount).toBeGreaterThanOrEqual(1);

            const randomUserIndex = Math.floor(Math.random() * usersAmount);
            randomUser = usersLocator.nth(randomUserIndex);
//            await page.waitForLoadState('domcontentloaded')
        })

        test(`TC-editUserFun-${tcName}`, async ({page}) => {
            const editIcon = randomUser.locator('td>i>a.bi-pen')
            await editIcon.click()
            // await page.waitForLoadState('networkidle')

            let choicesUser = []
            let updatedUser = []

            const inputs = await page.locator('#form-edit input').all()
            for (const input of inputs) {
                choicesUser.push(await input.getAttribute('placeholder'))
            }

            expect(await inputs[0].isDisabled()).toBe(true)
            expect(await inputs[0].isEditable()).toBe(false)

            const firstNameField = await page.getByLabel('First Name')
            const lastNameField = await page.getByLabel('Last Name')
            const ageField = await page.getByLabel('Age')

            await firstNameField.fill(editCriteria[0])
            await lastNameField.fill(editCriteria[1])
            await ageField.fill(editCriteria[2])
            const editButton = page.getByRole('button', {name: 'Edit'})

            await editButton.click()
//            await page.waitForLoadState('networkidle')

            updatedUser.push(await randomUser.locator('td').nth(3).innerText())

            expect(updatedUser[0]).toEqual(choicesUser[0])
            for(let i = 0; i <=2; i++) {
                updatedUser.push(await randomUser.locator('td').nth(i).innerText())
                if(editCriteria[i]) {

                    expect(updatedUser[i + 1]).toEqual(editCriteria[i])
                } else {

                    expect(updatedUser[i + 1]).toEqual(choicesUser[i + 1])
                }
            }
        })

        test(`TC-deleteUserFun-${tcName}`, async ({page}) => {
            const listUsers = await page.locator('tbody>tr').all()
            const countUsers = listUsers.length

            const editIcon = randomUser.locator('td>i>a.bi-trash')
            await editIcon.click()
//            await page.waitForLoadState('domcontentloaded')
            const inputs = await page.locator('#form-delete input').all()

            for(let i = 0; i <= 3; i++) {

                expect(await inputs[i].isDisabled()).toBe(true)
                expect(await inputs[i].isEditable()).toBe(false)
            }

            const deleteButton = page.getByRole('button', {name: 'Delete'})
            await deleteButton.click()
            await page.waitForLoadState('networkidle')
            const actualListUsers = await page.locator('tbody>tr').all()
            const actualCountUsers = actualListUsers.length

            expect(actualCountUsers).toEqual(countUsers - 1)
        })

        test.afterEach('Close API request context', async ({page}) => {
            await apiRequest.dispose()
        })
    })
})