import { KEY_RESET    } from "./keys";
import { KEY_1        } from "./keys";
import { KEY_2        } from "./keys";
import { KEY_3        } from "./keys";
import { KEY_4        } from "./keys";
import { KEY_5        } from "./keys";
import { KEY_6        } from "./keys";
import { KEY_7        } from "./keys";
import { KEY_8        } from "./keys";
import { KEY_9        } from "./keys";
import { KEY_0        } from "./keys";
import { KEY_MINUS    } from "./keys";
import { KEY_Q        } from "./keys";
import { KEY_W        } from "./keys";
import { KEY_E        } from "./keys";
import { KEY_R        } from "./keys";
import { KEY_T        } from "./keys";
import { KEY_Y        } from "./keys";
import { KEY_U        } from "./keys";
import { KEY_I        } from "./keys";
import { KEY_O        } from "./keys";
import { KEY_P        } from "./keys";
import { KEY_RETURN   } from "./keys";
import { KEY_CTRL     } from "./keys";
import { KEY_A        } from "./keys";
import { KEY_S        } from "./keys";
import { KEY_D        } from "./keys";
import { KEY_F        } from "./keys";
import { KEY_G        } from "./keys";
import { KEY_H        } from "./keys";
import { KEY_J        } from "./keys";
import { KEY_K        } from "./keys";
import { KEY_L        } from "./keys";
import { KEY_SEMICOLON} from "./keys";
import { KEY_COLON    } from "./keys";
import { KEY_SHIFT    } from "./keys";
import { KEY_Z        } from "./keys";
import { KEY_X        } from "./keys";
import { KEY_C        } from "./keys";
import { KEY_V        } from "./keys";
import { KEY_B        } from "./keys";
import { KEY_N        } from "./keys";
import { KEY_M        } from "./keys";
import { KEY_COMMA    } from "./keys";
import { KEY_DOT      } from "./keys";
import { KEY_SPACE    } from "./keys";

interface Ekey {
   ctrlKey: boolean;
   altKey: boolean;
   shiftKey: boolean;
}

