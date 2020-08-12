import { LocalStorage, StorageKeys } from "../components";
import { LoginModel, UserModel } from "../components/Models";
import { post, Endpoints } from "../components/Request";

export class AuthManager {
  static signInAsync = async (
    model: LoginModel
  ): Promise<UserModel | undefined> => {
    const response = await post<UserModel>(Endpoints.LOGIN, {
      Login: model.login,
      Password: model.password,
    });

    return response.parsedBody;
  };

  static signOutAsync = async () => {
    //await LocalStorgae.deleteItem("userToken");
  };

  static rememberUser = async (model: LoginModel) => {
    try {
      await LocalStorage.setItem(StorageKeys.SAVEME, model);
    } catch (error) {}
  };

  static forgetUser = async () => {
    try {
      await LocalStorage.deleteItem(StorageKeys.SAVEME);
    } catch (error) {}
  };

  static getRemembered = async () => {
    const login = await LocalStorage.getItem<LoginModel>(StorageKeys.SAVEME);
    return login;
  };
}
