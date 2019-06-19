import { Injectable } from '@angular/core';
import { Url } from 'url';
import { Observable } from 'rxjs';
import { GameData } from '../data/game-data';
import { Board } from '../data/board/board';
import { setTimeout } from 'timers';
import { GamecontrollerService } from './gamecontroller.service';



@Injectable({
  providedIn: 'root'
})
export class GamehandlerService {

  infoData: Observable<GameData>;
  board: Observable<Board[][]>;

  constructor(private gamecontrollerService: GamecontrollerService) { }

  connect(urlGameServer: Url, uuidLobby: string, uuidPlayer: string): string{
    this.gamecontrollerService
    .connect(urlGameServer, uuidLobby, uuidPlayer)
    .then((data) => {
      return data;
    });
  }

  getTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, position: Position): Observable<Movement[]> {
    return this.gamecontrollerService
    .getTurn(urlGameServer, uuidPlayer, uuidLobby, position);
  }

  doTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, movement: Movement): Observable<Field[][]> {
    return this.gamecontrollerService
    .doTurn(urlGameServer, uuidPlayer, uuidLobby, movement);
  }
}
