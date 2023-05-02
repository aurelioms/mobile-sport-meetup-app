import { User } from "../types";
import { internalAPI } from "./internal-api";

export const getLoggedInUser = async () => {
  const response = await internalAPI.get("/auth");

  return response.data.data as User;
};

type UpdateUserPasswordParams = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const updateUserPassword = async ({
  confirmPassword,
  currentPassword,
  newPassword,
}: UpdateUserPasswordParams) => {
  const response = await internalAPI.post("/auth/update-password", {
    newPassword,
    currentPassword,
    confirmPassword,
  });

  return response.data.data;
};

type UpdateUserDataParams = {
  gender: string;
  name: string;
  birthDate: Date;
};

export const updateUserProfile = async ({
  gender,
  name,
  birthDate,
}: UpdateUserDataParams) => {
  const response = await internalAPI.put("/user/update-profile", {
    gender,
    name,
    birthDate,
  });

  return response.data.data;
};
