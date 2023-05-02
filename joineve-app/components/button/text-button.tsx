import { FC } from "react";
import { Pressable, Text } from "native-base";
import { GestureResponderEvent } from "react-native";

type Props = {
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
  fontSize?: string | number;
};

export const TextButton: FC<Props> = ({ text, onPress, fontSize = "xs" }) => {
  return (
    <Pressable onPress={onPress}>
      <Text color="orange.500" fontWeight="500" fontSize={fontSize}>
        {text}
      </Text>
    </Pressable>
  );
};
