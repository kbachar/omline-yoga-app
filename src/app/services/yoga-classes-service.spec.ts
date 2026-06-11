import { TestBed } from '@angular/core/testing';

import { YogaClassesService } from './yoga-classes-service';

describe('YogaClassesService', () => {
  let service: YogaClassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YogaClassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
