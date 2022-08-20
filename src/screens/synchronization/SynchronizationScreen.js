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
  VStack,
  Skeleton,
} from "native-base";
import sub from "date-fns/sub";

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
    authenticatedFetch("/account-synchronization/test", {
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
      safeArea
    >
      <Box px={4}>
      <VStack>
        {accountSettingsItems.map((accountSettingsItem, index) => (
          <HStack space={2} justifyContent="space-between" py={1}>
            <Text>{accountSettingsItem.name}</Text>
          </HStack>
        ))}
      </VStack>
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
      <VStack>
        {syncState.syncResults.map((syncResult, index) => (
          <Box key={`synResult${index}`}>
            <Text>{syncResult.accountName}</Text>

            <FlatList
              data={syncResult.newBookings}
              renderItem={({ item }) => (
                <Box px={4} py={2}>
                  <HStack justifyContent="space-between">
                    <Flex alignItems="flex-start">
                      <Text>{item.date}</Text>
                    </Flex>
                  </HStack>
                </Box>
              )}
              keyExtractor={(booking) =>
                `${syncResult.accountName}${booking.id.toString()}`
              }
            />
            <FlatList
              data={syncResult.unmatchedTransactions}
              renderItem={({ item }) => (
                <Box px={4} py={2}>
                  <HStack justifyContent="space-between">
                    <Flex alignItems="flex-start">
                      <Text>{item.date}</Text>
                    </Flex>
                  </HStack>
                </Box>
              )}
              keyExtractor={(transaction) =>
                `${syncResult.accountName}${transaction.id.toString()}`
              }
            />
          </Box>
        ))}
      </VStack>
      <VStack>
        {syncState.expectedSyncResults.map((item, index) => (
          <Skeleton.Text key={`expectedSyncResults${index}`} />
        ))}
      </VStack>
      </Box>
    </Box>
  );
}
