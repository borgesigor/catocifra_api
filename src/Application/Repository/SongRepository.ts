import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { Song } from "../Entities/Song";
import { v4 as uuidv4 } from 'uuid';

export class SongRepository{

  private TABLE_NAME: string = "Song";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Song): Promise<Song> {
    return await this.database.create<Song>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  async findMany(args: FindMany<Song>): Promise<Song[]> {
    return await this.database.findMany<Song>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<Song>): Promise<Song>{
    return await this.database.findUnique<Song>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: Song, id: string): Promise<Song>{
    return await this.database.update<Song>(this.TABLE_NAME, {
      data: {
        ...data,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    })
  }

  async delete(args: Delete<Song>): Promise<Song>{
    return await this.database.delete<Song>(this.TABLE_NAME, args)
  }

}