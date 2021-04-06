#include <stdio.h>
#include <vz.h>

int count = 0;

void main() {
   printf("\ncounting bit 7 changes on\nmapped io $6800\n");

   while(1) {
      __asm
      di
      loop1:
      ld a,($6800)
      rla
      jp c,loop1
      loop2:
      ld a,($6800)
      rla
      jp nc,loop2
      ei
      __endasm;
      count++;
      if(count % 30 == 0) {
         printf("%d\n", count);
      }
   }
}
