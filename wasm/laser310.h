#include "utils.h"

#include "buzzer.h"

typedef struct {
    byte cassette_in;      // bit 7 input latch, D6-D0 are keyboard
    byte speaker_B;        // bit 5 output latch
    byte vdc_background;   // bit 4 output latch
    byte vdc_mode;         // bit 3 output latch
    byte cassette_out;     // bit 2 output latch
    byte cassette_out_MSB; // bit 1 output latch
    byte speaker_A;        // bit 0 output latch

    int cpu_clock;
    float *audio_buf;
    int audio_buf_size;
    buzzer_t buzzer;
} laser310_t;

typedef struct {
    int cpu_clock;
    int sample_rate;
    float *audio_buf;
    int audio_buf_size;
    buzzer_audio_ready_cb buffer_ready_cb;
} laser310_desc_t;

void laser310_init(laser310_t *sys, laser310_desc_t *desc) {
   sys->cpu_clock = desc->cpu_clock;

   buzzer_desc_t buzdesc;
   buzdesc.audio_buf = desc->audio_buf;
   buzdesc.audio_buf_size = desc->audio_buf_size;
   buzdesc.cpu_clock = sys->cpu_clock;
   buzdesc.sample_rate = desc->sample_rate;

   buzdesc.buffer_ready_cb = desc->buffer_ready_cb;

   buzzer_init(&sys->buzzer, &buzdesc);
}

