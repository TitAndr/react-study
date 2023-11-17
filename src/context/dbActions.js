/* eslint-disable react-hooks/rules-of-hooks */
import { supabase } from "../supabase";
import helper from "../utils/helper";

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
