export interface ILobbyController {
    getListLobby();
    getLobby(lobbyUuid: string);
    initLobby(lobbyName: string, playerName: string, chooseColor: number);
    joinLobby(lobbyUuid: string, playerName: string);
}
