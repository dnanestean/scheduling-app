export interface PTO {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  username?: string;
  name?: string;
}
