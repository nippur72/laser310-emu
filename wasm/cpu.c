#include <emscripten/emscripten.h>

#define CHIPS_IMPL

#include "chips/z80.h"

//void sio_cpu_found_RETI() { /*byte unused = (byte) EM_ASM_INT({ sio.cpu_found_RETI();  }, 0);*/ }

z80_t cpu;
z80_desc_t desc;

extern mc6847_t mc;

uint64_t tick(int num_ticks, uint64_t pins, void* user_data) {

   // MC6847_AG     => vdc_mode        graphics mode enable
   // MC6847_AS     => ?               semi-graphics mode enable
   // MC6847_INTEXT => 0               internal/external select
   // MC6847_INV    => ?               invert enable
   // MC6847_GM0    => 0               graphics mode select 0
   // MC6847_GM1    => 1               graphics mode select 1
   // MC6847_GM2    => 0               graphics mode select 2
   // MC6847_CSS    => vdc_background  color select pin

   // tick the VDC
   uint64_t vdc_pins = MC6847_GM1;

   if(sys->vdc_mode      ) BITSET(vdc_pins,MC6847_AG);
   if(sys->vdc_background) BITSET(vdc_pins,MC6847_CSS);
   vdc_pins = mc6847_tick(&mc, vdc_pins);
   if(vdc_pins & MC6847_FS) BITSET(pins,Z80_INT);     // connect the /INT line to MC6847 FS pin

   // NMI connected to VCC on the Laser 310
   BITRESET(pins,Z80_NMI);

   if(pins & Z80_MREQ) {
      if(pins & Z80_RD) {
         uint8_t data = mem_read(Z80_GET_ADDR(pins));
         Z80_SET_DATA(pins, data);         
      }
      else if(pins & Z80_WR) {         
         mem_write(Z80_GET_ADDR(pins), Z80_GET_DATA(pins));
      }
   }
   else if(pins & Z80_IORQ) {
      if(pins & Z80_RD) {
         uint8_t data = io_read(Z80_GET_ADDR(pins));
         Z80_SET_DATA(pins, data);         
      }
      else if(pins & Z80_WR) {         
         io_write(Z80_GET_ADDR(pins), Z80_GET_DATA(pins));
      }
   }

   return pins;
}

EMSCRIPTEN_KEEPALIVE
void cpu_init() {
   desc.tick_cb = tick;
   desc.user_data = 0;
   z80_init(&cpu, &desc);
}

EMSCRIPTEN_KEEPALIVE
void cpu_reset() {
   z80_reset(&cpu);
}

EMSCRIPTEN_KEEPALIVE uint8_t get_z80_a()         { return z80_a(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_f()         { return z80_f(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_l()         { return z80_l(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_h()         { return z80_h(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_e()         { return z80_e(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_d()         { return z80_d(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_c()         { return z80_c(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_b()         { return z80_b(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_fa()       { return z80_fa(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_af()       { return z80_af(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_hl()       { return z80_hl(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_de()       { return z80_de(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_bc()       { return z80_bc(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_fa_()      { return z80_fa_(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_af_()      { return z80_af_(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_hl_()      { return z80_hl_(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_de_()      { return z80_de_(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_bc_()      { return z80_bc_(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_sp()       { return z80_sp(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_iy()       { return z80_iy(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_ix()       { return z80_ix(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_wz()       { return z80_wz(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_pc()       { return z80_pc(&cpu); }
EMSCRIPTEN_KEEPALIVE uint16_t get_z80_ir()       { return z80_ir(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_i()         { return z80_i(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_r()         { return z80_r(&cpu); }
EMSCRIPTEN_KEEPALIVE uint8_t get_z80_im()        { return z80_im(&cpu); }
EMSCRIPTEN_KEEPALIVE bool get_z80_iff1()         { return z80_iff1(&cpu); }
EMSCRIPTEN_KEEPALIVE bool get_z80_iff2()         { return z80_iff2(&cpu); }
EMSCRIPTEN_KEEPALIVE bool get_z80_ei_pending()   { return z80_ei_pending(&cpu); }

EMSCRIPTEN_KEEPALIVE void set_z80_a(uint8_t v)         { z80_set_a(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_f(uint8_t v)         { z80_set_f(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_l(uint8_t v)         { z80_set_l(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_h(uint8_t v)         { z80_set_h(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_e(uint8_t v)         { z80_set_e(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_d(uint8_t v)         { z80_set_d(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_c(uint8_t v)         { z80_set_c(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_b(uint8_t v)         { z80_set_b(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_af(uint16_t v)       { z80_set_af(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_fa(uint16_t v)       { z80_set_fa(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_hl(uint16_t v)       { z80_set_hl(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_de(uint16_t v)       { z80_set_de(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_bc(uint16_t v)       { z80_set_bc(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_fa_(uint16_t v)      { z80_set_fa_(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_af_(uint16_t v)      { z80_set_af_(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_hl_(uint16_t v)      { z80_set_hl_(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_de_(uint16_t v)      { z80_set_de_(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_bc_(uint16_t v)      { z80_set_bc_(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_sp(uint16_t v)       { z80_set_sp(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_iy(uint16_t v)       { z80_set_iy(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_ix(uint16_t v)       { z80_set_ix(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_wz(uint16_t v)       { z80_set_wz(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_pc(uint16_t v)       { z80_set_pc(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_ir(uint16_t v)       { z80_set_ir(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_i(uint8_t v)         { z80_set_i(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_r(uint8_t v)         { z80_set_r(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_im(uint8_t v)        { z80_set_im(&cpu, v); }
EMSCRIPTEN_KEEPALIVE void set_z80_iff1(bool b)         { z80_set_iff1(&cpu, b); }
EMSCRIPTEN_KEEPALIVE void set_z80_iff2(bool b)         { z80_set_iff2(&cpu, b); }
EMSCRIPTEN_KEEPALIVE void set_z80_ei_pending(bool b)   { z80_set_ei_pending(&cpu, b); }
