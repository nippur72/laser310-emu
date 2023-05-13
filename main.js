// keyboard_IT.js
import { pckey_to_hardware_keys_ITA, ascii_to_hardware_keys } from "./keyboard_IT.js";
window.pckey_to_hardware_keys_ITA = pckey_to_hardware_keys_ITA;
window.ascii_to_hardware_keys = ascii_to_hardware_keys;

// keys.js
import { keyPress, keyRelease } from "./keys.js";
window.keyPress = keyPress;
window.keyRelease = keyRelease;

// keyboard.js
import { keyDown, keyUp } from "./keyboard.js";
document.onkeydown = keyDown;
document.onkeyup = keyUp;

// vz.js
import { VZ_BINARY, VZ_BASIC, packvz, unpackvz } from "./vz.js";
window.VZ_BASIC = VZ_BASIC;
window.VZ_BINARY = VZ_BINARY;
window.packvz = packvz;
window.unpackvz = unpackvz;

// roms
import { vzrom20 } from "./roms/vzrom20.js";
import { vzrom21 } from "./roms/vzrom21.js";
window.vzrom20 = vzrom20;
window.vzrom21 = vzrom21;

// joystick
import { updateGamePad } from "./joystick.js";
window.updateGamePad = updateGamePad;

// autoload
import { autoload } from "./autoload.js";
window.autoload = autoload;

// video
import { vdp_screen_update_mc } from "./video.js";
window.vdp_screen_update_mc = vdp_screen_update_mc;

// files
import { load_vz, load_vz_bytes, save_vz } from "./files.js";
window.load_vz = load_vz;
window.load_vz_bytes = load_vz_bytes;
window.save_vz = save_vz;

// browser
import { droppedFiles, parseQueryStringCommands } from "./browser.js";
window.droppedFiles = droppedFiles;
window.parseQueryStringCommands = parseQueryStringCommands;

// utils
import { paste, resetROM, saveState, restoreState } from "./utils.js";
window.paste = paste;
window.resetROM = resetROM;
window.saveState = saveState;
window.restoreState = restoreState;

// debug
window.debugBefore = undefined;
window.debugAfter = undefined;
window.end_of_frame_hook = undefined;

// emulator
import { main, ay38910_audio_buf_ready, options, audio, emulator, renderFrame, oneFrame } from "./emulator.js";
window.ay38910_audio_buf_ready = ay38910_audio_buf_ready;
window.options = options;
window.audio = audio;
window.emulator = emulator;
window.renderFrame = renderFrame;
window.oneFrame = oneFrame;

import { load_wasm, get_wasm_instance, Laser310 } from "./emscripten_wrapper.js";

(async function() {
   await load_wasm();
   window.laser310 = new Laser310(get_wasm_instance());
   main();
})();

