export interface ACL{
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  permission: String[];
}