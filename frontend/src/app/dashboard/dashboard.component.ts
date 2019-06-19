import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';
import { LobbyHandlerService } from '../service/lobby-handler.service';
import { Lobby } from '../data/lobby';
import { ConnectionData } from '../data/connection-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  formGroupJoin: FormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ])
  });

  formGroupCreate: FormGroup = new FormGroup({
    lobbyName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    chooseColor: new FormControl('Black', [
      Validators.required,
    ])
  });

  searchBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  createBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  hasJoinError = false;
  hasCreateError = false;
  listLobby: Lobby[] = [];

  constructor(private lobbyHandler: LobbyHandlerService) { }

  ngOnInit() {
  }

  openSearchGame(): void {
    this.searchBtnState = ClrLoadingState.LOADING;
    this.searchGame().then(
      (lobby) => {
        this.joinGame(lobby);
      }
    );
  }

  openCreateGame(): void {
    this.createBtnState = ClrLoadingState.LOADING;
    const lobby = this.createGame();
  }

  createGame(): void {
    const connectionData: ConnectionData = this.lobbyHandler.initLobby(this.formGroupCreate.get('lobbyName').value,
    this.formGroupJoin.get('userName').value,
    this.formGroupCreate.get('chooseColor').value);
    console.log(connectionData);

    if (connectionData != null) {
      this.createBtnState = ClrLoadingState.SUCCESS;
      const url: string = '/game' + connectionData.lobbyUuid + '/' + connectionData.playerUuid;
      window.open(url, '_self');
    } else {
      this.hasCreateError = true;
      this.createBtnState = ClrLoadingState.ERROR;
    }
  }

  async joinGame(lobby: Lobby) {
    if (lobby != null) {
        let connectionData: ConnectionData;
        await this.lobbyHandler.joinLobby(lobby.lobbyUuid, this.formGroupJoin.get('userName').value)
        .then(
          (data) => {
            connectionData = data;
          }
        );
        console.log(connectionData);
        this.searchBtnState = ClrLoadingState.DEFAULT;
        const url: string = '/game' + connectionData.lobbyUuid + '/' + connectionData.playerUuid;
        window.open(url, '_self');
    } else {
      this.hasJoinError = true;
      this.searchBtnState = ClrLoadingState.ERROR;
    }
  }

  async searchGame(): Promise<Lobby> {
    await this.lobbyHandler.getListLobby()
    .then((list) => {
      this.listLobby = list;
    });
    console.log(this.listLobby);
    for (const lobby of this.listLobby) {
      if (!lobby.playerTwo) {
        console.log(lobby);
        return lobby;
      }
    }
    return null;
  }

  toggleJoinError(): void {
    this.hasJoinError = false;
    this.searchBtnState = ClrLoadingState.DEFAULT;
    this.formGroupJoin.reset();
  }

  toggleCreateError(): void {
    this.hasCreateError = false;
    this.createBtnState = ClrLoadingState.DEFAULT;
    this.formGroupCreate.reset();
  }

}
