import { getComments, GetCommentsParams } from "../api";
import { useQuery } from "./use-query";

export const useGetComments = ({ sportEventId }: GetCommentsParams) =>
  useQuery(
    () => getComments({ sportEventId }),
    `event-comments-${sportEventId}`
  );
