export const SET_LOADING = "SET_LOADING";
export const SET_NOTIFICATION = "SET_NOTIFICATION";
export const SET_PAYMENT_TYPES = "SET_PAYMENT_TYPES";
export const SWITCH_THEME = "SWITCH_THEME";
export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const SET_ALL_WALLETS = "SET_ALL_WALLETS";
export const SET_ALL_CARDS = "SET_ALL_CARDS";
export const SET_ALL_TRANSACTIONS = "SET_ALL_TRANSACTIONS";
export const SET_ALL_PURPOSE = "SET_ALL_PURPOSE";
export const SET_CARD = "SET_CARD";
export const UPDATE_CARD = "UPDATE_CARD";
export const REMOVE_CARD = "REMOVE_CARD";
export const SET_CURRENT_WALLET = "SET_CURRENT_WALLET";
export const SET_WALLET = "SET_WALLET";
export const UPDATE_WALLET = "UPDATE_WALLET";
export const REMOVE_WALLET = "REMOVE_WALLET";
export const SET_PURPOSE = "SET_PURPOSE";
export const UPDATE_PURPOSE = "UPDATE_PURPOSE";
export const REMOVE_PURPOSE = "REMOVE_PURPOSE";
export const SET_USER_INFO = "SET_USERINFO";
export const SET_TRANSACTION = "SET_TRANSACTION";
export const SET_TOTAL_INFOS = "SET_TOTAL_INFOS";

export const createAction = (type, payload) => {
  return {
    type,
    payload,
  };
};

export const handleActions = ({ eventType, new: newItem, old, table }) => {
  let type = null;
  let payload = newItem;

  if(table === 'userInfo') {
    type = "SET_";
  } else {
    switch (eventType) {
      case "INSERT":
        type = "SET_";
        break;
  
      case "UPDATE":
        type = "UPDATE_";
        break;
  
      case "DELETE":
        type = "REMOVE_";
        payload = { id: old.id };
        break;
    }
  }

  return createAction(`${type}${table.toUpperCase()}`, payload);
};
