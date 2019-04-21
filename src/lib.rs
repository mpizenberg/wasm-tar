use tar;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmTar {
    tar_buffer: Vec<u8>,
}

/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl WasmTar {
    pub fn new() -> WasmTar {
        WasmTar {
            tar_buffer: Vec::new(),
        }
    }

    pub fn allocate(&mut self, length: usize) {
        self.tar_buffer = vec![0; length];
    }

    pub fn memory_pos(&self) -> *const u8 {
        self.tar_buffer.as_ptr()
    }

    pub fn list_entries(&self) -> String {
        // Init archive from in memory tar buffer.
        let mut archive = tar::Archive::new(self.tar_buffer.as_slice());

        // Init a string containing all tar entries.
        let mut entries_string = Vec::new();
        entries_string.push("All entries:".to_string());

        // Iterate over all entries of the archive.
        for file in archive.entries().unwrap() {
            // Check for an I/O error.
            let file = file.unwrap();
            entries_string.push(file.header().path().unwrap().to_str().unwrap().to_owned());
        }

        // Concatenate entries into one string.
        entries_string.join("\n")
    }
}
