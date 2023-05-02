import { getAllSportTypes } from "../api/sport-type";
import { useQuery } from "./use-query";

export const useGetSportTypes = () => {
  return useQuery(getAllSportTypes, "sport-types");
};
