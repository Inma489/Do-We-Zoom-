import { IUser } from "../interfaces";
import { TAction } from "../actionTypes";

const initialState: IUser[] = []; // lo que me llega de inicio es un array vacio

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
  //aqui tengo que hacer el find para que me compare el id de action.type users con el id del actiontype removeUser para que me pueda borrar el id de redux
  if (action.type === "REMOVE_USER") {
    const index = state.findIndex(u => u._id === action.user_id); //aqui creamos una constante que me encuentra el user a traves del state con la variable nueva
    //que le creamos dentro y la igualamos al action.user_id
    state.splice(index, 1); //1 => cuantos usuarios quiero borrar a partir de ahi, en este caso borramos uno// esto me elimina con el splice el ultimo elemento de mi array
    return [...state]; //aqui me retorna los estados, coge todos los estados antertiores y este lo cambia
  }
  if (action.type === "UPDATE_USER") {
    const index = state.findIndex(u => u._id === action.user_id); // aqui econtramos el usuario por el id
    state[index] = action.user; //state[index], el estado initialState que le llega con la posicion de la url y lo iguala a la action del user,

    //que es nuestro action.updateuser que nos vendra con el usuario que queremos editar
    return [...state]; // esto me devuelve todos los estados anteriores.
  }
  if (action.type === "RESET") {
    return initialState;
  }
  return state;
};
