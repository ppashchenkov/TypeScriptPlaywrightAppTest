import {Page, Locator } from "@playwright/test";

export class Tab {

    private readonly page: Page;
    private readonly addTab: Locator;
    private readonly searchTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTab = page.getByRole('link', {name: 'Add', exact: true});
        this.searchTab = page.getByRole('link', {name: 'Search', exact: true});
    }

    async clickSearchTab(): Promise<void> {
        await Promise.all([
            this.searchTab.isEnabled(),
            this.searchTab.hover(),
            this.searchTab.click(),
        ])
    }

    async clickAddTab(): Promise<void> {
        await Promise.all([
            this.addTab.isEnabled(),
            this.addTab.hover(),
            this.addTab.click(),
        ])
    }

    async getAddClassAtribute(): Promise<string | null> {
        return await this.addTab.getAttribute('class');
    }

    async getSearchClassAtribute(): Promise<string | null> {
        return await this.searchTab.getAttribute('class');
    }
}