import { Component, OnInit } from '@angular/core';
import { GamehandlerService } from '../service/game/gamehandler.service';
import { Movement } from '../data/board/movement';
import { Position } from '../data/board/position';
import { ConnectionData } from '../data/game/connection-data';
import { Board } from '../data/board/board';
import { Observable } from 'rxjs';
import { GameData } from '../data/game/game-data';
import { Field } from '../data/board/field';
import { Piece } from '../data/board/piece';
import { Color } from '../data/enum/color.enum';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  constructor(public gameHandler: GamehandlerService) {}

    gameDataObs: Observable<GameData>;
    chessBoardObs: Observable<Board>;
    interval: number;
    chessBoard: Board;
    gameData: GameData;
    cnData: ConnectionData;
    messageList: string[] = [];
    movementList: Movement[] = [];
    movement: Movement = new Movement();
    curPos: string;
    newPos: string;

    async ngOnInit() {
      await this.initGame();
      // init observable
      this.interval = 5000;
      this.initGameData(this.cnData);
      await this.gameDataObs.toPromise()
      .then(
        (data) => {
          this.gameData = data;
        }
      );
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
      this.gameDataObs = new Observable(observer => {
        setInterval(() => {
            this.gameHandler.getInfo(cnData)
            .then((data) => {
              this.gameData = data;
              observer.next(data);
            });
          }, this.interval);
      });
    }

    initBoard(cnData: ConnectionData): void {
      this.chessBoardObs = new Observable(observer => {
          setInterval(() => {
              this.gameHandler.getBoard(cnData)
              .then((data) => {
                const board = new Board(data);
                if (JSON.stringify(this.chessBoard) !== JSON.stringify(board)) {
                  this.chessBoard = board;
                  observer.next(board);
                  console.log(this.chessBoard);
                }
              });
            }, this.interval);
        });
    }

    setImgId(PosY: number, PosX: number): string {
      if (this.isRevert()) {
        return (7 - PosY)  + ',' + (7 - PosX);
      } else {
        return PosY  + ',' + PosX;
      }
    }

    isRevert(): boolean {
      let color: Color;
      if (this.gameData.firstPlayer.playerUuid === this.cnData.playerUuid) {
        color = this.gameData.colorFirstPlayer;
      } else {
        color = this.gameData.colorSecondPlayer;
      }
      return color === Color.White ? true : false;
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

    async movePiece(event: Event, field: Field) {
      console.log(this.gameData);
      console.log(this.cnData.playerUuid);

      if (this.gameData.currentPlayer.playerUuid === this.cnData.playerUuid) {
        if (!this.curPos && !field.piece) {
          this.setInfoMessageForXTick('Bitte wählen Sie eine Spielfigur aus!', 3000);
        } else if (!(!this.curPos && !field.piece)) {
          if (this.isPieceOfThePlayer(this.gameData, field.piece)) {
            await this.showPossiblePosForPiece(event);
          } else {
            this.setInfoMessageForXTick('Wählen Sie ihre Figuren aus!', 3000);
          }
        } else if (!this.newPos) {

          await this.moveToPiece(event);
        }
      } else {

        this.setInfoMessageForXTick('Sie sind nicht an der Reihe!', 3000);
      }
    }

    isPieceOfThePlayer(gameData: GameData, piece: Piece): boolean {
      let color: Color;
      if (gameData.currentPlayer.playerUuid === gameData.firstPlayer.playerUuid) {
        color = gameData.colorFirstPlayer;
      } else {
        color = gameData.colorSecondPlayer;
      }
      return color === piece.color ? true : false;
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
        const pieceId = movement.newPosition.PosX + ',' + movement.newPosition.PosY;
        document.getElementById(pieceId).classList.remove('has-background-success');
      });
    }

    changeBackgroundColor(movements: Movement[]) {
      movements.forEach( movement => {
        const pieceId = movement.newPosition.PosX + ',' + movement.newPosition.PosY;
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
