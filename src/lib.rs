use std::collections::HashMap;
use tar;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmTar {
    yolo: u32,
    tar_buffer: Vec<u8>,
}

/// Private methods not exposed to JavaScript.
impl WasmTar {
    // unimplemented!();
}

/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl WasmTar {
    pub fn new() -> WasmTar {
        WasmTar {
            yolo: 42,
            tar_buffer: Vec::new(),
        }
    }

    pub fn allocate(&mut self, length: usize) {
        self.tar_buffer = Vec::with_capacity(length);
    }

    pub fn memory_pos(&self) -> *const u8 {
        self.tar_buffer.as_ptr()
    }

    pub fn list_entries(&self) -> String {
        let mut archive = tar::Archive::new(self.tar_buffer.as_slice());
        // let mut entries = HashMap::new();
        let mut entries_string = Vec::new();
        entries_string.push("All entries:".to_string());
        for file in archive.entries().unwrap() {
            // Check for an I/O error.
            let file = file.unwrap();
            entries_string.push(file.header().path().unwrap().to_str().unwrap().to_owned());
        }
        entries_string.join("\n")
    }
}
