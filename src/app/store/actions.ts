import { Action } from '@ngrx/store';
import * as Moment from 'moment';

import { IAppState, IEmployee, IRoster } from './state';
/**
 * Application Actions
 */

export enum ActionTypes {
    LOAD_DEMO = 'LOAD_DEMO',
    TEAM = 'TEAM',
    ROSTERS = 'ROSTERS',
    ADD_ROSTERS = 'ADD_ROSTERS',
    SELECTION = 'SELECTION',
    START_END = 'START_END',
    REFRESH = 'REFRESH',
    RESET = 'RESET'
}

export namespace AppActions {
    export class LoadDemoAction implements Action {
        readonly type = ActionTypes.LOAD_DEMO;
        constructor(public appState: IAppState) { }
    }
    export class TeamAction implements Action {
        readonly type = ActionTypes.TEAM;
        constructor(public team: IEmployee[]) { }
    }
    export class RostersAction implements Action {
        readonly type = ActionTypes.ROSTERS;
        constructor(public rosters: IRoster[]) { }
    }
    export class AddRostersAction implements Action {
        readonly type = ActionTypes.ADD_ROSTERS;
        constructor(public rosters: IRoster[]) { }
    }
    export class SelectionAction implements Action {
        readonly type = ActionTypes.SELECTION;
        constructor(public selection: string) { }
    }
    export class StartEndAction implements Action {
        readonly type = ActionTypes.START_END;
        constructor(public start: Moment.Moment, public end: Moment.Moment) { }
    }
    export class RefreshAction implements Action {
        readonly type = ActionTypes.REFRESH;
        constructor(public employee: IEmployee) { }
    }
    export class ResetAction implements Action {
        readonly type = ActionTypes.RESET;
    }
    export type AllActions =
        LoadDemoAction |
        TeamAction |
        RostersAction |
        AddRostersAction |
        SelectionAction |
        StartEndAction |
        RefreshAction |
        ResetAction;
}