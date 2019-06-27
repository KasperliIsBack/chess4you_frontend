import { Injectable } from '@angular/core';
import { GameData } from '../../data/game/game-data';
import { GamecontrollerService } from './gamecontroller.service';
import { Position } from '../../data/board/position';
import { Movement } from '../../data/board/movement';
import { Field } from '../../data/board/field';
import { ConnectionData } from 'src/app/data/game/connection-data';

@Injectable({
  providedIn: 'root'
})
export class GamehandlerService {

  constructor(private gameControllerService: GamecontrollerService) {}

  async connect(cnData: ConnectionData): Promise<string> {
    return await this.gameControllerService.connect(cnData);
  }

  async getInfo(cnData: ConnectionData): Promise<GameData> {
    return await this.gameControllerService.getInfo(cnData);
  }

  async getBoard(cnData: ConnectionData): Promise<Field[][]> {
    return await this.gameControllerService.getBoard(cnData);
  }

  async getTurn(cnData: ConnectionData, position: Position): Promise<Movement[]> {
    return await this.gameControllerService.getTurn(cnData, position);
  }

  async doTurn(cnData: ConnectionData, movement: Movement): Promise<Field[][]> {
    return await this.gameControllerService.doTurn(cnData, movement);
  }
}
