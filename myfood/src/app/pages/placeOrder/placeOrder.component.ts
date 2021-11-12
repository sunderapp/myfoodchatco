import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: 'app-placeOrder',
  templateUrl: './placeOrder.component.html',
  styleUrls: ['./placeOrder.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  subtotal = 0;
  service_fee = 0;
  estimatedTax = 0;
  total = 0;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {order: any}
  ) {}

  ngOnInit() {
    console.log("from popup ", this.data.order);

    this.totalCalc();
  }

  totalCalc(){
    this.subtotal = 0;
    this.total = 0;
    this.data.order.result.products.forEach((item)=>{
      let addOn = 0;
      if(item.options){
        item.options.forEach((item)=>{
          addOn += item.suboptions[0].price;
        });
      }
      this.subtotal += (item.quantity * addOn)  + (item.quantity * item.price) ;
    });
    this.service_fee = this.percentage(this.subtotal, this.data.order.result.service_fee );;
    this.estimatedTax = this.percentage(this.subtotal + this.service_fee, this.data.order.result.tax );
    this.total = this.estimatedTax + this.service_fee + this.subtotal;
  }

  percentage(num, per)
  {
    return (num/100)*per;
  }


}
