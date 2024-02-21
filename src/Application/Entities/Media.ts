export interface Media {
  id?: string;
  path: string;
  altText: string;
  tags: string[];
  mediaType: 'image' | 'video' | 'audio';
  createdAt?: Date;
  updatedAt?: Date;
}
