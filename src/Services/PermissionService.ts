import { Permission } from "../Application/Entities/Permission";
import { PermissionUser } from "../Application/Entities/PermissionUser";
import { PermissionRepository } from "../Application/Repository/PermissionRepository";
import { PermissionUserRepository } from "../Application/Repository/PermissionUserRepository";
import IDatabaseContext from "../Shared/Context/IDatabaseContext";
import { AuthorDoesntHavePermission, PermissionNotFound, UserAlreadyHasPermission, UserDoesntHavePermission } from "../Shared/Handlers/Errors";
import { AuthService } from "./AuthService";

export enum ServicePermissions{
  'CREATE_USER',
  'READ_USER',
  'UPDATE_USER',
  'DELETE_USER',
  'READ_USER_PERMISSIONS',
  'UPDATE_USER_PERMISSIONS',
  'CREATE_PLAYLIST',
  'READ_PLAYLIST',
  'UPDATE_PLAYLIST',
  'DELETE_PLAYLIST',
}

export class PermissionService{

  private permissionRepository: PermissionRepository;
  private permissionUserRepository: PermissionUserRepository;
  private authService: AuthService;

  constructor(database: IDatabaseContext){
    this.permissionRepository = new PermissionRepository(database)
    this.permissionUserRepository = new PermissionUserRepository(database)
    this.authService = new AuthService(database)
  }

  async getPermissionByPermissionName(permission: ServicePermissions): Promise<Permission>{
    return await this.permissionRepository.findUnique({
      where: {
        name: ServicePermissions[permission]
      }
    })
  }

  async hasPermission(userId: string, permission: ServicePermissions): Promise<boolean>{

    if (!await this.getPermissionByPermissionName(permission)) throw new PermissionNotFound();

    const result = await this.permissionUserRepository.findUnique({
      where: {
        userId,
        permissionId: (await this.getPermissionByPermissionName(permission)).id
      }
    })

    if(result && result.permissionId){
      return true
    }

    return false;
  }

  async addPermission(userId: string, permission: ServicePermissions): Promise<PermissionUser>{

    if(!await this.hasPermission(userId, ServicePermissions.READ_USER_PERMISSIONS)) throw new AuthorDoesntHavePermission();

    if(await this.hasPermission(userId, permission)) throw new UserAlreadyHasPermission();

    return await this.permissionUserRepository.create({
      userId,
      permissionId: (await this.getPermissionByPermissionName(permission)).id,
    })

  }

  async removePermission(userId: string, permission: ServicePermissions): Promise<PermissionUser>{

    if(!await this.hasPermission(userId, ServicePermissions.READ_USER_PERMISSIONS)) throw new AuthorDoesntHavePermission();

    if(!await this.hasPermission(userId, permission)) throw new UserDoesntHavePermission();

    return await this.permissionUserRepository.delete({
      where: {
        userId,
        permissionId: (await this.getPermissionByPermissionName(permission)).id
      }
    })

  }

  async getPermissions(userId: string): Promise<Permission[]>{

    const getUserPermissions = await this.permissionUserRepository.findMany({
      where: {
        userId
      }
    })

    if(!getUserPermissions.length) throw new UserDoesntHavePermission();

    const result: unknown = getUserPermissions.map(async (permissionUser: PermissionUser) => {
      return await this.permissionRepository.findUnique({
        where: {
          id: permissionUser.permissionId
        }
      })
    })

    return result as Promise<Permission[]>;
  }

  async isSelf(authorToken: string, targetId: string): Promise<boolean>{

    const decodedAuthorToken = await this.authService.decodeToken(authorToken);

    if(decodedAuthorToken.id !== targetId) return false;

    return true

  }

}