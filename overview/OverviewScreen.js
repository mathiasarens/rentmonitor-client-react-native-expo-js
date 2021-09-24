import React, {useCallback, useEffect} from 'react';
import { Button, View } from 'react-native';
import { useTranslation } from "react-i18next";
import { authenticatedFetch, handleAuthenticationError } from '../authentication/authenticatedFetch';
import { Alert } from "native-base";

export default function OverviewScreen({ navigation }) {
  const { t, i18n } = useTranslation();

  const loadTenantBookingOverview = useCallback(() => {
    authenticatedFetch('/tenant-booking-overview', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBookingSumPerTenants(data);
      })
      .catch((error) => {
        Alert({
          message: t(handleAuthenticationError(error)),
          variant: 'error',
        });
      });
  }, [t, navigation]);
  
  useEffect(() => {
    loadTenantBookingOverview();
  },[]);

  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => navigation.navigate('Notifications')}
          title="Go to notifications"
        />
      </View>
    );
  }