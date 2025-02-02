import {test, expect, request, APIRequestContext} from "@playwright/test";
import * as preconditions from "../utils/apiUtils";

test.describe('Test Suite Name', async() => {
    let apiRequest: APIRequestContext;

    test.beforeEach('Before Each Name', async({ page }) => {
        apiRequest = await request.newContext();
//        await preconditions.deleteAllUsers(apiRequest);
//        await preconditions.createUsers(apiRequest)
//        await page.goto('/');
    })

    test('Unique Test Name', async({ page }) => {
        await apiRequest.dispose();
    })
})
