import { UserRepository } from "../Application/Repository/UserRepository";
import IDatabaseContext from "../Shared/Context/IDatabaseContext";
import { WrongCredentials } from "../Shared/Handlers/Errors";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export class AuthService{

  private options: jwt.SignOptions = {
    expiresIn: '1h'
  }

  private TOKEN_SECRET: string = dotenv.config().parsed?.TOKEN_SECRET as string
  private PASSWORD_SECRET: string = dotenv.config().parsed?.PASSWORD_SECRET as string
  private userRepository: UserRepository;

  constructor(database: IDatabaseContext){
    this.userRepository = new UserRepository(database)
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

  private validateToken(token: string): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      jwt.verify(token, this.TOKEN_SECRET, (err, decoded) => {
        if(err) resolve(false)
        resolve(true)
      })
    })
  }

  private decodeToken(token: string): Promise<any>{
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.TOKEN_SECRET, (err, decoded) => {
        if(err) reject(err)
        if(decoded) resolve(decoded)

        reject(new Error('Token not decoded'))
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
  
  public async login(username: string, password: string): Promise<string>{

    const user = await this.userRepository.findUnique({ where: { username: username }})

    if(!user) throw new WrongCredentials();

    if(!await this.comparePassword(password, user.password)) throw new WrongCredentials();

    const token = this.signToken(username, user.id as string)

    return token

  }
  
  public async register(username: string, password: string){
    
    

  }
  
  public async resetPassword(email: string){
    


  }
  
  public async changePassword(username: string, oldPassword: string, newPassword: string){
    
  }

  public async changeEmail(){
    
  }
  
  public async isAuthenticated(){
    
  }
  
  public async getUserInfo(){
    
  }

}