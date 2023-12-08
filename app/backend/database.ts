import {
  createDir,
  BaseDirectory,
  readDir,
  FileEntry,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { ReactEventHandler } from "react";

export interface sessionLog {
  session: {
    session_info: {
      key: number;
      session_length: number;
      session_completed: boolean;
      start_time_in_day: number;
      date: number;
      interruptions: {
        interruptions: boolean;
        number_of_interruptions: number;
      };
    };
    session_number: number;
    number_of_session_on_date: number;
    tags: string;
    notes: string;
  };
}

try {
  await createDir("users", { dir: BaseDirectory.AppData, recursive: true });
} catch (error) {
  console.error(error);
}
const entries = await readDir("users", {
  dir: BaseDirectory.AppData,
  recursive: true,
});

function processEntries(entries: FileEntry[]): void {
  for (const entry of entries) {
    console.log(`Entry: ${entry.path}`);
    if (entry.children) {
      processEntries(entry.children);
    }
  }
}
export function start_time(){
  invoke('start_time', {value: Date()})
}
 
export async function writeEntries(data: string) {
  let existingData = await readTextFile("session_data.json", { dir: BaseDirectory.AppData });

  invoke('session_log_to_json', {string: data})
  // Append the new data
  // await writeTextFile("session_data.json", data + "\n", {
  //   dir: BaseDirectory.AppData,
  //   append: true,
  // });
}
