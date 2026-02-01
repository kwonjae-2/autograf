/**
 * Error message mappings
 */

import type { ErrorType } from '../types';

export interface ErrorMessageConfig {
  title: string;
  defaultMessage: string;
  suggestions: string[];
}

export const ERROR_MESSAGES: Record<ErrorType, ErrorMessageConfig> = {
  connection: {
    title: '연결 실패',
    defaultMessage: 'Prometheus 서버에 연결할 수 없습니다.',
    suggestions: [
      'Prometheus 서버 URL이 올바른지 확인하세요.',
      '네트워크 연결 상태를 확인하세요.',
      'CORS 설정이 올바른지 확인하세요.',
    ],
  },
  auth: {
    title: '인증 오류',
    defaultMessage: '인증에 실패했습니다.',
    suggestions: [
      'Bearer 토큰이 올바른지 확인하세요.',
      '토큰이 만료되지 않았는지 확인하세요.',
      '해당 리소스에 대한 접근 권한이 있는지 확인하세요.',
    ],
  },
  query: {
    title: '쿼리 오류',
    defaultMessage: 'PromQL 쿼리 실행 중 오류가 발생했습니다.',
    suggestions: [
      'PromQL 문법이 올바른지 확인하세요.',
      '메트릭 이름과 레이블이 존재하는지 확인하세요.',
      '시간 범위가 적절한지 확인하세요.',
    ],
  },
  timeout: {
    title: '타임아웃',
    defaultMessage: '요청 시간이 초과되었습니다.',
    suggestions: [
      '시간 범위를 줄여보세요.',
      'step 값을 늘려보세요.',
      '쿼리를 단순화해보세요.',
      '네트워크 상태를 확인하세요.',
    ],
  },
  cors: {
    title: 'CORS 오류',
    defaultMessage: 'CORS 정책으로 인해 요청이 차단되었습니다.',
    suggestions: [
      'Prometheus 서버의 CORS 설정을 확인하세요.',
      '프록시 서버를 통해 접근해보세요.',
      '--web.cors.origin 플래그를 설정하세요.',
    ],
  },
  visualization: {
    title: '시각화 오류',
    defaultMessage: '데이터를 시각화할 수 없습니다.',
    suggestions: [
      '쿼리 결과 데이터 형식을 확인하세요.',
      '다른 쿼리를 시도해보세요.',
    ],
  },
  storage: {
    title: '저장소 오류',
    defaultMessage: '데이터를 저장하거나 불러올 수 없습니다.',
    suggestions: [
      '브라우저의 LocalStorage가 활성화되어 있는지 확인하세요.',
      '프라이빗 브라우징 모드가 아닌지 확인하세요.',
      '저장 공간이 충분한지 확인하세요.',
    ],
  },
  unknown: {
    title: '알 수 없는 오류',
    defaultMessage: '예상치 못한 오류가 발생했습니다.',
    suggestions: [
      '페이지를 새로고침해보세요.',
      '브라우저 개발자 도구에서 자세한 오류를 확인하세요.',
    ],
  },
};

export function getErrorConfig(type: ErrorType): ErrorMessageConfig {
  return ERROR_MESSAGES[type];
}
