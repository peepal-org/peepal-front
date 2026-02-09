export interface ReportDto {
  userId: number;
  toiletId: number;
  type: 'closed' | 'dirty' | 'maintenance' | 'other';
  description: string;
}