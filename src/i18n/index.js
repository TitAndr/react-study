import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locale/en-US";
import esMX from "./locale/es-MX";
import frFR from "./locale/fr-FR";
import ukUA from "./locale/uk-UA";
import zhCN from "./locale/zh-CN";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: enUS,
      es: esMX,
      fr: frFR,
      uk: ukUA,
      zh: zhCN,
    },
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
