import {
  VStack,
  HStack,
  Text,
  Button,
  Center,
  ScrollView,
  View,
} from "native-base";
import React, { FC, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ButtonTab } from "../components/button";
import { SportEventCard } from "../components/sport-event";
import { HomeVector } from "../components/vectors";
import { ROUTES } from "../constants";
import { handleAPIError } from "../util";
import { SportEvent } from "../types";
import { useGetCreatedEvents, useGetJoinedEvents } from "../hooks";
import { FadeIn } from "../components/transition";
import { SportEventDetailsParams, SportEventSourceRoute } from "./types";
import { Auth } from "../components/auth";

type Props = {
  data: SportEvent[] | null;
  sourceRoute: SportEventSourceRoute;
  navigation?: any;
  loading?: boolean;
};

const SportEventList: FC<Props> = ({
  data,
  sourceRoute,
  navigation,
  loading,
}) => {
  if (loading || data === null) return <></>;

  if (data?.length === 0) {
    return (
      <Center mt={-4} height="full" bgColor="white">
        <FadeIn>
          <VStack space={8}>
            <HomeVector />
            <VStack space={2} maxW={56}>
              <Text
                fontSize={18}
                color="trueGray.700"
                fontWeight="medium"
                textAlign="center"
              >
                No activity to display
              </Text>
              <Text fontSize={14} color="truegray.600" textAlign="center">
                Explore and joined any event you are interested in.
              </Text>
            </VStack>
            <Button onPress={() => navigation.navigate(ROUTES.APP_TAB.EXPLORE)}>
              Explore Event
            </Button>
          </VStack>
        </FadeIn>
      </Center>
    );
  }

  const handleSportEventCardPress = (sportEvent: SportEvent) => {
    const params: SportEventDetailsParams = {
      id: sportEvent.id,
    };

    navigation.navigate(ROUTES.EVENT_DETAILS, params);
  };

  return (
    <ScrollView px={4} bgColor="white">
      <VStack space={4}>
        {data.map((sportEvent, key) => (
          <SportEventCard
            key={`sport-event-${key}`}
            data={sportEvent}
            onPress={() => handleSportEventCardPress(sportEvent)}
          />
        ))}
      </VStack>
      <View height={12} />
    </ScrollView>
  );
};

const HomeScreen: FC = () => {
  const navigation = useNavigation<any>();
  const [showMyCreatedEvents, setShowMyCreatedEvents] = useState(false);

  const {
    data: joinedEvents,
    error: joinedEventsError,
    refetch: getJoinedEvents,
    loading: joinedEventLoading,
  } = useGetJoinedEvents();

  const {
    data: createdEvents,
    error: createdEventsError,
    refetch: getCreatedEvents,
    loading: createdEventLoading,
  } = useGetCreatedEvents();

  useEffect(() => {
    const error = joinedEventsError || createdEventsError;

    if (error) handleAPIError({ error, navigation });
  }, [joinedEventsError, createdEventsError]);

  return (
    <Auth>
      <VStack flex={1} height="full" bgColor="white">
        <HStack space={4} pb={5} px={4} py={6}>
          <ButtonTab
            active={!showMyCreatedEvents}
            text="Joined Events"
            onPress={() => {
              setShowMyCreatedEvents(false);
              getJoinedEvents();
            }}
          />
          <ButtonTab
            active={showMyCreatedEvents}
            text="My Events"
            onPress={() => {
              setShowMyCreatedEvents(true);
              getCreatedEvents();
            }}
          />
        </HStack>
        <SportEventList
          data={showMyCreatedEvents ? createdEvents : joinedEvents}
          loading={
            showMyCreatedEvents ? createdEventLoading : joinedEventLoading
          }
          sourceRoute={showMyCreatedEvents ? "myEvent" : "joined"}
          navigation={navigation}
        />
      </VStack>
    </Auth>
  );
};

export default HomeScreen;
