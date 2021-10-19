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
  Pressable,
  Container,
} from "native-base";
import { subDays } from "date-fns";
import { AuthContext } from "../authentication/AuthContext";
import { DrawerContentScrollView } from "@react-navigation/drawer";

export default function OverviewScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const { signOut } = React.useContext(AuthContext);
  const [bookingSumPerTenants, setBookingSumPerTenants] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingAccountStatements, setLoadingAccountStatements] =
    useState(false);

  const loadTenantBookingOverview = useCallback(() => {
    setLoadingBookings(true);
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
      })
      .finally(() => {
        setLoadingBookings(false);
      });
  }, [t, navigation]);

  const synchronizeAccounts = useCallback(() => {
    const today = new Date();
    console.log(
      "Fetch new account transactions request for: ",
      JSON.stringify({ from: subDays(today, 30), to: today }, null, 2)
    );
    setLoadingAccountStatements(true);
    authenticatedFetch("/account-synchronization/all", signOut, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: subDays(today, 30), to: today }, null, 2),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Account synchronization result: ", data);
        toast.show({
          title: t("overviewScreenAccountSynchronizationResult", {
            numberOfAccounts: data.length,
            numberOfErrors: data.filter((item) => "error" in item).length,
          }),
        });
      })
      .catch((error) => {
        console.log(
          "Error fetching new account transactions: ",
          JSON.stringify(error, null, 2)
        );
        toast.show({
          title: t(handleAuthenticationError(error)),
        });
      })
      .finally(() => {
        setLoadingAccountStatements(false);
      });
  }, []);

  useEffect(() => {
    loadTenantBookingOverview();
  }, []);

  return (
    <Center flex={1}>
      <Box
        w={{
          base: "100%",
          md: "25%",
        }}
        safeArea
      >
        <FlatList
          data={bookingSumPerTenants}
          renderItem={({ item }) => (
            <Box px={4} py={2}>
              <Pressable
                onPress={() => {
                  navigation.navigate("bookings", {
                    tenantId: item.tenant.id,
                  });
                }}
              >
                <HStack space={2} justifyContent="space-between">
                  <Flex alignItems="flex-start">
                    <Text>{item.tenant.name}</Text>
                  </Flex>
                  <Flex alignItems="flex-end">
                    <Text>
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(item.sum / 100)}
                    </Text>
                  </Flex>
                </HStack>
              </Pressable>
            </Box>
          )}
          keyExtractor={(bookingSumPerTenantsItem) =>
            bookingSumPerTenantsItem.tenant.id.toString()
          }
        />
        <Box px={4} py={4}>
          <HStack space={2} justifyContent="space-between">
            <Button
              isLoading={loadingBookings}
              onPress={() => loadTenantBookingOverview()}
            >
              {t("overviewScreenLoad")}
            </Button>
            <Button
              isLoading={loadingAccountStatements}
              onPress={() => synchronizeAccounts()}
            >
              {t("overviewScreenSyncAccounts")}
            </Button>
          </HStack>
        </Box>
      </Box>
    </Center>
  );
}
