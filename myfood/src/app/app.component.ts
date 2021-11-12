import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public bid;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        console.log('Got the B ID ', params['bid']);
        this.bid =  params['bid'];
        if(this.bid){
          environment.businessId = this.bid;
        }
      }
    )
  }





}

