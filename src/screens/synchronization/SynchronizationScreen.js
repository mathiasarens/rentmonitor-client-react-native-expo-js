import React, { useCallback, useEffect, useState, useReducer } from "react";
import { useTranslation } from "react-i18next";
import {
  authenticatedFetch,
  handleAuthenticationError,
} from "../../../authentication/authenticatedFetch";
import { useForm } from "react-hook-form";
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
  ScrollView,
  VStack,
  Skeleton,
  Heading,
} from "native-base";
import sub from "date-fns/sub";
import format from "date-fns/format";

const initialState = { expectedSyncResults: [], syncResults: [] };

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return {
        expectedSyncResults: new Array(action.data).fill(0),
        syncResults: [],
      };
    case "newResponse": {
      return {
        expectedSyncResults: state.expectedSyncResults.slice(0, -1),
        syncResults: [...state.syncResults, action.data],
      };
    }
    case "fail": {
      return {
        expectedSyncResults: state.expectedSyncResults.slice(0, -1),
        syncResults: state.syncResults,
      };
    }
    default:
      throw new Error(`Unknown ${action.type}`);
  }
}

export default function SynchronizationScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [accountSettingsItems, setAccountSettingsItems] = useState([]);
  const [synchronizationButtonActive, setSynchronizationButtonActive] =
    useState(false);
  const [syncState, dispatch] = useReducer(reducer, initialState);

  const loadAccountSettings = () => {
    authenticatedFetch("/account-settings", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        response.json().then((responseAccountSettingsList) => {
          setAccountSettingsItems(responseAccountSettingsList);
          setSynchronizationButtonActive(true);
        });
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          title: t(handleAuthenticationError(error)),
        });
      });
  };

  const synchronizeAccount = (request) => {
    const bodyJson = JSON.stringify(request, null, 2);
    authenticatedFetch("/account-synchronization/single", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: bodyJson,
    })
      .then((response) => {
        switch (response.status) {
          case 200:
            response
              .json()
              .then((json) => {
                console.log(
                  "Sync result received for: " +
                    json.accountName +
                    " (" +
                    json.accountSettingsId +
                    ")"
                );
                console.log(json);
                dispatch({ type: "newResponse", data: json });
              })
              .catch((error) => {
                console.error(error);
                toast.show({
                  title: t("connectionError"),
                });
                dispatch({ type: "fail" });
              });
            break;
          case 210:
            response
              .json()
              .then((json) => {
                console.log(json);
                dispatch({ type: "fail" });
              })
              .catch((error) => {
                console.error(error);
                toast.show({
                  title: t("connectionError"),
                });
                dispatch({ type: "fail" });
              });
            break;
          default:
            console.error(response);
            toast.show({
              title: t("connectionError"),
            });
            dispatch({ type: "fail" });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          title: t(handleAuthenticationError(error)),
        });
        dispatch({ type: "fail" });
      });
  };

  const sync = () => {
    dispatch({ type: "start", data: accountSettingsItems.length });
    console.log("sync() called");
    accountSettingsItems.forEach((accountSettingsItem) => {
      const request = {};
      request.from = sub(new Date(), { months: 2 });
      request.to = new Date();
      request.accountSettingsId = accountSettingsItem.id;
      synchronizeAccount(request);
    });
  };

  useEffect(() => {
    loadAccountSettings();
  }, []);

  return (
    <Box
      w={{
        base: "100%",
        md: "25%",
      }}
    >
      <Box px={4}>
        <Box mb={2}>
          <Heading size="md">{t("accounts")}</Heading>
          {accountSettingsItems.map((accountSettingsItem, index) => (
            <Text key={accountSettingsItem.id}>{accountSettingsItem.name}</Text>
          ))}
        </Box>
        <VStack mb={4}>
          <HStack space={2} justifyContent="space-between">
            <Button
              isLoading={
                synchronizationButtonActive &&
                syncState.expectedSyncResults.length > 0
              }
              onPress={sync}
            >
              {t("overviewScreenSyncAccounts")}
            </Button>
          </HStack>
        </VStack>
        <ScrollView>
          {syncState.syncResults.map((syncResult, syncIndex) => (
            <VStack key={`synResult${syncIndex}`} mb={4}>
              <Heading size="md">{syncResult.accountName}</Heading>
              <Heading size="xs">{t("syncScreenResultNewBookings")}</Heading>
              {syncResult.newBookings.map((booking, bookingIndex) => (
                <Box key={`booking${syncIndex}${booking.id}`} mb={2}>
                  <HStack justifyContent="space-between">
                    <Text>
                      {format(new Date(booking.date), t("dateFormat"))}
                    </Text>

                    <Text>
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(booking.amount / 100)}
                    </Text>
                  </HStack>
                  <Text>{booking.comment}</Text>
                </Box>
              ))}

              <Heading size="xs">
                {t("syncScreenResultUnmatchedTransactions")}
              </Heading>

              {syncResult.unmatchedTransactions.map(
                (transaction, transactionIndex) => (
                  <Box
                    key={`${
                      syncResult.accountName
                    }UnmatchedTransactions${transaction.id.toString()}`}
                    mb={2}
                  >
                    <HStack justifyContent="space-between">
                      <Text>
                        {format(new Date(transaction.date), t("dateFormat"))}
                      </Text>
                      <Text>
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(transaction.amount / 100)}
                      </Text>
                    </HStack>
                    <Text>{transaction.name}</Text>
                    <Text>{transaction.text}</Text>
                  </Box>
                )
              )}
            </VStack>
          ))}
        </ScrollView>
        <VStack>
          {syncState.expectedSyncResults.map((item, index) => (
            <Skeleton.Text key={`expectedSyncResults${index}`} />
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
