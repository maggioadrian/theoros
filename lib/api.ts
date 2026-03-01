const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Account = {
  type: string;
  number: string;
  status: string;
  isPrimary: boolean;
  isBilling: boolean;
  clientAccountType: string;
};

export type CurrencyBalance = {
  currency: string;
  cash: number;
  marketValue: number;
  totalEquity: number;
  buyingPower?: number;
  maintenanceExcess?: number;
};

export type Balances = {
  combinedBalances: CurrencyBalance[];
  perCurrencyBalances: CurrencyBalance[];
};

export type Position = {
  symbol: string;
  symbolId: number;
  openQuantity: number;
  currentPrice: number;
  averageEntryPrice: number;
  closedPnl: number;
  openPnl: number;
  totalCost: number;
  isRealTime: boolean;
  currency: string | null;
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export type EquityPoint = {
  date: string;
  equity: number;
  benchmark?: number;
};

export const getAccounts     = ()           => apiFetch<Account[]>("/questrade/accounts");
export const getBalances     = (id: string) => apiFetch<Balances>(`/questrade/balances?account_id=${id}`);
export const getPositions    = (id: string) => apiFetch<Position[]>(`/questrade/positions?account_id=${id}`);
export const getEquityHistory = (days = 252) => apiFetch<EquityPoint[]>(`/questrade/equity-history?days=${days}`);
