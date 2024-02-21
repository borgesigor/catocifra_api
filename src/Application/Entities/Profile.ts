export interface Profile {
  id?: string;
  userId: string;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
  profileImageId: string;
  coverImageId: string;
}