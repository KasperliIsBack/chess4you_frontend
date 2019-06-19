import { Injectable } from '@angular/core';
import { LobbycontrollerService } from './lobbycontroller.service';
import { Lobby } from '../data/lobby';
import { Url } from 'url';

@Injectable({
  providedIn: 'root'
})
export class LobbyHandlerService {

  constructor(private lobbyController: LobbycontrollerService) { }

  getListLobby(): Lobby[] {
    let tmpListLobby: Lobby[] = [];

    this.lobbyController.getListLobby()
    .toPromise()
    .then(
      (list) => {
        tmpListLobby = list;
      }
    );
    return tmpListLobby;
  }

  joinLobby(lobbyUuid: string, playerName: string): Url {
    let tmpUrl: Url;

    this.lobbyController.joinLobby(lobbyUuid, playerName)
    .toPromise()
    .then(
      (url) => {
        tmpUrl = url;
      }
    );
    return tmpUrl;
  }

  initLobby(lobbyName: string, playerName: string, chooseColor: string): Url {
    let tmpUrl: Url;

    this.lobbyController.initLobby(lobbyName, playerName, chooseColor)
    .toPromise()
    .then(
      (url) => {
        tmpUrl = url;
      }
    );
    return tmpUrl;
  }
}
