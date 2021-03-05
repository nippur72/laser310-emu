#include <stdio.h>
#include <vz.h>

// a video frame should be 228 * 310 = 70680 cpu cycles
// 

int test_frame() {
   __asm

   di
   ld hl, $7000
   ld d,159
   
   // here is 7b49 and takes exactly 70680 cycles (a complete VZ300 PAL frame)
start:
   ld c, $0B

loop:   
   ld b, $ff
loop_inner:   
   ;xor a
   ld a,d
   ld (hl),a
   djnz loop_inner
   ld a,c

   dec a
   cp 0
   
   ld c,a
   
   jr nz,loop

   ld b,$DE
loop2:
   djnz loop2   
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   nop         
   set 0, (ix+0)
   jr start

   __endasm;
}

int main() {   
   //vz_clrscr();
   printf("\n\nTEST FRAME PATTERN\n\n");
   printf("t = text mode\n");
   printf("g = graphic mode\n");
   char ch = getch();

   if(ch == 'G') vz_mode(1);

   test_frame();
}

