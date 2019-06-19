import { Injectable } from '@angular/core';
import { ILobbyController } from '../interface/ilobby-controller';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Lobby } from '../data/lobby';
import { ConnectionData } from '../data/connection-data';
import { Const } from '../data/const/const';

const urlLobbyServer = new Const().const.getLobbyUrl();
const httpHeaderOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/x-www-form-urlencoded'
  })
};

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
  initLobby(lobbyName: string, playerName: string, chooseColor: string): Observable<ConnectionData> {
    const httpParams = new HttpParams()
    .set('lobbyName', lobbyName)
    .set('playerName', playerName)
    .set('chooseColor', chooseColor);
    return this.http.post<ConnectionData>(urlLobbyServer + '/initLobby', { httpParams}, httpHeaderOptions);
  }
  joinLobby(lobbyUuid: string, playerName: string): Observable<ConnectionData> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', lobbyUuid)
    .set('playerName', playerName)
    return this.http.post<ConnectionData>(urlLobbyServer + '/joinLobby', httpParams, { headers: new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded'
    })});
  }
}
