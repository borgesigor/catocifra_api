export interface Create<T>{
  data: T
}

export interface FindUnique<T>{
  where: Partial<T>
}

interface Order{
  by: String,
  direction?: String
}

export interface FindMany<T>{
  where?: Partial<T>,
  order?: Order,
  take?: number,
  skip?: number
}

export interface Update<T>{
  where: Partial<T>,
  data: Partial<T>
}

export interface Delete<T>{
  where: Partial<T>,
}

export default interface IDatabaseContext {
  create<T>(table: String, data: Create<T>): Promise<T>;
  findMany<T>(table: String, args: FindMany<T>): Promise<T[]>;
  findUnique<T>(table: String, args: FindUnique<T>): Promise<T>;
  update<T>(table: String, data: Update<T>): Promise<T>;
  delete<T>(table: String, data: Delete<T>): Promise<T>;
}