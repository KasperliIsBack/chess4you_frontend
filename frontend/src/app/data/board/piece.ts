import { Color } from 'src/app/data/enum/color.enum';
import { Position } from './position';

export class Piece {
    pieceUuid: any;
    color: Color;
    pieceName: string;
    position: Position;
    type: any;
    directions: any;
}
