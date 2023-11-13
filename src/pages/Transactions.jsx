import { useContext } from "react";
import TransactionList from "../components/TransactionList";
import { GlobalContext } from "../context/GlobalState";

const Transactions = () => {
  const { transactions } = useContext(GlobalContext);

  return <TransactionList transactions={transactions} />;
};

export default Transactions;
