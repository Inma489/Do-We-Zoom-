import { IDecoded } from "../interfaces";
import { TAction } from "../actionTypes";

const initialState: IDecoded = {}; // The initial state is an empty object.

export const decodedReducer = (
  state: IDecoded = initialState,
  action: TAction
): IDecoded => {
  if (action.type === "SET_DECODED") {
    return action.decoded;
  }
  if (action.type === "RESET") {
    return initialState;
  }
  return state;
};
