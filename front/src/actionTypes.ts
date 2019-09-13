import { IDecoded, IUser, IPhoto, IEvent } from "./interfaces";

//TOKEN ACTION
type TSetTokenAction = {
  type: "SET_TOKEN";
  token: string;
};

//DECODED ACTION
type TSetDecodedAction = {
  // I'll do this so I don't call decoded every time and use it whenever I want.
  type: "SET_DECODED";
  decoded: IDecoded; //IDecoded returns an object.
};

//USERS ACTION
type TSetUserAction = {
  // what's coming is an array of users.
  type: "SET_USERS";
  users: IUser[];
};

type TUpdateUserAction = {
  type: "UPDATE_USER";
  user_id: string; // here, I need the user data so I can update it.
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

//PHOTOS ACTION
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

//EVENTS ACTION

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
};

type TRemoveEventAction = {
  type: "REMOVE_EVENT";
  event_id: string;
};

type TSetSearchAction = {
  type: "SET_SEARCH";
  search: string;
};
// we will do a reset when we want to delete a user's account,
// which deletes all of redux.

type TReset = {
  type: "RESET";
};

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
  | TSetSearchAction
  | TReset;
