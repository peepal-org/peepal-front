export type IssueCommentKey = 'spam' | 'offensive' | 'other';

export interface IssueCommentOption {
  key: IssueCommentKey;
  label: string;
}