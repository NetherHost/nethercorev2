export enum HealthStatus {
  OK = "ok",
  ERROR = "error",
}

export enum DBHealthStatus {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  PENDING = "pending",
  UNKNOWN = "unknown",
}

export interface IHealthResponse {
  status: HealthStatus;
  db: DBHealthStatus;
}
