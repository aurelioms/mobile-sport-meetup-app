import { SportType } from "./sport-type";

export type SportEventParticipant = {
  id: string;
  name: string;
  email: string;
  profileImagePath: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

export type SportEvent = {
  id: string;
  name: string;
  description: string;
  sportTypeId: string | null;
  hostId: string;
  startAt: Date;
  endAt: Date;
  maxParticipant: number;
  addressStreet: string | null;
  addressCity: string | null;
  addressPostalCode: string | null;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date | null;
  cancelledAt: Date | null;
  host: {
    id: string;
    name: string;
    email: string;
    profileImagePath: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date | null;
  };
  participants: SportEventParticipant[];
  sportType: SportType;
  distance?: number | null;
};
