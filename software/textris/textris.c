#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <vz.h>
#include <sound.h>

typedef unsigned char byte;
typedef unsigned int word;

#define BACKGROUND_ORANGE 1      /* sets MC6847 dark red on orange backround */
#define VIDEO 0x7000             /* video memory */
#define NCOLS 32                 /* number of screen columns */
#define NROWS 16                 /* number of screen rows, also board height */
#define NUMPIECES 7              /* number of tetrominos */
#define STARTBOARD 15            /* start position of the board on the screen */
#define ENDBOARD 24              /* end position of the board on the screen */

/* coloured full block characters */
#define BLOCK_LIGHT_ORANGE ((byte)32)
#define BLOCK_BLACK        ((byte)(32+128))
#define BLOCK_GREEN        ((byte)(143+16*0))
#define BLOCK_YELLOW       ((byte)(143+16*1))
#define BLOCK_BLUE         ((byte)(143+16*2))
#define BLOCK_RED          ((byte)(143+16*3))
#define BLOCK_WHITE        ((byte)(143+16*4))
#define BLOCK_CYAN         ((byte)(143+16*5))
#define BLOCK_MAGENTA      ((byte)(143+16*6))
#define BLOCK_ORANGE       ((byte)(143+16*7))

#define BLANK_CHAR        BLOCK_BLACK   /* character used to fill the board */
#define BOARD_CHAR_LEFT   245           /* character for left side of the board */
#define BOARD_CHAR_RIGHT  250           /* character for right side of the board */

#define CRUNCH_CHAR1  BLOCK_ORANGE      /* when a line is crunched, it's filled orange first */
#define CRUNCH_CHAR2  BLOCK_BLACK       /* and then is erased with black */

#define COLLIDES     1
#define NOT_COLLIDES 0

/* keyboard defititions */
#define KEY_LEFT   'J'
#define KEY_RIGHT  'L'
#define KEY_DOWN   'K'
#define KEY_DROP   ' '
#define KEY_ROTATE 'I'

#define COUNTER_MAX            2000    /* the speed counter at level 0 */
#define COUNTER_FACTOR         10      /* speed decrease factor: speed -= speed / factor */
#define KEY_REPEAT_COUNTER_MAX 400     /* key autorepeat timer value */

/* a piece drawn on the screen */
typedef struct {
   byte *screen_pos;
   byte piece;
   byte angle;
} sprite;

/* some prototypes */
void erasepiece(sprite *pl);
byte generate_new_piece();
void drawpiece(sprite *pl);
byte collides(sprite *pl);
void check_crunched_lines();
byte player_input();
void updateScore();
void levelLoop();

/* all the tetrominos (L,J,T,I,O,S,Z) in the 4 possible rotations */

byte pieces_data[7*4*4] = {
   // L
   NCOLS+1,NCOLS+2,NCOLS+3,NCOLS+NCOLS+1,
   2,NCOLS+2,NCOLS+NCOLS+2,NCOLS+NCOLS+3,
   3,NCOLS+1,NCOLS+2,NCOLS+3,
   1,2,NCOLS+2,NCOLS+NCOLS+2,
   // J
   NCOLS+1,NCOLS+2,NCOLS+3,NCOLS+NCOLS+3,
   1+ 1,1+ 2,1+NCOLS+1,1+NCOLS+NCOLS+1,
   1+ 0,1+NCOLS,1+NCOLS+1,1+NCOLS+2,
   1+ 1,1+NCOLS+1,1+NCOLS+NCOLS,1+NCOLS+NCOLS+1,
   // T
   1,NCOLS,NCOLS+1,NCOLS+2,
   1,NCOLS,NCOLS+1,NCOLS+NCOLS+1,
   NCOLS,NCOLS+1,NCOLS+2,NCOLS+NCOLS+1,
   1,NCOLS+1,NCOLS+2,NCOLS+NCOLS+1,
   // I
   NCOLS,NCOLS+1,NCOLS+2,NCOLS+3,
   1,NCOLS+1,NCOLS+NCOLS+1,NCOLS+NCOLS+NCOLS+1,
   NCOLS,NCOLS+1,NCOLS+2,NCOLS+3,
   1,NCOLS+1,NCOLS+NCOLS+1,NCOLS+NCOLS+NCOLS+1,
   // O
   1,2,1+NCOLS,2+NCOLS,
   1,2,1+NCOLS,2+NCOLS,
   1,2,1+NCOLS,2+NCOLS,
   1,2,1+NCOLS,2+NCOLS,
   // S
   1+1,1+ 2,1+NCOLS,1+NCOLS+1,
   1+0,1+NCOLS,1+NCOLS+1,1+NCOLS+NCOLS+1,
   1+1,1+ 2,1+NCOLS,1+NCOLS+1,
   1+0,1+NCOLS,1+NCOLS+1,1+NCOLS+NCOLS+1,
   // Z
   1+0,1+ 1,1+NCOLS+1,1+NCOLS+2,
   1+1,1+NCOLS,1+NCOLS+1,1+NCOLS+NCOLS,
   1+0,1+ 1,1+NCOLS+1,1+NCOLS+2,
   1+1,1+NCOLS,1+NCOLS+1,1+NCOLS+NCOLS
};

