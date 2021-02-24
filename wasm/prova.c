#include "laser310.h"
#include "buzzer.h"

#define CHIPS_IMPL

#include "keyboard.c"
#include "mem.c"
#include "io.c"
#include "vdp.c"
#include "cpu.c"

bool debug = false;

void debugBefore() { byte unused = (byte) EM_ASM_INT({ if(debugBefore!== undefined) debugBefore(); }, 0); }
void debugAfter()  { byte unused = (byte) EM_ASM_INT({ if(debugAfter !== undefined) debugAfter();  }, 0); }

EMSCRIPTEN_KEEPALIVE
void laser310_set_debug(bool v) { debug = v; }

buzzer_t buzzer;

byte cassette_in;

// I/O latch
byte speaker_B;        // bit 5
byte vdc_background;   // bit 4
byte vdc_mode;         // bit 3
byte cassette_out;     // bit 2
byte cassette_out_MSB; // bit 1
byte speaker_A;        // bit 0

EMSCRIPTEN_KEEPALIVE
int laser310_tick() {
   static bool opdone;

   if(debug & opdone) {
      opdone = false;
      debugBefore();
   }

   int ticks = z80_exec(&cpu, 1);

   if(debug & z80_opdone(&cpu)) {
      debugAfter();
      opdone = true;
   }

   float sample = ((cassette_out + cassette_out_MSB + cassette_in) / 4.0) + ((speaker_A - speaker_B) / 4.0);
   buzzer_ticks(&buzzer, ticks, sample);

   return ticks;
}

EMSCRIPTEN_KEEPALIVE
int laser310_ticks(int ncycles, float cyclesPerLine) {

   int elapsed = 0;
   while(elapsed < ncycles) {
      int cpu_ticks = laser310_tick();
      elapsed += cpu_ticks;
   }
   return elapsed;
}

EMSCRIPTEN_KEEPALIVE
void laser310_init() {
   buzzer_init(&buzzer);
   mc_init();
}

EMSCRIPTEN_KEEPALIVE
void laser310_reset() {
   cassette_in       = 0;
   speaker_B         = 0;
   vdc_background    = 0;
   vdc_mode          = 0;
   cassette_out      = 0;
   cassette_out_MSB  = 0;
   speaker_A         = 0;
   mc6847_reset(&mc);
}

