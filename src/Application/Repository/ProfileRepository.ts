import { Profile } from "../Entities/Profile";
import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { v4 as uuidv4 } from 'uuid';

export class ProfileRepository{

  private TABLE_NAME: string = "Profile";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Profile): Promise<Profile> {
    return await this.database.create<Profile>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }
  
  async findMany(args: FindMany<Profile>): Promise<Profile[]> {
    return await this.database.findMany<Profile>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<Profile>): Promise<Profile>{
    return await this.database.findUnique<Profile>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: Profile, id: string): Promise<Profile>{
    return await this.database.update<Profile>(this.TABLE_NAME, {
      data: {
        ...data,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    })
  }

  async delete(args: Delete<Profile>): Promise<Profile>{
    return await this.database.delete<Profile>(this.TABLE_NAME, args)
  }
}