// tetrominos colors L,J,T,I,O,S,Z
byte fill_char[7] = {
   BLOCK_WHITE,    // L is orange in the original tetris, but here is white
   BLOCK_BLUE,
   BLOCK_MAGENTA,
   BLOCK_CYAN,
   BLOCK_YELLOW,
   BLOCK_GREEN,
   BLOCK_RED
};

sprite piece_preview;    /* the "next" piece */
sprite player;           /* the piece moved by the player */

word drop_counter;       /* counter used to set the pace */
word drop_counter_max;

byte screen_buffer[NROWS*NCOLS];   /* screen double buffer, all drawings are done in it */
byte screen_buffer_ready = 0;      /* when 1 the screen_buffer is displayed on the screen by the interrupt routine */

long int score;           /* player's score */
int level;                /* level */
int lines_remaining;      /* lines to complete the level */
int total_lines;          /* total number of lines */

/* utility to print strings on the screen buffer */
byte reverse = 0;
void printat(byte x, byte y, char *s) {
   byte *ptr = screen_buffer + y*NCOLS + x;
   while(*s != NULL) {
      byte ch = *s++;
      if(ch>64 && ch<96) ch-=64;
      if(ch>='a' && ch<='z') ch-=32;
      if(reverse) ch+=64;
      *ptr++ = ch;
   }
}

// Interrupt handler. The interrupt is triggered by the video display controller
// at the end of every frame. The handler's purpose is to copy the screen double buffer
// on the actual screen; it does that when the raster is drawing the borders,
// so the annoying "snow" effect is avoided.

void interrupt_handler() {
   if(!screen_buffer_ready) return;
   memcpy((byte *)VIDEO, screen_buffer, NROWS*NCOLS);
   screen_buffer_ready = 0;
}

// installs or deinstalls the interrupt handler
void install_interrupt(byte disable) {
   byte *ptr = (byte *) 0x787d;   /* address in RAM where the CPU jumps at every interrupt */
   if(disable) {
      // write a RET instruction
      *ptr = 0xC9;
   }
   else {
      // write a JP interrupt_handler instruction
      *(ptr+1) = ((word) interrupt_handler) & 0xFF;
      *(ptr+2) = ((word) interrupt_handler) >> 8;
      *ptr = 0xC3;
   }
}

// waits until the screen_buffer has been copied on the scree by the interrupt routine
void wait_interrupt() {
   while(screen_buffer_ready);
}

// writes a character on the screen buffer
void xputc(byte x, byte y, byte ch) {
   screen_buffer[y*NCOLS + x] = ch;
}

// generate a new piece after the last one can no longer move
// piece is taken from the "next" which in turn is generated randomly
// returns "COLLIDES" if a new piece can't be generated (the board is full)

byte generate_new_piece() {
   erasepiece(&piece_preview);

   player.piece = piece_preview.piece;
   player.angle = piece_preview.angle;
   player.screen_pos = (byte *) screen_buffer + STARTBOARD + 3;

   piece_preview.piece = rand() % NUMPIECES;
   piece_preview.angle = rand() % 4;

   drawpiece(&piece_preview);

   if(collides(&player)) {
      return COLLIDES;
   } else {
      drawpiece(&player);
      return NOT_COLLIDES;
   }
}

