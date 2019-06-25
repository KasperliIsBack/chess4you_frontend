import { Injectable } from '@angular/core';
import { LobbycontrollerService } from '../lobby/lobbycontroller.service';
import { Lobby } from '../../data/lobby/lobby';
import { Observable } from 'rxjs';
import { ConnectionData } from 'src/app/data/game/connection-data';

@Injectable({
  providedIn: 'root'
})
export class LobbyHandlerService {

  constructor(private lobbyController: LobbycontrollerService) { }

  async getListLobby(): Promise<Lobby[]> {
    let tmpListLobby: Lobby[];

    await this.lobbyController.getListLobby()
    .toPromise()
    .then((list) => {
      tmpListLobby = list;
    });
    return tmpListLobby;
  }

  async joinLobby(lobbyUuid: string, playerName: string): Promise<ConnectionData> {
    return await this.lobbyController.joinLobby(lobbyUuid, playerName);
  }

  async initLobby(lobbyName: string, playerName: string, chooseColor: string): Promise<ConnectionData> {
    let chooseColorNumber = 0;

    switch (chooseColor) {
      case 'White':
        chooseColorNumber = 0;
        break;
      case 'Black':
        chooseColorNumber = 1;
        break;
    }
    return await this.lobbyController.initLobby(lobbyName, playerName, chooseColorNumber);
  }
}
