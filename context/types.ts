export interface Monitor {
  id: string;
  name: string;
  url: string;
  provider: string;
  isActive: boolean;
  uptime: string;
  avgResponse: string;
  history: number[];
  sslIssuer?: string;
  sslExpiresAt?: string;
  sslDaysRemaining?: number;
  deploymentStatus?: string;
  deploymentId?: string;
  commitMsg?: string;
  commitHash?: string;
  deployedAt?: string;
  branch?: string;
}

export interface Incident {
  id: string;
  name: string;
  url: string;
  status: string;
  startedAt: string;
  resolvedAt: string;
  duration: string;
  reason: string;
}

export interface Activity {
  time: string;
  message: string;
  type: string;
}
