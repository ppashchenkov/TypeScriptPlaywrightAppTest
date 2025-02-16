import {Page, Locator, expect} from "@playwright/test";
import {Table} from "@components/table";


export class Form {
    private readonly page: Page;
    private readonly searchButton: Locator;
    private readonly firstNamePlaceHolder: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchButton = this.page.getByRole('button', {name: 'Search', exact: true});
        this.firstNamePlaceHolder = this.page.getByPlaceholder('Enter first name');
    }

    async inputFirstName(firstName: string): Promise<void> {
        await Promise.all([
            new Table(this.page).tableRow.first().waitFor({state: "attached"}),
            this.searchButton.isDisabled(),
            this.firstNamePlaceHolder.waitFor({state: "visible"}),
            this.firstNamePlaceHolder.fill(firstName),
        ])
    }

    async clickSearchButton(): Promise<void> {
        await Promise.all([
            this.searchButton.isEnabled(),
            this.searchButton.click(),
        ])
    }




}
