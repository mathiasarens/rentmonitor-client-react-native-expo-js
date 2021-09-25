import React, {useCallback, useEffect, useState} from 'react';
import { Button, View } from 'react-native';
import { useTranslation } from "react-i18next";
import { authenticatedFetch, handleAuthenticationError } from '../authentication/authenticatedFetch';
import { useToast } from "native-base";
import {AuthContext} from '../authentication/AuthContext';

export default function OverviewScreen({ navigation }) {
  const { t } = useTranslation();
  const toast = useToast();
  const { signOut } = React.useContext(AuthContext);
  const [ bookingSumPerTenant, setBookingSumPerTenants] = useState([]);

  const loadTenantBookingOverview = useCallback(() => {
    authenticatedFetch('/tenant-booking-overview', signOut, {
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
        console.error(error);
        toast.show({
          title: t(handleAuthenticationError(error))
        });
      });
  }, [t, navigation]);
  
  useEffect(() => {
    loadTenantBookingOverview();
  },[]);

  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => loadTenantBookingOverview()}
          title="load"
        />
      </View>
    );
  }