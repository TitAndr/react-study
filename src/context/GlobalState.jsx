/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { createContext, useEffect, useReducer } from "react";
import AppReducer from "./AppReducer";
import {
  CHANGE_LANGUAGE,
  createAction,
  handleActions,
  SET_ALL_CARDS,
  SET_ALL_PURPOSE,
  SET_ALL_TRANSACTIONS,
  SET_ALL_WALLETS,
  SET_CURRENT_WALLET,
  SET_LOADING,
  SET_NOTIFICATION,
  SET_PAYMENT_TYPES,
  SET_TOTAL_INFOS,
  SET_USER_INFO,
  SWITCH_THEME,
} from "./ActionTypes";
import { supabase } from "../supabase/index";
import { dbUpdates, setChannel } from "./dbActions";
import i18n from "../i18n/index";

const languagesList = [
  { value: "en-US", label: "English (US)" },
  { value: "es-MX", label: "Español (MX)" },
  { value: "uk-UA", label: "Українська (UA)" },
  { value: "fr-FR", label: "Français (FR)" },
  { value: "zh-CN", label: "汉语 (CH)" },
];

const currencies = [
  {
    value: "$",
    code: "us",
    label: "Dollar ($)",
  },
  {
    value: "€",
    code: "eu",
    label: "Euro (€)",
  },
  {
    value: "£",
    code: "gb",
    label: "Pound (£)",
  },
  {
    value: "₴",
    code: "ua",
    currencyCode: "uk",
    label: "Hryvnia (₴)",
  },
  {
    value: "¥",
    code: "jp",
    currencyCode: "zh",
    label: "Yen (¥)",
  },
];

const categories = [
  { type: "income", value: "Salary", src: "salary.png" },
  { type: "income", value: "Investment", src: "investment.png" },
  { type: "income", value: "Bank transfer", src: "bank.png" },
  { type: "income", value: "Other source", src: "dollar.png" },
  { type: "outcome", value: "Products", src: "products.png" },
  { type: "outcome", value: "Shopping", src: "shopping.png" },
  { type: "outcome", value: "Cafe", src: "cafe.png" },
  { type: "outcome", value: "Car", src: "car.png" },
  { type: "outcome", value: "Medicines", src: "medicines.png" },
  { type: "outcome", value: "Other", src: "box.png" },
];

const paymentTypes = [
  { value: "Cash", src: "cash.png" },
  { value: "Card (primary)", src: "card.png" },
];

// ------------------------- STATE -----------------------
const initialState = {
  currentWallet: null,
  notification: null,
  darkMode: false,
  loading: false,
  user: null,
  purposes: [],
  wallets: [],
  cards: [],
  transactions: [],
  paymentTypes: [],
  total_infos: [
    {
      title: "LifetimeIncome",
      type: "income",
      image: "income.png",
      amount: 0,
    },
    {
      title: "LifetimeOutcome",
      type: "outcome",
      image: "outcome.png",
      amount: 0,
    },
    {
      title: "BonusIncome",
      type: "bonus",
      image: "bonus-income.png",
      amount: 0,
    },
  ],
  language: [languagesList[0].value],
};

