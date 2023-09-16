// TODO remove deprecated audio calls in audio.ts


// ************************** publish globals

// emulator
import { ay38910_audio_buf_ready, csave_cb } from "./emulator";
(window as any).ay38910_audio_buf_ready = ay38910_audio_buf_ready;
(window as any).csave_cb = csave_cb;

import { load_wasm, get_wasm_instance, Laser310 } from "./emscripten_wrapper";

import "./video";

import { hex } from "./bytes";
(window as any).hex = hex;

let laser310: Laser310;

(async function() {
   await load_wasm();
   laser310 = new Laser310(get_wasm_instance());
   (window as any).laser310 = laser310;
   (window as any).wasm_instance = get_wasm_instance();
   await main();
})();

// ************************** end publish globals

import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { initializeIcons } from "@fluentui/react";

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons();

import { EmulatorGUI } from "./GUI";
import { externalLoad } from "./mdawson";
import { fetchProgram } from "./browser";

const mountNode = document.getElementById("mountnode");
const root = createRoot(mountNode!);
root.render(createElement(EmulatorGUI));

export function getLaser310() {
   return laser310;
}

export interface QueryStringOptions {
   // load: undefined,
   // restore: false,
   rom: string|undefined,
   load: string|undefined
}

export let defaultOptions: QueryStringOptions = {
   // load: undefined,
   // restore: false,
   rom: undefined,
   load: undefined
};

async function main() {

   let options = await parseQueryStringCommands();

   let laser310 = getLaser310();

   laser310.setFirmwareROM(options.rom);
   laser310.cpu_reset();
   laser310.sys_init();
   laser310.sys_reset();
   laser310.connectJoystick(true);
   laser310.go();
}

function getQueryStringObject(options: QueryStringOptions) {
   let a = window.location.search.split("&");
   let o = a.reduce((o: any, v) =>{
      var kv = v.split("=");
      const key = kv[0].replace("?", "");
      let value: string|boolean = kv[1];
           if(value === "true") value = true;
      else if(value === "false") value = false;
      o[key] = value;
      return o;
   }, options);
   return o;
}

export async function parseQueryStringCommands() {
   let options = getQueryStringObject(defaultOptions) as QueryStringOptions;

   /*
   if(options.restore !== false) {
      // try to restore previous state, if any
      restoreState();
   }
   */

   if(options.load !== undefined) {
      const name = options.load;
      setTimeout(async ()=>{
         if(name.startsWith("http")) {
            // external load
            let vz = await externalLoad(name);
            getLaser310().load_vz_bytes(vz, true);
         }
         else {
            // internal load
            await fetchProgram(name);
         }
      }, 4000);
   }

   return options;
}

