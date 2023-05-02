import { Pressable, Text } from "native-base";
import { FC } from "react";

type Props = {
  text: string;
  active?: boolean;
  onPress?: () => void;
};

export const ButtonTab: FC<Props> = ({ onPress, text, active }) => (
  <Pressable
    _light={{
      paddingY: 1,
      paddingX: 2,
      rounded: 6,
      backgroundColor: "orange.100",
      borderWidth: 1,
      borderColor: active ? "orange.500" : "orange.100",
    }}
    onPress={onPress}
  >
    <Text
      _light={{
        fontWeight: "medium",
        color: "orange.500",
        fontSize: 12,
      }}
    >
      {text}
    </Text>
  </Pressable>
);
