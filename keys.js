// all 76 keys on the real laser310 (C16 KEYBOARD)

const KEY_RESET     =  0; // not mapped on the I/O but directly on the /RES line to the CPU

const KEY_HELP      =  1;
const KEY_F3        =  2;
const KEY_F2        =  3;
const KEY_F1        =  4;
const KEY_AT        =  5;
const KEY_POUND     =  6;
const KEY_RETURN    =  7;
const KEY_INST_DEL  =  8;
const KEY_RIGHT     =  9;
const KEY_PLUS      = 10;
const KEY_EQUAL     = 11;
const KEY_ESC       = 12;
const KEY_SLASH     = 13;
const KEY_SEMICOLON = 14;
const KEY_ASTERISK  = 15;
const KEY_LEFT      = 16;
const KEY_UP        = 17;
const KEY_MINUS     = 18;
const KEY_COLON     = 19;
const KEY_DOT       = 20;
const KEY_COMMA     = 21;
const KEY_L         = 22;
const KEY_P         = 23;
const KEY_DOWN      = 24;
const KEY_0         = 25;
const KEY_O         = 26;
const KEY_K         = 27;
const KEY_M         = 28;
const KEY_N         = 29;
const KEY_J         = 30;
const KEY_I         = 31;
const KEY_9         = 32;
const KEY_8         = 33;
const KEY_U         = 34;
const KEY_H         = 35;
const KEY_B         = 36;
const KEY_V         = 37;
const KEY_G         = 38;
const KEY_Y         = 39;
const KEY_7         = 40;
const KEY_6         = 41;
const KEY_T         = 42;
const KEY_F         = 43;
const KEY_C         = 44;
const KEY_X         = 45;
const KEY_D         = 46;
const KEY_R         = 47;
const KEY_5         = 48;
const KEY_4         = 49;
const KEY_E         = 50;
const KEY_S         = 51;
const KEY_Z         = 52;
const KEY_SHIFT     = 53;
const KEY_A         = 54;
const KEY_W         = 55;
const KEY_3         = 56;
const KEY_2         = 57;
const KEY_Q         = 58;
const KEY_CBM       = 59;
const KEY_SPACE     = 60;
const KEY_RUN_STOP  = 61;
const KEY_CTRL      = 62;
const KEY_CLR_HOME  = 63;
const KEY_1         = 64;

const KA0 = 0;
const KA1 = 1;
const KA2 = 2;
const KA3 = 3;
const KA4 = 4;
const KA5 = 5;
const KA6 = 6;
const KA7 = 7;

const KB0 = 0; 
const KB1 = 1; 
const KB2 = 2; 
const KB3 = 3; 
const KB4 = 4; 
const KB5 = 5; 
const KB6 = 6; 
const KB7 = 7; 

const key_row_col = new Array(75); // hardware keys row and col info

function mapKey(key, row, col) {
   key_row_col[key] = { row, col };
}

mapKey( KEY_HELP      , KB7, KA7 );
mapKey( KEY_F3        , KB7, KA6 );
mapKey( KEY_F2        , KB7, KA5 );
mapKey( KEY_F1        , KB7, KA4 );
mapKey( KEY_AT        , KB7, KA3 );
mapKey( KEY_POUND     , KB7, KA2 );
mapKey( KEY_RETURN    , KB7, KA1 );
mapKey( KEY_INST_DEL  , KB7, KA0 );
mapKey( KEY_RIGHT     , KB6, KA7 );
mapKey( KEY_PLUS      , KB6, KA6 );
mapKey( KEY_EQUAL     , KB6, KA5 );
mapKey( KEY_ESC       , KB6, KA4 );
mapKey( KEY_SLASH     , KB6, KA3 );
mapKey( KEY_SEMICOLON , KB6, KA2 );
mapKey( KEY_ASTERISK  , KB6, KA1 );
mapKey( KEY_LEFT      , KB6, KA0 );
mapKey( KEY_UP        , KB5, KA7 );
mapKey( KEY_MINUS     , KB5, KA6 );
mapKey( KEY_COLON     , KB5, KA5 );
mapKey( KEY_DOT       , KB5, KA4 );
mapKey( KEY_COMMA     , KB5, KA3 );
mapKey( KEY_L         , KB5, KA2 );
mapKey( KEY_P         , KB5, KA1 );
mapKey( KEY_DOWN      , KB5, KA0 );
mapKey( KEY_0         , KB4, KA7 );
mapKey( KEY_O         , KB4, KA6 );
mapKey( KEY_K         , KB4, KA5 );
mapKey( KEY_M         , KB4, KA4 );
mapKey( KEY_N         , KB4, KA3 );
mapKey( KEY_J         , KB4, KA2 );
mapKey( KEY_I         , KB4, KA1 );
mapKey( KEY_9         , KB4, KA0 );
mapKey( KEY_8         , KB3, KA7 );
mapKey( KEY_U         , KB3, KA6 );
mapKey( KEY_H         , KB3, KA5 );
mapKey( KEY_B         , KB3, KA4 );
mapKey( KEY_V         , KB3, KA3 );
mapKey( KEY_G         , KB3, KA2 );
mapKey( KEY_Y         , KB3, KA1 );
mapKey( KEY_7         , KB3, KA0 );
mapKey( KEY_6         , KB2, KA7 );
mapKey( KEY_T         , KB2, KA6 );
mapKey( KEY_F         , KB2, KA5 );
mapKey( KEY_C         , KB2, KA4 );
mapKey( KEY_X         , KB2, KA3 );
mapKey( KEY_D         , KB2, KA2 );
mapKey( KEY_R         , KB2, KA1 );
mapKey( KEY_5         , KB2, KA0 );
mapKey( KEY_4         , KB1, KA7 );
mapKey( KEY_E         , KB1, KA6 );
mapKey( KEY_S         , KB1, KA5 );
mapKey( KEY_Z         , KB1, KA4 );
mapKey( KEY_SHIFT     , KB1, KA3 );
mapKey( KEY_A         , KB1, KA2 );
mapKey( KEY_W         , KB1, KA1 );
mapKey( KEY_3         , KB1, KA0 );
mapKey( KEY_2         , KB0, KA7 );
mapKey( KEY_Q         , KB0, KA6 );
mapKey( KEY_CBM       , KB0, KA5 );
mapKey( KEY_SPACE     , KB0, KA4 );
mapKey( KEY_RUN_STOP  , KB0, KA3 );
mapKey( KEY_CTRL      , KB0, KA2 );
mapKey( KEY_CLR_HOME  , KB0, KA1 );
mapKey( KEY_1         , KB0, KA0 );

// keyboard matrix (8x8)
// KAX = new Uint8Array(8).fill(0b11111111);

function keyboardReset() {
   //KAX = new Uint8Array(8).fill(0b11111111);
   keyboard_reset();
}

function keyPress(hardware_key) {   
   const { row, col } = key_row_col[hardware_key];
   keyboard_press(row,col);
   //KAX[row] = reset_bit(KAX[row], col);
}

function keyRelease(hardware_key) {
   const { row, col } = key_row_col[hardware_key];
   keyboard_release(row,col);
   //KAX[row] = set_bit(KAX[row], col);
}

/*
function keyboard_poll(address) 
{
   KB = address & 0xFF; 
   
   let KA = 0b11111111;
   for(let row=0; row<=KB7; row++) {
      if((KB & (1<<row)) === 0) {
        KA = KA & KAX[row];
      }
   }   
   
   // if(KA!==255) console.log(`in=${bin(address)} out=${bin(KA)}`);
   
   return KA;
}
*/
