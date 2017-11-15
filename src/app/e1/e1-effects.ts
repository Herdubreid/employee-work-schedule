import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { Effect, Actions } from '@ngrx/effects';
import { E1ActionTypes, E1Actions, IAuthResponse, FormService, BatchformService, BatchformRequest } from 'e1-service';
import * as Moment from 'moment';

import { IState, IEmployee, IRoster } from '../store/state';
import { AppActions, ActionTypes } from '../store/actions';
import { Global } from '../global';
import { E1HelperService } from './e1-helper';
import { WWEmployeesRequest, IWWEmployeesResponse, W060116F } from './ww-employees';
import { EmployeeScheduleRequest, IEmployeeScheduleResponse, IEmployeeScheduleForm, W597311A, W597311A_BATCH } from './employee-schedule';
/**
 * E1 Effects Service
 */
function jdeUTCFormat(): string {
    const s = '{0}' + Global.jdeDateSeparator + '{1}' + Global.jdeDateSeparator + '{2} HH:mm:ss';
    switch (Global.jdeDateFormat) {
        case 'DME':
        case 'DMY':
            return s.format('DD', 'MM', 'YYYY');
        case 'EMD':
        case 'YMD':
            return s.format('YYYY', 'MM', 'DD');
        case 'MDE':
        case 'MDY':
            return s.format('MM', 'DD', 'YYYY');
    }
    return s.format('DD', 'MM', 'YYYY');
}
@Injectable()
export class E1EffectsService {
    @Effect()
    authResponse$ = this.actions$.ofType<E1Actions.AuthResponseAction>(E1ActionTypes.AUTH_RESPONSE)
        .map(action => action.payload.authResponse)
        .switchMap((authResponse: IAuthResponse) => {
            Global.jdeDateFormat = authResponse.userInfo.dateFormat;
            Global.jdeDateSeparator = authResponse.userInfo.dateSeperator;
            this.form.request = new WWEmployeesRequest(authResponse.userInfo.addressNumber);
            this.e1.call(this.form);
            return Observable.of(new AppActions.RefreshAction({
                an8: authResponse.userInfo.addressNumber.toString(),
                alph: authResponse.userInfo.alphaName
            }));
        });
    @Effect({ dispatch: false })
    refresh$ = this.actions$.ofType<AppActions.RefreshAction>(ActionTypes.REFRESH)
        .map(action => action.employee)
        .do(employee => {
            const start = new Date();
            start.setDate(1);
            const end = start.addMonths(2);
            this.form.request = new EmployeeScheduleRequest(
                employee.an8, start, end
            );
            this.e1.call(this.form);
        });
    @Effect()
    wwEmployees$ = this.actions$.ofType<E1Actions.FormResponseAction>(E1ActionTypes.FORM_RESPONSE)
        .map(response => response.payload.formResponse)
        .filter(formResponse => formResponse[W060116F])
        .switchMap((form: IWWEmployeesResponse) => {
            if (form.fs_P060116_W060116F.data.gridData.summary.records > 0) {
                const start = new Date();
                start.setDate(1);
                const end = start.addMonths(3);
                const request = new BatchformRequest();
                request.formRequests = form.fs_P060116_W060116F.data.gridData.rowset
                    .map(r => new EmployeeScheduleRequest(r.mnAddressNumber_29.value, start, end));
                this.batch.request = request;
                this.e1.call(this.batch);
                return Observable.of(new AppActions.TeamAction(form.fs_P060116_W060116F.data.gridData.rowset
                    .map<IEmployee>(r => {
                        return {
                            an8: r.mnAddressNumber_29.value,
                            alph: r.sAlphaName_30.value
                        }
                    })));
            }
            return Observable.of(new AppActions.AddRostersAction([]));
        });
    @Effect()
    employeeSchedule$ = this.actions$.ofType<E1Actions.FormResponseAction>(E1ActionTypes.FORM_RESPONSE)
        .map(response => response.payload.formResponse)
        .filter(formResponse => formResponse[W597311A])
        .switchMap((form: IEmployeeScheduleResponse) => {
            return Observable.of(new AppActions.RostersAction(form.fs_P597311_W597311A.data.gridData.rowset
                .map<IRoster>(r => {
                    return {
                        an8: r.mnAddressNumber_21.value,
                        type: r.sCalendarType_24.value,
                        activity: r.sActivityType_20.value,
                        title: r.sSubject_17.value,
                        cd1: r.sCategoryCode1_36.value,
                        start: Moment(r.utTimeDateStart_18.value, jdeUTCFormat()),
                        end: Moment(r.utTimeDateEnd_19.value, jdeUTCFormat())
                    };
                })));
        });
    @Effect()
    employeeBatchSchedule$ = this.actions$.ofType<E1Actions.BatchformResponseAction>(E1ActionTypes.BATCHFORM_RESPONSE)
        .map(response => response.payload.batchformResponse)
        .switchMap(bf => {
            const roster: IRoster[] = [];
            for (let i = 0; bf[W597311A_BATCH.format(i)]; i++) {
                const form: IEmployeeScheduleForm = bf[W597311A_BATCH.format(i)];
                roster.push(...form.data.gridData.rowset
                    .map<IRoster>(r => {
                        return {
                            an8: r.mnAddressNumber_21.value,
                            type: r.sCalendarType_24.value,
                            activity: r.sActivityType_20.value,
                            title: r.sSubject_17.value,
                            cd1: r.sCategoryCode1_36.value,
                            start: Moment(r.utTimeDateStart_18.value, jdeUTCFormat()),
                            end: Moment(r.utTimeDateEnd_19.value, jdeUTCFormat())
                        };
                    }));
            }
            return Observable.of(new AppActions.AddRostersAction(roster));
        });
    constructor(
        public store: Store<IState>,
        public actions$: Actions,
        public form: FormService,
        public batch: BatchformService,
        public e1: E1HelperService
    ) { }
}
