import { expect, type Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import {
  AddEmployeePage,
  type EmployeeDetails,
} from '../../src/pages/add-employee.page';
import { LoginPage } from '../../src/pages/login.page';
import { SystemUsersPage } from '../../src/pages/system-users.page';

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

When('I add an employee for the new system user', async ({ page }) => {
  const details = createEmployeeDetails();
  employeeByPage.set(page, details);

  const employeePage = new AddEmployeePage(page);
  await employeePage.open();
  await employeePage.fillEmployee(details);
  await employeePage.save();
  await employeePage.expectEmployeeSaved(details);
});

When('I open the Add User form', async ({ page }) => {
  await new SystemUsersPage(page).openAddUser();
});

When('I create a system user for that employee', async ({ page }) => {
  const employee = employeeByPage.get(page);
  if (!employee) {
    throw new Error('Employee details were not created in this scenario.');
  }

  const username = `bdduser${Date.now()}`;
  usernameByPage.set(page, username);
  await new SystemUsersPage(page).createUser(
    employee,
    username,
    'BddTest123!',
  );
});

When(
  'I submit the system user form without required details',
  async ({ page }) => {
    await page.getByRole('button', { name: 'Save', exact: true }).click();
  },
);

Then('the system user is listed successfully', async ({ page }) => {
  const username = usernameByPage.get(page);
  if (!username) {
    throw new Error('System-user details were not created in this scenario.');
  }
  await new SystemUsersPage(page).expectUserListed(username);
});

Then('required system-user fields are reported', async ({ page }) => {
  await new SystemUsersPage(page).expectRequiredFields();
});
