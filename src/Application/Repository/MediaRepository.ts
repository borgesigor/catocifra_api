import { Media } from "../Entities/Media";
import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { v4 as uuidv4 } from 'uuid';

export class MediaRepository{
  
  private TABLE_NAME: string = "Media";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Media): Promise<Media> {
    return await this.database.create<Media>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }
  
  async findMany(args: FindMany<Media>): Promise<Media[]> {
    return await this.database.findMany<Media>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<Media>): Promise<Media>{
    return await this.database.findUnique<Media>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: Media, id: string): Promise<Media>{
    return await this.database.update<Media>(this.TABLE_NAME, {
      data: {
        ...data,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    })
  }

  async delete(args: Delete<Media>): Promise<Media>{
    return await this.database.delete<Media>(this.TABLE_NAME, args)
  }
}