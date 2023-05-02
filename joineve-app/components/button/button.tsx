import { FC } from "react";
import { GestureResponderEvent } from "react-native";
import { Button as NBButton } from "native-base";
import { ColorSchemeType } from "native-base/lib/typescript/components/types";

type Props = {
  text?: string;
  variant?: "solid" | "outline" | "solidDark";
  colorScheme?: ColorSchemeType;
  onPress?: (event: GestureResponderEvent) => void;
};

export const Button: FC<Props> = ({
  text = "Button",
  variant = "solid",
  colorScheme,
  onPress,
}) => {
  return (
    <NBButton
      colorScheme={colorScheme}
      w="100%"
      size="md"
      variant={variant}
      onPress={onPress}
    >
      {text}
    </NBButton>
  );
};
