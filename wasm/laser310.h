#include "utils.h"

#include "buzzer.h"

#include "keyboard.c"

#define CHIPS_IMPL

#include "chips/z80.h"
#include "chips/mc6847.h"

extern byte mem_read(uint16_t address);
extern void mem_write(word address, byte value);
extern byte io_read(word ioport);
extern void io_write(word port, byte value);

typedef struct {
    byte ram[65536];       // RAM
    byte rom[65536];       // ROM

    z80_t cpu;             // the Z80 CPU
    mc6847_t vdp;          // the MC6847 VDP

    byte cassette_in;      // bit 7 input latch, D6-D0 are keyboard
    byte speaker_B;        // bit 5 output latch
    byte vdc_background;   // bit 4 output latch
    byte vdc_mode;         // bit 3 output latch
    byte cassette_out;     // bit 2 output latch
    byte cassette_out_MSB; // bit 1 output latch
    byte speaker_A;        // bit 0 output latch

    int cpu_clock;
    float *audio_buf;
    int audio_buf_size;
    buzzer_t buzzer;

} laser310_t;

extern laser310_t *sys;

typedef struct {
   int cpu_clock;
   int sample_rate;
   float *audio_buf;
   int audio_buf_size;
   buzzer_audio_ready_cb buffer_ready_cb;
   uint32_t *display_buffer;
   int display_buffer_size;
   mc6847_screen_update_cb_t screen_update_cb;
} laser310_desc_t;

void laser310_reset(laser310_t *sys) {
   sys->cassette_in       = 0;
   sys->speaker_B         = 0;
   sys->vdc_background    = 0;
   sys->vdc_mode          = 0;
   sys->cassette_out      = 0;
   sys->cassette_out_MSB  = 0;
   sys->speaker_A         = 0;
   z80_reset(&sys->cpu);
   mc6847_reset(&sys->vdp);
}

byte laser310_mem_read(laser310_t *sys, uint16_t address) {
        if(address < 0x6800) return sys->rom[address];                                 // ROM
   else if(address < 0x7000) return (sys->cassette_in << 7) | keyboard_poll(address);  // mapped I/O
   else                      return sys->ram[address];                                 // RAM
}

void laser310_mem_write(laser310_t *sys, word address, byte value) {
   if(address < 0x6800) {
      // ROM
      return;
   }
   else if(address < 0x7000) {
      // mapped I/O
      sys->speaker_B         = (value >> 5) & 1;
      sys->vdc_background    = (value >> 4) & 1;
      sys->vdc_mode          = (value >> 3) & 1;
      sys->cassette_out      = (value >> 2) & 1;
      sys->cassette_out_MSB  = (value >> 1) & 1;
      sys->speaker_A         = (value >> 0) & 1;
   }
   else {
      // RAM
      sys->ram[address] = value;
   }
}

uint64_t laser310_cpu_tick(int num_ticks, uint64_t pins, void* user_data) {
   // MC6847_AG     => vdc_mode        graphics mode enable
   // MC6847_AS     => D7              semi-graphics mode enable
   // MC6847_INTEXT => 0               internal/external select
   // MC6847_INV    => D6              invert enable
   // MC6847_GM0    => 0               graphics mode select 0
   // MC6847_GM1    => 1               graphics mode select 1
   // MC6847_GM2    => 0               graphics mode select 2
   // MC6847_CSS    => vdc_background  color select pin

   // tick the VDC
   uint64_t vdc_pins = MC6847_GM1;

   if(sys->vdc_mode      ) BITSET(vdc_pins,MC6847_AG);
   if(sys->vdc_background) BITSET(vdc_pins,MC6847_CSS);
   vdc_pins = mc6847_tick(&sys->vdp, vdc_pins);
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

uint64_t vdp_fetch_cb(uint64_t pins, void* user_data) {
   uint16_t address = MC6847_GET_ADDR(pins);
   uint8_t data = mem_read(0x7000+address);

   if (data & (1<<6)) BITSET(pins,MC6847_INV);
   else               BITRESET(pins,MC6847_INV);
   if (data & (1<<7)) BITSET(pins,MC6847_AS);
   else               BITRESET(pins,MC6847_AS);

   MC6847_SET_DATA(pins, data);
   return pins;
}

void laser310_init(laser310_t *sys, laser310_desc_t *desc) {
   sys->cpu_clock = desc->cpu_clock;

   // cpu
   z80_desc_t z80desc;
   z80desc.tick_cb = laser310_cpu_tick;
   z80desc.user_data = 0;
   z80_init(&sys->cpu, &z80desc);

   // mc6847
   mc6847_desc_t mc_desc;
   mc_desc.tick_hz = sys->cpu_clock / 2; // TODO why divided by 2 ?
   mc_desc.rgba8_buffer = desc->display_buffer;
   mc_desc.rgba8_buffer_size = desc->display_buffer_size;
   mc_desc.fetch_cb = vdp_fetch_cb;
   mc_desc.screen_update_cb = desc->screen_update_cb;
   mc6847_init(&sys->vdp, &mc_desc);

   // buzzer
   buzzer_desc_t buzdesc;
   buzdesc.audio_buf = desc->audio_buf;
   buzdesc.audio_buf_size = desc->audio_buf_size;
   buzdesc.cpu_clock = sys->cpu_clock;
   buzdesc.sample_rate = desc->sample_rate;
   buzdesc.buffer_ready_cb = desc->buffer_ready_cb;
   buzzer_init(&sys->buzzer, &buzdesc);
}
