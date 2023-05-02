import { getSportEventDetails } from "../api";
import { useQuery } from "./use-query";

export const useGetSportEventDetails = ({ id }: { id: string }) =>
  useQuery(() => getSportEventDetails({ id }), `sport-event-details-${id}`);
