import { ActionCreator } from "redux";
import { TAction } from "./actionTypes";
import { IDecoded, IUser, IPhoto, IEvent } from "./interfaces";

export const setToken: ActionCreator<TAction> = (token: string) => ({
  type: "SET_TOKEN",
  token
});

export const setDecoded: ActionCreator<TAction> = (decoded: IDecoded) => ({
  type: "SET_DECODED",
  decoded
});

// pondremos los usuarios
export const setUsers: ActionCreator<TAction> = (users: IUser[]) => ({
  type: "SET_USERS",
  users
});

export const addUser: ActionCreator<TAction> = (user: IUser) => ({
  type: "ADD_USER",
  user
});

export const updateUser: ActionCreator<TAction> = (
  user: IUser,
  user_id: string
) => ({
  type: "UPDATE_USER",
  user_id,
  user
});
export const removeUser: ActionCreator<TAction> = (user_id: string) => ({
  type: "REMOVE_USER",
  user_id
});
//pondremos los albums
// aqui pondremos las photos

export const setPhotos: ActionCreator<TAction> = (photos: IPhoto[]) => ({
  type: "SET_PHOTOS",
  photos
});

export const updatePhoto: ActionCreator<TAction> = (
  photo: IPhoto,
  photo_id: string
) => ({
  type: "UPDATE_PHOTO",
  photo,
  photo_id
});

export const addPhoto: ActionCreator<TAction> = (photo: IPhoto) => ({
  type: "ADD_PHOTO",
  photo
});

export const removePhoto: ActionCreator<TAction> = (photo_id: string) => ({
  type: "REMOVE_PHOTO",
  photo_id
});
// aqui pondremos los eventos
export const setEvent: ActionCreator<TAction> = (events: IEvent[]) => ({
  type: "SET_EVENTS",
  events
});
export const addEvent: ActionCreator<TAction> = (event: IEvent) => ({
  type: "ADD_EVENT",
  event
});
export const updateEvent: ActionCreator<TAction> = (
  event: IEvent,
  event_id: string
) => ({
  type: "UPDATE_EVENT",
  event,
  event_id
});
export const removeEvent: ActionCreator<TAction> = (event_id: string) => ({
  type: "REMOVE_EVENT",
  event_id
});
export const setSearch: ActionCreator<TAction> = (search: string) => ({
  type: "SET_SEARCH",
  search
});
// para borrar una cuenta
export const Reset: ActionCreator<TAction> = () => ({
  type: "RESET"
});
