import { UserRepository } from '../Application/Repository/UserRepository';
import { User } from '../Application/Entities/User';
import { DoesntHavePermission, EmailAlreadyCadastred, InvalidEmail, InvalidPassword, UnexpectedError, UserNotFound } from "../Shared/Handlers/Errors";
import IDatabaseContext, { FindMany } from '../Shared/Context/IDatabaseContext';
import { isEmailValid, isPasswordValid } from '../Shared/Utils/Validators';
import { Profile } from '../Application/Entities/Profile';
import { UserPresenterDTO } from '../DTO/UserPresenterDTO';

export class UserService{
  private userRepository: UserRepository;

  constructor(database: IDatabaseContext){
    this.userRepository = new UserRepository(database)
  }

  async hasPermission(userId: string, permissionName: string): Promise<boolean>{
    try {
      
      const user = await this.userRepository.findUnique({
        where: {
          id: userId
        }
      })

      if(!user) throw new UserNotFound()

      return user.permission?.includes(permissionName) as boolean

    } catch (err) {
      throw err
    }
  }

  async register(data: User): Promise<UserPresenterDTO>{
    try {

      if(!isEmailValid(data.email)) throw new InvalidEmail();

      if(!isPasswordValid(data.password)) throw new InvalidPassword();
      
      if(await this.findByEmail(data.email)) throw new EmailAlreadyCadastred();

      const result = await this.userRepository.create(data)

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async findById(id: string): Promise<UserPresenterDTO>{
    try {

      const result = await this.userRepository.findUnique({
        where: {
          id: id
        }
      })

      if(!result) return null as unknown as UserPresenterDTO

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async findByEmail(email: string): Promise<UserPresenterDTO>{
    try {

      const result = await this.userRepository.findUnique({
        where: {
          email: email
        }
      })

      if(!result) return null as unknown as UserPresenterDTO

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async findByUsername(username: string): Promise<UserPresenterDTO>{
    try {

      const result = await this.userRepository.findUnique({
        where: {
          username: username
        }
      })

      if(!result) return null as unknown as UserPresenterDTO

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async findMany(authorId: string, args: FindMany<UserPresenterDTO>): Promise<UserPresenterDTO[]>{
    try {

      if(!await this.hasPermission(authorId, 'list_all_users')) throw new DoesntHavePermission()

      const result = await this.userRepository.findMany({
        order: args.order,
        skip: args.skip,
        take: args.take,
        where: args.where
      })

      if(!result) return null as unknown as UserPresenterDTO[]

      return result.map(result => {
        return {
          id: result.id as string,
          createdAt: result.createdAt as Date,
          username: result.username,
          email: result.email,
          name: result.name,
        }
      })

    } catch (err) {
      throw err
    }
  }

  async updatePermission(authorId: string, targetId: string, newPermission: string[]): Promise<UserPresenterDTO>{
    try {

      const checkHasPermission = await this.hasPermission(authorId, 'update_user_permission')

      if(!checkHasPermission) throw new DoesntHavePermission()

      const user = await this.userRepository.findUnique({
        where: {
          id: targetId
        }
      })

      if(!user) throw new UserNotFound()

      const result = await this.userRepository.update({
        ...user,
        permission: newPermission
      }, targetId)

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async updatePassword(authorId: string, targetId: string, newPassword: string): Promise<UserPresenterDTO>{
    try {

      const checkHasPermission = await this.hasPermission(authorId, 'update_user_password')
      const checkIsSelf = authorId == targetId

      if(!checkHasPermission && !checkIsSelf) throw new DoesntHavePermission()

      if(!isPasswordValid(newPassword)) throw new InvalidPassword()

      const user = await this.userRepository.findUnique({
        where: {
          id: targetId
        }
      })

      if(!user) throw new UserNotFound()

      const result = await this.userRepository.update({
        ...user,
        password: newPassword
      }, targetId)

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async updateEmail(authorId: string, targetId: string, newEmail: string): Promise<UserPresenterDTO>{
    try {

      const checkHasPermission = await this.hasPermission(authorId, 'update_user_password')
      const checkIsSelf = authorId == targetId

      if(!checkHasPermission && !checkIsSelf) throw new DoesntHavePermission()

      if(!isEmailValid(newEmail)) throw new InvalidEmail()

      if(await this.findByEmail(newEmail)) throw new EmailAlreadyCadastred()

      const user = await this.userRepository.findUnique({
        where: {
          id: targetId
        }
      })

      if(!user) throw new UserNotFound()

      const result = await this.userRepository.update({
        ...user,
        email: newEmail
      }, targetId)

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async updateName(authorId: string, targetId: string, newName: string): Promise<UserPresenterDTO>{
    try {

      const checkHasPermission = await this.hasPermission(authorId, 'update_user_password')
      const checkIsSelf = authorId == targetId

      if(!checkHasPermission && !checkIsSelf) throw new DoesntHavePermission()

      const user = await this.userRepository.findUnique({
        where: {
          id: targetId
        }
      })

      if(!user) throw new UserNotFound()

      const result = await this.userRepository.update({
        ...user,
        name: newName,
      }, targetId)

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  async delete(authorId: string, targetId: string): Promise<UserPresenterDTO>{
    try {

      const checkPermission = await this.hasPermission(authorId, 'delete_users')
      const checkIsSelf = authorId == targetId

      if(!checkPermission && !checkIsSelf) throw new DoesntHavePermission()
      
      if(!await this.findById(targetId)) throw new UserNotFound()

      const result = await this.userRepository.delete(targetId)

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        username: result.username,
        email: result.email,
        name: result.name,
      }

    } catch (err) {
      throw err
    }
  }

  // private async createProfile(bio: string, userId: string): Promise<Profile>{
  //   try {

  //     const user = await this.getById(userId)

  //     if(!await this.getById(userId)) throw new UserNotFound()

  //     const createAvatar = new MediaService(this.database)

  //     http.get(`https://api.dicebear.com/7.x/identicon/png?seed=${user.name}&scale=50`, (res) =>{
  //       res.pipe(createAvatar.save())
  //     })

  //     const data: Profile = { 
  //       bio: bio,
  //       userId: userId,
  //       profileImageId: createAvatar.getUUID(),
  //       coverImageId: ''
  //     }

  //     const profile: Profile = await this.profileRepository.create(data)

  //     return profile
  //   } catch (err) {
  //     throw err
  //   }
  // }

}