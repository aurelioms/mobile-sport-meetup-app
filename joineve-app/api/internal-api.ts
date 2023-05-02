import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

export const internalAPI = axios.create({
  baseURL: "http://10.0.2.2:3000/api/v1",
});

export type GeneralErrorData = {
  message: string;
};

export type FieldErrorData<Key = string> = {
  fields: [
    {
      key: Key;
      message: string;
    }
  ];
};

export type InternalAPIError = {
  status: number;
  internalStatus: number;
  data?: GeneralErrorData | FieldErrorData;
};

export enum InternalStatus {
  UNKNOWN,
  BODY_VALIDATION,
  VALIDATION_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  FORGOT_PASSWORD_CODE_EXPIRED,
}

internalAPI.interceptors.request.use(async (request) => {
  const token = await SecureStore.getItemAsync("auth_token");

  request.headers["Authorization"] = `Bearer ${token}`;

  return request;
});

internalAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response as AxiosResponse;

      return Promise.reject({
        status,
        data: data.error,
        internalStatus: data.status,
      });
    }

    return Promise.reject({
      status: -1,
      data: {},
      internalStatus: -1,
    });
  }
);
