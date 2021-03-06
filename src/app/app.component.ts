import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SignonService, StatusTypes, E1Actions } from 'e1-service';
import * as Moment from 'moment';

import { SignonPromptComponent } from './e1/signon-prompt.component';
import { IState, IAppState } from './store/state';
import { AppActions } from './store/actions';

declare var AIS_BASE_URL;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mode: Observable<string>;
  status: Observable<string>;
  username: Observable<string>;
  environment: Observable<string>;
  signout() {
    this.store.dispatch(new AppActions.ResetAction());
    this.store.dispatch(new E1Actions.ResetAction('sign-out'));
  }
  ngOnInit() {
  }
  constructor(
    public http: Http,
    public store: Store<IState>,
    public dlg: MatDialog,
    public signon: SignonService
  ) {
    signon.baseUrl = AIS_BASE_URL;
    this.mode = store.select<string>(s => s.app.mode);
    this.status = store.select<string>(s => s.e1.status);
    this.username = store.select<string>(s => s.e1.authResponse ? s.e1.authResponse.userInfo.alphaName : null);
    this.environment = store.select<string>(s => s.e1.authResponse ? s.e1.authResponse.environment : null);
    this.status
      .subscribe(status => {
        if (status.localeCompare(StatusTypes.STATUS_OFF) === 0) {
          if (signon.baseUrl.localeCompare('DEMO') === 0) {
            http.get('https://herdubreid.github.io/employee-work-schedule/docs/demo.json')
              .map(response => response.json())
              .subscribe((app: IAppState) => {
                app.rosters.forEach(r => {
                  r.start = Moment(r.start);
                  r.end = Moment(r.end);
                });
                store.dispatch(new AppActions.LoadDemoAction(app));
              });
          } else {
            this.dlg.open(SignonPromptComponent, {
              disableClose: true,
              width: '250px'
            });
          }
        }
      });
  }
}
