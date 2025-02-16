import {Page, Locator} from "@playwright/test";

export class HomePage {
    private readonly page: Page | undefined;
    private readonly locator: Locator | undefined;

    constructor(page: Page) {
        this.page = page;
        this.locator = page.locator('')
    }

}