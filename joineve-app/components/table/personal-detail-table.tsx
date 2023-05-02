import { format } from "date-fns";
import { Divider, HStack, Text, View, VStack } from "native-base";
import { FC } from "react";
import { User } from "../../types";

type RowProps = {
  title: string;
  value: string;
};

const Row: FC<RowProps> = ({ title, value }) => {
  return (
    <HStack space={4}>
      <View width={20}>
        <Text color="trueGray.600">{title}</Text>
      </View>
      <View>
        <Text color="trueGray.600">{value}</Text>
      </View>
    </HStack>
  );
};

type Props = {
  user: User;
};

export const PersonalDetailTable: FC<Props> = ({ user }) => {
  return (
    <VStack space={2}>
      <Row title="Name" value={user.name} />
      <Divider />
      <Row title="Email" value={user.email} />
      <Divider />
      <Row title="Gender" value={user.gender} />
      <Divider />
      <Row
        title="Birthdate"
        value={format(new Date(user.birthDate), "do LLLL yyyy")}
      />
      <Divider />
    </VStack>
  );
};
