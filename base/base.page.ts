import {test as base} from "@playwright/test"
import {SearchPage} from "@pages/search.page";
import {HomePage} from "@pages/home.page";

export type MyPages = {
    homePage: HomePage;
    searchPage: SearchPage;
}

export const test = base.extend<MyPages>({
    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },

    searchPage: async ({page}, use) => {
        await use(new SearchPage(page));
    },

})

export {expect} from "@playwright/test"