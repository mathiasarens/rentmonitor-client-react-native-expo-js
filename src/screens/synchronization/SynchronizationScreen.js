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
        openSnackbar({
          message: t(handleAuthenticationError(error)),
          variant: "error",
        });
      });
  };

  const synchronizeAccounts = useCallback(() => {
    const today = new Date();
    console.log(
      "Fetch new account transactions request for: ",
      JSON.stringify({ from: subDays(today, 30), to: today }, null, 2)
    );
    setLoadingAccountStatements(true);
    authenticatedFetch("/account-synchronization/all", {
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
    loadAccountSettings();
  }, []);

  return (
    <Box
      flex={1}
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
      <Box px={4} py={4}>
        <HStack space={2} justifyContent="space-between">
          <Button
            isLoading={loadingAccountStatements}
            onPress={() => synchronizeAccounts()}
          >
            {t("overviewScreenSyncAccounts")}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
