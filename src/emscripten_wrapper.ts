import emscripten_module from "../emscripten_module";
import { paste } from "./paste";
import { lo, hi, hex } from "./bytes";
import { init_keyboard } from "./keys";
import { Audio } from "./audio";

import { droppedFiles } from "./browser";
import { Printer } from "./printer";

import { packvz, unpackvz, VZ_BASIC, VZ_BINARY } from "./vz";

let wasm_instance: any;

export async function load_wasm() {
   wasm_instance = await emscripten_module();
}

export function get_wasm_instance() {
   return wasm_instance;
}

export class Laser310 {
   get_z80_a: ()=>number;
   get_z80_f: ()=> number;
   get_z80_l: ()=> number;
   get_z80_h: ()=> number;
   get_z80_e: ()=> number;
   get_z80_d: ()=> number;
   get_z80_c: ()=> number;
   get_z80_b: ()=> number;
   get_z80_fa: ()=> number;
   get_z80_af: ()=> number;
   get_z80_hl: ()=> number;
   get_z80_de: ()=> number;
   get_z80_bc: ()=> number;
   get_z80_fa_: ()=> number;
   get_z80_af_: ()=> number;
   get_z80_hl_: ()=> number;
   get_z80_de_: ()=> number;
   get_z80_bc_: ()=> number;
   get_z80_sp: ()=> number;
   get_z80_iy: ()=> number;
   get_z80_ix: ()=> number;
   get_z80_wz: ()=> number;
   get_z80_pc: ()=> number;
   get_z80_ir: ()=> number;
   get_z80_i: ()=> number;
   get_z80_r: ()=> number;
   get_z80_im: ()=> number;
   get_z80_iff1: ()=> number;
   get_z80_iff2: ()=> number;
   get_z80_ei_pending: ()=> number;

   set_z80_a: (n: number)=>void;
   set_z80_f: (n: number)=>void;
   set_z80_l: (n: number)=>void;
   set_z80_h: (n: number)=>void;
   set_z80_e: (n: number)=>void;
   set_z80_d: (n: number)=>void;
   set_z80_c: (n: number)=>void;
   set_z80_b: (n: number)=>void;
   set_z80_af: (n: number)=>void;
   set_z80_fa: (n: number)=>void;
   set_z80_hl: (n: number)=>void;
   set_z80_de: (n: number)=>void;
   set_z80_bc: (n: number)=>void;
   set_z80_fa_: (n: number)=>void;
   set_z80_af_: (n: number)=>void;
   set_z80_hl_: (n: number)=>void;
   set_z80_de_: (n: number)=>void;
   set_z80_bc_: (n: number)=>void;
   set_z80_sp: (n: number)=>void;
   set_z80_iy: (n: number)=>void;
   set_z80_ix: (n: number)=>void;
   set_z80_wz: (n: number)=>void;
   set_z80_pc: (n: number)=>void;
   set_z80_ir: (n: number)=>void;
   set_z80_i: (n: number)=>void;
   set_z80_r: (n: number)=>void;
   set_z80_im: (n: number)=>void;
   set_z80_iff1: (n: number)=>void;
   set_z80_iff2: (n: number)=>void;
   set_z80_ei_pending: (n: number)=>void;

   cpu_reset: ()=>void;
   mem_read: (n: number)=>number;
   mem_write: (n: number, v:number)=>void;
   rom_load: (addr: number, data_byte: number )=>void;
   io_read:(n: number)=>number;
   io_write: (n: number, v:number)=>void;

   sys_set_debug: (v: boolean)=>void;
   sys_init: ()=>void;
   sys_reset: ()=>void;
   sys_ticks: (n: number)=> number;

   sys_total_cycles: ()=>number;
   sys_snow_effect: (v: boolean)=>void;

   keyboard_reset: ()=>void;
   keyboard_press: (a: number, b:number)=>void;
   keyboard_release: (a: number, b:number)=>void;

   sys_tape_init_load: (a: number, b:number)=>void;
   sys_tape_load_data: (a: number, b:number)=>void;
   sys_tape_play: ()=>void;
   sys_tape_record: ()=>void;
   sys_tape_stop: ()=>void;

   // joystick
   sys_joystick: (a: number, b:number)=>void;
   sys_set_joystick_connected: (v: boolean)=>void;
   sys_get_joystick_connected: ()=>boolean;

   paste(text: string) {
      paste(this, text);
   }

   BASTXT: number = 0;       // points to basic free area (start of program)
   BASEND: number = 0;       // points to end of the basic program
   CRSR_STATE: number = 0;   // cursor visibility state (for injecting keys)

