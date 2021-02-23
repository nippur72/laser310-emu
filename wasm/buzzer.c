#include <emscripten/emscripten.h>

#define BUZZER_AUDIO_BUFSIZE     4096
#define CYCLES_PER_SAMPLE        ((double)(CPU_CLOCK / SAMPLE_RATE))

float buzzer_audio_buf[BUZZER_AUDIO_BUFSIZE];
int buzzer_audio_buf_ptr = 0;

double buzzer_tick_counter = 0;

extern byte speaker_B;
extern byte speaker_A;
extern byte cassette_out;
extern byte cassette_out_MSB;
extern byte cassette_in;

EMSCRIPTEN_KEEPALIVE
void buzzer_ticks(int ticks) {
   for(int t=0; t<ticks; t++) {
      buzzer_tick_counter++;
      if(buzzer_tick_counter > CYCLES_PER_SAMPLE) {
         buzzer_tick_counter -= CYCLES_PER_SAMPLE;
         float sample = ((cassette_out + cassette_out_MSB + cassette_in) / 4.0) + ((speaker_A - speaker_B) / 4.0);
         buzzer_audio_buf[buzzer_audio_buf_ptr] = sample;
         buzzer_audio_buf_ptr++;
         if(buzzer_audio_buf_ptr == BUZZER_AUDIO_BUFSIZE) {
            buzzer_audio_buf_ptr = 0;
            uint8_t risp = (uint8_t) EM_ASM_INT({ return ay38910_audio_buf_ready($0, $1); }, buzzer_audio_buf, BUZZER_AUDIO_BUFSIZE);
         }
      }
   }
}
