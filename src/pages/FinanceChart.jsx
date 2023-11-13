/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import TotalInfo from "../components/TotalInfo";
import { Select, SelectItem } from "@nextui-org/react";
import Chart from "../components/Chart";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import helper from "../utils/helper";
import { useTranslation } from "react-i18next";

const chartDays = [
  {
    label: "24 Hours",
    key: "Hours",
    value: 1,
  },
  {
    label: "Month",
    key: "Month",
    value: 30,
  },
  {
    label: "This year",
    key: "ThisYear",
    value: 365,
  },
];
const incomeOutComeList = [
  {
    key: "income",
    label: "Income Chart",
  },
  {
    key: "outcome",
    label: "Outcome Chart",
  },
  {
    key: "combined",
    label: "Combined",
  },
];

const FinanceChart = () => {
  const { t } = useTranslation();
  const { total_infos, setTotalInfos, transactions } =
    useContext(GlobalContext);
  const [historicalData, setHistoricalData] = useState([11]);
  const [chartType, setChartType] = useState(incomeOutComeList[0].key);
  const [chartDay, setChartDay] = useState(chartDays[0]);

  const filteredData = () => {
    if (chartType === "combined") {
      setHistoricalData({
        income: helper.getDataByDateRange(
          transactions
            .filter((t) => t.type === "income")
            .map((v) => ({ created_at: v.created_at, amount: v.amount })),
          "created_at",
          chartDay.value
        ),

        outcome: helper.getDataByDateRange(
          transactions
            .filter((t) => t.type === "outcome")
            .map((v) => ({ created_at: v.created_at, amount: v.amount })),
          "created_at",
          chartDay.value
        ),

        created_at: helper.getDataByDateRange(
          transactions.map((t) => ({ created_at: t.created_at })),
          "created_at",
          chartDay.value
        ),
      });
    } else {
      setHistoricalData(
        helper.getDataByDateRange(
          transactions
            .filter((t) => t.type === chartType)
            .map((v) => ({ created_at: v.created_at, amount: v.amount })),
          "created_at",
          chartDay.value
        )
      );
    }
  };

  const setIncomeOutComeList = ({ currentKey }) => {
    setChartType(currentKey);
  };

  useEffect(() => {
    setIncomeOutComeList({ currentKey: "income" });
    setTotalInfos();
  }, [transactions]);

  useEffect(() => {
    filteredData();
  }, [chartDay, chartType]);

  return (
    <div className="flex flex-col items-center justify-center">
      {transactions.length !== 0 ? (
        <>
          <div className="flex justify-end items-center w-full m-0 mb-1">
            <div className="flex items-center gap-4">
              <Select
                labelPlacement="outside"
                className="w-[150px]"
                selectedKeys={[chartType]}
                onSelectionChange={setIncomeOutComeList}
              >
                {incomeOutComeList.map((line) => (
                  <SelectItem key={line.key} value={line.key}>
                    {t(`finance.${helper.capitalize(line.key)}`)}
                  </SelectItem>
                ))}
              </Select>
              <Select
                labelPlacement="outside"
                className="w-[120px]"
                selectedKeys={[chartDay.label]}
                onSelectionChange={({ currentKey }) => {
                  setChartDay(chartDays.find((d) => d.label === currentKey));
                }}
              >
                {chartDays.map((date) => (
                  <SelectItem key={date.label} value={date}>
                    {t(`finance.${date.key}`)}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <Chart
            historicalData={historicalData}
            type={chartType}
            days={chartDay}
          />
        </>
      ) : (
        <div className="text-[3rem] text-center italic text-default-500 my-12">
          {t("finance.NoStatistic")}
        </div>
      )}
      <div className="flex flex-col flex-wrap mt-4 justify-between gap-4 smd:flex-row w-full">
        {total_infos.map((i) => {
          return (
            <TotalInfo
              key={i.title}
              amount={i.amount}
              title={i.title}
              image={i.image}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FinanceChart;
