#include "utils.h"

#define CHIPS_IMPL

#include "chips/z80.h"

//void sio_cpu_found_RETI() { /*byte unused = (byte) EM_ASM_INT({ sio.cpu_found_RETI();  }, 0);*/ }

extern mc6847_t mc;

KEEP
void cpu_reset() {
   z80_reset(&sys->cpu);
}

KEEP uint8_t get_z80_a()         { return z80_a(&sys->cpu); }
KEEP uint8_t get_z80_f()         { return z80_f(&sys->cpu); }
KEEP uint8_t get_z80_l()         { return z80_l(&sys->cpu); }
KEEP uint8_t get_z80_h()         { return z80_h(&sys->cpu); }
KEEP uint8_t get_z80_e()         { return z80_e(&sys->cpu); }
KEEP uint8_t get_z80_d()         { return z80_d(&sys->cpu); }
KEEP uint8_t get_z80_c()         { return z80_c(&sys->cpu); }
KEEP uint8_t get_z80_b()         { return z80_b(&sys->cpu); }
KEEP uint16_t get_z80_fa()       { return z80_fa(&sys->cpu); }
KEEP uint16_t get_z80_af()       { return z80_af(&sys->cpu); }
KEEP uint16_t get_z80_hl()       { return z80_hl(&sys->cpu); }
KEEP uint16_t get_z80_de()       { return z80_de(&sys->cpu); }
KEEP uint16_t get_z80_bc()       { return z80_bc(&sys->cpu); }
KEEP uint16_t get_z80_fa_()      { return z80_fa_(&sys->cpu); }
KEEP uint16_t get_z80_af_()      { return z80_af_(&sys->cpu); }
KEEP uint16_t get_z80_hl_()      { return z80_hl_(&sys->cpu); }
KEEP uint16_t get_z80_de_()      { return z80_de_(&sys->cpu); }
KEEP uint16_t get_z80_bc_()      { return z80_bc_(&sys->cpu); }
KEEP uint16_t get_z80_sp()       { return z80_sp(&sys->cpu); }
KEEP uint16_t get_z80_iy()       { return z80_iy(&sys->cpu); }
KEEP uint16_t get_z80_ix()       { return z80_ix(&sys->cpu); }
KEEP uint16_t get_z80_wz()       { return z80_wz(&sys->cpu); }
KEEP uint16_t get_z80_pc()       { return z80_pc(&sys->cpu); }
KEEP uint16_t get_z80_ir()       { return z80_ir(&sys->cpu); }
KEEP uint8_t get_z80_i()         { return z80_i(&sys->cpu); }
KEEP uint8_t get_z80_r()         { return z80_r(&sys->cpu); }
KEEP uint8_t get_z80_im()        { return z80_im(&sys->cpu); }
KEEP bool get_z80_iff1()         { return z80_iff1(&sys->cpu); }
KEEP bool get_z80_iff2()         { return z80_iff2(&sys->cpu); }
KEEP bool get_z80_ei_pending()   { return z80_ei_pending(&sys->cpu); }

KEEP void set_z80_a(uint8_t v)         { z80_set_a(&sys->cpu, v); }
KEEP void set_z80_f(uint8_t v)         { z80_set_f(&sys->cpu, v); }
KEEP void set_z80_l(uint8_t v)         { z80_set_l(&sys->cpu, v); }
KEEP void set_z80_h(uint8_t v)         { z80_set_h(&sys->cpu, v); }
KEEP void set_z80_e(uint8_t v)         { z80_set_e(&sys->cpu, v); }
KEEP void set_z80_d(uint8_t v)         { z80_set_d(&sys->cpu, v); }
KEEP void set_z80_c(uint8_t v)         { z80_set_c(&sys->cpu, v); }
KEEP void set_z80_b(uint8_t v)         { z80_set_b(&sys->cpu, v); }
KEEP void set_z80_af(uint16_t v)       { z80_set_af(&sys->cpu, v); }
KEEP void set_z80_fa(uint16_t v)       { z80_set_fa(&sys->cpu, v); }
KEEP void set_z80_hl(uint16_t v)       { z80_set_hl(&sys->cpu, v); }
KEEP void set_z80_de(uint16_t v)       { z80_set_de(&sys->cpu, v); }
KEEP void set_z80_bc(uint16_t v)       { z80_set_bc(&sys->cpu, v); }
KEEP void set_z80_fa_(uint16_t v)      { z80_set_fa_(&sys->cpu, v); }
KEEP void set_z80_af_(uint16_t v)      { z80_set_af_(&sys->cpu, v); }
KEEP void set_z80_hl_(uint16_t v)      { z80_set_hl_(&sys->cpu, v); }
KEEP void set_z80_de_(uint16_t v)      { z80_set_de_(&sys->cpu, v); }
KEEP void set_z80_bc_(uint16_t v)      { z80_set_bc_(&sys->cpu, v); }
KEEP void set_z80_sp(uint16_t v)       { z80_set_sp(&sys->cpu, v); }
KEEP void set_z80_iy(uint16_t v)       { z80_set_iy(&sys->cpu, v); }
KEEP void set_z80_ix(uint16_t v)       { z80_set_ix(&sys->cpu, v); }
KEEP void set_z80_wz(uint16_t v)       { z80_set_wz(&sys->cpu, v); }
KEEP void set_z80_pc(uint16_t v)       { z80_set_pc(&sys->cpu, v); }
KEEP void set_z80_ir(uint16_t v)       { z80_set_ir(&sys->cpu, v); }
KEEP void set_z80_i(uint8_t v)         { z80_set_i(&sys->cpu, v); }
KEEP void set_z80_r(uint8_t v)         { z80_set_r(&sys->cpu, v); }
KEEP void set_z80_im(uint8_t v)        { z80_set_im(&sys->cpu, v); }
KEEP void set_z80_iff1(bool b)         { z80_set_iff1(&sys->cpu, b); }
KEEP void set_z80_iff2(bool b)         { z80_set_iff2(&sys->cpu, b); }
KEEP void set_z80_ei_pending(bool b)   { z80_set_ei_pending(&sys->cpu, b); }
