/* eslint-disable no-case-declarations */
import helper from "../utils/helper";
import {
  CHANGE_LANGUAGE,
  REMOVE_CARD,
  REMOVE_PURPOSE,
  REMOVE_WALLET,
  SET_ALL_CARDS,
  SET_ALL_PURPOSE,
  SET_ALL_TRANSACTIONS,
  SET_ALL_WALLETS,
  SET_CARD,
  SET_CURRENT_WALLET,
  SET_LOADING,
  SET_NOTIFICATION,
  SET_PAYMENT_TYPES,
  SET_PURPOSE,
  SET_TOTAL_INFOS,
  SET_TRANSACTION,
  SET_USER_INFO,
  SET_WALLET,
  SWITCH_THEME,
  UPDATE_CARD,
  UPDATE_PURPOSE,
  UPDATE_WALLET,
} from "./ActionTypes";

function updateItem(array, entity) {
  return array.map((item) => {
    if (item.id === entity.id) {
      item = entity;
    }
    return item;
  });
}

function removeItem(array, id) {
  return array.filter((item) => item.id !== id);
}

function initState(field, ...args) {
  return {
    ...args[0],
    [field]: args[1].payload,
  };
}

function setState(field, ...args) {
  const existItem = args[0][field].find((i) => i.id === args[1].payload.id);
  if (!existItem) {
    return {
      ...args[0],
      [field]: [...args[0][field], args[1].payload],
    };
  } else {
    return {
      ...args[0],
      [field]: updateItem(args[0][field], args[1].payload),
    };
  }
}

function calculateTotals(transactions) {
  return {
    income: helper.getSummByType(transactions, "income"),
    outcome: helper.getSummByType(transactions, "outcome"),
  };
}

// --------------------------------------- REDUCER ----------------------------------------
const AppReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return initState("loading", state, action);

    case SET_NOTIFICATION:
      return initState("notification", state, action);

    case SWITCH_THEME:
      return initState("darkMode", state, action);

    case CHANGE_LANGUAGE:
      return initState("language", state, action);

    case SET_PAYMENT_TYPES:
      return initState("paymentTypes", state, action);

    case SET_TOTAL_INFOS:
      const totals = calculateTotals(state.transactions);

      return {
        ...state,
        total_infos: state.total_infos.map((v) => {
          if (v.type === "bonus") {
            v.amount =
              totals.income >= totals.outcome
                ? totals.income - totals.outcome
                : 0;
          }
          if (v.type === "income") {
            v.amount = totals.income;
          }
          if (v.type === "outcome") {
            v.amount = totals.outcome;
          }

          return v;
        }),
      };

    // ------------------------------- User -------------------------------------------
    case SET_USER_INFO:
      return initState("user", state, action);

    // ------------------------------- Transactions -------------------------------------------
    case SET_ALL_TRANSACTIONS:
      return initState("transactions", state, action);

    case SET_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };

    // ------------------------------- Cards -------------------------------------------
    case SET_ALL_CARDS:
      return initState("cards", state, action);

    case SET_CARD:
      return setState("cards", state, action);

    case UPDATE_CARD:
      return {
        ...state,
        cards: updateItem(state.cards, action.payload),
      };

    case REMOVE_CARD:
      return {
        ...state,
        cards: removeItem(state.cards, action.payload.id),
      };

    // ------------------------------- Purpose -------------------------------------------
    case SET_ALL_PURPOSE:
      return initState("purposes", state, action);

    case SET_PURPOSE:
      return {
        ...state,
        purposes: [action.payload, ...state.purposes],
      };

    case UPDATE_PURPOSE:
      return {
        ...state,
        purposes: updateItem(state.purposes, {
          ...action.payload,
          last_paid: new Date(),
        }),
      };

    case REMOVE_PURPOSE:
      return {
        ...state,
        purposes: removeItem(state.purposes, action.payload.id),
      };

    // -------------------------------- Wallets ------------------------------------------
    case SET_CURRENT_WALLET:
      return initState("currentWallet", state, {
        payload: helper.withoutKeys(action.payload, ["invalid"]),
      });

    case SET_ALL_WALLETS:
      return initState("wallets", state, action);

    case SET_WALLET:
      return setState("wallets", state, action);

    case UPDATE_WALLET:
      return {
        ...state,
        wallets: updateItem(state.wallets, action.payload),
      };

    case REMOVE_WALLET:
      return {
        ...state,
        wallets: removeItem(state.wallets, action.payload.id),
      };

    // ------------------------------------------------------------------------------
    default:
      return state;
  }
};

export default AppReducer;
