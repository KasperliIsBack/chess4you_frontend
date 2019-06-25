import { Injectable } from '@angular/core';
import { LobbycontrollerService } from './lobbycontroller.service';
import { Lobby } from '../data/lobby';
import { ConnectionData } from '../data/connection-data';

@Injectable({
  providedIn: 'root'
})
export class LobbyHandlerService {

  constructor(private lobbyController: LobbycontrollerService) { }

  async getListLobby(): Lobby[] {
    let tmpListLobby: Lobby[];

    await this.lobbyController.getListLobby()
    .toPromise()
    .then(
      (list) => {
        tmpListLobby = list;
      }
    );
    return tmpListLobby;
  }

  joinLobby(lobbyUuid: string, playerName: string): ConnectionData {
    let connectionData: ConnectionData;

    this.lobbyController.joinLobby(lobbyUuid, playerName)
    .toPromise()
    .then(
      (tmpConnectionData) => {
        connectionData = tmpConnectionData;
      }
    );
    return connectionData;
  }

  initLobby(lobbyName: string, playerName: string, chooseColor: string): ConnectionData {
    let connectionData: ConnectionData;
    let chooseColorNumber = '0';

    switch (chooseColor) {
      case 'White':
        chooseColorNumber = '0';
        break;
      case 'Black':
        chooseColorNumber = '1';
        break;
    }

    this.lobbyController.initLobby(lobbyName, playerName, chooseColorNumber)
    .toPromise()
    .then(
      (tmpConnectionData) => {
        connectionData = tmpConnectionData;
      }
    );
    return connectionData;
  }
}
