interface Compositor {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  songs: SongCompositor[];
  userId: string;
  user: User;
}