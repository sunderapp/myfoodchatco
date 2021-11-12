import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-sup-card',
  templateUrl: './sup-card.component.html',
  styleUrls: ['./sup-card.component.scss'],
})
export class SupCardComponent implements OnInit {
  @Input('itemObj') itemObj;
  @Input('showLoader') showLoader = false;
  @Output() plus_e = new EventEmitter();
  @Output() minus_e = new EventEmitter();
  @Output() new_e = new EventEmitter();
  @Output() editAddOn_e = new EventEmitter();
  isOnlyEmployee = false;

  constructor(
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {}

  addClickEvent() {
    this.new_e.emit(this.itemObj);
  }
  minus() {
    this.minus_e.emit(this.itemObj);
  }
  plus() {
    this.plus_e.emit(this.itemObj);
  }
  editAddOn(){
    this.editAddOn_e.emit(this.itemObj);
  }

  calcTotalprice(item){
    let addOn = 0;
    if(item.option){
      item.options.forEach((item)=>{
        addOn += item.suboptions[0].price;
      });
    }
     return this.currencyPipe.transform((item.quantity * addOn)  + (item.quantity * item.price),'USD');
  }

}
