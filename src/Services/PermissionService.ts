import IDatabaseContext from "../Shared/Context/IDatabaseContext";
import { Permission } from "../Application/Entities/Permission";
import { PermissionUser } from "../Application/Entities/PermissionUser";
import { PermissionRepository } from "../Application/Repository/PermissionRepository";
import { PermissionUserRepository } from "../Application/Repository/PermissionUserRepository";
import { AuthorDoesntHavePermission, PermissionNotFound, UserAlreadyDoesntHavePermission, UserAlreadyHasPermission, UserDoesntHaveAnyPermission } from "../Shared/Handlers/Errors";
import { AuthService } from "./TokenService";

export enum ServicePermissions{
  'CREATE_USER',
  'READ_USER',
  'UPDATE_USER',
  'DELETE_USER',
  'READ_USER_PERMISSIONS',
  'UPDATE_USER_PERMISSIONS',
  'READ_ALL_PLAYLIST'
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

  public async getPermissionByPermissionName(permission: ServicePermissions): Promise<Permission>{
    return await this.permissionRepository.findUnique({
      where: {
        name: ServicePermissions[permission]
      }
    })
  }

  private async getPermissionIdByName(permission: ServicePermissions): Promise<string> {
    const permissionEntity = await this.getPermissionByPermissionName(permission);
    return permissionEntity.id;
  }

  public async permissionMiddleware(token: string, permission: ServicePermissions): Promise<void>{

    if(!await this.hasPermission(token, permission)) throw new AuthorDoesntHavePermission();

  }

  public async hasPermission(token: string, permission: ServicePermissions): Promise<boolean>{

    const userId = this.authService.getIdFromToken(token)

    if (!await this.getPermissionByPermissionName(permission)) throw new PermissionNotFound();

    const result = await this.permissionUserRepository.findUnique({
      where: {
        userId: userId,
        permissionId: await this.getPermissionIdByName(permission)
      }
    })

    if(result && result.permissionId){
      return true
    }

    return false;

  }

  public async addPermission(token: string, permission: ServicePermissions): Promise<PermissionUser>{

    const userId = this.authService.getIdFromToken(token)

    if(!await this.hasPermission(token, ServicePermissions.READ_USER_PERMISSIONS)) throw new AuthorDoesntHavePermission();

    if(await this.hasPermission(token, permission)) throw new UserAlreadyHasPermission();

    return await this.permissionUserRepository.create({
      userId,
      permissionId: await this.getPermissionIdByName(permission)
    })

  }

  public async removePermission(token: string, permission: ServicePermissions): Promise<PermissionUser>{

    const userId = this.authService.getIdFromToken(token)

    if(!await this.hasPermission(token, ServicePermissions.READ_USER_PERMISSIONS)) throw new AuthorDoesntHavePermission();

    if(!await this.hasPermission(token, permission)) throw new UserAlreadyDoesntHavePermission();

    return await this.permissionUserRepository.delete({
      where: {
        userId,
        permissionId: await this.getPermissionIdByName(permission)
      }
    })

  }

  public async getPermissionList(token: string): Promise<Permission[]>{

    if(!await this.hasPermission(token, ServicePermissions.READ_USER_PERMISSIONS)) throw new AuthorDoesntHavePermission();

    return await this.permissionRepository.findMany({});

  }

  public async getUserPermissions(token: string): Promise<Permission[]>{

    const userId = this.authService.getIdFromToken(token)

    const getUserPermissions = await this.permissionUserRepository.findMany({
      where: {
        userId
      }
    })

    if(!(getUserPermissions.length > 0)) throw new UserDoesntHaveAnyPermission();

    const result: Permission[] = await Promise.all(
      getUserPermissions.map(async (permissionUser: PermissionUser) => {
        return await this.permissionRepository.findUnique({
          where: {
            id: permissionUser.permissionId
          }
        });
      })
    );
    
    return result;

  }

  public async isSelf(token: string, targetId: string): Promise<boolean>{

    return this.authService.getIdFromToken(token) === targetId;

  }

}