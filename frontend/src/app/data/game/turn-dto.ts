import { ConnectionData } from './connection-data';
import { Movement } from '../board/movement';

export class TurnDto {
  cnData: ConnectionData;
  movement: Movement;

  constructor(cnData: ConnectionData, movement: Movement) {
    this.cnData = cnData;
    this.movement = movement;
  }
}
