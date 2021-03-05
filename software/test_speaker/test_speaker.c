#include <stdio.h>
#include <vz.h>
#include <input.h>

#define PULSE_WIDTH  250
#define PULSE_LENGTH 128

int test_speaker(unsigned int HL) __z88dk_fastcall {
   __asm

   // HL contains the speaker flipping pattern
   
   push bc
   push de

   di
   ld c, PULSE_LENGTH

   loop:
      ld b, PULSE_WIDTH
      ld a, l
      ld ($6800),a

   half_cycle_up: 
      nop
      nop
      nop
      nop
      nop
      nop
      nop
      nop
      djnz half_cycle_up

      ld b, PULSE_WIDTH
      ld a, h
      ld ($6800),a

   half_cycle_down: 
      nop
      nop
      nop
      nop
      nop
      nop
      nop
      nop
      djnz half_cycle_down

   ld a,c
   dec a
   ld c,a
   cp 0
   jr nz, loop   

   ei

   pop de
   pop bc     

   __endasm;
}

#define SPEAKER_B (1<<5)
#define SPEAKER_A (1<<0)

unsigned char ch;
unsigned char hi;
unsigned char lo;

int main() {   
   vz_clrscr();
   
   printf("TEST SPEAKER AT $6800\n");
   printf("---------------------\n");
   printf(" bit 5 speaker B\n");
   printf(" bit 4 vdc background\n");
   printf(" bit 3 vdc mode\n");
   printf(" bit 2 cassette out\n");
   printf(" bit 1 cassette out msb\n");
   printf(" bit 0 speaker A\n");
   printf("---------------------\n");
   printf("     BA    BA\n");
   printf(" 0 = 11 -> 00 unison\n");
   printf(" 1 = 10 -> 01 alternate\n");
   printf(" 2 = 10 -> 00 B only, A off\n");
   printf(" 3 = 11 -> 01 B only, A on\n");
   printf(" 4 = 01 -> 00 A only, B off\n");
   printf(" 5 = 11 -> 10 A only, B on");

   while(1) {      
      
      ch = in_Inkey();

           if(ch == '0') { hi = SPEAKER_B|SPEAKER_A; lo = 0;           test_speaker( (hi<<8)|lo ); }
      else if(ch == '1') { hi = SPEAKER_B;           lo = SPEAKER_A;   test_speaker( (hi<<8)|lo ); }      
      else if(ch == '2') { hi = SPEAKER_B;           lo = 0;           test_speaker( (hi<<8)|lo ); }      
      else if(ch == '3') { hi = SPEAKER_B|SPEAKER_A; lo = SPEAKER_A;   test_speaker( (hi<<8)|lo ); }      
      else if(ch == '4') { hi = SPEAKER_A;           lo = 0;           test_speaker( (hi<<8)|lo ); }      
      else if(ch == '5') { hi = SPEAKER_B|SPEAKER_A; lo = SPEAKER_B;   test_speaker( (hi<<8)|lo ); }      
   }
}

