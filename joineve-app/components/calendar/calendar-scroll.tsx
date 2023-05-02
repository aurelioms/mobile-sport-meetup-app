import { format, isEqual } from "date-fns";
import { HStack, Pressable, ScrollView, Text, View, VStack } from "native-base";
import { FC, useMemo } from "react";
import { getDateRange } from "../../util";
import { FadeIn } from "../transition";

type ItemProps = {
  active?: boolean;
  date: Date;
  onPress: (val: Date) => unknown;
};

export const CalendarScrollIcon: FC<ItemProps> = ({
  date,
  onPress,
  active,
}) => {
  return (
    <FadeIn>
      <Pressable
        rounded={6}
        borderWidth={1}
        bgColor={active ? "orange.500" : "trueGray.100"}
        borderColor={active ? "orange.500" : "trueGray.200"}
        onPress={() => onPress(date)}
      >
        <VStack
          alignItems="center"
          width={12}
          height="full"
          space={1}
          justifyContent="center"
        >
          <Text color={active ? "white" : "trueGray.700"}>
            {format(date, "EEE")}
          </Text>
          <Text color={active ? "white" : "trueGray.700"}>
            {format(date, "d")}
          </Text>
        </VStack>
      </Pressable>
    </FadeIn>
  );
};

type Props = {
  start: Date;
  end: Date;
  selected?: Date;
  name: string;
  onSelected?: (value: Date, name: string) => unknown;
};

export const CalendarScroll: FC<Props> = ({
  start,
  end,
  onSelected,
  selected = new Date(),
  name,
}) => {
  const selectedDate = new Date(selected);
  selectedDate.setHours(0, 0, 0, 0);

  const range = useMemo(() => getDateRange(start, end), [start, end]);

  const onDaySelected = (date: Date) => {
    onSelected?.(date, name);
  };

  return (
    <View height={16}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        px={4}
        horizontal={true}
      >
        <HStack space={4}>
          {range.map((date, i) => (
            <CalendarScrollIcon
              key={i}
              active={isEqual(date, selectedDate)}
              date={date}
              onPress={onDaySelected}
            />
          ))}
        </HStack>
        <View width={8} />
      </ScrollView>
    </View>
  );
};
