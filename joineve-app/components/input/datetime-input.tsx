import { HStack, View } from "native-base";
import { Input } from "./input";
import { FC, useState } from "react";
import { CalendarIcon, ClockIcon } from "../icons";
import { ButtonIcon } from "../button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

type Props = {
  value: string | null;
  name: string;
  errorText?: string;
  onChange?: (value: string, name: string) => void;
  mode?: "date" | "time";
};

export const DateTimeInput: FC<Props> = ({
  value,
  name,
  mode,
  errorText,
  onChange,
}) => {
  const [show, setShow] = useState(false);

  const formattedValue = value
    ? format(new Date(value), mode === "date" ? "do LLLL yyyy" : "hh:mm aa")
    : "";

  return (
    <>
      <HStack space={1} direction="row" alignItems="flex-start">
        <View flexGrow={1}>
          <Input
            placeholder="Event date"
            value={formattedValue}
            name={name}
            errorText={errorText}
            isDisabled={true}
          />
        </View>
        <ButtonIcon
          Icon={mode === "date" ? CalendarIcon : ClockIcon}
          borderless={false}
          onPress={() => setShow(true)}
        />
      </HStack>
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode={mode}
          is24Hour={false}
          onChange={(event, dateTimeValue) => {
            setShow(false);
            onChange?.(dateTimeValue?.toISOString() || "", name);
          }}
        />
      )}
    </>
  );
};
