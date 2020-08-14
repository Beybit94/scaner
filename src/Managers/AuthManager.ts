import {
  LocalStorage,
  StorageKeys,
  LoginModel,
  UserModel,
  post,
  Endpoints,
  HttpResponse,
} from "../components";

export class AuthManager {
  static signInAsync = async (
    model: LoginModel
  ): Promise<HttpResponse<UserModel>> => {
    const response = await post<UserModel>(Endpoints.LOGIN, {
      Login: model.login,
      Password: model.password,
    });

    return response;
  };

  static signOutAsync = async () => {
    await LocalStorage.setItem(StorageKeys.LOGEDIN, false);
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
