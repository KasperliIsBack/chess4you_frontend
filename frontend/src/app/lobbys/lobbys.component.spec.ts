/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LobbysComponent } from './lobbys.component';

describe('LobbysComponent', () => {
  let component: LobbysComponent;
  let fixture: ComponentFixture<LobbysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
