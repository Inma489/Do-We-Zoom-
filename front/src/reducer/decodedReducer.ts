import { IDecoded } from "../interfaces";
import { TAction } from "../actionTypes";

const initialState: IDecoded = {}; // nos devuelve un objeto vacio

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
