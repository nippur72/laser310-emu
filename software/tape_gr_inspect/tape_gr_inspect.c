#include <stdio.h>
#include <arch/vz.h>

typedef unsigned char byte;
typedef unsigned int  word;

#define FASTCALL __z88dk_fastcall
#define FASTNAKED __z88dk_fastcall __naked
#define NAKED __naked

// this is copied directly from turbo.asm
// with only small modifications

word read_bit() FASTNAKED {
   __asm      

   load_threshold:
      ld hl, 0x6800

      xor a

   ; counts the HIGH (positive) semiwave
   read_bit_loop_H:
      inc a                         
      bit 6, (hl)
      jr nz, read_bit_loop_H
   
   ; counts the LOW (negative) semiwave
   read_bit_loop_L:
      inc a                         
      bit 6, (hl)                  
      jr z, read_bit_loop_L

   threshold:
      ld l, a
      ld h, 0
      
      ret                           
   __endasm;
}

// read two bits and save bit length value
// the first bit is to acquire the lost synch
// the second is the good one

word read_some_bits() FASTNAKED {
   __asm 
   di
   call _read_bit
   call _read_bit
   ei
   ret 
   __endasm;
}

void draw_horizontal_bar(byte x, byte y, byte color)
{
   vz_line(  0,y,  x,y,color);
   vz_line(x+1,y,127,y,0);
}

byte bars[256];

void main() {
   static byte t;
   static word j;
   static byte ruler;
   
   vz_mode(1);  // graphic mode   

   while(1) {      
      for(t=0; t<255; t++) bars[t] = 0;

      for(j=0; j<512; j++) {
         byte i = read_some_bits();
         if(i>127) i=127;
         if(bars[i]<63) 
            bars[i]++;
      }
      
      for(t=0;t<127;t++) {         
         byte w = bars[t];                  
         vz_line(t,0,    t,63-w, 0);
         vz_line(t,63-w, t,63,   2);                  
      }
   }   
}
