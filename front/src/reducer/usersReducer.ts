import { IUser } from "../interfaces";
import { TAction } from "../actionTypes";

const initialState: IUser[] = []; // What comes from initialstate is an empty array.

export const usersReducer = (
  state: IUser[] = initialState,
  action: TAction
): IUser[] => {
  if (action.type === "SET_USERS") {
    return action.users;
  }
  if (action.type === "ADD_USER") {
    state.push(action.user);
    return [...state];
  }
  //here,I have to do the find to compare the id of action.type users
  //with the actiontype id removeUser so that I can delete the redux id.
  if (action.type === "REMOVE_USER") {
    //here, we create a constant that finds me the user through the state with the new variable.
    const index = state.findIndex(u => u._id === action.user_id);

    state.splice(index, 1);
    //1 => how many users I want to delete from there, in this case we delete one.
    //this eliminates the last element of my array with splice.
    return [...state];
    //return states.
  }
  if (action.type === "UPDATE_USER") {
    const index = state.findIndex(u => u._id === action.user_id);
    state[index] = action.user;

    // nuestro action.updateuser que nos vendra con el usuario que queremos editar
    return [...state]; //  returns me to all the previous states.
  }
  if (action.type === "RESET") {
    return initialState;
  }
  return state;
};
