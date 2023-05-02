import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const getUserLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (granted) {
      let { coords } = await Location.getCurrentPositionAsync();

      setLocation({
        lat: coords.latitude,
        long: coords.longitude,
      });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return location;
};