   wasm_instance: any;

   key_row_col = new Array(75); // hardware keys row and col info

   audio = new Audio(4096);

   stopped: boolean = true;

   printer = new Printer();

   constructor(wasm_instance: any) {

      this.wasm_instance = wasm_instance;

      this.get_z80_a          = wasm_instance.cwrap("get_z80_a", 'number');
      this.get_z80_f          = wasm_instance.cwrap("get_z80_f", 'number');
      this.get_z80_l          = wasm_instance.cwrap("get_z80_l", 'number');
      this.get_z80_h          = wasm_instance.cwrap("get_z80_h", 'number');
      this.get_z80_e          = wasm_instance.cwrap("get_z80_e", 'number');
      this.get_z80_d          = wasm_instance.cwrap("get_z80_d", 'number');
      this.get_z80_c          = wasm_instance.cwrap("get_z80_c", 'number');
      this.get_z80_b          = wasm_instance.cwrap("get_z80_b", 'number');
      this.get_z80_fa         = wasm_instance.cwrap("get_z80_fa", 'number');
      this.get_z80_af         = wasm_instance.cwrap("get_z80_af", 'number');
      this.get_z80_hl         = wasm_instance.cwrap("get_z80_hl", 'number');
      this.get_z80_de         = wasm_instance.cwrap("get_z80_de", 'number');
      this.get_z80_bc         = wasm_instance.cwrap("get_z80_bc", 'number');
      this.get_z80_fa_        = wasm_instance.cwrap("get_z80_fa_", 'number');
      this.get_z80_af_        = wasm_instance.cwrap("get_z80_af_", 'number');
      this.get_z80_hl_        = wasm_instance.cwrap("get_z80_hl_", 'number');
      this.get_z80_de_        = wasm_instance.cwrap("get_z80_de_", 'number');
      this.get_z80_bc_        = wasm_instance.cwrap("get_z80_bc_", 'number');
      this.get_z80_sp         = wasm_instance.cwrap("get_z80_sp", 'number');
      this.get_z80_iy         = wasm_instance.cwrap("get_z80_iy", 'number');
      this.get_z80_ix         = wasm_instance.cwrap("get_z80_ix", 'number');
      this.get_z80_wz         = wasm_instance.cwrap("get_z80_wz", 'number');
      this.get_z80_pc         = wasm_instance.cwrap("get_z80_pc", 'number');
      this.get_z80_ir         = wasm_instance.cwrap("get_z80_ir", 'number');
      this.get_z80_i          = wasm_instance.cwrap("get_z80_i", 'number');
      this.get_z80_r          = wasm_instance.cwrap("get_z80_r", 'number');
      this.get_z80_im         = wasm_instance.cwrap("get_z80_im", 'number');
      this.get_z80_iff1       = wasm_instance.cwrap("get_z80_iff1", 'number');
      this.get_z80_iff2       = wasm_instance.cwrap("get_z80_iff2", 'number');
      this.get_z80_ei_pending = wasm_instance.cwrap("get_z80_ei_pending", 'number');
      this.set_z80_a          = wasm_instance.cwrap("set_z80_a", null, ['number'])                     ;
      this.set_z80_f          = wasm_instance.cwrap("set_z80_f", null, ['number']);
      this.set_z80_l          = wasm_instance.cwrap("set_z80_l", null, ['number']);
      this.set_z80_h          = wasm_instance.cwrap("set_z80_h", null, ['number']);
      this.set_z80_e          = wasm_instance.cwrap("set_z80_e", null, ['number']);
      this.set_z80_d          = wasm_instance.cwrap("set_z80_d", null, ['number']);
      this.set_z80_c          = wasm_instance.cwrap("set_z80_c", null, ['number']);
      this.set_z80_b          = wasm_instance.cwrap("set_z80_b", null, ['number']);
      this.set_z80_af         = wasm_instance.cwrap("set_z80_af", null, ['number']);
      this.set_z80_fa         = wasm_instance.cwrap("set_z80_fa", null, ['number']);
      this.set_z80_hl         = wasm_instance.cwrap("set_z80_hl", null, ['number']);
      this.set_z80_de         = wasm_instance.cwrap("set_z80_de", null, ['number']);
      this.set_z80_bc         = wasm_instance.cwrap("set_z80_bc", null, ['number']);
      this.set_z80_fa_        = wasm_instance.cwrap("set_z80_fa_", null, ['number']);
      this.set_z80_af_        = wasm_instance.cwrap("set_z80_af_", null, ['number']);
      this.set_z80_hl_        = wasm_instance.cwrap("set_z80_hl_", null, ['number']);
      this.set_z80_de_        = wasm_instance.cwrap("set_z80_de_", null, ['number']);
      this.set_z80_bc_        = wasm_instance.cwrap("set_z80_bc_", null, ['number']);
      this.set_z80_sp         = wasm_instance.cwrap("set_z80_sp", null, ['number']);
      this.set_z80_iy         = wasm_instance.cwrap("set_z80_iy", null, ['number']);
      this.set_z80_ix         = wasm_instance.cwrap("set_z80_ix", null, ['number']);
      this.set_z80_wz         = wasm_instance.cwrap("set_z80_wz", null, ['number']);
      this.set_z80_pc         = wasm_instance.cwrap("set_z80_pc", null, ['number']);
      this.set_z80_ir         = wasm_instance.cwrap("set_z80_ir", null, ['number']);
      this.set_z80_i          = wasm_instance.cwrap("set_z80_i", null, ['number']);
      this.set_z80_r          = wasm_instance.cwrap("set_z80_r", null, ['number']);
      this.set_z80_im         = wasm_instance.cwrap("set_z80_im", null, ['number']);
      this.set_z80_iff1       = wasm_instance.cwrap("set_z80_iff1", null, ['number']);
      this.set_z80_iff2       = wasm_instance.cwrap("set_z80_iff2", null, ['number']);
      this.set_z80_ei_pending = wasm_instance.cwrap("set_z80_ei_pending", null, ['number']);

      this.cpu_reset           = wasm_instance.cwrap("cpu_reset", null);

      this.mem_read           = wasm_instance.cwrap("mem_read", 'number', ['number']);
      this.mem_write          = wasm_instance.cwrap("mem_write", null, ['number', 'number']);
      this.rom_load           = wasm_instance.cwrap("rom_load", null, ['number', 'number']);

      this.io_read            = wasm_instance.cwrap("io_read", 'number', ['number']);
      this.io_write           = wasm_instance.cwrap("io_write", null, ['number', 'number']);

      this.sys_set_debug    = wasm_instance.cwrap("sys_set_debug", null, ['bool']);
      this.sys_init         = wasm_instance.cwrap("sys_init", ['number']);
      this.sys_reset        = wasm_instance.cwrap("sys_reset", null);
      this.sys_ticks        = wasm_instance.cwrap("sys_ticks", 'number', ['number']);

      this.sys_total_cycles = wasm_instance.cwrap("sys_total_cycles", ['number']);
      this.sys_snow_effect  = wasm_instance.cwrap("sys_snow_effect", null, ['bool']);

      this.keyboard_reset     = wasm_instance.cwrap("sys_keyboard_reset"  , null);
      this.keyboard_press     = wasm_instance.cwrap("sys_keyboard_press"  , null, ['number', 'number'] );
      this.keyboard_release   = wasm_instance.cwrap("sys_keyboard_release", null, ['number', 'number'] );

      this.sys_tape_init_load = wasm_instance.cwrap("sys_tape_init_load", null, [ 'number', 'number'] );
      this.sys_tape_load_data = wasm_instance.cwrap("sys_tape_load_data", null, [ 'number', 'number'] );
      this.sys_tape_play      = wasm_instance.cwrap("sys_tape_play", null, [ 'number', 'number'] );
      this.sys_tape_record    = wasm_instance.cwrap("sys_tape_record", null );
      this.sys_tape_stop      = wasm_instance.cwrap("sys_tape_stop", null );

      // joystick
      this.sys_joystick               = wasm_instance.cwrap("sys_joystick", null, [ 'number', 'number'] );
      this.sys_set_joystick_connected = wasm_instance.cwrap("sys_set_joystick_connected", null, [ 'bool'] );
      this.sys_get_joystick_connected = wasm_instance.cwrap("sys_get_joystick_connected", 'bool');

      init_keyboard(this);      
   }

