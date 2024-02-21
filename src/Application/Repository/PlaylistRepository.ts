import { Playlist } from "../Entities/Playlist";
import IDatabaseContext, { FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { v4 as uuidv4 } from 'uuid';

export class PlaylistRepository{
  
  private TABLE_NAME: string = "Playlist";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Playlist): Promise<Playlist>{
    return await this.database.create<Playlist>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }

  async findMany(args: FindMany<Playlist>): Promise<Playlist[]> {
    return await this.database.findMany<Playlist>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<Playlist>): Promise<Playlist>{
    return await this.database.findUnique<Playlist>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: Playlist, id: string): Promise<Playlist>{
    return await this.database.update<Playlist>(this.TABLE_NAME, {
      data: {
        ...data,
        name: data.name,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    })
  }

  async delete(id: string): Promise<Playlist>{
    return await this.database.delete<Playlist>(this.TABLE_NAME, {
      where: {
        id: id
      }
    })
  }
}