export type IssueKey = 'closed' | 'dirty' | 'maintenance' | 'other';

export interface IssueOption {
  key: IssueKey;
  label: string;
}