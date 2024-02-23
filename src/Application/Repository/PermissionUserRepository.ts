import { PermissionUser } from '../Entities/PermissionUser';
import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";

export class PermissionUserRepository{

  private TABLE_NAME: string = "Permission";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: PermissionUser): Promise<PermissionUser> {
    return await this.database.create<PermissionUser>(this.TABLE_NAME, {
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }
  
  async findMany(args: FindMany<PermissionUser>): Promise<PermissionUser[]> {
    return await this.database.findMany<PermissionUser>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<PermissionUser>): Promise<PermissionUser>{
    return await this.database.findUnique<PermissionUser>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: PermissionUser, userId: string, permissionId: string): Promise<PermissionUser>{
    return await this.database.update<PermissionUser>(this.TABLE_NAME, {
      data: {
        ...data,
      },
      where: {
        userId,
        permissionId
      }
    })
  }

  async delete(args: Delete<PermissionUser>): Promise<PermissionUser>{
    return await this.database.delete<PermissionUser>(this.TABLE_NAME, args)
  }

}