import { Field } from './field';

export class Board {
    board: Field[][];

    constructor(board: Field[][]) {
      this.board = board;
    }
}
