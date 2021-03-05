#include <stdio.h>

int test_snow() {
   #asm

   di
   ld hl, $7000
   xor a

loop:
   ld (hl),a
   nop
   jr loop

   #endasm 
}


int main() {   
   vz_clrscr();
   printf("\n\nTEST SNOW\n\n");
   printf("WRITTEN BY NINO PORCINO\n\n");
   test_snow();
}
