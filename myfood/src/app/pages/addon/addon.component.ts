import {
  Component,
  OnInit,
  TemplateRef,
  HostListener,
  Inject,
} from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './addon.component.html'
})
export class DialogElementsExampleDialog {
  public option = [];

  constructor(
    public dialogRef: MatDialogRef<DialogElementsExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {cartItem: any}
    ) { }
  ngOnInit(): void {
    console.log("from card ", this.data);
  }

  isChecked(data, options){
    let val = options.some(element => {
      element.suboptions[0].id == data.id
    });
    return val;
  }

  onClickAdd(): void {
    let data = {
      action: 'add',
      optionObject: this.option
    }
    console.log("from card ", this.data);
    this.dialogRef.close(data);
  }

  changeEventInRadioButton(val) {
    console.log(val);
    let suboptions = [
      {
        "id": val.id,
        "name": val.name,
        "price": val.price,
        "position": "whole",
        "quantity": 1
      }
    ];
    let data = {
        "id": val.extra_option_id,
        "suboptions": suboptions
        };

    let obj = this.option.some(obj => obj.id == data.id);
    if(obj){
      let objIndex = this.option.findIndex((obj => obj.id == data.id));
      this.option[objIndex].suboptions = suboptions;
    }else{
      this.option.push(data);
    }
    console.log("Option Value ", this.option);

  }

}
