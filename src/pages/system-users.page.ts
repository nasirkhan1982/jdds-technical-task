import { expect, type Locator, type Page } from '@playwright/test';
import type { EmployeeDetails } from './add-employee.page';

export class SystemUsersPage {
  constructor(private readonly page: Page) {}

  async openAddUser(): Promise<void> {
    await this.page.getByRole('link', { name: 'Admin', exact: true }).click();
    await this.page.getByRole('button', { name: 'Add' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'Add User' }),
    ).toBeVisible();
  }

  async createUser(
    employee: EmployeeDetails,
    username: string,
    password: string,
  ): Promise<void> {
    await this.selectOption('User Role', 'ESS');

    const employeeName = `${employee.firstName} ${employee.lastName}`;
    const employeeInput = this.page.getByPlaceholder('Type for hints...');
    await employeeInput.fill(employeeName);
    await this.page.getByRole('option', { name: employeeName }).click();

    await this.selectOption('Status', 'Enabled');
    await this.inputFor('Username').fill(username);
    await this.inputFor('Password').fill(password);
    await this.inputFor('Confirm Password').fill(password);
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
  }

  async expectUserListed(username: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'System Users' }),
    ).toBeVisible();
    await expect(
      this.page.getByRole('row').filter({ hasText: username }),
    ).toBeVisible();
  }

  async expectRequiredFields(): Promise<void> {
    await expect(this.page.getByText('Required', { exact: true })).toHaveCount(
      5,
    );
  }

  private async selectOption(label: string, option: string): Promise<void> {
    await this.inputGroup(label).locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  private inputFor(label: string): Locator {
    return this.inputGroup(label).getByRole('textbox');
  }

  private inputGroup(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.getByText(label, { exact: true }) });
  }
}
