const Config = {
  ENV: process.env.REACT_APP_ENV || "local",

  // General information
  PUBLIC_URL: process.env.REACT_APP_PUBLIC_URL || "http://localhost:3000",

  // RESTful APIs
  URL_API_MAIN_CLIENT_SIDE:
    process.env.REACT_APP_URL_API_MAIN_CLIENT_SIDE || "https://movie0706.cybersoft.edu.vn/api",
  URL_API_MAIN_STORAGE_SIDE: process.env.REACT_APP_URL_API_MAIN_STORAGE_SIDE || "",
  GOOGLE_RECAPTCHA_KEY: process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY || "",
};

export const getEnv = (
  key:
    | "ENV"

    // General information
    | "PUBLIC_URL"

    // RESTful APIs
    | "URL_API_MAIN_CLIENT_SIDE"
    | "URL_API_MAIN_STORAGE_SIDE"
    | "GOOGLE_RECAPTCHA_KEY"
): string => {
  return Config[key];
};

export const isDev = getEnv("ENV") !== "production";
