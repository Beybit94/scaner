import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";

export default class DictionaryService {
  static DamagePercent = async (): Promise<
    [Responses.BaseDictionary] | null | undefined
  > => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.DAMAGEPERCENT,
    };

    const response = await Api.post<[Responses.BaseDictionary]>(request);
    return response.data;
  };
}
