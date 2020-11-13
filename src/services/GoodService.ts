/* eslint-disable @typescript-eslint/ban-types */
import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";
import * as Storage from "./Utils/LocalStorage";

export enum GoodAction {
  good = 1,
  box,
  edit,
  remove,
}
export default class GoodService {
  static crud = async (action: GoodAction, good: Responses.GoodModel) => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    switch (action) {
      case GoodAction.good:
        if (task) {
          await GoodService.addGood(
            task.Id,
            task.PlanNum,
            good?.BarCode,
            good.GoodArticle
          );
        }
        break;
      case GoodAction.box:
        if (task) {
          await GoodService.addGood(
            task.Id,
            task.PlanNum,
            good?.BarCode,
            good.GoodArticle,
            good.BoxId
          );
        }
        break;
      case GoodAction.edit:
        await GoodService.editGood(good.Id, good.Count);
        break;
      case GoodAction.remove:
        await GoodService.removeGood(good.Id);
        break;
      default:
        break;
    }
  };

  static getGoodByTask = async (): Promise<
    [Responses.GoodModel] | undefined
  > => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.GOOD_BY_TASK,
      Body: {
        TaskId: task?.Id,
      },
    };

    const response = await Api.post<[Responses.GoodModel]>(request);
    return response.data;
  };

  static getGoodByBox = async (
    BoxId: number
  ): Promise<[Responses.GoodModel] | undefined> => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.GOOD_BY_BOX,
      Body: {
        BoxId: BoxId,
        TaskId: task?.Id,
      },
    };

    const response = await Api.post<[Responses.GoodModel]>(request);
    return response.data;
  };

  static getGoodByFilter = async (
    GoodArticle: string
  ): Promise<[Responses.GoodModel] | null | undefined> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.GOOD_BY_FILTER,
      Body: {
        GoodArticle: GoodArticle,
      },
    };

    const response = await Api.post<[Responses.GoodModel]>(request);
    return response.data;
  };

  static addGood = async (
    TaskId: number,
    PlanNum: string,
    BarCode: string,
    GoodArticle?: string,
    BoxId?: number
  ): Promise<Api.HttpResponse<{}>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.CREATE_GOOD,
      Body: {
        PlanNum: PlanNum,
        TaskId: TaskId,
        BarCode: BarCode,
        BoxId: BoxId,
        GoodArticle: GoodArticle,
      },
    };

    const response = await Api.post<{}>(request);
    return response;
  };

  static editGood = async (
    Id: number,
    Count: number
  ): Promise<Api.HttpResponse<{}>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.UPDATE_GOOD,
      Body: {
        Id: Id,
        CountQty: Count,
      },
    };

    const response = await Api.post<{}>(request);
    return response;
  };

  static removeGood = async (Id: number): Promise<Api.HttpResponse<{}>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.DELETE_GOOD,
      Body: {
        Id: Id,
      },
    };

    const response = await Api.post<{}>(request);
    return response;
  };
}
