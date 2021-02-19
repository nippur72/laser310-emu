#include "laser310.h"

byte KAX[8];

EMSCRIPTEN_KEEPALIVE
void keyboard_reset() {
   for(int t=0;t<8;t++) KAX[t] = 255;
}

EMSCRIPTEN_KEEPALIVE
void keyboard_press(byte row, byte col) {
   KAX[row] = KAX[row] & (0xFF ^ (1<<col));
}

EMSCRIPTEN_KEEPALIVE
void keyboard_release(byte row, byte col) {
   KAX[row] = KAX[row] | (1<<col);
}

EMSCRIPTEN_KEEPALIVE
byte keyboard_poll(word address)
{
   byte KB = address & 0xFF;

   byte KA = 0b11111111;
   for(int row=0; row<8; row++) {
      if((KB & (1<<row)) == 0) {
        KA = KA & KAX[row];
      }
   }

   return KA;
}
