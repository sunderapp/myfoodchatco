import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CardComponent } from './component/card/card.component';
import { MainComponent } from './pages/main/main.component';
import { SupCardComponent } from './component/sup-card/sup-card.component';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ScrollSpyDirective } from './scroll-spy.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { DialogElementsExampleDialog } from './pages/addon/addon.component';

import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PlaceOrderComponent } from './pages/placeOrder/placeOrder.component';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import {CurrencyPipe} from '@angular/common';

import { ToastComponent } from './component/toast/toast.component';


@NgModule({
  declarations: [
    AppComponent,
    PlaceOrderComponent,
    CardComponent,
    DialogElementsExampleDialog,
    ScrollSpyDirective,
    MainComponent,
    ToastComponent,
    SupCardComponent,
  ],
  imports: [
    FormsModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    ButtonsModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot(),
    BrowserAnimationsModule,
    NgxStripeModule.forRoot(environment.publishablekey)
  ],
  providers: [
    CurrencyPipe,
    // { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
