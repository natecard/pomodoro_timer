// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
// TODO Create window handler function

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
    .invoke_handler(tauri::generate_handler![break_counter, session_counter, show_window])
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