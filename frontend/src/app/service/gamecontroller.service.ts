import { Injectable } from '@angular/core';
import { IGameController } from '../interface/igame-controller';
import { Observable } from 'rxjs';
import { Url } from 'url';
import { Movement } from '../data/board/movement';
import { GameData } from '../data/game-data';
import { Field } from '../data/board/field';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

const httpHeaderOptions =  {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class GamecontrollerService implements IGameController {

  infoData: Observable<GameData>;
  board: Observable<Field[][]>;

  constructor(private http: HttpClient) { }

  async connect(urlGameServer: Url, uuidLobby: string, uuidPlayer: string): Promise<string> {
    const formData: FormData = new FormData();
    let message: string;

    formData.append('lobbyUuid', uuidLobby);
    formData.append('playerUuid', uuidPlayer);

    await this.http.post(urlGameServer + '/connect', formData)
    .subscribe(
      (rawMessage) => {
        message = rawMessage.toString();
      }
    );
    return message;
  }
  getInfo(urlGameServer: Url, uuidLobby: string, uuidPlayer: string): Observable<GameData> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer);

    return this.http.get<GameData>(urlGameServer + '/getInfo', { params: httpParams });
  }

  async getBoard(urlGameServer: Url, uuidLobby: string, uuidPlayer: string) {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer);
    let board: Field[][] = [];

    await this.http.get<Field[][]>(urlGameServer + '/getBoard', { params: httpParams})
    .subscribe(
      (rawBoard) => {
        board = rawBoard;
      }
    );
    return board;
  }

  getTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, position: Position): Observable<Movement[]> {
    const stringifiedPosition = JSON.stringify(position);
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer)
    .set('position', stringifiedPosition);

    return this.http.get<Movement[]>(urlGameServer + '/getTurn', { params: httpParams});
  }

  doTurn(urlGameServer: Url, uuidPlayer: string, uuidLobby: string, movement: Movement): Observable<Field[][]> {
    const stringifiedMovement = JSON.stringify(movement);
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer)
    .set('movement', JSON.stringify(movement));

    return this.http.post<Field[][]>(urlGameServer + '/doTurn', { headers: httpHeaderOptions, params: httpParams});
  }
}
