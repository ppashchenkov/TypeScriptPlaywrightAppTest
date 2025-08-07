import {Page, Locator} from "@playwright/test";
import {Table} from "@components/table";

export class Form {
    private readonly page: Page;
    private readonly formFields: Locator;
    private readonly labelsTexts: Locator;
    private readonly searchButton: Locator;
    private readonly userIdPlaceHolder: Locator;
    private readonly firstNamePlaceHolder: Locator;
    private readonly lastNamePlaceHolder: Locator;
    private readonly agePlaceHolder: Locator;
    private readonly idField: Locator;
    private readonly firstNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly ageField: Locator;

    constructor(page: Page) {
        this.page = page;
        this.formFields = this.page.locator('.form-group');
        this.labelsTexts = this.formFields.locator('label');
        this.searchButton = this.page.getByRole('button', {name: 'Search', exact: true});
        this.userIdPlaceHolder = this.page.getByPlaceholder('Enter user ID...');
        this.firstNamePlaceHolder = this.page.getByPlaceholder('Enter first name');
        this.lastNamePlaceHolder = this.page.getByPlaceholder('Enter last name');
        this.agePlaceHolder = this.page.getByPlaceholder('Enter age ( 1 - 150 )');
        this.idField = this.page.getByLabel('User ID');
        this.firstNameField = this.page.getByLabel('First Name');
        this.lastNameField = this.page.getByLabel('Last Name');
        this.ageField = this.page.getByLabel('Age');
    }

    async getUserInfoFromPlaceholders() {
        let choicesUser: string[] = [];
        let inputs: Locator[] = [];

        inputs = await this.page.locator('#form-edit input').all();
        for (const input of inputs) {
            choicesUser.push(<string>await input.getAttribute('placeholder'));
        }

        return choicesUser;
    }

    async getFields() {
        return [this.idField, this.firstNameField, this.lastNameField, this.ageField];
    }

    async getFirstNameField() {
        return this.firstNameField;
    }

    async getLastNameField() {
        return this.lastNameField;
    }

    async getAgeField() {
        return this.ageField;
    }

    async getFormFieldsLocator(): Promise<Locator> {
        return this.formFields;
    }

    async getLabelsText(): Promise<String[]> {
        return this.labelsTexts.allInnerTexts();
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
        await this.page.waitForTimeout(100);
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
