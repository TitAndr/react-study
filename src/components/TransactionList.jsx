/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@nextui-org/react";
import SearchIcon from "./Icons/SearchIcon";
import ChevronDownIcon from "./Icons/ChevronDownIcon";
import { useCallback, useContext, useMemo, useState } from "react";
import helper from "../utils/helper";
import DatePicker from "./DatePicker";
import { GlobalContext } from "../context/GlobalState";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";

const typeColorMap = {
  income: "success",
  outcome: "danger",
};

const typeOptions = [
  { name: "Income", uid: "income" },
  { name: "Outcome", uid: "outcome" },
];

const columns = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name", sortable: true },
  { name: "DATE", uid: "created_at", sortable: true },
  { name: "CATEGORY", uid: "category" },
  { name: "PAYMENT", uid: "payment" },
  { name: "TYPE", uid: "type" },
  { name: "AMOUNT", uid: "amount", sortable: true },
];

const TransactionList = ({ transactions }) => {
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [toDateFilter, setToDateFilter] = useState(
    new Date(new Date().setHours(23, 59, 59, 999))
  );
  const [fromDateFilter, setFromDateFilter] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const { allPaymentTypes, categories, currentWallet, language } =
    useContext(GlobalContext);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredTransactions = [...transactions];

    if (hasSearchFilter) {
      filteredTransactions = filteredTransactions.filter((tr) =>
        tr.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      typeFilter !== "all" &&
      Array.from(typeFilter).length !== typeOptions.length
    ) {
      filteredTransactions = filteredTransactions.filter((tr) =>
        Array.from(typeFilter).includes(tr.type)
      );
    }
    if (
      categoryFilter !== "all" &&
      Array.from(categoryFilter).length !== categories.length
    ) {
      filteredTransactions = filteredTransactions.filter((tr) =>
        Array.from(categoryFilter).includes(tr.category)
      );
    }

    filteredTransactions = helper.getDataByDateRange(
      filteredTransactions,
      "created_at",
      { to: toDateFilter, from: fromDateFilter }
    );

    return filteredTransactions;
  }, [
    transactions,
    filterValue,
    typeFilter,
    categoryFilter,
    toDateFilter,
    fromDateFilter,
  ]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first =
        a.type === "income"
          ? a[sortDescriptor.column]
          : a[sortDescriptor.column] * -1;
      const second =
        b.type === "income"
          ? b[sortDescriptor.column]
          : b[sortDescriptor.column] * -1;

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (tr, columnKey) => {
      const cellValue = tr[columnKey];

      switch (columnKey) {
        case "name":
          return <p className="font-bold capitalize">{cellValue}</p>;
        case "created_at":
          return (
            <p className="text-small">
              {new Date(cellValue).toLocaleString(language[0], {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          );
        case "amount":
          return (
            <p
              className={`text-${tr.type === "income" ? "success" : "danger"}`}
            >
              {(tr.type === "outcome" ? "-" : "") +
                (currentWallet?.currency || "") +
                cellValue}
            </p>
          );
        case "category":
          return (
            <div className="flex items-center gap-2">
              <img
                width={15}
                src={helper.getImgUrl(
                  categories.find((c) => c.value === cellValue)?.src
                )}
                alt="category"
              />
              <span>{t(`popup.${cellValue}`)}</span>
            </div>
          );
        case "payment":
          return (
            <div className="flex items-center gap-2">
              <img
                width={15}
                src={helper.getImgUrl(
                  allPaymentTypes.find((c) => c.value === cellValue)?.src
                )}
                alt="payment"
              />
              <span>{t(`popup.${cellValue}`)}</span>
            </div>
          );
        case "type":
          return (
            <Chip color={typeColorMap[tr.type]} size="md" variant="flat">
              {t(`transaction.${helper.capitalize(cellValue)}`)}
            </Chip>
          );
        default:
          return cellValue;
      }
    },
    [currentWallet]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-between gap-3 mobile:items-end mobile:flex-row">
          <Button
            radius="full"
            className="bg-[#4F46E5] text-white"
            onClick={() => alert("Not implemented yet...")}
          >
            {t("transaction.Excel")}
          </Button>
          <Input
            isClearable
            className="w-[250px]"
            placeholder={t("transaction.Search")}
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex flex-col gap-4 justify-between max-[700px]:justify-around items-center mobile:flex-row flex-wrap">
          <div className="flex flex-col gap-5 items-center min-[700px]:flex-row">
            <Dropdown>
              <DropdownTrigger className="flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {t("transaction.Type")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={typeFilter}
                selectionMode="multiple"
                onSelectionChange={setTypeFilter}
              >
                {typeOptions.map((type) => (
                  <DropdownItem key={type.uid} className="capitalize">
                    {t(`transaction.${helper.capitalize(type.name)}`)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {t("transaction.Category")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={categoryFilter}
                selectionMode="multiple"
                onSelectionChange={setCategoryFilter}
              >
                {categories.map((category) => (
                  <DropdownItem key={category.value} className="capitalize">
                    <div className="flex items-center gap-2">
                      <img width={15} src={helper.getImgUrl(category.src)} />
                      <span>{t(`popup.${category.value}`)}</span>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="flex items-center gap-3 mobile:max-w-[215px] w-[60vw] mobile:w-full max-[380px]:w-full justify-between">
              <label>{t("transaction.From")}:</label>
              <DatePicker
                locale={language}
                date={fromDateFilter}
                setDate={setFromDateFilter}
              />
            </div>
            <div className="flex items-center gap-3 mobile:max-w-[215px] w-[60vw] mobile:w-full max-[380px]:w-full justify-between">
              <label>{t("transaction.To")}:</label>
              <DatePicker
                locale={language}
                date={toDateFilter}
                setDate={(date) =>
                  setToDateFilter(new Date(date.setHours(23, 59, 59, 999)))
                }
              />
            </div>
          </div>
          <label className="flex items-center text-small text-center">
            {t("transaction.RowsPerPage")}:
            <select
              className="bg-transparent outline-none text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    typeFilter,
    categoryFilter,
    onRowsPerPageChange,
    transactions.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="hidden font-semibold max-w-[100px] mobile:max-w-none mobile:block">
          {parse(t("transaction.Total", { total: transactions.length }))}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[350px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            className="font-bold"
            key={column.uid}
            align="start"
            allowsSorting={column.sortable}
          >
            {t(`transaction.${column.name}`)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={t("transaction.Empty")} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionList;
