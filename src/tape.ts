export function fix_cassette_port(samples: number[], samplerate: number) {
   let last_raising_edge = 0;
   let num_above = 0;
   let inverted = false;

   for(let t=1; t<samples.length-1; t++) {
      if(samples[t-1] <=0 && samples[t]>0) {
         let current_raising_edge = t;
         let pulse_length = current_raising_edge - last_raising_edge;
         let pulse_frequency = samplerate / pulse_length;
         last_raising_edge = current_raising_edge;

         if(pulse_frequency > 2000) {
            num_above++;
            if(num_above > 4) {
               inverted = true;                           
            }
         }
         else {
            num_above = 0;
            inverted = false;
         }
      }
      if(inverted) samples[t-1] = -samples[t-1];
   }
}
