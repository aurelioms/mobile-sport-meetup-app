import { getDistance } from "geolib";

export const calculateDistance = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
) => {
  return getDistance(
    {
      latitude: lat1,
      longitude: long1,
    },
    {
      latitude: lat2,
      longitude: long2,
    }
  );
};
