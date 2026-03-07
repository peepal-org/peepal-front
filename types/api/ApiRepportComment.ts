export type ReportCommentDto = {
  userId: number;
  commentId: number;
  type: 'spam' | 'offensive' | 'other';
  description: string;
}