#include <vz.h>

typedef unsigned char byte;
typedef unsigned int word;

#define VIDEO        0x7000             
#define SCREEN_SIZE  2048

byte screen_buffer[SCREEN_SIZE];

#define FIRST_SLICE  SCREEN_SIZE-784
#define SECOND_SLICE 784

void screen_update() __naked {
   __asm
   di

   ; prepare for first slice
   ld hl, _screen_buffer
   ld de, VIDEO
   ld bc, FIRST_SLICE

   ; wait for first retrace
screen_update_loop1:      
   ld a, (0x6800)
   rla
   jr c,screen_update_loop1

   ; copy first slice during the retrace
   ldir

   ; prepare for second slice 
   ld bc, SECOND_SLICE

   ; wait for second retrace
screen_update_loop2:      
   ld a, (0x6800)
   rla
   jr c,screen_update_loop2

   ; copy the second slice during the retrace
   ldir

   ei
   ret
   __endasm;
}

void main() {
   vz_mode(1);

   // clears the buffer 
   for(word t=0; t<4096; t++) {
      screen_buffer[t] = (t<<6);
   }

   word pos1=0;  // some lazy 4-pixels sprites 
   word pos2=0;  //  

   // game loop
   while(1) {
      // do some animation on the screen buffer
      screen_buffer[pos1] = 0;
      screen_buffer[pos2] = 0;
      pos1 = pos1 + 32;
      pos1 = pos1 & 2047; 
      pos2 = pos2 + 1;
      pos2 = pos2 & 2047; 
      screen_buffer[pos1] = 255;
      screen_buffer[pos2] = 0xaa;

      // updates the screen 
      screen_update();
   }
}

