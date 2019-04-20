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
  console.log("File name: " + tar_file.name);
  console.log("File size: " + tar_file.size);
  // Ideally directly read into the wasm memory buffer!
  // But I think that is not possible.
  file_reader.readAsArrayBuffer(tar_file);
}

// Transfer archive data to wasm when the file is loaded.
function transferContent(arrayBuffer, wasm_tar, wasm) {
  console.log("transferContent");
  const size_allocated = wasm_tar.allocate(arrayBuffer.byteLength);
  console.log("Size allocated: " + size_allocated);
  const wasm_buffer = new Uint8Array(wasm.memory.buffer);
  // Ideally, we should avoid the copy but well ...
  wasm_buffer.set(arrayBuffer, wasm_tar.memory_pos());
  // TODO: trigger wasm processing.
  console.log("We got here!");
  console.log(wasm_tar.list_entries());
}

run();
