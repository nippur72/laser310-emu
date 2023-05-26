import { getLaser310 } from "./index";
import { pckey_to_hardware_keys_ITA } from "./keyboard_IT";

export function keyDown(e: KeyboardEvent) {

   // from Chrome 71 audio is suspended by default and must resume within an user-generated event
   getLaser310().audio.resume();

   // disable auto repeat, as it is handled on the firmware
   if(e.repeat) {
      e.preventDefault(); 
      return;
   }   

   // RESET key is CTRL+ALT+BREAK
   if(e.code === "Pause" && e.altKey && e.ctrlKey) {
      getLaser310().cpu_reset();      
      e.preventDefault(); 
      return;
   }

   const hardware_keys = pckey_to_hardware_keys_ITA(e.code, e.key, e);
   if(hardware_keys.length > 0) {
      hardware_keys.forEach((k) => getLaser310().keyPress(k));
      e.preventDefault();
   }
}

export function keyUp(e: KeyboardEvent) {
   const hardware_keys = pckey_to_hardware_keys_ITA(e.code, e.key, e);
   if(hardware_keys.length > 0) {
      hardware_keys.forEach((k) => getLaser310().keyRelease(k));
      e.preventDefault();
   }
}

