import { Pressable } from "native-base";
import { FC } from "react";
import { IconComponent } from "../icons";

type Props = {
  Icon: IconComponent;
  active?: boolean;
  borderless?: boolean;
  onPress?: () => unknown;
  disabled?: boolean;
};

export const ButtonIcon: FC<Props> = ({
  Icon,
  active,
  borderless = true,
  onPress,
  disabled = false,
}) => {
  return (
    <Pressable
      disabled={disabled}
      _light={
        active
          ? {
              rounded: 4,
              borderWidth: 1,
              borderColor: "orange.300",
              bgColor: "orange.100",
            }
          : {
              borderWidth: 1,
              bgColor: "white",
              rounded: 4,
              borderColor: borderless ? "white" : "muted.300",
            }
      }
      onPress={onPress}
      p={2}
    >
      <Icon color={disabled ? "#D4D4D4" : active ? "#F97316" : "#404040"} />
    </Pressable>
  );
};
