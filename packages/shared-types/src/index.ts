export interface SymbolItem {
  ticker: string;
  name: string;
  sector?: string;
  trend?: "bullish" | "neutral" | "bearish";
}

export interface Candle {
  symbol: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface RunAnalysisRequest {
  symbol: string;
  analysisType: "basic";
}

export interface RunAnalysisResponse {
  status: "queued";
  queue: string;
}

export interface KeyMetric {
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "neutral" | "negative";
}

export interface StatusItem {
  label: string;
  value: string;
  tone: "positive" | "neutral" | "negative" | "warning";
}

export interface QueueJob {
  id: string;
  symbol: string;
  analysisType: string;
  status: "queued" | "running" | "completed";
  submittedAt: string;
  owner: string;
}

export interface AnalysisRunSummary {
  symbol: string;
  setup: string;
  conviction: string;
  timeframe: string;
  updatedAt: string;
}

export interface AlertItem {
  id: string;
  title: string;
  symbol: string;
  condition: string;
  severity: "low" | "medium" | "high";
  channel: string;
  status: "active" | "muted" | "triggered";
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  category: "analysis" | "risk" | "portfolio" | "system";
}

export interface WatchlistItem {
  ticker: string;
  name: string;
  price: string;
  move: string;
  volumeLabel: string;
  signal: string;
  tone: "positive" | "neutral" | "negative";
}

export interface DashboardOverview {
  headline: string;
  subheadline: string;
  metrics: KeyMetric[];
  marketStatus: StatusItem[];
  watchlist: WatchlistItem[];
  queue: QueueJob[];
  recentAnalyses: AnalysisRunSummary[];
  alerts: AlertItem[];
  activity: ActivityItem[];
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  weight: string;
  exposure: string;
  pnl: string;
  thesis: string;
  risk: "low" | "medium" | "high";
}

export interface AllocationSlice {
  label: string;
  value: string;
}

export interface PortfolioOverview {
  accountValue: string;
  buyingPower: string;
  dailyPnl: string;
  grossExposure: string;
  netExposure: string;
  allocation: AllocationSlice[];
  holdings: PortfolioHolding[];
  guardrails: StatusItem[];
}

export interface AnalysisTemplate {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: "ready" | "draft" | "paused";
}

export interface AnalysisWorkspace {
  modelStatus: StatusItem[];
  queuedJobs: QueueJob[];
  completedRuns: AnalysisRunSummary[];
  templates: AnalysisTemplate[];
  notes: string[];
}

export interface AlertChannel {
  label: string;
  destination: string;
  status: "connected" | "pending";
}

export interface AlertsOverview {
  rules: AlertItem[];
  recentTriggers: ActivityItem[];
  channels: AlertChannel[];
}

export interface SettingsSection {
  title: string;
  description: string;
  state: string;
}

export interface SettingsOverview {
  workspace: SettingsSection[];
  integrations: SettingsSection[];
  security: SettingsSection[];
}

export interface InsightCard {
  title: string;
  value: string;
  detail: string;
  tone: "positive" | "neutral" | "negative";
}

export interface ThesisBlock {
  title: string;
  body: string;
}

export interface SymbolWorkspace {
  symbol: string;
  companyName: string;
  sector: string;
  price: string;
  move: string;
  trend: string;
  insights: InsightCard[];
  thesis: ThesisBlock[];
  executionChecklist: string[];
  relatedSignals: StatusItem[];
}
