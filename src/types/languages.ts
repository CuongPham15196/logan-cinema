export enum ELocale {
  ENGLISH = "en-US",
  VIETNAM = "vi-VN",
}

export type TLocale = {
  id: number;
  key: ELocale;
  locale: ELocale;
  label: string;
  isActive: boolean;
  order: number;
};
