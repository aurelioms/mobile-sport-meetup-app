import { SportType } from "../types";
import { internalAPI } from "./internal-api";

export const getAllSportTypes = async () => {
  const response = await internalAPI.get("/sport-type");

  return response.data.data as SportType[];
};
