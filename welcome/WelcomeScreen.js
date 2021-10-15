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
import { REACT_APP_BACKEND_URL_PREFIX, REACT_APP_VERSION } from "@env";

export default function WelcomScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [version, setVersion] = useState("down");

  const loadVersion = useCallback(() => {
    setLoadingBookings(true);
    fetch("/version", {
      method: "GET",
      headers: {
        Accept: "text",
      },
    })
      .then((response) => {
        return response.text();
      })
      .then((version) => {
        setVersion(version);
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          title: t(handleAuthenticationError(error)),
        });
      });
  }, [t, navigation]);

  useEffect(() => {
    loadVersion();
  }, []);

  return (
    <Center flex={1}>
      <Container>
        <HStack>
          <Text>Version: ${REACT_APP_VERSION}</Text>
          <Text>Backend URL: ${REACT_APP_BACKEND_URL_PREFIX}</Text>
          <Text>Backend Version: ${version}</Text>
        </HStack>
      </Container>
    </Center>
  );
}
