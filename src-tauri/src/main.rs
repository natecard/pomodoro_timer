// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, os};
use std::fs::File;
use std::io::{BufWriter, Write};
use chrono::Utc;
// TODO Create window handler function

use serde::{Serialize, Deserialize};
// use serde_json::{to_string, to_value};
use tauri::{Manager, AppHandle, Window};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, SystemTray};
fn main() {
 let icon_bytes = if cfg!(windows) {
  include_bytes!("../icons/icon.ico").to_vec()
  } else {
  include_bytes!("../icons/icon.png").to_vec()
  };

  let icon = tauri::Icon::Raw(icon_bytes);


  
  
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let open_window: CustomMenuItem = CustomMenuItem::new("open".to_string(), "Open");
  
  let tray_menu = SystemTrayMenu::new()
  .add_item(open_window)
  .add_item(hide)
  .add_native_item(SystemTrayMenuItem::Separator)
  .add_item(quit);

  let system_tray = SystemTray::new().with_menu(tray_menu)
  .with_icon(icon);
  
  tauri::Builder::default()
  .system_tray(system_tray.clone())
  .on_system_tray_event(|app, event| match event {
    SystemTrayEvent::MenuItemClick { id, .. } => {
        // let item_handle = app.tray_handle().get_item(&id);
        match id.as_str() {
          "quit" => {
            std::process::exit(0);
          }
          "hide" => {
            let window = app.get_window("main").unwrap();
            window.hide().unwrap();
          }
          "open" => {
            let window: Window = app.get_window("main").unwrap();
            window.show().unwrap();
          }
          _ => {}
        }
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![break_counter, session_counter, show_window, calculate_duration, session_log_to_json, start_time, end_time])
    .system_tray(system_tray.clone())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn show_window(app: AppHandle) {
  let window = app.get_window("main").unwrap();
  window.show().unwrap();
}

#[tauri::command]
fn break_counter(value: i32) -> String {
  let break_counter_value;
  break_counter_value = value;
 format!("Break Sessions: {}", break_counter_value)
}

#[tauri::command]
fn session_counter(value: i32) -> String {
  let session_counter_value: i32;
  session_counter_value = value;
 format!("Pomodoro Sessions: {}", session_counter_value)
}

#[derive(Debug, Serialize, Deserialize)]
struct SessionLog {
  session_info: SessionInfo,
  session_number: u32,
  number_of_session_on_date: u8,
  tags: Vec<String>,
  notes: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SessionInfo {
  key: u32,
  session_length: u32,
  session_completed: bool,
  start_timestamp: u32,
  date: u32,
  pauses: Pauses,
}

#[derive(Debug, Serialize, Deserialize)]
struct Pauses {
  pauses: bool,
  number_of_pauses: u8,
}

fn write_entries(data: String) -> Result<(), std::io::Error> {
  let file = File::create("session_data.json")?;
  let mut buf_writer = BufWriter::new(&file);
  // Append a newline character if the file already has content
  if file.metadata()?.len() > 0 {
    buf_writer.write_all("\n".as_bytes())?;
  }
  buf_writer.write_all(data.as_bytes())?;
  buf_writer.flush()?;
  Ok(())
}

  #[tauri::command]
  fn start_time(){
    let start_timestamp = Utc::now();
    println!("Start Time: {}", start_timestamp);
  }
  #[tauri::command]
  fn end_time(){
    let end_timestamp = Utc::now();
    println!("End Time: {}", end_timestamp);
  }

#[tauri::command]
fn calculate_duration(start_timestring: String, end_timestring: String) {
  let start_timestamp = start_timestring.parse::<i64>().unwrap();
  let end_timestamp = end_timestring.parse::<i64>().unwrap();
  let duration= end_timestamp-start_timestamp;
  let duration_string = (duration/1000)-1;
  // let duration_string = duration_string.
  println!("Seconds elapsed: {}", duration_string);
}

  #[tauri::command]
  fn session_log_to_json(string: String) {
    match serde_json::from_str::<SessionLog>(&string) {
    Ok(session_log) => {
     // Convert the SessionLog object to JSON string
      let json_string = serde_json::to_string(&session_log).unwrap();
      // Append the JSON string to the file
      let _ = write_entries(json_string);

    }
    Err(error) => {
      // Handle deserialization error
      eprintln!("Error deserializing JSON: {:?}", error);
    }
  }
}
