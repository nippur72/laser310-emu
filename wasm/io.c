#include "laser310.h"

byte led_read(byte port)  {
   return EM_ASM_INT({ return led_read(); }, 0);
}

void led_write(byte port, byte value) {
   byte unused = (byte) EM_ASM_INT({ led_write($0); }, value);
}

EMSCRIPTEN_KEEPALIVE
byte io_read(word ioport) {
   byte port = ioport & 0xFF;

   switch(port) {
      /*
      case 0x40:
      case 0x41:
      case 0x42:
      case 0x43: return psg_read(port);
      */

      case 0xFF: return led_read(port);

      default:
         //console.warn(`read from unknown port ${hex(port)}h`);
         return port; // TODO check on the real HW
   }
}

EMSCRIPTEN_KEEPALIVE
void io_write(word port, byte value) {

   // console.log(`io write ${hex(port)} ${hex(value)}`)
   switch(port & 0xFF) {

      /*
      case 0x40:
      case 0x41:
      case 0x42:
      case 0x43: psg_write(port, value); return;
      */

      case 0xFF: led_write(port, value); return;

      //default:
         //console.warn(`write on unknown port ${hex(port)}h value ${hex(value)}h`);
   }
}
