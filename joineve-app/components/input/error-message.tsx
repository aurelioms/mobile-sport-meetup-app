import { Text } from "native-base";
import { FC } from "react";

type Props = {
  text?: string;
};

export const ErrorMessage: FC<Props> = ({ text }) => {
  if (!text) return null;

  return (
    <Text
      _light={{
        color: "red.500",
        fontSize: 12,
        ml: 2,
        pt: 1,
      }}
    >
      {text}
    </Text>
  );
};
