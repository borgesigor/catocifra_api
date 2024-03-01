import { UserRepository } from '../Application/Repository/UserRepository';
import { AuthorDoesntHavePermission, EmailAlreadyExists, InvalidEmail, InvalidPassword, InvalidToken, InvalidUsername, PasswordDoesntMatch, UserNotFound, UsernameAlreadyExists, WrongCredentials } from "../Shared/Handlers/Errors";
import { UserPresenterDTO } from '../DTO/UserPresenterDTO';
import { PermissionService, ServicePermissions } from './PermissionService';
import { User } from '../Application/Entities/User';
import { isEmailValid, isPasswordValid, isUsernameValid } from '../Shared/Helpers/Validators';
import { getIdFromToken, signToken } from '../Shared/Helpers/Token';
import { ResetPasswordTokenRepository } from '../Application/Repository/ResetPasswordTokenRepository';
import { MailService } from './MailService';
import IDatabaseContext, { FindMany } from '../Shared/Context/IDatabaseContext';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export class UserService{
  private userRepository: UserRepository;
  private permissionService: PermissionService;
  private resetPasswordTokenRepository: ResetPasswordTokenRepository;
  private mailService: MailService
  private PASSWORD_SECRET: string;

  constructor(private database: IDatabaseContext) {
    this.userRepository = new UserRepository(database);
    this.permissionService = new PermissionService(database);
    this.resetPasswordTokenRepository = new ResetPasswordTokenRepository(database)
    this.mailService = new MailService()
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
  
    if(!user) throw new UserNotFound();
  
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

  public async findById(id: string): Promise<UserPresenterDTO> {
    const user = await this.findUserByCondition({ id });
    return this.mapUserToDTO(user);
  }
  
  public async findByEmail(email: string): Promise<UserPresenterDTO> {
    const user = await this.findUserByCondition({ email });
    return this.mapUserToDTO(user);
  }
  
  public async findByUsername(username: string): Promise<UserPresenterDTO> {
    const user = await this.findUserByCondition({ username });
    return this.mapUserToDTO(user);
  }
  
  public async findMany(token: string, args: FindMany<UserPresenterDTO>): Promise<UserPresenterDTO[]> {
    await this.permissionService.permissionMiddleware(token, ServicePermissions.READ_USER);
  
    const results = await this.userRepository.findMany({
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where,
    });
  
    if (!results || results.length === 0) throw new UserNotFound();
  
    return results.map(result => this.mapUserToDTO(result));
  }

  public async update(token: string, target: User): Promise<UserPresenterDTO> {
    await this.findById(target.id);

    await this.permissionService.isSelfOrHasPermission(token, target.id, ServicePermissions.UPDATE_USER)
  
    const updatedUser = await this.userRepository.update({
      ...target
    }, target.id);
  
    return this.mapUserToDTO(updatedUser);
  }
  
  public async delete(token: string, targetId: string): Promise<UserPresenterDTO> {
    await this.findById(targetId);

    await this.permissionService.isSelfOrHasPermission(token, targetId, ServicePermissions.DELETE_USER)
  
  
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

    const token = signToken(user.id as string);

    return { 
      token,
      user: this.mapUserToDTO(user)
    };
  }

  public async register(data: User): Promise<UserPresenterDTO>{
    this.credentialsCheck(data);

    const emailCheck = await this.userRepository.findUnique({ where: { username: data.email }})
    const usernameCheck = await this.userRepository.findUnique({ where: { username: data.username }})

    if(emailCheck) throw new EmailAlreadyExists(data.email);
    if(usernameCheck) throw new UsernameAlreadyExists(data.username);

    const passwordHash = await this.generatePasswordHash(data.password)

    const user = await this.userRepository.create(
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

    return this.mapUserToDTO(user)
  }

  public async sendResetPasswordRequest(token: string): Promise<void>{
    const userId = getIdFromToken(token)
    const user = await this.findById(userId)

    await this.mailService.sendResetPassword(user.email, user.name, token)

    await this.resetPasswordTokenRepository.create({
      userid: user.id,
      email: user.email,
    })
  }

  public async validateResetPasswordRequest(token: string): Promise<boolean>{
    const getToken = await this.resetPasswordTokenRepository.findUnique({
      where: {
        token: token
      }
    })

    if(!getToken) throw new InvalidToken();

    return true;
  }

  public async updatePassword(token: string, newPassword: string, passwordConfirmation: string): Promise<UserPresenterDTO>{
    await this.validateResetPasswordRequest(token);

    if(newPassword !== passwordConfirmation) throw new PasswordDoesntMatch();

    const userId = getIdFromToken(token)
    const user = await this.findById(userId)

    if(!user) throw new UserNotFound()

    const passwordHash = await this.generatePasswordHash(newPassword)

    const updatedUser = await this.userRepository.update({
      password: passwordHash
    }, userId)

    return this.mapUserToDTO(updatedUser)
  }
}