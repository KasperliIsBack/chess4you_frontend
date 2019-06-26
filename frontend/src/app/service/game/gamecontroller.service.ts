import { Injectable } from '@angular/core';
import { GameData } from '../../data/game/game-data';
import { IGameController } from '../../data/interface/igame-controller';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Field } from '../../data/board/field';
import { Movement } from '../../data/board/movement';
import { Position } from '../../data/board/position';

const httpHeaderOptions =  {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class GamecontrollerService implements IGameController{

  constructor(private http: HttpClient) { }

  async connect(urlGameServer: any, uuidLobby: string, uuidPlayer: string): Promise<string> {
    const formData: FormData = new FormData();
    formData.append('lobbyUuid', uuidLobby);
    formData.append('playerUuid', uuidPlayer);

    const message = await this.http.post(urlGameServer + '/connect', formData)
    .toPromise();
    return message.toString();
  }

  async getInfo(urlGameServer: any, uuidLobby: string, uuidPlayer: string): Promise<GameData> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer);

    const infoData = await this.http.get<GameData>(urlGameServer + '/getInfo', { params: httpParams })
    .toPromise();
    return infoData;
  }

  async getBoard(urlGameServer: any, uuidLobby: string, uuidPlayer: string): Promise<Field[][]> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer);

    const board = await this.http.get<Field[][]>(urlGameServer + '/getBoard', { params: httpParams})
    .toPromise();
    return board;
  }

  async getTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, position: Position): Promise<Movement[]> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer)
    .set('position', JSON.stringify(position));

    const movementList = await this.http.get<Movement[]>(urlGameServer + '/getTurn', { params: httpParams})
    .toPromise();
    return movementList;
  }

  async doTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, movement: Movement): Promise<Field[][]> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer)
    .set('movement', JSON.stringify(movement));

    const board = await this.http.post<Field[][]>(urlGameServer + '/doTurn', { headers: httpHeaderOptions, params: httpParams})
    .toPromise();
    return board;
  }
}
