import { Input as NBInput, View } from "native-base";
import { FC } from "react";
import { ReturnKeyTypeOptions } from "react-native";
import { ErrorMessage } from "./error-message";

type Props = {
  value?: string;
  name: string;
  placeholder: string;
  isDisabled?: boolean;
  type?: "text" | "password";
  onChangeText?: (text: string, name: string) => void;
  errorText?: string;
  InputLeftElement?: JSX.Element | JSX.Element[];
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

export const Input: FC<Props> = ({
  placeholder,
  value,
  name,
  isDisabled = false,
  type,
  onChangeText,
  errorText,
  InputLeftElement,
  returnKeyType,
  onSubmitEditing,
}) => {
  return (
    <View>
      <NBInput
        InputLeftElement={InputLeftElement}
        placeholder={placeholder}
        w="100%"
        size="md"
        py="1.5"
        isDisabled={isDisabled}
        type={type}
        value={value}
        returnKeyType={returnKeyType}
        onSubmitEditing={({ nativeEvent }) =>
          onSubmitEditing?.(nativeEvent.text, name)
        }
        _light={errorText ? errorStyles : {}}
        _focus={errorText ? errorStyles : focusStyles}
        _disabled={{
          opacity: "100"
        }}
        onChangeText={(value) => onChangeText?.(value, name)}
      />
      <ErrorMessage text={errorText} />
    </View>
  );
};
