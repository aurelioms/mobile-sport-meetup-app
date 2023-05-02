import React from "react";
import { Divider, ScrollView, Text, VStack } from "native-base";
import { Input } from "../components/input";
import { Button } from "../components/button/button";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constants";
import { RegisterVector } from "../components/vectors";
import { useForm } from "../hooks";
import { signUp } from "../api/auth";
import { handleAPIError } from "../util";

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  const {
    values: { confirmPassword, email, name, password },
    errors,
    onChange,
    handleError,
  } = useForm({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmit = async () => {
    try {
      await signUp({ email, password, name, confirmPassword });

      navigation.navigate(ROUTES.ACCOUNT_VERIFICATION, { email });
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError });
    }
  };

  return (
    <ScrollView h="full" pt="6">
      <VStack
        flex={1}
        px="8"
        py="6"
        justifyContent="center"
        alignItems="center"
      >
        <RegisterVector />
        <VStack w="full" mt="6" mb="9" space="0.5">
          <Text color="orange.500" fontWeight="600" fontSize="2xl">
            Interested to find sport games?
          </Text>
          <Text color="trueGray.600" fontWeight="400" fontSize="xs">
            Enter your details to create an account
          </Text>
        </VStack>
        <VStack w="full" mb="6" space="2">
          <VStack w="full" space="5">
            <Input
              placeholder="Email"
              name="email"
              value={email}
              onChangeText={onChange}
              errorText={errors.email}
            />
            <Input
              placeholder="Full name"
              value={name}
              name="name"
              onChangeText={onChange}
              errorText={errors.name}
            />
            <Input
              placeholder="Password"
              value={password}
              type="password"
              name="password"
              onChangeText={onChange}
              errorText={errors.password}
            />
            <Input
              placeholder="Confirm password"
              value={confirmPassword}
              type="password"
              name="confirmPassword"
              onChangeText={onChange}
              errorText={errors.confirmPassword}
            />
          </VStack>
        </VStack>
        <Button text="Create account" onPress={onSubmit} />
        <Divider
          backgroundColor="trueGray.300"
          my="6"
          orientation="horizontal"
        />
        <Text color="trueGray.600" fontWeight="400" fontSize="xs" mb="6">
          Already have an account?
        </Text>
        <Button
          text="Sign in now"
          variant="outline"
          onPress={() => navigation.navigate(ROUTES.LOGIN)}
        />
      </VStack>
    </ScrollView>
  );
};

export default RegisterScreen;
