export class ConnectionData {
    lobbyUuid: string;
    playerUuid: string;

    constructor(lobbyUuid: string, playerUuid: string) {
      this.lobbyUuid = lobbyUuid;
      this.playerUuid = playerUuid;
    }
}
