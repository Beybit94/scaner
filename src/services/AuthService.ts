import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";
import { ViewModels } from "./Utils/Models";
import { LocalStorage, StorageKeys } from "./Utils/LocalStorage";

export default class AuthService {
  static signInAsync = async (
    model: ViewModels.LoginModel
  ): Promise<Api.HttpResponse<Responses.UserModel>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.LOGIN,
      Body: {
        Login: model.login,
        Password: model.password,
      },
    };
    const response = await Api.post<Responses.UserModel>(request);

    return response;
  };

  static signOutAsync = async () => {
    await LocalStorage.setItem(StorageKeys.LOGEDIN, false);
  };

  static rememberUser = async (model: ViewModels.LoginModel) => {
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
    const login = await LocalStorage.getItem<ViewModels.LoginModel>(
      StorageKeys.SAVEME
    );
    return login;
  };
}
