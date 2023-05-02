import { FC } from "react";
import { TextArea as NBTextArea, View } from "native-base";
import { ReturnKeyTypeOptions } from "react-native";
import { ErrorMessage } from "./error-message";

type Props = {
  value?: string;
  name: string;
  placeholder: string;
  type?: "text" | "password";
  onChangeText?: (text: string, name: string) => void;
  errorText?: string;
  onSubmitEditing?: (value: string, name: string) => unknown;
  returnKeyType?: ReturnKeyTypeOptions;
};

export const errorStyles = {
  backgroundColor: "red.50",
  borderColor: "red.500",
  selectionColor: "orange.100",
};

export const focusStyles = {
  backgroundColor: "orange.50",
  borderColor: "orange.500",
  selectionColor: "orange.100",
};

export const TextArea: FC<Props> = ({
  value,
  name,
  placeholder,
  type,
  onChangeText,
  errorText,
  onSubmitEditing,
  returnKeyType,
}) => {
  return (
    <View>
      <NBTextArea
        placeholder={placeholder}
        w="100%"
        size="md"
        py="1.5"
        type={type}
        value={value}
        returnKeyType={returnKeyType}
        onSubmitEditing={({ nativeEvent }) =>
          onSubmitEditing?.(nativeEvent.text, name)
        }
        _light={errorText ? errorStyles : {}}
        _focus={errorText ? errorStyles : focusStyles}
        onChangeText={(value) => onChangeText?.(value, name)}
      />
      <ErrorMessage text={errorText} />
    </View>
  );
};
