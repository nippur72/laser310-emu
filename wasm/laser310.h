#include "utils.h"

#define CHIPS_IMPL

#include "buzzer.h"
#include "tape.h"
#include "keyboard.c"
#include "chips/z80.h"
#include "chips/mc6847.h"

typedef void (*debug_cb)();

typedef void (*printer_write_cb)(byte port, byte data);
typedef byte (*printer_readst_cb)(byte port);

typedef struct {
   byte ram[65536];       // RAM
   byte rom[65536];       // ROM

   keyboard_t kbd;        // then keyboard matrix
   z80_t cpu;             // the Z80 CPU
   mc6847_t vdc;          // the MC6847 VDP

   uint32_t palette[8+5];

   bool snow_effect;                                       // if turned on, emulate the CPU vs VDC memory contention glitches
   bool videomem_access[MC6847_TICKS_PER_SCANLINE+2];      // true if VPD was accessed at corresponding line tick
   byte videomem_access_data[MC6847_TICKS_PER_SCANLINE+2]; // the actual data on the bus at the corresponding tick
   int videomem_access_ptr;                                // pointer to writing in videomem_access

   int last_fs;           // value of FS at previous tick for NTSC to PAL conversion
   int PAL_counter;       // ticks to wait for adding PAL lines at the end of the frame

   tape_t tape;           // tape WAV adapter

   byte cassette_in;      // bit 6 input latch, D5-D0 are keyboard
   byte speaker_B;        // bit 5 output latch
   byte vdc_background;   // bit 4 output latch
   byte vdc_mode;         // bit 3 output latch
   byte cassette_out;     // bit 2 output latch
   byte cassette_out_MSB; // bit 1 output latch
   byte speaker_A;        // bit 0 output latch

   bool joy0_up;
   bool joy0_down;
   bool joy0_left;
   bool joy0_right;
   bool joy0_fire;
   bool joy0_arm;

   bool joy1_up;
   bool joy1_down;
   bool joy1_left;
   bool joy1_right;
   bool joy1_fire;
   bool joy1_arm;

   int cpu_clock;
   int total_ticks;

   // buzzer audio
   float *audio_buf;
   int audio_buf_size;
   buzzer_t buzzer;

   // printer
   printer_write_cb printer_write;
   printer_readst_cb printer_readst;

   // debug
   bool debug;
   bool opdone;
   debug_cb debug_before;
   debug_cb debug_after;

   void* user_data;
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
   printer_write_cb printer_write;
   printer_readst_cb printer_readst;
   debug_cb debug_before;
   debug_cb debug_after;
   void* user_data;
} laser310_desc_t;

void laser310_reset(laser310_t *sys) {
   sys->cassette_in       = 0;
   sys->speaker_B         = 0;
   sys->vdc_background    = 0;
   sys->vdc_mode          = 0;
   sys->cassette_out      = 0;
   sys->cassette_out_MSB  = 0;
   sys->speaker_A         = 0;

   sys->joy0_up    = false;
   sys->joy0_down  = false;
   sys->joy0_left  = false;
   sys->joy0_right = false;
   sys->joy0_fire  = false;
   sys->joy0_arm   = false;
   sys->joy1_up    = false;
   sys->joy1_down  = false;
   sys->joy1_left  = false;
   sys->joy1_right = false;
   sys->joy1_fire  = false;
   sys->joy1_arm   = false;

   sys->last_fs     = 0;
   sys->PAL_counter = 0;

   sys->total_ticks = 0;
   sys->opdone = false;
   
   z80_reset(&sys->cpu);
   mc6847_reset(&sys->vdc);
   keyboard_reset(&sys->kbd);
   tape_reset(&sys->tape);
}

