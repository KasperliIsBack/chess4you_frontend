export interface ILobbyController {
    getListLobby();
    getLobby(lobbyUuid: string);
    initLobby(lobbyName: string, playerName: string, chooseColor: string);
    joinLobby(lobbyUuid: string, playerName: string);
}
