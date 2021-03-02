"use strict";

// TODO implement disk and printer emulation
// TODO numpad or cursor keys joystick
// TODO investigate speaker_A and speaker_B
// TODO memory model 16K, 32K
// TODO use only .VZ files
// TODO fix BASTXT, BASEND, CRSR_STATE
// TODO fix cpuspeed & other
// TODO check on the real HW port number return
// TODO check if audio and cpu have the same speed

let BASTXT;      // points to basic free area (start of program)
let BASEND;      // points to end of the basic program
let CRSR_STATE;  // cursor visibility state (for injecting keys)

let cpu;

/******************/

let cpuSpeed = 3546900;  // 3546900 VZ300, 3579500 VZ200
let vdcSpeed = 3546900;
let frameRate = vdcSpeed/(320*262);     // ~60 Hz
let frameDuration = 1000/frameRate;     // duration of 1 frame in msec
let cyclesPerLine = cpuSpeed / vdcSpeed * 320;

let stopped = false; // allows to stop/resume the emulation

let frames = 0;
let averageFrameTime = 0;
let averageLoad = 0;

let cycle = 0;
let total_cycles = 0;

let options = {
   load: undefined,
   restore: false
};

let audio = new Audio(4096);

let storage = new BrowserStorage("laser310");

function renderFrame() {
   total_cycles += sys_ticks(262 * 2 * cyclesPerLine);
}

function poll_keyboard() {
   if(keyboard_buffer.length > 0) {
      let key_event = keyboard_buffer[0];
      keyboard_buffer = keyboard_buffer.slice(1);

      keyboardReset();
      if(key_event.type === "press") {
         key_event.hardware_keys.forEach((k) => keyPress(k));
      }
   }
}

let end_of_frame_hook = undefined;

let last_timestamp = 0;
let frame_skips = 0;
function oneFrame(timestamp) {
   const stamp = timestamp == undefined ? last_timestamp : timestamp;
   const msec = stamp - last_timestamp;
   let cycles = cpuSpeed * msec / 1000;
   last_timestamp = stamp;

   // put a limit on the maximum frame time
   let skip = false;
   if(msec > frameRate*2) {
      cycles = cpuSpeed * (frameRate*2 / 1000);
      skip = true;
      frame_skips++;
   }

   poll_keyboard();
   updateGamePad();
   sys_joystick(joy0, joy1);

   let starttime = performance.now();
   total_cycles += sys_ticks(cycles, cyclesPerLine);
   let endtime = performance.now();
   let elapsed = endtime - starttime;
   let load = (elapsed / msec) * 100;

   if(!skip && msec != 0) {
      averageFrameTime = averageFrameTime * 0.992 + msec * 0.008;
      averageLoad = averageLoad * 0.992 + load * 0.008;
   }

   if(!stopped) requestAnimationFrame(oneFrame);
}

function main() {

   parseQueryStringCommands();

   // loads the eprom
   {
      let firmware;
      if(options.rom == undefined) options.rom = "v21";
      if(options.rom == "v20") { firmware = vzrom20; BASTXT=0x78A4; BASEND=0x78F9; CRSR_STATE=0x52C7; }
      if(options.rom == "v21") { firmware = vzrom21; BASTXT=0x78A4; BASEND=0x78F9; CRSR_STATE=0x52F7; }
      firmware.forEach((v,i)=>rom_load(i,v));
   }

   cpu =
   {
      reset: cpu_reset,
      getState: ()=>{
         return {
            pc: get_z80_pc()
         }
      }
   };

   cpu.reset();

   sys_init();
   sys_reset();

   audio.start();

   // rom autoload
   if(autoload !== undefined) {
      autoload.forEach((e,i)=>rom_load(i,e));
   }

   // starts drawing frames
   oneFrame();

   /*
   // autoload program and run it
   if(autoload !== undefined) {
      //zap();
      //cpu.reset();

      setTimeout(()=>{
         loadBytes(autoload);
         pasteLine("RUN\r\n");
      }, 200);
   }
   */
}

// FORMULA: one buffer arrives every t cpu cycles
// T = (3686400 / 2) / (48000 / BUFFER_SIZE)
// in msec: t = BUFFER_SIZE / 48000 = 85.3

function ay38910_audio_buf_ready(ptr, size) {
   if(!audio.playing) return;
   let buffer = get_wasm_float32_array(ptr, size);
   audio.playBuffer(buffer);
}

