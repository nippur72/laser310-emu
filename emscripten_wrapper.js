
let wasm_instance;

let get_z80_a;
let get_z80_f;
let get_z80_l;
let get_z80_h;
let get_z80_e;
let get_z80_d;
let get_z80_c;
let get_z80_b;
let get_z80_fa;
let get_z80_af;
let get_z80_hl;
let get_z80_de;
let get_z80_bc;
let get_z80_fa_;
let get_z80_af_;
let get_z80_hl_;
let get_z80_de_;
let get_z80_bc_;
let get_z80_sp;
let get_z80_iy;
let get_z80_ix;
let get_z80_wz;
let get_z80_pc;
let get_z80_ir;
let get_z80_i;
let get_z80_r;
let get_z80_im;
let get_z80_iff1;
let get_z80_iff2;
let get_z80_ei_pending;
let set_z80_a;
let set_z80_f;
let set_z80_l;
let set_z80_h;
let set_z80_e;
let set_z80_d;
let set_z80_c;
let set_z80_b;
let set_z80_af;
let set_z80_fa;
let set_z80_hl;
let set_z80_de;
let set_z80_bc;
let set_z80_fa_;
let set_z80_af_;
let set_z80_hl_;
let set_z80_de_;
let set_z80_bc_;
let set_z80_sp;
let set_z80_iy;
let set_z80_ix;
let set_z80_wz;
let set_z80_pc;
let set_z80_ir;
let set_z80_i;
let set_z80_r;
let set_z80_im;
let set_z80_iff1;
let set_z80_iff2;
let set_z80_ei_pending;

let cpu_reset;

let mem_read;
let mem_write;
let rom_load;

let io_read;
let io_write;

let sys_set_debug;
let sys_init;
let sys_reset;

let keyboard_reset;
let keyboard_press;
let keyboard_release;

let sys_tape_init_load;
let sys_tape_load_data;
let sys_tape_playback;

let sys_joystick;

let sys_total_cycles;

