// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

use tauri::{Manager};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, SystemTray};
fn main() {
 let icon_bytes = if cfg!(windows) {
  include_bytes!("../icons/icon.ico").to_vec()
  } else {
  include_bytes!("../icons/icon.png").to_vec()
  };

  let icon = tauri::Icon::Raw(icon_bytes);


  let tray = SystemTray::new()
   .with_icon(icon);

  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let tray_menu = SystemTrayMenu::new()// insert the menu items here
  .add_item(quit)
  .add_native_item(SystemTrayMenuItem::Separator)
  .add_item(hide);

  tauri::Builder::default()
    .system_tray(SystemTray::new().with_menu(tray_menu))
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        println!("system tray received a left click");
      }
      SystemTrayEvent::RightClick {
        position: _,
        size: _,
        ..
      } => {
        println!("system tray received a right click");
      }
      SystemTrayEvent::DoubleClick {
        position: _,
        size: _,
        ..
      } => {
        println!("system tray received a double click");
      }
      SystemTrayEvent::MenuItemClick { id, .. } => {
        match id.as_str() {
          "quit" => {
            std::process::exit(0);
          }
          "hide" => {
            let window = app.get_window("main").unwrap();
            window.hide().unwrap();
          }
          _ => {}
        }
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![counter])
    .system_tray(tray)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


#[tauri::command]
fn counter(value: i32) {
 println!("Cycle Counter: {}", value)
}