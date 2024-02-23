export interface UserPresenterDTO{
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserPresenterRegisterDTO{
  id: string;
  name: string;
  username: string;
  email: string;
  token: string;
  createdAt: Date;
}