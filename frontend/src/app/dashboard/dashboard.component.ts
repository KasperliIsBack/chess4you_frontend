import { Component, OnInit } from '@angular/core';
import { LobbycontrollerService } from '../service/lobbycontroller.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';
import { LobbyHandlerService } from '../service/lobby-handler.service';
import { Lobby } from '../data/lobby';
import { Url } from 'url';

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
    choosenColor: new FormControl('Black', [
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
    const lobby = this.searchGame();
    this.joinGame(lobby);
  }

  openCreateGame(): void {
    this.createBtnState = ClrLoadingState.LOADING;
    const lobby = this.createGame();
  }

  createGame(): void {
    const url: Url = this.lobbyHandler.initLobby(this.formGroupCreate.get('lobbyName').value,
    this.formGroupJoin.get('userName').value,
    this.formGroupCreate.get('choosenColor').value);
    console.log(url.href);

    if (url.href !== 'undefined') {
      this.createBtnState = ClrLoadingState.SUCCESS;
      window.open(url.href, '_self');
    } else {
      this.hasCreateError = true;
      this.createBtnState = ClrLoadingState.ERROR;
    }
  }

  joinGame(lobby: Lobby): void {
    if (lobby != null) {
        const url: Url = this.lobbyHandler.joinLobby(lobby.lobbyUuid, this.formGroupJoin.get('userName').value);
        console.log(url);
        this.searchBtnState = ClrLoadingState.DEFAULT;
        window.open(url.href, '_self');
    } else {
      this.hasJoinError = true;
      this.searchBtnState = ClrLoadingState.ERROR;
    }
  }

  searchGame(): Lobby {
    this.listLobby = this.lobbyHandler.getListLobby();
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
