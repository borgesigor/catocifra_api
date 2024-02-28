import { EmailAlreadyCadastred, InvalidEmail, InvalidPassword, InvalidToken, InvalidUsername, UserNotFound, UsernameAlreadyCadastred, WrongCredentials } from "../Shared/Handlers/Errors";
import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from "../Application/Entities/User";import { isEmailValid, isPasswordValid, isUsernameValid } from "../Shared/Helpers/Validators";

export class TokenService{

  private options: jwt.SignOptions = {
    expiresIn: '1h'
  }

  private TOKEN_SECRET: string = dotenv.config().parsed?.TOKEN_SECRET as string

  public signToken(id: string): string{
    return jwt.sign({ id }, this.TOKEN_SECRET, this.options)
  }

  public validateToken(token: string): JwtPayload{
    return jwt.verify(token, this.TOKEN_SECRET) as JwtPayload
  }

  public decodeToken(token: string): JwtPayload {
    return jwt.decode(token) as JwtPayload
  }

  public getIdFromToken(token: string): string{

    const decodedToken = this.decodeToken(token)

    if(!decodedToken.id) throw new InvalidToken();

    return decodedToken.id

  }

}