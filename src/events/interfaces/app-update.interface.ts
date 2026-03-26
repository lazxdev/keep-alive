export interface AppUpdatePayload {
  status: 'up' | 'down';
  lastCheck: string;
  failureCount: number;
}
