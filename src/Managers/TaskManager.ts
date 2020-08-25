import {
  post,
  Endpoints,
  HttpResponse,
  TaskModel,
  BaseModel,
  GoodModel,
} from "../components";

export class TaskManager {
  static createTask = async (
    PlanNum: string,
    UserId?: number
  ): Promise<HttpResponse<BaseModel>> => {
    const response = await post<BaseModel>(Endpoints.CREATE_TASK, {
      PlanNum: PlanNum,
      UserId: UserId,
    });

    return response;
  };

  static getActiveTask = async (
    UserId?: number,
    DivisionId?: number
  ): Promise<HttpResponse<TaskModel>> => {
    const response = await post<TaskModel>(Endpoints.TASK_ACTIVE, {
      UserId: UserId,
      DivisionId: DivisionId,
    });

    return response;
  };

  static getGoodByCode = async (
    BarCode: string,
    TaskId?: number
  ): Promise<HttpResponse<GoodModel>> => {
    const response = await post<GoodModel>(Endpoints.GOOD_BY_CODE, {
      BarCode: BarCode,
      TaskId: TaskId,
    });

    return response;
  };

  static getGoodByTask = async (
    TaskId?: number
  ): Promise<HttpResponse<[GoodModel]>> => {
    const response = await post<[GoodModel]>(Endpoints.GOOD_BY_TASK, {
      TaskId: TaskId,
    });

    return response;
  };

  static addGood = async (
    BarCode: string,
    PlanNum?: string,
    TaskId?: number
  ): Promise<HttpResponse<BaseModel>> => {
    const response = await post<BaseModel>(Endpoints.CREATE_GOOD, {
      PlanNum: PlanNum,
      TaskId: TaskId,
      BarCode: BarCode,
    });

    return response;
  };
}
