#include "laser310.h"

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

laser310_t l310;
laser310_t *sys = &l310;

laser310_desc_t sysdesc;

// call back called when audio buffer is full with samples
void audio_buffer_ready(float *samples, int size) {
   uint8_t risp = (uint8_t) EM_ASM_INT({ return ay38910_audio_buf_ready($0, $1); }, samples, size);
}

KEEP
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

   float sample = ((sys->cassette_out + sys->cassette_out_MSB + sys->cassette_in) / 4.0) + ((sys->speaker_A - sys->speaker_B) / 4.0);
   buzzer_ticks(&sys->buzzer, ticks, sample);

   return ticks;
}

KEEP
int laser310_ticks(int ncycles, float cyclesPerLine) {

   int elapsed = 0;
   while(elapsed < ncycles) {
      int cpu_ticks = laser310_tick();
      elapsed += cpu_ticks;
   }
   return elapsed;
}

float buzzer_audio_buf[4096];

KEEP
void sys_init() {

   sysdesc.cpu_clock = 3580000;
   sysdesc.sample_rate = 48000;
   sysdesc.audio_buf = buzzer_audio_buf;
   sysdesc.audio_buf_size = 4096;
   sysdesc.buffer_ready_cb = audio_buffer_ready;

   laser310_init(&l310, &sysdesc);
   mc_init();
}

KEEP
void sys_reset() {
   sys->cassette_in       = 0;
   sys->speaker_B         = 0;
   sys->vdc_background    = 0;
   sys->vdc_mode          = 0;
   sys->cassette_out      = 0;
   sys->cassette_out_MSB  = 0;
   sys->speaker_A         = 0;
   mc6847_reset(&mc);
}

