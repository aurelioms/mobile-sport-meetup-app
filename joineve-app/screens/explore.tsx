import { useNavigation } from "@react-navigation/native";
import { addDays, subDays } from "date-fns";
import {
  Button,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
  Center,
} from "native-base";
import React, { FC, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth } from "../components/auth";
import { ButtonIcon } from "../components/button";
import { CalendarScroll } from "../components/calendar";
import { AddIcon, FilterIcon, SearchIcon } from "../components/icons";
import { Input, RadioInput, SelectInput } from "../components/input";
import { Loading } from "../components/loading";
import { SportEventCard } from "../components/sport-event";
import { FadeIn } from "../components/transition";
import { SearchNotFoundVector } from "../components/vectors";
import { ROUTES } from "../constants";
import { cities } from "../data/cities";
import {
  useCurrentLocation,
  useForm,
  useGetEvents,
  useGetSportTypes,
} from "../hooks";
import { handleAPIError } from "../util";
import { calculateDistance } from "../util/location";

const ranges = [
  {
    text: "1 km",
    value: 1,
  },
  {
    text: "3 km",
    value: 3,
  },
  {
    text: "5 km",
    value: 5,
  },
  {
    text: "10 km",
    value: 10,
  },
];

const ExploreScreen: FC = () => {
  const navigation = useNavigation<any>();

  const location = useCurrentLocation();

  const {
    values: { city, date, sportType, radius, keyword },
    onChange,
  } = useForm({
    keyword: "",
    date: new Date(),
    city: "",
    sportType: "",
    radius: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  const startDate = useMemo(() => subDays(new Date(), 2), []);
  const endDate = useMemo(() => addDays(new Date(), 12), []);

  const {
    data: sportEvents,
    error: eventError,
    loading,
  } = useGetEvents({
    city,
    date,
    sportType,
    keyword,
  });
  const { data: sportTypes, error: sportTypeError } = useGetSportTypes();

  const sportTypesOptions = useMemo(
    () =>
      (sportTypes || []).map(({ id, name }) => ({
        text: name,
        value: id,
      })),
    [sportTypes]
  );

  useEffect(() => {
    const error = sportTypeError || eventError;
    if (error) handleAPIError({ error, navigation });
  }, [eventError, sportTypeError]);

  const nearVenues = useMemo(() => {
    if (!location) return sportEvents || [];

    return (sportEvents || [])
      .map((event) => {
        const distance = calculateDistance(
          event.latitude,
          event.longitude,
          location.lat,
          location.long
        );

        return { ...event, distance };
      })
      .filter((event) => {
        if (radius === "") return event;

        return event.distance <= Number(radius) * 1000;
      });
  }, [location, radius, sportEvents]);

  const cityOptions = useMemo(
    () =>
      cities.map(({ city }) => ({
        text: city,
        value: city,
      })),
    []
  );

  const onSearchSubmitted = (value: string) => onChange(value, "keyword");

  return (
    <Auth>
      <SafeAreaView>
        <VStack bgColor="white" height="full">
          <HStack space={1} direction="row" px={4} py={6} alignItems="center">
            <View flexGrow={1}>
              <Input
                InputLeftElement={
                  <View ml={2}>
                    <SearchIcon size={24} />
                  </View>
                }
                name="search"
                placeholder="Search"
                returnKeyType="search"
                onSubmitEditing={onSearchSubmitted}
              />
            </View>
            <ButtonIcon
              Icon={FilterIcon}
              onPress={() => setShowFilter(!showFilter)}
              active={showFilter}
            />
            <ButtonIcon
              Icon={AddIcon}
              onPress={() => navigation.navigate(ROUTES.CREATE_EVENT)}
            />
          </HStack>
          <CalendarScroll
            name="date"
            selected={date}
            onSelected={onChange}
            start={startDate}
            end={endDate}
          />
          <View height="full">
            {showFilter ? (
              <View
                mx={4}
                mt={6}
                p={4}
                borderWidth={1}
                bgColor="trueGray.100"
                borderColor="trueGray.200"
                rounded={6}
                position="absolute"
                zIndex={6}
                top={0}
                left={0}
                right={0}
              >
                <VStack space={3}>
                  {location ? (
                    <View>
                      <Text fontSize={14} mb={2} color="trueGray.700">
                        Radius
                      </Text>
                      <RadioInput
                        name="radius"
                        onChange={onChange}
                        options={ranges}
                        value={radius}
                      />
                    </View>
                  ) : null}
                  <View>
                    <Text fontSize={14} mb={2} color="trueGray.700">
                      City
                    </Text>
                    <SelectInput
                      name="city"
                      placeholder="City"
                      options={cityOptions}
                      value={city}
                      onChange={onChange}
                    />
                  </View>
                  <View>
                    <Text fontSize={14} mb={2} color="trueGray.700">
                      Sport Type
                    </Text>
                    <SelectInput
                      name="sportType"
                      placeholder="Sport Type"
                      options={sportTypesOptions}
                      value={sportType}
                      onChange={onChange}
                    />
                  </View>
                </VStack>
              </View>
            ) : null}
            {!loading ? (
              nearVenues.length > 0 ? (
                <ScrollView px={4} py={6}>
                  <VStack space={4}>
                    {nearVenues?.map((sportEvent, i) => (
                      <SportEventCard
                        key={i}
                        data={sportEvent}
                        onPress={() =>
                          navigation.navigate(ROUTES.EVENT_DETAILS, {
                            id: sportEvent.id,
                          })
                        }
                      />
                    ))}
                  </VStack>
                  <View height="64" />
                </ScrollView>
              ) : (
                <Center height="80%" bgColor="white">
                  <FadeIn>
                    <VStack space={8}>
                      <View mx="auto">
                        <SearchNotFoundVector />
                      </View>
                      <VStack space={2} maxW={56}>
                        <Text
                          fontSize={18}
                          color="trueGray.700"
                          fontWeight="medium"
                          textAlign="center"
                        >
                          No event to display
                        </Text>
                        <Text
                          fontSize={14}
                          color="truegray.600"
                          textAlign="center"
                        >
                          No event found. Try changing the day or create one
                          now?
                        </Text>
                      </VStack>
                      <Button
                        onPress={() => navigation.navigate(ROUTES.CREATE_EVENT)}
                      >
                        Create an Event
                      </Button>
                    </VStack>
                  </FadeIn>
                </Center>
              )
            ) : (
              <Loading />
            )}
          </View>
        </VStack>
      </SafeAreaView>
    </Auth>
  );
};

export default ExploreScreen;
