interface Artist {
  id: string;
  office: string;
  createdAt: Date;
  updatedAt: Date;
  songs: SongArtist[];
  userId: string;
  user: User;
}