import { ACL } from "../Entities/ACL";
import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { v4 as uuidv4 } from 'uuid';

export class ACLRepository{

  private TABLE_NAME: string = "ACL";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: ACL): Promise<ACL> {
    return await this.database.create<ACL>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }
  
  async findMany(args: FindMany<ACL>): Promise<ACL[]> {
    return await this.database.findMany<ACL>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<ACL>): Promise<ACL>{
    return await this.database.findUnique<ACL>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: ACL, id: string): Promise<ACL>{
    return await this.database.update<ACL>(this.TABLE_NAME, {
      data: {
        ...data,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    })
  }

  async delete(args: Delete<ACL>): Promise<ACL>{
    return await this.database.delete<ACL>(this.TABLE_NAME, args)
  }

}