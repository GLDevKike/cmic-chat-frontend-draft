export interface IChatRequest {
  message: string;
}
export interface IChatResponse {
  success: boolean;
  response: string | Record<string, any>;
  error?: string;
}
