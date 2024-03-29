// paste fake basic program
(function() {
   let c=0;
   let s="";

   for(let t=1;t<300;t++) {
      s+=`${t} A=A+${t}\r`;
      c+=t;
   }
   s+="9999 PRINT A\rRUN\r";
   pasteLine(s);
   console.log(c);
})();



// prova di lettura dal psg port B
(function() {
   let PORT_A_WR = 1<<6;
   let PORT_B_WR = 1<<7;
   let PORT_A_RD = 0;
   let PORT_B_RD = 0;
   let r;

   psg_init();
   psg_reset();

   psg_write(0x40, 7);
   console.log(psg_query_addr());

   psg_write(0x41, PORT_A_WR|PORT_B_RD);
   console.log(psg_query_reg(7));

   /*
   psg_write(0x40, 15);
   console.log(psg_query_addr());

   let x = psg_read(0x40);
   console.log(x);
   */

   psg_write(0x40, 14);
   console.log(psg_query_addr());

   psg_write(0x41, 77);
   console.log(psg_query_addr());
})();


// topaz font
for(let t=0;t<topaz.length/2;t++) rom[0x4383+t] = topaz[t*2];

// laser 500 fonts
(function() {
   function reverse(b) {
      b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
      b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
      b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
      return b;
   }
   for(let t=33*8;t<127*8;t++) rom[0x4383+t] = reverse(charset_laser500[(256*8)*4+t]);
})();



paste(`
0 PRINT CHR$(159.5+RND(1));:GOTO
`)

paste(`
90 print "wait..."
100 dim f(32)
110 for i=0 to 31
120 x=440*2^((i-12)/12)
140 f(i)=4096-(115206.1875/x)
150 next
160 cls
161 print "*** laser310 Piano ***"
162 print
163 print "by Antonino Porcino, 2020"
164 print:print
165 print "  2 3   5 6 7   9 0
166 print " Q W E R T Y U I O P
167 print
168 print "  S D   G H J
169 print " Z X C V B N M
174 volume 1,15
175 a$="zsxdcvgbhnjmq2w3er5t6y7ui9o0p"
180 x=inkey(10):if x=0 then 180
190 x=instr(a$,chr$(x))
200 if x=0 then 180
210 sound 1,f(x),50
220 goto 180
`)

(function (){
   debugBefore = ()=>
   {
      let state = cpu.getState();
      if(state.pc == 0x2982 && (state.a != 191 && state.a !=183)) console.log(`a=${state.a}`);
   }
})();

paste(`
10 volume 1,15
20 for t=4001 to 4095 step 2
25 print t
30 sound 1,t,20:pause 20
40 next
`)

paste(`
100 input x
110 f = 4096-(115206.1875/x)
120 print f
130 volume 1,15
140 sound 1,f,200
`)


paste(`
10 volume 1,15
20 sound 1,rnd(1)*4095,10
30 pause 10
40 goto 20
`)

paste(`
10 volume 1,15
20 sound 4,10:sound 4,0
30 if sstat(7)<>191 then print sstat(7)
40 goto 20
`)

debugBefore = function() {
   let pc = get_z80_pc();
   if(pc == 0x889c || pc == 0x88a4) {
      console.log(hex(pc,4));
   }
}
sys_set_debug(1);


// interrupt rate
(function() {
   let ticks = 0;
   let last_interrupt = 0;
   let average = 20;
   debugBefore = function() {
      let pc = get_z80_pc();
      if(pc == 0x0038) {
         let now = performance.now();
         let time = now - last_interrupt;
         last_interrupt = now;
         if(time > 1 && time < 50) average = average * 0.995 + time * 0.005;
         ticks++;
         if(ticks%50==0) console.log(Math.round(average*10)/10, Math.round((1000/average)*10)/10);
      }
   }
   sys_set_debug(1);
})();

// load a file demo file
// file:///C:/Users/Nino1/Desktop/USB/GitHub/laser310-emu/index.html?load=http://www.vz200.org/bushy/software/games-binary/INVADERS_JS.VZ