// the main game loop, exits when GAME OVER
// if the speed counter reaches its max then the piece is automatically pushed down 1 position
// else lets the player move the piece with keyboard/joystick commands
void gameLoop() {
   while(1) {
      if(drop_counter++==drop_counter_max) {
         drop_counter = 0;
         erasepiece(&player);
         player.screen_pos+=NCOLS;
         if(collides(&player)) {
            player.screen_pos-=NCOLS;
            drawpiece(&player);
            check_crunched_lines();
            if(generate_new_piece()==COLLIDES) return;
         }
         else {
            drawpiece(&player);
         }
         screen_buffer_ready = 1;   /* forces display of the screen buffer */
      }
      else {
         byte key = player_input();
         if(key != 0) {
            erasepiece(&player);
            if(key == KEY_LEFT) {
               player.screen_pos--;
               if(collides(&player)) player.screen_pos++;
            }
            else if(key == KEY_RIGHT) {
               player.screen_pos++;
               if(collides(&player)) player.screen_pos--;
            }
            else if(key == KEY_DOWN) {
               drop_counter = drop_counter_max;
            }
            else if(key == KEY_DROP) {
               // animate the falling piece
               while(1)
               {
                  erasepiece(&player);
                  player.screen_pos+=NCOLS;
                  if(collides(&player)) {
                     player.screen_pos-=NCOLS;
                     break;
                  }
                  drawpiece(&player);
                  screen_buffer_ready = 1;
                  wait_interrupt();
               }
               drop_counter=drop_counter_max;
            }
            else if(key == KEY_ROTATE) {
               byte oldangle = player.angle;
               player.angle = (player.angle + 1) & 3;
               if(collides(&player)) player.angle = oldangle;
            }
            drawpiece(&player);
            screen_buffer_ready = 1;     /* forces display of the screen buffer */
         }
      }
   }
}

// given a piece number and an angle returns the 4 byte "offsets" of the piece
inline byte *get_piece_offsets(byte piece, byte angle) {
   return &pieces_data[piece*16+angle*4];
}

// draw a piece on the screen buffer
void drawpiece(sprite *pl) {
   byte *data = get_piece_offsets(pl->piece, pl->angle);
   byte fc = fill_char[pl->piece];
   byte *pos = pl->screen_pos;
   for(byte t=0; t<4; t++) {
      *(pos+data[t]) = fc;
   }
}

// erase piece from the screen buffer
void erasepiece(sprite *pl) {
   byte *rotated_piece = get_piece_offsets(pl->piece, pl->angle);
   byte fc = fill_char[pl->piece];
   byte *pos = pl->screen_pos;
   for(byte t=0; t<4; t++) {
      *(pos+rotated_piece[t]) = BLANK_CHAR;
   }
}

// returns 1 if the piece collides with something
byte collides(sprite *pl) {
   byte *rotated_piece = get_piece_offsets(pl->piece, pl->angle);
   for(byte t=0; t<4; t++) {
      byte *pos = pl->screen_pos + rotated_piece[t];
      if(pos > (screen_buffer + NROWS*NCOLS)) return 1; // always collides with the bottom of the screen
      if(*pos != BLANK_CHAR) return 1;
   }
   return 0;
}

// returns 1 if the line is all filled
byte is_line_filled(byte line) {
   byte *ptr = screen_buffer + line * NCOLS + STARTBOARD;
   for(int t=0;t<10;t++) {
      if(*ptr++==BLANK_CHAR) return 0;
   }
   return 1;
}

// scroll down the board by 1 position from top to specified line
void scroll_down(byte endline) {
   for(byte line=endline;line>0;line--) {
      byte *above = screen_buffer + (line-1) * NCOLS + STARTBOARD;
      byte *below = screen_buffer + (line  ) * NCOLS + STARTBOARD;
      memcpy(below, above, 10);
   }
   // clears the top line
   memset(screen_buffer+STARTBOARD, BLANK_CHAR, 10);

   // sound effect
   bit_fx3(0);
}

// fills the specified line with an empty character ("crunch")
void crunch_line(byte line, byte ch) {
   byte *ptr = screen_buffer + line * NCOLS + STARTBOARD;
   memset(ptr, ch, 10);
}

byte lines_cruched[NROWS];   /* stores which lines have been crunched */

int scores[5] = {0, 40, 100, 300, 1200};   /* variable score on number of lines crunched */

