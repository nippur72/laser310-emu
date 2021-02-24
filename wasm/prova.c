#include "laser310.h"

#define CHIPS_IMPL

#include "mem.c"
#include "io.c"
#include "vdp.c"
#include "cpu.c"

bool debug = false;

void debugBefore() { byte unused = (byte) EM_ASM_INT({ if(debugBefore!== undefined) debugBefore(); }, 0); }
void debugAfter()  { byte unused = (byte) EM_ASM_INT({ if(debugAfter !== undefined) debugAfter();  }, 0); }

KEEP
void laser310_set_debug(bool v) { debug = v; }

laser310_t l310;
laser310_t *sys = &l310;
laser310_desc_t sysdesc;

// callback called when audio buffer is full with samples
void audio_buffer_ready(float *samples, int size) {
   uint8_t risp = (uint8_t) EM_ASM_INT({ return ay38910_audio_buf_ready($0, $1); }, samples, size);
}

// callback called when a video frame is ready
void screen_update(uint32_t *buffer) {
   byte unused = (byte) EM_ASM_INT({ vdp_screen_update_mc($0); }, buffer );
}

KEEP
int laser310_tick(laser310_t *sys) {
   static bool opdone;

   if(debug & opdone) {
      opdone = false;
      debugBefore();
   }

   int ticks = z80_exec(&sys->cpu, 1);

   if(debug & z80_opdone(&sys->cpu)) {
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
      int cpu_ticks = laser310_tick(&l310);
      elapsed += cpu_ticks;
   }
   return elapsed;
}

float buzzer_audio_buf[4096];
uint32_t mc_display_buffer[MC6847_DISPLAY_WIDTH*MC6847_DISPLAY_HEIGHT];

KEEP
void sys_init() {

   sysdesc.cpu_clock = 3580000;
   sysdesc.sample_rate = 48000;
   sysdesc.audio_buf = buzzer_audio_buf;
   sysdesc.audio_buf_size = 4096;
   sysdesc.buffer_ready_cb = audio_buffer_ready;
   sysdesc.display_buffer = mc_display_buffer;
   sysdesc.display_buffer_size = sizeof(mc_display_buffer); // MC6847_DISPLAY_WIDTH*MC6847_DISPLAY_HEIGHT*4;
   sysdesc.screen_update_cb = screen_update;

   laser310_init(&l310, &sysdesc);
   mc_init();
}

KEEP
void sys_reset() {
   laser310_reset(&l310);
   mc6847_reset(&mc);
}

KEEP
void rom_load(word address, byte value) {
   sys->rom[address] = value;
}
