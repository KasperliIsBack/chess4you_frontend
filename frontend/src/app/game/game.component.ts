import { Component, OnInit } from '@angular/core';
import { GamehandlerService } from '../service/game/gamehandler.service';
import { Movement } from '../data/board/movement';
import { Position } from '../data/board/position';
import { ConnectionData } from '../data/game/connection-data';
import { Board } from '../data/board/board';
import { Observable } from 'rxjs';
import { GameData } from '../data/game/game-data';
import { Field } from '../data/board/field';
import { Color } from '../data/enum/color.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  constructor(public gameHandler: GamehandlerService, private router: Router) {}

    gameData: Observable<GameData>;
    chessBoard: Observable<Board>;
    interval: number;
    tmpChessBoard: Board;
    tmpGameData: GameData;
    cnData: ConnectionData;
    messageList: string[] = [];
    movementList: Movement[] = [];
    isRevert = false;
    isStepOneDone = false;
    isFirstCall = true;
    isGameDataLoaded = false;
    isChessBoardLoaded = false;

    async ngOnInit() {
      await this.initGame();
      if (!this.cnData) {
        this.router.navigate(['/dashboard']);
      }
      // init observable
      this.interval = 5000;
      this.initGameDataObs(this.cnData);
      await this.setIsRevert();
      this.initChessBoardObs(this.cnData);
    }

    async initGame(): Promise<void> {
      // get data from dashboard
      this.cnData = history.state.data;
      if (!this.cnData) {
        const rawCnData = localStorage.getItem('cnData');
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
      this.logData('Get ConnectionData', 'initGame()', this.cnData);
    }

    initGameDataObs(cnData: ConnectionData): void {
      this.gameData = new Observable(observer => {
        setInterval(() => {
            this.gameHandler.getInfo(cnData)
            .then((data) => {
              observer.next(data);
              if ((this.isFirstCall) || ((!this.tmpGameData.turnDate) || (this.tmpGameData.turnDate !== data.turnDate))) {
                this.tmpGameData = data;
                // this.logData('Get GameData', 'gameData Observable', this.tmpGameData);
                this.isFirstCall = false;
                this.isGameDataLoaded = true;
              }
            });
          }, this.interval);
      });
    }

    initChessBoardObs(cnData: ConnectionData): void {
      this.chessBoard = new Observable(observer => {
          setInterval(() => {
              this.gameHandler.getBoard(cnData)
              .then((data) => {
                const board = new Board(data);
                this.tmpChessBoard = board;
                observer.next(board);
                // this.logData('Get ChessBoard', 'chessBoard Observable', this.tmpChessBoard);
                this.isChessBoardLoaded = true;
              });
            }, 1000);
        });
    }

    async movePiece(event: Event, field: Field) {
      const tmpGameData = this.tmpGameData;
      const tmpCnData = this.cnData;

      if (this.isPlayersTurn(tmpGameData, tmpCnData)) {
        // if the player choose a new possible movement
        if (this.isStepOneDone &&  this.isSelectionAPiece(field) && this.isPieceOfThePlayer(tmpGameData, field)) {
          // this.resetBackgroundColor(this.movementList);
          this.isStepOneDone = false;
        }

        // if the player want to move the piece to a possible movement
        if (this.isStepOneDone) {
          const rawPos = (event.target as Element).id;
          if (this.isPositionInMovementList(this.movementList, rawPos)) {
            const movement = this.getMovement(this.movementList, rawPos);
            await this.gameHandler.doTurn(this.cnData, movement)
            .then((data) => {
              this.tmpChessBoard = new Board(data);
            });
            this.movementList = [];
          } else {

            this.setInfoMessageForXTick('Diese Position ist nicht valid!', 3000);
          }
        } else { // if the player want show possible movement for a new piece
          if (this.isSelectionAPiece(field)) {
            if (this.isPieceOfThePlayer(tmpGameData, field)) {
              // get position from field
              const rawPos = (event.target as Element).id;
              this.movementList = [];
              this.movementList = await this.getMovementList(rawPos);
              this.logData('Get MovementList', 'movePiece', this.movementList);
              this.isStepOneDone = true;
            } else {

              this.setInfoMessageForXTick('Wählen Sie ihre Figuren aus!', 3000);
            }
          } else {

            this.setInfoMessageForXTick('Bitte wählen Sie eine Spielfigur aus!', 3000);
          }
        }
      } else {

        this.setInfoMessageForXTick('Sie sind nicht an der Reihe!', 3000);
      }
    }

    // Validation operations

    isPlayersTurn(gameData: GameData, cnData: ConnectionData): boolean {
      return gameData.currentPlayer.playerUuid === cnData.playerUuid ? true : false;
    }

    isSelectionAPiece(field: Field): boolean {
      return field.isActive ? true : false;
    }

    isPieceOfThePlayer(gameData: GameData, field: Field): boolean {
      let color: Color;
      if (gameData.currentPlayer.playerUuid === gameData.firstPlayer.playerUuid) {
        color = gameData.colorFirstPlayer;
      } else {
        color = gameData.colorSecondPlayer;
      }
      return color === field.piece.color ? true : false;
    }

    isPositionInMovementList(movementList: Movement[], rawPos: string): boolean {
      // get position
      const curPos = this.getPosFromString(rawPos);
      let inList = false;
      movementList.forEach((movement) => {
        if (this.arePositionsEqual(movement.newPosition, curPos)) {
          inList = true;
        }
      });
      return inList;
    }

    arePositionsEqual(firstPos: Position, secondPos: Position): boolean{
      return firstPos.PosX === secondPos.PosX && firstPos.PosY === secondPos.PosY ? true : false;
    }

    // Data operations

    getMovement(movementList: Movement[], rawPos: string): Movement {
      // get position
      const curPos = this.getPosFromString(rawPos);
      let tmpMovement: Movement;
      movementList.forEach((movement) => {
        if (this.arePositionsEqual(movement.newPosition, curPos)) {
          tmpMovement = movement;
        }
      });
      return tmpMovement;
    }

    async getMovementList(rawPos: string): Promise<Movement[]> {
      // get position
      const curPos = this.getPosFromString(rawPos);
      let tmpMovementList: Movement[] = [];

      // get possible turns
      await this.gameHandler.getTurn(this.cnData, curPos)
      .then(
        data => {
          tmpMovementList = data;
      });

      return tmpMovementList;
    }

    getPosFromString(rawPos: string): Position {
      const posX: number = Number.parseInt(rawPos.substring(0, 1), 10);
      const posY: number = Number.parseInt(rawPos.substring(2, 3), 10);
      return new Position(posX, posY);
    }

    async setIsRevert() {
      await this.gameHandler.getInfo(this.cnData)
      .then(
        (data) => {
          this.tmpGameData = data;
        }
      );
      this.logData('Get GameData', 'setIsRevert()', this.tmpGameData);

      let color: Color;
      if (this.tmpGameData.firstPlayer.playerUuid === this.cnData.playerUuid) {
        color = this.tmpGameData.colorFirstPlayer;
      } else {
        color = this.tmpGameData.colorSecondPlayer;
      }
      this.isRevert = color.toString() === 'White' ? true : false;
      this.logData('Get isRevert value', 'setIsRevert()', this.isRevert);
    }

    logData(message: string, methodName: string, data: any): void {
      console.log(message + ' in ' + methodName);
      console.log(data);
    }

    // Image operations

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

    setImgId(PosX: number, PosY: number): string {
      if (this.isRevert) {
        return PosX  + ',' + PosY;
      } else {
        return (7 - PosX)  + ',' + (7 - PosY);
      }
    }

// tslint:disable-next-line: max-line-length
    setBackground(IsRowDark: boolean, IsFieldDark: boolean, IsRowLight: boolean, IsFieldLight: boolean, posX: number, posY: number): string {
      if (this.movementList.length > 0) {
        const movementList: Movement[] = this.movementList;
        if (!this.isRevert) {
          for (const movement of movementList) {
            if ((7 - movement.newPosition.PosX) === posX && (7 - movement.newPosition.PosY) === posY) {
  // tslint:disable-next-line: max-line-length
              return (IsRowDark && IsFieldDark) || (IsRowLight && IsFieldLight) ? 'has-background-success-light' : 'has-background-success-dark';
            }
          }
        } else {
          for (const movement of movementList) {
            if (movement.newPosition.PosX === posX && movement.newPosition.PosY === posY) {
  // tslint:disable-next-line: max-line-length
              return (IsRowDark && IsFieldDark) || (IsRowLight && IsFieldLight) ? 'has-background-success-light' : 'has-background-success-dark';
            }
          }
        }
      }
      return (IsRowDark && IsFieldDark) || (IsRowLight && IsFieldLight) ? 'has-background-light' : 'has-background-dark';
    }

    // Message operations

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
