import {Page, Locator, expect} from "@playwright/test";
import {Table} from "@components/table";

export class Form {
    private readonly page: Page;
    private readonly searchButton: Locator;
    private readonly userIdPlaceHolder: Locator;
    private readonly firstNamePlaceHolder: Locator;
    private readonly lastNamePlaceHolder: Locator;
    private readonly agePlaceHolder: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchButton = this.page.getByRole('button', {name: 'Search', exact: true});
        this.userIdPlaceHolder = this.page.getByPlaceholder('Enter user ID...');
        this.firstNamePlaceHolder = this.page.getByPlaceholder('Enter first name');
        this.lastNamePlaceHolder = this.page.getByPlaceholder('Enter last name');
        this.agePlaceHolder = this.page.getByPlaceholder('Enter age ( 1 - 150 )');
    }

    async inputUserData(searchCriteria: string[]): Promise<void> {
        await Promise.all([
            new Table(this.page).tableRow.first().waitFor({state: "attached"}),
            this.searchButton.isDisabled(),
            this.firstNamePlaceHolder.waitFor({state: "visible"}),
        ])
        await this.userIdPlaceHolder.fill(searchCriteria[0]);
        await this.firstNamePlaceHolder.fill(searchCriteria[1]);
        await this.lastNamePlaceHolder.fill(searchCriteria[2]);
        await this.agePlaceHolder.fill(searchCriteria[3]);
    }

    async clickSearchButton(): Promise<void> {
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            this.searchButton.isEnabled(),
            this.searchButton.click(),
        ])
    }

    async inputFirstName(firstName: string): Promise<void> {
        await Promise.all([
            new Table(this.page).tableRow.first().waitFor({state: "attached"}),
            this.searchButton.isDisabled(),
            this.firstNamePlaceHolder.waitFor({state: "visible"}),
            this.firstNamePlaceHolder.fill(firstName),
        ])
    }
}
