import { useNavigation } from "@react-navigation/native";
import { Divider, Text, View, VStack } from "native-base";
import { updateUserPassword } from "../api";
import { Auth } from "../components/auth";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { ROUTES } from "../constants";
import { useForm } from "../hooks";
import { handleAPIError } from "../util";

const ChangePasswordScreen = () => {
  const navigation = useNavigation<any>();
  const {
    errors,
    handleError,
    onChange,
    values: { confirmPassword, currentPassword, newPassword },
  } = useForm({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onSubmit = async () => {
    try {
      await updateUserPassword({
        confirmPassword,
        currentPassword,
        newPassword,
      });

      navigation.navigate(ROUTES.APP_TAB.PROFILE);
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError });
    }
  };

  return (
    <Auth>
      <VStack height="full" bgColor="white">
        <VStack space={2} px={6} py={4}>
          <Text fontSize={16} fontWeight="medium">
            Edit Password
          </Text>
          <VStack space={2}>
            <Text fontSize={12} color="trueGray.700">
              Current Password
            </Text>
            <Input
              name="currentPassword"
              placeholder="Enter current password"
              onChangeText={onChange}
              value={currentPassword}
              type="password"
              errorText={errors.currentPassword}
            />
          </VStack>
          <VStack space={2}>
            <Text fontSize={12} color="trueGray.700">
              New Password
            </Text>
            <Input
              name="newPassword"
              placeholder="Enter new password"
              onChangeText={onChange}
              value={newPassword}
              type="password"
              errorText={errors.newPassword}
            />
          </VStack>
          <VStack space={2}>
            <Text fontSize={12} color="trueGray.700">
              Password Confirmation
            </Text>
            <Input
              name="confirmPassword"
              placeholder="Confirm your password"
              onChangeText={onChange}
              value={confirmPassword}
              type="password"
              errorText={errors.confirmPassword}
            />
          </VStack>
        </VStack>
        <View mt="auto">
          <Divider />
          <View px={6} py={4}>
            <Button onPress={onSubmit} text="Update Password" />
          </View>
        </View>
      </VStack>
    </Auth>
  );
};

export default ChangePasswordScreen;
