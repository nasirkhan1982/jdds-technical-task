import { expect, type Page } from '@playwright/test';

export interface EmployeeDetails {
  firstName: string;
  lastName: string;
}

export class AddEmployeePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.getByRole('link', { name: 'PIM', exact: true }).click();
    await this.page
      .getByRole('link', { name: 'Add Employee', exact: true })
      .click();
    await expect(
      this.page.getByRole('heading', { name: 'Add Employee' }),
    ).toBeVisible();
  }

  async fillEmployee(details: EmployeeDetails): Promise<void> {
    await this.page.getByPlaceholder('First Name').fill(details.firstName);
    await this.page.getByPlaceholder('Last Name').fill(details.lastName);
  }

  async save(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
  }

  async expectEmployeeSaved(details: EmployeeDetails): Promise<void> {
    await expect(this.page).toHaveURL(
      /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
    );
    await expect(
      this.page.getByRole('heading', { name: 'Personal Details' }),
    ).toBeVisible();
    await expect(this.page.locator('input[name="firstName"]')).toHaveValue(
      details.firstName,
    );
    await expect(this.page.locator('input[name="lastName"]')).toHaveValue(
      details.lastName,
    );
  }

  async expectRequiredFields(): Promise<void> {
    await expect(this.page.getByText('Required', { exact: true })).toHaveCount(
      2,
    );
  }
}
