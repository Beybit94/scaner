/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-undef */
import { Alert } from "react-native";

import * as Constants from "./Constants";

declare global {
  interface FormDataValue {
    uri: string;
    name: string;
    type: string;
  }

  interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;
    append(name: string, value: string | any, fileName?: string): void;
    set(name: string, value: FormDataValue, fileName?: string): void;
  }
}

export namespace Api {
  export interface HttpRequest {
    Url: Constants.Endpoints;
    Params?: {};
    Body?: any;
    FormData?: FormData;
  }

  export interface HttpResponse<T> extends Response {
    data?: T;
    error?: string;
    success?: boolean;
  }

  function SetHeaders(method: Constants.HTTP_METHODS) {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Accept", "application/json");

    switch (method) {
      case Constants.HTTP_METHODS.POST:
        headers.set("Content-Type", "application/json");
        return {
          method: "POST",
          headers: headers,
        };
      case Constants.HTTP_METHODS.UPLOAD:
        headers.set("Content-Type", "multipart/form-data");
        return {
          method: "POST",
          headers: headers,
        };
      default:
        headers.set("Content-Type", "application/json");
        return {
          method: "GET",
          headers: headers,
        };
    }
  }

  export function errorHandler(error: Error, isFatal?: boolean) {
    if (isFatal) {
      Alert.alert(error.name, error.message, [
        {
          text: "OK",
        },
      ]);
    } else {
      console.log(error);
    }
  }

  async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
    const response: HttpResponse<T> = await fetch(request);
    try {
      await response.json().then((r) => {
        response.data = r.data;
        response.error = r.error;
        response.success = r.success;
      });

      if (!response.success) {
        throw new Error(response.error);
      }
    } catch (ex) {
      errorHandler(ex, true);
    } finally {
      return response;
    }
  }

  export async function get<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    const url = `${Constants.Endpoints.BASE}${request.Url}`;
    const params = request.Params ? `?${JSON.stringify(request.Params)}` : "";
    const path = `${url}${params}`;

    const args: RequestInit = SetHeaders(Constants.HTTP_METHODS.GET);
    return await http<T>(new Request(path, args));
  }

  export async function post<T>(
    request: HttpRequest
  ): Promise<HttpResponse<T>> {
    const url = `${Constants.Endpoints.BASE}${request.Url}`;
    const params = request.Params ? `?${JSON.stringify(request.Params)}` : "";
    const path = `${url}${params}`;

    const args: RequestInit = SetHeaders(Constants.HTTP_METHODS.POST);
    args.body = JSON.stringify(request.Body);
    return await http<T>(new Request(path, args));
  }

  export async function upload<T>(
    request: HttpRequest
  ): Promise<HttpResponse<T>> {
    const url = `${Constants.Endpoints.BASE}${request.Url}`;
    const params = request.Params ? `?${JSON.stringify(request.Params)}` : "";
    const path = `${url}${params}`;

    const args: RequestInit = SetHeaders(Constants.HTTP_METHODS.UPLOAD);
    args.body = request.FormData;
    return await http<T>(new Request(path, args));
  }
}
