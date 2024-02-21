import IDatabase, { Create, Delete, FindMany, FindUnique, Update } from '../../../Shared/Context/IDatabaseContext'
import { Client } from 'pg'
import { UnexpectedError } from '../../../Shared/Handlers/Errors'
import dovenv from 'dotenv'

const DEFAULT_ITEMS_PER_PAGE = 10;
const MAX_ITEMS_PER_PAGE = 50;

export class DatabaseAdapter implements IDatabase{

  async create<T>(table: String, args: Create<T>): Promise<T> {

    const db = new Client(dovenv.config().parsed?.DATABASE_URL);

    await db.connect().catch((err)=>{
      throw new UnexpectedError(err)
    })

    const keys = Object.keys(args.data as Object);
    const values = Object.values(args.data as Object);

    const columns = keys.map((key, index) => `"${key}"`).join(', ');

    const placeholders = values.map((value, index) => `$${index + 1}`).join(', ')

    const query = {
      text: `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    };

    const result = await db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    db.end()

    return result.rows[0] as T;
  }

  async findMany<T>(table: String, args?: FindMany<T>): Promise<T[]> {

    const db = new Client(dovenv.config().parsed?.DATABASE_URL);

    await db.connect().catch((err)=>{
      throw new UnexpectedError(err)
    })

    let where = ""
    let order = ""
    let paginator = `LIMIT ${DEFAULT_ITEMS_PER_PAGE}`
    let values = []

    if(args?.where){

      let [keys, data] = [Object.keys(args.where as Object), Object.values(args.where as Object)]

      const updatedWhereKeys = keys.map((key, index) => `"${key}"=$${index + 1}`).join(" AND ");

      where = `WHERE ${updatedWhereKeys}`
      values = data

    }

    if(args?.order){

      let [orderBy, orderDirection] = [args.order.by, args.order.direction]

      order = `ORDER BY "${orderBy}" ${orderDirection || 'DESC'}`

    }

    if(args?.take){

      if(args.take > MAX_ITEMS_PER_PAGE) { args.take = MAX_ITEMS_PER_PAGE } // Don't allow more than N items per page

      paginator = `LIMIT ${args.take || ""} OFFSET ${args.take * (args.skip || 0)}`;

    }

    const query = {
      text: `SELECT * FROM "${table}" ${where} ${order} ${paginator}`,
      values
    }

    const result = await db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    db.end()

    return result.rows as T[];
  }

  async findUnique<T>(table: String, args: FindUnique<T>): Promise<T> {

    const db = new Client(dovenv.config().parsed?.DATABASE_URL);

    await db.connect().catch((err)=>{
      throw new UnexpectedError(err)
    })

    let [whereKeys, values] = [Object.keys(args.where as Object), Object.values(args.where as Object)]

    const updatedWhereKeys = whereKeys.map((key, index) => `"${key}"=$${index + 1}`).join(" AND ");

    const query = {
      text: `SELECT * FROM "${table}" WHERE ${updatedWhereKeys}`,
      values
    }

    const result = await db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    db.end()

    return result.rows[0] as T;
  }
  
  async update<T>(table: String, args: Update<T>): Promise<T> {

    const db = new Client(dovenv.config().parsed?.DATABASE_URL);

    await db.connect().catch((err)=>{
      throw new UnexpectedError(err)
    })

    let [dataKeys, dataValues] = [Object.keys(args.data as Object), Object.values(args.data as Object)]
    let [whereKeys, whereData] = [Object.keys(args.where as Object), Object.values(args.where as Object)]

    const updatedDataKeys = dataKeys.map((key, index) => `"${key}"=$${index + 1}`).join(', ');
    const updatedWhereKeys = whereKeys.map((key, index) => `"${key}"=$${dataKeys.length + index + 1}`).join(" AND ");
    const values = [...dataValues, ...whereData]

    const query = {
      text: `UPDATE "${table}" SET ${updatedDataKeys} WHERE ${updatedWhereKeys} RETURNING *`,
      values
    }

    const result = await db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    db.end()

    return result.rows[0] as T;
  }

  async delete<T>(table: String, args: Delete<T>): Promise<T> {

    const db = new Client(dovenv.config().parsed?.DATABASE_URL);

    await db.connect().catch((err)=>{
      throw new UnexpectedError(err)
    })

    let [whereKeys, values] = [Object.keys(args.where as Object), Object.values(args.where as Object)]

    const updatedWhereKeys = whereKeys.map((key, index) => `"${key}"=$${index + 1}`).join(" AND ");

    const query = {
      text: `DELETE FROM "${table}" WHERE ${updatedWhereKeys} RETURNING *`,
      values
    }

    const result = await db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    db.end()

    return result.rows[0] as T;
  }
}