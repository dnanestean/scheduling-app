export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  name?: string;
  country?: string;
}
