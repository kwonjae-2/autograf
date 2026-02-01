/**
 * CORS Error Detector
 * CORS 오류 감지 유틸리티
 */

/**
 * Check if an error is likely a CORS error
 * Note: Browsers intentionally hide CORS error details for security
 */
export function isCorsError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();

    // Common CORS error patterns
    if (message.includes('failed to fetch')) {
      return true;
    }
    if (message.includes('network request failed')) {
      return true;
    }
    if (message.includes('cors')) {
      return true;
    }
  }

  return false;
}

/**
 * Generate CORS troubleshooting suggestions
 */
export function getCorsHelpText(): string[] {
  return [
    'Prometheus 서버의 CORS 설정을 확인하세요.',
    'Prometheus 시작 시 --web.cors.origin="*" 플래그를 사용하세요.',
    '프록시 서버를 통해 접근하는 것을 고려해보세요.',
    '브라우저 개발자 도구의 네트워크 탭에서 자세한 오류를 확인하세요.',
  ];
}

/**
 * Check if URL is same origin (won't have CORS issues)
 */
export function isSameOrigin(url: string): boolean {
  try {
    const targetUrl = new URL(url);
    return targetUrl.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Check if URL is localhost (likely development)
 */
export function isLocalhost(url: string): boolean {
  try {
    const targetUrl = new URL(url);
    return (
      targetUrl.hostname === 'localhost' ||
      targetUrl.hostname === '127.0.0.1' ||
      targetUrl.hostname === '::1'
    );
  } catch {
    return false;
  }
}
