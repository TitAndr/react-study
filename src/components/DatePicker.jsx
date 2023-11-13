/* eslint-disable react/prop-types */
import { useState } from "react";
import Datepicker from "tailwind-datepicker-react";

const DatePicker = ({ date, setDate }) => {
  const options = {
    autoHide: true,
    todayBtn: true,
    clearBtn: false,
    maxDate: new Date(new Date().setHours(23, 59, 59, 999)),
    minDate: new Date("1950-01-01"),
    datepickerClassNames: "top-12",
    defaultDate: date || new Date(),
    language: "en",
    disabledDates: [],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  };

  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const handleClose = (state) => {
    setShow(state);
  };

  return (
    <Datepicker
      classNames="w-[170px] text-[.8rem] picker"
      options={options}
      onChange={(d) => {
        setSelectedDate(d);
        setDate(d);
      }}
      show={show}
      value={selectedDate}
      setShow={handleClose}
    />
  );
};

export default DatePicker;
