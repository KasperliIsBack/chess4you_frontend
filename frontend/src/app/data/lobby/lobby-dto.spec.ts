import { LobbyDto } from './lobby-dto';

describe('LobbyDto', () => {
  it('should create an instance', () => {
    expect(new LobbyDto('', '', 1)).toBeTruthy();
  });
});