byte laser310_mem_read(laser310_t *sys, uint16_t address) {
        if(address < 0x6800) return sys->rom[address];                                           // ROM
   else if(address < 0x7000) return (sys->cassette_in << 6) | keyboard_poll(&sys->kbd, address); // mapped I/O
   else                      return sys->ram[address];                                           // RAM
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

byte laser310_io_read(laser310_t *sys, word ioport) {
   byte port = ioport & 0xFF;

   if((port & 0xF0) == 0x00) {
      // printer
      if(sys->printer_readst != NULL) return sys->printer_readst(port & 0x0F);
      else return 0xFF; // as in VZEM
   }
   else if((port & 0xF0) == 0x20) {
      // joysticks
      byte data = 0xFF;
      if(((port & 1) == 0) && sys->joy0_up   ) data &=  ~1;
      if(((port & 1) == 0) && sys->joy0_down ) data &=  ~2;
      if(((port & 1) == 0) && sys->joy0_left ) data &=  ~4;
      if(((port & 1) == 0) && sys->joy0_right) data &=  ~8;
      if(((port & 1) == 0) && sys->joy0_fire ) data &= ~16;
      if(((port & 2) == 0) && sys->joy0_arm  ) data &= ~16;
      if(((port & 4) == 0) && sys->joy1_up   ) data &=  ~1;
      if(((port & 4) == 0) && sys->joy1_down ) data &=  ~2;
      if(((port & 4) == 0) && sys->joy1_left ) data &=  ~4;
      if(((port & 4) == 0) && sys->joy1_right) data &=  ~8;
      if(((port & 4) == 0) && sys->joy1_fire ) data &= ~16;
      if(((port & 8) == 0) && sys->joy1_arm  ) data &= ~16;
      return data;
   }
   else {
      byte unused = (byte) EM_ASM_INT({ console.log("io read from unknown port", $0) }, port);
      return 0xFF; // as in VZEM
   }

   /*
   case 0x27: return sys->joy0; // joy1;  // joystick left, fire buttons
   case 0x2b: return sys->joy0; // joy0;  // joystick left, 8 directions
   case 0x2d: return sys->joy0; // joy1;  // joystick right, fire buttons (not emulated)
   case 0x2e: return sys->joy0; // joy0;  // joystick right, 8 directions (not emulated)
   */
}

void laser310_io_write(laser310_t *sys, word ioport, byte value) {
   byte port = ioport & 0xFF;

   if((port & 0xF0) == 0x00) {
      // printer
      if(sys->printer_write != NULL) return sys->printer_write(port & 0x0F, value);
   }
   else
   {
      byte unused = (byte) EM_ASM_INT({ console.log("io write to unknown port ", $0, $1) }, port & 0xFF, value);
      //console.warn(`write on unknown port ${hex(port)}h value ${hex(value)}h`);
   }
}

uint64_t laser310_cpu_tick(int num_ticks, uint64_t pins, void *user_data) {
   // MC6847_AG     => vdc_mode        graphics mode enable
   // MC6847_AS     => D7              semi-graphics mode enable
   // MC6847_INTEXT => 0               internal/external select
   // MC6847_INV    => D6              invert enable
   // MC6847_GM0    => 0               graphics mode select 0
   // MC6847_GM1    => 1               graphics mode select 1
   // MC6847_GM2    => 0               graphics mode select 2
   // MC6847_CSS    => vdc_background  color select pin

   laser310_t *sys = (laser310_t *)user_data;

   // NMI connected to VCC on the Laser 310
   BITRESET(pins,Z80_NMI);

   // data on the bus for "snow" effect
   byte video_access = false;
   byte video_access_data;

   int address = Z80_GET_ADDR(pins);

   if(pins & Z80_MREQ) {
      byte data;
      if(pins & Z80_RD) {
         data = laser310_mem_read(sys, address);
         Z80_SET_DATA(pins, data);
      }
      else if(pins & Z80_WR) {
         data = Z80_GET_DATA(pins);
         laser310_mem_write(sys, address, data);
      }
      video_access = (address >=0x7000 && address<0x7800);
      video_access_data = data;
   }
   else if(pins & Z80_IORQ) {
      if(pins & Z80_RD) {
         byte data = laser310_io_read(sys, address);
         Z80_SET_DATA(pins, data);
      }
      else if(pins & Z80_WR) {
         byte data = Z80_GET_DATA(pins);
         laser310_io_write(sys, address, data);
      }
   }

   // save data byte on the bus for the "snow" effect
   if(sys->snow_effect) {
      for(int t=0;t<num_ticks;t++) {
         sys->videomem_access[sys->videomem_access_ptr] = video_access;
         sys->videomem_access_data[sys->videomem_access_ptr] = video_access_data;
         sys->videomem_access_ptr++;
         if(sys->videomem_access_ptr == MC6847_TICKS_PER_SCANLINE) sys->videomem_access_ptr = 0;
      }
   }

   if(sys->PAL_counter < 0) {
      // tick the VDC
      uint64_t vdc_pins = MC6847_GM1;
      if(sys->vdc_mode      ) BITSET(vdc_pins,MC6847_AG);
      if(sys->vdc_background) BITSET(vdc_pins,MC6847_CSS);
      for(int t=0;t<num_ticks;t++) vdc_pins = mc6847_tick(&sys->vdc, vdc_pins);
      if(IS_ONE(vdc_pins,MC6847_FS)) BITSET(pins,Z80_INT);     // connect the /INT line to MC6847 FS pin
      else BITRESET(pins,Z80_INT);
      if(sys->vdc.fs == 0 && sys->vdc.fs != sys->last_fs) {
         sys->PAL_counter += MC6847_TICKS_PER_SCANLINE * 48; // adds 48 PAL lines         
         //byte unused = (byte) EM_ASM_INT({ console.log(sys_total_cycles()-window.ls); window.ls = sys_total_cycles(); }, 0);
      }
   }
   else {
      // holds the VDC waiting for the additional PAL lines to complete
      sys->PAL_counter-=num_ticks;
   }

   sys->last_fs = sys->vdc.fs;

   return pins;
}

uint64_t vdp_fetch_cb(uint64_t pins, void* user_data) {
   laser310_t *sys = (laser310_t *) user_data;
   uint16_t address = MC6847_GET_ADDR(pins);
   uint8_t data = laser310_mem_read(sys, 0x7000+address);

   // attempt to simulate the "snow" effect
   if(sys->snow_effect) {
      int pos = sys->vdc.h_fetchpos*4;
      if(sys->videomem_access[pos] && sys->videomem_access[pos+1]) {
         data = sys->videomem_access_data[pos];
      }
   }

   if (data & (1<<6)) BITSET(pins,MC6847_INV);
   else               BITRESET(pins,MC6847_INV);
   if (data & (1<<7)) BITSET(pins,MC6847_AS);
   else               BITRESET(pins,MC6847_AS);

   MC6847_SET_DATA(pins, data);
   return pins;
}

int laser310_tick(laser310_t *sys) {

   if(sys->debug && sys->opdone) {
      sys->opdone = false;
      sys->debug_before();
   }

   int ticks = z80_exec(&sys->cpu, 1);
   sys->total_ticks += ticks;

   if(sys->debug && z80_opdone(&sys->cpu)) {
      sys->debug_after();
      sys->opdone = true;
   }

   tape_load_tick(&sys->tape, ticks);
   sys->cassette_in = sys->tape.load.bit == 0 ? 1 : 0;

   float sample_cassette = (sys->cassette_out + sys->cassette_out_MSB + sys->cassette_in) / 2.0;
   float sample_buzzer   = (sys->speaker_A - sys->speaker_B) / 2.0;
   float sample = (sample_cassette + sample_buzzer) / 2.0;
   buzzer_ticks(&sys->buzzer, ticks, sample);

   return ticks;
}

void laser310_joystick(laser310_t *sys, byte joy0, byte joy1)
{
   sys->joy0_up    = joy0 & (1<<0);
   sys->joy0_down  = joy0 & (1<<1);
   sys->joy0_left  = joy0 & (1<<2);
   sys->joy0_right = joy0 & (1<<3);
   sys->joy0_fire  = joy0 & (1<<4);
   sys->joy0_arm   = joy0 & (1<<5);

   sys->joy1_up    = joy1 & (1<<0);
   sys->joy1_down  = joy1 & (1<<1);
   sys->joy1_left  = joy1 & (1<<2);
   sys->joy1_right = joy1 & (1<<3);
   sys->joy1_fire  = joy1 & (1<<4);
   sys->joy1_arm   = joy1 & (1<<5);
}

uint32_t applySaturation(float r, float g, float b, float s, float c, float l) {      

   // apply saturation
   float L = 0.3*r + 0.6*g + 0.1*b;
   float new_r = (r + (1.0 - s) * (L - r));
   float new_g = (g + (1.0 - s) * (L - g));
   float new_b = (b + (1.0 - s) * (L - b));

   // apply contrast
   new_r = (new_r-128.0)*c + 128.0;
   new_g = (new_g-128.0)*c + 128.0;
   new_b = (new_b-128.0)*c + 128.0;

   // apply luminosity
   new_r += 128.0 * (l-1.0);
   new_g += 128.0 * (l-1.0);
   new_b += 128.0 * (l-1.0);

   if(new_r < 0) new_r = 0; if(new_r > 255 ) new_r = 255; 
   if(new_g < 0) new_g = 0; if(new_g > 255 ) new_g = 255; 
   if(new_b < 0) new_b = 0; if(new_b > 255 ) new_b = 255; 

   return 0xFF000000 | (int)new_r | (int)new_g << 8 | (int)new_b << 16;    
}

void laser310_init(laser310_t *sys, laser310_desc_t *desc) {
   sys->cpu_clock = desc->cpu_clock;
   sys->user_data = desc->user_data;

   float sat = 1.0;        // 1.0 normal saturation
   float contrast = 1.0;   // 1.0 normal contrast
   float lum = 1.0;        // 1.0 normal luminosity  

   sys->palette[ 0] = applySaturation(  19, 146,  11, sat, contrast, lum);     /* green */
   sys->palette[ 1] = applySaturation( 155, 150,  10, sat, contrast, lum);     /* yellow */
   sys->palette[ 2] = applySaturation(   2,  22, 175, sat, contrast, lum);     /* blue */
   sys->palette[ 3] = applySaturation( 155,  22,   7, sat, contrast, lum);     /* red */
   sys->palette[ 4] = applySaturation( 141, 150, 154, sat, contrast, lum);     /* buff */
   sys->palette[ 5] = applySaturation(  15, 143, 155, sat, contrast, lum);     /* cyan */
   sys->palette[ 6] = applySaturation( 139,  39, 155, sat, contrast, lum);     /* cyan */
   sys->palette[ 7] = applySaturation( 140,  31,  11, sat, contrast, lum);     /* orange */
   sys->palette[ 8] = applySaturation(  17,  17,  17, sat, contrast, lum);     // black
   sys->palette[ 9] = applySaturation(  19, 146,  11, sat, contrast, lum);     // alnum_green
   sys->palette[10] = applySaturation(   0,  36,   0, sat, contrast, lum);     // alnum_dark_green
   sys->palette[11] = applySaturation( 140,  31,  11, sat, contrast, lum);     // alnum_orange 
   sys->palette[12] = applySaturation(   0,   15, 34, sat, contrast, lum);     // alnum_dark_orange

   sys->snow_effect = true;

   // cpu
   z80_desc_t z80desc;
   z80desc.tick_cb = laser310_cpu_tick;
   z80desc.user_data = sys; // self reference for tick callback
   z80_init(&sys->cpu, &z80desc);

   // mc6847
   mc6847_desc_t mc_desc;
   mc_desc.mc6847_tick_hz = sys->cpu_clock;
   mc_desc.tick_hz = sys->cpu_clock;
   mc_desc.rgba8_buffer = desc->display_buffer;
   mc_desc.rgba8_buffer_size = desc->display_buffer_size;
   mc_desc.palette = sys->palette;
   mc_desc.fetch_cb = vdp_fetch_cb;
   mc_desc.screen_update_cb = desc->screen_update_cb;
   mc_desc.user_data = sys; // self reference for fetch callback
   mc6847_init(&sys->vdc, &mc_desc);

   // buzzer
   buzzer_desc_t buzdesc;
   buzdesc.audio_buf = desc->audio_buf;
   buzdesc.audio_buf_size = desc->audio_buf_size;
   buzdesc.cpu_clock = sys->cpu_clock;
   buzdesc.sample_rate = desc->sample_rate;
   buzdesc.buffer_ready_cb = desc->buffer_ready_cb;
   buzzer_init(&sys->buzzer, &buzdesc);

   // printer
   sys->printer_readst = desc->printer_readst;
   sys->printer_write = desc->printer_write;

   // debug
   sys->debug_before = desc->debug_before;
   sys->debug_after  = desc->debug_after;
   sys->debug = false;

   laser310_reset(sys);
}

