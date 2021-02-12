/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-community/async-storage";

export enum StorageKeys {
  NAVIGATION_STATE_KEY = "NAVIGATION_STATE_KEY",
  USER = "USER",
  LOGEDIN = "LOGEDIN",
  SAVEME = "SAVEME",
  ACTIVE_TASK = "ACTIVE_TASK",
}
export class LocalStorage {
  static async setItem(key: StorageKeys, value: any): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async getItem<T>(key: StorageKeys): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then((value) => {
          if (value !== null) {
            resolve(JSON.parse(value));
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static async deleteItem(key: StorageKeys): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}
