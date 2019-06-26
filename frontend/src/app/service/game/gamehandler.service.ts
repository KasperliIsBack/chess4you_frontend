import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameData } from '../../data/game/game-data';
import { Board } from '../../data/board/board';
import { GamecontrollerService } from './gamecontroller.service';
import { Position } from '../../data/board/position';
import { Movement } from '../../data/board/movement';
import { Field } from '../../data/board/field';



@Injectable({
  providedIn: 'root'
})
export class GamehandlerService implements OnInit {
  infoData: Observable<GameData>;
  board: Observable<Board>;
  private invterval: number;

  constructor(private gamecontrollerService: GamecontrollerService) { }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  setInterval(interval: number): void {
    this.invterval = interval;
  }

  async connect(urlGameServer: any, uuidLobby: string, uuidPlayer: string): Promise<string> {
    return await this.gamecontrollerService.connect(urlGameServer, uuidLobby, uuidPlayer);
  }

  async getTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, position: Position): Promise<Movement[]> {
    return await this.gamecontrollerService.getTurn(urlGameServer, uuidPlayer, uuidLobby, position);
  }

  async doTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, movement: Movement): Promise<Field[][]> {
    return await this.gamecontrollerService.doTurn(urlGameServer, uuidPlayer, uuidLobby, movement);
  }
}
