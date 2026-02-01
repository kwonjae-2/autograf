/**
 * Error Classifier
 * 오류 유형 분류
 */

import type { ErrorType, AppError as AppErrorType } from '../../types';
import { AppError } from '../../utils/errors';

/**
 * Classify error from various sources
 */
export function classifyError(error: unknown): AppErrorType {
  if (error instanceof AppError) {
    return error.toJSON();
  }

  if (error instanceof TypeError) {
    // Network errors typically throw TypeError
    if (error.message.includes('Failed to fetch')) {
      return classifyCorsOrNetworkError(error);
    }
  }

  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      return new AppError(
        'timeout',
        '요청 시간이 초과되었습니다.',
        null,
        '시간 범위를 줄이거나 step을 늘려보세요.'
      ).toJSON();
    }
  }

  if (error instanceof Error) {
    return classifyByMessage(error.message);
  }

  return new AppError('unknown', '알 수 없는 오류가 발생했습니다.', null, null).toJSON();
}

/**
 * Classify CORS or network error
 */
function classifyCorsOrNetworkError(_error: TypeError): AppErrorType {
  // Cannot definitively distinguish CORS from network error in browser
  // CORS errors typically show as generic TypeError
  return new AppError(
    'cors',
    'Prometheus 서버에 연결할 수 없습니다.',
    'CORS 또는 네트워크 오류',
    'Prometheus 서버의 CORS 설정을 확인하거나, 네트워크 연결을 확인하세요.'
  ).toJSON();
}

/**
 * Classify error by message content
 */
function classifyByMessage(message: string): AppErrorType {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
    return new AppError(
      'auth',
      '인증에 실패했습니다.',
      'HTTP 401',
      'Bearer 토큰을 확인해주세요.'
    ).toJSON();
  }

  if (lowerMessage.includes('forbidden') || lowerMessage.includes('403')) {
    return new AppError(
      'auth',
      '접근 권한이 없습니다.',
      'HTTP 403',
      '권한을 확인해주세요.'
    ).toJSON();
  }

  if (lowerMessage.includes('timeout') || lowerMessage.includes('시간 초과')) {
    return new AppError(
      'timeout',
      '요청 시간이 초과되었습니다.',
      null,
      '시간 범위를 줄이거나 step을 늘려보세요.'
    ).toJSON();
  }

  if (lowerMessage.includes('cors')) {
    return new AppError(
      'cors',
      'CORS 정책으로 인해 요청이 차단되었습니다.',
      null,
      'Prometheus 서버의 CORS 설정을 확인하세요.'
    ).toJSON();
  }

  if (lowerMessage.includes('syntax') || lowerMessage.includes('parse error')) {
    return new AppError(
      'query',
      'PromQL 구문 오류입니다.',
      message,
      'PromQL 문법을 확인해주세요.'
    ).toJSON();
  }

  if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
    return new AppError(
      'connection',
      '요청한 리소스를 찾을 수 없습니다.',
      'HTTP 404',
      'Prometheus API 경로를 확인해주세요.'
    ).toJSON();
  }

  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return new AppError(
      'connection',
      '네트워크 오류가 발생했습니다.',
      message,
      '네트워크 연결을 확인해주세요.'
    ).toJSON();
  }

  return new AppError('unknown', message, null, null).toJSON();
}

/**
 * Check if error is retryable
 */
export function isRetryableError(errorType: ErrorType): boolean {
  return errorType === 'timeout' || errorType === 'connection';
}
