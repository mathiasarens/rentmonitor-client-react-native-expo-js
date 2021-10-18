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
  Button,
  Container,
} from "native-base";
import { AuthContext } from "../authentication/AuthContext";

export default function BookingScreen({ navigation, route }) {
  const { t } = useTranslation();
  const toast = useToast();
  const { signOut } = React.useContext(AuthContext);

  return (
    <Center flex={1}>
      <Box
        w={{
          base: "100%",
          md: "25%",
        }}
        safeArea
      >
          <Text>route.params.tenantId: {route.params.tenantId}</Text>
      </Box>
    </Center>
  );
}
