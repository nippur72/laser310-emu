/**** utility functions ****/

function cpu_status() {
   const state = cpu.getState();
   return `A=${hex(state.a)} BC=${hex(state.b)}${hex(state.c)} DE=${hex(state.d)}${hex(state.e)} HL=${hex(state.h)}${hex(state.l)} IX=${hex(state.ix,4)} IY=${hex(state.iy,4)} SP=${hex(state.sp,4)} PC=${hex(state.pc,4)} S=${state.flags.S}, Z=${state.flags.Z}, Y=${state.flags.Y}, H=${state.flags.H}, X=${state.flags.X}, P=${state.flags.P}, N=${state.flags.N}, C=${state.flags.C}`;   
}

async function crun(filename) {
   await load(filename);
   //await print_string("\nrun:\n");
   paste("RUN\n");
}

export function paste(text) {
   // regex that parses {ctrl} and {shift} codes
   let r = new RegExp(/{ctrl (?<ctrled>.)}|{shift (?<shifted>.)}|{(?<code>.*)}|(?<plain>(.|\r|\n))/g);

   // array containing the decoded text to be pasted
   let pasteBuffer = [];

   let match;
   while (match = r.exec(text)) {
      let {ctrled, shifted, code, plain} = match.groups;
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
      pasteChar(ascii, ctrl, shift);

      // force refresh of the screen on every RETURN
      if(ascii == '\n' ) setTimeout(do_async_paste, 0);
      else do_async_paste();
   }

   // start pasting in async fashion to allow screen refreshes
   do_async_paste();
}

function pasteChar(c, ctrl, shift) {
   let KEYBUF = 0x7836;
   let hk = ascii_to_hardware_keys(c, ctrl, shift);

   if(hk.length == 0) return;

   // wait until laser detects no key pressed
   let i=0;
   while(mem_read(KEYBUF)!=0) {
      renderFrame();
      if(i++ == 10) {
         console.log("failed 1");
         return;
      }
   }

   // do key press
   hk.forEach(k=>keyPress(k));

   // wait until laser detects key press
   i=0;
   while(mem_read(KEYBUF)==0) {
      renderFrame();
      if(i++ == 10) {
         console.log("failed 2");
         return;
      }
   }

   // release key
   hk.forEach(k=>keyRelease(k));

   // wait until laser detects no key pressed
   i=0;
   while(mem_read(KEYBUF)!=0) {
      renderFrame();
      if(i++ == 10) {
         console.log("failed 3");
         return;
      }
   }
}

export function resetROM(firmware) {
   firmware.forEach((v,i)=>laser310.rom_load(i,v));
}

function zap() {
   ram.forEach((e,i)=>ram[i]=0x00);
   let state = cpu.getState();
   state.halted = true;
   cpu.setState(state);
}

function power() {      
   zap();
   setTimeout(()=>cpu.reset(), 200);
}

export function saveState() {
   const saveObject = {
      ram: Array.from(ram),
      cpu: cpu.getState()  
   };   

   window.localStorage.setItem(`laser310_emu_state`, JSON.stringify(saveObject));
}

export function restoreState() {   
   try
   {
      let s = window.localStorage.getItem(`laser310_emu_state`);
      if(s === null) return;   
      s = JSON.parse(s);            
      copyArray( s.ram, ram);
      cpu.setState(s.cpu);
   }
   catch(error)
   {

   }
}

function dumpPointers() {
   console.log(`
   +------------------------+ <-  (0x${hex(BASEND,4)}) ${hex(mem_read_word(BASEND),4)}
   |     BASIC program      |
   +------------------------+ <- TXTTAB (0x${hex(BASTXT,4)}) ${hex(mem_read_word(BASTXT),4)}
   |    System variables    |
   +------------------------+ 0x8000
`);
}

function topMem() {
   return mem_read_word(0x78b1);
}


function dumpStack() {
   const sp = cpu.getState().sp;

   for(let t=sp;t<=0xffff;t+=2) {
      const word = mem_read_word(t);
      console.log(`${hex(t,4)}: ${hex(word,4)}  (${word})`);
   }
}

function make_lm(start, end, rows) {
   let s;
   s = `10 FOR T=&H${hex(start,4)} TO &H${hex(end,4)}\n`;
   s+= `20 READ B:POKE T,B\n`;
   s+= `30 NEXT\n`;
   s+= `40 SYS &H${hex(start,4)}\n`;
   s+= `50 END\n`;
   let nline = 1000;
   if(rows==undefined) rows=8;
   for(let r=start;r<=end;r+=rows) {
      s+= `${nline} DATA `;
      for(let c=0;c<rows && (r+c)<=end;c++) {
         const byte = mem_read(r+c);
         s+= `${byte}`;
         if(c!=rows-1 && (r+c)!=end) s+=",";
      }
      s+="\n";
      nline += 10;
   }
   console.log(s);
}

let counter = 0;
let counter_avg = 0;

function start_counter() {
   counter = new Date().valueOf();
}

function stop_counter() {
   let now = new Date().valueOf();
   let cnt = counter;
   if(cnt === 0) cnt = now
   let elapsed = now - cnt;   
   counter_avg = 0.9 * counter_avg + 0.1 * elapsed;
   return counter_avg;
}

let LED = 0;
function led_read() {
   return LED;
}

function led_write(value) {
   LED = value;
}

function USR(address) {
   mem_write_word(30862, address);
}