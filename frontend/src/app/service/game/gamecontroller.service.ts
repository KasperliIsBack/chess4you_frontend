import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameData } from '../../data/game/game-data';
import { Board } from '../../data/board/board';
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

  getInfo(urlGameServer: any, uuidLobby: string, uuidPlayer: string): Observable<GameData> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer);

    return this.http.get<GameData>(urlGameServer + '/getInfo', { params: httpParams });
  }

  async getBoard(urlGameServer: any, uuidLobby: string, uuidPlayer: string) {
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer);
    let chessboard: Board = new Board();

    await this.http.get<Field[][]>(urlGameServer + '/getBoard', { params: httpParams})
    .subscribe(
      (rawBoard) => {
        chessboard.board = rawBoard;
      }
    );
    return chessboard;
  }

  getTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, position: Position): Observable<Movement[]> {
    const stringifiedPosition = JSON.stringify(position);
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer)
    .set('position', stringifiedPosition);

    return this.http.get<Movement[]>(urlGameServer + '/getTurn', { params: httpParams});
  }

  doTurn(urlGameServer: any, uuidPlayer: string, uuidLobby: string, movement: Movement): Observable<Field[][]> {
    const stringifiedMovement = JSON.stringify(movement);
    const httpParams = new HttpParams()
    .set('lobbyUuid', uuidLobby)
    .set('playerUuid', uuidPlayer)
    .set('movement', JSON.stringify(movement));

    return this.http.post<Field[][]>(urlGameServer + '/doTurn', { headers: httpHeaderOptions, params: httpParams});
  }
}
