import {Page, Locator } from "@playwright/test";

export class Buttons {
    private readonly page: Page;
    private readonly addButtonName: Locator;
    private readonly searchButtonName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addButtonName = page.getByRole('button', {name: 'Add', exact: true});
        this.searchButtonName = page.getByRole('button', {name: 'Search', exact: true});
    }

    async getAddButtonNameLocator(): Promise<Locator> {
        return this.addButtonName;
    }

    async getSearchButtonNameLocator(): Promise<Locator> {
        return this.searchButtonName;
    }
}