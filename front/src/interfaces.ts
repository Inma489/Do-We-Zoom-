export interface IDecoded {
  // esto el IDecoded me devuelve un objeto
  admin?: boolean; // lo ponemos opcional con la interrogacion porque no sabemos si nos va a llegar o no
  iat?: number;
  username?: string;
  email?: string;
  _id?: string;
}

export interface IUser {
  // lo que me va a venir de un usuario
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  password?:string;
  admin?: boolean;
}
// lo que me va a llegar de la photo
export interface IPhoto {
  _id: string,
  filename: string,
  owner: string,
  name:string,
  camera:string,
  localization:string,
  dateAdded: Date
}

export interface IEvent{
  _id: string,
  admin: string,
  filename:string,
  name: string,
  date:string,
  place:string,
  time: string,
  description:string
}