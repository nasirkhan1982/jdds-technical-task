import type { APIRequestContext, APIResponse } from '@playwright/test';
import { apiEndpoints } from '../config/test-environment';

export interface Pet {
  id: number;
  name: string;
  photoUrls: string[];
}

export class PetstoreClient {
  constructor(private readonly request: APIRequestContext) {}

  getPet(petId: number | string): Promise<APIResponse> {
    return this.request.get(apiEndpoints.pet(petId));
  }

  createPet(pet: Pet): Promise<APIResponse> {
    return this.request.post(apiEndpoints.pets, { data: pet });
  }

  deletePet(petId: number | string): Promise<APIResponse> {
    return this.request.delete(apiEndpoints.pet(petId));
  }
}
