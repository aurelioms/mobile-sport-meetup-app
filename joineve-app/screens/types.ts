import { RouteProp } from "@react-navigation/native";

export type SportEventSourceRoute = "myEvent" | "explore" | "joined";

export type SportEventDetailsParams = {
  id: string;
};

export type SportEventParticipantsParams = {
  id: string;
};

export type UpdateSportEventParams = {
  id: string;
};

export type CommentParams = {
  id: string;
};

type ScreenRouteParamList = {
  SportEventDetailsScreen: SportEventDetailsParams;
  SportEventParticipantsScreen: SportEventParticipantsParams;
  UpdateSportEventScreen: UpdateSportEventParams;
  CommentScreen: CommentParams;
};

export type SportEventDetailsRouteProps = RouteProp<
  ScreenRouteParamList,
  "SportEventDetailsScreen"
>;

export type SportEventParticipantsRouteProps = RouteProp<
  ScreenRouteParamList,
  "SportEventParticipantsScreen"
>;

export type UpdateSportEventRouteProps = RouteProp<
  ScreenRouteParamList,
  "UpdateSportEventScreen"
>;

export type CommentRouteProps = RouteProp<
  ScreenRouteParamList,
  "CommentScreen"
>;
