import React, { useCallback, useEffect, useState } from "react";
import { Button, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import {
  authenticatedFetch,
  handleAuthenticationError,
} from "../authentication/authenticatedFetch";
import { Box, useToast, VStack,Text } from "native-base";
import { AuthContext } from "../authentication/AuthContext";

export default function OverviewScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const { signOut } = React.useContext(AuthContext);
  const [bookingSumPerTenants, setBookingSumPerTenants] = useState([]);

  const loadTenantBookingOverview = useCallback(() => {
    authenticatedFetch("/tenant-booking-overview", signOut, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBookingSumPerTenants(data);
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          title: t(handleAuthenticationError(error)),
        });
      });
  }, [t, navigation]);

  useEffect(() => {
    loadTenantBookingOverview();
  }, []);

  return (
    <ScrollView>
      <Box flex={1} p={2} w="90%" mx="auto">
        {bookingSumPerTenants.map((bookingSumPerTenantItem) => {
          <VStack space={2} mt={5}>
            <Text>Hallo</Text>
            <Text>{bookingSumPerTenantItem.tenant.name}</Text>
          </VStack>
        })}
      </Box>
      <Button onPress={() => loadTenantBookingOverview()} title="load" />
    </ScrollView>
  );
}
