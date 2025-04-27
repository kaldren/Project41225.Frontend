import moment, { Moment } from "moment-timezone";

// set missing locales
moment.defineLocale("en-gb", {
  parentLocale: "en",
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd D MMMM YYYY HH:mm",
  },
});

export const localeLanguage = window.navigator.language.toLowerCase();

// set moment to browser language
moment.locale(localeLanguage);

// set moemnt formats
const localeData = moment.localeData();
export const localeDateFormat = localeData.longDateFormat("L"); // dd/MM/yyyy based on browser language
export const localeDateTimeFormat = localeData.longDateFormat("LTS"); // HH:mm:ss based on browser language
export const localeTimezone = moment.tz.guess();

// Helpers

export function convertMomentToLocalDateTime(date: Moment | undefined) {
  if (!date || !date.isValid()) return "";
  return date?.format(`${localeDateFormat} ${localeDateTimeFormat}`) || "";
}

export function convertMomentToLocalDate(date: Moment | undefined) {
  if (!date || !date.isValid()) return "";
  return date?.format(localeDateFormat) || "";
}

export function convertIsoToLocalDate(date: string | Date | undefined) {
  if (!date) return "";
  return moment(date).format(localeDateFormat);
}

export function convertIsoToLocalDateTime(date: string | Date | undefined) {
  if (!date) return "";
  return moment(date).format(`${localeDateFormat} ${localeDateTimeFormat}`) || "";
}

export function convertDateToUtcIsoString(date?: Date) {
  if (!date) return "";
  return new Date(date.toUTCString()).toISOString();
}

export function convertIsoToUtcString(date?: string | Date): string {
  if (!date) return "";
  try {
    return date instanceof Date ? date.toUTCString() : new Date(date).toUTCString();
  } catch {
    return "";
  }
}

export const getHumanizedMonth = (date?: Date) => {
  return date ? date.getMonth() + 1 : new Date().getMonth() + 1;
};

export { moment };
