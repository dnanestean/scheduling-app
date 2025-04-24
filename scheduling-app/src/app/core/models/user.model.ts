export interface User {
  id: number;
  username: string;
  name: string;
  country: string;
  role: 'user' | 'admin';
}