function load_wasm(ready_cb) {

   // emscripten_module.js exports "emscripten_module" globally

   let instance = emscripten_module({ wasmBinary: emscripten_wasm_binary, onRuntimeInitialized: ()=>{
      // makes C exported functions available globally

      get_z80_a          = instance.cwrap("get_z80_a", 'number');
      get_z80_f          = instance.cwrap("get_z80_f", 'number');
      get_z80_l          = instance.cwrap("get_z80_l", 'number');
      get_z80_h          = instance.cwrap("get_z80_h", 'number');
      get_z80_e          = instance.cwrap("get_z80_e", 'number');
      get_z80_d          = instance.cwrap("get_z80_d", 'number');
      get_z80_c          = instance.cwrap("get_z80_c", 'number');
      get_z80_b          = instance.cwrap("get_z80_b", 'number');
      get_z80_fa         = instance.cwrap("get_z80_fa", 'number');
      get_z80_af         = instance.cwrap("get_z80_af", 'number');
      get_z80_hl         = instance.cwrap("get_z80_hl", 'number');
      get_z80_de         = instance.cwrap("get_z80_de", 'number');
      get_z80_bc         = instance.cwrap("get_z80_bc", 'number');
      get_z80_fa_        = instance.cwrap("get_z80_fa_", 'number');
      get_z80_af_        = instance.cwrap("get_z80_af_", 'number');
      get_z80_hl_        = instance.cwrap("get_z80_hl_", 'number');
      get_z80_de_        = instance.cwrap("get_z80_de_", 'number');
      get_z80_bc_        = instance.cwrap("get_z80_bc_", 'number');
      get_z80_sp         = instance.cwrap("get_z80_sp", 'number');
      get_z80_iy         = instance.cwrap("get_z80_iy", 'number');
      get_z80_ix         = instance.cwrap("get_z80_ix", 'number');
      get_z80_wz         = instance.cwrap("get_z80_wz", 'number');
      get_z80_pc         = instance.cwrap("get_z80_pc", 'number');
      get_z80_ir         = instance.cwrap("get_z80_ir", 'number');
      get_z80_i          = instance.cwrap("get_z80_i", 'number');
      get_z80_r          = instance.cwrap("get_z80_r", 'number');
      get_z80_im         = instance.cwrap("get_z80_im", 'number');
      get_z80_iff1       = instance.cwrap("get_z80_iff1", 'number');
      get_z80_iff2       = instance.cwrap("get_z80_iff2", 'number');
      get_z80_ei_pending = instance.cwrap("get_z80_ei_pending", 'number');
      set_z80_a          = instance.cwrap("set_z80_a", null, ['number'])                     ;
      set_z80_f          = instance.cwrap("set_z80_f", null, ['number']);
      set_z80_l          = instance.cwrap("set_z80_l", null, ['number']);
      set_z80_h          = instance.cwrap("set_z80_h", null, ['number']);
      set_z80_e          = instance.cwrap("set_z80_e", null, ['number']);
      set_z80_d          = instance.cwrap("set_z80_d", null, ['number']);
      set_z80_c          = instance.cwrap("set_z80_c", null, ['number']);
      set_z80_b          = instance.cwrap("set_z80_b", null, ['number']);
      set_z80_af         = instance.cwrap("set_z80_af", null, ['number']);
      set_z80_fa         = instance.cwrap("set_z80_fa", null, ['number']);
      set_z80_hl         = instance.cwrap("set_z80_hl", null, ['number']);
      set_z80_de         = instance.cwrap("set_z80_de", null, ['number']);
      set_z80_bc         = instance.cwrap("set_z80_bc", null, ['number']);
      set_z80_fa_        = instance.cwrap("set_z80_fa_", null, ['number']);
      set_z80_af_        = instance.cwrap("set_z80_af_", null, ['number']);
      set_z80_hl_        = instance.cwrap("set_z80_hl_", null, ['number']);
      set_z80_de_        = instance.cwrap("set_z80_de_", null, ['number']);
      set_z80_bc_        = instance.cwrap("set_z80_bc_", null, ['number']);
      set_z80_sp         = instance.cwrap("set_z80_sp", null, ['number']);
      set_z80_iy         = instance.cwrap("set_z80_iy", null, ['number']);
      set_z80_ix         = instance.cwrap("set_z80_ix", null, ['number']);
      set_z80_wz         = instance.cwrap("set_z80_wz", null, ['number']);
      set_z80_pc         = instance.cwrap("set_z80_pc", null, ['number']);
      set_z80_ir         = instance.cwrap("set_z80_ir", null, ['number']);
      set_z80_i          = instance.cwrap("set_z80_i", null, ['number']);
      set_z80_r          = instance.cwrap("set_z80_r", null, ['number']);
      set_z80_im         = instance.cwrap("set_z80_im", null, ['number']);
      set_z80_iff1       = instance.cwrap("set_z80_iff1", null, ['number']);
      set_z80_iff2       = instance.cwrap("set_z80_iff2", null, ['number']);
      set_z80_ei_pending = instance.cwrap("set_z80_ei_pending", null, ['number']);

      cpu_reset           = instance.cwrap("cpu_reset", null);

      mem_read           = instance.cwrap("mem_read", 'number', ['number']);
      mem_write          = instance.cwrap("mem_write", null, ['number', 'number']);
      rom_load           = instance.cwrap("rom_load", null, ['number', 'number']);

      io_read            = instance.cwrap("io_read", 'number', ['number']);
      io_write           = instance.cwrap("io_write", null, ['number', 'number']);

      sys_set_debug    = instance.cwrap("sys_set_debug", null, ['bool']);
      sys_init         = instance.cwrap("sys_init", ['number']);
      sys_reset        = instance.cwrap("sys_reset", null);
      sys_ticks        = instance.cwrap("sys_ticks", 'number', ['number']);

      sys_total_cycles = instance.cwrap("sys_total_cycles", ['number']);

      keyboard_reset     = instance.cwrap("sys_keyboard_reset"  , null);
      keyboard_press     = instance.cwrap("sys_keyboard_press"  , null, ['number', 'number'] );
      keyboard_release   = instance.cwrap("sys_keyboard_release", null, ['number', 'number'] );

      sys_tape_init_load = instance.cwrap("sys_tape_init_load", null, [ 'number', 'number'] );
      sys_tape_load_data = instance.cwrap("sys_tape_load_data", null, [ 'number', 'number'] );
      sys_tape_playback  = instance.cwrap("sys_tape_playback", null, [ 'number', 'number'] );

      sys_joystick       = instance.cwrap("sys_joystick", null, [ 'number', 'number'] );

      // export instance globally (not strictly required)
      wasm_instance = instance;

      // finished
      ready_cb();
   }});
}

