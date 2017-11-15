import { Component, OnInit, } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, withLatestFrom } from 'rxjs/operators';
import * as Moment from 'moment';

import { IState, IRoster, IEmployee } from '../store/state';
import { AppActions } from '../store/actions';
import '../helpers/utils';

@Component({
    selector: 'app-roster',
    template: `
<div *ngIf="dayshift.length > 0">
  <h4>Dayshift:</h4>
  <div *ngFor="let e of dayshift">
    <div mat-button>{{ e.alph }} ({{ e.an8 }})</div>
  </div>
<div *ngIf="nightshift.length > 0">
  <h4>Nightshift:</h4>
  <div *ngFor="let e of nightshift">
    <div mat-button>{{ e.alph }} ({{ e.an8 }})</div>
  </div>
<div *ngIf="leave.length > 0">
  <h4>Leave:</h4>
  <div *ngFor="let e of leave">
    <div mat-button>{{ e.alph }} ({{ e.an8 }})</div>
  </div>
</div>
`,
    styleUrls: ['./schedule.component.scss']
})
export class RosterComponent implements OnInit {
    start: Observable<Moment.Moment>;
    dayshift: IEmployee[];
    nightshift: IEmployee[];
    leave: IEmployee[];
    ngOnInit() {
        this.start
            .withLatestFrom(this.store)
            .subscribe(([start, store]) => {
                const roster: IRoster[] = store.app.rosters.filter(r => r.start.diff(start, 'days') === 0);
                this.dayshift = store.app.team
                    .filter(e => roster
                        .filter(r => e.an8.localeCompare(r.an8) === 0)
                        .filter(r => r.activity.localeCompare('REGULAR') === 0)
                        .filter(r => r.cd1 === 'D').length > 0)
                    .sort((a, b) => a.alph.localeCompare(b.alph));
                this.nightshift = store.app.team
                    .filter(e => roster
                        .filter(r => e.an8.localeCompare(r.an8) === 0)
                        .filter(r => r.activity.localeCompare('REGULAR') === 0)
                        .filter(r => r.cd1 === 'N').length > 0)
                    .sort((a, b) => a.alph.localeCompare(b.alph));
                this.leave = store.app.team
                    .filter(e => roster
                        .filter(r => e.an8.localeCompare(r.an8) === 0)
                        .filter(r => r.activity.localeCompare('HOLIDAY') === 0).length > 0)
                    .sort((a, b) => a.alph.localeCompare(b.alph));
            });
    }
    constructor(
        public store: Store<IState>
    ) {
        this.start = store.select<Moment.Moment>(s => s.app.start);
    }
}
