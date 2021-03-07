#define CHIPS_ASSERT(c) (1)

#include "laser310.h"

float buzzer_audio_buf[4096];
uint32_t mc_display_buffer[MC6847_DISPLAY_WIDTH*MC6847_DISPLAY_HEIGHT];

laser310_t l310;
laser310_desc_t sysdesc;

void debugBefore() { byte unused = (byte) EM_ASM_INT({ if(debugBefore!== undefined) debugBefore(); }, 0); }
void debugAfter()  { byte unused = (byte) EM_ASM_INT({ if(debugAfter !== undefined) debugAfter();  }, 0); }

KEEP
void sys_set_debug(bool v) { l310.debug = v; }

// callback called when audio buffer is full with samples
void audio_buffer_ready(float *samples, int size) {
   uint8_t risp = (uint8_t) EM_ASM_INT({ return ay38910_audio_buf_ready($0, $1); }, samples, size);
}

// callback called when a video frame is ready
void screen_update(uint32_t *buffer) {
   byte unused = (byte) EM_ASM_INT({ vdp_screen_update_mc($0); }, buffer );
}

void printer_write(byte port, byte data) {
   if(port == 0x0d) {
      byte unused = (byte) EM_ASM_INT({ printerWrite($0); }, data );
   }
}

byte printer_readst(byte port) {
   return (byte) EM_ASM_INT({ return printerReady; });
}

KEEP
int sys_ticks(int ncycles) {

   int elapsed = 0;
   while(elapsed < ncycles) {
      elapsed += laser310_tick(&l310);
   }
   return elapsed;
}


KEEP
void sys_init() {
   sysdesc.cpu_clock = 3546900;
   sysdesc.sample_rate = 48000;
   sysdesc.audio_buf = buzzer_audio_buf;
   sysdesc.audio_buf_size = 4096;
   sysdesc.buffer_ready_cb = audio_buffer_ready;
   sysdesc.display_buffer = mc_display_buffer;
   sysdesc.display_buffer_size = sizeof(mc_display_buffer); // *2 if interlaced
   sysdesc.screen_update_cb = screen_update;
   sysdesc.printer_readst = printer_readst;
   sysdesc.printer_write = printer_write;
   sysdesc.debug_before = debugBefore;
   sysdesc.debug_after = debugAfter;
   laser310_init(&l310, &sysdesc);
}

KEEP
void sys_reset() {
   laser310_reset(&l310);
}

KEEP
void rom_load(word address, byte value) {
   l310.rom[address] = value;
}

KEEP
void cpu_reset() {
   laser310_reset(&l310);
}

KEEP uint8_t get_z80_a()         { return z80_a(&l310.cpu); }
KEEP uint8_t get_z80_f()         { return z80_f(&l310.cpu); }
KEEP uint8_t get_z80_l()         { return z80_l(&l310.cpu); }
KEEP uint8_t get_z80_h()         { return z80_h(&l310.cpu); }
KEEP uint8_t get_z80_e()         { return z80_e(&l310.cpu); }
KEEP uint8_t get_z80_d()         { return z80_d(&l310.cpu); }
KEEP uint8_t get_z80_c()         { return z80_c(&l310.cpu); }
KEEP uint8_t get_z80_b()         { return z80_b(&l310.cpu); }
KEEP uint16_t get_z80_fa()       { return z80_fa(&l310.cpu); }
KEEP uint16_t get_z80_af()       { return z80_af(&l310.cpu); }
KEEP uint16_t get_z80_hl()       { return z80_hl(&l310.cpu); }
KEEP uint16_t get_z80_de()       { return z80_de(&l310.cpu); }
KEEP uint16_t get_z80_bc()       { return z80_bc(&l310.cpu); }
KEEP uint16_t get_z80_fa_()      { return z80_fa_(&l310.cpu); }
KEEP uint16_t get_z80_af_()      { return z80_af_(&l310.cpu); }
KEEP uint16_t get_z80_hl_()      { return z80_hl_(&l310.cpu); }
KEEP uint16_t get_z80_de_()      { return z80_de_(&l310.cpu); }
KEEP uint16_t get_z80_bc_()      { return z80_bc_(&l310.cpu); }
KEEP uint16_t get_z80_sp()       { return z80_sp(&l310.cpu); }
KEEP uint16_t get_z80_iy()       { return z80_iy(&l310.cpu); }
KEEP uint16_t get_z80_ix()       { return z80_ix(&l310.cpu); }
KEEP uint16_t get_z80_wz()       { return z80_wz(&l310.cpu); }
KEEP uint16_t get_z80_pc()       { return z80_pc(&l310.cpu); }
KEEP uint16_t get_z80_ir()       { return z80_ir(&l310.cpu); }
KEEP uint8_t get_z80_i()         { return z80_i(&l310.cpu); }
KEEP uint8_t get_z80_r()         { return z80_r(&l310.cpu); }
KEEP uint8_t get_z80_im()        { return z80_im(&l310.cpu); }
KEEP bool get_z80_iff1()         { return z80_iff1(&l310.cpu); }
KEEP bool get_z80_iff2()         { return z80_iff2(&l310.cpu); }
KEEP bool get_z80_ei_pending()   { return z80_ei_pending(&l310.cpu); }

