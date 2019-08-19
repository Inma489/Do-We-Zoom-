import { TAction } from "../actionTypes";
const initialState: string = "";

export const tokenReducer = (
  state: string = initialState,
  action: TAction
): string => {
  if (action.type === "SET_TOKEN") {
    return action.token;
  }
  if (action.type === "RESET") {
    return initialState;
  }
  return state;
};
