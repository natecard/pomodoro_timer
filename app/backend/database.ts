import { DBSchema, openDB } from "idb";

interface SessionDB extends DBSchema {
  session: {
    key: string;
    value: number;
    session_time: {
      key: string;
      value: number;
    };
  };
};

const requestDB = openDB<SessionDB>("SessionLogs", 1, {
  upgrade(db) {
    db.createObjectStore("session");
  },
});

export async function get(key) {
  return (await requestDB).get("keyval", key);
}
export async function set(key: string, val: number) {
  return (await requestDB).put("keyval", val, key);
}
export async function del(key) {
  return (await requestDB).delete("keyval", key);
}
export async function clear() {
  return (await requestDB).clear("keyval");
}
export async function keys() {
  return (await requestDB).getAllKeys("keyval");
}