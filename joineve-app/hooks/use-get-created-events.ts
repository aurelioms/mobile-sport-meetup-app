import { getCreatedSportEvents } from "../api";
import { useQuery } from "./use-query";

export const useGetCreatedEvents = () =>
  useQuery(getCreatedSportEvents, "created-events");
