import { getJoinedSportEvents } from "../api";
import { useQuery } from "./use-query";

export const useGetJoinedEvents = () =>
  useQuery(getJoinedSportEvents, "joined-events");
