import { Laser310 } from "./emscripten_wrapper";
import { ascii_to_hardware_keys } from "./keyboard_IT";

interface PasteItem {
   ascii: string;
   ctrl: boolean;
   shift: boolean;
}

// parse a string of text where special characters are enclosed in {}
// e.g. {CTRL}, {SHIFT}, {INSERT}, {RUBOUT}, {BREAK}, {UP}, {DOWN}, {LEFT}, {RIGHT}

function parseText(text: string): PasteItem[] {

   const r = new RegExp(/{ctrl (?<ctrled>.)}|{shift (?<shifted>.)}|{(?<code>.*)}|(?<plain>(.|\r|\n))/g);

   // array containing the decoded text to be pasted
   const pasteBuffer: PasteItem[] = [];

   let match;
   while (match = r.exec(text)) {
      let {ctrled, shifted, code, plain} = match.groups as any;
           if(ctrled)  pasteBuffer.push({ascii: ctrled,      ctrl: true,  shift: false });
      else if(shifted) pasteBuffer.push({ascii: shifted,     ctrl: false, shift: true  });
      else if(code)    pasteBuffer.push({ascii: `{${code}}`, ctrl: false, shift: false });
      else if(plain)   pasteBuffer.push({ascii: plain,       ctrl: false, shift: false });
   }

   return pasteBuffer;
}

export function paste(laser310: Laser310, text: string) {

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

   const pasteBuffer = parseText(text);

   // check cursor is flashing   
   if(!laser310.isInImmediateMode()) {
      console.log(`didn't paste because not in immediate mode`);
      return;
   }

   do_async_paste();  // start pasting in async fashion to allow screen refreshes
}

function pasteChar(laser310: Laser310, c: string, ctrl: boolean, shift: boolean) {

   let hk = ascii_to_hardware_keys(c, ctrl, shift);

   if(hk.length == 0) return;

   // wait until laser detects no key pressed
   let i=0;
   while(!laser310.isKeyboardBufferEmpty()) {
      laser310.renderFrame();
      if(i++ == 10) {
         console.log("paste aborted: keyboard buffer never gets empty");
         return;
      }
   }

   // do key press
   hk.forEach(k=>laser310.keyPress(k));

   laser310.renderFrame();
   laser310.renderFrame();

   // wait until laser detects key press
   i=0;
   while(laser310.isKeyboardBufferEmpty()) {
      laser310.renderFrame();
      if(i++ == 10) {
         console.log("paste aborted: keyboard buffer always empty");
         return;
      }
   }  

   // release key
   hk.forEach(k=>laser310.keyRelease(k));   

   laser310.renderFrame();
   laser310.renderFrame();

   // wait until laser detects no key pressed
   i=0;
   while(!laser310.isKeyboardBufferEmpty()) {
      laser310.renderFrame();
      if(i++ == 10) {
         console.log("paste aborted: keyboard buffer never gets empty after key release");
         return;
      }
   }

   if(c === '\n') {
      laser310.renderFrame();
      laser310.renderFrame();
      laser310.renderFrame();
      laser310.renderFrame();
      laser310.renderFrame();
      laser310.renderFrame();
      laser310.renderFrame();
      laser310.renderFrame();
   }
}
