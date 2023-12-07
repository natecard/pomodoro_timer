import { DBSchema, openDB } from "idb";

interface SessionDB extends DBSchema {
  session: {
    key: string;
    value: number;
  };
  session_time: {
    key: string;
    value: number;
  };
}

async function sessionDatabase() {
  const request = openDB<SessionDB>("SessionLogs", 1);
}
