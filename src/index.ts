// TODO remove deprecated audio calls in audio.ts


// ************************** publish globals

// emulator
import { ay38910_audio_buf_ready } from "./emulator";
(window as any).ay38910_audio_buf_ready = ay38910_audio_buf_ready;

import { load_wasm, get_wasm_instance, Laser310 } from "./emscripten_wrapper";

import { main } from "./emulator";
import "./video";

let laser310: Laser310;

(async function() {
   await load_wasm();
   laser310 = new Laser310(get_wasm_instance());
   (window as any).laser310 = laser310;
   (window as any).wasm_instance = get_wasm_instance();
   main();
})();

// ************************** end publish globals

import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { initializeIcons } from "@fluentui/react";

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons();

import { EmulatorGUI } from "./GUI";

const mountNode = document.getElementById("mountnode");
const root = createRoot(mountNode!);
root.render(createElement(EmulatorGUI));

export function getLaser310() {
   return laser310;
}
