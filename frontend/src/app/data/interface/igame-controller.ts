import { Movement } from '../board/movement';
import { Position } from '../board/position';
import { ConnectionData } from '../game/connection-data';

export interface IGameController {
    connect(cnData: ConnectionData);
    getInfo(cnData: ConnectionData);
    getBoard(cnData: ConnectionData);
    getTurn(cnData: ConnectionData, position: Position);
    doTurn(cnData: ConnectionData, movement: Movement);
}
