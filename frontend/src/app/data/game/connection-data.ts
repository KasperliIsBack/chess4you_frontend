export class ConnectionData {
    gameUuid: string;
    gameDataUuid: string;
    playerUuid: string;

    constructor(gameUuid: string, gameDataUuid: string, playerUuid: string) {
      this.gameUuid = gameUuid;
      this.gameDataUuid = gameDataUuid;
      this.playerUuid = playerUuid;
    }
}
