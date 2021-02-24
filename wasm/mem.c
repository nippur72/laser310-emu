#include "utils.h"

byte ram[65536];
byte rom[65536];

extern laser310_t *sys;

EMSCRIPTEN_KEEPALIVE
byte mem_read(uint16_t address) {
        if(address < 0x6800) return rom[address];                                 // ROM
   else if(address < 0x7000) return (sys->cassette_in << 7) | keyboard_poll(address);  // mapped I/O
   else                      return ram[address];                                 // RAM
}

EMSCRIPTEN_KEEPALIVE
void mem_write(word address, byte value) {
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
      ram[address] = value;
   }
}

EMSCRIPTEN_KEEPALIVE
void rom_load(word address, byte value) {
   rom[address] = value;
}
