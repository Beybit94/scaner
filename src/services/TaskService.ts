/* eslint-disable @typescript-eslint/ban-types */
import * as Constants from "./api/Constants";
import { Api } from "./api/Http";
import { Responses } from "./api/Responses";
import * as Storage from "./Utils/LocalStorage";

export default class TaskService {
  static scan = async (barcode?: string) => {
    const user = await Storage.LocalStorage.getItem<Responses.UserModel>(
      Storage.StorageKeys.USER
    );

    if (barcode) {
      await TaskService.createTask(barcode, user?.UserId);
    }
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
      const request: Api.HttpRequest = {
        Url: Constants.Endpoints.ACTIVE_TASK,
        Body: {
          UserId: user?.UserId,
          DivisionId: user?.UserDivisionId,
        },
      };

      const response = await Api.post<Responses.TaskModel>(request);
      return response.data;
    }
  };

  static endTask = async (files: FormDataValue[]) => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    await TaskService.upload(files, task?.ID).then(async (upload) => {
      if (upload.success) {
        const request: Api.HttpRequest = {
          Url: Constants.Endpoints.END_TASK,
          Body: {
            TaskId: task?.ID,
            PlanNum: task?.PlanNum,
          },
        };

        await Api.post<{}>(request).then(async (response) => {
          if (response.success) {
            await Storage.LocalStorage.deleteItem(
              Storage.StorageKeys.ACTIVE_TASK
            );
          }
        });
      }
    });
  };

  static closeTask = async () => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    const request: Api.HttpRequest = {
      Url: Constants.Endpoints.CLOSE_TASK,
      Body: {
        TaskId: task?.ID,
      },
    };

    await Api.post<{}>(request).then(async (response) => {
      if (response.success) {
        await Storage.LocalStorage.deleteItem(Storage.StorageKeys.ACTIVE_TASK);
      }
    });
  };

  static difference = async (): Promise<
    [Responses.DifferenceModel] | null | undefined
  > => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    let response: Api.HttpResponse<[Responses.DifferenceModel]> | undefined;
    if (task) {
      const request: Api.HttpRequest = {
        Url: Constants.Endpoints.DIFFERENCE,
        Body: {
          TaskId: task.ID,
          PlanNum: task.PlanNum,
        },
      };

      response = await Api.post<[Responses.DifferenceModel]>(request);
    }

    return response?.data;
  };

  static pdf = async (): Promise<string> => {
    const task = await Storage.LocalStorage.getItem<Responses.TaskModel>(
      Storage.StorageKeys.ACTIVE_TASK
    );

    let uri = "";
    if (task) {
      uri = `${Constants.Endpoints.BASE}${Constants.Endpoints.PDF}?PlanNum=${task?.PlanNum}&TaskId=${task?.ID}`;
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
