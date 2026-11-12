import { expect, type Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import {
  AddEmployeePage,
  type EmployeeDetails,
} from '../../src/pages/add-employee.page';
import { LoginPage } from '../../src/pages/login.page';

const { Given, When, Then } = createBdd();

const employeeByPage = new WeakMap<Page, EmployeeDetails>();
const usernameByPage = new WeakMap<Page, string>();

function uniqueLetters(): string {
  let value = Date.now();
  let result = '';

  while (value > 0) {
    result = String.fromCharCode(97 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }

  return result;
}

function createEmployeeDetails(): EmployeeDetails {
  return {
    firstName: 'Bdd',
    lastName: `Employee${uniqueLetters()}`,
  };
}

Given('I am logged in as an administrator', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(
    process.env.ORANGEHRM_USERNAME ?? 'Admin',
    process.env.ORANGEHRM_PASSWORD ?? 'admin123',
  );
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

When('I open the Add Employee form', async ({ page }) => {
  await new AddEmployeePage(page).open();
});

When('I save a new employee with unique details', async ({ page }) => {
  const details = createEmployeeDetails();
  employeeByPage.set(page, details);

  const employeePage = new AddEmployeePage(page);
  await employeePage.fillEmployee(details);
  await employeePage.save();
});

When('I submit the employee form without required details', async ({ page }) => {
  await new AddEmployeePage(page).save();
});

Then('the employee profile is saved', async ({ page }) => {
  const details = employeeByPage.get(page);
  if (!details) {
    throw new Error('Employee details were not created in this scenario.');
  }
  await new AddEmployeePage(page).expectEmployeeSaved(details);
});

Then('required employee fields are reported', async ({ page }) => {
  await new AddEmployeePage(page).expectRequiredFields();
});