// ----------------------------- Global Context ----------------------------------------------------
export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const setLoading = (value) => dispatch(createAction(SET_LOADING, value));

  const setPaymentTypes = (types) =>
    dispatch(createAction(SET_PAYMENT_TYPES, types));

  const setNotification = (value) =>
    dispatch(createAction(SET_NOTIFICATION, value));

  const switchTheme = (darkMode) =>
    dispatch(createAction(SWITCH_THEME, darkMode));

  const changeLanguage = (locale) =>
    dispatch(createAction(CHANGE_LANGUAGE, [locale]));

  const setCurrentWallet = (wallet) =>
    dispatch(createAction(SET_CURRENT_WALLET, wallet));

  const setAllWallets = (wallets) =>
    dispatch(createAction(SET_ALL_WALLETS, wallets));

  const setAllCards = (cards) => dispatch(createAction(SET_ALL_CARDS, cards));

  const setAllTransactions = (transactions) =>
    dispatch(createAction(SET_ALL_TRANSACTIONS, transactions));

  const setAllPurposes = (purposes) =>
    dispatch(createAction(SET_ALL_PURPOSE, purposes));

  const setAllUserInfo = (user) => dispatch(createAction(SET_USER_INFO, user));

  const setTotalInfos = () => dispatch(createAction(SET_TOTAL_INFOS, {}));

  // ---------------------------------- Auth ----------------------------------------------
  const updateAuth = ({ email, password }) => {
    const params = {};
    if (email) {
      params.email = email;
    }
    if (password) {
      params.password = password;
    }

    return supabase.auth.updateUser(params);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setNotification({ type: "error", message: error?.message || error });
      return;
    }
    return true;
  };

  // ------------------------------------- Save actions -----------------------------------
  const saveWallet = (...args) => saveChanges("wallet", ...args);

  const savePurpose = (...args) => saveChanges("purpose", ...args);

  const saveCard = (...args) => saveChanges("card", ...args);

  const saveUser = (...args) => saveChanges("userInfo", ...args);

  const saveTransaction = (...args) => saveChanges("transaction", ...args);

  // ----------------------------------------- Base -----------------------------------------
  const handleDBChanges = (action) => dispatch(handleActions(action));

  const saveChanges = async (...args) => {
    setLoading(true);

    await dbUpdates(...args, state.user?.user_id, setNotification);

    setLoading(false);
  };

  const createInitData = async (...args) => {
    try {
      // create && auth new user
      const { data, error: errorSignUp } = await supabase.auth.signUp({
        email: args[0].email,
        password: args[1].password,
      });

      if (errorSignUp) {
        setNotification({
          type: "error",
          message: errorSignUp?.message || errorSignUp,
        });
        return;
      }

      // create new userInfo
      await saveUser("insert", {
        ...args[0],
        ...args[1],
        photo: "",
        user_id: data.user.id,
      });

      // create new wallet
      const defaultCurrency = currencies.find(
        (c) => c.currencyCode === state.language[0].slice(0, 2)
      );
      const newWallet = {
        name: "Main Wallet",
        currency: defaultCurrency ? defaultCurrency.value : currencies[0].value,
        balance: 0,
        is_main: true,
        user_id: data.user.id,
      };

      setCurrentWallet(newWallet);

      await saveWallet("insert", newWallet);
      setNotification({
        type: "success",
        message: "main.AccountCreated",
      });
    } catch (error) {
      setNotification({ type: "error", message: error?.message || error });
    }
  };

  const getData = async (userId) => {
    try {
      setLoading(true);
      const result = await Promise.all([
        supabase.from("wallet").select("*").eq("user_id", userId),
        supabase.from("card").select("*").eq("user_id", userId),
        supabase.from("purpose").select("*").eq("user_id", userId),
        supabase.from("transaction").select("*").eq("user_id", userId),
        supabase.from("userInfo").select("*").eq("user_id", userId),
      ]);

      const [
        { data: wallets, error: errorWallet },
        { data: cards, error: errorCard },
        { data: purposes, error: errorPurpose },
        { data: transactions, error: errorTransaction },
        { data: userInfo, error: errorUserInfo },
      ] = result;

      if (
        !errorCard &&
        !errorWallet &&
        !errorPurpose &&
        !errorTransaction &&
        !errorUserInfo
      ) {
        setAllUserInfo(userInfo[0]);
        setAllWallets(wallets);
        setAllCards(cards);
        setAllPurposes(purposes);
        setAllTransactions(transactions);
        setTotalInfos();

        setPaymentTypes(cards.length === 0 ? [paymentTypes[0]] : paymentTypes);

        if (wallets[0]) {
          setCurrentWallet(wallets.find((w) => w.is_main) || wallets[0]);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setNotification({ type: "error", message: error?.message || error });
    }
  };

  // ------------------------------------- Init Render ----------------------------------------------
  useEffect(() => {
    const params = {
      darkMode: localStorage.getItem("darkMode"),
      language: localStorage.getItem("language"),
    };
    if (params.darkMode !== undefined && params.darkMode !== null) {
      switchTheme(JSON.parse(params.darkMode));
    }
    if (params.language !== undefined && params.language !== null) {
      changeLanguage(params.language);
      i18n.changeLanguage(params.language.slice(0, 2));
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      // ------------------- Subscribe on DB changes --------------------------------
      const channel = setChannel(handleDBChanges);

      // ------------------ Remove subscribers ---------------------------------------
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [state.user]);

  return (
    <GlobalContext.Provider
      value={{
        darkMode: state.darkMode,
        language: state.language,
        purposes: state.purposes,
        wallets: state.wallets,
        currentWallet: state.currentWallet,
        loading: state.loading,
        notification: state.notification,
        cards: state.cards,
        paymentTypes: state.paymentTypes,
        total_infos: state.total_infos,
        transactions: state.transactions,
        user: state.user,
        currencies,
        categories,
        languagesList,
        createInitData,
        resetPassword,
        updateAuth,
        getData,
        setLoading,
        setTotalInfos,
        setNotification,
        switchTheme,
        changeLanguage,
        setCurrentWallet,
        savePurpose,
        saveWallet,
        saveCard,
        saveTransaction,
        saveUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
