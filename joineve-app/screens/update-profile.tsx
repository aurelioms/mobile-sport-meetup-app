import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Divider, Text, View, VStack } from "native-base";
import { useEffect } from "react";
import { updateUserProfile } from "../api/user";
import { Auth } from "../components/auth";
import { Button } from "../components/button";
import { DateTimeInput, Input, SelectInput } from "../components/input";
import { Loading } from "../components/loading";
import { ROUTES } from "../constants";
import { useForm, useGetLoggedInUser } from "../hooks";
import { handleAPIError } from "../util";

const UpdateProfileScreen = () => {
  const navigation = useNavigation<any>();
  const {
    errors,
    handleError,
    onChange,
    setValue,
    values: { birthDate, name, gender },
  } = useForm({
    birthDate: new Date().toISOString(),
    name: "",
    gender: "Male",
  });

  const isFocus = useIsFocused();
  const { data, error, loading, refetch } = useGetLoggedInUser();

  useEffect(() => {
    if (isFocus) refetch();
  }, [isFocus]);

  useEffect(() => {
    if (error) handleAPIError({ error, navigation });
  }, [error]);

  useEffect(() => {
    if (!loading && data) {
      setValue({
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : "",
        gender: data.gender || "",
        name: data.name,
      });
    }
  }, [data, loading]);

  const onSubmit = async () => {
    try {
      await updateUserProfile({
        name,
        gender,
        birthDate: new Date(birthDate),
      });

      navigation.navigate(ROUTES.APP_TAB.PROFILE);
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError });
    }
  };

  const genderOptions = [
    {
      text: "Male",
      value: "Male",
    },
    {
      text: "Female",
      value: "Female",
    },
    {
      text: "Others",
      value: "Others",
    },
  ];

  if (loading) return <Loading />;

  return (
    <Auth>
      <VStack height="full" bgColor="white">
        <VStack space={2} px={6} py={4}>
          <Text fontSize={16} fontWeight="medium">
            Edit Personal Details
          </Text>
          <VStack space={2}>
            <Text fontSize={12} color="trueGray.700">
              Display name
            </Text>
            <Input
              name="name"
              placeholder="Enter your name"
              onChangeText={onChange}
              value={name}
              errorText={errors.name}
            />
          </VStack>
          <VStack space={2}>
            <Text fontSize={12} color="trueGray.700">
              Gender
            </Text>
            <SelectInput
              options={genderOptions}
              name="gender"
              placeholder="Gender"
              onChange={onChange}
              value={gender}
              errorText={errors.gender}
            />
          </VStack>
          <VStack space={2}>
            <Text fontSize={12} color="trueGray.700">
              Birth Date
            </Text>
            <DateTimeInput
              name="birthDate"
              mode="date"
              onChange={onChange}
              value={birthDate}
              errorText={errors.birthDate}
            />
          </VStack>
        </VStack>
        <View mt="auto">
          <Divider />
          <View px={6} py={4}>
            <Button onPress={onSubmit} text="Save changes" />
          </View>
        </View>
      </VStack>
    </Auth>
  );
};

export default UpdateProfileScreen;
