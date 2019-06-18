import { TestBed } from '@angular/core/testing';

import { GamehandlerService } from './gamehandler.service';

describe('GamehandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamehandlerService = TestBed.get(GamehandlerService);
    expect(service).toBeTruthy();
  });
});
