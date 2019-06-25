import { TestBed } from '@angular/core/testing';

import { GamecontrollerService } from './gamecontroller.service';

describe('GamecontrollerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamecontrollerService = TestBed.get(GamecontrollerService);
    expect(service).toBeTruthy();
  });
});
