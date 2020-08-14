/* eslint-disable @typescript-eslint/no-empty-interface */
export interface HttpResponse<T> extends Response {
  data?: T;
  message?: string;
  success?: boolean;
}
export interface BaseModel {}
export interface LoginModel extends BaseModel {
  login: string;
  password: string;
}

export interface UserModel extends BaseModel {
  UserId: number;
  UserDivisionId: number;
  UserFirstName: string;
  UserSecondName: string;
  UserMiddleName: string;
  UserFullName: string;
  UserGuid: string;
}

export interface TaskQueryModel {
  PlanNum?: string;
  UserId?: number;
  DivisionId?: number;
  TaskId?: number;
}

export interface GoodModel extends BaseModel {
  GoodId: number;
  Count: number;
  GoodName: string;
  GoodArticle: string;
  GoodBarCode: string;
  Favorite: boolean;
}
