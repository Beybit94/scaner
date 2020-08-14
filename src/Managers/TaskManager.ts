import {
  post,
  Endpoints,
  HttpResponse,
  TaskQueryModel,
  GoodModel,
  BaseModel,
} from "../components";

export class TaskManager {
  static createTask = async (
    model: TaskQueryModel
  ): Promise<HttpResponse<BaseModel>> => {
    const response = await post<BaseModel>(Endpoints.CREATE_TASK, {
      PlanNum: model.PlanNum,
      UserId: model.UserId,
      DivisionId: model.DivisionId,
      TaskId: model.TaskId,
    });

    return response;
  };

  static getActiveTask = async (
    PlanNum?: string,
    UserId?: number,
    DivisionId?: number,
    TaskId?: number
  ): Promise<HttpResponse<[GoodModel]>> => {
    const response = await post<[GoodModel]>(Endpoints.GET_ACTIVE_TASKS, {
      PlanNum: PlanNum,
      UserId: UserId,
      DivisionId: DivisionId,
      TaskId: TaskId,
    });

    return response;
  };
}
