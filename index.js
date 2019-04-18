import { WasmTar, default as init } from "./pkg/wasm_tar.js";

const file_input = document.getElementById("file-input");
const file_reader = new FileReader();
file_input.addEventListener("change", () => loadInput(file_input));

async function run() {
  // Initialize the wasm module.
  const wasm = await init("./pkg/wasm_tar_bg.wasm");
  const wasm_tar = WasmTar.new();

  file_reader.onload = event =>
    transferContent(event.target.result, wasm_tar, wasm);

  // Definition of the render loop.
  const renderLoop = () => {
    requestAnimationFrame(renderLoop);
  };

  requestAnimationFrame(renderLoop);
}

function loadInput(input) {
  const tar_file = input.files[0];
  console.log("File name: " + tar_file.name);
  console.log("File size: " + tar_file.size);
  // Ideally directly read into the wasm memory buffer!
  // But I think that is not possible.
  file_reader.readAsArrayBuffer(tar_file);
}

function transferContent(arrayBuffer, wasm_tar, wasm) {
  console.log("transferContent");
  const length = arrayBuffer.length;
  wasm_tar.allocate(length);
  const start = wasm_tar.memory_pos();
  const wasm_buffer = new Uint8Array(wasm.memory.buffer, start, length);
  // Ideally, we should avoid the copy but well ...
  wasm_buffer.set(arrayBuffer);
  // TODO: trigger wasm processing.
  console.log("We got here!");
  console.log(wasm_tar.list_entries());
}

run();