// debugs out (0x0d),a 
function printerWrite(byte) {
   console.log(hex(get_z80_pc(),4));
}


// counts ticks elapsed
let last_tick = 0;
debugBefore = function() {
   let pc = get_z80_pc();
   if(pc == 0x7b49) {
      let nticks = sys_total_cycles() - last_tick;
      last_tick = sys_total_cycles();
      console.log(nticks);
   }
}
sys_set_debug(1);


// pack generic binary into VZ file
(async function () {
   let name = "_fancy-asm-DEMO.BIN";
   let bytes = await storage.readFile(name);
   let VZ = packvz(name, VZ_BINARY, 16384, bytes);
   downloadBytes(`${name}.VZ`, VZ);
})();

(function() {
   let round = 0;

   let text = [
 // 0123456789012345678901234567890123456789012345678901234567890123

   "                                                                ",
   "  AAAAAAAAA  CCCCCCCCC  BBBBBBBBB  DDDDDDDDD   EEE   XXXXXXXXX  ",
   "  AAAAAAAAA  CCCCCCCCC  BBBBBBBBB  DDDDDDDDD   EEE   XXXXXXXXX  ",
   "  AAAAAAAAA  CCCCCCCCC  BBBBBBBBB  DDDDDDDDD   EEE   XXXXXXXXX  ",
   "     AAA           CCC     BBB     DDD   DDD         XXX        ",
   "     AAA        CCCCCC     BBB     DDDDDDDDD   EEE   XXXXXXXXX  ",
   "     AAA        CCCCCC     BBB     DDDDDDDDD   EEE   XXXXXXXXX  ",
   "     AAA        CCCCCC     BBB     DDDDDDDD    EEE   XXXXXXXXX  ",
   "     AAA           CCC     BBB     DDD   DDD   EEE         XXX  ",
   "     AAA     CCCCCCCCC     BBB     DDD   DDD   EEE   XXXXXXXXX  ",
   "     AAA     CCCCCCCCC     BBB     DDD   DDD   EEE   XXXXXXXXX  ",
   "     AAA     CCCCCCCCC     BBB     DDD   DDD   EEE   XXXXXXXXX  ",
   "                                                                ",
   "                                                                ",

   ];

   function point(x,y) {
      if(y>=text.length) return false;
      if(x>=text[y].length) return false;
      let ch = text[y].charAt(x);
      return ch;
   }

   function pset(x,y,ch) {
      let xx = x >> 1;
      let yy = y >> 1;
      let addr = 0x7000 + yy * 32 + xx;

      let byte = mem_read(addr);
      let range;

      if(ch == 'A') range = 128+16*((round+0)%6);
      if(ch == 'C') range = 128+16*((round+1)%6);
      if(ch == 'B') range = 128+16*((round+2)%6);
      if(ch == 'D') range = 128+16*((round+3)%6);
      if(ch == 'E') range = 128+16*((round+4)%6);
      if(ch == 'X') range = 128+16*((round+5)%6);

      if(byte < range || byte >= range+16) byte = range;

      if((x % 2 == 1) && (y % 2 == 1)) byte |= 1;
      if((x % 2 == 0) && (y % 2 == 1)) byte |= 2;
      if((x % 2 == 1) && (y % 2 == 0)) byte |= 4;
      if((x % 2 == 0) && (y % 2 == 0)) byte |= 8;

      mem_write(addr, byte);
   }

   for(round=0;round<6;round++) {
      for(let t=0x7000;t<0x7000+512;t++) mem_write(t,128);
      for(let y=0;y<32;y++) {
         for(let x=0;x<64;x++) {
            let ch = point(x,y)
            if(ch != " ") pset(x,y,ch);
         }
      }

      let dump = [];
      for(let t=0x7000;t<0x7000+32*6;t++) {
         let c = mem_read(t);
         dump.push("0x"+hex(c));
         dump.push(",");
      }
      console.log(`${dump.join("")}`);
   }

})();