// maps browser keys into laser 310 keys
export function pckey_to_hardware_keys_ITA(code: string, key: string, e: Ekey) {

   let hardware_keys = [];

   if(e.ctrlKey || e.altKey) hardware_keys.push( KEY_CTRL );

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

   if(e.shiftKey)
   {
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

   if(code === "Space")        hardware_keys.push( KEY_SPACE  );
   if(code === "Enter")        hardware_keys.push( KEY_RETURN  );
   if(code === "NumpadEnter")  hardware_keys.push( KEY_RETURN  );

   if(key === "\\")            hardware_keys.push( KEY_SHIFT, KEY_M  );
   if(key === "!")             hardware_keys.push( KEY_SHIFT, KEY_1  );
   if(key === '"')             hardware_keys.push( KEY_SHIFT, KEY_2  );
   if(key === "$")             hardware_keys.push( KEY_SHIFT, KEY_4  );
   if(key === "%")             hardware_keys.push( KEY_SHIFT, KEY_5  );
   if(key === "&")             hardware_keys.push( KEY_SHIFT, KEY_6  );
   if(key === "/")             hardware_keys.push( KEY_SHIFT, KEY_K  );
   if(key === "(")             hardware_keys.push( KEY_SHIFT, KEY_8  );
   if(key === ")")             hardware_keys.push( KEY_SHIFT, KEY_9  );
   if(key === "=")             hardware_keys.push( KEY_SHIFT, KEY_MINUS );
   if(key === "'")             hardware_keys.push( KEY_SHIFT, KEY_7  );
   if(key === "?")             hardware_keys.push( KEY_SHIFT, KEY_L  );
   if(key === "-")             hardware_keys.push( KEY_MINUS         );
   if(key === "@")             hardware_keys.push( KEY_SHIFT, KEY_0  );
   if(key === "#")             hardware_keys.push( KEY_SHIFT, KEY_3  );
   if(key === "^")             hardware_keys.push( KEY_SHIFT, KEY_N  );
   if(key === "[")             hardware_keys.push( KEY_SHIFT, KEY_O  );
   if(key === "]")             hardware_keys.push( KEY_SHIFT, KEY_P  );
   if(key === "+")             hardware_keys.push( KEY_SHIFT, KEY_SEMICOLON );
   if(key === "*")             hardware_keys.push( KEY_SHIFT, KEY_COLON );
   if(key === "<")             hardware_keys.push( KEY_SHIFT, KEY_COMMA  );
   if(key === ">")             hardware_keys.push( KEY_SHIFT, KEY_DOT  );

   if(key === ",")             hardware_keys.push( KEY_COMMA  );
   if(key === ";")             hardware_keys.push( KEY_SEMICOLON  );
   if(key === ".")             hardware_keys.push( KEY_DOT  );
   if(key === ":")             hardware_keys.push( KEY_COLON  );

   if(code === "ArrowUp")      hardware_keys.push( KEY_CTRL, KEY_DOT );
   if(code === "ArrowDown")    hardware_keys.push( KEY_CTRL, KEY_SPACE );
   if(code === "ArrowLeft")    hardware_keys.push( KEY_CTRL, KEY_M );
   if(code === "ArrowRight")   hardware_keys.push( KEY_CTRL, KEY_COMMA );

   if(code === "Insert")       hardware_keys.push( KEY_CTRL, KEY_L );
   if(code === "Delete")       hardware_keys.push( KEY_CTRL, KEY_SEMICOLON );
   if(code === "Backspace")    hardware_keys.push( KEY_CTRL, KEY_M, KEY_CTRL, KEY_SEMICOLON );
   if(code === "Pause")        hardware_keys.push( KEY_CTRL, KEY_MINUS );

   if(code === "PageUp")       hardware_keys.push( KEY_CTRL, KEY_COLON );
   if(code === "PageDown")     hardware_keys.push( KEY_CTRL, KEY_RETURN );

   if(code === "Escape")       hardware_keys.push( KEY_CTRL, KEY_MINUS );

   return hardware_keys;
}

// used for PASTE text files as keyboard presses
export function ascii_to_hardware_keys(ascii: string, ctrl: boolean, shift: boolean) {

   let hardware_keys = [];
   let key = ascii.toUpperCase();

   if(ctrl)      hardware_keys.push( KEY_CTRL );
   if(shift)     hardware_keys.push( KEY_SHIFT);

   if(key === "1")         hardware_keys.push( KEY_1 );
   if(key === "2")         hardware_keys.push( KEY_2 );
   if(key === "3")         hardware_keys.push( KEY_3 );
   if(key === "4")         hardware_keys.push( KEY_4 );
   if(key === "5")         hardware_keys.push( KEY_5 );
   if(key === "6")         hardware_keys.push( KEY_6 );
   if(key === "7")         hardware_keys.push( KEY_7 );
   if(key === "8")         hardware_keys.push( KEY_8 );
   if(key === "9")         hardware_keys.push( KEY_9 );
   if(key === "0")         hardware_keys.push( KEY_0 );
   if(key === "-")         hardware_keys.push( KEY_MINUS );

   if(key === "!")         hardware_keys.push( KEY_SHIFT, KEY_1  );
   if(key === '"')         hardware_keys.push( KEY_SHIFT, KEY_2  );
   if(key === "#")         hardware_keys.push( KEY_SHIFT, KEY_3  );
   if(key === "$")         hardware_keys.push( KEY_SHIFT, KEY_4  );
   if(key === "%")         hardware_keys.push( KEY_SHIFT, KEY_5  );
   if(key === "&")         hardware_keys.push( KEY_SHIFT, KEY_6  );
   if(key === "'")         hardware_keys.push( KEY_SHIFT, KEY_7  );
   if(key === "(")         hardware_keys.push( KEY_SHIFT, KEY_8  );
   if(key === ")")         hardware_keys.push( KEY_SHIFT, KEY_9  );
   if(key === "@")         hardware_keys.push( KEY_SHIFT, KEY_0  );
   if(key === "=")         hardware_keys.push( KEY_SHIFT, KEY_MINUS );

   if(key === "Q")         hardware_keys.push( KEY_Q );
   if(key === "W")         hardware_keys.push( KEY_W );
   if(key === "E")         hardware_keys.push( KEY_E );
   if(key === "R")         hardware_keys.push( KEY_R );
   if(key === "T")         hardware_keys.push( KEY_T );
   if(key === "Y")         hardware_keys.push( KEY_Y );
   if(key === "U")         hardware_keys.push( KEY_U );
   if(key === "I")         hardware_keys.push( KEY_I );
   if(key === "O")         hardware_keys.push( KEY_O );
   if(key === "[")         hardware_keys.push( KEY_SHIFT, KEY_O  );
   if(key === "P")         hardware_keys.push( KEY_P );
   if(key === "]")         hardware_keys.push( KEY_SHIFT, KEY_P  );
   //if(key === "\x0d")      hardware_keys.push( KEY_RETURN  );   // CR is ignored
   if(key === "\x0a")      hardware_keys.push( KEY_RETURN  );

   if(key === "A")         hardware_keys.push( KEY_A );
   if(key === "S")         hardware_keys.push( KEY_S );
   if(key === "D")         hardware_keys.push( KEY_D );
   if(key === "F")         hardware_keys.push( KEY_F );
   if(key === "G")         hardware_keys.push( KEY_G );
   if(key === "H")         hardware_keys.push( KEY_H );
   if(key === "J")         hardware_keys.push( KEY_J );
   if(key === "K")         hardware_keys.push( KEY_K );
   if(key === "/")         hardware_keys.push( KEY_SHIFT, KEY_K );
   if(key === "L")         hardware_keys.push( KEY_L );
   if(key === "?")         hardware_keys.push( KEY_SHIFT, KEY_L );
   if(key === ";")         hardware_keys.push( KEY_SEMICOLON );
   if(key === "+")         hardware_keys.push( KEY_SHIFT, KEY_SEMICOLON );
   if(key === ":")         hardware_keys.push( KEY_COLON );
   if(key === "*")         hardware_keys.push( KEY_SHIFT, KEY_COLON );

   if(key === "Z")         hardware_keys.push( KEY_Z );
   if(key === "X")         hardware_keys.push( KEY_X );
   if(key === "C")         hardware_keys.push( KEY_C );
   if(key === "V")         hardware_keys.push( KEY_V );
   if(key === "B")         hardware_keys.push( KEY_B );
   if(key === "N")         hardware_keys.push( KEY_N );
   if(key === "^")         hardware_keys.push( KEY_SHIFT, KEY_N  );
   if(key === "M")         hardware_keys.push( KEY_M );
   if(key === "\\")        hardware_keys.push( KEY_SHIFT, KEY_M  );
   if(key === ",")         hardware_keys.push( KEY_COMMA  );
   if(key === ".")         hardware_keys.push( KEY_DOT  );
   if(key === "<")         hardware_keys.push( KEY_SHIFT, KEY_COMMA  );
   if(key === ">")         hardware_keys.push( KEY_SHIFT, KEY_DOT  );

   if(key === " ")         hardware_keys.push( KEY_SPACE  );

   if(key === "{CTRL}")       hardware_keys.push( KEY_CTRL);
   if(key === "{SHIFT}")      hardware_keys.push( KEY_SHIFT );
   if(key === "{UP}")         hardware_keys.push( KEY_CTRL, KEY_DOT );
   if(key === "{DOWN}")       hardware_keys.push( KEY_CTRL, KEY_SPACE );
   if(key === "{LEFT}")       hardware_keys.push( KEY_CTRL, KEY_M );
   if(key === "{RIGHT}")      hardware_keys.push( KEY_CTRL, KEY_COMMA );
   if(key === "{INSERT}")     hardware_keys.push( KEY_CTRL, KEY_L );
   if(key === "{RUBOUT}")     hardware_keys.push( KEY_CTRL, KEY_SEMICOLON );
   if(key === "{BREAK}")      hardware_keys.push( KEY_CTRL, KEY_MINUS );

   // these are not detectable by 0x7836 as normal key pressed
   // if(key === "{INVERSE}")    hardware_keys.push( KEY_CTRL, KEY_COLON );
   // if(key === "{FUNCTION}")   hardware_keys.push( KEY_CTRL, KEY_RETURN );

   return hardware_keys;
}
