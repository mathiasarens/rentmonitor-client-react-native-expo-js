import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box, Button, FormControl, Heading, HStack, Icon,
  IconButton, Input,
  Link, Text, VStack
} from "native-base";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { AuthContext } from "./AuthContext";

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t, i18n } = useTranslation();

  const { signIn } = React.useContext(AuthContext);
  return (
    <ScrollView>
      <Box flex={1} p={2} w="90%" mx="auto">
        <Heading size="lg" color="primary.500">
          {t('welcome')}
        </Heading>
        <Heading color="muted.400" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={2} mt={5}>
          <FormControl>
            <FormControl.Label
              _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
            >
              Email ID
            </FormControl.Label>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
              name="email"
              defaultValue=""
            />
          </FormControl>
          <FormControl mb={5}>
            <FormControl.Label
              _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
            >
              Password
            </FormControl.Label>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  type="password"
                />
              )}
              name="password"
              defaultValue=""
            />
            <Link
              _text={{ fontSize: "xs", fontWeight: "700", color: "cyan.500" }}
              alignSelf="flex-end"
              mt={1}
            >
              Forget Password?
            </Link>
          </FormControl>
          <VStack space={2}>
            <Button
              colorScheme="cyan"
              _text={{ color: "white" }}
              onPress={handleSubmit(signIn)}
            >
              Login
            </Button>

            <HStack justifyContent="center" alignItem="center">
              <IconButton
                variant="unstyled"
                startIcon={
                  <Icon
                    as={<MaterialCommunityIcons name="facebook" />}
                    color="muted.700"
                    size="sm"
                  />
                }
              />
              <IconButton
                variant="unstyled"
                startIcon={
                  <Icon
                    as={<MaterialCommunityIcons name="google" />}
                    color="muted.700"
                    size="sm"
                  />
                }
              />
              <IconButton
                variant="unstyled"
                startIcon={
                  <Icon
                    as={<MaterialCommunityIcons name="github" />}
                    color="muted.700"
                    size="sm"
                  />
                }
              />
            </HStack>
          </VStack>
          <HStack justifyContent="center">
            <Text fontSize="sm" color="muted.700" fontWeight={400}>
              I'm a new user.{" "}
            </Text>
            <Link
              _text={{ color: "cyan.500", bold: true, fontSize: "sm" }}
              href="#"
            >
              Sign Up
            </Link>
            <Text>
              Version: ${REACT_APP_VERSION}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
