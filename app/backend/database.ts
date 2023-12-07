import {
  createDir,
  BaseDirectory,
  readDir,
  FileEntry,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/api/fs";

interface sessionLog {
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
function writeEntries(data: string) {
  writeTextFile("session_data.json", data, {
    dir: BaseDirectory.AppData,
    append: true,
  });
}

function readEntries(data: string) {
  readTextFile("session_data.json", { dir: BaseDirectory.AppData });
}
