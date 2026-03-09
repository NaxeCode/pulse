import type {
  AlertsOverview,
  AnalysisWorkspace,
  Candle,
  DashboardOverview,
  PortfolioOverview,
  RunAnalysisResponse,
  SettingsOverview,
  SymbolItem,
  SymbolWorkspace
} from "@ground/shared-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed (${response.status}): ${text}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return request<DashboardOverview>("/api/v1/dashboard");
}

export async function getSymbols(): Promise<SymbolItem[]> {
  return request<SymbolItem[]>("/api/v1/symbols");
}

export async function getSymbolWorkspace(symbol: string): Promise<SymbolWorkspace> {
  return request<SymbolWorkspace>(
    `/api/v1/symbols/${encodeURIComponent(symbol)}/workspace`
  );
}

export async function getCandles(symbol: string): Promise<Candle[]> {
  return request<Candle[]>(`/api/v1/candles/${encodeURIComponent(symbol)}`);
}

export async function getPortfolioOverview(): Promise<PortfolioOverview> {
  return request<PortfolioOverview>("/api/v1/portfolio");
}

export async function getAnalysisWorkspace(): Promise<AnalysisWorkspace> {
  return request<AnalysisWorkspace>("/api/v1/analysis");
}

export async function getAlertsOverview(): Promise<AlertsOverview> {
  return request<AlertsOverview>("/api/v1/alerts");
}

export async function getSettingsOverview(): Promise<SettingsOverview> {
  return request<SettingsOverview>("/api/v1/settings");
}

export async function runAnalysis(symbol: string): Promise<RunAnalysisResponse> {
  return request<RunAnalysisResponse>("/api/v1/analysis/run", {
    method: "POST",
    body: JSON.stringify({
      symbol,
      analysisType: "basic"
    })
  });
}
