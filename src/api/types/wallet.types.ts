import type { ApiPaginationMeta } from "./pubg-tournament.types";

export type WalletSummary = {
  user_id: number;
  full_name: string;
  gamer_name: string;
  balance: number;
};

export type WalletTransactionItem = {
  id: number;
  type: "deposit" | "spend" | "refund";
  status: "pending" | "approved" | "rejected";
  amount: number;
  created_at: string;
  payment_id: number | null;
  package_name: string | null;
};

export type WalletTransactionsPage = {
  data: WalletTransactionItem[];
  meta?: ApiPaginationMeta;
};

export type WalletPackageItem = {
  id: number;
  name: string;
  coins: number;
  price: number;
  is_active: boolean;
  created_at: string;
};

export type CreatePaymentRequestBody = {
  package_id: number;
  method?: string;
  reference?: string | null;
};

export type CreatePaymentRequestResponse = {
  id: number;
  status: "pending" | "approved" | "rejected";
  coins: number;
  price: number;
  package_name: string;
  created_at: string;
};
