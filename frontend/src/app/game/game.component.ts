import { Component, OnInit } from '@angular/core';
import { GamehandlerService } from '../service/game/gamehandler.service';
import { Movement } from '../data/board/movement';
import { Position } from '../data/board/position';
import { ConnectionData } from '../data/game/connection-data';
import { Board } from '../data/board/board';
import { Observable } from 'rxjs';
import { GameData } from '../data/game/game-data';
import { Field } from '../data/board/field';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  constructor(public gameHandler: GamehandlerService) {}

    gameData: Observable<GameData>;
    chessBoardObs: Observable<Board>;
    interval: number;
    chessBoard: Board;
    cnData: ConnectionData;
    messageList: string[] = [];
    movementList: Movement[] = [];
    movement: Movement = new Movement();
    isReverse = false;
    curPos: string;
    newPos: string;

    async ngOnInit() {
      await this.initGame();
      // init observable
      this.interval = 10000;
      this.initGameData(this.cnData);
      this.initBoard(this.cnData);
    }

    async initGame(): Promise<void> {
      // get data from dashboard
      this.cnData = history.state.data;
      if (!this.cnData) {
        const rawCnData = localStorage.getItem('cnData');
        console.log(rawCnData);

        this.cnData = JSON.parse(rawCnData);
      } else {
        localStorage.setItem('cnData', JSON.stringify(this.cnData));
        this.cnData = history.state.data;
        // connect to gameserver
        await this.gameHandler.connect(this.cnData)
        .then(
          (data) => {
            // tslint:disable-next-line: no-console
            console.info(data);
            this.setInfoMessageForXTick(data, 3000);
          }
        );
      }
      console.log(this.cnData);
    }

    initGameData(cnData: ConnectionData): void {
      this.gameData = new Observable(observer => {
        setInterval(() => {
            this.gameHandler.getInfo(cnData)
            .then((data) => {
              observer.next(data);
              // console.log(gameData);
            });
          }, this.interval);
      });
    }

    initBoard(cnData: ConnectionData): void {
      this.chessBoardObs = new Observable(observer => {
          setInterval(() => {
              this.gameHandler.getBoard(cnData)
              .then((data) => {
                observer.next(new Board(data));
                console.log(new Board(data));
              });
            }, this.interval);
        });
    }

    setImgId(x: number, y: number) {
      if (this.isReverse) {
        return (7 - y) + ',' + (7 - x);
      }
      return y + ',' + x;
    }

    getImgSrc(field: Field): string {
      return !field.piece ? '../assets/chess_board_pieces/transparent.png'
      : '../assets/chess_board_pieces/'
      + field.piece.pieceName.slice(field.piece.pieceName.lastIndexOf('.') + 1, field.piece.pieceName.length) + '.svg';
    }

    setImgSrc(field: any, currPiece: any): string {
      if (!currPiece) {
        return '../assets/chess_board_pieces/' + field.piece.name + '.svg';
      } else {
        return '../assets/chess_board_pieces/transparent.png';
      }
    }

    async movePiece(event: Event, field: any) {
      if (!field.piece) {

        this.setInfoMessageForXTick('Bitte wählen Sie eine Spielfigur aus!', 3000);
      } else if (!this.curPos) {

        await this.showPossiblePosForPiece(event);
      } else if (!this.newPos) {

        await this.moveToPiece(event);
      }
    }

    async moveToPiece(event: Event) {
      const tmpPiece = (event.target as Element);

      if (this.curPos === tmpPiece.id) {

        this.setInfoMessageForXTick('Bitte wählen Sie eine neue Position aus!', 3000);
        console.log('newPos: ' + this.newPos);
      } else if (tmpPiece.classList.contains('has-background-success')) {

        this.newPos = tmpPiece.id;
        this.changeFigure(this.curPos, this.newPos);
        this.resetBackgroundColor(this.movementList);
        console.log('newPos: ' + this.newPos);
      } else {

        this.setInfoMessage('Kein valider Zug!');
      }
    }

    async showPossiblePosForPiece(event: Event) {
      // get id from curPiece
      this.curPos = (event.target as Element).id;
      console.log('currPos: ' + this.curPos);

      // fill the movementList and change the background
      await this.setPossiblePositionsInMovemtList(this.curPos);
      await this.changeBackgroundColor(this.movementList);
    }

    async setPossiblePositionsInMovemtList(curPos: string) {
      // get coordinates
      const curPosY: number = Number.parseInt(curPos.substring(0, 1), 10);
      const curPosX: number = Number.parseInt(curPos.substring(2, 3), 10);

      // get and set possible turns
      await this.gameHandler.getTurn(this.cnData, new Position(curPosY, curPosX))
      .then(
        data => {
          console.log(data);
          this.movementList = data;
      });
    }

    changeFigure(curPos: string, newPos: string) {
      // get all positions
      const curPosY: number = Number.parseInt(curPos.substring(0, 1), 10);
      const curPosX: number = Number.parseInt(curPos.substring(2, 3), 10);
      const newPosY: number = Number.parseInt(newPos.substring(0, 1), 10);
      const newPosX: number = Number.parseInt(newPos.substring(2, 3), 10);

      // get pieces
      const curPiece = this.chessBoard.board[curPosY][curPosX];
      const newPiece = this.chessBoard.board[newPosY][newPosX];

      // set pieces
      this.chessBoard.board[curPosY][curPosX] = newPiece;
      this.chessBoard.board[newPosY][newPosX] = curPiece;
    }

    resetBackgroundColor(movements: Movement[]) {
      movements.forEach( movement => {
        const pieceId = movement.newPosition.PosY + ',' + movement.newPosition.PosX;
        document.getElementById(pieceId).classList.remove('has-background-success');
      });
    }

    changeBackgroundColor(movements: Movement[]) {
      movements.forEach( movement => {
        const pieceId = movement.newPosition.PosY + ',' + movement.newPosition.PosX;
        document.getElementById(pieceId).classList.add('has-background-success');
      });
    }

    setInfoMessageForXTick(message: string, timeout: number) {
      this.messageList.push(message);
      setTimeout(() => {
        this.messageList.pop();
      }, timeout);
    }

    setInfoMessage(message: string): void {
      this.messageList.push(message);
    }

    onInfoMessageClose(message: string): void {
      const index = this.messageList.indexOf(message);
      this.messageList.splice(index, 1);
    }
}
