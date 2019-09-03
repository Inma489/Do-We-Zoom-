import { IDecoded, IUser, IPhoto, IEvent } from "./interfaces";
type TSetTokenAction = {
  type: "SET_TOKEN";
  token: string;
};


type TSetDecodedAction = {
  // hare esto para no llamar todas las veces al decoded y utilizarlo cuando yo quiera
  type: "SET_DECODED";
  decoded: IDecoded; // me devuelve el decoded un objeto
};


// AQUI PONDREMOS LOS USERS
type TSetUserAction = {
  // LO QUE ME VA A LLEGAR ES UN ARRAY DE USUARIOS
  type: "SET_USERS";
  users: IUser[];
};

type TUpdateUserAction = {
  type: "UPDATE_USER";
  user_id: string; // aqui necesito los datos del usuario para que me lo pueda actualizar
  user: IUser;
};
type TAddUserAction = {
  type: "ADD_USER";
  user: IUser;
};
type TRemoveUserAction = {
  type: "REMOVE_USER";
  user_id: string;
};

//AQUI PONDREMOS TODAS LAS PHOTOS
type TSetPhotoAction = {
  type: "SET_PHOTOS";
  photos: IPhoto[];
};

type TUpdatePhotoAction = {
  type: "UPDATE_PHOTO";
  photo: IPhoto;
};

type TAddPhotoAction = {
  type: "ADD_PHOTO";
  photo: IPhoto;
};
type TRemovePhotoAction = {
  type: "REMOVE_PHOTO";
  photo_id: string;
};

//AQUI PONDREMOS TODOS LOS EVENTOS

type TSetEventAction = {
  type: "SET_EVENTS";
  events: IEvent[];
};
type TAddEventAction = {
  type: "ADD_EVENT";
  event: IEvent;
};
type TUpdateEventAction = {
  type: "UPDATE_EVENT";
  event: IEvent;
}

type TRemoveEventAction = {
  type: "REMOVE_EVENT";
  event_id : string;
}

type TSetSearchAction = {
  type: 'SET_SEARCH';
  search: string;
}
// haremos un reset cuando queramos borrar una cuenta de un usuario, que me borre todo
//de redux
type TReset = {
  type:'RESET';
 }

export type TAction =
  | TSetTokenAction
  | TSetDecodedAction
  | TSetUserAction
  | TAddUserAction
  | TUpdateUserAction
  | TRemoveUserAction
  | TSetPhotoAction
  | TUpdatePhotoAction
  | TAddPhotoAction
  | TRemovePhotoAction
  | TSetEventAction
  | TAddEventAction
  | TRemoveEventAction
  | TUpdateEventAction
  |TSetSearchAction
  | TReset
  
