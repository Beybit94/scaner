/* eslint-disable @typescript-eslint/ban-types */
import { HttpResponse } from "../components";

import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";
import * as Storage from "./Utils/LocalStorage";

export enum GoodAction {
  add = 1,
  edit,
  remove,
}
export default class GoodService {
  static crud = async (
    action: GoodAction,
    good: Responses.GoodModel,
    boxId?: number
  ): Promise<[Responses.GoodModel] | null | undefined> => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    let response: Api.HttpResponse<{}> | undefined;
    switch (action) {
      case GoodAction.add:
        response = await GoodService.addGood(
          good?.BarCode,
          task?.PlanNum,
          task?.ID
        );
        break;
      case GoodAction.edit:
        response = await GoodService.editGood(good.ID, good.CountQty);
        break;
      case GoodAction.remove:
        response = await GoodService.removeGood(good.ID);
        break;
      default:
        response = undefined;
        break;
    }

    if (response && !response.success) {
      throw new Error(response.error);
    }

    let result: Api.HttpResponse<[Responses.GoodModel]>;
    if (boxId) {
      result = await GoodService.getGoodByBox(boxId, task?.ID);
    } else {
      result = await GoodService.getGoodByTask(task?.ID);
    }

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  };

  static getGoodByTask = async (
    TaskId?: number
  ): Promise<Api.HttpResponse<[Responses.GoodModel]>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.GOOD_BY_TASK,
      Body: {
        TaskId: TaskId,
      },
    };

    const response = await Api.post<[Responses.GoodModel]>(request);
    return response;
  };

  static getGoodByBox = async (
    BoxId: number,
    TaskId?: number
  ): Promise<Api.HttpResponse<[Responses.GoodModel]>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.GOOD_BY_BOX,
      Body: {
        BoxId: BoxId,
        TaskId: TaskId,
      },
    };

    const response = await Api.post<[Responses.GoodModel]>(request);
    return response;
  };

  static addGood = async (
    BarCode: string,
    PlanNum?: string,
    TaskId?: number,
    BoxId?: number
  ): Promise<Api.HttpResponse<{}>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.CREATE_GOOD,
      Body: {
        PlanNum: PlanNum,
        TaskId: TaskId,
        BarCode: BarCode,
        BoxId: BoxId,
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
