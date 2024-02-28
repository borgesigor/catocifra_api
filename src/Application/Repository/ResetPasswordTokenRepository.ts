import { ResetPasswordToken } from "../Entities/ResetPasswordToken";
import IDatabaseContext, { Delete, FindUnique } from "../../Shared/Context/IDatabaseContext";
import { signToken } from "../../Shared/Helpers/Token";

export class ResetPasswordTokenRepository{

  private TABLE_NAME: string = "ResetPasswordToken";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Omit<ResetPasswordToken, 'token' | 'expiration'>): Promise<ResetPasswordToken> {
    return await this.database.create<ResetPasswordToken>(this.TABLE_NAME, {
      data: {
        ...data,
        token: signToken(data.userid),
        expiration: new Date(new Date().getTime() + 15 * 60 * 1000) // add 15 minutes relative to now
      }
    })
  }
  
  //

  async findUnique(args: FindUnique<ResetPasswordToken>): Promise<ResetPasswordToken>{
    return await this.database.findUnique<ResetPasswordToken>(this.TABLE_NAME, {
      where: args.where
    })
  }

  //

  async delete(args: Delete<ResetPasswordToken>): Promise<ResetPasswordToken>{
    return await this.database.delete<ResetPasswordToken>(this.TABLE_NAME, args)
  }
}