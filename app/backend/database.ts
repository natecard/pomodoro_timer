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
