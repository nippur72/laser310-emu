import { Laser310 } from "./emscripten_wrapper";
import { renderFrame } from "./emulator";
import { ascii_to_hardware_keys } from "./keyboard_IT";

export function paste(laser310: Laser310, text: string) {
   // regex that parses {ctrl} and {shift} codes
   let r = new RegExp(/{ctrl (?<ctrled>.)}|{shift (?<shifted>.)}|{(?<code>.*)}|(?<plain>(.|\r|\n))/g);

   // array containing the decoded text to be pasted
   let pasteBuffer: any[] = [];

   let match;
   while (match = r.exec(text)) {
      let {ctrled, shifted, code, plain} = match.groups as any;
           if(ctrled)  pasteBuffer.push({ascii: ctrled,      ctrl: true,  shift: false });
      else if(shifted) pasteBuffer.push({ascii: shifted,     ctrl: false, shift: true  });
      else if(code)    pasteBuffer.push({ascii: `{${code}}`, ctrl: false, shift: false });
      else if(plain)   pasteBuffer.push({ascii: plain,       ctrl: false, shift: false });
   }

   function do_async_paste() {
      if(pasteBuffer.length == 0) return;

      // get first character on the paste buffer
      let item = pasteBuffer.shift();
      if(item === undefined) return;
      let {ascii,ctrl,shift} = item;
      pasteChar(laser310, ascii, ctrl, shift);

      // force refresh of the screen on every RETURN
      if(ascii == '\n' ) setTimeout(do_async_paste, 0);
      else do_async_paste();
   }

   // start pasting in async fashion to allow screen refreshes
   do_async_paste();
}

function pasteChar(laser310: Laser310, c: string, ctrl: boolean, shift: boolean) {
   let KEYBUF = 0x7836;
   let hk = ascii_to_hardware_keys(c, ctrl, shift);

   if(hk.length == 0) return;

   // wait until laser detects no key pressed
   let i=0;
   while(laser310.mem_read(KEYBUF)!=0) {
      renderFrame();
      if(i++ == 10) {
         console.log("failed 1");
         return;
      }
   }

   // do key press
   hk.forEach((k:any)=>laser310.keyPress(k));

   // wait until laser detects key press
   i=0;
   while(laser310.mem_read(KEYBUF)==0) {
      renderFrame();
      if(i++ == 10) {
         console.log("failed 2");
         return;
      }
   }

   // release key
   hk.forEach((k:any)=>laser310.keyRelease(k));

   // wait until laser detects no key pressed
   i=0;
   while(laser310.mem_read(KEYBUF)!=0) {
      renderFrame();
      if(i++ == 10) {
         console.log("failed 3");
         return;
      }
   }
}
