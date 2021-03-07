#include "utils.h"

#include <malloc.h>

typedef void (csave_cb_t)(float *samples, int size, int samplerate);

typedef struct {
   float *buffer;
   int size;
   int ptr;
   bool active;
   int sample_rate;
   double tick_counter;
   double cycles_per_sample;
   float sample;
} tape_buffer_t;

typedef struct {
   tape_buffer_t load;
   tape_buffer_t save;
   csave_cb_t *csave_cb;
} tape_t;

// ========== CLOAD ============

// prepares for CLOAD
void tape_init_load(tape_t *tape, int size, int cpu_clock, int sample_rate) {
   tape_buffer_t *load = &tape->load;
   load->buffer = (float *) malloc(size * sizeof(float));
   load->size = size;
   load->sample_rate = sample_rate;
   load->cycles_per_sample = cpu_clock / sample_rate;
   load->active = false;
}

// sets WAV samples data on the CLOAD buffer
void tape_load_data(tape_t *tape, int index, float sample) {
   tape->load.buffer[index] = sample;
}

// play tape
void tape_play(tape_t *tape) {
   tape_buffer_t *load = &tape->load;
   load->ptr = 0;
   load->tick_counter = 0;
   load->active = true;
}

// ========== CSAVE ============

// starts CSAVE
void tape_record(tape_t *tape, int size, int cpu_clock, int sample_rate, csave_cb_t csave_cb) {
   tape_buffer_t *save = &tape->save;
   save->buffer = (float *) malloc(size * sizeof(float));
   save->size = size;
   save->sample_rate = sample_rate;
   save->cycles_per_sample = cpu_clock / sample_rate;
   save->active = true;

   tape->csave_cb = csave_cb;
}

// stop tape
void tape_stop(tape_t *tape) {
   tape_buffer_t *load = &tape->load;
   tape_buffer_t *save = &tape->save;

   // stop CLOAD
   if(load->active)
   {
      if(load->buffer != NULL) free(load->buffer);
      load->buffer = NULL;
      load->ptr = 0;
      load->tick_counter = 0;
      load->sample = 0;
      load->active = false;
   }

   // stop CSAVE
   if(save->active)
   {
      // sends filled buffer to caller
      if(tape->csave_cb != NULL && save->ptr != 0) {
         if(save->buffer != NULL) {
            tape->csave_cb(save->buffer, save->ptr, save->sample_rate);
            free(save->buffer);
            save->buffer = NULL;
         }
      }
      save->ptr = 0;
      save->tick_counter = 0;
      save->sample = 0;
      save->active = false;
      tape->csave_cb = NULL;
   }
}

// =============================

void tape_load_tick(tape_t *tape, int ticks) {
   tape_buffer_t *load = &tape->load;
   tape_buffer_t *save = &tape->save;

   // CLOAD
   if(load->active) {
      // check EOF
      if(load->ptr >= load->size) {
         tape_stop(tape);
         return;
      }

      load->tick_counter += ticks;
      if(load->tick_counter > load->cycles_per_sample) {
         load->tick_counter -= load->cycles_per_sample;
         load->sample = load->buffer[load->ptr];
         load->ptr++;
      }
   }

   // CSAVE
   if(save->active) {
      // check for EOF
      if(save->ptr < save->size) {
         // save tape into buffer
         save->tick_counter += ticks;
         if(save->tick_counter > save->cycles_per_sample) {
            save->tick_counter -= save->cycles_per_sample;
            save->buffer[save->ptr] = save->sample;
            save->ptr++;
         }
      } else {
         tape_stop(tape);
      }
   }
}

void tape_reset(tape_t *tape) {
   tape_stop(tape);
}
