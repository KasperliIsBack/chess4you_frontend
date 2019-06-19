import { Url } from 'url';
import { Movement } from '../data/board/movement';
import { Position } from '../data/board/position';

export interface IGameController {
    connect(urlGameServer: Url, uuidLobby: string, uuidPlayer: string);
    getInfo(urlGameServer: Url, uuidLobby: string, uuidPlayer: string);
    getBoard(urlGameServer: Url, uuidLobby: string, uuidPlayer: string);
    getTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, position: Position);
    doTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, movement: Movement);
}
