# UI and API Test Framework ( a basic boiler plate- This can be extended further by adding -  reusable fixtures, test data, JSON payload data for API testing etc)

This project uses Playwright Test with TypeScript to test the OrangeHRM demo UI and Swagger Petstore API. UI scenarios are written in executable Gherkin and use
page objects; API tests use a small Petstore client to keep endpoint operations
separate from assertions.

**Author:** Nasir Khan

## Test framework details

- **UI automation:** Playwright Test with TypeScript.
- **BDD:** OrangeHRM employee and user scenarios are written in Gherkin and
  converted into runnable Playwright tests by `bddgen`. Login coverage is
  written as Playwright tests.
- **Design pattern:** Page Object Model (POM) encapsulates UI navigation,
  locators, and actions in page classes.
- **API automation:** API scenarios use a reusable Petstore client. Client
  methods for GET, POST, and DELETE are defined separately from test assertions,
  making the API tests easier to extend.

## Requirements

- Node.js 20 or newer
- npm

## Setup

```bash
npm install
npx playwright install chromium
```

The browser install is required for UI tests. API tests do not require a browser.

## Run tests

```bash
# Run all UI and API tests
npm test

# Run only the OrangeHRM UI tests
npm run test:ui

# Run only the Petstore API tests
npm run test:api

# Run UI tests with a visible browser
npm run test:headed

# Open the latest HTML report
npm run test:report
```

Playwright writes test output to `test-results/` and the HTML report to
`playwright-report/`.

## Configuration

Default URLs and endpoint paths are defined in
[`src/config/test-environment.ts`](./src/config/test-environment.ts). Override
the service base URLs with environment variables when using another environment:

```bash
ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com \
PETSTORE_BASE_URL=https://petstore.swagger.io/v2 \
npm test
```

The OrangeHRM demo account defaults to `Admin` / `admin123`. Set
`ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD` to override those credentials.
Do not use production credentials in these tests.

## Test Framework layout - Page object model - src/pages

```text
src/
  api/petstore-client.ts       # API client for Petstore operations
  config/test-environment.ts  # UI/API base URLs and API endpoint paths
  pages/add-employee.page.ts  # OrangeHRM employee page object
  pages/login.page.ts         # OrangeHRM login page object
  pages/system-users.page.ts  # OrangeHRM system-user page object
tests/
  api/pet.api.spec.ts         # Valid and invalid GET/POST/DELETE API tests
  ui/employee-user.feature    # Gherkin employee and system-user scenarios
  ui/employee-user.steps.ts   # Playwright-BDD step definitions
  ui/login.ui.spec.ts         # Login form, valid login, and invalid login tests
playwright.config.ts          # UI and API Playwright projects
```

## Requirements Traceability Matrix (RTM) - Added just for  illustration - Tracking automation coverage against requirements/test

| ID | Area | Requirement / scenario automated | Test location |
|---|---|---|---|
| UI-01 | UI / Login | Login page displays the login form | `tests/ui/login.ui.spec.ts` |
| UI-02 | UI / Login | Valid demo credentials open the dashboard | `tests/ui/login.ui.spec.ts` |
| UI-03 | UI / Login | Invalid credentials display an error | `tests/ui/login.ui.spec.ts` |
| UI-04 | UI / Employee | Valid details create an employee profile | `tests/ui/employee-user.feature` |
| UI-05 | UI / Employee | Missing required employee details are rejected | `tests/ui/employee-user.feature` |
| UI-06 | UI / User | Valid details create a system user for an employee | `tests/ui/employee-user.feature` |
| UI-07 | UI / User | Missing required system-user details are rejected | `tests/ui/employee-user.feature` |
| API-01 | API / POST | Create a pet with valid data | `tests/api/pet.api.spec.ts` |
| API-02 | API / GET | Retrieve an existing pet | `tests/api/pet.api.spec.ts` |
| API-03 | API / DELETE | Delete an existing pet and verify it is no longer found | `tests/api/pet.api.spec.ts` |
| API-04 | API / GET | Non-numeric pet ID returns not found | `tests/api/pet.api.spec.ts` |
| API-05 | API / POST | Malformed JSON request is rejected | `tests/api/pet.api.spec.ts` |
| API-06 | API / DELETE | Non-numeric pet ID returns not found | `tests/api/pet.api.spec.ts` |

## Test notes - positive and negative tests
-API tests
- API positive tests create uniquely identified pets. Tests that create a pet
  remove it after use; the DELETE test also verifies the pet is no longer found.
- Invalid API tests check the service's response for malformed JSON or a
  non-numeric pet ID. The public Petstore demo may return different error
  statuses for malformed JSON; that test verifies the request is rejected
  rather than locking to one server-specific error code.
  -UI Tests-
  
- Successful employee/user scenarios create uniquely named records in the
  shared OrangeHRM demo and do not delete them. Run these tests only against a
  disposable test environment, not a production HR system.
- Gherkin UI scenarios live in `tests/ui/*.feature`; matching step definitions
  live in `tests/ui/*.steps.ts`. The `bddgen` command generates runnable
  Playwright tests under `tests/ui/generated/` before UI or full-suite runs.
