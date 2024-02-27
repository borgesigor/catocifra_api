import { UserRepository } from "../Application/Repository/UserRepository";
import IDatabaseContext from "../Shared/Context/IDatabaseContext";
import { EmailAlreadyCadastred, InvalidEmail, InvalidPassword, InvalidUsername, UnexpectedError, UserNotFound, UsernameAlreadyCadastred, WrongCredentials } from "../Shared/Handlers/Errors";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { MailService } from "./MailService";
import { UserPresenterDTO } from "../DTO/UserPresenterDTO";
import { User } from "../Application/Entities/User";import { isEmailValid, isPasswordValid, isUsernameValid } from "../Shared/Utils/Validators";

export class AuthService{

  private options: jwt.SignOptions = {
    expiresIn: '1h'
  }

  private TOKEN_SECRET: string = dotenv.config().parsed?.TOKEN_SECRET as string
  private PASSWORD_SECRET: string = dotenv.config().parsed?.PASSWORD_SECRET as string
  private userRepository: UserRepository;
  private mailService: MailService

  constructor(database: IDatabaseContext){
    this.userRepository = new UserRepository(database)
    this.mailService = new MailService()
  }

  private signToken(username: string, userId: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
      jwt.sign({ username, userId }, this.TOKEN_SECRET, this.options, (err, token) => {
        if(err) reject(err)
        if(token) resolve(token)

        reject(new Error('Token not generated'));
      })
    })
  }

  public validateToken(token: string): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      jwt.verify(token, this.TOKEN_SECRET, (err, decoded) => {
        if(err) resolve(false)
        resolve(true)
      })
    })
  }

  public decodeToken(token: string): Promise<UserPresenterDTO>{
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.TOKEN_SECRET, (err, decoded) => {
        if(err) reject(err)
        if(decoded) resolve(decoded as JwtPayload as UserPresenterDTO)

        reject(new UnexpectedError("Token not decoded"))
      })
    })
  }

  private async generatePasswordHash(password: string): Promise<string>{
    return await bcrypt.hash(password, this.PASSWORD_SECRET)
  }

  private async comparePassword(password: string, encryptedPassword: string): Promise<boolean>{
    return await bcrypt.compare(password, encryptedPassword)
  }

  //
  
  public async login(data: User): Promise<string>{

    const user = await this.userRepository.findUnique({ where: { username: data.username }})

    if(!user) throw new WrongCredentials();

    if(!await this.comparePassword(data.password, user.password)) throw new WrongCredentials();

    const token = this.signToken(data.username, user.id as string)

    return token

  }
  
  public async register(data: User){

    if(!isUsernameValid(data.username)) throw new InvalidUsername();
    if(!isEmailValid(data.email)) throw new InvalidEmail();
    if(!isPasswordValid(data.password)) throw new InvalidPassword();

    const emailCheck = await this.userRepository.findUnique({ where: { username: data.email }})
    const usernameCheck = await this.userRepository.findUnique({ where: { username: data.username }})

    if(emailCheck) throw new EmailAlreadyCadastred();
    if(usernameCheck) throw new UsernameAlreadyCadastred();

    const passwordHash = await this.generatePasswordHash(data.password)

    return await this.userRepository.create(
      {
        email: data.email,
        name: data.name,
        username: data.username,
        password: passwordHash
      }
    )

  }

  // update email
  public async updateEmail(token: string, data: User){

    if(!isEmailValid(data.email)) throw new InvalidEmail();

    const user = await this.userRepository.findUnique({ where: { username: data.email }})
    if(!user) throw new UserNotFound();

    const decodedToken = await this.decodeToken(token)
    if(decodedToken.id !== user.id) throw new UserNotFound();

    if(!await this.comparePassword(data.password, user.id)) throw new WrongCredentials();

    return await this.userRepository.update(
      {
        email: data.email
      },
      user.id as string
    )

  }

  // reset password
  public async updatePassword(token: string, newPassword: string, passwordConfirmation: string){

  }

  public async sendResetPasswordRequest(username: string){
    
  }

  private async createResetPasswordToken(): Promise<string>{
    return ""
  }

  private async deleteResetPasswordToken(): Promise<string>{
    return ""
  }
}