// checks if player has made complete lines and "crunches" them
void check_crunched_lines() {
   byte num_lines_crunched = 0;

   // mark complete lines
   for(byte line=15;line>0;line--) {
      lines_cruched[line] = is_line_filled(line);
      if(lines_cruched[line]) {
         crunch_line(line, CRUNCH_CHAR1);
         num_lines_crunched++;
      }
   }

   // wait 5 frames so the effect is visible
   for(byte t=1; t<10; t++) {
      screen_buffer_ready = 1;
      wait_interrupt();
   }

   // assign score
   score += scores[num_lines_crunched] * (level+1);
   lines_remaining -= num_lines_crunched;
   total_lines += num_lines_crunched;

   // advance level
   if(lines_remaining <= 0) {
      level = level + 1;
      lines_remaining += 10;
      drop_counter_max -= drop_counter_max/COUNTER_FACTOR;
      vz_bgrd((level+1)&1); // flips between green and orange on each level
   }

   // update score
   if(num_lines_crunched > 0) {
      updateScore();
   }

   // marks the lines crunched with another character
   for(byte line=0;line<NROWS;line++) {
      if(lines_cruched[line]) {
         crunch_line(line,CRUNCH_CHAR2);
      }
   }

   // wait 5 frames so the effect is visible
   for(byte t=1; t<10; t++) {
      screen_buffer_ready = 1;
      wait_interrupt();
   }

   // compact the heap of tetrominos, removing empty lines
   for(byte line=0;line<NROWS;line++) {
      if(lines_cruched[line]) {
         scroll_down(line);
         screen_buffer_ready = 1;
         wait_interrupt();
      }
   }
}

// update score table
char tmp[32];
void updateScore() {
   printat(0,0,"SCORE");
   sprintf(tmp," %ld ",score);
   printat(0,2,tmp);

   printat(0,5,"LINES    ");
   sprintf(tmp,"%d ",total_lines);
   printat(7,5,tmp);

   printat(0,7,"LEVEL    ");
   sprintf(tmp,"%d ",level);
   printat(7,7,tmp);
}

// clears the screen buffer with a character
void fill_screen(byte ch) {
   memset(screen_buffer, ch, NROWS*NCOLS);
}

// draws the board
void drawPlayground() {
   // fill screen
   fill_screen(BLANK_CHAR);

   // draw tetris board
   for(word t=0; t<NROWS; t++) {
      xputc(STARTBOARD-1,t,BOARD_CHAR_LEFT);
      xputc(ENDBOARD+1  ,t,BOARD_CHAR_RIGHT);
   }

   printat(0,10,"NEXT");
}

// initializes a new game
void initGame() {
   level = 0;
   score = 0;
   total_lines = 0;
   lines_remaining = 10;
   drop_counter_max = COUNTER_MAX;

   drawPlayground();
   updateScore();

   piece_preview.screen_pos = screen_buffer + 12 * NCOLS;

   // generate pieces twice: one for "next" and one for player
   generate_new_piece();
   erasepiece(&player);
   generate_new_piece();
   drawpiece(&player);
   screen_buffer_ready = 1;   // force display of screen buffer
}

// keyboard scan codes
#define SCANCODE_I    0xBF08
#define SCANCODE_J    0x7F20
#define SCANCODE_K    0x7F08
#define SCANCODE_L    0x7F02
#define SCANCODE_SPC  0xEF10
#define SCANCODE_RETN 0xBF04
#define SCANCODE_Z    0xFB10

// test a specific scancode on the memory mapped I/O
inline byte test_key(word scancode) {
   byte *addr = (byte *)(0x6800+(scancode >> 8));
   if((*addr & (scancode & 0xFF))==0) return 1;
   else return 0;
}

// reads the joystick simulating keyboard keys
byte read_joystick() {
   static __sfr __at 0x20 joy_present;  // I/O port for checking if joy is present
   static __sfr __at 0x2e joystick;     // I/O joystick port, 4 directions + fire
   static __sfr __at 0x2d arm_button;   // I/O joystick port, alternate fire button ("arm")

   if(joy_present == 0x20) return 0;    // check if joystick is present

        if(!(joystick   &  1)) return 'I'; // up
   else if(!(joystick   &  2)) return 'K'; // down
   else if(!(joystick   &  4)) return 'J'; // left
   else if(!(joystick   &  8)) return 'L'; // right
   else if(!(joystick   & 16)) return 'I'; // fire
   else if(!(arm_button & 16)) return ' '; // arm
   else return 0;
}

// reads the keyboard and return the key pressed
byte read_keyboard() {
        if(test_key(SCANCODE_I  )) return 'I';
   else if(test_key(SCANCODE_J  )) return 'J';
   else if(test_key(SCANCODE_K  )) return 'K';
   else if(test_key(SCANCODE_L  )) return 'L';
   else if(test_key(SCANCODE_SPC)) return ' ';
   else if(test_key(SCANCODE_Z  )) return ' ';   // alternate drop key for VZ200 (which has a small rightside space key)
   else return 0;
}

// handle player input, implementing key autorepeat
// for all keys except "rotate" and "drop"

