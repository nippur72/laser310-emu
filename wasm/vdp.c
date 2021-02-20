#include "laser310.h"
#include "chips/mc6847.h"

mc6847_desc_t mc_desc;
mc6847_t mc;
uint32_t mc_display_buffer[MC6847_DISPLAY_WIDTH*MC6847_DISPLAY_HEIGHT];

//typedef uint64_t (*mc6847_fetch_t)(uint64_t pins, void* user_data);
uint64_t mc_fetch_cb(uint64_t pins, void* user_data) {
   uint16_t address = MC6847_GET_ADDR(pins);
   uint8_t byte = mem_read(0x7000+address);
   MC6847_SET_DATA(pins, byte);
   return pins;
}

void mc_screen_update_cb(uint32_t *buffer) {
   byte unused = (byte) EM_ASM_INT({ vdp_screen_update_mc($0); }, buffer );
}

void mc_init() {
    mc_desc.tick_hz = 3580000/2;                                               /* the CPU tick rate in hz */
    mc_desc.rgba8_buffer = mc_display_buffer;                                  /* pointer to an RGBA8 framebuffer where video image is written to */
    mc_desc.rgba8_buffer_size = MC6847_DISPLAY_WIDTH*MC6847_DISPLAY_HEIGHT*4;  /* size of rgba8_buffer in bytes (must be at least 320*244*4=312320 bytes) */
    mc_desc.fetch_cb = mc_fetch_cb;
    mc_desc.screen_update_cb = mc_screen_update_cb;

    mc6847_init(&mc, &mc_desc);
}

