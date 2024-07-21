import { TestBed } from '@angular/core/testing';

import { PlantStoreService } from './plant-store.service';

describe('PlantStoreService', () => {
  let service: PlantStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
