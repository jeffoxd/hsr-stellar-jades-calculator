import { Locale, enUS, zhCN, zhTW } from "date-fns/locale";

export const getDateFnLocales = (localeString: string): Locale => {
  switch (localeString) {
    case "en":
      return enUS;
    case "zh-Hans":
      return zhCN;
    case "zh-Hant":
      return zhTW;
    default:
      return enUS;
  }
};
