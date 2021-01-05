/* eslint-disable @typescript-eslint/ban-types */
import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";
import * as Storage from "./Utils/LocalStorage";

export default class TaskService {
  static scan = async (
    barcode?: string
  ): Promise<Api.HttpResponse<{}> | undefined> => {
    let response;
    if (barcode) {
      response = await TaskService.createTask(barcode);
    }
    return response;
  };

  static createTask = async (
    PlanNum: string
  ): Promise<Api.HttpResponse<{}> | undefined> => {
    const user = await Storage.LocalStorage.getItem<Responses.UserModel>(
      Storage.StorageKeys.USER
    );

    let response;
    if (user) {
      const request: Api.HttpRequest = {
        Url: Constants.Endpoints.CREATE_TASK,
        Body: {
          PlanNum: PlanNum,
          UserId: user.Id,
        },
      };

      response = await Api.post<{}>(request);
    }

    return response;
  };

  static getActiveTask = async (): Promise<Responses.TaskModel | undefined> => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    if (task) {
      return task;
    } else {
      const user = await Storage.LocalStorage.getItem<Responses.UserModel>(
        Storage.StorageKeys.USER
      );

      if (user) {
        const request: Api.HttpRequest = {
          Url: Constants.Endpoints.ACTIVE_TASK,
          Body: {
            UserId: user.Id,
            DivisionId: user.UserDivisionId,
          },
        };

        const response = await Api.post<Responses.TaskModel>(request);
        if (response.data) {
          await Storage.LocalStorage.setItem(
            Storage.StorageKeys.ACTIVE_TASK,
            response.data
          );

          return response.data;
        }
      }

      return;
    }
  };

  static endTask = async (
    files: FormDataValue[]
  ): Promise<Api.HttpResponse<{}> | undefined> => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    if (task) {
      const upload = await TaskService.upload(files, task.Id);
      if (upload.success) {
        const request: Api.HttpRequest = {
          Url: Constants.Endpoints.END_TASK,
          Body: {
            TaskId: task.Id,
          },
        };

        const response = await Api.post<{}>(request);
        if (response.success) {
          await Storage.LocalStorage.deleteItem(
            Storage.StorageKeys.ACTIVE_TASK
          );

          return response;
        }
      }

      return;
    }

    return;
  };

  static closeTask = async (): Promise<Api.HttpResponse<{}> | undefined> => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    if (task) {
      const request: Api.HttpRequest = {
        Url: Constants.Endpoints.CLOSE_TASK,
        Body: {
          TaskId: task.Id,
        },
      };

      const response = await Api.post<{}>(request);
      if (response.success) {
        await Storage.LocalStorage.deleteItem(Storage.StorageKeys.ACTIVE_TASK);
      }

      return response;
    }

    return;
  };

  static difference = async (): Promise<
    [Responses.ReceiptModel] | null | undefined
  > => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    let response: Api.HttpResponse<[Responses.ReceiptModel]> | undefined;
    if (task) {
      const request: Api.HttpRequest = {
        Url: Constants.Endpoints.DIFFERENCE,
        Body: {
          TaskId: task.Id,
          PlanNum: task.PlanNum,
        },
      };

      response = await Api.post<[Responses.ReceiptModel]>(request);
      console.log(response);
    }

    return response?.data;
  };

  static pdf = async (): Promise<string> => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    let uri = "";
    if (task) {
      uri = `${Constants.Endpoints.BASE}${Constants.Endpoints.PDF}?PlanNum=${task?.PlanNum}&TaskId=${task?.Id}`;
    }
    return uri;
  };

  static upload = async (
    files: FormDataValue[],
    TaskId?: number
  ): Promise<Api.HttpResponse<{}>> => {
    const form = new FormData();
    form.append("TaskId", TaskId);

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
