import {test as base} from "@playwright/test"
import {step, owner, link } from "allure-js-commons";
import * as preconditions from "../utils/apiUtils";
import {users} from "@data/usersTestData";

type MyFixtures = {
    forEachTest: void;
    createDB: void;
}

export const test = base.extend<MyFixtures>({
    forEachTest: [ async ({page}, use) => {
        {
            await owner('ppashchenkov');
            await link('https://github.com/ppashchenkov/TypeScriptPlaywrightAppTest');
            await link('https://github.com/ppashchenkov/NodeExpressAPI');
        }
        await step('Navigate to the home page.', async  () => {
            await page.goto('/');
        })
        await use();
    }, {auto: true}
    ],

    createDB: [async ({request}, use) => {
        await step('PreCondition - clear users DB, then create new users DB.', async () => {
            await preconditions.deleteUsers(request);
            await preconditions.createUsers(request, users);
        })
        await use();
        await step('PostCondition - Dispose request.', async () => {
            await request.dispose();
        })
    }, {auto: false, scope: "test", title: "Setup Data Base."}
    ],
});

export {expect} from "@playwright/test";

export async function allureMeta(epic?:any, story?: any, tags?: any, Severity?: any, description?: any) {
    return await Promise.all([
        epic, story, tags, Severity, description
    ])
}