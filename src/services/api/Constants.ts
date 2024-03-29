export enum Endpoints {
  BASE = "http://213.5.191.200:3365",
  //BASE = "http://213.5.191.200 :3366",
  //BASE = "http://10.20.254.8:44341",
  //BASE = "http://192.168.8.104:44341",
  TEST = "/api/User/TEST",
  LOGIN = "/api/User/FindUser",
  CREATE_TASK = "/api/Task/CreateTask",
  ACTIVE_TASK = "/api/Task/GetActiveTask",
  DIFFERENCE = "/api/Task/Differences",
  END_TASK = "/api/Task/EndTask",
  CLOSE_TASK = "/api/Task/CloseTask",
  GOOD_BY_CODE = "/api/Good/GetGoodByCode",
  GOOD_BY_TASK = "/api/Good/GetGoodsByTask",
  GOOD_BY_BOX = "/api/Good/GetGoodsByBox",
  GOOD_BY_FILTER = "/api/Good/GetGoodsByFilter",
  CREATE_GOOD = "/api/Good/Create",
  UPDATE_GOOD = "/api/Good/Update",
  DELETE_GOOD = "/api/Good/Delete",
  PDF = "/Web/Pdf/Index",
  UPLOAD_PHOTO = "/api/Task/UploadPhoto",
  DAMAGEPERCENT = "/api/Dictionary/GetDamagePercent",
  DEFECT = "/api/Good/Defect",
}

export enum OnRequestError {
  LOGIN = "Аторизация",
  CREATE_TASK = "Создание задачи",
  ACTIVE_TASK = "Получение активной задачи",
  END_TASK = "Завершение задачи",
  GOOD_BY_CODE = "Получение товара по коду",
  GOOD_BY_TASK = "Получение товара по задаче",
  GOOD_BY_BOX = "Получение товара по коробу",
  CREATE_GOOD = "Добавление товара",
  UPDATE_GOOD = "Редактирование товара",
  DELETE_GOOD = "Удаление товара",
  PDF = "АКТ ПРИЕМА ТОВАРА",
  UPLOAD_PHOTO = "/api/Task/UploadPhoto",
}

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  UPLOAD = "UPLOAD",
}

export enum TaskStatus {
  Start = 1,
  InProcess = 2,
  End = 3,
}