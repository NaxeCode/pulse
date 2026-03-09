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

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function fetchJson(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const requestUrl = joinUrl(API_BASE_URL, path);
  let response: Response;

  try {
    response = await fetchJson(requestUrl, init);
  } catch (error) {
    // Some Ubuntu environments resolve localhost in ways that can fail for Node fetch.
    if (API_BASE_URL.includes("localhost")) {
      const fallbackUrl = joinUrl(
        API_BASE_URL.replace("localhost", "127.0.0.1"),
        path
      );
      try {
        response = await fetchJson(fallbackUrl, init);
      } catch (fallbackError) {
        const reason =
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError);
        throw new Error(
          `API fetch failed for ${requestUrl}. Confirm backend is running with \`npm run compose:up\`. Original error: ${reason}`
        );
      }
    } else {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(
        `API fetch failed for ${requestUrl}. Confirm backend is running with \`npm run compose:up\`. Original error: ${reason}`
      );
    }
  }

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
