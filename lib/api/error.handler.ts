import { AxiosError } from 'axios';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export class ApiException extends Error {
  public code: string;
  public details?: any;
  public status?: number;

  constructor(code: string, message: string, details?: any, status?: number) {
    super(message);
    this.code = code;
    this.details = details;
    this.status = status;
    this.name = 'ApiException';
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    
    if (responseData?.error) {
      throw new ApiException(
        responseData.error.code,
        responseData.error.message,
        responseData.error.details,
        error.response?.status
      );
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new ApiException(
        'TIMEOUT',
        '요청 시간이 초과되었습니다. 다시 시도해주세요.',
        undefined,
        408
      );
    }
    
    if (!error.response) {
      throw new ApiException(
        'NETWORK_ERROR',
        '네트워크 연결을 확인해주세요.',
        undefined,
        0
      );
    }
    
    throw new ApiException(
      'UNKNOWN_ERROR',
      error.message || '알 수 없는 오류가 발생했습니다.',
      undefined,
      error.response?.status
    );
  }
  
  throw new ApiException(
    'UNKNOWN_ERROR',
    '알 수 없는 오류가 발생했습니다.',
    undefined,
    500
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiException) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};