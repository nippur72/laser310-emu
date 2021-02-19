
function pckey_to_hwkey(pckey) {
   let hardware_key;   
   
   if(pckey === "F1")  hardware_key = KEY_F1 ; 
   if(pckey === "F2")  hardware_key = KEY_F2 ; 
   if(pckey === "F3")  hardware_key = KEY_F3 ; 
   if(pckey === "F4")  hardware_key = KEY_F4 ; 

   /*
   if(pckey === "F5")  hardware_key = KEY_F5 ; 
   if(pckey === "F6")  hardware_key = KEY_F6 ; 
   if(pckey === "F7")  hardware_key = KEY_F7 ; 
   if(pckey === "F8")  hardware_key = KEY_F8 ; 
   if(pckey === "F9")  hardware_key = KEY_F9 ; 
   if(pckey === "F10") hardware_key = KEY_F10; 
   */

   if(pckey === "Insert") hardware_key = KEY_INST_DEL; 
   if(pckey === "Delete") hardware_key = KEY_INST_DEL; 
   if(pckey === "Escape") hardware_key = KEY_ESC; 

   if(pckey === "Digit1") hardware_key = KEY_1; 
   if(pckey === "Digit2") hardware_key = KEY_2; 
   if(pckey === "Digit3") hardware_key = KEY_3; 
   if(pckey === "Digit4") hardware_key = KEY_4; 
   if(pckey === "Digit5") hardware_key = KEY_5; 
   if(pckey === "Digit6") hardware_key = KEY_6; 
   if(pckey === "Digit7") hardware_key = KEY_7; 
   if(pckey === "Digit8") hardware_key = KEY_8; 
   if(pckey === "Digit9") hardware_key = KEY_9; 
   if(pckey === "Digit0") hardware_key = KEY_0; 

   if(pckey === "Minus")     hardware_key = KEY_MINUS; 
   if(pckey === "Equal")     hardware_key = KEY_EQUAL; 
   if(pckey === "Backspace") hardware_key = KEY_INST_DEL;    

   if(pckey === "End")  hardware_key = KEY_DEL_LINE; 
   if(pckey === "Home") hardware_key = KEY_CLR_HOME; 
   //if(pckey === "Tab")  hardware_key = KEY_TAB; 

   if(pckey === "KeyQ") hardware_key = KEY_Q; 
   if(pckey === "KeyW") hardware_key = KEY_W; 
   if(pckey === "KeyE") hardware_key = KEY_E; 
   if(pckey === "KeyR") hardware_key = KEY_R; 
   if(pckey === "KeyT") hardware_key = KEY_T; 
   if(pckey === "KeyY") hardware_key = KEY_Y; 
   if(pckey === "KeyU") hardware_key = KEY_U; 
   if(pckey === "KeyI") hardware_key = KEY_I; 
   if(pckey === "KeyO") hardware_key = KEY_O; 
   if(pckey === "KeyP") hardware_key = KEY_P; 

   //if(pckey === "BracketLeft")  hardware_key = KEY_OPEN_BRACKET; 
   //if(pckey === "BracketRight") hardware_key = KEY_CLOSE_BRACKET; 
   if(pckey === "Enter")        hardware_key = KEY_RETURN; 
   if(pckey === "NumpadEnter")  hardware_key = KEY_RETURN; 
   if(pckey === "ControlLeft")  hardware_key = KEY_CTRL; 
   if(pckey === "ControlRight") hardware_key = KEY_CTRL; 

   if(pckey === "KeyA") hardware_key = KEY_A; 
   if(pckey === "KeyS") hardware_key = KEY_S; 
   if(pckey === "KeyD") hardware_key = KEY_D; 
   if(pckey === "KeyF") hardware_key = KEY_F; 
   if(pckey === "KeyG") hardware_key = KEY_G; 
   if(pckey === "KeyH") hardware_key = KEY_H; 
   if(pckey === "KeyJ") hardware_key = KEY_J; 
   if(pckey === "KeyK") hardware_key = KEY_K; 
   if(pckey === "KeyL") hardware_key = KEY_L; 

   if(pckey === "Semicolon") hardware_key = KEY_SEMICOLON; 
   //if(pckey === "Quote")     hardware_key = KEY_QUOTE; 
   //if(pckey === "Backquote") hardware_key = KEY_BACK_QUOTE; 
   if(pckey === "Backslash") hardware_key = KEY_ESC; 
   
   if(pckey === "ArrowUp")    hardware_key = KEY_UP; 
   if(pckey === "ShiftLeft")  hardware_key = KEY_SHIFT; 
   if(pckey === "ShiftRight") hardware_key = KEY_SHIFT; 

   if(pckey === "KeyZ") hardware_key = KEY_Z;
   if(pckey === "KeyX") hardware_key = KEY_X;
   if(pckey === "KeyC") hardware_key = KEY_C;
   if(pckey === "KeyV") hardware_key = KEY_V;
   if(pckey === "KeyB") hardware_key = KEY_B;
   if(pckey === "KeyN") hardware_key = KEY_N;
   if(pckey === "KeyM") hardware_key = KEY_M;

   if(pckey === "Comma")  hardware_key = KEY_COMMA; 
   if(pckey === "Period") hardware_key = KEY_DOT;   
   if(pckey === "Slash")  hardware_key = KEY_SLASH; 

   //if(pckey === "PageUp")   hardware_key = KEY_MU; 
   //if(pckey === "PageDown") hardware_key = KEY_GRAPH;

   if(pckey === "ArrowLeft")  hardware_key = KEY_LEFT; 
   if(pckey === "ArrowRight") hardware_key = KEY_RIGHT; 
   if(pckey === "CapsLock")   hardware_key = KEY_SHIFT;   // TODO caps lock
   if(pckey === "Space")      hardware_key = KEY_SPACE; 
   if(pckey === "ArrowDown")  hardware_key = KEY_DOWN; 

   if(hardware_key === undefined) {
      // console.log(pckey);
      return undefined;
   }
   
   return hardware_key;
}

function keyDown(e) { 

   // from Chrome 71 audio is suspended by default and must resume within an user-generated event
   audio.resume();

   // disable auto repeat, as it is handled on the firmware
   if(e.repeat) {
      e.preventDefault(); 
      return;
   }   

   // *** special (non characters) keys ***   

   // RESET key is CTRL+ALT+BREAK
   if(e.code === "Pause" && e.altKey && e.ctrlKey) {
      cpu.reset();      
      e.preventDefault(); 
      return;
   }

   // const hardware_key = pckey_to_hwkey(e.code);

   // if keyboard ITA
   {
      const hardware_keys = pckey_to_hardware_keys_ITA(e.code, e.key, e);
      if(hardware_keys.length === 0) return;
      /*
      keyboardReset();
      hardware_keys.forEach((k) => keyPress(k));
      */
      keyboard_buffer.push({ type: "press", hardware_keys });
      e.preventDefault();
   }
}

function keyUp(e) {
   const hardware_keys = pckey_to_hardware_keys_ITA(e.code, e.key, e);
   if(hardware_keys.length === 0) return;
   /*
   keyboardReset();
   //laser_keys.forEach((k) => keyRelease(k));
   */
   keyboard_buffer.push({ type: "release", hardware_keys });
   e.preventDefault();
}

// connect DOM events
const element = document; 
element.onkeydown = keyDown;
element.onkeyup = keyUp;

let keyboard_buffer = [];
