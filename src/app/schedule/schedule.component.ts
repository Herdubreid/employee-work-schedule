import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as Moment from 'moment';

import { IState, IEmployee } from '../store/state';
import { AppActions } from '../store/actions';
import { ICalendar } from './calendar.component';
import '../helpers/utils';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit {
  first: Date;
  second: Date;
  start: Observable<Moment.Moment>;
  employee: Observable<IEmployee>;
  team: Observable<IEmployee[]>;
  calendar: Observable<ICalendar>;
  selectionChange(e) {
    this.store.dispatch(new AppActions.SelectionAction(e.value));
  }
  ngOnInit() {
  }
  constructor(
    public store: Store<IState>
  ) {
    this.first = new Date();
    this.first.setDate(1);
    this.second = this.first.addMonths(3);
    this.start = store.select<Moment.Moment>(s => s.app.start);
    this.employee = store.select<IEmployee>(s => s.app.employee);
    this.team = store.select<IEmployee[]>(s => s.app.team);
    this.calendar = store.select<ICalendar>(s => {
      return {
        selection: s.app.selection,
        rosters: s.app.rosters
      }
    });
  }
}
