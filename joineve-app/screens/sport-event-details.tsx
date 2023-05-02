import {
  Divider,
  HStack,
  Link,
  Pressable,
  ScrollView,
  Text,
  Toast,
  VStack,
  View,
} from "native-base";
import {
  CalendarIcon,
  ClockIcon,
  CommentIcon,
  EditPencilIcon,
  LinkToLocationIcon,
  LocationIcon,
  PeopleIcon,
} from "../components/icons";
import { Person } from "../components/person";
import { Button, ButtonIcon, TextButton } from "../components/button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGetSportEventDetails } from "../hooks";
import { handleAPIError } from "../util";
import { useEffect } from "react";
import { SportEventDetailsRouteProps } from "./types";
import { format } from "date-fns";
import { ROUTES } from "../constants";
import { SportEventParticipantsParams } from "./types";
import { Loading } from "../components/loading";
import {
  cancelSportEvent,
  joinSportEvent,
  unjoinSportEvent,
} from "../api/sport-event";
import { InternalAPIError } from "../api";
import { Auth } from "../components/auth";

const SportEventDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SportEventDetailsRouteProps>();

  const {
    data: sportEvent,
    error,
    refetch: getSportEventDetails,
  } = useGetSportEventDetails({
    id: route.params.id,
  });

  useEffect(() => {
    if (error) handleAPIError({ error, navigation });
  }, [error]);

  useEffect(() => {
    navigation.setOptions({
      title: sportEvent !== null ? sportEvent.name : "Sport Event",
    });
  }, [navigation, sportEvent]);

  const handleJoinSportEvent = async () => {
    try {
      const data = await joinSportEvent({ id: route.params.id });

      Toast.show({ title: "Join event successful!" });
      getSportEventDetails();
    } catch (error) {
      handleAPIError({ error: error as InternalAPIError, navigation });
    }
  };

  const handleUnjoinSportEvent = async () => {
    try {
      const data = await unjoinSportEvent({ id: route.params.id });

      Toast.show({ title: "Unjoin event done!" });
      getSportEventDetails();
    } catch (error) {
      handleAPIError({ error: error as InternalAPIError, navigation });
    }
  };

  const handleCancelSportEvent = async () => {
    try {
      const data = await cancelSportEvent({ id: route.params.id });

      Toast.show({ title: "Sport event cancelled!" });
      getSportEventDetails();
      navigation.navigate(ROUTES.APP_TAB.HOME);
    } catch (error) {
      handleAPIError({ error: error as InternalAPIError, navigation });
    }
  };

  const isSportEventFull =
    sportEvent?.participants.length === sportEvent?.maxParticipant;

  if (sportEvent === null) return <Loading />;

  return (
    <Auth>
      <VStack flex={1} h="full" bgColor="white">
        <ScrollView>
          <VStack pt="5" px="5">
            <VStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color="gray.800" fontWeight="500" fontSize="xl">
                  {sportEvent.name}
                </Text>
                {sportEvent.isCreator && (
                  <Pressable
                    onPress={() =>
                      navigation.navigate(ROUTES.UPDATE_EVENT, {
                        id: route.params.id,
                      })
                    }
                  >
                    <EditPencilIcon />
                  </Pressable>
                )}
              </HStack>
              <VStack pt="4" space="4">
                <HStack space="2.5" alignItems="center">
                  <CalendarIcon />
                  <Text color="gray.600">
                    {format(new Date(sportEvent.startAt), "EEEE, do LLLL yyyy")}
                  </Text>
                </HStack>
                <HStack space="2.5" alignItems="center">
                  <ClockIcon />
                  <Text color="gray.600">
                    {format(new Date(sportEvent.startAt), "hh:mm aa")}
                  </Text>
                </HStack>
                <HStack space="2.5">
                  <LocationIcon />
                  <VStack mr="auto">
                    <Text color="gray.600">{sportEvent.addressStreet}</Text>
                    <Text color="gray.600" fontSize="xs">
                      {sportEvent.addressCity}, {sportEvent.addressPostalCode}
                    </Text>
                  </VStack>
                  <Link
                    href={`https://maps.google.com/?q=${Number(
                      sportEvent.latitude
                    )},${Number(sportEvent.longitude)}`}
                  >
                    <LinkToLocationIcon size={20} />
                  </Link>
                </HStack>
                <HStack space="2.5" alignItems="center">
                  <PeopleIcon />
                  <Text color="gray.600">
                    {sportEvent.participants.length} /{" "}
                    {sportEvent.maxParticipant} (persons)
                  </Text>
                </HStack>
              </VStack>
              <VStack mt="8" space="4">
                <Text color="gray.800" fontWeight="500" fontSize="lg">
                  Hosted by
                </Text>
                <Person
                  name={sportEvent.host.name}
                  email={sportEvent.host.email}
                />
              </VStack>
              <VStack mt="8">
                <Text color="gray.800" fontWeight="500" fontSize="lg">
                  Description
                </Text>
                <Text color="gray.600" mt="1">
                  {sportEvent.description}
                </Text>
              </VStack>
              <VStack my="8" space="4">
                <HStack alignItems="center" justifyContent="space-between">
                  <Text color="gray.800" fontWeight="500" fontSize="lg">
                    Current Participants ({sportEvent.participants.length})
                  </Text>
                  <TextButton
                    text="See more"
                    onPress={() => {
                      const params: SportEventParticipantsParams = {
                        id: route.params.id,
                      };
                      navigation.navigate(ROUTES.EVENT_PARTICIPANTS, params);
                    }}
                  />
                </HStack>
                <VStack space="4">
                  {sportEvent.participants
                    .slice(0, 3)
                    .map((participant, index) => (
                      <Person
                        key={`#participant-${participant.id}-${index}`}
                        size="md"
                        name={participant.name}
                        email={participant.email}
                      />
                    ))}
                </VStack>
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
        <Divider />
        <HStack
          px="5"
          py="4"
          justifyContent="space-between"
          alignItems="center"
        >
          <View flexGrow={1} mr="2">
            {!sportEvent.isCreator && !sportEvent.hasJoined && (
              <Button
                text={isSportEventFull ? "Event is full" : "Join now"}
                variant="solid"
                colorScheme={isSportEventFull ? "trueGray" : "red"}
                onPress={isSportEventFull ? undefined : handleJoinSportEvent}
              />
            )}
            {sportEvent.isCreator && (
              <Button
                text="Cancel event"
                variant="solidDark"
                colorScheme="red"
                onPress={handleCancelSportEvent}
              />
            )}
            {!sportEvent.isCreator && sportEvent.hasJoined && (
              <Button
                text="Unjoin now"
                variant="solidDark"
                colorScheme="red"
                onPress={handleUnjoinSportEvent}
              />
            )}
          </View>
          <ButtonIcon
            Icon={CommentIcon}
            onPress={() =>
              navigation.navigate(ROUTES.COMMENT, {
                id: route.params.id,
              })
            }
          />
        </HStack>
      </VStack>
    </Auth>
  );
};

export default SportEventDetailsScreen;
