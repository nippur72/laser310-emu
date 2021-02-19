#include "laser310.h"

#include "keyboard.c"
#include "psg.c"
#include "mem.c"
#include "io.c"
#include "vdp.c"
#include "cpu.c"

bool debug = false;

void debugBefore() { byte unused = (byte) EM_ASM_INT({ if(debugBefore!== undefined) debugBefore(); }, 0); }
void debugAfter()  { byte unused = (byte) EM_ASM_INT({ if(debugAfter !== undefined) debugAfter();  }, 0); }

EMSCRIPTEN_KEEPALIVE
void laser310_set_debug(bool v) { debug = v; }


EMSCRIPTEN_KEEPALIVE
uint16_t laser310_tick() {
   static bool opdone;

   if(debug & opdone) {
      opdone = false;
      debugBefore();
   }

   uint16_t ticks = z80_exec(&cpu, 1);

   if(debug & z80_opdone(&cpu)) {
      debugAfter();
      opdone = true;
   }

   psg_ticks(ticks);

   // ticks the MC6847
   {
      uint64_t pins;
      /*
      #define MC6847_FS  int (1ULL<<40)      // field sync
      #define MC6847_HS  hs (1ULL<<41)      // horizontal sync
      #define MC6847_RP  ? (1ULL<<42)      // row preset (not emulated)

      #define MC6847_AG    35   (1ULL<<43)      // graphics mode enable
      #define MC6847_AS    D7   (1ULL<<44)      // semi-graphics mode enable
      #define MC6847_INTEXT 0  (1ULL<<45)      // internal/external select
      #define MC6847_INV   D6   (1ULL<<46)      // invert enable
      #define MC6847_GM0   0   (1ULL<<47)      // graphics mode select 0
      #define MC6847_GM1   1   (1ULL<<48)      // graphics mode select 1
      #define MC6847_GM2   0   (1ULL<<49)      // graphics mode select 2
      #define MC6847_CSS   39   (1ULL<<50)      // color select pin
      */

      mc6847_tick(&mc, pins);
   }

   return ticks;
}

EMSCRIPTEN_KEEPALIVE
uint16_t laser310_ticks(int ncycles, float cyclesPerLine) {

   int elapsed = 0;
   static float line_ticks = 0;

   while(elapsed < ncycles) {
      int cpu_ticks = laser310_tick();
      elapsed += cpu_ticks;
      line_ticks += cpu_ticks;

      /*
      if(line_ticks >= cyclesPerLine) {
         line_ticks-=cyclesPerLine;
         tms9928_drawline(&vdp);
      }
      */
   }
   return elapsed;
}

EMSCRIPTEN_KEEPALIVE
void laser310_init() {
   mc_init();
}

EMSCRIPTEN_KEEPALIVE
void laser310_reset() {

}

