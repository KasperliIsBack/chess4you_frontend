import { TestBed } from '@angular/core/testing';

import { LobbycontrollerService } from './lobbycontroller.service';

describe('LobbycontrollerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LobbycontrollerService = TestBed.get(LobbycontrollerService);
    expect(service).toBeTruthy();
  });
});
