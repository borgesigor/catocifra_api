interface SongCompositor {
  songId: string;
  compositorId: string;
  createdAt: Date;
  updatedAt: Date;
  song: Song;
  compositor: Compositor;
}