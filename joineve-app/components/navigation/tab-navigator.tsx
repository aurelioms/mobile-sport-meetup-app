import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "native-base";
import { FC } from "react";
import { ROUTES } from "../../constants";
import { ExploreScreen, HomeScreen, ProfileScreen } from "../../screens";
import { ExploreIcon, HomeIcon, IconComponent, PersonIcon } from "../icons";
import { HomeAppBar } from "./home-app-bar";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarShowLabel: false,
      headerStyle: {
        elevation: 0,
        borderBottomColor: "#D8D8D8",
        borderBottomWidth: 1,
      },
      tabBarStyle: {
        height: 60,
        paddingHorizontal: 64,
        elevation: 0,
        borderTopColor: "#D8D8D8",
        borderTopWidth: 1,
      },
    }}
  >
    <Tab.Screen
      name={ROUTES.APP_TAB.HOME}
      component={HomeScreen}
      options={{
        headerTitle: () => <HomeAppBar />,
        tabBarIcon: ({ focused }) => (
          <TabIcon active={focused} Icon={HomeIcon} />
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.APP_TAB.EXPLORE}
      component={ExploreScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon active={focused} Icon={ExploreIcon} />
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.APP_TAB.PROFILE}
      component={ProfileScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon active={focused} Icon={PersonIcon} />
        ),
      }}
    />
  </Tab.Navigator>
);

type TabIconProps = {
  active?: boolean;
  Icon: IconComponent;
};

const TabIcon: FC<TabIconProps> = ({ active, Icon }) => {
  return (
    <View
      _light={{
        padding: 2,
        rounded: 8,
        backgroundColor: active ? "#FDA31329" : "#fff",
      }}
    >
      <Icon size={28} color={active ? "#F97316" : "#404040"} />
    </View>
  );
};
