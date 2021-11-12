import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { ToastComponent } from '../../component/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private pageTitle;
  private currentUser = new BehaviorSubject(null);
  private _isLoading = new BehaviorSubject(false);
  private currentRoles = new BehaviorSubject(null);
  private _dialogAction = new Subject();

  // , private toastr: ToastrService,
  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get isLoading() {
    return this._isLoading.asObservable();
  }

  setLoading(status) {
    this._isLoading.next(status);
  }

  //dialog action

  get dialogAction() {
    return this._dialogAction.asObservable();
  }

  setDialog(status) {
    this._dialogAction.next(status);
  }

  toasterBar(msg, action) {
    this.snackbar.openFromComponent(ToastComponent, {
      duration: 3000,
      data: { message: msg, action: action },
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

}
