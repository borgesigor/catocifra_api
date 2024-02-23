import { Permission } from "../Entities/Permission";
import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { v4 as uuidv4 } from 'uuid';

export class PermissionRepository{

  private TABLE_NAME: string = "Permission";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Permission): Promise<Permission> {
    return await this.database.create<Permission>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
      }
    })
  }
  
  async findMany(args: FindMany<Permission>): Promise<Permission[]> {
    return await this.database.findMany<Permission>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<Permission>): Promise<Permission>{
    return await this.database.findUnique<Permission>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: Permission, id: string): Promise<Permission>{
    return await this.database.update<Permission>(this.TABLE_NAME, {
      data: {
        ...data,
      },
      where: {
        id: id
      }
    })
  }

  async delete(args: Delete<Permission>): Promise<Permission>{
    return await this.database.delete<Permission>(this.TABLE_NAME, args)
  }

}