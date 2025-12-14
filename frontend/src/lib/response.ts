import { Status } from '@/components/custom/mobile/ui/ramadani/types/global';

export interface ApiResponse<T> {
  code: number;
  status: Status;
  message: string;
  data: T | null;
  error: string | null;
}

export class ApiSuccess<T> implements ApiResponse<T> {
  code: number;
  status: 'succes';
  message: string;
  data: T;
  error: null;

  constructor(message: string, data: T, code: number = 200) {
    this.code = code;
    this.status = 'succes';
    this.message = message;
    this.data = data;
    this.error = null;
  }
}

export class ApiFail<T> implements ApiResponse<T> {
  code: number;
  status: 'fail';
  message: string;
  data: null;
  error: string;

  constructor(message: string, error: string, code: number = 400) {
    this.code = code;
    this.status = 'fail';
    this.message = message;
    this.data = null;
    this.error = error;
  }
}
