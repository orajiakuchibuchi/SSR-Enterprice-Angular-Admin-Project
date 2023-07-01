import { TestBed } from '@angular/core/testing';

import { DepartmentResolver } from './department.resolver';

describe('DepartmentResolver', () => {
  let resolver: DepartmentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DepartmentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
