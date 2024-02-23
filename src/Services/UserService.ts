import { UserRepository } from '../Application/Repository/UserRepository';
import { AuthorDoesntHavePermission, UserNotFound } from "../Shared/Handlers/Errors";
import { UserPresenterDTO } from '../DTO/UserPresenterDTO';
import { PermissionService, ServicePermissions } from './PermissionService';
import IDatabaseContext, { FindMany } from '../Shared/Context/IDatabaseContext';

export class UserService{
  private userRepository: UserRepository;
  private permissionService: PermissionService;

  constructor(database: IDatabaseContext){
    this.userRepository = new UserRepository(database)
    this.permissionService = new PermissionService(database)
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

  async findMany(authorToken: string, args: FindMany<UserPresenterDTO>): Promise<UserPresenterDTO[]>{
    try {

      if (
        !await this.permissionService.hasPermission(authorToken, ServicePermissions.READ_USER)
      ){
        throw new AuthorDoesntHavePermission();
      }

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

  async updateName(authorToken: string, targetId: string, newName: string): Promise<UserPresenterDTO>{
    try {

      if (
        !await this.permissionService.isSelf(authorToken, targetId) &&
        !await this.permissionService.hasPermission(authorToken, ServicePermissions.UPDATE_USER)
      ){
        throw new AuthorDoesntHavePermission();
      }

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

  async delete(authorToken: string, targetId: string): Promise<UserPresenterDTO>{
    try {

      if (
        !await this.permissionService.isSelf(authorToken, targetId) &&
        !await this.permissionService.hasPermission(authorToken, ServicePermissions.DELETE_USER)
      ){
        throw new AuthorDoesntHavePermission();
      }
      
      if(!await this.findById(targetId)) throw new UserNotFound()

      // please future me, don't forget to implement a permission delete cascade

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

}