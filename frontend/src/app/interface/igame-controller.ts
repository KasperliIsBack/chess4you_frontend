import { Observable } from 'rxjs';
import { GameData } from '../data/game-data';
import { Field } from '../data/board/field';
import { Url } from 'url';
import { Movement } from '../data/board/movement';

export interface IGameController {
    infoData: Observable<GameData>;
    board: Observable<Field[][]>;

    connect(urlGameServer: Url, uuidLobby: string, uuidPlayer: string);
    getInfo(urlGameServer: Url, uuidLobby: string, uuidPlayer: string);
    getBoard(urlGameServer: Url, uuidLobby: string, uuidPlayer: string);
    getTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, position: Position);
    doTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, movement: Movement);
}
