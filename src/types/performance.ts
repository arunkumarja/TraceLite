export interface PerformanceRecord {
    id: number;
    traceId: string;
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
    createdAtUtc: string;
  }

  export interface SqlPerformanceRecord {
    id: number;
    traceId: string;
    commandType: string;
    commandText: string;
    durationMs: number;
    createdAtUtc: string;
  }

  export interface ExternalApiTestRequest {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
  }
  
  export interface ExternalApiTestResponse {
    statusCode: number;
    reasonPhrase: string;
    durationMs: number;
    responseBody: string;
  }