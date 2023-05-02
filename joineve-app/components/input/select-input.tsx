import { Select, View } from "native-base";
import { FC } from "react";
import { ErrorMessage } from "./error-message";

type Props = {
  name: string;
  placeholder: string;
  value?: any;
  errorText?: string;
  onChange?: (value: string, name: string) => unknown;
  options: {
    text: string;
    value: any;
  }[];
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

export const SelectInput: FC<Props> = ({
  options,
  value,
  name,
  errorText,
  onChange,
  placeholder,
}) => {
  return (
    <View>
      <Select
        _light={errorText ? errorStyles : {}}
        placeholder={placeholder}
        selectedValue={value}
        onValueChange={(newValue) => {
          if (newValue === "none") {
            onChange?.("", name);
            return;
          }

          onChange?.(newValue, name);
        }}
        fontSize={14}
        py="1.5"
      >
        <Select.Item label="None" value="none" />
        {options.map(({ text, value }, i) => (
          <Select.Item key={i} label={text} value={value} />
        ))}
      </Select>
      {errorText && <ErrorMessage text={errorText} />}
    </View>
  );
};
