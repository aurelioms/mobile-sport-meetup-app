import { internalAPI } from "./internal-api";

type SignInParams = {
  email: string;
  password: string;
};

type SignInResponse = {
  token: string;
};

export const signIn: (
  params: SignInParams
) => Promise<SignInResponse> = async ({ email, password }) => {
  const response = await internalAPI.post("/auth/login", {
    email,
    password,
  });

  return response.data.data;
};

type SignUpParams = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const signUp: (params: SignUpParams) => Promise<unknown> = async ({
  email,
  password,
  name,
  confirmPassword,
}) => {
  const response = await internalAPI.post("/auth/register", {
    name,
    email,
    password,
    confirmPassword,
  });

  return response.data.data;
};

type VerifyParams = {
  email: string;
  code: string;
};

export const verify: (params: VerifyParams) => Promise<unknown> = async ({
  code,
  email,
}) => {
  const response = await internalAPI.post("/auth/validate-otp", {
    code,
    email,
  });

  return response.data.data;
};

type ResendOTPCodeParams = {
  email: string;
};

export const resendOTPCode: (
  params: ResendOTPCodeParams
) => Promise<unknown> = async ({ email }) => {
  const response = await internalAPI.post("/auth/resend-otp", {
    email,
  });

  return response.data.data;
};

type GetForgetPasswordCodeParams = {
  email: string;
};

export const getForgetPasswordCode: (
  params: GetForgetPasswordCodeParams
) => Promise<unknown> = async ({ email }) => {
  const response = await internalAPI.post("/auth/forget-password", { email });

  return response.data.data;
};

type CheckForgetPasswordCodeParams = {
  code: string;
};

export const checkForgetPasswordCode: (
  params: CheckForgetPasswordCodeParams
) => Promise<unknown> = async ({ code }) => {
  const response = await internalAPI.post("/auth/check-forget-password-code", {
    code,
  });

  return response.data.data;
};

type ResetPasswordWithCodeParams = {
  code: string;
  password: string;
  confirmPassword: string;
};

export const resetForgetPasswordWithCode: (
  params: ResetPasswordWithCodeParams
) => Promise<unknown> = async ({ code, password, confirmPassword }) => {
  const response = await internalAPI.post("/auth/reset-password", {
    code,
    password,
    confirmPassword,
  });

  return response.data.data;
};
