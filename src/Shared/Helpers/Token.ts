import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { InvalidToken } from '../Handlers/Errors'

const TOKEN_SECRET: string = dotenv.config().parsed?.TOKEN_SECRET as string

const options: jwt.SignOptions = {
  expiresIn: '1h'
}

export function signToken(id: string): string{
  return jwt.sign({ id }, TOKEN_SECRET, options)
}

export function validateToken(token: string): JwtPayload{
  return jwt.verify(token, TOKEN_SECRET) as JwtPayload
}

export function decodeToken(token: string): JwtPayload {
  return jwt.decode(token) as JwtPayload
}

export function getIdFromToken(token: string): string{

  const decodedToken = decodeToken(token)

  if(!decodedToken.id) throw new InvalidToken();

  return decodedToken.id

}