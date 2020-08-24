/* eslint-disable no-undef */

import { HttpResponse } from ".";

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Endpoints {
  BASE = "http://192.168.0.169:44341",
  //BASE = "http://10.20.254.8:44341",
  TEST = "/api/User/TEST",
  LOGIN = "/api/User/FindUser",
  CREATE_TASK = "/api/Task/CreateTask",
  TASK_ACTIVE = "/api/Task/GetActiveTask",
  GOOD_BY_CODE = "api/Good/GetGoodByCode",
  GOOD_BY_TASK = "api/Good/GetGoodsByTask",
  CREATE_GOOD = "/api/Good/Create",
  UPDATE_GOOD = "/api/Good/Update",
  DELETE_GOOD = "/api/Good/Delete",
}

export enum OnRequestError {
  LOGIN = "/api/User/FindUser",
  CREATE_TASK = "/api/Task/CreateTask",
  TASK_ACTIVE = "/api/Task/GetActiveTask",
  GOOD_BY_CODE = "api/Good/GetGoodByCode",
  GOOD_BY_TASK = "api/Good/GetGoodsByTask",
  CREATE_GOOD = "/api/Good/Create",
  UPDATE_GOOD = "/api/Good/Update",
  DELETE_GOOD = "/api/Good/Delete",
}

enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
}

async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);
  try {
    await response.json().then((r) => {
      response.data = r.data;
      response.error = r.error;
      response.success = r.success;
    });
  } catch (ex) {
    throw new Error(ex);
  }
  return response;
}

const headers = new Headers();
headers.set("Access-Control-Allow-Origin", "*");
headers.set("Accept", "application/json");
headers.set("Content-Type", "application/json");

export async function get<T>(
  path: Endpoints,
  args: RequestInit = { method: HTTP_METHODS.GET, headers }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(`${Endpoints.BASE}${path}`, args));
}

export async function post<T>(
  path: Endpoints,
  body: any,
  args: RequestInit = {
    method: HTTP_METHODS.POST,
    headers,
    body: JSON.stringify(body),
  }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(`${Endpoints.BASE}${path}`, args));
}
