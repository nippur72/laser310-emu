
typedef void (*buzzer_audio_ready_cb)();

typedef struct {
   int cpu_clock;
   int sample_rate;
   double ticks_per_sample;
   float *audio_buf;
   int audio_buf_size;
   int ptr;
   double tick_counter;
   float last_sample;
   buzzer_audio_ready_cb buffer_ready_cb;
} buzzer_t;

typedef struct {
   int cpu_clock;
   int sample_rate;
   float *audio_buf;
   int audio_buf_size;
   buzzer_audio_ready_cb buffer_ready_cb;
} buzzer_desc_t;

void buzzer_init(buzzer_t *buz, buzzer_desc_t *desc) {
   buz->cpu_clock = desc->cpu_clock;
   buz->sample_rate = desc->sample_rate;
   buz->audio_buf = desc->audio_buf;
   buz->audio_buf_size = desc->audio_buf_size;
   buz->buffer_ready_cb = desc->buffer_ready_cb;
   buz->ticks_per_sample = ((double)(buz->cpu_clock / buz->sample_rate));
   buz->ptr = 0;
   buz->tick_counter = 0;
   buz->last_sample = 0;
}

void buzzer_ticks(buzzer_t *buz, int ticks, float sample) {
   for(int t=0; t<ticks; t++) {
      buz->tick_counter++;
      if(buz->tick_counter > buz->ticks_per_sample) {
         buz->tick_counter -= buz->ticks_per_sample;
         // high pass filter

         buz->last_sample = buz->last_sample * 0.8 + sample * 0.2;
         buz->audio_buf[buz->ptr++] = sample - buz->last_sample;

         //buz->audio_buf[buz->ptr++] = sample * buz->last_sample;
         if(buz->ptr == buz->audio_buf_size) {
            buz->ptr = 0;
            buz->buffer_ready_cb(buz->audio_buf, buz->audio_buf_size);
         }
      }
   }
}
