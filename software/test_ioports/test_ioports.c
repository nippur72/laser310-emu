#include <stdio.h>
#include <vz.h>

typedef unsigned char byte;
typedef unsigned int word;

void test_ports_creg() {
   __asm
   ld  hl,0x7000
   ld  b, 0
   xloop:
   ld  c,b
   in  a,(c)
   cpl
   out (c),a
   in  a,(c)
   ld  (hl),a
   inc hl
   djnz xloop
   ret
   __endasm;
}

void test_ports_direct() {
   __asm
   ld  hl,0x7000
   ld  b, 0
   loop:
   ld  c,b
   in  a,(c)
   cpl

   ld  d,a           ; save A register in D
   ld  a,c           ; A=port number in C
   ld  (doout+1),a   ; writes self modifying code below: OUT (A), A
   ld  (doin+1),a    ; writes self modifying code below: OUT (A), A
   ld  a,d           ; gets back A from D
doout:
   out (0x00),a      ; <-- self modifying code changes port numbers
doin:
   in  a,(0x00)      ; <-- self modifying code changes port numbers
   ld  (hl),a
   inc hl
   djnz loop
   ret
   __endasm;
}

#define NTESTS 1000

int main() {
   while(1) {
      vz_clrscr();
      for(int t=0;t<10;t++) printf("\n");
      printf("\ntest all io ports r/w:\n");
      printf("1 - in a,(port)\n");
      printf("2 - in a,(c)\n");

      int choice;
      scanf("%d", &choice);

      if(choice == 1) {
         for(int t=0;t<NTESTS;t++) {
            test_ports_direct();
         }
      }
      else if(choice == 2) {
         for(int t=0;t<NTESTS;t++) {
            test_ports_creg();
         }
      }
   }
}
