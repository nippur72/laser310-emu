#include "laser310.h"

byte ram[65536];
byte rom[65536];

extern byte cassette_in;
extern byte speaker_B;        // bit 5
extern byte vdc_background;   // bit 4
extern byte vdc_mode;         // bit 3
extern byte cassette_out;     // bit 2
extern byte cassette_out_MSB; // bit 1
extern byte speaker_A;        // bit 0

EMSCRIPTEN_KEEPALIVE
byte mem_read(uint16_t address) {
        if(address < 0x6800) return rom[address];                                 // ROM
   else if(address < 0x7000) return (cassette_in << 7) | keyboard_poll(address);  // mapped I/O
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
      speaker_B         = (value >> 5) & 1;
      vdc_background    = (value >> 4) & 1;
      vdc_mode          = (value >> 3) & 1;
      cassette_out      = (value >> 2) & 1;
      cassette_out_MSB  = (value >> 1) & 1;
      speaker_A         = (value >> 0) & 1;
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
