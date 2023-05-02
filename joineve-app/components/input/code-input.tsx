import { RouteProp } from "@react-navigation/native";
import { Input as NBInput } from "native-base";
import { FC } from "react";

type Props = {
  name: string;
  value?: string;
  onChange?: (text: string, name: string) => void;
};

export const CodeInput: FC<Props> = ({ value, onChange, name }) => {
  return (
    <NBInput
      placeholder="000000"
      w="100%"
      size="2xl"
      textAlign="center"
      type="text"
      value={value}
      _focus={{
        backgroundColor: "orange.50",
        borderColor: "orange.500",
        selectionColor: "orange.100",
      }}
      onChangeText={(value) => onChange?.(value, name)}
    />
  );
};
