import { Player } from './Player';
import { Color } from '../enum/color.enum';
import { Movement } from './board/movement';

export class GameData {
    gameUuid: string;
    gameName: string;
    firstPlayer: Player;
    colorFirstPlayer: Color;
    isFirstPlayerConnected: boolean;
    secondPlayer: Player;
    colorSecondPlayer: Color;
    isSecondPlayerConnected: boolean;
    currentPlayer: Player;
    gamePeriodInMinute: number;
    turnDate: Date;
    historyOfMovements: Movement[];
    dicPosPiece: any;
}
