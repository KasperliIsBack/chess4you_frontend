export class LobbyDto {
    playerName: string;
    lobbyName: string;
    chooseColor: number;
    constructor(lobbyName: string, playerName: string, chooseColor: number) {
      this.lobbyName = lobbyName;
      this.playerName = playerName;
      this.chooseColor = chooseColor;
    }
}
