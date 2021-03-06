import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { reduce, map, filter, combineLatest, delay } from 'rxjs/Operators';
import * as $ from 'jquery';
import * as Moment from 'moment';
import 'fullcalendar';

import { IState, IRoster } from '../store/state';
import { AppActions } from '../store/actions';
import '../helpers/utils';

interface IActivity {
    cd1: string;
    title: string;
}
interface IEvent extends FC.EventObject {
    type: string;
    activities: IActivity[];
}

@Component({
    selector: 'app-calendar',
    template: '',
    styleUrls: ['./schedule.component.scss']
})
export class CalendarComponent implements OnInit {
    @Input('start') start: Date;
    @Input('header') header: boolean;
    @Input('footer') footer: boolean;
    @Input('rosters') rosters: Observable<IRoster[]>;
    @Input('selection') selection: Observable<string>;
    ngOnInit() {
        const header = this.header ? {
            left: 'title',
            center: '',
            right: ''
        } : false;
        const footer = this.footer ? {
            left: '',
            center: '',
            right: 'title'
        } : false;
        $(this.host.nativeElement).fullCalendar({
            header,
            footer,
            events: [],
            defaultDate: this.start,
            nextDayThreshold: Moment.duration('10:00'),
            height: 'auto',
            showNonCurrentDates: false,
            fixedWeekCount: false,
            weekNumbers: true,
            aspectRatio: 1,
            allDayDefault: true,
            selectable: true,
            selectLongPressDelay: 200,
            select: (start, end, jsEvent, view) => {
                this.store.dispatch(new AppActions.StartEndAction(start, end));
            },
            eventRender: (event: IEvent, element: any, view) => {
                element.css('font-size', '.6em');
                if (event.type.localeCompare('REGULAR') === 0) {
                    const d = event.activities.filter(e => e.cd1 === 'D').length;
                    const n = event.activities.filter(e => e.cd1 === 'N').length;
                    element.html(`<div>${d > 0 ? 'D' + d : ''} ${n > 0 ? 'N' + n : ''}</div>`);
                }
                if (event.type.localeCompare('HOLIDAY') === 0) {
                    element.css('background-color', 'green');
                    element.html(`<div>${event.activities.length > 1 ? 'Holday...' : event.activities[0].title}</div>`);
                }
            },
            viewRender: (view, element) => {
                if (!this.header) {
                    element.find('.fc-head').remove();
                }
            }
        });
        Observable
            .combineLatest(this.rosters, this.selection)
            .filter(([rosters]) => rosters.length > 0)
            .delay(100)
            .subscribe(([rosters, selection]) => {
                const events = rosters
                    .filter(r => selection ?
                        selection.localeCompare(r.an8) === 0 : true)
                    .reduce<IEvent[]>((events, r) => {
                        const node = events.find(e => (r.start.diff(e.start) === 0 && r.activity.localeCompare(e.type)) === 0) ||
                            events[events.push({ start: r.start, title: 'Events', type: r.activity, activities: [] }) - 1];
                        node.activities.push({
                            cd1: r.cd1,
                            title: r.title
                        });
                        return events;
                    }, []);
                $(this.host.nativeElement).fullCalendar('removeEvents');
                $(this.host.nativeElement).fullCalendar('addEventSource', {
                    events
                });
            });
    }
    constructor(
        public host: ElementRef,
        public store: Store<IState>
    ) {
    }
}
