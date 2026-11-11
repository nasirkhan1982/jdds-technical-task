import { expect, test } from '@playwright/test';
import { PetstoreClient, type Pet } from '../../src/api/petstore-client';

function createPet(): Pet {
  return {
    id: Date.now() * 100 + Math.floor(Math.random() * 100),
    name: `playwright-pet-${Date.now()}`,
    photoUrls: [],
  };
}

test.describe('Swagger Petstore pet API', () => {
  test('creates a pet with POST', async ({ request }) => {
    const petstore = new PetstoreClient(request);
    const pet = createPet();
    const response = await petstore.createPet(pet);

    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: pet.id,
      name: pet.name,
      photoUrls: pet.photoUrls,
    });

    const cleanupResponse = await petstore.deletePet(pet.id);
    expect(cleanupResponse.status()).toBe(200);
  });

  test('gets an existing pet with GET', async ({ request }) => {
    const petstore = new PetstoreClient(request);
    const pet = createPet();
    const createResponse = await petstore.createPet(pet);
    expect(createResponse.status()).toBe(200);

    const response = await petstore.getPet(pet.id);
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: pet.id,
      name: pet.name,
      photoUrls: pet.photoUrls,
    });

    const cleanupResponse = await petstore.deletePet(pet.id);
    expect(cleanupResponse.status()).toBe(200);
  });

  test('deletes an existing pet with DELETE', async ({ request }) => {
    const petstore = new PetstoreClient(request);
    const pet = createPet();
    const createResponse = await petstore.createPet(pet);
    expect(createResponse.status()).toBe(200);

    const response = await petstore.deletePet(pet.id);
    expect(response.status()).toBe(200);

    const getResponse = await petstore.getPet(pet.id);
    expect(getResponse.status()).toBe(404);
  });

  test('returns not found for an invalid pet ID in GET', async ({
    request,
  }) => {
    const petstore = new PetstoreClient(request);
    const response = await petstore.getPet('not-a-number');

    expect(response.status()).toBe(404);
    await expect(response.json()).resolves.toMatchObject({ code: 404 });
  });

  test('rejects malformed JSON in POST', async ({ request }) => {
    const response = await request.post('pet', {
      data: '{broken',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(600);
  });

  test('returns not found for an invalid pet ID in DELETE', async ({
    request,
  }) => {
    const petstore = new PetstoreClient(request);
    const response = await petstore.deletePet('not-a-number');

    expect(response.status()).toBe(404);
    await expect(response.json()).resolves.toMatchObject({ code: 404 });
  });
});
