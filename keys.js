// all 45 keys on the real Laser 310

export const KEY_RESET         =  0; // TODO remove ?
export const KEY_1             =  1;
export const KEY_2             =  2;
export const KEY_3             =  3;
export const KEY_4             =  4;
export const KEY_5             =  5;
export const KEY_6             =  6;
export const KEY_7             =  7;
export const KEY_8             =  8;
export const KEY_9             =  9;
export const KEY_0             = 10;
export const KEY_MINUS         = 11;
export const KEY_Q             = 12;
export const KEY_W             = 13;
export const KEY_E             = 14;
export const KEY_R             = 15;
export const KEY_T             = 16;
export const KEY_Y             = 17;
export const KEY_U             = 18;
export const KEY_I             = 19;
export const KEY_O             = 20;
export const KEY_P             = 21;
export const KEY_RETURN        = 22;
export const KEY_CTRL          = 23;
export const KEY_A             = 24;
export const KEY_S             = 25;
export const KEY_D             = 26;
export const KEY_F             = 27;
export const KEY_G             = 28;
export const KEY_H             = 29;
export const KEY_J             = 30;
export const KEY_K             = 31;
export const KEY_L             = 32;
export const KEY_SEMICOLON     = 33;
export const KEY_COLON         = 34;
export const KEY_SHIFT         = 35;
export const KEY_Z             = 36;
export const KEY_X             = 37;
export const KEY_C             = 38;
export const KEY_V             = 39;
export const KEY_B             = 40;
export const KEY_N             = 41;
export const KEY_M             = 42;
export const KEY_COMMA         = 43;
export const KEY_DOT           = 44;
export const KEY_SPACE         = 45;

// circuit lines that map on the address bus
const KA0 =  0;
const KA1 =  1;
const KA2 =  2;
const KA3 =  3;
const KA4 =  4;
const KA5 =  5;
const KA6 =  6;
const KA7 =  7;

// circuit lines that map on the data bus
const KD0 = 0;
const KD1 = 1;
const KD2 = 2;
const KD3 = 3;
const KD4 = 4;
const KD5 = 5;

const key_row_col = new Array(75); // hardware keys row and col info

function mapKey(key, row, col) {
   key_row_col[key] = { row, col };
}

mapKey(KEY_R            , KA0, KD5);
mapKey(KEY_Q            , KA0, KD4);
mapKey(KEY_E            , KA0, KD3);
mapKey(KEY_W            , KA0, KD1);
mapKey(KEY_T            , KA0, KD0);

mapKey(KEY_F            , KA1, KD5);
mapKey(KEY_A            , KA1, KD4);
mapKey(KEY_D            , KA1, KD3);
mapKey(KEY_CTRL         , KA1, KD2);
mapKey(KEY_S            , KA1, KD1);
mapKey(KEY_G            , KA1, KD0);

mapKey(KEY_V            , KA2, KD5);
mapKey(KEY_Z            , KA2, KD4);
mapKey(KEY_C            , KA2, KD3);
mapKey(KEY_SHIFT        , KA2, KD2);
mapKey(KEY_X            , KA2, KD1);
mapKey(KEY_B            , KA2, KD0);

mapKey(KEY_4            , KA3, KD5);
mapKey(KEY_1            , KA3, KD4);
mapKey(KEY_3            , KA3, KD3);
mapKey(KEY_2            , KA3, KD1);
mapKey(KEY_5            , KA3, KD0);

mapKey(KEY_M            , KA4, KD5);
mapKey(KEY_SPACE        , KA4, KD4);
mapKey(KEY_COMMA        , KA4, KD3);
mapKey(KEY_DOT          , KA4, KD1);
mapKey(KEY_N            , KA4, KD0);

mapKey(KEY_7            , KA5, KD5);
mapKey(KEY_0            , KA5, KD4);
mapKey(KEY_8            , KA5, KD3);
mapKey(KEY_MINUS        , KA5, KD2);
mapKey(KEY_9            , KA5, KD1);
mapKey(KEY_6            , KA5, KD0);

mapKey(KEY_U            , KA6, KD5);
mapKey(KEY_P            , KA6, KD4);
mapKey(KEY_I            , KA6, KD3);
mapKey(KEY_RETURN       , KA6, KD2);
mapKey(KEY_O            , KA6, KD1);
mapKey(KEY_Y            , KA6, KD0);

mapKey(KEY_J            , KA7, KD5);
mapKey(KEY_SEMICOLON    , KA7, KD4);
mapKey(KEY_K            , KA7, KD3);
mapKey(KEY_COLON        , KA7, KD2);
mapKey(KEY_L            , KA7, KD1);
mapKey(KEY_H            , KA7, KD0);

function keyboardReset() {
   laser310.keyboard_reset();
}

export function keyPress(hardware_key) {
   const { row, col } = key_row_col[hardware_key];
   laser310.keyboard_press(row,col);
}

export function keyRelease(hardware_key) {
   const { row, col } = key_row_col[hardware_key];
   laser310.keyboard_release(row,col);
}