byte player_input() {
   static byte last_key = 0;
   static int repeat_counter = 0;

   byte key = read_keyboard() | read_joystick();

   if(key == 'J' || key == 'L' || key == 'K') {
      repeat_counter++;
      if(repeat_counter == KEY_REPEAT_COUNTER_MAX) {
         repeat_counter = 0;
         last_key = 0;
      }
   }
   else repeat_counter = 0;

   if(key == last_key) return 0;
   last_key = key;
   return key;
}

// the TETRIS title logo (6 rows)
byte big_title[6*32] = {
   0x80, 0x83, 0x83, 0x83, 0x83, 0x82, 0xa1, 0xa3, 0xa3, 0xa3, 0xa3, 0x80, 0x93, 0x93, 0x93, 0x93,
   0x92, 0xb1, 0xb3, 0xb3, 0xb3, 0xb3, 0x80, 0xc1, 0xc3, 0x80, 0xd1, 0xd3, 0xd3, 0xd3, 0xd3, 0x80,
   0x80, 0x8f, 0x8f, 0x8f, 0x8f, 0x8a, 0xa5, 0xaf, 0xaf, 0xaf, 0xaf, 0x80, 0x9f, 0x9f, 0x9f, 0x9f,
   0x9a, 0xb5, 0xbf, 0xbf, 0xbf, 0xbf, 0x80, 0xc5, 0xcf, 0x80, 0xd5, 0xdf, 0xdf, 0xdf, 0xdf, 0x80,
   0x80, 0x80, 0x85, 0x8f, 0x80, 0x80, 0x80, 0x80, 0xa3, 0xa7, 0xaf, 0x80, 0x80, 0x95, 0x9f, 0x80,
   0x80, 0xb5, 0xbf, 0xb3, 0xb7, 0xbf, 0x80, 0xc1, 0xc3, 0x80, 0xd5, 0xdf, 0xd3, 0xd3, 0xd3, 0x80,
   0x80, 0x80, 0x85, 0x8f, 0x80, 0x80, 0x80, 0x80, 0xaf, 0xaf, 0xaf, 0x80, 0x80, 0x95, 0x9f, 0x80,
   0x80, 0xb5, 0xbf, 0xbf, 0xbf, 0xbe, 0x80, 0xc5, 0xcf, 0x80, 0xd5, 0xdf, 0xdf, 0xdf, 0xdf, 0x80,
   0x80, 0x80, 0x85, 0x8f, 0x80, 0x80, 0xa1, 0xa3, 0xa3, 0xa7, 0xaf, 0x80, 0x80, 0x95, 0x9f, 0x80,
   0x80, 0xb5, 0xbf, 0x80, 0xb5, 0xbf, 0x80, 0xc5, 0xcf, 0x80, 0xd1, 0xd3, 0xd3, 0xd7, 0xdf, 0x80,
   0x80, 0x80, 0x85, 0x8f, 0x80, 0x80, 0xa5, 0xaf, 0xaf, 0xaf, 0xaf, 0x80, 0x80, 0x95, 0x9f, 0x80,
   0x80, 0xb5, 0xbf, 0x80, 0xb5, 0xbf, 0x80, 0xc5, 0xcf, 0x80, 0xd5, 0xdf, 0xdf, 0xdf, 0xdf, 0x80
};

// introduction screen
void introScreen() {
   vz_bgrd(BACKGROUND_ORANGE);

   fill_screen(128);

   // display the TETRIS logo
   memcpy(screen_buffer, big_title, sizeof(big_title));

   printat(5,9, "(C) 2021 ANTONINO PORCINO");
   printat(4,13,"USE IJKL SPACE OR JOYSTICK");
   printat(7,15,"PRESS RETURN TO START");
   screen_buffer_ready = 1;

   // wait for key released
   while(test_key(SCANCODE_RETN));

   // wait for key press
   while(!test_key(SCANCODE_RETN)) {
      rand();  // extract random numbers, making rand() more "random"
   }
}

// displays "game over" and waits for return key
void gameOver() {
   bit_fx2(7);  // sound effect

   reverse = 1;
   printat(STARTBOARD-2,NROWS/2-1,"              ");
   printat(STARTBOARD-2,NROWS/2-0,"   GAME OVER  ");
   printat(STARTBOARD-2,NROWS/2+1,"              ");
   reverse = 0;

   screen_buffer_ready = 1;

   while(!test_key(SCANCODE_RETN));
}

int main() {
   screen_buffer_ready = 0;
   install_interrupt(0);
   while(1) {
      introScreen();
      initGame();
      gameLoop();
      gameOver();
   }
}


