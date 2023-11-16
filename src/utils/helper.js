/* eslint-disable react-hooks/rules-of-hooks */
import { useTranslation } from "react-i18next";

export default {
  getImgUrl(src) {
    return new URL(`../assets/${src}`, import.meta.url);
  },
  getCardNumber(cardNumber) {
    const masked = cardNumber
      .split("")
      .map((v, i) => (i > 3 && i < 12 ? "#" : v))
      .join("");
    return [
      masked.slice(0, 4),
      masked.slice(4, 8),
      masked.slice(8, 12),
      masked.slice(12),
    ];
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  onFilePicked(event, callback) {
    const files = event.target.files;
    const cb = typeof callback === "function" ? callback : null;

    if (files[0] !== undefined && files[0].name.lastIndexOf(".") > 0) {
      let error = null;
      const extension = files[0].name.split(".").pop().toLowerCase();

      if (!["jpg", "gif", "jpeg", "png", "bmp"].includes(extension)) {
        error = "main.ImageTypeError";
      }

      if (files[0].size > 1048576) {
        error = "main.ImageSizeError";
      }

      if (error) {
        cb ? cb(null, error) : null;
        return;
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        // eslint-disable-next-line no-unused-expressions
        cb ? cb(fileReader.result) : null;
      });

      fileReader.readAsDataURL(files[0]);
    }
  },
  save(type, service, { newEntity, oldEntity }) {
    if (type === "save") {
      service(oldEntity ? "update" : "insert", newEntity);
    }
    if (type === "remove") {
      service("delete", oldEntity);
    }
    if (type === "cancel" && oldEntity) {
      newEntity = oldEntity;
    }
  },
  sortBy(array, key, cb) {
    return cb
      ? array.sort((a) => (cb(a) ? 1 : -1))
      : array.sort((a, b) => Number(b[key]) - Number(a[key]));
  },
  timeSince(date) {
    const { t } = useTranslation();

    if (!date) {
      return;
    }

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    date = new Date(date);

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const interval = intervals.find(
      (i) => i.seconds < seconds || i.seconds === 1
    );
    const count = Math.floor((seconds || 1) / interval.seconds);
    return `${count} ${t("main." + interval.label)} ${t("main.ago")}`;
  },
  getSummByType(array, type) {
    return array
      .filter((t) => t.type === type)
      .reduce((acc, v) => {
        return acc + v.amount;
      }, 0);
  },
  getDataByDateRange(array, field, time) {
    let range = {
      // default is today
      start: new Date(new Date().setHours(0, 0, 0, 0)),
      end: new Date(new Date().setHours(23, 59, 59, 999)),
    };

    if (Object.keys(time).length > 0) {
      range = {
        start: time.from,
        end: time.to,
      };
    } else {
      switch (time) {
        case 30:
          range = {
            start: new Date(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ).setHours(0, 0, 0, 0)
            ),
            end: new Date(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              ).setHours(23, 59, 59, 999)
            ),
          };
          break;

        case 365:
          range = {
            start: new Date(new Date().getFullYear(), 0, 1),
            end: new Date(new Date().getFullYear(), 11, 31),
          };
          break;
      }
    }

    return array.filter(
      (i) =>
        range.start.getTime() <= new Date(i[field]) &&
        new Date(i[field]) < range.end.getTime()
    );
  },
  withoutKeys(obj, keys) {
    let result = {};
    for (const key in obj) {
      if (!keys.includes(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  },
};
