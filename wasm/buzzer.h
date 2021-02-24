#include <emscripten/emscripten.h>

typedef struct {
   int BUFSIZE;
   int CPU_CLOCK;
   int SAMPLE_RATE;
   double TICKS_PER_SAMPLE;
   float *audio_buf;
   int ptr;
   double tick_counter;
} buzzer_t;

float buzzer_audio_buf[4096];

void buzzer_init(buzzer_t *buz) {
   buz->BUFSIZE = 4096;
   buz->CPU_CLOCK = 3580000;
   buz->SAMPLE_RATE = 48000;
   buz->TICKS_PER_SAMPLE = ((double)(buz->CPU_CLOCK / buz->SAMPLE_RATE));
   buz->audio_buf = buzzer_audio_buf;
   buz->ptr = 0;
   buz->tick_counter = 0;
}

void buzzer_ticks(buzzer_t *buz, int ticks, float sample) {
   for(int t=0; t<ticks; t++) {
      buz->tick_counter++;
      if(buz->tick_counter > buz->TICKS_PER_SAMPLE) {
         buz->tick_counter -= buz->TICKS_PER_SAMPLE;
         buz->audio_buf[buz->ptr++] = sample;
         if(buz->ptr == buz->BUFSIZE) {
            buz->ptr = 0;
            uint8_t risp = (uint8_t) EM_ASM_INT({ return ay38910_audio_buf_ready($0, $1); }, buz->audio_buf, buz->BUFSIZE);
         }
      }
   }
}
