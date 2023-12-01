// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem}
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![counter])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn counter(value: i32) {
  println!("Cycle Counter: {value}")
}

let tray = SystemTray::new().with_menu(tray_menu)

// here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
let quit = CustomMenuItem::new("quit".to_string(), "Quit");
let hide = CustomMenuItem::new("hide".to_string(), "Hide");
let tray_menu = SystemTrayMenu::new()
  .add_item(quit)
  .add_native_item(SystemTrayMenuItem::Separator)
  .add_item(hide);