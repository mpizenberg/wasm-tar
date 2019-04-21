import { WasmTar, default as init } from "./pkg/wasm_tar.js";

const file_input = document.getElementById("file-input");
const file_reader = new FileReader();
file_input.addEventListener("change", () => loadInput(file_input));

async function run() {
  // Initialize the wasm module.
  const wasm = await init("./pkg/wasm_tar_bg.wasm");
  const wasm_tar = WasmTar.new();

  // Transfer archive data to wasm when the file is loaded.
  file_reader.onload = () =>
    transferContent(file_reader.result, wasm_tar, wasm);
}

function loadInput(input) {
  const tar_file = input.files[0];
  file_reader.readAsArrayBuffer(tar_file);
}

// Transfer archive data to wasm when the file is loaded.
function transferContent(arrayBuffer, wasm_tar, wasm) {
  wasm_tar.allocate(arrayBuffer.byteLength);
  const wasm_buffer = new Uint8Array(wasm.memory.buffer);
  const start = wasm_tar.memory_pos();
  const file_buffer = new Uint8Array(arrayBuffer);
  wasm_buffer.set(file_buffer, start);
  console.log(wasm_tar.list_entries());
}

run();
