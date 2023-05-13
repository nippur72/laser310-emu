const fs = require('fs');

function hex(value) {
   return "0x" + (value<=0xF ? "0":"") + value.toString(16);
}

function makeFile(filename, buffer, varname) {

   let s = `// '${filename}' \r\n\r\n`;

   s += `export const ${varname} = new Uint8Array([\n   `;

   for(let i=0; i<buffer.length; i++)
   {
      let value = i < buffer.length ? buffer[i] : 0xFF;
      const comma = (i != 32768-1) ? ',':'';
      const cr = (i % 16 == 15) ? '\n   ' : '';
      s += `${hex(value)}${comma}${cr}`;
   }

   s+="]);";

   return s;
}

let filename = process.argv.length >= 3 ? process.argv[2] : "laser310-firmware-r314.rom";
let outname = process.argv.length >= 3 ? process.argv[3] : "rom";

let buffer = fs.readFileSync(filename);

if(false) {
   //let rompatched = patch_charset(buffer, 0x44AD);
   let rompatched = patch_charset(buffer, 0x4487);
   fs.writeFileSync("rom_patched.rom", new Uint8Array(rompatched));
   buffer = rompatched;
}

let outfile = makeFile(filename, buffer, outname);

fs.writeFileSync(`${outname}.js`, outfile);

//*************************************************************************************/

// patch laser500 charset rom
function patch_charset(romsource, start)
{
   function reverse(b) {
      b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
      b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
      b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
      return b;
   }

   let charset_laser500 = fs.readFileSync("../laser-related/laser500emu/charset.rom");

   let CHRST88 = start;  // charset start address in ROM, taken from rom.lst

   let romdest = [];
   romsource.forEach(e=>romdest.push(e));

   for(let t=33*8;t<127*8;t++) {
      romdest[CHRST88+t] = reverse(charset_laser500[(256*8)*4+t]);
   }

   return romdest;
}
