import { Direction } from '../enum/Direction.enum';
import { Position } from './position';

export class Movement {
    newPosition: Position;
    oldPosition: Position;
    direction: Direction;
}
