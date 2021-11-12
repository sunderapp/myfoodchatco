import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';


const materialModules = [MatIconModule, MatProgressSpinnerModule,MatDialogModule, MatSidenavModule, MatSnackBarModule,];

@NgModule({
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules],
})
export class MaterialModule {}
