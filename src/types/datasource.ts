/**
 * DataSource - Prometheus 서버 연결 정보
 */

export interface AuthConfig {
  type: 'bearer';
  token: string;
}

export type ConnectionStatus = 'unknown' | 'connecting' | 'connected' | 'error';

export interface DataSource {
  id: string;
  name: string;
  url: string;
  auth: AuthConfig | null;
  status: ConnectionStatus;
  createdAt: number;
  updatedAt: number;
}

export interface DataSourceInput {
  name: string;
  url: string;
  auth?: AuthConfig | null;
}
