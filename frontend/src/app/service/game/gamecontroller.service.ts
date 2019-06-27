import { Injectable } from '@angular/core';
import { GameData } from '../../data/game/game-data';
import { IGameController } from '../../data/interface/igame-controller';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Field } from '../../data/board/field';
import { Movement } from '../../data/board/movement';
import { Position } from '../../data/board/position';
import { Const } from 'src/app/data/const/const';
import { ConnectionData } from 'src/app/data/game/connection-data';

const urlGameServer = new Const().const.getGameUrl();
const httpHeaders =  new HttpHeaders({
  'Content-Type':  'application/json',
});

@Injectable({
  providedIn: 'root'
})

export class GamecontrollerService implements IGameController {

  constructor(private http: HttpClient) { }

  async connect(cnData: ConnectionData): Promise<string> {
    const message = await this.http.post(urlGameServer + '/connect', cnData, { headers: httpHeaders, responseType: 'text' })
    .toPromise();
    return message;
  }

  async getInfo(cnData: ConnectionData): Promise<GameData> {
    const gameData =  await this.http.get<GameData>(urlGameServer + '/getInfo', { headers: httpHeaders, params: {
      gameUuid: cnData.gameDataUuid,
      playerUuid: cnData.playerUuid
    }})
    .toPromise();
    return gameData;
  }

  async getBoard(cnData: ConnectionData): Promise<Field[][]> {
    const board =  await this.http.get<Field[][]>(urlGameServer + '/getBoard', { headers: httpHeaders , params: {
      gameUuid: cnData.gameDataUuid,
      playerUuid: cnData.playerUuid
    }})
    .toPromise();
    return board;
  }

  async getTurn(cnData: ConnectionData, position: Position): Promise<Movement[]> {
    const data = JSON.stringify({cnData, position});
    return await this.http.get<Movement[]>(urlGameServer + '/getTurn', { headers: httpHeaders , params: {
      gameUuid: cnData.gameDataUuid,
      playerUuid: cnData.playerUuid,
      position: JSON.stringify(position)
    }})
    .toPromise();
  }

  async doTurn(cnData: ConnectionData, movement: Movement): Promise<Field[][]> {
    const data = JSON.stringify({cnData, movement});
    return await this.http.post<Field[][]>(urlGameServer + '/doTurn', data, { headers: httpHeaders })
    .toPromise();
  }
}
