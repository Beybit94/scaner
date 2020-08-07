import { LocalStorgae } from "../components";
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
    await LocalStorgae.deleteItem("userToken");
  };

  static rememberUser = async (model: LoginModel) => {
    try {
      await LocalStorgae.setItem("saveMe", model);
    } catch (error) {}
  };

  static forgetUser = async () => {
    try {
      await LocalStorgae.deleteItem("saveMe");
    } catch (error) {}
  };

  static getRemembered = async () => {
    const login = await LocalStorgae.getItem<LoginModel>("saveMe");
    return login;
  };
}
