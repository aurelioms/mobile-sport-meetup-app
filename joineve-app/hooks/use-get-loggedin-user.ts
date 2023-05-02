import { getLoggedInUser } from "../api";
import { useQuery } from "./use-query";

export const useGetLoggedInUser = () =>
  useQuery(getLoggedInUser, "loggedin-user");
