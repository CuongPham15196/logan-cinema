import Axios, { AxiosError } from "axios";
import { CookieService, LanguagesService } from ".";
import { getEnv } from "../app/config";
import { ECookieVariable, IAlertPayload } from "../types";
import { ObjectUtils } from "../utils";

Axios.interceptors.request.use((x: any) => {
  x.meta = x.meta || {};
  x.meta.requestStartedAt = new Date().getTime();
  return x;
});

Axios.interceptors.response.use(
  (x: any) => {
    x.config.meta.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
    return x;
  },
  // Handle 4xx & 5xx responses
  (x) => {
    x.config.meta.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
    if (x.response.status === 400 && x.response.data.message === "MUST_BE_USER") {
      CookieService.remove(ECookieVariable.USER_ACCESS_TOKEN);
      window.location.reload();
    }
    throw x;
  }
);

export class AxiostMainError extends Error {
  status: number;
  message: string;
  errors: any;
  error: any;
  alert: IAlertPayload;
  constructor(error: AxiosError) {
    super(error as any);
    this.message =
      ObjectUtils.getIn(error, "response.data.message", (message: string) =>
        LanguagesService.translate(message)
      ) || LanguagesService.translate("unknown-error-from-the-system");
    this.errors = ObjectUtils.getIn(error, "response.data.errors");
    this.status = ObjectUtils.getIn(error, "response.status", 3001);

    // Handle axios error
    if (error.code === "ECONNABORTED" || error.message === "Network Error" || this.status === 3001)
      this.message = LanguagesService.translate("network-error");
    else if (error.response && typeof error.response.data === "string")
      this.message = error.response.data;
    else if (this.status === 900) this.message = LanguagesService.translate("SERVER_MAINTENANCE");
    this.error = {
      message: this.message,
      errors: this.errors,
      status: this.status,
    };
    this.alert = {
      message: this.message,
      type: "danger",
    };
  }
}

export class AxiosMainService {
  static getURL(subURL: string) {
    return `${getEnv("URL_API_MAIN_CLIENT_SIDE")}${subURL}`;
  }

  static getConfigs(params = {}) {
    return {
      params: Object.assign(ObjectUtils.cleanObj(params), {}),
      timeout: 20000,
      headers: ObjectUtils.cleanObj({
        locale: LanguagesService.getLocale(),
        Authorization: `Bearer ${CookieService.get(ECookieVariable.USER_ACCESS_TOKEN)}` || "",
      }),
    };
  }

  static async getTime(subURL: string) {
    return Axios.get(this.getURL(subURL))
      .then((res) => ({
        ...res.data,
        _responseTime: ObjectUtils.getIn(res, "config.meta.responseTime"),
      }))
      .catch((err) => {
        throw new AxiostMainError(err);
      });
  }

  static async get(subURL: string, params = {}, isGetResponseTime = false) {
    return Axios.get(this.getURL(subURL), this.getConfigs(params))
      .then((res) => {
        if (isGetResponseTime)
          return {
            ...res.data,
            _responseTime: ObjectUtils.getIn(res, "config.meta.responseTime"),
          };

        return res.data;
      })
      .catch((err) => {
        throw new AxiostMainError(err);
      });
  }

  static async post(subURL: string, payload = {}) {
    return Axios.post(this.getURL(subURL), payload, this.getConfigs())
      .then((res) => res.data)
      .catch((err) => {
        throw new AxiostMainError(err);
      });
  }

  static async put(subURL: string, payload = {}) {
    return Axios.put(this.getURL(subURL), payload, this.getConfigs())
      .then((res) => res.data)
      .catch((err) => {
        throw new AxiostMainError(err);
      });
  }

  static async delete(subURL: string) {
    return Axios.delete(this.getURL(subURL), this.getConfigs())
      .then((res) => res.data)
      .catch((err) => {
        throw new AxiostMainError(err);
      });
  }
}
