import {Page, Locator } from "@playwright/test";

export class Table {

    private readonly page: Page;
    private readonly _tableRow: Locator;

    constructor(page: Page) {
        this.page = page;
        this._tableRow = this.page.locator('tbody > tr');
    }

    get tableRow(): Locator {
        return this._tableRow;
    }

    async hoverToFirstRow(): Promise<void> {
        await Promise.all([
            this._tableRow.first().hover(),
            this._tableRow.first().isVisible(),
        ])
    }

    async getFirstRowResultInfo(){
        await this.tableRow.first().hover();
        await this.tableRow.first().isVisible();
        return await this.tableRow.first()
            .innerText().then(text => text.split("\t"));
    }

    async getActualUserData(i: number){
        let actualUserData = ['', '', ''];

        await this.tableRow.nth(i).hover();
        actualUserData[0] = await this.tableRow
            .nth(i).locator('td')
            .first().innerText();
        actualUserData[1] = await this.tableRow
            .nth(i).locator('td')
            .nth(1).innerText();
        actualUserData[2] = await this.tableRow
            .nth(i).locator('td')
            .nth(2).innerText();

        return actualUserData;
    }
}