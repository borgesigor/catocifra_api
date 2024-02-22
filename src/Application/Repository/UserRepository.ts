import { User } from "../Entities/User";
import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { v4 as uuidv4 } from 'uuid';

export class UserRepository{

  private TABLE_NAME: string = "User";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: User): Promise<User> {
    return await this.database.create<User>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }
  
  async findMany(args: FindMany<User>): Promise<User[]> {
    return await this.database.findMany<User>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<User>): Promise<User>{
    return await this.database.findUnique<User>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: Partial<User>, id: string): Promise<User>{
    return await this.database.update<User>(this.TABLE_NAME, {
      data: {
        ...data,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    })
  }

  async delete(args: Delete<User>): Promise<User>{
    return await this.database.delete<User>(this.TABLE_NAME, args)
  }
}