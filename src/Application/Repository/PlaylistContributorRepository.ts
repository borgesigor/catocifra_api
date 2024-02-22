import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { PlaylistContributor } from "../Entities/PlaylistContributor";

export class ContributorRepository{

  private TABLE_NAME: string = "PlaylistContributor";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: PlaylistContributor): Promise<PlaylistContributor>{
    return await this.database.create<PlaylistContributor>(this.TABLE_NAME, {
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }
  
  async findMany(args: FindMany<PlaylistContributor>): Promise<PlaylistContributor[]>{
    return await this.database.findMany<PlaylistContributor>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<PlaylistContributor>): Promise<PlaylistContributor>{
    return await this.database.findUnique<PlaylistContributor>(this.TABLE_NAME, {
      where: args.where
    })
  }

  // without update because one contributor never be updated, only deleted

  async delete(args: Delete<PlaylistContributor>): Promise<PlaylistContributor>{
    return await this.database.delete<PlaylistContributor>(this.TABLE_NAME, args)
  }

}