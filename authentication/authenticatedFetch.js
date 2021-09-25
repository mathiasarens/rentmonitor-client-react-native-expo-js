import { ACCESS_TOKEN} from './AuthContext';
import * as SecureStore from "expo-secure-store";
import { REACT_APP_BACKEND_URL_PREFIX } from "@env";

export async function authenticatedFetch(urlSuffix, signOut, options) {

  options.headers['Authorization'] = `Bearer ${await SecureStore.getItemAsync(ACCESS_TOKEN)}`;
  return fetch(
    `${REACT_APP_BACKEND_URL_PREFIX}${urlSuffix}`,
    options,
  ).then((response) => {
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        signOut();
      }
      return Promise.reject(response);
    } else {
      return response;
    }
  });
}

export function handleAuthenticationError(error) {
  if ([401, 403].indexOf(error.status) !== -1) {
    return 'unauthenticatedError';
  } else {
    return 'connectionError';
  }
}

export function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}
