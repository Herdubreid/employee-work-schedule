import {IServerState, initialServerState} from 'e1-service';
import * as Moment from 'moment';
/**
 * Application State
 */
export interface IRoster {
    an8: string;
    type: string;
    activity: string;
    title: string;
    cd1: string;
    start: Moment.Moment;
    end: Moment.Moment;
}
export interface IEmployee {
    an8: string;
    alph: string;
}
export interface IAppState {
    employee: IEmployee;
    team: IEmployee[];
    rosters: IRoster[];
    selection: string;
    start: Moment.Moment;
}
export interface IState {
    app: IAppState;
    e1: IServerState;
}
export const initialAppState = {
    employee: null,
    team: [],
    rosters: [],
    selection: '',
    start: null
};
export const initialState = {
    app: initialAppState,
    e1: initialServerState
}
