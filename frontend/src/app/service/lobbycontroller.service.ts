import { Injectable } from '@angular/core';
import { ILobbyController } from '../interface/ilobby-controller';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Lobby } from '../data/lobby';

const urlLobbyServer = 'https://172.16.1.198:8082';
const httpHeaderOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LobbycontrollerService implements ILobbyController {

  constructor(private http: HttpClient) { }

  getListLobby(): Observable<Lobby[]> {
    return this.http.get<Lobby[]>(urlLobbyServer + '/getAllLobby');
  }
  getLobby(lobbyUuid: string): Observable<Lobby> {
    const httpParams = new HttpParams()
    .set('lobbyUuid', lobbyUuid);

    return this.http.get<Lobby>(urlLobbyServer + '/getLobby', { params: httpParams });
  }
  initLobby(lobbyName: string, playerName: string, chooseColor: number): Observable<string> {
    return this.http.post<string>(urlLobbyServer + '/initLobby', {lobbyName, playerName, chooseColor}, httpHeaderOptions);
  }
  joinLobby(lobbyUuid: string, playerName: string): Observable<string> {
    return this.http.post<string>(urlLobbyServer + '/joinLobby', {lobbyUuid, playerName}, httpHeaderOptions);  }
}
