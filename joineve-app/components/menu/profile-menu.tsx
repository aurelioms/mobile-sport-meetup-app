import { HStack, Pressable, Text } from "native-base";
import { FC } from "react";
import { IconComponent } from "../icons";

type Props = {
  Icon: IconComponent;
  text: string;
  onPress?: () => unknown;
  variant?: "danger" | "normal";
};

export const ProfileMenu: FC<Props> = ({
  Icon,
  text,
  onPress,
  variant = "normal",
}) => {
  return (
    <Pressable onPress={onPress}>
      <HStack space={4} alignItems="center">
        <Icon color={variant === "danger" ? "#DC2626" : undefined} />
        <Text
          fontWeight="medium"
          color={variant === "normal" ? "trueGray.600" : "red.600"}
        >
          {text}
        </Text>
      </HStack>
    </Pressable>
  );
};