   mem_read_word(address: number) {
      const lo = this.mem_read(address + 0);
      const hi = this.mem_read(address + 1);
      return lo+hi*256;
   }

   mem_write_word(address: number, word: number) {
      this.mem_write(address + 0, lo(word));
      this.mem_write(address + 1, hi(word));
   }

   USR(address: number) {
      this.mem_write_word(30862, address);
   }

   resetROM(firmware: number[]|Uint8Array) {
      firmware.forEach((v,i)=>this.rom_load(i,v));
   }

   keyboardReset() {
      this.keyboard_reset();
   }
   
   keyPress(hardware_key: number) {
      const { row, col } = this.key_row_col[hardware_key];
      this.keyboard_press(row,col);
   }
   
   keyRelease(hardware_key: number) {
      const { row, col } = this.key_row_col[hardware_key];
      this.keyboard_release(row,col);
   }
   
   dumpPointers() {
      console.log(`
      +------------------------+ <-  (0x${hex(this.BASEND,4)}) ${hex(this.mem_read_word(this.BASEND),4)}
      |     BASIC program      |
      +------------------------+ <- TXTTAB (0x${hex(this.BASTXT,4)}) ${hex(this.mem_read_word(this.BASTXT),4)}
      |    System variables    |
      +------------------------+ 0x8000
   `);
   }

