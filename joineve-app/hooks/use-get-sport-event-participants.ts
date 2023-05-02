import { getSportEventParticipants } from "../api";
import { useQuery } from "./use-query";

export const useGetSportEventParticipants = ({ id }: { id: string }) =>
  useQuery(
    () => getSportEventParticipants({ id }),
    `sport-event-participants-${id}`
  );
