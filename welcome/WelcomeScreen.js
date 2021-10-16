import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  authenticatedFetch,
  handleAuthenticationError,
} from "../authentication/authenticatedFetch";
import {
  Flex,
  useToast,
  HStack,
  VStack,
  Text,
  Center,
  FlatList,
  Box,
  Button,
  Container,
} from "native-base";
import { subDays } from "date-fns";
import { AuthContext } from "../authentication/AuthContext";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { REACT_APP_BACKEND_URL_PREFIX } from "@env";
import { version } from "../package.json";

export default function WelcomScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [backendVersion, setBackendVersion] = useState("down");

  const loadBackendVersion = useCallback(() => {
    fetch(`${REACT_APP_BACKEND_URL_PREFIX}/version`, {
      method: "GET",
      headers: {
        Accept: "text",
      },
    })
      .then((response) => {
        return response.text();
      })
      .then((version) => {
        setBackendVersion(version);
      })
      .catch((error) => {
        console.log(
          `Error loading version from ${REACT_APP_BACKEND_URL_PREFIX}/version`,
          JSON.stringify(error, null, 2)
        );
        toast.show({
          title: t(handleAuthenticationError(error)),
        });
      });
  }, [t, navigation]);

  useEffect(() => {
    loadBackendVersion();
  }, []);

  return (
    <Center flex={1}>

        <HStack mb={8} space={3} justifyContent="space-between">
          <Button onPress={() => navigation.navigate(t("signIn"))}>
            {t("signIn")}
          </Button>
          <Button onPress={() => navigation.navigate(t("signUp"))}>
            {t("signUp")}
          </Button>
        </HStack>

        <VStack alignContent="center" alignContent="center">
          <Text fontSize="xs">Version: {version}</Text>
          <Text fontSize="xs">Backend URL: {REACT_APP_BACKEND_URL_PREFIX}</Text>
          <Text fontSize="xs">Backend Version: {backendVersion}</Text>
        </VStack>
      
    </Center>
  );
}
