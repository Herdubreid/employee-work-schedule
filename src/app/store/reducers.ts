import { e1Reducer } from 'e1-service';
import * as Moment from 'moment';

import { IAppState, initialAppState } from './state';
import { AppActions, ActionTypes } from './actions';
/**
 * Application Reducers
 */
export function appReducer(state = initialAppState, action: AppActions.AllActions): IAppState {
    switch (action.type) {
        case ActionTypes.REFRESH:
            return Object.assign({}, initialAppState, {
                employee: action.employee,
                team: [
                    {
                        an8: action.employee.an8,
                        alph: 'Me'
                    }
                ]
            });
        case ActionTypes.TEAM:
            return Object.assign({}, state, {
                team: [...state.team, ...action.team]
            });
        case ActionTypes.ROSTERS:
            return Object.assign({}, state, {
                rosters: [...action.rosters]
            });
        case ActionTypes.ADD_ROSTERS:
            return Object.assign({}, state, {
                rosters: [...state.rosters, ...action.rosters],
                start: Moment()
            });
        case ActionTypes.SELECTION:
            return Object.assign({}, state, {
                selection: action.selection
            });
        case ActionTypes.START_END:
            return Object.assign({}, state, {
                start: action.start,
                end: action.end
            });
        case ActionTypes.RESET:
            return initialAppState;
        default:
            return state;
    }
}
export const reducer = { app: appReducer, e1: e1Reducer };
