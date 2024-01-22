export interface UserData {
  id?: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  status?: string;
  password?: 'string';
  approved?: boolean;
  admin: boolean;
  createdAt?: string;
}

export interface Status {
  value: string;
  viewValue: string;
}

export interface User {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  approved?: boolean;
  admin?: boolean;
}