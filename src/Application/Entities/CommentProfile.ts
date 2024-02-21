interface CommentProfile {
  commentId: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  comment: Comment;
  profile: Profile;
}