interface CommentTablature {
  commentId: string;
  tablatureId: string;
  createdAt: Date;
  updatedAt: Date;
  comment: Comment;
  tablature: Tablature;
}