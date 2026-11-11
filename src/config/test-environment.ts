function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function withTrailingSlash(url: string): string {
  return `${withoutTrailingSlash(url)}/`;
}

export const testEnvironment = {
  ui: {
    baseUrl: withoutTrailingSlash(
      process.env.ORANGEHRM_BASE_URL ??
        'https://opensource-demo.orangehrmlive.com',
    ),
    loginPath: '/web/index.php/auth/login',
  },
  api: {
    baseUrl: withTrailingSlash(
      process.env.PETSTORE_BASE_URL ?? 'https://petstore.swagger.io/v2',
    ),
    petsPath: 'pet',
  },
};

export const apiEndpoints = {
  pets: testEnvironment.api.petsPath,
  pet: (petId: number | string) =>
    `${testEnvironment.api.petsPath}/${encodeURIComponent(String(petId))}`,
};
