import { TestBed } from '@angular/core/testing';

import { LobbyHandlerService } from './lobby-handler.service';

describe('LobbyHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LobbyHandlerService = TestBed.get(LobbyHandlerService);
    expect(service).toBeTruthy();
  });
});
