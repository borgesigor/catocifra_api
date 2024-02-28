import { UserRepository } from '../Application/Repository/UserRepository';
import { AuthorDoesntHavePermission, EmailAlreadyExists, InvalidEmail, InvalidPassword, InvalidUsername, UserNotFound, UsernameAlreadyExists, WrongCredentials } from "../Shared/Handlers/Errors";
import { UserPresenterDTO } from '../DTO/UserPresenterDTO';
import { PermissionService, ServicePermissions } from './PermissionService';
import { User } from '../Application/Entities/User';
import { TokenService } from './TokenService';
import { isEmailValid, isPasswordValid, isUsernameValid } from '../Shared/Helpers/Validators';
import IDatabaseContext, { FindMany } from '../Shared/Context/IDatabaseContext';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export class UserService{
  private userRepository: UserRepository;
  private permissionService: PermissionService;
  private tokenService: TokenService;
  private PASSWORD_SECRET: string;

  constructor(private database: IDatabaseContext) {
    this.userRepository = new UserRepository(database);
    this.permissionService = new PermissionService(database);
    this.tokenService = new TokenService();
    this.PASSWORD_SECRET = dotenv.config().parsed?.PASSWORD_SECRET as string;
  }

  private async generatePasswordHash(password: string): Promise<string>{
    return await bcrypt.hash(password, this.PASSWORD_SECRET)
  }

  private async comparePassword(password: string, encryptedPassword: string): Promise<boolean>{
    return await bcrypt.compare(password, encryptedPassword)
  }

  private credentialsCheck(data: User): void{
    if(!isUsernameValid(data.username)) throw new InvalidUsername(data.username);
    if(!isEmailValid(data.email)) throw new InvalidEmail(data.email);
    if(!isPasswordValid(data.password)) throw new InvalidPassword();
  }

  private async findUserByCondition(condition: Record<string, string>): Promise<User> {
    const user = await this.userRepository.findUnique({ where: condition });
  
    if (!user) {
      throw new UserNotFound();
    }
  
    return user;
  }
  
  private mapUserToDTO(user: User): UserPresenterDTO {
    return {
      id: user.id,
      createdAt: user.createdAt,
      username: user.username,
      email: user.email,
      name: user.name,
    };
  }

  async findById(id: string): Promise<UserPresenterDTO> {
    const user = await this.findUserByCondition({ id });
    return this.mapUserToDTO(user);
  }
  
  async findByEmail(email: string): Promise<UserPresenterDTO> {
    const user = await this.findUserByCondition({ email });
    return this.mapUserToDTO(user);
  }
  
  async findByUsername(username: string): Promise<UserPresenterDTO> {
    const user = await this.findUserByCondition({ username });
    return this.mapUserToDTO(user);
  }
  
  async findMany(token: string, args: FindMany<UserPresenterDTO>): Promise<UserPresenterDTO[]> {
    await this.permissionService.permissionMiddleware(token, ServicePermissions.READ_USER);
  
    const results = await this.userRepository.findMany({
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where,
    });
  
    if (!results || results.length === 0) {
      return [];
    }
  
    return results.map(result => this.mapUserToDTO(result));
  }

  async update(token: string, data: User): Promise<UserPresenterDTO> {
    const userToUpdate = await this.userRepository.findUnique({ where: { id: data.id } });
  
    if (!userToUpdate) {
      throw new UserNotFound();
    }
  
    const hasPermission = await this.permissionService.isSelf(token, data.id) || await this.permissionService.hasPermission(token, ServicePermissions.READ_USER);
  
    if (!hasPermission) {
      throw new AuthorDoesntHavePermission();
    }
  
    const updatedUser = await this.userRepository.update({
      ...data
    }, data.id);
  
    return this.mapUserToDTO(updatedUser);
  }
  
  async delete(token: string, targetId: string): Promise<UserPresenterDTO> {
    const hasPermission = await this.permissionService.isSelf(token, targetId) || await this.permissionService.hasPermission(token, ServicePermissions.DELETE_USER);
  
    if (!hasPermission) {
      throw new AuthorDoesntHavePermission();
    }
  
    const userToDelete = await this.findById(targetId);
  
    if (!userToDelete) {
      throw new UserNotFound();
    }
  
    // Future reminder comment
    // please future me, don't forget to implement a permission delete cascade
  
    const deletedUser = await this.userRepository.delete({ where: { id: targetId } });
  
    return this.mapUserToDTO(deletedUser);
  }

  // Authentication Methods
  public async login(data: User): Promise<{ token: string, user: UserPresenterDTO }> {
    const user = await this.userRepository.findUnique({ where: { username: data.username } });

    if (!user || !(await this.comparePassword(data.password, user.password))) {
      throw new WrongCredentials();
    }

    const token = this.tokenService.signToken(user.id as string);

    return { 
      token,
      user: this.mapUserToDTO(user)
    };
  }

  public async register(data: User){
    this.credentialsCheck(data);

    const emailCheck = await this.userRepository.findUnique({ where: { username: data.email }})
    const usernameCheck = await this.userRepository.findUnique({ where: { username: data.username }})

    if(emailCheck) throw new EmailAlreadyExists(data.email);
    if(usernameCheck) throw new UsernameAlreadyExists(data.username);

    const passwordHash = await this.generatePasswordHash(data.password)

    return await this.userRepository.create(
      {
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: data.email,
        name: data.name,
        username: data.username,
        password: passwordHash
      }
    )

  }
}

 // reset password
//  public async updatePassword(token: string, newPassword: string, passwordConfirmation: string){

//  }

//  public async sendResetPasswordRequest(username: string){
   
//  }

//  private async createResetPasswordToken(): Promise<string>{
//    return ""
//  }

//  private async deleteResetPasswordToken(): Promise<string>{
//    return ""
//  }