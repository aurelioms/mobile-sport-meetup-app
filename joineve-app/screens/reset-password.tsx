import React, { FC } from "react";
import { Text, VStack } from "native-base";
import { Input } from "../components/input";
import { Button } from "../components/button/button";
import { ResetPasswordVector } from "../components/vectors";
import { useForm } from "../hooks";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { resetForgetPasswordWithCode } from "../api/auth";
import { ROUTES } from "../constants";
import { handleAPIError } from "../util";

type Props = {
  route: RouteProp<{ params: { code: string } }, "params">;
};

const ResetPasswordScreen: FC<Props> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { code } = route.params;

  const {
    values: { confirmPassword, password },
    onChange,
    errors,
    handleError,
  } = useForm({
    password: "",
    confirmPassword: "",
  });

  const onSubmit = async () => {
    try {
      await resetForgetPasswordWithCode({ code, password, confirmPassword });

      navigation.navigate(ROUTES.LOGIN, { code });
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError });
    }
  };

  return (
    <VStack flex={1} px="8" py="6" justifyContent="center" alignItems="center">
      <ResetPasswordVector />
      <VStack w="full" mt="6" mb="9" space="0.5">
        <Text color="orange.500" fontWeight="600" fontSize="2xl">
          Reset your password!
        </Text>
        <Text color="trueGray.600" fontWeight="400" fontSize="xs">
          So it's you, now enter your new password.
        </Text>
      </VStack>
      <VStack w="full" space="5" mb="9">
        <Input
          placeholder="Password"
          type="password"
          value={password}
          name="password"
          onChangeText={onChange}
          errorText={errors.password}
        />
        <Input
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
          name="confirmPassword"
          onChangeText={onChange}
          errorText={errors.confirmPassword}
        />
      </VStack>
      <Button text="Reset password" onPress={onSubmit} />
    </VStack>
  );
};

export default ResetPasswordScreen;
