/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
export namespace Responses {
  export interface BaseResponse {}

  export interface UserModel extends BaseResponse {
    Id: number;
    UserDivisionId: number;
    UserFirstName: string;
    UserSecondName: string;
    UserMiddleName: string;
    UserFullName: string;
    UserGuid: string;
  }

  export interface TaskModel extends BaseResponse {
    Id: number;
    StrID: string;
    DivisionId: number;
    UserId: number;
    PlanNum: string;
    BoxNum: string;
    TaskTypeId: number;
  }

  export interface GoodModel extends BaseResponse {
    Id: number;
    StrID: string;
    GoodId: number;
    BoxId?: number;
    CountQty: number;
    GoodName: string;
    GoodArticle: string;
    BarCode: string;
    IsBox: boolean;
    DamagePercentId?: number;
  }

  export interface ReceiptModel extends BaseResponse {
    Location: string;
    NumberDoc: string;
    Article: string;
    GoodName: string;
    Quantity: number;
    CountQty: number;
    Barcode: string;
    GoodBarcode: string;
  }

  export interface BaseDictionary extends BaseResponse {
    Id: number;
    Code: string;
    Name: string;
  }
}
