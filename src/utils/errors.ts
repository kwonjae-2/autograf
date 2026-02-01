/**
 * AppError - 애플리케이션 에러 클래스
 */

import type { ErrorType, AppError as AppErrorType } from '../types';

export class AppError extends Error implements AppErrorType {
  public readonly type: ErrorType;
  public readonly details: string | null;
  public readonly suggestion: string | null;

  constructor(
    type: ErrorType,
    message: string,
    details: string | null = null,
    suggestion: string | null = null
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.details = details;
    this.suggestion = suggestion;
  }

  toJSON(): AppErrorType {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
      suggestion: this.suggestion,
    };
  }

  static fromError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError('unknown', error.message, error.stack ?? null, null);
    }

    return new AppError('unknown', String(error), null, null);
  }
}
