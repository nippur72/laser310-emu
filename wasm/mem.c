#include "utils.h"

extern laser310_t l310;
extern byte laser310_mem_read(laser310_t *sys, uint16_t address);
extern void laser310_mem_write(laser310_t *sys, word address, byte value);

KEEP
byte mem_read(uint16_t address) {
    return laser310_mem_read(&l310, address);
}

KEEP
void mem_write(word address, byte value) {
   laser310_mem_write(&l310, address, value);
}
