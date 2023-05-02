import { SportEvent, SportEventParticipant } from "../types";
import { internalAPI } from "./internal-api";

type Params = {
  fromDate?: Date;
  toDate?: Date;
  city?: string;
  sportType?: string;
  keyword?: string;
};

export const getAllSportEvents = async ({
  city,
  fromDate,
  sportType,
  toDate,
  keyword,
}: Params) => {
  const response = await internalAPI.get("/sport-event", {
    params: {
      city,
      fromDate,
      sportType,
      toDate,
      keyword,
      isCancelled: false,
    },
  });

  return response.data.data as SportEvent[];
};

export const getJoinedSportEvents = async () => {
  const response = await internalAPI.get("/user/joined-events");

  return response.data.data as SportEvent[];
};

export const getCreatedSportEvents = async () => {
  const response = await internalAPI.get("/user/created-events");

  return response.data.data as SportEvent[];
};

type GetSportEventDetailsParams = { id: string };

type GetSportEventDetailsResponse = SportEvent & {
  isCreator: boolean;
  hasJoined: boolean;
};

export const getSportEventDetails = async (
  params: GetSportEventDetailsParams
) => {
  const { id } = params;
  const response = await internalAPI.get(`/sport-event/${id}`);

  return response.data.data as GetSportEventDetailsResponse;
};

type GetSportEventParticipantsParams = { id: string };

export const getSportEventParticipants = async (
  params: GetSportEventParticipantsParams
) => {
  const { id } = params;
  const response = await internalAPI.get(`/sport-event/${id}/people`);

  return response.data.data as SportEventParticipant[];
};

type JoinSportEventParams = { id: string };

export const joinSportEvent = async (params: JoinSportEventParams) => {
  const { id } = params;
  const response = await internalAPI.post(`/sport-event/${id}/join`);

  return response.data.data as unknown;
};

type UnjoinSportEventParams = { id: string };

export const unjoinSportEvent = async (params: UnjoinSportEventParams) => {
  const { id } = params;
  const response = await internalAPI.post(`/sport-event/${id}/cancel-join`);

  return response.data.data as unknown;
};

type CancelSportEventParams = { id: string };

export const cancelSportEvent = async (params: CancelSportEventParams) => {
  const { id } = params;
  const response = await internalAPI.put(`/sport-event/${id}/cancel`);

  return response.data.data as unknown;
};

type CreateSportEventParams = {
  name: string;
  description: string;
  sportTypeId: string;
  startAt: string;
  endAt: string;
  maxParticipant: number;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  longitude: string;
  latitude: string;
};

export const createSportEvent = async (
  params: CreateSportEventParams
): Promise<unknown> => {
  const response = await internalAPI.post("/sport-event", {
    ...params,
  });

  return response.data.data;
};

type UpdateSportEventParams = {
  id: string;
  name: string;
  description: string;
  sportTypeId: string;
  startAt: string;
  endAt: string;
  maxParticipant: number;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  longitude: string;
  latitude: string;
};

export const updateSportEvent = async (
  params: UpdateSportEventParams
): Promise<unknown> => {
  const { id, ...others } = params;
  const response = await internalAPI.put(`/sport-event/${id}`, {
    ...others,
  });

  return response.data.data;
};
