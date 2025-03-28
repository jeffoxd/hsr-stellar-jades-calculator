import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: "currentOnly",
    supportedLngs: ["en", "zh-Hans", "zh-Hant"],
    debug: true,
    fallbackLng: "en",
    detection: { order: ["localStorage", "navigator"] },
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
          versions: { en: "v0.9", "zh-Hans": "v0.9", "zh-Hant": "v0.9" },
        },
        {
          loadPath: "/locales/{{lng}}/translation.json",
        },
      ],
    },
  });

export default i18n;