KEEP void set_z80_a(uint8_t v)         { z80_set_a(&l310.cpu, v); }
KEEP void set_z80_f(uint8_t v)         { z80_set_f(&l310.cpu, v); }
KEEP void set_z80_l(uint8_t v)         { z80_set_l(&l310.cpu, v); }
KEEP void set_z80_h(uint8_t v)         { z80_set_h(&l310.cpu, v); }
KEEP void set_z80_e(uint8_t v)         { z80_set_e(&l310.cpu, v); }
KEEP void set_z80_d(uint8_t v)         { z80_set_d(&l310.cpu, v); }
KEEP void set_z80_c(uint8_t v)         { z80_set_c(&l310.cpu, v); }
KEEP void set_z80_b(uint8_t v)         { z80_set_b(&l310.cpu, v); }
KEEP void set_z80_af(uint16_t v)       { z80_set_af(&l310.cpu, v); }
KEEP void set_z80_fa(uint16_t v)       { z80_set_fa(&l310.cpu, v); }
KEEP void set_z80_hl(uint16_t v)       { z80_set_hl(&l310.cpu, v); }
KEEP void set_z80_de(uint16_t v)       { z80_set_de(&l310.cpu, v); }
KEEP void set_z80_bc(uint16_t v)       { z80_set_bc(&l310.cpu, v); }
KEEP void set_z80_fa_(uint16_t v)      { z80_set_fa_(&l310.cpu, v); }
KEEP void set_z80_af_(uint16_t v)      { z80_set_af_(&l310.cpu, v); }
KEEP void set_z80_hl_(uint16_t v)      { z80_set_hl_(&l310.cpu, v); }
KEEP void set_z80_de_(uint16_t v)      { z80_set_de_(&l310.cpu, v); }
KEEP void set_z80_bc_(uint16_t v)      { z80_set_bc_(&l310.cpu, v); }
KEEP void set_z80_sp(uint16_t v)       { z80_set_sp(&l310.cpu, v); }
KEEP void set_z80_iy(uint16_t v)       { z80_set_iy(&l310.cpu, v); }
KEEP void set_z80_ix(uint16_t v)       { z80_set_ix(&l310.cpu, v); }
KEEP void set_z80_wz(uint16_t v)       { z80_set_wz(&l310.cpu, v); }
KEEP void set_z80_pc(uint16_t v)       { z80_set_pc(&l310.cpu, v); }
KEEP void set_z80_ir(uint16_t v)       { z80_set_ir(&l310.cpu, v); }
KEEP void set_z80_i(uint8_t v)         { z80_set_i(&l310.cpu, v); }
KEEP void set_z80_r(uint8_t v)         { z80_set_r(&l310.cpu, v); }
KEEP void set_z80_im(uint8_t v)        { z80_set_im(&l310.cpu, v); }
KEEP void set_z80_iff1(bool b)         { z80_set_iff1(&l310.cpu, b); }
KEEP void set_z80_iff2(bool b)         { z80_set_iff2(&l310.cpu, b); }
KEEP void set_z80_ei_pending(bool b)   { z80_set_ei_pending(&l310.cpu, b); }

KEEP
byte mem_read(uint16_t address) {
    return laser310_mem_read(&l310, address);
}

KEEP
void mem_write(word address, byte value) {
   laser310_mem_write(&l310, address, value);
}

KEEP
byte io_read(word ioport) {
   return laser310_io_read(&l310, ioport);
}

KEEP
void io_write(word port, byte value) {
   laser310_io_write(&l310, port, value);
}

byte led_read(byte port)  {
   return EM_ASM_INT({ return led_read(); }, 0);
}

void led_write(byte port, byte value) {
   byte unused = (byte) EM_ASM_INT({ led_write($0); }, value);
}

KEEP
void sys_keyboard_reset() {
   keyboard_reset(&l310.kbd);
}

KEEP
void sys_keyboard_press(byte row, byte col) {
   keyboard_press(&l310.kbd, row, col);
}

KEEP
void sys_keyboard_release(byte row, byte col) {
   keyboard_release(&l310.kbd, row, col);
}

// === TAPE ===

KEEP
void sys_tape_init_load(int size, int sample_rate) {
   tape_init_load(&l310.tape, size, l310.cpu_clock, sample_rate);
}

KEEP
void sys_tape_load_data(int index, float sample) {
   tape_load_data(&l310.tape, index, sample);
}

KEEP
void sys_tape_play() {
   tape_play(&l310.tape);
}

void csave_cb(float *samples, int size, int samplerate) {
   byte unused = (byte) EM_ASM_INT({ csave_cb($0, $1, $2); }, samples, size, samplerate );
}

KEEP
void sys_tape_record() {
   int samplerate = 44100;
   int size = 15 * 60 * samplerate; // 15 min max
   tape_record(&l310.tape, size, l310.cpu_clock, samplerate, csave_cb);
}

KEEP
void sys_tape_stop(int index, byte sample) {
   tape_stop(&l310.tape);
}

// ===

KEEP
void sys_joystick(byte joy0, byte joy1) {
   laser310_joystick(&l310, joy0, joy1);
}

KEEP
int sys_total_cycles() {
   return l310.total_ticks;
}

KEEP
void sys_snow_effect(bool snow) {
   l310.snow_effect = snow;
}

