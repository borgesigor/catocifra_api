interface Comment {
  id: string;
  authorId: string;
  author: User;
  text: string;
  replies: Comment[];
  parentId?: string | null;
  parent?: Comment | null;
  createdAt: Date;
  updatedAt: Date;
  commentProfile?: CommentProfile | null;
  commentTablature?: CommentTablature | null;
}