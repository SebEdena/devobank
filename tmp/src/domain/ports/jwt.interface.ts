interface UserPayload {
  userId: string;
}

export interface JwtPayload extends UserPayload {
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

export interface JwtHandler {
  sign(payload: UserPayload): Promise<string>;
  verify(token: string): Promise<JwtPayload>;
}
