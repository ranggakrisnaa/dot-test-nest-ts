export interface ISuccessResponse<T> {
  timestamp?: string;
  statusCode: number;
  status?: string;
  data: T;
  message?: string;
}
