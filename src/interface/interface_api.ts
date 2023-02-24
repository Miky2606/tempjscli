export interface ResponseServer<T> {
  data?: T;
  error?: string;
  msg?: string;
}

export interface IUser {
  _id: string;
  name: string;
}

export interface ITemplate {
  _id: string;
  name: string;
  user: IUser[];
}
