import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpParamsOptions, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(public http: HttpClient) {}

  getAllData(): Observable<Response> {
    return this.http.get<any>(environment.apiUrl + '/categories').pipe(
      map((data) => {
        return data;
      })
    );
  }

  // https://apiv4.ordering.co/v400/en/myfoodv4/orders
  createOrder( parameters: any ): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/orders', parameters )
    .pipe(map(
      data => {
        return data;
      }
    ));
  }



  // https://apiv4.ordering.co/v400/en/myfoodv4/business/51
  getBusiness(): Observable<Response> {
  return this.http.get<any>(environment.apiUrl + '/business/'+ environment.businessId +'?type=1').pipe(
      map((data) => {
        return data;
      })
    );
  }

  // https://apiv4.ordering.co/v400/en/demo/business/41/categories/252/products
  getADataById(id: number): Observable<Response> {
    return this.http
      .get<any>(environment.apiUrl + '/categories/' + id + '/products')
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

}
