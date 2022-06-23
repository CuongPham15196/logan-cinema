import { CookieService } from ".";
import { ECookieVariable, ELocale, TLocale } from "../types";
import dictionary from "../lang/dictionary.json";

export class LanguagesService {
  static locales: TLocale[] = [
    {
      id: 1,
      key: ELocale.ENGLISH,
      locale: ELocale.ENGLISH,
      label: "EN",
      isActive: true,
      order: 1,
    },
    {
      id: 2,
      key: ELocale.VIETNAM,
      locale: ELocale.ENGLISH,
      label: "VI",
      isActive: true,
      order: 2,
    },
  ].sort((a, b) => a.order - b.order);

  static defaultLocale = this.locales[0];

  static setLocale = (locale: ELocale): void => {
    CookieService.set(ECookieVariable.USER_LOCALE, locale);
    window.location.reload();
  };

  static getLocale = (): TLocale => {
    let locale: TLocale;

    const fromCookie = CookieService.get(ECookieVariable.USER_LOCALE);
    const currentLocale = this.locales.find((item) => item.key === fromCookie);
    if (!currentLocale) {
      locale = this.defaultLocale;
      CookieService.set(ECookieVariable.USER_LOCALE, locale.key);
    } else {
      locale = currentLocale;
    }

    return locale;
  };

  static getLocaleKey = (): string => this.getLocale().locale;
  static getLocaleCode = (): string => this.getLocale().key;

  static translate = (id: string, values?: any): string => {
    const locale: string = this.getLocaleCode();
    let sentence: string;

    // @ts-ignore
    if (dictionary[id] && dictionary[id][locale]) {
      // @ts-ignore
      sentence = dictionary[id][locale];
    } else {
      console.warn(`Don't have any messages match with id: "${id}"`);
      return `<${id}>`;
    }

    // Match values
    if (typeof values === "object") {
      Object.entries(values).map((item: any) => {
        // @ts-ignore
        sentence = sentence.replace(new RegExp(`{${item[0]}}`, "g"), item[1]);
        return item;
      });
    }

    return sentence;
  };
}
