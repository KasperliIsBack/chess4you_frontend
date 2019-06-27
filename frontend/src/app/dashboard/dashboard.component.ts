import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';
import { LobbyHandlerService } from '../service/lobby/lobby-handler.service';
import { Lobby } from '../data/lobby/lobby';
import { ConnectionData } from '../data/game/connection-data';
import { Router, NavigationExtras } from '@angular/router';

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

  constructor(private lobbyHandler: LobbyHandlerService, private router: Router) { }

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

  async createGame(): Promise<void> {
    let cnData: ConnectionData;
    const lobbyName = this.formGroupCreate.get('lobbyName').value;
    const userName = this.formGroupCreate.get('userName').value;
    const chooseColor = this.formGroupCreate.get('chooseColor').value;
    await this.lobbyHandler.initLobby(lobbyName, userName, chooseColor)
    .then(
      (data) => {
        cnData = data;
      }
    );
    console.log(cnData);

    if (this.isConnectionDataValid(cnData)) {
      this.createBtnState = ClrLoadingState.SUCCESS;

      this.router.navigate(['/game'],
      { state:
        { data: {
          gameUuid: cnData.gameUuid,
          gameDataUuid: cnData.gameDataUuid,
          playerUuid: cnData.playerUuid }
        }
      });
    } else {
      this.hasCreateError = true;
      this.createBtnState = ClrLoadingState.ERROR;
    }
  }

  async joinGame(lobby: Lobby): Promise<void> {
    if (lobby) {
        let cnData: ConnectionData;
        await this.lobbyHandler.joinLobby(lobby.lobbyUuid, this.formGroupJoin.get('userName').value)
        .then(
          (data) => {
            cnData = data;
          }
        );
        console.log(cnData);

        if (this.isConnectionDataValid(cnData)) {
          this.searchBtnState = ClrLoadingState.DEFAULT;
          this.router.navigate(['/game'],
          { state:
            { data: {
              gameUuid: cnData.gameUuid,
              gameDataUuid: cnData.gameDataUuid,
              playerUuid: cnData.playerUuid }
            }
          });
        } else {
          this.hasJoinError = true;
          this.searchBtnState = ClrLoadingState.ERROR;
        }
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

  isConnectionDataValid(cnData: ConnectionData): boolean {
    if (cnData.gameUuid || 0 === cnData.gameUuid.length) {
      if (cnData.gameDataUuid || 0 === cnData.gameDataUuid.length) {
        if (cnData.playerUuid || 0 === cnData.playerUuid.length) {
          return true;
        }
      }
    }
    return false;
  }
}
