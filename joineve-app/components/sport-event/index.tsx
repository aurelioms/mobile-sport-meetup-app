import { format } from "date-fns";
import { Divider, HStack, Text, View, VStack, Pressable } from "native-base";
import { FC } from "react";
import { GestureResponderEvent } from "react-native";
import { SportEvent } from "../../types";
import { CalendarIcon, DirectionIcon, LocationIcon } from "../icons";
import { Avatar } from "../person";
import { FadeIn } from "../transition";

type Props = {
  onPress?: (event: GestureResponderEvent) => void;
  data: SportEvent;
};

export const SportEventCard: FC<Props> = ({
  onPress,
  data: {
    name,
    startAt,
    addressCity,
    distance,
    sportType,
    host,
    maxParticipant,
    participants,
    cancelledAt,
  },
}) => {
  return (
    <FadeIn>
      <Pressable
        _light={{
          borderColor: "trueGray.300",
          borderWidth: 1,
          overflow: "hidden",
          rounded: 6,
        }}
        onPress={onPress}
      >
        {cancelledAt ? (
          <View backgroundColor="red.500" px="2" py="0.5">
            <Text color="white" fontSize={12}>
              Event Cancelled
            </Text>
          </View>
        ) : null}
        {participants.length === maxParticipant ? (
          <View backgroundColor="red.500" px="2" py="0.5">
            <Text color="white" fontSize={12}>
              Event is full
            </Text>
          </View>
        ) : null}
        <VStack space={3} padding={4}>
          <Text
            _light={{
              fontWeight: "semibold",
              color: "trueGray.800",
              fontSize: 16,
            }}
          >
            {name}
          </Text>
          <HStack alignItems="center">
            <HStack space={2} alignItems="center" width="100%">
              <Avatar size="sm" name={host.name} />
              <Text fontSize={12} color="trueGray.600">
                by {host.name}
              </Text>
            </HStack>
            <Text color="trueGray.600" ml="auto">
              {participants.length} / {maxParticipant}
            </Text>
          </HStack>
          <Divider />
          <HStack alignItems="flex-start">
            <VStack space={2}>
              <HStack space={1}>
                <CalendarIcon size={18} />
                <Text fontSize={12} color="trueGray.600">
                  {format(new Date(startAt), "do LLL yyyy hh:mm aa")}
                </Text>
              </HStack>
              <HStack space={1}>
                <LocationIcon size={18} />
                <Text fontSize={12} color="trueGray.600">
                  {addressCity}, UK
                </Text>
              </HStack>
              {distance !== null && distance !== undefined ? (
                <HStack space={1}>
                  <DirectionIcon size={18} />
                  <Text fontSize={12} color="trueGray.600">
                    {(distance / 1000).toFixed(2)} km from your location
                  </Text>
                </HStack>
              ) : null}
            </VStack>
            <View
              ml="auto"
              backgroundColor="orange.100"
              paddingX={2}
              paddingY={1}
              rounded={6}
            >
              <Text fontWeight="medium" fontSize={12} color="orange.500">
                {sportType.name}
              </Text>
            </View>
          </HStack>
        </VStack>
      </Pressable>
    </FadeIn>
  );
};
