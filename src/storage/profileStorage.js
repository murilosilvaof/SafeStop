import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "./keys";

export async function loadStoredProfile() {
  const serializedProfile = await AsyncStorage.getItem(STORAGE_KEYS.userProfile);

  if (!serializedProfile) {
    return null;
  }

  return JSON.parse(serializedProfile);
}

export async function persistProfile(profile) {
  await AsyncStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
}

export async function clearStoredProfile() {
  await AsyncStorage.removeItem(STORAGE_KEYS.userProfile);
}
