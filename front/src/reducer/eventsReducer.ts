import { IEvent } from "../interfaces";
import { TAction } from "../actionTypes";
const initialState: IEvent[] = [];

export const eventReducer = (
  state: IEvent[] = initialState,
  action: TAction
): IEvent[] => {
  if (action.type === "SET_EVENTS") {
    return action.events;
  }
  if (action.type === "ADD_EVENT") {
    state.push(action.event);
    return [...state];
  }
  if (action.type === "UPDATE_EVENT") {
    const index = state.findIndex(e => e._id === action.event._id); // aqui econtramos el event por el id
    state[index] = action.event; //state[index], el estado initialState que le llega con la posicion de la url y lo iguala a la action del event,
  }
  if (action.type === "REMOVE_EVENT") {
    const index = state.findIndex(e => e._id === action.event_id);
    state.splice(index, 1);
    return [...state];
  }
  if (action.type === "RESET") {
    return initialState;
  }
  return state;
};
