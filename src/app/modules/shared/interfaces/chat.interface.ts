import { Role } from '../types/role.type';

export interface IHistory {
  role: Role;
  content: string;
  dashboardUrl?: string;
}

export interface IChatRequest {
  message: string;
  history?: IHistory[];
}
export interface IChatResponse {
  success: boolean;
  response: string;
  error?: string;
}
