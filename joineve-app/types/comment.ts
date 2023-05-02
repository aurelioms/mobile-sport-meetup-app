import { User } from "./user";

export type Comment = {
  id: string;
  userId: string;
  user: User;
  sportEventId: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
};
