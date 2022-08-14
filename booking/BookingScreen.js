import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Flex,
  useToast,
  HStack,
  Text,
  Center,
  FlatList,
  Box,
  Heading,
} from "native-base";
import {
  authenticatedFetch,
  handleAuthenticationError,
} from "../authentication/authenticatedFetch";
import format from "date-fns/format";

export default function BookingScreen({ route, navigation }) {
  const { t } = useTranslation();
  const toast = useToast();

  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookings, setBookings] = useState([]);

  const loadBookings = useCallback(
    (tenantId) => {
      setLoadingBookings(true);
      authenticatedFetch(
        "/bookings?filter[where][tenantId]=" + tenantId,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setBookings(data);
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
    },
    [t, navigation]
  );

  useEffect(() => {
    loadBookings(route.params.tenantId);
  }, [route.params.tenantId]);

  return (
    <Center>
      <Box
        w={{
          base: "100%",
          md: "25%",
        }}
        safeArea
      >
        <Heading px={4} pb={2}>{route.params.tenantName}</Heading>

        <FlatList
          data={bookings}
          renderItem={({ item }) => (
            <Box px={4} py={2}>
              <HStack space={2} justifyContent="space-between">
                <Flex alignItems="flex-start">
                  <Text>{format(new Date(item.date), t("dateFormat"))}</Text>
                </Flex>
                <Flex alignItems="flex-start" maxWidth={40}>
                  <Text>{item.comment}</Text>
                </Flex>
                <Flex alignItems="flex-end">
                  <Text>
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(item.amount / 100)}
                  </Text>
                </Flex>
              </HStack>
            </Box>
          )}
          keyExtractor={(booking) => booking.id.toString()}
        />
      </Box>
    </Center>
  );
}
