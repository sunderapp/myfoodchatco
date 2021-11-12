import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
} from '@angular/core';

import { ApiService } from '../../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog } from '@angular/material/dialog';
import { DialogElementsExampleDialog } from '../addon/addon.component';
import { PlaceOrderComponent } from '../placeOrder/placeOrder.component';
import { GlobalService } from '../../../app/_core/global/global.service';
import { StripeCardNumberComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public categories: any;
  public foodsList: any;
  public currentSection = 'section248';
  public cartItem = [];
  public loaderData = [1,2,33,4,5,6,7];
  public businessData: any;
  public showPayment = false;
  public searchedKeyword: string;
  public contentLoaded = false;
  public subtotal = 0;
  public estimatedTax = 0;
  public total = 0;
  public service_fee = 0;
  registerForm: FormGroup;
  submitted = false;

  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        color: '#31325F',
        fontWeight: '300',
        fontSize: '18px',
        padding: '5px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee'
      }
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  stripeTest: FormGroup;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      tableNo: ['', Validators.required],
      name: [''],
      phoneNo: ['', Validators.required],
      paymentType: ["1", Validators.required],
      card_number: [''],
      exp_month: [''],
      exp_year: [''],
      cvc: [''],
    });
    this.getBusiness();
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      document.getElementById('header').classList.add('fixed');
    } else {
      document.getElementById('header').classList.remove('fixed');
    }
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      document.getElementById('header1').classList.add('fixed');
    } else {
      document.getElementById('header1').classList.remove('fixed');
    }
  }


  get f() { return this.registerForm.controls; }

  actionShowPayment(){
    this.showPayment = true;
  }

  onChange({ type, event }) {
    if (type === 'change') {
      // this.stripeCardValid = event.complete;
    }
  }


  getCardToken(){
    (<any>window).Stripe.card.createToken({
      number: this.registerForm.value.card_number,
      exp_month: this.registerForm.value.exp_month,
      exp_year: this.registerForm.value.exp_year,
      cvc: this.registerForm.value.cvc,
      // number: '4242424242424242',
      // exp_month: '09',
      // exp_year: '23',
      // cvc: '324',
    },(status:number, response:any)=>{
      console.log("response ", response);
      if(response.id){
        this.onSubmit(response.id);
      }else{
        this.globalService.toasterBar(response.error.message , 'Dance');
      }
    })
  }

  onSubmitForm(){
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    if(this.registerForm.value.paymentType == 28){
      this.getCardToken();
    }else{
      this.onSubmit();
    }
  }

  onSubmit(stripeToken?) {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

    this.cartItem.forEach(function(e){
      delete e.name;
      delete e.option;
      delete e.price;
      delete e.category_id;
    });
    let dataObject = {
      // paymethod_id -> cash - 1 , stripe - 28
        paymethod_id: parseInt(this.registerForm.value.paymentType),
        business_id: 51,
        pay_data: stripeToken ? stripeToken : '',
        delivery_type: "3",
        driver_tip: 0,
        delivery_zone_id: 5,
        location: {lat:1.393082,lng:103.910813},
        discount_new: 0,
        delivery_type_custom: 1,
        customer:JSON.stringify({
          "id":-1,
          "name":this.registerForm.value.name,
          "lastname":'',
          "email":'souby.g@gmail.com',
          "cellphone":this.registerForm.value.phoneNo,
          "address":'Singapore 820132',
          "location":JSON.stringify({lat:1.393082,lng:103.910813}),
          "internal_number":1822,
          "zipcode":'',
          "tag":'other'
        }),
        products : JSON.stringify(this.cartItem)
    };
    this.apiService.createOrder(dataObject).subscribe(
      data =>{
          console.log(data);
          if(data.error == false){
            console.log("from card ", data);
            this.globalService.toasterBar('Order placed successfully order number #'+ data.result?.id, 'Success');
            this.openDialogPlaceOrder(data);
            this.onReset();
          }
      });
  }

  openDialogPlaceOrder(data) {
    this.dialog.open(PlaceOrderComponent, { data: { order: data } ,  width: '800px',});
  }

  onReset() {
      this.submitted = false;
      this.registerForm.reset();
      this.cartItem = [];
      this.getBusiness();
      this.dialog.closeAll();
  }


  setValidationForCard(){

    if(this.registerForm.value.paymentType == 28){
      this.registerForm.controls['card_number'].setErrors({ message: 'Required' });
      this.registerForm.controls['exp_month'].setErrors({ message: 'Required' });
      this.registerForm.controls['exp_year'].setErrors({ message: 'Required' });
      this.registerForm.controls['cvc'].setErrors({ message: 'Required' });

      this.registerForm.controls['card_number'].setValidators( Validators.required);
      this.registerForm.controls['exp_month'].setValidators( Validators.required);
      this.registerForm.controls['exp_year'].setValidators( Validators.required);
      this.registerForm.controls['cvc'].setValidators( Validators.required);
    }else{
      this.registerForm.controls['card_number'].setErrors(null);
      this.registerForm.controls['exp_month'].setErrors(null);
      this.registerForm.controls['exp_year'].setErrors(null);
      this.registerForm.controls['cvc'].setErrors(null);

      this.registerForm.controls['card_number'].clearValidators();
      this.registerForm.controls['exp_month'].clearValidators();
      this.registerForm.controls['exp_year'].clearValidators();
      this.registerForm.controls['cvc'].clearValidators();
    }

  }

  genID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  openDialogFromCard(itemObj){
    const dialogRef = this.dialog.open(DialogElementsExampleDialog, {
      data: { cartItem: itemObj },
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.action == 'add'){
        this.cartItem.find(data => {
          if(data.extrasId === itemObj.extrasId){
            data["options"] = result.optionObject;
          }
        });
        this.totalCalc();
      }
    });
  }

  openDialog(itemObj) {
    let data = {
      id: itemObj['id'],
      extrasId: itemObj.extras.length > 0 ?  this.genID() : '' ,
      name: itemObj['name'],
      images: itemObj['images'],
      quantity: 1,
      option: itemObj['extras'],
      category_id: itemObj['category_id'],
      price: itemObj['price'],
      ingredients: itemObj['ingredients'],
    };
    const dialogRef = this.dialog.open(DialogElementsExampleDialog, {
      data: { cartItem: data },
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.action == 'add'){
        data["options"] = result.optionObject;
        this.cartItem.push(data);
        this.plus(itemObj, 'dontshow');
      }
      console.log('The dialog was closed');
      console.log(this.cartItem);
    });
  }

  newAdd(itemObj) {
    console.log(itemObj);
    if(itemObj.extras.length > 0 ){
      this.openDialog(itemObj);
      return;
    }
    let data = {
      id: itemObj['id'],
      extrasId: itemObj.extras.length > 0 ?  this.genID() : '' ,
      name: itemObj['name'],
      quantity: itemObj['quantity'],
      options: itemObj['extras'],
      category_id: itemObj['category_id'],
      price: itemObj['price'],
      ingredients: itemObj['ingredients'],
    };
    this.cartItem.push(data);
    this.plus(itemObj);
  }

  plus(itemObj, model?) {
    if(!model && itemObj.extras.length > 0 ){
      this.openDialog(itemObj);
      return;
    }
    this.foodsList.forEach((item) => {
      if (item.id == itemObj.category_id) {
        item.products.forEach((item) => {
          if (item.id == itemObj.id) {
            item.quantity += 1;
          }
        });
      }
    });
    if(itemObj.extras.length > 0){

    }else{
      this.cartItem.forEach((item) => {
        if (item.id == itemObj.id) {
          item.quantity += 1;
        }
      });
    }
    console.log('e ', itemObj);
    console.log('current card ', this.cartItem);
    console.log('main list ', this.foodsList);
    this.totalCalc();
  }

  plusForCart(itemObj, model?) {
    this.foodsList.forEach((item) => {
      if (item.id == itemObj.category_id) {
        item.products.forEach((item) => {
          if (item.id == itemObj.id) {
            item.quantity += 1;
          }
        });
      }
    });
    if(itemObj.options.length > 0){
      this.cartItem.forEach((item) => {
        if (item.extrasId == itemObj.extrasId) {
          item.quantity += 1;
        }
      });
    }else{
      this.cartItem.forEach((item) => {
        if (item.id == itemObj.id) {
          item.quantity += 1;
        }
      });
    }
    this.totalCalc();
  }

  minus(itemObj) {
    this.foodsList.forEach((item) => {
      if (item.id == itemObj.category_id) {
        item.products.forEach((item) => {
          if (item.id == itemObj.id) {
            item.quantity -= 1;
          }
        });
      }
    });
    this.cartItem.forEach((item) => {
      if (item.id == itemObj.id) {
        item.quantity -= 1;
        if (item.quantity == 0) {
          this.removeItems(itemObj);
        }
      }
    });
    console.log('e ', itemObj);
    console.log('current card ', this.cartItem);
    console.log('main list ', this.foodsList);
    this.totalCalc();
  }

  minusForCart(itemObj) {
    this.foodsList.forEach((item) => {
      if (item.id == itemObj.category_id) {
        item.products.forEach((item) => {
          if (item.id == itemObj.id) {
            item.quantity -= 1;
          }
        });
      }
    });
    if(itemObj.options.length > 0){
      this.cartItem.forEach((item) => {
        if (item.extrasId == itemObj.extrasId) {
          item.quantity -= 1;
          if (item.quantity == 0) {
            this.removeItems(itemObj);
          }
        }
      });
    }else{
      this.cartItem.forEach((item) => {
        if (item.id == itemObj.id) {
          item.quantity -= 1;
          if (item.quantity == 0) {
            this.removeItems(itemObj);
          }
        }
      });
    }
    this.totalCalc();
  }

  removeItems(itemObj) {
    const removeIndex = this.cartItem.findIndex(
      (item) => {
        if(itemObj?.options.length > 0){
         return item.extrasId === itemObj.extrasId;
        }else{
          return item.id === itemObj.id;
        }
      }
    );
    this.cartItem.splice(removeIndex, 1);
  }


  totalCalc(){
    this.subtotal = 0;
    this.total = 0;
    this.cartItem.forEach((item)=>{
      let addOn = 0;
      if(item.option){
        item.options.forEach((item)=>{
          addOn += item.suboptions[0].price;
        });
      }
      this.subtotal += (item.quantity * addOn)  + (item.quantity * item.price) ;
    });
    this.service_fee = this.percentage(this.subtotal, this.businessData.service_fee );;
    this.estimatedTax = this.percentage(this.subtotal + this.service_fee, this.businessData.tax );
    this.total = this.estimatedTax + this.service_fee + this.subtotal;
  }

  percentage(num, per)
  {
    return (num/100)*per;
  }


  getBusiness() {
    this.contentLoaded = true;
    this.apiService.getBusiness().subscribe(
      (data: any) => {
        this.businessData = data.result;
        this.foodsList = data.result.categories;
        console.log(data);
        this.getUniqueCategory();
        this.contentLoaded = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getUniqueCategory() {
    this.categories = [];
    var flags = [],
      l = this.foodsList.length,
      i;
    for (i = 0; i < l; i++) {
      if (flags[this.foodsList[i].name]) continue;
      flags[this.foodsList[i].name] = true;
      this.categories.push({
        name: this.foodsList[i].name,
        id: this.foodsList[i].id,
      });
    }
    console.log(this.categories);
  }

  itemCountEvent(e: any) {
    console.log(e);
    // this.utilService.setItemCategories(e);
    // this.utilService.setItemsTrigger([]);
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    console.log(section);
    document.querySelector('#' + section).scrollIntoView();
  }


}


