export class LobbySmallDto {
    lobbyUuid: string;
    playerName: string;
    constructor(playerName: string, lobbyUuid: string) {
        this.playerName = playerName;
        this.lobbyUuid = lobbyUuid;
    }
}
