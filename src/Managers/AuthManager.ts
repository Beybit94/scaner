import { LocalStorgae } from "../components";

export class AuthManager {
  static signInAsync = async () => {
    await LocalStorgae.setItem("userToken", "test");
  };

  static signOutAsync = async () => {
    await LocalStorgae.deleteItem("userToken");
  };

  
}
