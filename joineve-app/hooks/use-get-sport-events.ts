import { getAllSportEvents } from "../api";
import { useQuery } from "./use-query";

type Params = {
  date?: Date;
  city?: string;
  sportType?: string;
  keyword?: string;
};

export const useGetEvents = ({
  city,
  date = new Date(),
  sportType,
  keyword,
}: Params) => {
  const fromDate = new Date(date);
  fromDate.setHours(0, 0, 0, 0);

  const toDate = new Date(date);
  toDate.setHours(23, 59, 59);

  const filter = {
    city,
    fromDate,
    sportType,
    toDate,
    keyword,
  };

  return useQuery(
    () => getAllSportEvents(filter),
    `sport-events ${JSON.stringify(filter)}`
  );
};
