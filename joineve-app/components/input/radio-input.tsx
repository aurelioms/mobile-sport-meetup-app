import { HStack, Radio, Text } from "native-base";
import { FC } from "react";

type Props = {
  name: string;
  value?: any;
  onChange?: (value: string, name: string) => unknown;
  options: {
    text: string;
    value: any;
  }[];
};

export const RadioInput: FC<Props> = ({ options, value, onChange, name }) => {
  return (
    <Radio.Group
      value={String(value)}
      onChange={(newValue) => onChange?.(newValue, name)}
      name={name}
    >
      <HStack space={4}>
        {options.map(({ text, value: itemValue }, i) => (
          <Radio
            onTouchEnd={() => {
              if (String(itemValue) === String(value)) onChange?.("", name);
            }}
            colorScheme="orange"
            key={i}
            value={String(itemValue)}
            size="sm"
          >
            <Text color="trueGray.700">{text}</Text>
          </Radio>
        ))}
      </HStack>
    </Radio.Group>
  );
};
