import { Injectable } from '@angular/core';
import { LobbycontrollerService } from './lobbycontroller.service';
import { Lobby } from '../data/lobby';

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

  joinLobby(lobbyUuid: string, playerName: string): string {
    let tmpUrl: string;

    this.lobbyController.joinLobby(lobbyUuid, playerName)
    .toPromise()
    .then(
      (url) => {
        tmpUrl = url;
      }
    );
    return tmpUrl;
  }

  initLobby(lobbyName: string, playerName: string, chooseColor: string): string {
    let tmpUrl: string;
    let chooseColorNumber = 0;

    switch (chooseColor) {
      case 'White':
        chooseColorNumber = 0;
        break;
      case 'Black':
        chooseColorNumber = 1;
        break;
    }

    this.lobbyController.initLobby(lobbyName, playerName, chooseColorNumber)
    .toPromise()
    .then(
      (url) => {
        tmpUrl = url;
      }
    );
    return tmpUrl;
  }
}
