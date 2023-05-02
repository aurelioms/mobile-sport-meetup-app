import { Divider, Flex, HStack, Text, View, VStack } from "native-base";
import React, { FC, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextButton } from "../components/button";
import { KeyIcon, LogoutIcon } from "../components/icons";
import { ProfileMenu } from "../components/menu";
import { Avatar } from "../components/person";
import { PersonalDetailTable } from "../components/table/personal-detail-table";
import * as SecureStore from "expo-secure-store";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constants";
import { useGetLoggedInUser } from "../hooks";
import { FadeIn } from "../components/transition";
import { handleAPIError } from "../util";
import { Loading } from "../components/loading";
import { Auth } from "../components/auth";

const ProfileScreen: FC = () => {
  const navigation = useNavigation<any>();
  const isFocus = useIsFocused();

  const { data, error, loading, refetch } = useGetLoggedInUser();

  const onLogout = async () => {
    await SecureStore.deleteItemAsync("auth_token");

    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.LOGIN }],
    });
  };

  useEffect(() => {
    if (isFocus) refetch();
  }, [isFocus]);

  useEffect(() => {
    if (error) handleAPIError({ error, navigation });
  }, [error]);

  if (loading) return <Loading />;

  return (
    <Auth>
      <SafeAreaView>
        <VStack bgColor="white" height="full">
          <Flex
            justifyContent="center"
            px={6}
            py={4}
            minH="40"
            bgColor="orange.500"
            roundedBottomLeft={32}
            roundedBottomRight={32}
          >
            {!loading && data ? (
              <FadeIn>
                <HStack space={6} alignItems="center">
                  <Avatar name={data.name} color="emerald.700" size="xl" />
                  <VStack space={2}>
                    <Text color="white" fontWeight="medium" fontSize={20}>
                      {data.name}
                    </Text>
                    <View
                      alignSelf="flex-start"
                      px={2}
                      py={0.5}
                      rounded={8}
                      bgColor="white"
                    >
                      <Text
                        fontSize={12}
                        fontWeight="medium"
                        bgColor="trueGray.600"
                      >
                        Verified
                      </Text>
                    </View>
                  </VStack>
                </HStack>
              </FadeIn>
            ) : null}
          </Flex>
          {!loading && data ? (
            <FadeIn>
              <VStack mt={2} px={6} py={4} space={4}>
                <HStack alignItems="center">
                  <Text
                    color="trueGray.700"
                    fontSize={18}
                    fontWeight="semibold"
                  >
                    Personal Details
                  </Text>
                  <View ml="auto">
                    <TextButton
                      onPress={() => navigation.navigate(ROUTES.UPDATE_PROFILE)}
                      fontSize={14}
                      text="Edit"
                    />
                  </View>
                </HStack>
                <PersonalDetailTable user={data} />
              </VStack>
              <VStack mt={2} px={6} py={4} space={4}>
                <Text color="trueGray.700" fontSize={18} fontWeight="semibold">
                  Others
                </Text>
                <VStack space={3}>
                  <ProfileMenu
                    onPress={() => navigation.navigate(ROUTES.CHANGE_PASSWORD)}
                    Icon={KeyIcon}
                    text="Change Password"
                  />
                  <Divider />
                  <ProfileMenu
                    onPress={onLogout}
                    variant="danger"
                    Icon={LogoutIcon}
                    text="Logout"
                  />
                  <Divider />
                </VStack>
              </VStack>
            </FadeIn>
          ) : null}
        </VStack>
      </SafeAreaView>
    </Auth>
  );
};

export default ProfileScreen;
