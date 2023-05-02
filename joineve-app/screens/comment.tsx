import {
  Divider,
  HStack,
  ScrollView,
  Text,
  VStack,
  View,
  Center,
  AlertDialog,
  Button,
  Pressable,
} from "native-base";
import { SendIcon } from "../components/icons";
import { Auth } from "../components/auth";
import { ButtonIcon } from "../components/button";
import { CommentRouteProps } from "./types";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Input } from "../components/input";
import { Avatar } from "../components/person";
import { formatDistance } from "date-fns";
import { useForm, useGetComments, useGetLoggedInUser } from "../hooks";
import { FC, useEffect, useRef, useState } from "react";
import { Loading } from "../components/loading";
import { handleAPIError } from "../util";
import { Comment } from "../types";
import { createComment, deleteComment } from "../api";

type MessageProps = {
  comment: Comment;
  onLongPress?: () => void;
};

const OtherComment: FC<MessageProps> = ({ comment }) => {
  return (
    <HStack w="full" mb="4" space="2">
      <Avatar name={comment.user.name} size="xs" />
      <VStack space="0.5" maxW="80" flex={1}>
        <HStack alignItems="center" justifyContent="space-between">
          <Text fontSize="sm" color="trueGray.800">
            {comment.user.name}
          </Text>
          <Text fontSize="xs" color="trueGray.400">
            {formatDistance(new Date(comment.createdAt), new Date())}
          </Text>
        </HStack>
        <View
          bgColor="trueGray.100"
          px="2"
          py="1.5"
          borderRightRadius="lg"
          borderBottomLeftRadius="lg"
        >
          <Text w="full" color="trueGray.600">
            {comment.content}
          </Text>
        </View>
      </VStack>
    </HStack>
  );
};

const MyComment: FC<MessageProps> = ({ comment, onLongPress }) => {
  return (
    <VStack ml="7" space="0.5" maxW="80" mb={4} flex={1}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize="xs" color="trueGray.400">
          {formatDistance(new Date(comment.createdAt), new Date())}
        </Text>
      </HStack>
      <Pressable
        onLongPress={onLongPress}
        bgColor="orange.500"
        px="2"
        py="1.5"
        borderLeftRadius="lg"
        borderTopRightRadius="lg"
      >
        <Text w="full" color="white">
          {comment.content}
        </Text>
      </Pressable>
    </VStack>
  );
};

const CommentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<CommentRouteProps>();

  const sportEventId = route.params.id;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const cancelRef = useRef(null);

  const onClose = () => setIsOpen(false);

  const {
    errors,
    handleError,
    onChange,
    setValue,
    values: { content },
  } = useForm({
    content: "",
  });

  const {
    data: user,
    error: userError,
    loading: userLoading,
  } = useGetLoggedInUser();

  const {
    data: comments,
    error: commentError,
    refetch,
  } = useGetComments({
    sportEventId,
  });

  const focuesed = useIsFocused();

  useEffect(() => {
    const error = commentError || userError;
    if (error) handleAPIError({ error, navigation });
  }, [commentError, userError]);

  useEffect(() => {
    if (focuesed) refetch();
  }, [focuesed]);

  const onSubmit = async () => {
    try {
      await createComment({ content, sportEventId });

      setValue({ content: "" });
      refetch();
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError, navigation });
    }
  };

  const onDelete = async () => {
    try {
      if (selectedComment) {
        await deleteComment({ commentId: selectedComment, sportEventId });
        onClose();
        refetch();
      }
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError, navigation });
    }
  };

  if (userLoading) return <Loading />;

  return (
    <Auth>
      <VStack flex={1} h="full" bgColor="white">
        <ScrollView>
          <VStack pt="5" px="4">
            {(comments || []).map((comment, i) => {
              if (comment.user.id === user?.id)
                return (
                  <MyComment
                    onLongPress={() => {
                      setIsOpen(true);
                      setSelectedComment(comment.id);
                    }}
                    key={i}
                    comment={comment}
                  />
                );

              return <OtherComment key={i} comment={comment} />;
            })}
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
            <Input
              name="content"
              placeholder="Write your comments..."
              onChangeText={onChange}
              errorText={errors.content}
              value={content}
            />
          </View>
          <ButtonIcon
            disabled={content.trim().length === 0}
            Icon={SendIcon}
            onPress={onSubmit}
          />
        </HStack>
      </VStack>
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Delete Comment</AlertDialog.Header>
            <AlertDialog.Body>
              Are you sure to remove this comment
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}
                >
                  Cancel
                </Button>
                <Button bgColor="orange.500" color="white" onPress={onDelete}>
                  Delete
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    </Auth>
  );
};

export default CommentScreen;
