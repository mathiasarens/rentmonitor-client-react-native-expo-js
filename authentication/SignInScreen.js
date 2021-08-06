import React, { useState } from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Alert,
} from "native-base";
import { AuthContext } from "./AuthContext";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { REACT_APP_BACKEND_URL_PREFIX } from "@env";

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t, i18n } = useTranslation();
  const [error, setError] = useState("");

  const { signIn } = React.useContext(AuthContext);

  const onSubmit = (formInputs) => {
    console.log("signing in", formInputs);
    console.log(
      "REACT_APP_BACKEND_URL_PREFIX",
      `${REACT_APP_BACKEND_URL_PREFIX}/users/login`
    );
    fetch(`${REACT_APP_BACKEND_URL_PREFIX}/users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInputs),
    })
      .then((response) => {
        console.log(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.error(data.error);
        } else {
          dispatch({ type: "SIGN_IN", token: data.token });
          history.push("/home");
        }
      })
      .catch((error) => {
        console.error(error);
        Alert({
          message: t("connectionError"),
          variant: "error",
        });
      });
  };

  return (
    <ScrollView>
      <Box flex={1} p={2} w="90%" mx="auto">
        <Alert>
          <Alert.Icon />
          <Alert.Title>{t("error")}</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert>
        <Heading size="lg" color="primary.500">
          Welcome
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
              onPress={handleSubmit(onSubmit)}
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
          </HStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
