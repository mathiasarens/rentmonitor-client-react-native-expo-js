import React, { useCallback, useEffect, useState } from "react";
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
import { subDays } from "date-fns";
import sub from "date-fns/sub";

export default function SynchronizationScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [bookingSumPerTenants, setBookingSumPerTenants] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingAccountStatements, setLoadingAccountStatements] =
    useState(false);
  const [accountSettingsItems, setAccountSettingsItems] = useState([]);
  const { reset, handleSubmit } = useForm({
    defaultValues: {
      accountSettingsItem: null,
      from: sub(new Date(), { months: 2 }),
      to: new Date(),
    },
  });
  const [expectedSyncResults, setExpectedSyncResults] = useState([]);
  const [syncResults, setSyncResults] = useState([]);
  const [synchronizationButtonActive, setSynchronizationButtonActive] =
    useState(false);

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
          if (responseAccountSettingsList.length > 0) {
            reset({
              accountSettingsItem: responseAccountSettingsList[0],
              from: sub(new Date(), { months: 2 }),
              to: new Date(),
            });
          }
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

  const sync = useCallback(() => {
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
              response.json().then((json) => {
                console.log(
                  "Sync result received for: " +
                    json.accountName +
                    " (" +
                    json.accountSettingsId +
                    ")"
                );
                console.log(json);
                console.log(syncResults);
                setSyncResults((prevSyncResults) => [...prevSyncResults, json]);
              });
              setExpectedSyncResults((arr) => {
                arr.pop();
                return arr;
              });
              break;
            case 210:
              response
                .json()
                .then((json) => {
                  console.log(json);
                  setExpectedSyncResults((arr) => {
                    arr.pop();
                    return arr;
                  });
                })
                .catch((error) => {
                  console.error(error);
                  toast.show({
                    title: t("connectionError"),
                  });
                  setExpectedSyncResults((arr) => {
                    arr.pop();
                    return arr;
                  });
                });
              break;
            default:
              console.error(response);
              toast.show({
                title: t("connectionError"),
              });
              setExpectedSyncResults((arr) => {
                arr.pop();
                return arr;
              });
          }
        })
        .catch((error) => {
          console.error(error);
          toast.show({
            title: t(handleAuthenticationError(error)),
          });
          setExpectedSyncResults((arr) => {
            arr.pop();
            return arr;
          });
        });
    };

    setExpectedSyncResults(new Array(accountSettingsItems.length).fill(0));
    setSyncResults([]);
    console.log("sync() called");
    console.log(syncResults);
    accountSettingsItems.forEach((accountSettingsItem) => {
      const request = {};
      request.from = sub(new Date(), { months: 2 });
      request.to = new Date();
      request.accountSettingsId = accountSettingsItem.id;
      synchronizeAccount(request);
    });
  }, [accountSettingsItems, t]);

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
      <FlatList
        data={accountSettingsItems}
        renderItem={({ item }) => (
          <Box px={4} py={2}>
            <HStack justifyContent="space-between">
              <Flex alignItems="flex-start">
                <Text>{item.name}</Text>
              </Flex>
            </HStack>
          </Box>
        )}
        keyExtractor={(accountSettingsItem) =>
          accountSettingsItem.id.toString()
        }
      />
      <VStack px={4} py={4}>
        <HStack space={2} justifyContent="space-between">
          <Button
            isLoading={
              synchronizationButtonActive && expectedSyncResults.length > 0
            }
            onPress={sync}
          >
            {t("overviewScreenSyncAccounts")}
          </Button>
        </HStack>
      </VStack>
      <VStack px={4} py={4}>
        {syncResults.map((syncResult,index) => {
          <Box key={`synResult${index}`}>
            <Text>{syncResult.accountName}</Text>
            <FlatList
              data={syncResult.newBookings}
              renderItem={({ booking }) => (
                <Box px={4} py={2}>
                  <HStack justifyContent="space-between">
                    <Flex alignItems="flex-start">
                      <Text>{booking.date}</Text>
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
              renderItem={({ transaction }) => (
                <Box px={4} py={2}>
                  <HStack justifyContent="space-between">
                    <Flex alignItems="flex-start">
                      <Text>{transaction.date}</Text>
                    </Flex>
                  </HStack>
                </Box>
              )}
              keyExtractor={(transaction) =>
                `${syncResult.accountName}${transaction.id.toString()}`
              }
            />
          </Box>
        })}
      </VStack>
      <VStack px={4} py={4}>
        {expectedSyncResults.map((item, index) => (
          <Skeleton.Text key={index} />
        ))}
      </VStack>
    </Box>
  );
}
