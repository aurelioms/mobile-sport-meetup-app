import { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SportEventParticipantsRouteProps } from "./types";
import { ScrollView, VStack } from "native-base";
import { useGetSportEventParticipants } from "../hooks/use-get-sport-event-participants";
import { handleAPIError } from "../util";
import { Person } from "../components/person";
import { Loading } from "../components/loading";
import { Auth } from "../components/auth";

const SportEventParticipantsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SportEventParticipantsRouteProps>();

  const { data: participants, error } = useGetSportEventParticipants({
    id: route.params.id,
  });

  useEffect(() => {
    if (error) handleAPIError({ error, navigation });
  }, [error]);

  useEffect(() => {
    if (participants !== null) {
      navigation.setOptions({
        title: `Participants (${participants.length})`,
      });
    }
  }, [navigation, participants]);

  if (participants === null) return <Loading />;

  return (
    <Auth>
      <ScrollView h="full" bgColor="white">
        <VStack flex={1} px="5" pt="5" pb="8">
          <VStack space="4">
            {participants.map((participant, index) => (
              <Person
                key={`#participant-${participant.id}-${index}`}
                name={participant.name}
                email={participant.email}
              />
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    </Auth>
  );
};

export default SportEventParticipantsScreen;
