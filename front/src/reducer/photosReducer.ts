import { IPhoto } from "../interfaces";
import { TAction } from "../actionTypes";

const initialState: IPhoto[] = [];

export const photosReducer = (
  state: IPhoto[] = initialState,
  action: TAction
): IPhoto[] => {
  if (action.type === "SET_PHOTOS") {
    return action.photos;
  }
  if (action.type === "ADD_PHOTO") {
    state.push(action.photo);
    return [...state];
  }
  if (action.type === "UPDATE_PHOTO") {
    //here,we find the user by the id.
    const index = state.findIndex(p => p._id === action.photo._id);

    state[index] = action.photo;
    //state[index],
    //initialState state that reaches it with the position of the url and matches it to the action of the photo.
  }
  if (action.type === "REMOVE_PHOTO") {
    const index = state.findIndex(p => p._id === action.photo_id);
    //here we create a constant that finds me the user through the
    //state with the new variable that we created inside and we match it to the action.user_id.
    state.splice(index, 1); //1 => how many users I want to delete from there,
    //in this case we delete one this eliminates me with the splice the last element of my array.
    return [...state]; //here,states return.
  }
  if (action.type === "RESET") {
    //here, reset photos when the user's account is deleted.
    return initialState;
  }

  return state;
};
