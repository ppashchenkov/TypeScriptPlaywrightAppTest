import {Page, Locator } from "@playwright/test";

export class Buttons {
    private readonly page: Page;
    private readonly addButtonName: Locator;
    private readonly searchButtonName: Locator;
    private readonly editButtonName: Locator;
    private readonly deleteButtonName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addButtonName = page.getByRole('button', {name: 'Add', exact: true});
        this.searchButtonName = page.getByRole('button', {name: 'Search', exact: true});
        this.editButtonName = page.getByRole('button', {name: 'Edit', exact: true});
        this.deleteButtonName = page.getByRole('button', {name: 'Delete', exact: true});
    }

    async getAddButtonNameLocator(): Promise<Locator> {
        return this.addButtonName;
    }

    async getSearchButtonNameLocator(): Promise<Locator> {
        return this.searchButtonName;
    }

    async getEditButtonNameLocator(): Promise<Locator> {
        return this.editButtonName;
    }

    async editButtonClick(): Promise<void> {
        await (await this.getEditButtonNameLocator()).click();
        await this.page.waitForTimeout(150);
    }

    async getDeleteButtonNameLocator(): Promise<Locator> {
        return this.deleteButtonName;
    }

    async deleteButtonClick(): Promise<void> {
        await (await this.getDeleteButtonNameLocator()).click();
        await this.page.waitForTimeout(100);
        // await this.page.waitForLoadState('load');
    }
}