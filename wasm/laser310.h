#include "utils.h"

#define CHIPS_IMPL

#include "buzzer.h"
#include "tape.h"
#include "keyboard.c"
#include "chips/z80.h"
#include "chips/mc6847.h"

typedef void (*debug_cb)();                               // debug callback  
typedef void (*printer_write_cb)(byte port, byte data);   // printer write callback
typedef byte (*printer_readst_cb)(byte port);             // printer read status callback

#define LASER310_MODEL_VZ200 (1)
#define LASER310_MODEL_VZ300 (2)
#define LASER310_PAL         (true)
#define LASER310_NTSC        (false)

typedef struct {
   int model;
   int PAL;
   int ramsize;

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

   bool joystick_connected;
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
   int model;
   bool PAL;   
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
   if(address < 0x6800) {
      // ROM
      return sys->rom[address];
   }
   else if(address < 0x7000) {
      // mapped I/O
      byte D7 = !sys->vdc.fs & 1;
      byte D6 = sys->cassette_in & 1;
      byte D5_D0 = keyboard_poll(&sys->kbd, address) & 0x3f;
      return (D7 << 7) | (D6 << 6) | D5_D0;
   }
   else {
      // RAM
      return sys->ram[address];
   }
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

// returns 0xFFFF if read is not handled by any I/O port
word laser310_io_read(laser310_t *sys, word ioport) {
   byte port = ioport & 0xFF;

   if(port == 0x00) {
      // printer
      if(sys->printer_readst != NULL) return sys->printer_readst(port & 0x0F);
      else return 0xFFFF;
   }
   else if(sys->joystick_connected && ((port & 0xF0) == 0x20)) {
      // joysticks
      byte data = 0x1F; // only 5 bits
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
      /*
      byte unused = (byte) EM_ASM_INT({ console.log("io read from unknown port", $0) }, port);
      return (ioport & 0xFF) | 1;
      */
      return 0xFFFF;
   }
}

void laser310_io_write(laser310_t *sys, word ioport, byte value) {
   byte port = ioport & 0xFF;

   if((port & 0xF0) == 0x00) {
      // printer
      if(sys->printer_write != NULL) return sys->printer_write(port & 0x0F, value);
   }
   else
   {
      //byte unused = (byte) EM_ASM_INT({ console.log("io write to unknown port ", $0, $1) }, port & 0xFF, value);
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
         word data = laser310_io_read(sys, address);
         if(data == 0xFFFF) {
            // I/O read non handled by any port, the value changes depending of the opcode
            if(sys->cpu.op == 0xdb) data = (address & 0xFF) | 1;   // IN A,(port)
            else data = sys->cpu.op | 1;                           // IN r,(C)
         }
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
      if(sys->PAL && sys->vdc.fs == 0 && sys->vdc.fs != sys->last_fs) {
              if(sys->model == LASER310_MODEL_VZ200) sys->PAL_counter += MC6847_TICKS_PER_SCANLINE * 50; // adds 50 PAL lines         
         else if(sys->model == LASER310_MODEL_VZ300) sys->PAL_counter += MC6847_TICKS_PER_SCANLINE * 48; // adds 48 PAL lines
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

   float sample_cassette_out = (sys->cassette_out + sys->cassette_out_MSB) / 2.0 - 0.5;
   float sample_buzzer       = (((float) sys->speaker_A) - ((float)sys->speaker_B)) / 2.0;

   sys->tape.save.sample = sample_buzzer + sample_cassette_out + 0.5;
   tape_load_tick(&sys->tape, ticks);
   sys->cassette_in = sys->tape.load.sample < 0 ? 1 : 0;

   float sample_cassette_in = sys->cassette_in - 0.5;
   float sample = sample_cassette_in + sample_cassette_out + sample_buzzer;
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
   sys->model = desc->model;
   sys->PAL = desc->PAL;

   CHIPS_ASSERT(sys->model == LASER310_MODEL_VZ200 || sys->model == LASER310_MODEL_VZ300);
   
        if(sys->model == LASER310_MODEL_VZ300) sys->cpu_clock = 3546900;
   else if(sys->model == LASER310_MODEL_VZ200) sys->cpu_clock = 3579500;               

   sys->user_data = desc->user_data;

   float sat = 0.9;        // 1.0 normal saturation
   float contrast = 1.0;   // 1.0 normal contrast
   float lum = 1.0;        // 1.0 normal luminosity  

   // MAME palette, slightly modified
   sys->palette[ 0] = applySaturation(0x30, 0xd2, 0x00, sat, contrast, lum);  /* GREEN */
   sys->palette[ 1] = applySaturation(0xc1, 0xe5, 0x00, sat, contrast, lum);  /* YELLOW */
   sys->palette[ 2] = applySaturation(0x4c, 0x3a, 0xb4, sat, contrast, lum);  /* BLUE */
   sys->palette[ 3] = applySaturation(0x9a, 0x32, 0x36, sat, contrast, lum);  /* RED */
   sys->palette[ 4] = applySaturation(0xbf, 0xc8, 0xad, sat, contrast, lum);  /* BUFF */
   sys->palette[ 5] = applySaturation(0x41, 0xaf, 0x71, sat, contrast, lum);  /* CYAN */
   sys->palette[ 6] = applySaturation(0xc8, 0x4e, 0xf0, sat, contrast, lum);  /* MAGENTA */
   sys->palette[ 7] = applySaturation(0xd4, 0x7f, 0x00, sat, contrast, lum);  /* ORANGE */
   sys->palette[ 8] = applySaturation(  17,   17,   17, sat, contrast, lum);  /* BLACK */
   sys->palette[ 9] = applySaturation(0x30, 0xd2, 0x00, sat, contrast, lum);  /* ALPHANUMERIC BRIGHT GREEN */
   sys->palette[10] = applySaturation(0x00,   46, 0x00, sat, contrast, lum);  /* ALPHANUMERIC DARK GREEN */
   sys->palette[11] = applySaturation(0xff, 0xb7, 0x00, sat, contrast, lum);  /* ALPHANUMERIC BRIGHT ORANGE */
   sys->palette[12] = applySaturation(0x6b, 0x27, 0x00, sat, contrast, lum);  /* ALPHANUMERIC DARK ORANGE */

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

