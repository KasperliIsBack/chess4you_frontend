import { Component, OnInit } from '@angular/core';
import { Field } from '../data/board/field';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  board: Field[][] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

  pieceHasClicked(event: Event, field: Field): void {
    alert("hit");
  }
  setIdOfImg(x: number, y: number): string {
    return "andir";
  }
  getImgSrc(field: Field): string {
    return "test";
  }
}
