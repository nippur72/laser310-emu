function pckey_to_hardware_keys_ITA(code, key, e) {
   // console.log(code, key, e);

   let hardware_keys = [];

   if(e.ctrlKey) hardware_keys.push( KEY_CTRL );
   if(e.altKey) hardware_keys.push( KEY_CBM );
   let capsLockState = e.getModifierState("CapsLock");

   if(code === "Home" && e.shiftKey) hardware_keys.push( KEY_SHIFT, KEY_CLR_HOME  );

   if(key === "1")             hardware_keys.push( KEY_1  );
   if(key === "2")             hardware_keys.push( KEY_2  );
   if(key === "3")             hardware_keys.push( KEY_3  );
   if(key === "4")             hardware_keys.push( KEY_4  );
   if(key === "5")             hardware_keys.push( KEY_5  );
   if(key === "6")             hardware_keys.push( KEY_6  );
   if(key === "7")             hardware_keys.push( KEY_7  );
   if(key === "8")             hardware_keys.push( KEY_8  );
   if(key === "9")             hardware_keys.push( KEY_9  );
   if(key === "0")             hardware_keys.push( KEY_0  );

   if((e.shiftKey && !capsLockState) || (!e.shiftKey && capsLockState)) {
      if(code === "KeyQ")         hardware_keys.push( KEY_SHIFT, KEY_Q  );
      if(code === "KeyW")         hardware_keys.push( KEY_SHIFT, KEY_W  );
      if(code === "KeyE")         hardware_keys.push( KEY_SHIFT, KEY_E  );
      if(code === "KeyR")         hardware_keys.push( KEY_SHIFT, KEY_R  );
      if(code === "KeyT")         hardware_keys.push( KEY_SHIFT, KEY_T  );
      if(code === "KeyY")         hardware_keys.push( KEY_SHIFT, KEY_Y  );
      if(code === "KeyU")         hardware_keys.push( KEY_SHIFT, KEY_U  );
      if(code === "KeyI")         hardware_keys.push( KEY_SHIFT, KEY_I  );
      if(code === "KeyO")         hardware_keys.push( KEY_SHIFT, KEY_O  );
      if(code === "KeyP")         hardware_keys.push( KEY_SHIFT, KEY_P  );
      if(code === "KeyA")         hardware_keys.push( KEY_SHIFT, KEY_A  );
      if(code === "KeyS")         hardware_keys.push( KEY_SHIFT, KEY_S  );
      if(code === "KeyD")         hardware_keys.push( KEY_SHIFT, KEY_D  );
      if(code === "KeyF")         hardware_keys.push( KEY_SHIFT, KEY_F  );
      if(code === "KeyG")         hardware_keys.push( KEY_SHIFT, KEY_G  );
      if(code === "KeyH")         hardware_keys.push( KEY_SHIFT, KEY_H  );
      if(code === "KeyJ")         hardware_keys.push( KEY_SHIFT, KEY_J  );
      if(code === "KeyK")         hardware_keys.push( KEY_SHIFT, KEY_K  );
      if(code === "KeyL")         hardware_keys.push( KEY_SHIFT, KEY_L  );
      if(code === "KeyZ")         hardware_keys.push( KEY_SHIFT, KEY_Z  );
      if(code === "KeyX")         hardware_keys.push( KEY_SHIFT, KEY_X  );
      if(code === "KeyC")         hardware_keys.push( KEY_SHIFT, KEY_C  );
      if(code === "KeyV")         hardware_keys.push( KEY_SHIFT, KEY_V  );
      if(code === "KeyB")         hardware_keys.push( KEY_SHIFT, KEY_B  );
      if(code === "KeyN")         hardware_keys.push( KEY_SHIFT, KEY_N  );
      if(code === "KeyM")         hardware_keys.push( KEY_SHIFT, KEY_M  );
   }
   else {
      if(code === "KeyQ")         hardware_keys.push( KEY_Q  );
      if(code === "KeyW")         hardware_keys.push( KEY_W  );
      if(code === "KeyE")         hardware_keys.push( KEY_E  );
      if(code === "KeyR")         hardware_keys.push( KEY_R  );
      if(code === "KeyT")         hardware_keys.push( KEY_T  );
      if(code === "KeyY")         hardware_keys.push( KEY_Y  );
      if(code === "KeyU")         hardware_keys.push( KEY_U  );
      if(code === "KeyI")         hardware_keys.push( KEY_I  );
      if(code === "KeyO")         hardware_keys.push( KEY_O  );
      if(code === "KeyP")         hardware_keys.push( KEY_P  );
      if(code === "KeyA")         hardware_keys.push( KEY_A  );
      if(code === "KeyS")         hardware_keys.push( KEY_S  );
      if(code === "KeyD")         hardware_keys.push( KEY_D  );
      if(code === "KeyF")         hardware_keys.push( KEY_F  );
      if(code === "KeyG")         hardware_keys.push( KEY_G  );
      if(code === "KeyH")         hardware_keys.push( KEY_H  );
      if(code === "KeyJ")         hardware_keys.push( KEY_J  );
      if(code === "KeyK")         hardware_keys.push( KEY_K  );
      if(code === "KeyL")         hardware_keys.push( KEY_L  );
      if(code === "KeyZ")         hardware_keys.push( KEY_Z  );
      if(code === "KeyX")         hardware_keys.push( KEY_X  );
      if(code === "KeyC")         hardware_keys.push( KEY_C  );
      if(code === "KeyV")         hardware_keys.push( KEY_V  );
      if(code === "KeyB")         hardware_keys.push( KEY_B  );
      if(code === "KeyN")         hardware_keys.push( KEY_N  );
      if(code === "KeyM")         hardware_keys.push( KEY_M  );
   }

   if(key === "!")             hardware_keys.push( KEY_SHIFT, KEY_1  );
   if(key === '"')             hardware_keys.push( KEY_SHIFT, KEY_2  );
   if(key === "£")             hardware_keys.push( KEY_POUND  );
   if(key === "$")             hardware_keys.push( KEY_SHIFT, KEY_4  );
   if(key === "%")             hardware_keys.push( KEY_SHIFT, KEY_5  );
   if(key === "&")             hardware_keys.push( KEY_SHIFT, KEY_6  );
   if(key === "/")             hardware_keys.push( KEY_SLASH  );
   if(key === "(")             hardware_keys.push( KEY_SHIFT, KEY_8  );
   if(key === ")")             hardware_keys.push( KEY_SHIFT, KEY_9  );
   if(key === "=")             hardware_keys.push( KEY_EQUAL  );
   if(key === "'")             hardware_keys.push( KEY_SHIFT, KEY_7  );
   if(key === "?")             hardware_keys.push( KEY_SHIFT, KEY_SLASH  );
   if(key === "^")             hardware_keys.push( KEY_SHIFT, KEY_0  );
   if(key === "[")             hardware_keys.push( KEY_SHIFT, KEY_COLON  );
   if(key === "]")             hardware_keys.push( KEY_SHIFT, KEY_SEMICOLON  );
   if(key === "+")             hardware_keys.push( KEY_PLUS  );
   if(key === "*")             hardware_keys.push( KEY_ASTERISK  );
   if(key === "@")             hardware_keys.push( KEY_AT  );
   if(key === "#")             hardware_keys.push( KEY_SHIFT, KEY_3  );
   if(key === "<")             hardware_keys.push( KEY_SHIFT, KEY_COMMA  );
   if(key === ">")             hardware_keys.push( KEY_SHIFT, KEY_DOT  );
   if(key === ",")             hardware_keys.push( KEY_COMMA  );
   if(key === ";")             hardware_keys.push( KEY_SEMICOLON  );
   if(key === ".")             hardware_keys.push( KEY_DOT  );
   if(key === ":")             hardware_keys.push( KEY_COLON  );
   if(key === "-")             hardware_keys.push( KEY_MINUS  );
   if(code === "F1")           hardware_keys.push( KEY_F1  );
   if(code === "F2")           hardware_keys.push( KEY_F2  );
   if(code === "F3")           hardware_keys.push( KEY_F3  );
   if(code === "F4")           hardware_keys.push( KEY_SHIFT, KEY_F1  );
   if(code === "F5")           hardware_keys.push( KEY_SHIFT, KEY_F2  );
   if(code === "F6")           hardware_keys.push( KEY_SHIFT, KEY_F3  );
   if(code === "F7")           hardware_keys.push( KEY_SHIFT, KEY_HELP  );
   if(code === "F8")           hardware_keys.push( KEY_HELP  );
   if(code === "F9")           hardware_keys.push( KEY_HELP  );
   if(code === "F10")          hardware_keys.push( KEY_HELP  );
   if(code === "Insert")       hardware_keys.push( KEY_SHIFT, KEY_INST_DEL  );
   if(code === "Delete")       hardware_keys.push( KEY_INST_DEL  );
   if(code === "Escape")       hardware_keys.push( KEY_ESC  );
   if(code === "Backspace")    hardware_keys.push( KEY_INST_DEL  );
   if(code === "End")          hardware_keys.push( KEY_SHIFT, KEY_CLR_HOME );
   if(code === "Home")         hardware_keys.push( KEY_CLR_HOME  );
   if(code === "Enter")        hardware_keys.push( KEY_RETURN  );
   if(code === "NumpadEnter")  hardware_keys.push( KEY_RETURN  );
   if(code === "ControlLeft")  hardware_keys.push( KEY_CTRL  );
   if(code === "ControlRight") hardware_keys.push( KEY_CTRL  );
   if(code === "ArrowUp")      hardware_keys.push( KEY_UP  );
   if(code === "ArrowDown")    hardware_keys.push( KEY_DOWN  );
   if(code === "ArrowLeft")    hardware_keys.push( KEY_LEFT  );
   if(code === "ArrowRight")   hardware_keys.push( KEY_RIGHT  );

   if(code === "Space")        hardware_keys.push( KEY_SPACE  );
   if(code === "Tab")          hardware_keys.push( KEY_RUN_STOP );
   if(key === "\\")            hardware_keys.push( KEY_ESC  );

   // disabled because of brower bug
   //if(code === "Pause")        hardware_keys.push( KEY_RUN_STOP );

   //if(key === "{")             hardware_keys.push(  );
   //if(key === "}")             hardware_keys.push(  );

   //if(key === "|")             hardware_keys.push(   );
   //if(key === "_")             hardware_keys.push(  );

   //if(code === "PageUp")       hardware_keys.push(  );
   //if(code === "PageDown")     hardware_keys.push(  );
   //if(code === "CapsLock")     hardware_keys.push(  );

   return hardware_keys;
}
