uint8_t ram[65536];
uint8_t rom[65536];

EMSCRIPTEN_KEEPALIVE
uint8_t mem_read(uint16_t address) {
    if(address < 0x6800)
    {
        return rom[address];
    }
    // TODO mapped IO
    else
    {
        return ram[address];
    }
}

EMSCRIPTEN_KEEPALIVE
void mem_write(uint16_t address, uint8_t value) {
    if(address < 0x6800) return;
    ram[address] = value;
}

EMSCRIPTEN_KEEPALIVE
void rom_load(uint16_t address, uint8_t value) {
    rom[address] = value;
}
