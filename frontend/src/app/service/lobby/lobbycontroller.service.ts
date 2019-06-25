import { Injectable } from '@angular/core';
import { ILobbyController } from '../../data/interface/ilobby-controller';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Lobby } from '../../data/lobby/lobby';
import { Const } from '../../data/const/const';
import { LobbySmallDto } from '../../data/lobby/lobby-small-dto';
import { LobbyDto } from 'src/app/data/lobby/lobby-dto';
import { ConnectionData } from 'src/app/data/game/connection-data';

const urlLobbyServer = new Const().const.getLobbyUrl();
const httpHeaders: HttpHeaders =  new HttpHeaders({
  'Content-Type' : 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class LobbycontrollerService implements ILobbyController {

  constructor(private http: HttpClient) { }

  getListLobby(): Observable<Lobby[]> {
    return this.http.get<Lobby[]>(urlLobbyServer + '/getListLobbies');
  }
  getLobby(lobbyUuid: string): Observable<Lobby> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', lobbyUuid);

    return this.http.get<Lobby>(urlLobbyServer + '/getLobby', { params: httpParams });
  }
  async initLobby(lobbyName: string, playerName: string, chooseColor: number): Promise<ConnectionData> {
    const lobbyDto: LobbyDto = new LobbyDto(lobbyName, playerName, chooseColor);
// tslint:disable-next-line: max-line-length
    const connectionData = await this.http.post<ConnectionData>(urlLobbyServer + '/initLobby', JSON.stringify(lobbyDto), { headers: httpHeaders })
    .toPromise();
    return connectionData;
  }
  async joinLobby(lobbyUuid: string, playerName: string): Promise<ConnectionData> {
    const lobbyDto: LobbySmallDto = new LobbySmallDto(playerName, lobbyUuid);
// tslint:disable-next-line: max-line-length
    const connectionData = await this.http.post<ConnectionData>(urlLobbyServer + '/joinLobby', JSON.stringify(lobbyDto), { headers: httpHeaders })
    .toPromise();
    return connectionData;
  }
}
