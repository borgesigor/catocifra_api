export interface Playlist {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}