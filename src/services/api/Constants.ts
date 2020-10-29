export enum Endpoints {
  BASE = "http://89.20.48.50:3365",
  //BASE = "http://10.20.254.93:44341",
  //BASE = "http://192.168.0.169:44341",
  TEST = "/api/User/TEST",
  LOGIN = "/api/User/FindUser",
  CREATE_TASK = "/api/Task/CreateTask",
  ACTIVE_TASK = "/api/Task/GetActiveTask",
  DIFFERENCE = "/api/Task/Differences",
  END_TASK = "/api/Task/EndTask",
  GOOD_BY_CODE = "/api/Good/GetGoodByCode",
  GOOD_BY_TASK = "/api/Good/GetGoodsByTask",
  GOOD_BY_BOX = "/api/Good/GetGoodsByBox",
  CREATE_GOOD = "/api/Good/Create",
  UPDATE_GOOD = "/api/Good/Update",
  DELETE_GOOD = "/api/Good/Delete",
  PDF = "/Web/Pdf/Index",
  UPLOAD_PHOTO = "/api/Task/UploadPhoto",
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