import { TAction } from '../actionTypes';

const initialState: string = "";

export const searchReducer = (
    state: string = initialState,
    action: TAction
): string => {
    if (action.type === "SET_SEARCH"){
        return action.search
    }
    return state
};