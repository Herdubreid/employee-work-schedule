import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SignonService, StatusTypes } from 'e1-service';

import { SignonPromptComponent } from './e1/signon-prompt.component';
import { IState } from './store/state';

declare var AIS_BASE_URL;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
  }
  status: Observable<string>;
  constructor(
    public store: Store<IState>,
    public dlg: MatDialog,
    public signon: SignonService
  ) {
    signon.baseUrl = AIS_BASE_URL;
    this.status = store.select<string>(s => s.e1.status);
    this.status
      .subscribe(status => {
        if (status.localeCompare(StatusTypes.STATUS_OFF) === 0) {
          this.dlg.open(SignonPromptComponent, {
            disableClose: true,
            width: '250px'
          });
        }
      });
  }
}
