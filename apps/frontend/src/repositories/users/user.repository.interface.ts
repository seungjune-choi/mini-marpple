
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
}

export interface IUserRepository {
  signIn(request: SignInRequest): Promise<SignInResponse>;
}