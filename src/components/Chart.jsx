/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ historicalData = [], type = "income", days }) => {
  const { t } = useTranslation();
  const { currentWallet } = useContext(GlobalContext);

  const getDataSets = () => {
    const incomeData = historicalData.income || historicalData;
    const outcomeData = historicalData.outcome || historicalData;

    const incomeChart =
      historicalData.income || type === "income"
        ? {
            data: incomeData.map((v) => v.amount),
            label: t("finance.IncomeTitle", { time: days.labe }),
            borderColor: "#35f202",
          }
        : null;

    const outcomeChart =
      historicalData.outcome || type === "outcome"
        ? {
            data: outcomeData.map((v) => v.amount),
            label:  t("finance.OutcomeTitle", { time: days.labe }),
            borderColor: "#f21202",
          }
        : null;

    if (!incomeChart && !outcomeChart) {
      return [
        {
          data: [],
          label: t("finance.NoData"),
        },
      ];
    }

    if (Array.isArray(historicalData)) {
      return [type === "income" ? incomeChart : outcomeChart];
    } else {
      return [incomeChart, outcomeChart];
    }
  };

  const getLabelsData = () => {
    const data = Array.isArray(historicalData)
      ? historicalData
      : historicalData.created_at;

    return [...new Map(data.map((i) => [i.created_at, i])).values()];
  };

  return (
    <Line
      className="max-w-[960px] max-h-[400px] pb-6"
      data={{
        labels: getLabelsData().map((i) => {
          let date = new Date(i.created_at);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12}:${date.getMinutes()} PM`
              : `${date.getHours()}:${
                  date.getMinutes() < 10
                    ? "0" + date.getMinutes()
                    : date.getMinutes()
                } AM`;

          return days.value === 1 ? time : date.toLocaleDateString();
        }),
        datasets: getDataSets(),
      }}
      options={{
        elements: { point: { radius: 1 } },
        scales: {
          y: {
            ticks: {
              // Include a curreny sign in the ticks
              callback: (value) => {
                value =
                  Number(value) < 999999
                    ? value
                    : (Number(value) / 1000000).toFixed(0) + "M";

                return (
                  currentWallet.currency +
                  (!isNaN(Number(value)) ? Number(value).toFixed(0) : value)
                );
              },
            },
          },
        },
      }}
    />
  );
};

export default Chart;
