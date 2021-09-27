import React, { useCallback, useEffect, useState } from "react";
import { Button, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import {
  authenticatedFetch,
  handleAuthenticationError,
} from "../authentication/authenticatedFetch";
import { Box, useToast, VStack, Text, Center, FlatList } from "native-base";
import { AuthContext } from "../authentication/AuthContext";
import { DrawerContentScrollView } from "@react-navigation/drawer";

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
    <Center flex="1">
      <FlatList
        data={bookingSumPerTenants}
        renderItem={({item}) => (
          <VStack space={2} mt={5}>
            <Text>{item.tenant.name}</Text>
            <Text>{item.sum}</Text>
          </VStack>
        )}
        keyExtractor={(bookingSumPerTenantsItem) =>
          bookingSumPerTenantsItem.tenant.id
        }
      />
      <Button onPress={() => loadTenantBookingOverview()} title="load" />
    </Center>
  );
}
