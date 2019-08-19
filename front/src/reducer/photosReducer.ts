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
    const index = state.findIndex(p => p._id === action.photo._id); // aqui econtramos el usuario por el id
    state[index] = action.photo; //state[index], el estado initialState que le llega con la posicion de la url y lo iguala a la action del user,
  }
  if (action.type === "REMOVE_PHOTO") {
    const index = state.findIndex(p => p._id === action.photo_id); //aqui creamos una constante que me encuentra el user a traves del state con la variable nueva
    //que le creamos dentro y la igualamos al action.user_id
    state.splice(index, 1); //1 => cuantos usuarios quiero borrar a partir de ahi, en este caso borramos uno// esto me elimina con el splice el ultimo elemento de mi array
    return [...state]; //aqui me retorna los estados, coge todos los estados antertiores y este lo cambia
  }
  if (action.type === "RESET") {
    return initialState;
  }

  return state;
};
