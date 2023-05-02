import { Spinner, Center } from "native-base";
import { FC } from "react";

export const Loading: FC = () => {
  return (
    <Center flex={1} bgColor="white">
      <Spinner color="orange.500" size="lg" />
    </Center>
  );
};
