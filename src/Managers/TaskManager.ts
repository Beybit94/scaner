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
    const response = await post<TaskModel>(Endpoints.ACTIVE_TASK, {
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

  static getGoodByBox = async (
    BoxId: number,
    TaskId?: number
  ): Promise<HttpResponse<[GoodModel]>> => {
    const response = await post<[GoodModel]>(Endpoints.GOOD_BY_BOX, {
      BoxId: BoxId,
      TaskId: TaskId,
    });

    return response;
  };

  static addGood = async (
    BarCode: string,
    PlanNum?: string,
    TaskId?: number,
    BoxId?: number
  ): Promise<HttpResponse<BaseModel>> => {
    const response = await post<BaseModel>(Endpoints.CREATE_GOOD, {
      PlanNum: PlanNum,
      TaskId: TaskId,
      BarCode: BarCode,
      BoxId: BoxId,
    });

    return response;
  };

  static editGood = async (
    Id: number,
    Count: string
  ): Promise<HttpResponse<BaseModel>> => {
    const response = await post<BaseModel>(Endpoints.UPDATE_GOOD, {
      Id: Id,
      CountQty: Count,
    });

    return response;
  };

  static removeGood = async (Id: number): Promise<HttpResponse<BaseModel>> => {
    const response = await post<BaseModel>(Endpoints.DELETE_GOOD, {
      Id: Id,
    });

    return response;
  };

  static endTask = async (
    TaskId: number
  ): Promise<HttpResponse<[GoodModel]>> => {
    const response = await post<[GoodModel]>(Endpoints.END_TASK, {
      TaskId: TaskId,
    });

    return response;
  };

  static pdf = async (
    TaskId: number,
    PlanNum: string
  ): Promise<HttpResponse<BaseModel>> => {
    const response = await get<BaseModel>(
      `${Endpoints.PDF}?PlanNum=${PlanNum}&TaskId=${TaskId}`
    );

    return response;
  };
}
