import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import type { ApiResponse } from "../types/api-response";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type {
  CreatePaymentRequestBody,
  CreatePaymentRequestResponse,
  WalletPackageItem,
  WalletSummary,
  WalletTransactionItem,
} from "../types/wallet.types";

export async function getMyWallet(): Promise<WalletSummary> {
  const res = await axiosInstance.get<ApiResponse<WalletSummary>>("/wallet/me");
  return parseApiResponse(res);
}

export async function getMyWalletTransactions(query: {
  page?: number;
  limit?: number;
}): Promise<{ data: WalletTransactionItem[]; meta?: ApiResponse<WalletTransactionItem[]>["meta"] }> {
  const res = await axiosInstance.get<ApiResponse<WalletTransactionItem[]>>(
    "/wallet/transactions",
    { params: query },
  );
  return parseApiResponseWithMeta(res);
}

export async function getPackages(): Promise<WalletPackageItem[]> {
  const res = await axiosInstance.get<ApiResponse<WalletPackageItem[]>>("/package");
  return parseApiResponse(res);
}

export async function createPaymentRequest(
  body: CreatePaymentRequestBody,
): Promise<CreatePaymentRequestResponse> {
  const res = await axiosInstance.post<ApiResponse<CreatePaymentRequestResponse>>(
    "/payment/request",
    body,
  );
  return parseApiResponse(res);
}
