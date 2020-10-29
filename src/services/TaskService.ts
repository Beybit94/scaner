/* eslint-disable @typescript-eslint/ban-types */
import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";
import * as Storage from "./Utils/LocalStorage";

export default class TaskService {
  static scan = async (barcode?: string): Promise<Responses.TaskModel> => {
    const user = await Storage.LocalStorage.getItem<Responses.UserModel>(
      Storage.StorageKeys.USER
    );

    if (barcode) {
      const createTask = await TaskService.createTask(barcode, user?.UserId);
      if (!createTask.success) {
        throw new Error(createTask.error);
      }
    }

    const getActiveTask = await TaskService.getActiveTask(
      user?.UserId,
      user?.UserDivisionId
    );

    if (!getActiveTask.success) {
      throw new Error(getActiveTask.error);
    }

    if (!getActiveTask.data?.PlanNum) {
      throw new Error();
    }

    const task = getActiveTask.data;
    await Storage.LocalStorage.setItem(Storage.StorageKeys.ACTIVE_TASK, task);

    return task;
  };

  static createTask = async (
    PlanNum: string,
    UserId?: number
  ): Promise<Api.HttpResponse<{}>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.CREATE_TASK,
      Body: {
        PlanNum: PlanNum,
        UserId: UserId,
      },
    };

    const response = await Api.post<{}>(request);
    return response;
  };

  static getActiveTask = async (
    UserId?: number,
    DivisionId?: number
  ): Promise<Api.HttpResponse<Responses.TaskModel>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.ACTIVE_TASK,
      Body: {
        UserId: UserId,
        DivisionId: DivisionId,
      },
    };

    const response = await Api.post<Responses.TaskModel>(request);
    return response;
  };

  static endTask = async (
    TaskId: number,
    PlanNum: string
  ): Promise<Api.HttpResponse<{}>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.END_TASK,
      Body: {
        TaskId: TaskId,
        PlanNum: PlanNum,
      },
    };

    const response = await Api.post<{}>(request);
    return response;
  };

  static difference = async (
    TaskId: number,
    PlanNum: string
  ): Promise<Api.HttpResponse<[Responses.DifferenceModel]>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.DIFFERENCE,
      Body: {
        TaskId: TaskId,
        PlanNum: PlanNum,
      },
    };

    const response = await Api.post<[Responses.DifferenceModel]>(request);
    return response;
  };

  static pdf = async (
    TaskId: number,
    PlanNum: string
  ): Promise<Api.HttpResponse<{}>> => {
    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.PDF,
      Params: {
        TaskId: TaskId,
        PlanNum: PlanNum,
      },
    };

    const response = await Api.get<{}>(request);
    return response;
  };

  static upload = async (
    files: FormDataValue[]
  ): Promise<Api.HttpResponse<{}>> => {
    const form = new FormData();
    files.forEach((file, index) => {
      form.append(`photo_${index}`, file);
    });

    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.UPLOAD_PHOTO,
      FormData: form,
    };

    const response = await Api.upload<{}>(request);
    return response;
  };
}