/*
void test_sounds() {
   int d;
   while(1) {
      scanf("%d",&d);
      switch(d) {
         case 0: bit_fx(0); break;
         case 1: bit_fx(1); break;
         case 2: bit_fx(2); break;
         case 3: bit_fx(3); break;
         case 4: bit_fx(4); break;
         case 5: bit_fx(5); break;
         case 6: bit_fx(6); break;
         case 7: bit_fx(7); break;

         case 20: bit_fx2(0); break;
         case 21: bit_fx2(1); break;
         case 22: bit_fx2(2); break;
         case 23: bit_fx2(3); break;
         case 24: bit_fx2(4); break;
         case 25: bit_fx2(5); break;
         case 26: bit_fx2(6); break;
         case 27: bit_fx2(7); break;

         case 30: bit_fx3(0); break;
         case 31: bit_fx3(1); break;
         case 32: bit_fx3(2); break;
         case 33: bit_fx3(3); break;
         case 34: bit_fx3(4); break;
         case 35: bit_fx3(5); break;
         case 36: bit_fx3(6); break;
         case 37: bit_fx3(7); break;

         case 40: bit_fx4(0); break;
         case 41: bit_fx4(1); break;
         case 42: bit_fx4(2); break;
         case 43: bit_fx4(3); break;
         case 44: bit_fx4(4); break;
         case 45: bit_fx4(5); break;
         case 46: bit_fx4(6); break;
         case 47: bit_fx4(7); break;
      }
   }
}
*/


for(let t=0;t<256;t++) {
   if((t & 0xF0) == 0x20) {
      console.log(hex(t));
   }
}

/*
paste(`
10 PRINT "*** HELLO THIS IS A TEST"
20 GOTO 10
30 REM THIS IS A TEST
40 REM OF PASTING TEXT
50 REM INTO EMULATOR
60 REM BLAH BLAH BLAH
70 REM BLAH BLAH BLAH
80 REM BLAH BLAH BLAH
90 REM BLAH BLAH BLAH
91 REM BLAH BLAH BLAH
92 REM BLAH BLAH BLAH
93 REM BLAH BLAH BLAH
94 REM BLAH BLAH BLAH
RUN
`)
*/

// debug turbo tape bits
(function() {
   let acc = new Uint8Array(255).fill(0);
   let acc0 = new Uint8Array(255).fill(0);

   let time_acc = 0;

   let tail = false;
   let bit_n = 0;

   const label_set_threshold = 0x97d2;
   const label_loop_file = 0x97a5;
   const label_autorun = 0x9773;

   debugBefore = function() {
      
      let pc = laser310.get_z80_pc();

      if(pc == label_loop_file && !tail) {
         tail = true;
         console.log("start of body");
      }

      if(tail && pc === label_set_threshold) {      
         let a = laser310.get_z80_a();
         time_acc++;
         if(bit_n == 0) acc0[a]++;
         else acc[a]++; 
         console.log(`${hex(pc,4)}: A=${a} ${time_acc} ${bit_n}`);  
         bit_n = (bit_n + 1) % 8;
      }

      if(tail && pc === label_autorun) {         
         pacc();
         pacc8();         
      }
   }
   debugAfter = ()=>{};
   laser310.sys_set_debug(1);
   function average_peak(acc,start,end) {
      let sum = 0;
      let vals = 0;
      for(let t=start;t<=end;t++) {
         sum += acc[t]*t;
         vals += acc[t];         
      }
      let average = sum / vals;
      console.log(`average: ${average} (${start}-${end})`);
   }

   function stat(acc, msg) {
      console.log(msg);
      let min_index = acc.findIndex(e=>e!=0);
      let max_index = acc.findLastIndex(e=>e!=0);
      let middle = Math.round((max_index + min_index) / 2);
      for(let i=min_index;i<=max_index;i++) console.log(`${i}: ${acc[i]}`);
      average_peak(acc, min_index, middle);
      average_peak(acc, middle, max_index);

   }
   function pacc() {
      stat(acc, "bit 1-7");
   }   
   function pacc8() {
      stat(acc0, "bit 0");
   }
})();
