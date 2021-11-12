import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input('itemObj') itemObj;
  @Input('showLoader') showLoader = false;
  @Output() plus_e = new EventEmitter();
  @Output() minus_e = new EventEmitter();
  @Output() new_e = new EventEmitter();
  isOnlyEmployee = false;

  constructor() {}

  ngOnInit() {}

  addClickEvent() {
    console.log("itemObj card", this.itemObj);

    this.new_e.emit(this.itemObj);
  }
  minus() {
    this.minus_e.emit(this.itemObj);
  }
  plus() {
    this.plus_e.emit(this.itemObj);
  }
}
