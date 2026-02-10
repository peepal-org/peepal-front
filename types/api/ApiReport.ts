export type ReportDto = {
  userId: number;
  toiletId: number;
  type: 'closed' | 'dirty' | 'maintenance' | 'other';
  description: string;
}