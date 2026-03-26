/** Mirrors OpenAPI components/schemas AuthRegisterBody, AuthLoginBody, AuthTokensResponse */

export interface AuthRegisterBody {
  full_name: string;
  gamer_name: string;
  email: string;
  password: string;
  phone?: string;
  profile_picture_url?: string;
}

export interface AuthLoginBody {
  email: string;
  password: string;
}

export interface AuthTokensResponse {
  user: Record<string, unknown>;
  accessToken: string;
  refreshToken: string;
}

export interface AuthRefreshResponse {
  accessToken: string;
}
