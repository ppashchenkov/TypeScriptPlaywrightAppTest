import {Page, Locator } from "@playwright/test";

export class Headers {
    private readonly page: Page;
    private readonly addHeader: Locator;
    private readonly searchHeader: Locator;


    constructor(page: Page) {
        this.page = page;
        this.addHeader = page.getByRole('heading',
            {name: 'Add User', exact: true});
        this.searchHeader = page.getByRole('heading',
            {name: 'Search user', exact: true});
    }

    async getAddHeaderLocator(): Promise<Locator> {
        return this.addHeader;
    }

    async getSearchHeaderLocator(): Promise<Locator> {
        return this.searchHeader;
    }
}