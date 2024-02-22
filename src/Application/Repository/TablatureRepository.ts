import IDatabaseContext, { Delete, FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { Tablature } from "../Entities/Tablature";
import { v4 as uuidv4 } from 'uuid';

export class TablatureRepository{

  private TABLE_NAME: string = "Tablature";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Tablature): Promise<Tablature> {
    return await this.database.create<Tablature>(this.TABLE_NAME, {
      data: {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  async findMany(args: FindMany<Tablature>): Promise<Tablature[]> {
    return await this.database.findMany<Tablature>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })
  }

  async findUnique(args: FindUnique<Tablature>): Promise<Tablature>{
    return await this.database.findUnique<Tablature>(this.TABLE_NAME, {
      where: args.where
    })
  }

  async update(data: Tablature, id: string): Promise<Tablature>{
    return await this.database.update<Tablature>(this.TABLE_NAME, {
      data: {
        ...data,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    })
  }

  async delete(args: Delete<Tablature>): Promise<Tablature>{
    return await this.database.delete<Tablature>(this.TABLE_NAME, args)
  }
}