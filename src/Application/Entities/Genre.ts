interface Genre {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  songGenre: SongGenre[];
}