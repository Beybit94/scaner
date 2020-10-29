/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
export namespace Responses {
  export interface BaseResponse {}

  export interface UserModel extends BaseResponse {
    UserId: number;
    UserDivisionId: number;
    UserFirstName: string;
    UserSecondName: string;
    UserMiddleName: string;
    UserFullName: string;
    UserGuid: string;
  }

  export interface TaskModel extends BaseResponse {
    ID: number;
    StrID: string;
    DivisionId: number;
    UserId: number;
    PlanNum: string;
    BoxNum: string;
    TaskTypeId: number;
  }

  export interface GoodModel extends BaseResponse {
    ID: number;
    StrID: string;
    GoodId: number;
    Count: number;
    GoodName: string;
    GoodArticle: string;
    BarCode: string;
    IsBox: boolean;
    IsDefect: boolean;
  }

  export interface DifferenceModel extends BaseResponse {
    ID: number;
    StrID: string;
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
}
