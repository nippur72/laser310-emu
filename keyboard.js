let keyboard_buffer = [];
let use_keyboard_buffer = true;

function keyDown(e) {

   // from Chrome 71 audio is suspended by default and must resume within an user-generated event
   audio.resume();

   // disable auto repeat, as it is handled on the firmware
   if(e.repeat) {
      e.preventDefault(); 
      return;
   }   

   // RESET key is CTRL+ALT+BREAK
   if(e.code === "Pause" && e.altKey && e.ctrlKey) {
      cpu.reset();      
      e.preventDefault(); 
      return;
   }

   const hardware_keys = pckey_to_hardware_keys_ITA(e.code, e.key, e);
   if(hardware_keys.length > 0) {
      if(use_keyboard_buffer) {
         keyboard_buffer.push({ type: "press", hardware_keys });
      } else {
         hardware_keys.forEach((k) => keyPress(k));
      }
      e.preventDefault();
   }
}

function keyUp(e) {
   const hardware_keys = pckey_to_hardware_keys_ITA(e.code, e.key, e);
   if(hardware_keys.length > 0) {
      if(use_keyboard_buffer) {
         keyboard_buffer.push({ type: "release", hardware_keys });
      } else {
         hardware_keys.forEach((k) => keyRelease(k));
      }
      e.preventDefault();
   }
}

// connect DOM events
const element = document; 
element.onkeydown = keyDown;
element.onkeyup = keyUp;