   dumpStack() {
      /*
      const sp = cpu.getState().sp;

      for(let t=sp;t<=0xffff;t+=2) {
         const word = mem_read_word(t);
         console.log(`${hex(t,4)}: ${hex(word,4)}  (${word})`);
      }
      */
   }

   saveState() {
      /*
      const saveObject = {
         ram: Array.from(ram),
         cpu: cpu.getState()
      };

      window.localStorage.setItem(`laser310_emu_state`, JSON.stringify(saveObject));
      */
   }

   restoreState() {
      /*
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
      */
   }

   cpu_status() {
      /*
      const state = cpu.getState();
      return `A=${hex(state.a)} BC=${hex(state.b)}${hex(state.c)} DE=${hex(state.d)}${hex(state.e)} HL=${hex(state.h)}${hex(state.l)} IX=${hex(state.ix,4)} IY=${hex(state.iy,4)} SP=${hex(state.sp,4)} PC=${hex(state.pc,4)} S=${state.flags.S}, Z=${state.flags.Z}, Y=${state.flags.Y}, H=${state.flags.H}, X=${state.flags.X}, P=${state.flags.P}, N=${state.flags.N}, C=${state.flags.C}`;
      */
   }

   zap() {
      /*
      ram.forEach((e,i)=>ram[i]=0x00);
      let state = cpu.getState();
      state.halted = true;
      cpu.setState(state);
      */
   }

   power() {
      /*
      zap();
      setTimeout(()=>cpu.reset(), 200);
      */
   }

   droppedFiles = droppedFiles;

   setMachineType(machineType: any) {
      throw "not implemented";
   }

   connectJoystick(isChecked: boolean) {
      this.sys_set_joystick_connected(isChecked);
   }

   getJoystickConnected() {
      return this.sys_get_joystick_connected === undefined ? false : this.sys_get_joystick_connected();
   }

   setMemory(m: string) {
      throw "not implemented";
   }
   
   load_vz_bytes(vz_bytes: Uint8Array, runAfterLoad: boolean) {
      const VZ = unpackvz(vz_bytes);

      const isROM = VZ.start === 0 || VZ.start === 16384;
   
      // write data into memory (also writes in ROM for cartdriges and ROMs)
      for(let i=0; i<VZ.data.length; i++) {
         let addr = i+VZ.start;
         let data = VZ.data[i];
         if(isROM) this.rom_load(addr, data);
         else      this.mem_write(addr, data);
      }
   
      if(VZ.type == VZ_BASIC) {
         console.log(`loaded '${VZ.filename}' BASIC program of ${VZ.data.length} bytes from ${hex(VZ.start,4)}h to ${hex(VZ.start+VZ.data.length,4)}h`);
      }
      else if(VZ.type == VZ_BINARY) {
         console.log(`loaded '${VZ.filename}' binary file of ${VZ.data.length} bytes from ${hex(VZ.start,4)}h to ${hex(VZ.start+VZ.data.length,4)}h`);
      }
   
      // binary program
      if(VZ.type == VZ_BINARY) {
         if(runAfterLoad) {
            if(!isROM) {
               // normal binary file
               this.USR(VZ.start); // set USR(0) address;
               this.paste("X=USR(X)\n");
            }
            else {
               // ROM or cartdrige
               this.cpu_reset();
            }
         }
      }
   
      // basic program
      if(VZ.type == VZ_BASIC) {
         // modify end of basic program pointer
         let end = VZ.start + VZ.data.length;
         if(VZ.start === this.mem_read_word(this.BASTXT)) this.mem_write_word(this.BASEND, end+1);
         if(runAfterLoad) {
            this.paste("RUN\n");
         }
      }
   }
}
