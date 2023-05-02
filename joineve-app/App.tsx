import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import {
  AccountVerificationScreen,
  SportEventDetailsScreen,
  ForgetPasswordOtpScreen,
  ForgetPasswordScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  SportEventParticipantsScreen,
  ChangePasswordScreen,
  UpdateProfileScreen,
  CreateSportEventScreen,
  UpdateSportEventScreen,
  CommentScreen,
} from "./screens";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { ButtonCustomTheme } from "./components/button";
import { ROUTES } from "./constants";
import { TabNavigator } from "./components/navigation";

const Stack = createNativeStackNavigator<any>();

const screenWithHeaderOptions: NativeStackNavigationOptions = {
  headerShown: true,
};

const screenWithoutHeaderOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

// extend the theme
export const theme = extendTheme({
  config,
  fontConfig: {
    Inter: {
      100: {
        normal: "Inter_100Thin",
      },
      200: {
        normal: "Inter_200ExtraLight",
      },
      300: {
        normal: "Inter_300Light",
      },
      400: {
        normal: "Inter_400Regular",
      },
      500: {
        normal: "Inter_500Medium",
      },
      600: {
        normal: "Inter_600SemiBold",
      },
      700: {
        normal: "Inter_700Bold",
      },
      800: {
        normal: "Inter_800ExtraBold",
      },
      900: {
        normal: "Inter_900Black",
      },
    },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
    mono: "Inter",
  },
  components: {
    Button: ButtonCustomTheme,
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <Stack.Navigator initialRouteName={ROUTES.APP_TAB.INDEX}>
          <Stack.Screen
            name={ROUTES.LOGIN}
            component={LoginScreen}
            options={screenWithoutHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.REGISTER}
            component={RegisterScreen}
            options={screenWithoutHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.ACCOUNT_VERIFICATION}
            component={AccountVerificationScreen as any}
            options={screenWithoutHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.FORGET_PASSWORD}
            component={ForgetPasswordScreen}
            options={screenWithoutHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.RESET_PASSWORD}
            component={ResetPasswordScreen as any}
            options={screenWithoutHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.FORGET_PASSWORD_OTP}
            component={ForgetPasswordOtpScreen as any}
            options={screenWithoutHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.APP_TAB.INDEX}
            component={TabNavigator}
            options={screenWithoutHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.EVENT_DETAILS}
            component={SportEventDetailsScreen}
            options={screenWithHeaderOptions}
          />
          <Stack.Screen
            name={ROUTES.EVENT_PARTICIPANTS}
            component={SportEventParticipantsScreen}
            options={{
              ...screenWithHeaderOptions,
              title: "Current Participants",
            }}
          />
          <Stack.Screen
            name={ROUTES.CHANGE_PASSWORD}
            component={ChangePasswordScreen}
            options={{
              ...screenWithHeaderOptions,
              title: "Change Password",
            }}
          />
          <Stack.Screen
            name={ROUTES.CREATE_EVENT}
            component={CreateSportEventScreen}
            options={{
              ...screenWithHeaderOptions,
              title: "Create Sport Event",
            }}
          />
          <Stack.Screen
            name={ROUTES.UPDATE_EVENT}
            component={UpdateSportEventScreen}
            options={{
              ...screenWithHeaderOptions,
              title: "Edit Sport Event",
            }}
          />
          <Stack.Screen
            name={ROUTES.UPDATE_PROFILE}
            component={UpdateProfileScreen}
            options={{
              ...screenWithHeaderOptions,
              title: "Edit Profile",
            }}
          />
          <Stack.Screen
            name={ROUTES.COMMENT}
            component={CommentScreen}
            options={{
              ...screenWithHeaderOptions,
              title: "Comments",
            }}
          />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
