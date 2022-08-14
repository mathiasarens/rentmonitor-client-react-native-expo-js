import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import OverviewScreen from "./overview/OverviewScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider, Alert } from "native-base";
import "./i18n";
import { useTranslation } from "react-i18next";
import { useToast } from "native-base";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BookingScreen from "./booking/BookingScreen";

import { withAuthenticator } from "aws-amplify-react-native";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import SynchronizationScreen from "./src/screens/synchronization/SynchronizationScreen";

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App({ navigation }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  function OverviewStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
            name="overview"
            component={OverviewScreen}
            options={{ title: t("overviewScreen") }}
          />
          <Stack.Screen
            name="bookings"
            component={BookingScreen}
            options={{ title: t("bookingsScreen") }}
          />
      </Stack.Navigator>
    );
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="overviewStack"
            component={OverviewStack}
            options={{ title: t("overviewScreen") }}
          />
          <Tab.Screen
            name="synchronize"
            component={SynchronizationScreen}
            options={{ title: t("syncScreen") }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default withAuthenticator(App);
