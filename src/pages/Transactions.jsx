import { useContext } from "react";
import TransactionList from "../components/TransactionList";
import { GlobalContext } from "../context/GlobalState";

const Transactions = () => {
  const { transactions, currentWallet } = useContext(GlobalContext);

  return (
    <TransactionList
      transactions={transactions.filter(
        (t) => Number(t.wallet_id) === Number(currentWallet?.id)
      )}
    />
  );
};

export default Transactions;
