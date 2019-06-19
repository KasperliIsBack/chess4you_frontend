import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameData } from '../data/game-data';
import { Board } from '../data/board/board';
import { GamecontrollerService } from './gamecontroller.service';
import { Position } from '../data/board/position';
import { Movement } from '../data/board/movement';
import { Field } from '../data/board/field';



@Injectable({
  providedIn: 'root'
})
export class GamehandlerService {

  infoData: Observable<GameData>;
  board: Observable<Board[][]>;

  constructor(private gamecontrollerService: GamecontrollerService) { }

  connect(urlGameServer: any, uuidLobby: string, uuidPlayer: string) {
    this.gamecontrollerService
    .connect(urlGameServer, uuidLobby, uuidPlayer)
    .then((data) => {
      return data;
    });
  }

  getTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, position: Position): Observable<Movement[]> {
    return this.gamecontrollerService
    .getTurn(urlGameServer, uuidPlayer, uuidLobby, position);
  }

  doTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, movement: Movement): Observable<Field[][]> {
    return this.gamecontrollerService
    .doTurn(urlGameServer, uuidPlayer, uuidLobby, movement);
  }
}
