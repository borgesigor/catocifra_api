import { UserRepository } from '../Application/Repository/UserRepository';
import { User } from '../Application/Entities/User';
import { AlreadyHasPermission, DoesntHavePermission, EmailAlreadyCadastred, InvalidEmail, InvalidPassword, InvalidUsername, UnexpectedError, UserNotFound, UsernameAlreadyCadastred } from "../Shared/Handlers/Errors";
import IDatabaseContext, { FindMany } from '../Shared/Context/IDatabaseContext';
import { isEmailValid, isPasswordValid, isUsernameValid } from '../Shared/Utils/Validators';
import { UserPresenterDTO } from '../DTO/UserPresenterDTO';
import { ACLRepository } from '../Application/Repository/ACLRepository';
import { ACL } from '../Application/Entities/ACL';

export class UserService{
  private userRepository: UserRepository;
  private aclRepository: ACLRepository;

  constructor(database: IDatabaseContext){
    this.userRepository = new UserRepository(database)
    this.aclRepository = new ACLRepository(database)
  }

  async register(data: User): Promise<UserPresenterDTO>{
    try {

      if(!isEmailValid(data.email)) throw new InvalidEmail();
      
      if(!isPasswordValid(data.password)) throw new InvalidPassword();

      if(!isUsernameValid(data.username)) throw new InvalidUsername();
      
      if(await this.findByEmail(data.email)) throw new EmailAlreadyCadastred();
      
      if(await this.findByUsername(data.username)) throw new UsernameAlreadyCadastred();

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

      const checkHasPermission = await this.hasPermission(authorId, 'update_user_email')
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

      const checkHasPermission = await this.hasPermission(authorId, 'update_user_name')
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

      const checkPermission = await this.hasPermission(authorId, 'delete_user')
      const checkIsSelf = authorId == targetId

      if(!checkPermission && !checkIsSelf) throw new DoesntHavePermission()
      
      if(!await this.findById(targetId)) throw new UserNotFound()

      await this.aclRepository.delete({
        where: {
          userId: targetId
        }
      })

      const result = await this.userRepository.delete({
        where: {
          id: targetId
        }
      })

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

  async hasPermission(userId: string, permissionName: string): Promise<boolean>{
    try {
      
      if(!await this.findById(userId)) throw new UserNotFound()

      const result = await this.aclRepository.findUnique({
        where: {
          userId: userId
        }
      })

      if(result && result.permission.includes(permissionName)) return true

      return false

    } catch (err) {
      throw err
    }
  }

  async addPermission(authorId: string, targetId: string, permissionName: string): Promise<ACL>{
    try {

      // check if author has permission to add permission
      if(!await this.hasPermission(authorId, "add_permission")) throw new DoesntHavePermission();

      if(await this.hasPermission(targetId, permissionName)) throw new AlreadyHasPermission();

      const getPermissions = await this.aclRepository.findUnique({ where: { userId: targetId } })

      if(!getPermissions){
        return await this.aclRepository.create({ userId: targetId, permission: [permissionName] })
      }

      return await this.aclRepository.update({ 
        userId: targetId, 
        permission: getPermissions.permission ? [...getPermissions.permission, permissionName] : [permissionName]
      }, targetId)

    } catch (err) {
      throw err
    }
  }

  async removePermission(authorId: string, targetId: string, permissionName: string): Promise<ACL>{
    try {

      if(!await this.hasPermission(authorId, "add_permission")) throw new DoesntHavePermission();

      if(!await this.hasPermission(targetId, permissionName)) throw new DoesntHavePermission();

      const getPermissions = await this.aclRepository.findUnique({ 
        where: { userId: targetId } 
      })

      if(!getPermissions){
        return await this.aclRepository.create({ 
          userId: targetId, 
          permission: [permissionName] 
        })
      }

      return await this.aclRepository.update({ 
        userId: targetId, 
        permission: getPermissions.permission ? [...getPermissions.permission, permissionName] : [permissionName]
      }, targetId)

    } catch (err) {
      throw err
    }
  }

}