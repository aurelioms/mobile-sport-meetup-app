import React, { FC } from "react";
import { Text, VStack } from "native-base";
import { Input } from "../components/input";
import { Button } from "../components/button/button";
import { ForgetPasswordVector } from "../components/vectors";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constants";
import { useForm } from "../hooks";
import { getForgetPasswordCode } from "../api/auth";
import { handleAPIError } from "../util";

const ForgetPasswordScreen = () => {
  const navigation = useNavigation<any>();

  const {
    values: { email },
    errors,
    onChange,
    handleError,
  } = useForm({
    email: "",
  });

  const onSubmit = async () => {
    try {
      await getForgetPasswordCode({ email });

      navigation.navigate(ROUTES.FORGET_PASSWORD_OTP, { email });
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError });
    }
  };

  return (
    <VStack flex={1} px="8" py="6" justifyContent="center" alignItems="center">
      <ForgetPasswordVector />
      <VStack w="full" mt="6" mb="9" space="0.5">
        <Text color="orange.500" fontWeight="600" fontSize="2xl">
          Forget your password?
        </Text>
        <Text color="trueGray.600" fontWeight="400" fontSize="xs">
          It's okay. Input your email.
        </Text>
      </VStack>
      <VStack w="full" mb="9">
        <Input
          name="email"
          placeholder="Email"
          value={email}
          onChangeText={onChange}
          errorText={errors.email}
        />
      </VStack>
      <Button text="Forget password" onPress={onSubmit} />
    </VStack>
  );
};

export default ForgetPasswordScreen;
