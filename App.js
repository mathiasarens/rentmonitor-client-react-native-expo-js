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
import { withAuthenticator } from 'aws-amplify-react-native'
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';
Amplify.configure({...awsconfig, Analytics: {
  disabled: true,
}});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App({ navigation }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  function LoggedInTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="overview"
          component={OverviewScreen}
          options={{ title: t("overview") }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NativeBaseProvider>
      
        <NavigationContainer>
          <Stack.Navigator>
              <>
                <Stack.Screen
                  name="rentmonitor"
                  component={LoggedInTabs}
                  options={{ title: t("rentmonitor") }}
                />
                <Stack.Screen
                  name="bookings"
                  component={BookingScreen}
                  options={{ title: t("bookings") }}
                />
              </>
          </Stack.Navigator>
        </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default withAuthenticator(App)