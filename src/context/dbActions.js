/* eslint-disable react-hooks/rules-of-hooks */
import { supabase } from "../supabase";
import helper from "../utils/helper";

export const getInitData = async (userId, errorCalback) => {
  try {
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
      return {
        userInfo,
        wallets,
        cards,
        purposes,
        transactions,
      };
    }
  } catch (error) {
    const err = { type: "error", message: error?.message || error };
    errorCalback ? errorCalback(err) : console.log(err);
  }
};

export const dbUpdates = async (
  table,
  action,
  entity,
  userId,
  afterCallback = () => {}
) => {
  let notification = { type: "success" };

  try {
    let request = null;
    entity.user_id = entity.user_id || userId;

    entity = helper.withoutKeys(entity, ["invalid"]);

    if (action == "insert") {
      request = supabase.from(table).insert(entity);

      notification.message = "main.Created";
      notification.params = { entity: table.toUpperCase() };
    }
    if (action == "update") {
      request = supabase.from(table).update(entity).eq("id", entity.id);
    }
    if (action === "delete") {
      request = supabase.from(table).delete(entity).eq("id", entity.id);

      notification.message = "main.Removed";
      notification.params = { entity: table.toUpperCase() };
    }

    const { error } = await request;

    if (error) {
      afterCallback({ type: "error", message: error?.message || error });
      return;
    }

    if (notification.message) {
      afterCallback(notification);
    }
  } catch (error) {
    afterCallback({ type: "error", message: error?.message || error });
  }
};

export const setChannel = (handleDBChanges) => {
  return supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "wallet" },
      handleDBChanges
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "card" },
      handleDBChanges
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "purpose" },
      handleDBChanges
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transaction" },
      handleDBChanges
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "userInfo" },
      handleDBChanges
    )
    .subscribe();
};
