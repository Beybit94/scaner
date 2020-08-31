import { string } from "react-native-redash";

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface HttpResponse<T> extends Response {
  data?: T;
  error?: string;
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

export interface TaskModel extends BaseModel {
  Id: number;
  DivisionId: number;
  UserId: number;
  PlanNum: string;
  BoxNum: string;
  TaskTypeId: number;
}

export interface GoodModel extends BaseModel {
  ID: number;
  StrID: string;
  GoodId: number;
  Count: number;
  GoodName: string;
  GoodArticle: string;
  GoodBarCode: string;
  IsBox: boolean;
}

export interface DifferenceModel extends BaseModel {
  ID: number;
  NumberDoc: string;
  GoodId: number;
  GoodArticle: string;
  GoodName: string;
  Quantity: number;
  CountQty: number;
  ExcessQty: number;
  TaskId: number;
  GoodGroupName: string;
  Favorite: string;
  Img: string;
  Text1: string;
  UserName: string;
  CreationDate: string;
  Status: number;
}
