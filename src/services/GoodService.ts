/* eslint-disable @typescript-eslint/ban-types */
import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";

export default class GoodService {
  static getGoodByCode = async (
    BarCode: string,
    TaskId?: number
  ): Promise<Api.HttpResponse<Responses.GoodModel>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.GOOD_BY_CODE,
      Body: {
        BarCode: BarCode,
        TaskId: TaskId,
      },
    };

    const response = await Api.post<Responses.GoodModel>(request);
    return response;
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
    Count: string
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
