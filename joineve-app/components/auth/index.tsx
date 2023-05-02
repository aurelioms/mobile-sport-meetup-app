import { FC, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Loading } from "../loading";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../constants";

export const Auth: FC = ({ children }) => {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<"loading" | "granted">("loading");

  useEffect(() => {
    SecureStore.getItemAsync("auth_token").then((value) => {
      if (value) {
        setStatus("granted");
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.LOGIN }],
        });
      }
    });
  }, []);

  if (status === "loading") return <Loading />;

  return <>{children}</>;
};
