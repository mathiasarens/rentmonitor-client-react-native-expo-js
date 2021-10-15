import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Button, TextInput, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import OverviewScreen from "./overview/OverviewScreen";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./authentication/SignInScreen";
import { AuthContext, ACCESS_TOKEN } from "./authentication/AuthContext";
import { NativeBaseProvider, Alert } from "native-base";
import "./i18n";
import { useTranslation } from "react-i18next";
import { REACT_APP_BACKEND_URL_PREFIX } from "@env";
import * as SecureStore from "expo-secure-store";
import { useToast } from "native-base";
function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
const Stack = createStackNavigator();

export default function App({ navigation }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync(ACCESS_TOKEN);
      } catch (e) {
        console.log("Failed to restore ACCESS_TOKEN", e);
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (formInputs) => {
        console.log("signing in", formInputs);
        console.log(
          "REACT_APP_BACKEND_URL_PREFIX",
          `${REACT_APP_BACKEND_URL_PREFIX}/users/login`
        );
        try {
          const response = await fetch(
            `${REACT_APP_BACKEND_URL_PREFIX}/users/login`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formInputs),
            }
          );
          console.log(response.statusText);
          const json = await response.json();

          console.log(json);
          if (json.error) {
            console.log(
              "ERROR: Login failed",
              JSON.stringify(json.error, null, 2)
            );
            toast.show({
              title: t("signInError", { message: json.error.message }),
            });
          } else {
            await SecureStore.setItemAsync(ACCESS_TOKEN, json.token);
            dispatch({ type: "SIGN_IN", token: json.token });
          }
        } catch (error) {
          console.error(JSON.stringify(error, null, 2));
          toast.show({
            title: t("connectionError"),
          });
        }
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN);
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  return (
    <NativeBaseProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator>
            {state.userToken == null ? (
              <Stack.Screen name={t("signIn")} component={SignInScreen} />
            ) : (
              <Stack.Screen name={t("overview")} component={OverviewScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </NativeBaseProvider>
  );
}
