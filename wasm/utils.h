
#ifndef _UTILS_H
#define _UTILS_H

#include <stdint.h>
#include <stdbool.h>

#include <emscripten/emscripten.h>

typedef uint8_t byte;
typedef uint16_t word;

#define BITSET(a,b)     ((a) |= (b))
#define BITRESET(a,b)   ((a) &= (~b))
#define IS_ONE(a,b)     ((a) & (b))
#define IS_ZERO(a,b)    (((a) & (b))==0)

#define KEEP EMSCRIPTEN_KEEPALIVE
//#define KEEP

#endif