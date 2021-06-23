export interface IUser {
  id: string;
  email: string;
}

export interface SignUpUserResponse {
  user: IUser;
  isSuccess: boolean;
}

export interface RegisterUserResponse {
  id: string;
  email: string;
}
