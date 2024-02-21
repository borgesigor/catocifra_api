interface SongArtist {
  songId: string;
  artistId: string;
  createdAt: Date;
  updatedAt: Date;
  song: Song;
  artist: Artist;
}
