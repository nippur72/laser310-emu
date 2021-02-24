#include "utils.h"

typedef struct {
   byte KAX[8];
} keyboard_t;

void keyboard_reset(keyboard_t *kbd) {
   for(int t=0;t<8;t++) kbd->KAX[t] = 255;
}

void keyboard_press(keyboard_t *kbd, byte row, byte col) {
   kbd->KAX[row] = kbd->KAX[row] & (0xFF ^ (1<<col));
}

void keyboard_release(keyboard_t *kbd, byte row, byte col) {
   kbd->KAX[row] = kbd->KAX[row] | (1<<col);
}

byte keyboard_poll(keyboard_t *kbd, word address)
{
   byte KB = address & 0xFF;

   byte KA = 0b11111111;
   for(int col=0; col<8; col++) {
      if((KB & (1<<col)) == 0) {
        KA = KA & kbd->KAX[col];
      }
   }
   return KA;
}

