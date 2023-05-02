import React, { FC } from "react";
import { Text, VStack, HStack, Toast } from "native-base";
import { Button } from "../components/button/button";
import { ForgetPasswordVector } from "../components/vectors";
import { CodeInput } from "../components/input";
import { TextButton } from "../components/button";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constants";
import { useForm } from "../hooks";
import { checkForgetPasswordCode, getForgetPasswordCode } from "../api/auth";
import { handleAPIError } from "../util";

type Props = {
  route: RouteProp<{ params: { email: string } }, "params">;
};

const ForgetPasswordOtpScreen: FC<Props> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { email } = route.params;

  const {
    handleError,
    onChange,
    values: { code },
  } = useForm({
    code: "",
  });

  const resendOTP = async () => {
    await getForgetPasswordCode({ email });

    Toast.show({
      title: "OTP code sent",
    });
  };

  const onSubmit = async () => {
    try {
      await checkForgetPasswordCode({ code });

      navigation.navigate(ROUTES.RESET_PASSWORD, { code });
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
          Verify its you!
        </Text>
        <Text color="trueGray.600" fontWeight="400" fontSize="xs">
          An OTP to reset your password has been sent. Please check it out!
        </Text>
      </VStack>
      <VStack w="full" mb="9">
        <CodeInput name="code" value={code} onChange={onChange} />
      </VStack>
      <Button text="Verify" onPress={onSubmit} />
      <HStack mt="6" justifyContent="center" alignItems="center" space="1">
        <Text color="trueGray.600" fontWeight="400" fontSize="xs">
          Didn't receive the OTP?
        </Text>
        <TextButton text="Resend Token" onPress={resendOTP} />
      </HStack>
    </VStack>
  );
};

export default ForgetPasswordOtpScreen;
