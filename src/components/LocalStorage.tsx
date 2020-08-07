/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-community/async-storage";

class LocalStorage {
  async setItem(key: string, value: any): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async getItem<T>(key: string): Promise<T | null> {
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

  async deleteItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}

const localStorage = new LocalStorage();
export default localStorage;
