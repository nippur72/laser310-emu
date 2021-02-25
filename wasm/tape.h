#include "utils.h"

#include <malloc.h>

typedef struct {
   byte *buffer;
   int size;
   int ptr;
   bool active;
   int sample_rate;
   double tick_counter;
   double cycles_per_sample;
   byte bit;
} tape_buffer_t;

typedef struct {
   tape_buffer_t load;
   tape_buffer_t save;
} tape_t;

void tape_init_load(tape_t *tape, int size, int cpu_clock, int sample_rate) {
   tape_buffer_t *load = &tape->load;
   load->buffer = (byte *) malloc(size);
   load->size = size;
   load->sample_rate = sample_rate;
   load->cycles_per_sample = cpu_clock / sample_rate;
   load->active = false;
}

void tape_load_data(tape_t *tape, int index, byte data) {
   tape->load.buffer[index] = data;
}

void tape_playback(tape_t *tape) {
   tape_buffer_t *load = &tape->load;
   load->ptr = 0;
   load->tick_counter = 0;
   load->active = true;
}

void tape_stop_playback(tape_t *tape) {
   tape_buffer_t *load = &tape->load;
   if(load->buffer != NULL) free(load->buffer);
   load->buffer = NULL;
   load->ptr = 0;
   load->tick_counter = 0;
   load->bit = 0;
   load->active = false;
}

void tape_load_tick(tape_t *tape, int ticks) {
   tape_buffer_t *load = &tape->load;

   // do nothing if tape is stopped
   if(!load->active) return;

   // check EOF
   if(load->ptr >= load->size) {
       tape_stop_playback(tape);
       return;
   }

   load->tick_counter += ticks;
   if(load->tick_counter > load->cycles_per_sample) {
      load->tick_counter -= load->cycles_per_sample;
      load->bit = load->buffer[load->ptr] ? 1 : 0;
      load->ptr++;
   }
}

void tape_reset(tape_t *tape) {
    tape_stop_playback(tape);
    tape->save.active = false;
}
