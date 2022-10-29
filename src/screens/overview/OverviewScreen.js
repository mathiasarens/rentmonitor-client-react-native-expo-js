import {
  Box,
  Container,
  Button,
  FlatList,
  Flex,
  HStack,
  Pressable,
  Text,
  useToast,
} from "native-base";
import {
  RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  authenticatedFetch,
  handleAuthenticationError,
} from "../../../authentication/authenticatedFetch";

export default function OverviewScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [bookingSumPerTenants, setBookingSumPerTenants] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const loadTenantBookingOverview = useCallback(() => {
    setLoadingBookings(true);
    authenticatedFetch("/tenant-booking-overview", {
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

  useEffect(() => {
    loadTenantBookingOverview();
  }, []);

  return (
    <Flex>
      <FlatList
        flexGrow={1}
        data={bookingSumPerTenants}
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={loadingBookings}
            onRefresh={() => loadTenantBookingOverview()}
          />
        }
        renderItem={({ item }) => (
          <Box px={4} py={2}>
            <Pressable
              onPress={() => {
                navigation.navigate("bookings", {
                  tenantId: item.tenant.id,
                  tenantName: item.tenant.name,
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
    </Flex>
  );
}
