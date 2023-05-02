import React from "react";
import { Divider, Text, Toast, VStack } from "native-base";
import { Input } from "../components/input";
import { Button } from "../components/button/button";
import { LoginVector } from "../components/vectors";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constants";
import { TextButton } from "../components/button";
import * as SecureStore from "expo-secure-store";
import { signIn } from "../api";
import { useForm } from "../hooks";
import { handleAPIError } from "../util";

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  const {
    values: { email, password },
    onChange,
    errors,
    handleError,
  } = useForm({
    email: "",
    password: "",
  });

  const onSubmit = async () => {
    try {
      const data = await signIn({ email, password });

      await SecureStore.setItemAsync("auth_token", data.token);

      Toast.show({ title: "Sign in success" });
      navigation.navigate(ROUTES.APP_TAB.INDEX, {
        screen: ROUTES.APP_TAB.HOME,
      });
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError });
    }
  };

  return (
    <VStack flex={1} px="8" py="6" justifyContent="center" alignItems="center">
      <LoginVector />
      <VStack w="full" mt="6" mb="9" space="0.5">
        <Text color="orange.500" fontWeight="600" fontSize="2xl">
          Welcome back!
        </Text>
        <Text color="trueGray.600" fontWeight="400" fontSize="xs">
          Please enter your credentials
        </Text>
      </VStack>
      <VStack w="full" mb="6" space="2" alignItems="flex-end">
        <VStack w="full" space="5">
          <Input
            placeholder="Email"
            value={email}
            name="email"
            onChangeText={onChange}
            errorText={errors.email}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            name="password"
            onChangeText={onChange}
            errorText={errors.password}
          />
        </VStack>
        <TextButton
          text="Forget password?"
          onPress={() => navigation.navigate(ROUTES.FORGET_PASSWORD)}
        />
      </VStack>
      <Button text="Sign in" onPress={onSubmit} />
      <Divider backgroundColor="trueGray.300" my="6" orientation="horizontal" />
      <Text color="trueGray.600" fontWeight="400" fontSize="xs" mb="6">
        Don't have account?
      </Text>
      <Button
        text="Create a new account"
        variant="outline"
        onPress={() => navigation.navigate(ROUTES.REGISTER)}
      />
    </VStack>
  );
};

export default LoginScreen;
