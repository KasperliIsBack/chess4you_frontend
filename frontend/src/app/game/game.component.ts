import { Component, OnInit } from '@angular/core';

import { Field } from '../data/board/field';
import { GamehandlerService } from '../service/game/gamehandler.service';
import { Movement } from '../data/board/movement';
import { Player } from '../data/player/player';
import { Position } from '../data/board/position';
import { GamecontrollerService } from '../service/game/gamecontroller.service';
import { ConnectionData } from '../data/game/connection-data';

const urlGameServer = 'https://172.16.1.198:8081';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  board: Field[][] = [];

  constructor(
    private gameHandler: GamehandlerService,
    private gameController: GamecontrollerService,
    ) {}

    cnData: ConnectionData;
    chessBoard: ChessBoard;
    movement: Movement = new Movement();
    reverse = false;
    currPos: string;
    newPos: string;
    movements: Movement[] = [];
    info: Info;

    async ngOnInit() {
      this.cnData = history.state.data;
      console.log(history.state.data);
      await this.gameController.connect(urlGameServer, this.cnData.lobbyUuid, this.cnData.playerUuid);
    }

    setCoordinate(x: number, y: number) {
      if (this.reverse) {
        return (7 - y) + ',' + (7 - x);
      }
      return y + ',' + x;
    }

    getImg(field: any, currPiece: any): string {
      return !field.piece ? '../assets/chess_board_pieces/transparent.png' : '../assets/chess_board_pieces/' + field.piece.name + '.svg';
    }

    setImg(field: any, currPiece: any): string {
      if (!currPiece) {
        return '../assets/chess_board_pieces/' + field.piece.name + '.svg';
      } else {
        return '../assets/chess_board_pieces/transparent.png';
      }
    }

    moveFigure(event: Event, field: any) {
      if (!field.piece) {
        alert('Bitte wählen Sie eine Figur aus.');
      } else if (!this.currPos) {
        this.currPos = (event.target as Element).id;
        this.getPossiblePositions(this.currPos);
        this.changeBackgroundColor(this.movements);
        console.log('currPos: ' + this.currPos);
      } else if (!this.newPos) {
        let tmpElement = (event.target as Element);
        if (this.currPos === tmpElement.id) {
          alert ('Bitte wählen Sie eine neue Position aus.');
          console.log('newPos: ' + this.newPos);
        } else if (tmpElement.classList.contains('has-background-success')) {
          this.newPos = tmpElement.id;
          console.log('newPos: ' + this.newPos);
          this.changeFigure(this.currPos, this.newPos);
          this.resetBackgroundColor(this.movements);
        } else {
          let error = 'Kein valider Zug!';
        }
      }
    }

    async getPossiblePositions(currPos: string) {
  // tslint:disable-next-line: radix
      const currY: number = Number.parseInt(currPos.substring(0, 1));
  // tslint:disable-next-line: radix
      const currX: number = Number.parseInt(currPos.substring(2, 3));
      this.movements = new Array();
      await this.gameHandler.getTurn(urlGameServer, this.cnData.lobbyUuid, this.cnData.playerUuid, new Position(currY, currX))
      .toPromise()
      .then(
        data => {
          console.log(data);
          this.movements = data;
        });
        console.log(this.movements);
    }

    changeFigure(curPos: string, newPos: string) {
      // get all positions
      const curPosY: number = Number.parseInt(curPos.substring(0, 1), 10);
      const curPosX: number = Number.parseInt(curPos.substring(2, 3), 10);
      const newPosY: number = Number.parseInt(newPos.substring(0, 1), 10);
      const newPosX: number = Number.parseInt(newPos.substring(2, 3), 10);

      // get pieces
      const curPiece = this.chessBoard.ChessBoard[curPosY][curPosX];
      const newPiece = this.chessBoard.ChessBoard[newPosY][newPosX];

      // set pieces
      this.chessBoard.ChessBoard[curPosY][curPosX] = newPiece;
      this.chessBoard.ChessBoard[newPosY][newPosX] = curPiece;
    }

    resetBackgroundColor(movements: Movement[]) {
      movements.forEach( movement => {
        document.getElementById(movement.newPosition.PosY + ',' + movement.newPosition.PosX).classList.remove('has-background-success');
      });
    }

    changeBackgroundColor(movements: Movement[]) {
      movements.forEach( movement => {
        document.getElementById(movement.newPosition.PosY + ',' + movement.newPosition.PosX).classList.add('has-background-success');
      });
    }
}

export class ChessBoard {
  ChessBoard: [];
}

export class Info {
  currentPlayer: Player;
  timestamp: Date;
}
