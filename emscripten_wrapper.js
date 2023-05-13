import emscripten_module from "./emscripten_module.js";

let wasm_instance;

export async function load_wasm() {
   wasm_instance = await emscripten_module();
}

export function get_wasm_instance() {
   return wasm_instance;
}

export class Laser310 {
   constructor(wasm_instance) {
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
   }
}