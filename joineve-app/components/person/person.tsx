import { HStack, Text, VStack } from "native-base";
import { Avatar } from "./avatar";
import { FC } from "react";

type Props = {
  name: string;
  email: string;
  size?: "md" | "sm" | "lg" | "xs";
};

export const Person: FC<Props> = ({ name, email, size="md" }) => {
  const username = `@${email.split('@')[0]}`;

  return (
    <HStack space="2.5" alignItems="center">
      <Avatar name={name} size={size} />
      <VStack>
        <Text color="gray.800" fontSize={14}>
          {name}
        </Text>
        <Text color="gray.500" fontSize="xs">
          {username}
        </Text>
      </VStack>
    </HStack>
  );
};
