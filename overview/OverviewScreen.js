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
import {subDays} from 'date-fns';
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

  const synchronizeAccounts = useCallback(() => {
    const today = new Date();
    authenticatedFetch("/account-synchronization/all", signOut, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body:{from: subDays(today, 30),to: today}
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Account synchronization result: ',data);
        toast.show({title: t('overviewScreenAccountSynchronizationResult', {
          numberOfAccounts: data.length,
          numberOfErrors: data.filter(item => 'error' in item).length
        })})
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          title: t(handleAuthenticationError(error)),
        });
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
            </Box>
          )}
          keyExtractor={(bookingSumPerTenantsItem) =>
            bookingSumPerTenantsItem.tenant.id
          }
        />
        <Box px={4} py={4}>
          <HStack space={2} justifyContent="space-between">
            <Button onPress={() => loadTenantBookingOverview()}>
              {t('overviewScreenLoad')}
            </Button>
            <Button onPress={() => synchronizeAccounts()}>
              {t('overviewScreenSyncAccounts')}
            </Button>
          </HStack>
        </Box>
      </Box>
    </Center>
  );
}
