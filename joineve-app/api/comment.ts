import { Comment } from "../types";
import { internalAPI } from "./internal-api";

export type GetCommentsParams = {
  sportEventId: string;
};

export const getComments = async ({ sportEventId }: GetCommentsParams) => {
  const response = await internalAPI.get(
    `/sport-event/comment/${sportEventId}`
  );

  return response.data.data as Comment[];
};

export type CreateCommentParams = {
  sportEventId: string;
  content: string;
};

export const createComment = async ({
  content,
  sportEventId,
}: CreateCommentParams) => {
  const response = await internalAPI.post(
    `/sport-event/comment/${sportEventId}`,
    {
      content,
    }
  );

  return response.data.data;
};

export type DeleteCommentParams = {
  sportEventId: string;
  commentId: string;
};

export const deleteComment = async ({
  commentId,
  sportEventId,
}: DeleteCommentParams) => {
  const response = await internalAPI.delete(
    `/sport-event/comment/${sportEventId}/${commentId}`
  );

  return response.data.data;
};
