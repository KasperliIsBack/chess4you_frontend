import { Player } from '../player/player';
import { Color } from '../enum/color.enum';

export class Lobby {
    lobbyUuid: string;
    gameDataUuid: string;
    lobbyName: string;
    playerOne: Player;
    colorPlayerOne: Color;
    playerTwo: Player;
    colorPlayerTwo: Color;
}
